
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { Plus, Trash2, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  status: string;
  priority: string;
  created_at: string;
}

interface Shipment {
  id: string;
  shipment_number: string;
  type: "inbound" | "outbound";
  status: string;
  supplier?: string | null;
  customer?: string | null;
  created_at: string;
}

const UserControlPanel = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: "", category: "", quantity: 0, location: "", price: 0
  });

  const [newOrder, setNewOrder] = useState({
    customer_name: "", status: "Processing", priority: "Medium"
  });

  const [newShipment, setNewShipment] = useState({
    type: "inbound" as "inbound" | "outbound",
    status: "Scheduled",
    supplier: "",
    customer: ""
  });

  // Fetch data from Supabase
  const fetchData = async () => {
    if (!user) return;
    
    try {
      const [productsResult, ordersResult, shipmentsResult] = await Promise.all([
        supabase.from('products').select('*').eq('user_id', user.id),
        supabase.from('orders').select('*').eq('user_id', user.id),
        supabase.from('shipments').select('*').eq('user_id', user.id)
      ]);

      if (productsResult.data) setProducts(productsResult.data);
      if (ordersResult.data) setOrders(ordersResult.data);
      if (shipmentsResult.data) {
        // Type the shipments data properly
        const typedShipments: Shipment[] = shipmentsResult.data.map(shipment => ({
          ...shipment,
          type: shipment.type as "inbound" | "outbound"
        }));
        setShipments(typedShipments);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const addProduct = async () => {
    if (!user || !newProduct.name || !newProduct.category || !newProduct.location) {
      toast.error("Please fill all product fields");
      return;
    }

    try {
      const { data, error } = await supabase.from('products').insert([{
        user_id: user.id,
        ...newProduct
      }]).select().single();

      if (error) throw error;

      setProducts([...products, data]);
      setNewProduct({ name: "", category: "", quantity: 0, location: "", price: 0 });
      toast.success("Product added successfully!");
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error("Failed to add product");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Failed to delete product");
    }
  };

  const addOrder = async () => {
    if (!user || !newOrder.customer_name) {
      toast.error("Please enter customer name");
      return;
    }

    try {
      const orderNumber = `ORD-${Date.now()}`;
      const { data, error } = await supabase.from('orders').insert([{
        user_id: user.id,
        order_number: orderNumber,
        ...newOrder
      }]).select().single();

      if (error) throw error;

      setOrders([...orders, data]);
      setNewOrder({ customer_name: "", status: "Processing", priority: "Medium" });
      toast.success("Order created successfully!");
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Failed to create order");
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;

      setOrders(orders.filter(o => o.id !== id));
      toast.success("Order deleted successfully!");
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error("Failed to delete order");
    }
  };

  const addShipment = async () => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const shipmentNumber = `SHIP-${Date.now()}`;
      const { data, error } = await supabase.from('shipments').insert([{
        user_id: user.id,
        shipment_number: shipmentNumber,
        ...newShipment
      }]).select().single();

      if (error) throw error;

      const typedShipment: Shipment = {
        ...data,
        type: data.type as "inbound" | "outbound"
      };

      setShipments([...shipments, typedShipment]);
      setNewShipment({ type: "inbound", status: "Scheduled", supplier: "", customer: "" });
      toast.success("Shipment created successfully!");
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error("Failed to create shipment");
    }
  };

  const deleteShipment = async (id: string) => {
    try {
      const { error } = await supabase.from('shipments').delete().eq('id', id);
      if (error) throw error;

      setShipments(shipments.filter(s => s.id !== id));
      toast.success("Shipment deleted successfully!");
    } catch (error) {
      console.error('Error deleting shipment:', error);
      toast.error("Failed to delete shipment");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-8 w-8" />
        <h2 className="text-3xl font-bold">User Control Panel</h2>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
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
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteProduct(product.id)}
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

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name</Label>
                  <Input
                    value={newOrder.customer_name}
                    onChange={(e) => setNewOrder({...newOrder, customer_name: e.target.value})}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={newOrder.priority} onValueChange={(value) => setNewOrder({...newOrder, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={addOrder} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Orders ({orders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {orders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <span className="font-semibold">{order.order_number}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {order.customer_name} | {order.status} | {order.priority}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteOrder(order.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No orders yet. Create your first order above!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Shipment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select value={newShipment.type} onValueChange={(value: "inbound" | "outbound") => setNewShipment({...newShipment, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inbound">Inbound</SelectItem>
                      <SelectItem value="outbound">Outbound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={newShipment.status} onValueChange={(value) => setNewShipment({...newShipment, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Arrived">Arrived</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newShipment.type === "inbound" ? (
                  <div>
                    <Label>Supplier</Label>
                    <Input
                      value={newShipment.supplier}
                      onChange={(e) => setNewShipment({...newShipment, supplier: e.target.value})}
                      placeholder="Enter supplier name"
                    />
                  </div>
                ) : (
                  <div>
                    <Label>Customer</Label>
                    <Input
                      value={newShipment.customer}
                      onChange={(e) => setNewShipment({...newShipment, customer: e.target.value})}
                      placeholder="Enter customer name"
                    />
                  </div>
                )}
              </div>
              <Button onClick={addShipment} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Shipment
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Shipments ({shipments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {shipments.map((shipment) => (
                  <div key={shipment.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <span className="font-semibold">{shipment.shipment_number}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {shipment.type} | {shipment.status} | 
                        {shipment.supplier || shipment.customer}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteShipment(shipment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {shipments.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No shipments yet. Create your first shipment above!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserControlPanel;
