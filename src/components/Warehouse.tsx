import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import GridPathVisualization from "./GridPathVisualization";

const Warehouse = () => {
  const isMobile = useIsMobile();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [showGridPath, setShowGridPath] = useState(false);
  
  // This would be dynamic data from backend in a real application
  const warehouseData = {
    name: "Main Distribution Center",
    totalArea: "125,000 sq ft",
    zones: [
      { id: "A", utilization: 92, status: "Optimal", color: "bg-green-500" },
      { id: "B", utilization: 78, status: "Optimal", color: "bg-green-500" },
      { id: "C", utilization: 95, status: "Crowded", color: "bg-yellow-500" },
      { id: "D", utilization: 45, status: "Underutilized", color: "bg-blue-500" },
      { id: "E", utilization: 88, status: "Optimal", color: "bg-green-500" },
      { id: "F", utilization: 97, status: "Crowded", color: "bg-yellow-500" },
      { id: "G", utilization: 34, status: "Underutilized", color: "bg-blue-500" },
      { id: "H", utilization: 87, status: "Optimal", color: "bg-green-500" },
    ],
    aisles: 16,
    racks: 120,
    pickingStations: 8,
    docks: 12,
  };
  
  // Get zone details by ID
  const getZoneDetails = (id: string) => {
    return warehouseData.zones.find(zone => zone.id === id);
  };
  
  // Handle zone click
  const handleZoneClick = (id: string) => {
    const zone = getZoneDetails(id);
    setSelectedZone(id);
    
    if (zone) {
      toast(`Zone ${id}: ${zone.status} (${zone.utilization}% utilized)`);
    }
  };
  
  // Handle showing grid path for selected zone
  const handleShowGridPath = () => {
    if (selectedZone) {
      setShowGridPath(true);
    } else {
      toast.error("Please select a zone first");
    }
  };
  
  // Handle zone optimization
  const handleOptimize = () => {
    if (selectedZone) {
      toast.success(`Optimizing Zone ${selectedZone}. AI algorithms running...`);
      
      // This would trigger backend optimization in a real app
      setTimeout(() => {
        toast.success(`Zone ${selectedZone} optimization complete. Space utilization improved by 12%`);
      }, 2000);
    }
  };
  
  // Render the warehouse grid
  const renderWarehouseGrid = () => {
    return (
      <div 
        className="grid grid-cols-4 gap-2 lg:gap-4 max-w-3xl mx-auto p-4"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
      >
        {warehouseData.zones.map(zone => (
          <div
            key={zone.id}
            className={`h-24 sm:h-32 lg:h-40 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-lg ${
              selectedZone === zone.id ? 'border-primary border-4' : 'border-gray-300'
            } ${zone.color} bg-opacity-20`}
            onClick={() => handleZoneClick(zone.id)}
          >
            <div className="text-lg sm:text-2xl font-bold">Zone {zone.id}</div>
            <div className="text-xs sm:text-sm">{zone.utilization}% Full</div>
          </div>
        ))}
      </div>
    );
  };

  if (showGridPath && selectedZone) {
    return (
      <div className="flex-1 p-6">
        <GridPathVisualization 
          zone={selectedZone} 
          onClose={() => setShowGridPath(false)} 
        />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Warehouse Layout</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
            disabled={zoomLevel <= 0.5}
          >
            -
          </Button>
          <span className="text-sm w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.1))}
            disabled={zoomLevel >= 1.5}
          >
            +
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Warehouse Info</CardTitle>
            <CardDescription>{warehouseData.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium">Total Area:</dt>
                <dd>{warehouseData.totalArea}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Aisles:</dt>
                <dd>{warehouseData.aisles}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Racks:</dt>
                <dd>{warehouseData.racks}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Picking Stations:</dt>
                <dd>{warehouseData.pickingStations}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Loading Docks:</dt>
                <dd>{warehouseData.docks}</dd>
              </div>
              <div className="pt-2 space-y-2">
                {selectedZone ? (
                  <>
                    <Button 
                      className="w-full" 
                      onClick={handleOptimize}
                    >
                      Optimize Zone {selectedZone}
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={handleShowGridPath}
                    >
                      View Grid Path
                    </Button>
                  </>
                ) : (
                  <Button 
                    className="w-full" 
                    variant="secondary"
                    disabled
                  >
                    Select a zone to optimize
                  </Button>
                )}
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle>Warehouse Layout</CardTitle>
            <CardDescription>
              Click on a zone to view details and optimize space
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto pb-6 pt-2">
              {renderWarehouseGrid()}
            </div>
            <div className="mt-4 flex items-center gap-2 justify-center text-sm">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                <span>Optimal</span>
              </div>
              <div className="flex items-center mx-4">
                <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
                <span>Crowded</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                <span>Underutilized</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedZone && (
        <Card>
          <CardHeader>
            <CardTitle>Zone {selectedZone} Details</CardTitle>
            <CardDescription>
              Detailed information and optimization options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold mb-2">Zone Statistics</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="font-medium">Status:</dt>
                    <dd>{getZoneDetails(selectedZone)?.status}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Utilization:</dt>
                    <dd>{getZoneDetails(selectedZone)?.utilization}%</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Racks:</dt>
                    <dd>15</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Items Stored:</dt>
                    <dd>1,245</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Optimization Options</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input id="reorder" type="checkbox" className="h-4 w-4" />
                    <Label htmlFor="reorder">Reorganize items by velocity</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input id="consolidate" type="checkbox" className="h-4 w-4" />
                    <Label htmlFor="consolidate">Consolidate partial locations</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input id="suggest" type="checkbox" className="h-4 w-4" checked />
                    <Label htmlFor="suggest">Suggest layout improvements</Label>
                  </div>
                </div>
                <Button className="mt-4 w-full" onClick={handleOptimize}>
                  Run Optimization Algorithm
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Warehouse;
