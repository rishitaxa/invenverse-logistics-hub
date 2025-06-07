
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Search, Plus, Trash2, Database, Algorithm } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { knapsackOptimization, lruCache, hashMapSearch } from "@/utils/algorithms";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  status: string;
  weight?: number;
  value?: number;
  lastAccessed?: Date;
}

const InventoryEnhanced = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [algorithmResults, setAlgorithmResults] = useState<any>(null);
  const [showAlgorithms, setShowAlgorithms] = useState(false);

  // Initialize with sample data
  useEffect(() => {
    const initialData: InventoryItem[] = [
      {
        id: "INV-001",
        name: "Wireless Headphones",
        category: "Electronics",
        quantity: 156,
        location: "A-101",
        status: "In Stock",
        weight: 0.5,
        value: 299,
        lastAccessed: new Date()
      },
      {
        id: "INV-002",
        name: "Ergonomic Chair",
        category: "Furniture", 
        quantity: 42,
        location: "B-205",
        status: "Low Stock",
        weight: 15,
        value: 450,
        lastAccessed: new Date(Date.now() - 86400000)
      },
      {
        id: "INV-003",
        name: "Smart Watch",
        category: "Electronics",
        quantity: 89,
        location: "A-102", 
        status: "In Stock",
        weight: 0.2,
        value: 399,
        lastAccessed: new Date(Date.now() - 172800000)
      },
      {
        id: "INV-004",
        name: "Desk Lamp",
        category: "Furniture",
        quantity: 35,
        location: "B-210",
        status: "Low Stock",
        weight: 2,
        value: 89,
        lastAccessed: new Date(Date.now() - 259200000)
      }
    ];
    setInventory(initialData);
    
    // Initialize LRU cache with items
    initialData.forEach(item => {
      lruCache.get(item.id, item);
    });
  }, []);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    location: "",
    weight: "",
    value: "",
  });

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setNewItem({
      ...newItem,
      category: value,
    });
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.quantity || !newItem.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newItemObj: InventoryItem = {
      id: `INV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: newItem.name,
      category: newItem.category,
      quantity: parseInt(newItem.quantity),
      location: newItem.location,
      status: parseInt(newItem.quantity) < 50 ? "Low Stock" : "In Stock",
      weight: parseFloat(newItem.weight) || 1,
      value: parseFloat(newItem.value) || 100,
      lastAccessed: new Date(),
    };

    setInventory([...inventory, newItemObj]);
    
    // Add to LRU cache
    lruCache.get(newItemObj.id, newItemObj);
    
    toast.success(`Added ${newItem.name} to inventory`);
    
    // Reset form
    setNewItem({
      name: "",
      category: "",
      quantity: "",
      location: "",
      weight: "",
      value: "",
    });
    
    setDialogOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
    toast.success("Item deleted from inventory");
  };

  const runKnapsackOptimization = () => {
    const capacity = 50; // Example capacity constraint
    const items = inventory.map(item => ({
      id: item.id,
      weight: item.weight || 1,
      value: item.value || 100,
      name: item.name
    }));
    
    const result = knapsackOptimization(items, capacity);
    setAlgorithmResults({
      type: "Knapsack",
      result: result,
      description: `Optimized selection of ${result.selectedItems.length} items with total value ${result.totalValue} and weight ${result.totalWeight}/${capacity}`
    });
    setShowAlgorithms(true);
    toast.success("Knapsack optimization completed!");
  };

  const runHashMapSearch = () => {
    if (!searchTerm) {
      toast.error("Please enter a search term first");
      return;
    }
    
    const result = hashMapSearch(inventory, searchTerm);
    setAlgorithmResults({
      type: "HashMap Search",
      result: result,
      description: `Found ${result.length} items matching "${searchTerm}" using hash-based search`
    });
    setShowAlgorithms(true);
    toast.success("HashMap search completed!");
  };

  const showLRUCache = () => {
    const cacheState = lruCache.getState();
    setAlgorithmResults({
      type: "LRU Cache",
      result: cacheState,
      description: `Cache contains ${cacheState.length} recently accessed items`
    });
    setShowAlgorithms(true);
    toast.success("LRU cache state displayed!");
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Package className="h-8 w-8" />
          Enhanced Inventory Management
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search inventory..."
              className="w-full rounded-md pl-8 md:w-[250px] lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={runHashMapSearch} variant="outline" size="sm">
            <Algorithm className="h-4 w-4 mr-1" />
            HashMap Search
          </Button>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
          <TabsTrigger value="sql-operations">SQL Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button 
                variant={!selectedCategory ? "secondary" : "outline"} 
                onClick={() => setSelectedCategory(null)} 
                size="sm"
              >
                All
              </Button>
              <Button 
                variant={selectedCategory === "Electronics" ? "secondary" : "outline"} 
                onClick={() => setSelectedCategory("Electronics")} 
                size="sm"
              >
                Electronics
              </Button>
              <Button 
                variant={selectedCategory === "Furniture" ? "secondary" : "outline"} 
                onClick={() => setSelectedCategory("Furniture")} 
                size="sm"
              >
                Furniture
              </Button>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Inventory Item</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new inventory item below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newItem.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Wireless Headphones"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      onValueChange={handleCategoryChange}
                      value={newItem.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        value={newItem.quantity}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Storage Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={newItem.location}
                        onChange={handleInputChange}
                        placeholder="e.g. A-101"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        step="0.1"
                        value={newItem.weight}
                        onChange={handleInputChange}
                        placeholder="1.0"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="value">Value ($)</Label>
                      <Input
                        id="value"
                        name="value"
                        type="number"
                        value={newItem.value}
                        onChange={handleInputChange}
                        placeholder="100"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem}>Add Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>
                Total of {filteredInventory.length} items {selectedCategory ? `in ${selectedCategory}` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.weight}kg</TableCell>
                      <TableCell>${item.value}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.status === "In Stock"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algorithms" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Knapsack Optimization</CardTitle>
                <CardDescription>Optimize item selection based on weight and value constraints</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={runKnapsackOptimization} className="w-full">
                  Run Knapsack Algorithm
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>LRU Cache</CardTitle>
                <CardDescription>View recently accessed inventory items</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={showLRUCache} className="w-full">
                  Show LRU Cache
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>HashMap Search</CardTitle>
                <CardDescription>Fast search using hash-based indexing</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={runHashMapSearch} className="w-full" disabled={!searchTerm}>
                  Execute HashMap Search
                </Button>
              </CardContent>
            </Card>
          </div>

          {algorithmResults && (
            <Card>
              <CardHeader>
                <CardTitle>{algorithmResults.type} Results</CardTitle>
                <CardDescription>{algorithmResults.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(algorithmResults.result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sql-operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SQL-Like Operations</CardTitle>
              <CardDescription>Perform database-like queries on inventory data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button onClick={() => toast.info("SELECT * FROM inventory WHERE status = 'Low Stock'")}>
                  <Database className="h-4 w-4 mr-2" />
                  Find Low Stock Items
                </Button>
                <Button onClick={() => toast.info("SELECT category, COUNT(*) FROM inventory GROUP BY category")}>
                  <Database className="h-4 w-4 mr-2" />
                  Count by Category
                </Button>
                <Button onClick={() => toast.info("SELECT * FROM inventory ORDER BY value DESC")}>
                  <Database className="h-4 w-4 mr-2" />
                  Sort by Value
                </Button>
                <Button onClick={() => toast.info("SELECT AVG(quantity) FROM inventory")}>
                  <Database className="h-4 w-4 mr-2" />
                  Average Quantity
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryEnhanced;
