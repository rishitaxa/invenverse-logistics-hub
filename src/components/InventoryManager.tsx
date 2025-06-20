
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { Plus, Trash2, Package, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  price: number;
  zone_id?: string;
}

interface WarehouseZone {
  id: string;
  zone_id: string;
  capacity: number;
  utilization: number;
  status: string;
}

const InventoryManager = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouseZones, setWarehouseZones] = useState<WarehouseZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, productId: string | null}>({
    open: false,
    productId: null
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    quantity: 0,
    location: "",
    price: 0,
    zone_id: ""
  });

  // Fetch data from Supabase
  const fetchData = async () => {
    if (!user) return;
    
    try {
      console.log('Fetching data for user:', user.id);
      
      const [productsResult, zonesResult] = await Promise.all([
        supabase.from('products').select('*').eq('user_id', user.id),
        supabase.from('warehouse_zones').select('*').eq('user_id', user.id)
      ]);

      console.log('Products result:', productsResult);
      console.log('Zones result:', zonesResult);

      if (productsResult.error) {
        console.error('Error fetching products:', productsResult.error);
        toast.error('Failed to load products');
      } else if (productsResult.data) {
        setProducts(productsResult.data);
        console.log('Loaded products:', productsResult.data.length);
      }

      if (zonesResult.error) {
        console.error('Error fetching zones:', zonesResult.error);
        toast.error('Failed to load warehouse zones');
      } else if (zonesResult.data) {
        setWarehouseZones(zonesResult.data);
        console.log('Loaded zones:', zonesResult.data.length);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const addProduct = async () => {
    if (!user || !newProduct.name || !newProduct.category || !newProduct.location || !newProduct.zone_id) {
      toast.error("Please fill all product fields including zone selection");
      return;
    }

    // Find the selected zone
    const selectedZone = warehouseZones.find(zone => zone.zone_id === newProduct.zone_id);
    if (!selectedZone) {
      toast.error("Please select a valid warehouse zone");
      return;
    }

    // Check if zone has enough capacity
    const requiredSpace = newProduct.quantity;
    const availableSpace = selectedZone.capacity - selectedZone.utilization;
    
    if (requiredSpace > availableSpace) {
      toast.error(`Not enough space in Zone ${newProduct.zone_id}. Available: ${availableSpace}, Required: ${requiredSpace}`);
      return;
    }

    try {
      console.log('Adding product:', newProduct);
      
      // Add product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([{
          user_id: user.id,
          ...newProduct
        }])
        .select()
        .single();

      if (productError) {
        console.error('Error adding product:', productError);
        throw productError;
      }

      // Update zone utilization
      const newUtilization = selectedZone.utilization + requiredSpace;
      const { error: zoneError } = await supabase
        .from('warehouse_zones')
        .update({ 
          utilization: newUtilization,
          status: newUtilization > selectedZone.capacity * 0.8 ? 'High' : 'Optimal'
        })
        .eq('id', selectedZone.id);

      if (zoneError) {
        console.error('Error updating zone:', zoneError);
        throw zoneError;
      }

      setProducts([...products, productData]);
      
      // Update local zone data
      setWarehouseZones(zones => 
        zones.map(zone => 
          zone.id === selectedZone.id 
            ? { ...zone, utilization: newUtilization, status: newUtilization > zone.capacity * 0.8 ? 'High' : 'Optimal' }
            : zone
        )
      );

      setNewProduct({ name: "", category: "", quantity: 0, location: "", price: 0, zone_id: "" });
      toast.success(`Product added to Zone ${newProduct.zone_id} successfully!`);
      
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error("Failed to add product");
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const productToDelete = products.find(p => p.id === productId);
      if (!productToDelete) return;

      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;

      // Update zone utilization if product was in a zone
      if (productToDelete.zone_id) {
        const zone = warehouseZones.find(z => z.zone_id === productToDelete.zone_id);
        if (zone) {
          const newUtilization = Math.max(0, zone.utilization - productToDelete.quantity);
          await supabase
            .from('warehouse_zones')
            .update({ 
              utilization: newUtilization,
              status: newUtilization > zone.capacity * 0.8 ? 'High' : 'Optimal'
            })
            .eq('id', zone.id);

          // Update local zone data
          setWarehouseZones(zones => 
            zones.map(z => 
              z.id === zone.id 
                ? { ...z, utilization: newUtilization, status: newUtilization > z.capacity * 0.8 ? 'High' : 'Optimal' }
                : z
            )
          );
        }
      }

      setProducts(products.filter(p => p.id !== productId));
      setDeleteDialog({open: false, productId: null});
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading inventory...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Package className="h-8 w-8" />
        <h2 className="text-3xl font-bold">Inventory Management</h2>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="zones">Warehouse Zones</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Product Name</Label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    placeholder="Enter category"
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({...newProduct, quantity: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={newProduct.location}
                    onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                    placeholder="e.g., A-101"
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Warehouse Zone *</Label>
                  <Select value={newProduct.zone_id} onValueChange={(value) => setNewProduct({...newProduct, zone_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouseZones.map((zone) => {
                        const availableSpace = zone.capacity - zone.utilization;
                        return (
                          <SelectItem key={zone.zone_id} value={zone.zone_id}>
                            Zone {zone.zone_id} (Available: {availableSpace}/{zone.capacity})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={addProduct} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Products ({products.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <span className="font-semibold">{product.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {product.category} | Qty: {product.quantity} | {product.location} | ${product.price}
                        {product.zone_id && ` | Zone: ${product.zone_id}`}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteDialog({open: true, productId: product.id})}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No products yet. Add your first product above!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Zones Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {warehouseZones.map((zone) => {
                  const utilizationPercentage = (zone.utilization / zone.capacity) * 100;
                  return (
                    <Card key={zone.id} className="border">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Zone {zone.zone_id}</h3>
                          <div className={`px-2 py-1 rounded text-xs ${
                            zone.status === 'High' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {zone.status}
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="text-sm text-muted-foreground">
                            Utilization: {zone.utilization}/{zone.capacity}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                utilizationPercentage > 80 ? 'bg-red-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {utilizationPercentage.toFixed(1)}% utilized
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({open, productId: null})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({open: false, productId: null})}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteDialog.productId && deleteProduct(deleteDialog.productId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManager;
