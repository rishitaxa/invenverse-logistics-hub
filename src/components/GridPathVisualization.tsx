
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { aStarPathfinding, dijkstraPathfinding, calculatePathLength } from "@/utils/algorithms";

interface GridCell {
  x: number;
  y: number;
  isWalkable: boolean;
  isStart: boolean;
  isEnd: boolean;
  isPath: boolean;
}

interface GridPathVisualizationProps {
  zone: string;
  onClose: () => void;
}

const GridPathVisualization = ({ zone, onClose }: GridPathVisualizationProps) => {
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [startPoint, setStartPoint] = useState<{x: number, y: number} | null>(null);
  const [endPoint, setEndPoint] = useState<{x: number, y: number} | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("astar");
  const [pathLength, setPathLength] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const gridSize = 15;

  // Utility to generate a fully walkable grid and optionally add removable obstacles
  const generateSolvableGrid = (start?: {x:number, y:number}, end?: {x:number, y:number}) => {
    const newGrid: GridCell[][] = [];
    for (let y = 0; y < gridSize; y++) {
      const row: GridCell[] = [];
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
      newGrid.push(row);
    }
    // Optionally: Add some random obstacles, but never block the shortest path
    if (start && end) {
      // Use aStarPathfinding to compute a guaranteed path
      let path = aStarPathfinding(newGrid, start, end);
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          // Block some random cells not on the path
          if (
            Math.random() > 0.8 && // 20% chance blocked
            !path.some(pt => pt.x === x && pt.y === y) &&
            !(start.x === x && start.y === y) &&
            !(end.x === x && end.y === y)
          ) {
            newGrid[y][x].isWalkable = false;
          }
        }
      }
    }
    return newGrid;
  };

  // Set up the grid for the first time: blank grid to select points
  useEffect(() => {
    setGrid(generateSolvableGrid());
  }, []);

  const handleCellClick = (x: number, y: number) => {
    if (!grid[y][x].isWalkable) return;
    const newGrid = grid.map(row => row.map(cell => ({
      ...cell,
      isStart: false,
      isEnd: false,
      isPath: false,
    })));
    if (!startPoint) {
      newGrid[y][x].isStart = true;
      setStartPoint({x, y});
      setGrid(newGrid);
    } else if (!endPoint && !(x === startPoint.x && y === startPoint.y)) {
      newGrid[startPoint.y][startPoint.x].isStart = true;
      newGrid[y][x].isEnd = true;
      setEndPoint({x, y});
      // Now, regenerate grid guaranteeing a solution
      const solvableGrid = generateSolvableGrid(startPoint, {x, y});
      solvableGrid[startPoint.y][startPoint.x].isStart = true;
      solvableGrid[y][x].isEnd = true;
      setGrid(solvableGrid);
    } else {
      // Reset points
      clearPath();
    }
  };

  const clearPath = () => {
    setGrid(generateSolvableGrid());
    setStartPoint(null);
    setEndPoint(null);
    setPathLength(0);
  };

  const calculatePath = async () => {
    if (!startPoint || !endPoint) {
      toast.error("Please select both start and end points");
      return;
    }

    setIsCalculating(true);
    
    try {
      let path: {x: number, y: number}[] = [];
      
      if (selectedAlgorithm === "astar") {
        path = aStarPathfinding(grid, startPoint, endPoint);
      } else if (selectedAlgorithm === "dijkstra") {
        path = dijkstraPathfinding(grid, startPoint, endPoint);
      }

      if (path.length === 0) {
        toast.error("No path found between the selected points");
        setIsCalculating(false);
        return;
      }

      // Update grid with path
      const newGrid = grid.map((row, y) =>
        row.map((cell, x) => ({
          ...cell,
          isPath: path.some(
            (pt) =>
              pt.x === x &&
              pt.y === y &&
              !((pt.x === startPoint.x && pt.y === startPoint.y) ||
                (pt.x === endPoint.x && pt.y === endPoint.y))
          ),
        }))
      );
      setGrid(newGrid);

      const length = calculatePathLength(path);
      setPathLength(length);
      toast.success(`Path calculated using ${selectedAlgorithm.toUpperCase()}! Length: ${length} units`);
    } catch (error) {
      toast.error("Error calculating path");
    }
    
    setIsCalculating(false);
  };

  const getCellColor = (cell: GridCell) => {
    if (cell.isStart) return "bg-green-500";
    if (cell.isEnd) return "bg-red-500";
    if (cell.isPath) return "bg-blue-400";
    if (!cell.isWalkable) return "bg-gray-800";
    return "bg-gray-200 hover:bg-gray-300";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Zone {zone} - Grid Path Visualization</CardTitle>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <Label>Algorithm:</Label>
            <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="astar">A* Algorithm</SelectItem>
                <SelectItem value="dijkstra">Dijkstra</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={calculatePath} disabled={isCalculating || !startPoint || !endPoint}>
            {isCalculating ? "Calculating..." : "Calculate Path"}
          </Button>
          <Button variant="outline" onClick={clearPath}>
            Clear Path
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Click cells to set start (green) and end (red) points
            </div>
            {pathLength > 0 && (
              <div className="text-lg font-semibold">
                Path Length: {pathLength} units
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-15 gap-1 p-4 bg-muted rounded-lg max-w-2xl mx-auto">
            {grid.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`w-6 h-6 border border-gray-400 cursor-pointer transition-colors ${getCellColor(cell)}`}
                  onClick={() => handleCellClick(x, y)}
                  title={`(${x}, ${y}) ${!cell.isWalkable ? '- Blocked' : ''}`}
                />
              ))
            )}
          </div>
          
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 border"></div>
              <span>Start Point</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 border"></div>
              <span>End Point</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 border"></div>
              <span>Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-800 border"></div>
              <span>Blocked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 border"></div>
              <span>Walkable</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default GridPathVisualization;
