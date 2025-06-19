
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { aStarPathfinding, dijkstraPathfinding, calculatePathLength } from "@/utils/algorithms";
import { Edit, Save, Play, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CustomPath {
  id: string;
  name: string;
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  algorithm: string;
  length: number;
  grid_size: number;
  created_at: string;
}

const PathCustomizer = () => {
  const { user } = useAuth();
  const [customPaths, setCustomPaths] = useState<CustomPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPath, setNewPath] = useState({
    name: "",
    start_x: 0,
    start_y: 0,
    end_x: 0,
    end_y: 0,
    algorithm: "astar"
  });

  const [gridSize, setGridSize] = useState(15);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  // Fetch custom paths from Supabase
  const fetchCustomPaths = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('custom_paths')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCustomPaths(data || []);
    } catch (error) {
      console.error('Error fetching custom paths:', error);
      toast.error('Failed to load custom paths');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomPaths();
  }, [user]);

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

  const calculateCustomPath = async () => {
    if (!user) {
      toast.error("Please log in to save custom paths");
      return;
    }

    if (!newPath.name) {
      toast.error("Please enter a path name");
      return;
    }

    if (newPath.start_x === newPath.end_x && newPath.start_y === newPath.end_y) {
      toast.error("Start and end points cannot be the same");
      return;
    }

    if (newPath.start_x < 0 || newPath.start_x >= gridSize || 
        newPath.start_y < 0 || newPath.start_y >= gridSize ||
        newPath.end_x < 0 || newPath.end_x >= gridSize ||
        newPath.end_y < 0 || newPath.end_y >= gridSize) {
      toast.error(`Coordinates must be between 0 and ${gridSize - 1}`);
      return;
    }

    const start = { x: newPath.start_x, y: newPath.start_y };
    const end = { x: newPath.end_x, y: newPath.end_y };
    const grid = createSampleGrid(start, end);

    // Ensure start and end points are walkable
    grid[start.y][start.x].isWalkable = true;
    grid[end.y][end.x].isWalkable = true;

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

      // Save to Supabase
      const { data, error } = await supabase.from('custom_paths').insert([{
        user_id: user.id,
        name: newPath.name,
        start_x: newPath.start_x,
        start_y: newPath.start_y,
        end_x: newPath.end_x,
        end_y: newPath.end_y,
        algorithm: newPath.algorithm,
        length: length,
        grid_size: gridSize
      }]).select().single();

      if (error) throw error;

      setCustomPaths([data, ...customPaths]);
      setNewPath({ name: "", start_x: 0, start_y: 0, end_x: 0, end_y: 0, algorithm: "astar" });
      toast.success(`Path "${data.name}" created and saved! Length: ${length} units`);
    } catch (error) {
      console.error('Error saving custom path:', error);
      toast.error("Failed to save custom path");
    }
  };

  const deletePath = async (id: string) => {
    try {
      const { error } = await supabase.from('custom_paths').delete().eq('id', id);
      if (error) throw error;

      setCustomPaths(customPaths.filter(p => p.id !== id));
      toast.success("Path deleted successfully!");
    } catch (error) {
      console.error('Error deleting path:', error);
      toast.error("Failed to delete path");
    }
  };

  const duplicatePath = async (path: CustomPath) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.from('custom_paths').insert([{
        user_id: user.id,
        name: `${path.name} (Copy)`,
        start_x: path.start_x,
        start_y: path.start_y,
        end_x: path.end_x,
        end_y: path.end_y,
        algorithm: path.algorithm,
        length: path.length,
        grid_size: path.grid_size
      }]).select().single();

      if (error) throw error;

      setCustomPaths([data, ...customPaths]);
      toast.success("Path duplicated successfully!");
    } catch (error) {
      console.error('Error duplicating path:', error);
      toast.error("Failed to duplicate path");
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg">Please log in to access the Path Customizer</p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

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
                    value={newPath.start_x}
                    onChange={(e) => setNewPath({...newPath, start_x: Number(e.target.value)})}
                    min={0}
                    max={gridSize - 1}
                    placeholder="X"
                  />
                  <Input
                    type="number"
                    value={newPath.start_y}
                    onChange={(e) => setNewPath({...newPath, start_y: Number(e.target.value)})}
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
                    value={newPath.end_x}
                    onChange={(e) => setNewPath({...newPath, end_x: Number(e.target.value)})}
                    min={0}
                    max={gridSize - 1}
                    placeholder="X"
                  />
                  <Input
                    type="number"
                    value={newPath.end_y}
                    onChange={(e) => setNewPath({...newPath, end_y: Number(e.target.value)})}
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
              Calculate & Save Path
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
                        ({path.start_x}, {path.start_y}) → ({path.end_x}, {path.end_y})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {path.algorithm.toUpperCase()} | Length: {path.length} units | Grid: {path.grid_size}x{path.grid_size}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(path.created_at).toLocaleString()}
                      </p>
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
                        <Trash2 className="h-4 w-4" />
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
