
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

// Mock analytics data
const performanceData = [
  { month: "Jan", efficiency: 65, utilization: 78 },
  { month: "Feb", efficiency: 59, utilization: 70 },
  { month: "Mar", efficiency: 80, utilization: 85 },
  { month: "Apr", efficiency: 81, utilization: 84 },
  { month: "May", efficiency: 76, utilization: 87 },
  { month: "Jun", efficiency: 85, utilization: 90 },
];

const inventoryCategories = [
  { name: "Electronics", value: 40, color: "#0088FE" },
  { name: "Furniture", value: 30, color: "#00C49F" },
  { name: "Clothing", value: 15, color: "#FFBB28" },
  { name: "Food", value: 10, color: "#FF8042" },
  { name: "Other", value: 5, color: "#A569BD" },
];

const pickingData = [
  { day: "Mon", manual: 120, assisted: 180 },
  { day: "Tue", manual: 132, assisted: 176 },
  { day: "Wed", manual: 101, assisted: 192 },
  { day: "Thu", manual: 134, assisted: 210 },
  { day: "Fri", manual: 140, assisted: 215 },
];

const shipmentTrends = [
  { month: "Jan", inbound: 42, outbound: 65 },
  { month: "Feb", inbound: 48, outbound: 59 },
  { month: "Mar", inbound: 55, outbound: 75 },
  { month: "Apr", inbound: 61, outbound: 68 },
  { month: "May", inbound: 58, outbound: 72 },
  { month: "Jun", inbound: 65, outbound: 80 },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("6m");
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);

  const handleOptimize = () => {
    setIsRunningAnalysis(true);
    toast.success("Running advanced optimization algorithms...");
    
    // Simulate algorithm processing
    setTimeout(() => {
      setIsRunningAnalysis(false);
      toast.success("Analysis complete! Optimization suggestions ready.");
    }, 2000);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics & Optimization</h2>
        <Select defaultValue="6m" onValueChange={value => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last Month</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Warehouse Performance Metrics</CardTitle>
                <CardDescription>
                  Efficiency and space utilization trends over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="utilization"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Warehouse operational metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Order Accuracy</span>
                      <span>98.7%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                      <div 
                        className="h-2 rounded-full bg-primary" 
                        style={{ width: "98.7%" }} 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">On-time Delivery</span>
                      <span>94.2%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                      <div 
                        className="h-2 rounded-full bg-primary" 
                        style={{ width: "94.2%" }} 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Inventory Accuracy</span>
                      <span>99.1%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                      <div 
                        className="h-2 rounded-full bg-primary" 
                        style={{ width: "99.1%" }} 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Picking Accuracy</span>
                      <span>96.5%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                      <div 
                        className="h-2 rounded-full bg-primary" 
                        style={{ width: "96.5%" }} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>Operational costs breakdown</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Labor", value: 45, color: "#0088FE" },
                        { name: "Storage", value: 20, color: "#00C49F" },
                        { name: "Transportation", value: 25, color: "#FFBB28" },
                        { name: "Utilities", value: 10, color: "#FF8042" },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: "Labor", value: 45, color: "#0088FE" },
                        { name: "Storage", value: 20, color: "#00C49F" },
                        { name: "Transportation", value: 25, color: "#FFBB28" },
                        { name: "Utilities", value: 10, color: "#FF8042" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Distribution</CardTitle>
                <CardDescription>
                  Breakdown by product category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={inventoryCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {inventoryCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Turnover</CardTitle>
                <CardDescription>
                  Monthly turnover rates by category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { category: "Electronics", turnover: 4.2 },
                      { category: "Furniture", turnover: 2.8 },
                      { category: "Clothing", turnover: 6.1 },
                      { category: "Food", turnover: 12.5 },
                      { category: "Other", turnover: 3.4 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="turnover" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Inventory Levels Over Time</CardTitle>
                <CardDescription>
                  Monthly inventory level trends
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { month: "Jan", stock: 12500 },
                      { month: "Feb", stock: 14200 },
                      { month: "Mar", stock: 15800 },
                      { month: "Apr", stock: 13600 },
                      { month: "May", stock: 14900 },
                      { month: "Jun", stock: 16200 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="stock"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Shipment Trends</CardTitle>
                <CardDescription>
                  Inbound vs outbound shipments
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={shipmentTrends}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="inbound" fill="#8884d8" />
                    <Bar dataKey="outbound" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Picking Productivity</CardTitle>
                <CardDescription>
                  Manual vs assisted picking rates
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={pickingData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="manual"
                      stroke="#ff7300"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="assisted"
                      stroke="#387908"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>Current utilization of warehouse resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Staff Utilization</span>
                      <span>87%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                      <div 
                        className="h-2 rounded-full bg-primary" 
                        style={{ width: "87%" }} 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Equipment Usage</span>
                      <span>74%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                      <div 
                        className="h-2 rounded-full bg-primary" 
                        style={{ width: "74%" }} 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Dock Utilization</span>
                      <span>89%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                      <div 
                        className="h-2 rounded-full bg-primary" 
                        style={{ width: "89%" }} 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Storage Capacity</span>
                      <span>92%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                      <div 
                        className="h-2 rounded-full bg-primary" 
                        style={{ width: "92%" }} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Algorithms</CardTitle>
                <CardDescription>
                  Advanced algorithms for warehouse optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <h3 className="text-lg font-medium">A* Path Planning</h3>
                    <p className="text-sm text-muted-foreground">
                      Optimize picking routes for minimal travel distance using A* search algorithm
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => toast.success("Running A* optimization algorithm...")}
                    >
                      Run Analysis
                    </Button>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h3 className="text-lg font-medium">Dijkstra's Algorithm</h3>
                    <p className="text-sm text-muted-foreground">
                      Calculate shortest paths for intra-warehouse transportation
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => toast.success("Running Dijkstra's algorithm...")}
                    >
                      Run Analysis
                    </Button>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h3 className="text-lg font-medium">Genetic Algorithm</h3>
                    <p className="text-sm text-muted-foreground">
                      Optimize item placement and zone configuration
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => toast.success("Running genetic optimization algorithm...")}
                    >
                      Run Analysis
                    </Button>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h3 className="text-lg font-medium">Knapsack Algorithm</h3>
                    <p className="text-sm text-muted-foreground">
                      Optimize container loading and shipment consolidation
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => toast.success("Running knapsack optimization algorithm...")}
                    >
                      Run Analysis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="row-span-2">
              <CardHeader>
                <CardTitle>Warehouse Layout Optimization</CardTitle>
                <CardDescription>
                  AI-powered suggestions for optimal warehouse configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Our advanced AI algorithms analyze current warehouse operations, inventory flow, and picking patterns to suggest optimal layout configurations that minimize travel distance and maximize efficiency.
                </p>
                
                <div className="rounded-lg bg-secondary p-4">
                  <h4 className="font-medium mb-2">Current Optimization Status</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Item placement analysis complete
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Travel path optimization complete
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-2 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                      Zone reallocation in progress
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                      Picking sequence optimization pending
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Current Efficiency Gains</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Travel Distance Reduction</span>
                        <span className="font-medium">24%</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: "24%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Picking Time Improvement</span>
                        <span className="font-medium">18%</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: "18%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Space Utilization Improvement</span>
                        <span className="font-medium">15%</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleOptimize}
                  disabled={isRunningAnalysis}
                >
                  {isRunningAnalysis ? "Running Analysis..." : "Run Full Optimization Analysis"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Algorithm Performance</CardTitle>
                <CardDescription>
                  Efficiency comparison of optimization algorithms
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "A*", efficiency: 85, runtime: 95 },
                      { name: "Dijkstra", efficiency: 75, runtime: 88 },
                      { name: "Genetic", efficiency: 92, runtime: 65 },
                      { name: "Knapsack", efficiency: 79, runtime: 91 },
                      { name: "LRU Cache", efficiency: 88, runtime: 97 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="efficiency" name="Solution Quality" fill="#8884d8" />
                    <Bar dataKey="runtime" name="Runtime Efficiency" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
