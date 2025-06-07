
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Plus, Edit, Trash2, Settings, Save } from "lucide-react";

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
  customerName: string;
  products: string[];
  status: string;
  priority: string;
  date: string;
}

interface Shipment {
  id: string;
  type: "inbound" | "outbound";
  items: string[];
  status: string;
  date: string;
  supplier?: string;
  customer?: string;
}

const UserControlPanel = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Widget A", category: "Electronics", quantity: 100, location: "A-101", price: 25.50 },
    { id: "2", name: "Gadget B", category: "Tools", quantity: 50, location: "B-202", price: 45.00 },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: "ORD-001", customerName: "John Doe", products: ["1"], status: "Processing", priority: "High", date: "2024-01-15" },
  ]);

  const [shipments, setShipments] = useState<Shipment[]>([
    { id: "SHIP-001", type: "inbound", items: ["1"], status: "In Transit", date: "2024-01-16", supplier: "Tech Corp" },
  ]);

  const [warehouseConfig, setWarehouseConfig] = useState({
    zones: 8,
    capacity: 10000,
    algorithm: "astar",
    gridSize: 15,
  });

  const [newProduct, setNewProduct] = useState({
    name: "", category: "", quantity: 0, location: "", price: 0
  });

  const [newOrder, setNewOrder] = useState({
    customerName: "", products: [], status: "Processing", priority: "Medium"
  });

  const [newShipment, setNewShipment] = useState({
    type: "inbound" as "inbound" | "outbound",
    items: [],
    status: "Scheduled",
    supplier: "",
    customer: ""
  });

  const addProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.location) {
      toast.error("Please fill all product fields");
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      ...newProduct
    };

    setProducts([...products, product]);
    setNewProduct({ name: "", category: "", quantity: 0, location: "", price: 0 });
    toast.success("Product added successfully!");
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Product deleted successfully!");
  };

  const addOrder = () => {
    if (!newOrder.customerName) {
      toast.error("Please enter customer name");
      return;
    }

    const order: Order = {
      id: `ORD-${Date.now()}`,
      ...newOrder,
      date: new Date().toISOString().split('T')[0]
    };

    setOrders([...orders, order]);
    setNewOrder({ customerName: "", products: [], status: "Processing", priority: "Medium" });
    toast.success("Order created successfully!");
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
    toast.success("Order deleted successfully!");
  };

  const addShipment = () => {
    const shipment: Shipment = {
      id: `SHIP-${Date.now()}`,
      ...newShipment,
      date: new Date().toISOString().split('T')[0]
    };

    setShipments([...shipments, shipment]);
    setNewShipment({ type: "inbound", items: [], status: "Scheduled", supplier: "", customer: "" });
    toast.success("Shipment created successfully!");
  };

  const deleteShipment = (id: string) => {
    setShipments(shipments.filter(s => s.id !== id));
    toast.success("Shipment deleted successfully!");
  };

  const updateWarehouseConfig = () => {
    toast.success("Warehouse configuration updated!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-8 w-8" />
        <h2 className="text-3xl font-bold">User Control Panel</h2>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="warehouse">Warehouse</TabsTrigger>
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
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
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
                      <span className="font-semibold">{order.id}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {order.customerName} | {order.status} | {order.priority} | {order.date}
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
                      <span className="font-semibold">{shipment.id}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {shipment.type} | {shipment.status} | {shipment.date} | 
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Number of Zones</Label>
                  <Input
                    type="number"
                    value={warehouseConfig.zones}
                    onChange={(e) => setWarehouseConfig({...warehouseConfig, zones: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Total Capacity</Label>
                  <Input
                    type="number"
                    value={warehouseConfig.capacity}
                    onChange={(e) => setWarehouseConfig({...warehouseConfig, capacity: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Default Algorithm</Label>
                  <Select value={warehouseConfig.algorithm} onValueChange={(value) => setWarehouseConfig({...warehouseConfig, algorithm: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="astar">A* Algorithm</SelectItem>
                      <SelectItem value="dijkstra">Dijkstra</SelectItem>
                      <SelectItem value="genetic">Genetic Algorithm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Grid Size</Label>
                  <Input
                    type="number"
                    value={warehouseConfig.gridSize}
                    onChange={(e) => setWarehouseConfig({...warehouseConfig, gridSize: Number(e.target.value)})}
                  />
                </div>
              </div>
              <Button onClick={updateWarehouseConfig} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Update Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserControlPanel;
