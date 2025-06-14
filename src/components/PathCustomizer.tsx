import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { aStarPathfinding, dijkstraPathfinding, calculatePathLength } from "@/utils/algorithms";
import { Edit, Save, Play } from "lucide-react";

interface CustomPath {
  id: string;
  name: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  algorithm: string;
  length: number;
  created: string;
}

const PathCustomizer = () => {
  const [customPaths, setCustomPaths] = useState<CustomPath[]>([]);
  const [newPath, setNewPath] = useState({
    name: "",
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    algorithm: "astar"
  });

  const [gridSize, setGridSize] = useState(15);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  // Always generate a grid where the path exists
  const createSampleGrid = (start?: {x:number, y:number}, end?: {x:number, y:number}) => {
    const grid = [];
    for (let y = 0; y < gridSize; y++) {
      const row = [];
      for (let x = 0; x < gridSize; x++) {
        row.push({
          x,
          y,
          isWalkable: true,
          isStart: false,
          isEnd: false,
          isPath: false,
        });
      }
      grid.push(row);
    }
    if (start && end) {
      let path = aStarPathfinding(grid, start, end);
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          if (
            Math.random() > 0.8 &&
            !path.some(pt => pt.x === x && pt.y === y) &&
            !(start.x === x && start.y === y) &&
            !(end.x === x && end.y === y)
          ) {
            grid[y][x].isWalkable = false;
          }
        }
      }
    }
    return grid;
  };

  const calculateCustomPath = () => {
    if (!newPath.name) {
      toast.error("Please enter a path name");
      return;
    }

    if (newPath.startX === newPath.endX && newPath.startY === newPath.endY) {
      toast.error("Start and end points cannot be the same");
      return;
    }

    const start = { x: newPath.startX, y: newPath.startY };
    const end = { x: newPath.endX, y: newPath.endY };
    const grid = createSampleGrid(start, end);

    // Ensure start and end points are walkable
    if (start.x >= 0 && start.x < gridSize && start.y >= 0 && start.y < gridSize) {
      grid[start.y][start.x].isWalkable = true;
    }
    if (end.x >= 0 && end.x < gridSize && end.y >= 0 && end.y < gridSize) {
      grid[end.y][end.x].isWalkable = true;
    }

    let path: { x: number; y: number }[] = [];
    try {
      if (newPath.algorithm === "astar") {
        path = aStarPathfinding(grid, start, end);
      } else if (newPath.algorithm === "dijkstra") {
        path = dijkstraPathfinding(grid, start, end);
      }

      if (path.length === 0) {
        toast.error("No path found between the selected points");
        return;
      }

      const length = calculatePathLength(path);

      const customPath = {
        id: Date.now().toString(),
        name: newPath.name,
        startPoint: start,
        endPoint: end,
        algorithm: newPath.algorithm,
        length: length,
        created: new Date().toLocaleString()
      };

      setCustomPaths([...customPaths, customPath]);
      setNewPath({ name: "", startX: 0, startY: 0, endX: 0, endY: 0, algorithm: "astar" });
      toast.success(`Path "${customPath.name}" created! Length: ${length} units`);
    } catch (error) {
      toast.error("Error calculating path");
    }
  };

  const deletePath = (id: string) => {
    setCustomPaths(customPaths.filter(p => p.id !== id));
    toast.success("Path deleted successfully!");
  };

  const duplicatePath = (path: CustomPath) => {
    const duplicated: CustomPath = {
      ...path,
      id: Date.now().toString(),
      name: `${path.name} (Copy)`,
      created: new Date().toLocaleString()
    };
    setCustomPaths([...customPaths, duplicated]);
    toast.success("Path duplicated successfully!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Edit className="h-8 w-8" />
        <h2 className="text-3xl font-bold">Path Customizer</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Custom Path</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Path Name</Label>
              <Input
                value={newPath.name}
                onChange={(e) => setNewPath({...newPath, name: e.target.value})}
                placeholder="e.g., Zone A to Loading Dock"
              />
            </div>

            <div>
              <Label>Grid Size</Label>
              <Input
                type="number"
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
                min={5}
                max={25}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Point (X, Y)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={newPath.startX}
                    onChange={(e) => setNewPath({...newPath, startX: Number(e.target.value)})}
                    min={0}
                    max={gridSize - 1}
                    placeholder="X"
                  />
                  <Input
                    type="number"
                    value={newPath.startY}
                    onChange={(e) => setNewPath({...newPath, startY: Number(e.target.value)})}
                    min={0}
                    max={gridSize - 1}
                    placeholder="Y"
                  />
                </div>
              </div>

              <div>
                <Label>End Point (X, Y)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={newPath.endX}
                    onChange={(e) => setNewPath({...newPath, endX: Number(e.target.value)})}
                    min={0}
                    max={gridSize - 1}
                    placeholder="X"
                  />
                  <Input
                    type="number"
                    value={newPath.endY}
                    onChange={(e) => setNewPath({...newPath, endY: Number(e.target.value)})}
                    min={0}
                    max={gridSize - 1}
                    placeholder="Y"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Algorithm</Label>
              <Select value={newPath.algorithm} onValueChange={(value) => setNewPath({...newPath, algorithm: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="astar">A* Algorithm</SelectItem>
                  <SelectItem value="dijkstra">Dijkstra Algorithm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calculateCustomPath} className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Calculate Path
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Paths ({customPaths.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {customPaths.map((path) => (
                <div
                  key={path.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPath === path.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{path.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ({path.startPoint.x}, {path.startPoint.y}) → ({path.endPoint.x}, {path.endPoint.y})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {path.algorithm.toUpperCase()} | Length: {path.length} units
                      </p>
                      <p className="text-xs text-muted-foreground">Created: {path.created}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicatePath(path);
                        }}
                      >
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePath(path.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {customPaths.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No custom paths created yet. Create your first path above!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PathCustomizer;
