
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Search, Plus, Filter, FileText } from "lucide-react";
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

// Mock inventory data
const initialInventory = [
  {
    id: "INV-001",
    name: "Wireless Headphones",
    category: "Electronics",
    quantity: 156,
    location: "A-101",
    status: "In Stock",
  },
  {
    id: "INV-002",
    name: "Ergonomic Chair",
    category: "Furniture",
    quantity: 42,
    location: "B-205",
    status: "Low Stock",
  },
  {
    id: "INV-003",
    name: "Smart Watch",
    category: "Electronics",
    quantity: 89,
    location: "A-102",
    status: "In Stock",
  },
  {
    id: "INV-004",
    name: "Desk Lamp",
    category: "Furniture",
    quantity: 35,
    location: "B-210",
    status: "Low Stock",
  },
  {
    id: "INV-005",
    name: "Bluetooth Speaker",
    category: "Electronics",
    quantity: 120,
    location: "A-103",
    status: "In Stock",
  },
  {
    id: "INV-006",
    name: "Office Desk",
    category: "Furniture",
    quantity: 15,
    location: "C-301",
    status: "Low Stock",
  },
  {
    id: "INV-007",
    name: "Wireless Mouse",
    category: "Electronics",
    quantity: 200,
    location: "A-105",
    status: "In Stock",
  },
  {
    id: "INV-008",
    name: "Bookshelf",
    category: "Furniture",
    quantity: 28,
    location: "C-305",
    status: "In Stock",
  },
];

const Inventory = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // New item form state
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    location: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

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
      toast.error("Please fill in all fields");
      return;
    }

    const newItemObj = {
      id: `INV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: newItem.name,
      category: newItem.category,
      quantity: parseInt(newItem.quantity),
      location: newItem.location,
      status: parseInt(newItem.quantity) < 50 ? "Low Stock" : "In Stock",
    };

    setInventory([...inventory, newItemObj]);
    toast.success(`Added ${newItem.name} to inventory`);
    
    // Reset form
    setNewItem({
      name: "",
      category: "",
      quantity: "",
      location: "",
    });
    
    setDialogOpen(false);
  };

  const handleFilter = (category: string) => {
    setSelectedCategory(category === "All" ? null : category);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Package className="h-8 w-8" />
          Inventory Management
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
      </div>

      <div className="flex space-x-2 mb-4">
        <Button 
          variant={!selectedCategory ? "secondary" : "outline"} 
          onClick={() => handleFilter("All")} 
          size="sm"
        >
          All
        </Button>
        <Button 
          variant={selectedCategory === "Electronics" ? "secondary" : "outline"} 
          onClick={() => handleFilter("Electronics")} 
          size="sm"
        >
          Electronics
        </Button>
        <Button 
          variant={selectedCategory === "Furniture" ? "secondary" : "outline"} 
          onClick={() => handleFilter("Furniture")} 
          size="sm"
        >
          Furniture
        </Button>
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
                <TableHead>Status</TableHead>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
