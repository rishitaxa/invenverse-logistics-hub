
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "recharts";

const Dashboard = () => {
  // Mock data for charts
  const performanceData = [
    { name: "Jan", efficiency: 65, utilization: 78 },
    { name: "Feb", efficiency: 59, utilization: 70 },
    { name: "Mar", efficiency: 80, utilization: 85 },
    { name: "Apr", efficiency: 81, utilization: 84 },
    { name: "May", efficiency: 76, utilization: 87 },
    { name: "Jun", efficiency: 85, utilization: 90 },
    { name: "Jul", efficiency: 90, utilization: 92 },
  ];

  const inventoryData = [
    { name: "Raw Materials", value: 40 },
    { name: "Work in Progress", value: 30 },
    { name: "Finished Goods", value: 20 },
    { name: "Reserved", value: 10 },
  ];

  const shipmentData = [
    { name: "Mon", inbound: 20, outbound: 24 },
    { name: "Tue", inbound: 15, outbound: 13 },
    { name: "Wed", inbound: 25, outbound: 21 },
    { name: "Thu", inbound: 30, outbound: 32 },
    { name: "Fri", inbound: 18, outbound: 20 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Stats cards data
  const stats = [
    {
      title: "Total Inventory Items",
      value: "12,543",
      change: "+12.5%",
      increasing: true,
    },
    {
      title: "Warehouse Utilization",
      value: "86%",
      change: "+2.4%",
      increasing: true,
    },
    {
      title: "Pending Shipments",
      value: "52",
      change: "-8%",
      increasing: false,
    },
    {
      title: "Avg. Processing Time",
      value: "24m",
      change: "-14.2%",
      increasing: false,
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                  stat.increasing ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Warehouse efficiency and utilization over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
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
            <CardTitle>Inventory Distribution</CardTitle>
            <CardDescription>
              Current stock allocation by type
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {inventoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Weekly Shipment Activity</CardTitle>
            <CardDescription>
              Inbound vs outbound shipments this week
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={shipmentData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="inbound" fill="#8884d8" />
                <Bar dataKey="outbound" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
