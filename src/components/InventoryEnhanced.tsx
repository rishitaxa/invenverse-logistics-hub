import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Search, Settings, Database } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { knapsackOptimization, lruCache, hashMapSearch } from "@/utils/algorithms";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  location: string;
  cost: number;
  category: string;
}

const initialInventoryData: InventoryItem[] = [
  { id: "1", name: "Widget A", quantity: 150, location: "A-101", cost: 25.50, category: "Electronics" },
  { id: "2", name: "Gear B", quantity: 200, location: "B-202", cost: 45.00, category: "Tools" },
  { id: "3", name: "Gadget C", quantity: 75, location: "C-303", cost: 75.25, category: "Electronics" },
  { id: "4", name: "Part D", quantity: 300, location: "D-404", cost: 12.75, category: "Parts" },
  { id: "5", name: "Component E", quantity: 120, location: "E-505", cost: 30.00, category: "Electronics" },
  { id: "6", name: "Accessory F", quantity: 90, location: "F-606", cost: 18.50, category: "Accessories" },
  { id: "7", name: "Material G", quantity: 400, location: "G-707", cost: 8.25, category: "Materials" },
  { id: "8", name: "Supply H", quantity: 180, location: "H-808", cost: 22.00, category: "Supplies" },
  { id: "9", name: "Product I", quantity: 60, location: "I-909", cost: 60.00, category: "Products" },
  { id: "10", name: "Item J", quantity: 220, location: "J-1010", cost: 15.50, category: "Miscellaneous" },
];

const InventoryEnhanced = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventoryData);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<InventoryItem[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);

  const handleAddItem = () => {
    if (!newItemName || newItemQuantity <= 0) {
      toast.error("Please enter a valid item name and quantity.");
      return;
    }

    const newItem: InventoryItem = {
      id: String(inventory.length + 1),
      name: newItemName,
      quantity: newItemQuantity,
      location: "To be assigned",
      cost: 0,
      category: "Uncategorized",
    };

    setInventory([...inventory, newItem]);
    setNewItemName("");
    setNewItemQuantity(0);
    toast.success(`${newItemName} added to inventory!`);
  };

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id));
    toast.success("Item deleted successfully.");
  };

  const handleSearch = () => {
    if (!searchQuery) {
      toast.error("Please enter a search query.");
      return;
    }

    // Example: Searching by name
    const results = hashMapSearch(inventory, 'name', searchQuery);
    setSearchResults(results);

    if (results.length === 0) {
      toast.info("No items found matching your search query.");
    } else {
      toast.success(`${results.length} items found!`);
    }
  };

  const handleOptimizeInventory = () => {
    const capacity = 500; // Example capacity
    const optimizationResult = knapsackOptimization(inventory, capacity);

    // In a real application, you would update the inventory based on the optimization result
    console.log("Optimization Result:", optimizationResult);
    setIsOptimized(true);
    toast.success("Inventory optimized using Knapsack Algorithm!");
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Enhanced Inventory Management</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => toast.message("Settings feature coming soon!")}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button>
            <Database className="mr-2 h-4 w-4" />
            Sync Data
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="col-span-2" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={String(newItemQuantity)}
                onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                className="col-span-2"
              />
            </div>
            <Button onClick={handleAddItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search by item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>

          {searchResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Run optimization algorithms to improve inventory management.
          </p>
          <Button className="mt-4" onClick={handleOptimizeInventory} disabled={isOptimized}>
            {isOptimized ? "Optimized!" : "Optimize Inventory"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryEnhanced;
