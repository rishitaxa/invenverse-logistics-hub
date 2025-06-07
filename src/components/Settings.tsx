
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Settings as SettingsIcon, User, Database, Shield, Bell } from "lucide-react";

const Settings = () => {
  const [userSettings, setUserSettings] = useState({
    username: localStorage.getItem("userId") || "admin",
    email: "admin@warehouse.com",
    theme: "light",
    notifications: true,
    autoSave: true,
  });

  const [warehouseSettings, setWarehouseSettings] = useState({
    defaultAlgorithm: "astar",
    gridSize: "15",
    maxCapacity: "10000",
    alertThreshold: "20",
  });

  const handleUserSettingsChange = (key: string, value: any) => {
    setUserSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleWarehouseSettingsChange = (key: string, value: any) => {
    setWarehouseSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    // Save to localStorage (in a real app, this would be sent to backend)
    localStorage.setItem("userSettings", JSON.stringify(userSettings));
    localStorage.setItem("warehouseSettings", JSON.stringify(warehouseSettings));
    toast.success("Settings saved successfully!");
  };

  const resetSettings = () => {
    setUserSettings({
      username: "admin",
      email: "admin@warehouse.com",
      theme: "light",
      notifications: true,
      autoSave: true,
    });
    setWarehouseSettings({
      defaultAlgorithm: "astar",
      gridSize: "15",
      maxCapacity: "10000",
      alertThreshold: "20",
    });
    toast.info("Settings reset to defaults");
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-8 w-8" />
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Tabs defaultValue="user" className="space-y-4">
        <TabsList>
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            User Settings
          </TabsTrigger>
          <TabsTrigger value="warehouse" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Warehouse Settings
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={userSettings.username}
                  onChange={(e) => handleUserSettingsChange("username", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userSettings.email}
                  onChange={(e) => handleUserSettingsChange("email", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Theme</Label>
                <Select
                  value={userSettings.theme}
                  onValueChange={(value) => handleUserSettingsChange("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Configuration</CardTitle>
              <CardDescription>Configure warehouse-specific settings and algorithms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Default Pathfinding Algorithm</Label>
                <Select
                  value={warehouseSettings.defaultAlgorithm}
                  onValueChange={(value) => handleWarehouseSettingsChange("defaultAlgorithm", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="astar">A* Algorithm</SelectItem>
                    <SelectItem value="dijkstra">Dijkstra Algorithm</SelectItem>
                    <SelectItem value="genetic">Genetic Algorithm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gridSize">Grid Size</Label>
                <Input
                  id="gridSize"
                  type="number"
                  value={warehouseSettings.gridSize}
                  onChange={(e) => handleWarehouseSettingsChange("gridSize", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxCapacity">Maximum Warehouse Capacity</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  value={warehouseSettings.maxCapacity}
                  onChange={(e) => handleWarehouseSettingsChange("maxCapacity", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alertThreshold">Low Stock Alert Threshold (%)</Label>
                <Input
                  id="alertThreshold"
                  type="number"
                  value={warehouseSettings.alertThreshold}
                  onChange={(e) => handleWarehouseSettingsChange("alertThreshold", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button variant="outline">Change Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={userSettings.notifications}
                  onCheckedChange={(checked) => handleUserSettingsChange("notifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when items are low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>System Maintenance</Label>
                  <p className="text-sm text-muted-foreground">Maintenance and update notifications</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Save</Label>
                  <p className="text-sm text-muted-foreground">Automatically save your work</p>
                </div>
                <Switch
                  checked={userSettings.autoSave}
                  onCheckedChange={(checked) => handleUserSettingsChange("autoSave", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button onClick={saveSettings}>Save Settings</Button>
        <Button variant="outline" onClick={resetSettings}>Reset to Defaults</Button>
      </div>
    </div>
  );
};

export default Settings;
