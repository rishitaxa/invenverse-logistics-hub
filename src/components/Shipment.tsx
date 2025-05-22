
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Search, FileText } from "lucide-react";

// Mock shipment data
const inboundShipments = [
  {
    id: "IN-2023-001",
    supplier: "TechSupplies Inc.",
    expected: "2023-05-20",
    status: "Scheduled",
    items: 24,
    priority: "Medium",
  },
  {
    id: "IN-2023-002",
    supplier: "Global Gadgets",
    expected: "2023-05-18",
    status: "In Transit",
    items: 15,
    priority: "High",
  },
  {
    id: "IN-2023-003",
    supplier: "Office Solutions",
    expected: "2023-05-25",
    status: "Scheduled",
    items: 32,
    priority: "Low",
  },
  {
    id: "IN-2023-004",
    supplier: "Electronics Depot",
    expected: "2023-05-17",
    status: "Arrived",
    items: 18,
    priority: "Medium",
  },
  {
    id: "IN-2023-005",
    supplier: "Furniture Plus",
    expected: "2023-05-19",
    status: "In Transit",
    items: 7,
    priority: "High",
  },
];

const outboundShipments = [
  {
    id: "OUT-2023-001",
    customer: "City Electronics",
    scheduled: "2023-05-20",
    status: "Processing",
    items: 14,
    priority: "Medium",
  },
  {
    id: "OUT-2023-002",
    customer: "Office Depot",
    scheduled: "2023-05-18",
    status: "Ready for Pickup",
    items: 23,
    priority: "High",
  },
  {
    id: "OUT-2023-003",
    customer: "Tech Retailers Ltd.",
    scheduled: "2023-05-16",
    status: "Shipped",
    items: 8,
    priority: "Medium",
  },
  {
    id: "OUT-2023-004",
    customer: "Global Distributors",
    scheduled: "2023-05-22",
    status: "Processing",
    items: 32,
    priority: "Low",
  },
  {
    id: "OUT-2023-005",
    customer: "Retail Chain Inc.",
    scheduled: "2023-05-17",
    status: "Ready for Pickup",
    items: 19,
    priority: "High",
  },
];

const Shipment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("inbound");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status === "All" ? null : status);
  };

  const filteredInbound = inboundShipments.filter((shipment) => {
    const matchesSearch =
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || shipment.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredOutbound = outboundShipments.filter((shipment) => {
    const matchesSearch =
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || shipment.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleProcessShipment = (id: string, type: "inbound" | "outbound") => {
    toast.success(`Processing ${type} shipment ${id}`);
  };

  const handlePrintDocuments = (id: string) => {
    toast.success(`Preparing documents for shipment ${id}`);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Shipment Management</h2>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <Tabs defaultValue="inbound" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inbound">Inbound Shipments</TabsTrigger>
            <TabsTrigger value="outbound">Outbound Shipments</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex space-x-2">
              <Button 
                variant={!selectedStatus ? "secondary" : "outline"} 
                onClick={() => handleStatusChange("All")} 
                size="sm"
              >
                All
              </Button>
              {activeTab === "inbound" ? (
                <>
                  <Button 
                    variant={selectedStatus === "Scheduled" ? "secondary" : "outline"} 
                    onClick={() => handleStatusChange("Scheduled")} 
                    size="sm"
                  >
                    Scheduled
                  </Button>
                  <Button 
                    variant={selectedStatus === "In Transit" ? "secondary" : "outline"} 
                    onClick={() => handleStatusChange("In Transit")} 
                    size="sm"
                  >
                    In Transit
                  </Button>
                  <Button 
                    variant={selectedStatus === "Arrived" ? "secondary" : "outline"} 
                    onClick={() => handleStatusChange("Arrived")} 
                    size="sm"
                  >
                    Arrived
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant={selectedStatus === "Processing" ? "secondary" : "outline"} 
                    onClick={() => handleStatusChange("Processing")} 
                    size="sm"
                  >
                    Processing
                  </Button>
                  <Button 
                    variant={selectedStatus === "Ready for Pickup" ? "secondary" : "outline"} 
                    onClick={() => handleStatusChange("Ready for Pickup")} 
                    size="sm"
                  >
                    Ready
                  </Button>
                  <Button 
                    variant={selectedStatus === "Shipped" ? "secondary" : "outline"} 
                    onClick={() => handleStatusChange("Shipped")} 
                    size="sm"
                  >
                    Shipped
                  </Button>
                </>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search ${activeTab} shipments...`}
                className="w-full pl-8 md:w-[250px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="inbound">
            <Card>
              <CardHeader>
                <CardTitle>Inbound Shipments</CardTitle>
                <CardDescription>
                  Manage incoming deliveries from suppliers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Expected Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInbound.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">{shipment.id}</TableCell>
                        <TableCell>{shipment.supplier}</TableCell>
                        <TableCell>{shipment.expected}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              shipment.status === "Arrived"
                                ? "bg-green-100 text-green-800"
                                : shipment.status === "In Transit"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {shipment.status}
                          </span>
                        </TableCell>
                        <TableCell>{shipment.items}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              shipment.priority === "High"
                                ? "bg-red-100 text-red-800"
                                : shipment.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {shipment.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleProcessShipment(shipment.id, "inbound")}
                            >
                              Process
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handlePrintDocuments(shipment.id)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Previous</Button>
                <Button>Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="outbound">
            <Card>
              <CardHeader>
                <CardTitle>Outbound Shipments</CardTitle>
                <CardDescription>
                  Manage outgoing deliveries to customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOutbound.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">{shipment.id}</TableCell>
                        <TableCell>{shipment.customer}</TableCell>
                        <TableCell>{shipment.scheduled}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              shipment.status === "Shipped"
                                ? "bg-green-100 text-green-800"
                                : shipment.status === "Ready for Pickup"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {shipment.status}
                          </span>
                        </TableCell>
                        <TableCell>{shipment.items}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              shipment.priority === "High"
                                ? "bg-red-100 text-red-800"
                                : shipment.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {shipment.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleProcessShipment(shipment.id, "outbound")}
                            >
                              Process
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handlePrintDocuments(shipment.id)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Previous</Button>
                <Button>Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Shipment;
