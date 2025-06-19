
interface GridCell {
  x: number;
  y: number;
  isWalkable: boolean;
  isStart: boolean;
  isEnd: boolean;
  isPath: boolean;
}

interface Node {
  x: number;
  y: number;
  g: number; // Cost from start
  h: number; // Heuristic cost to end
  f: number; // Total cost
  parent: Node | null;
}

interface DijkstraNode {
  x: number;
  y: number;
  distance: number;
  parent: DijkstraNode | null;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  location: string;
  cost: number;
  category: string;
}

// Manhattan distance heuristic for A*
const heuristic = (a: { x: number; y: number }, b: { x: number; y: number }): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

// Get valid neighbors for a cell
const getNeighbors = (node: { x: number; y: number }, grid: GridCell[][]): { x: number; y: number }[] => {
  const neighbors = [];
  const directions = [
    { x: 0, y: -1 }, // Up
    { x: 1, y: 0 },  // Right
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }  // Left
  ];

  for (const dir of directions) {
    const newX = node.x + dir.x;
    const newY = node.y + dir.y;

    if (
      newX >= 0 && 
      newX < grid[0].length && 
      newY >= 0 && 
      newY < grid.length && 
      grid[newY][newX].isWalkable
    ) {
      neighbors.push({ x: newX, y: newY });
    }
  }

  return neighbors;
};

// Reconstruct path from end node to start
const reconstructPath = (endNode: Node | DijkstraNode): { x: number; y: number }[] => {
  const path = [];
  let current: Node | DijkstraNode | null = endNode;

  while (current) {
    path.unshift({ x: current.x, y: current.y });
    current = current.parent;
  }

  return path;
};

export const aStarPathfinding = (
  grid: GridCell[][],
  start: { x: number; y: number },
  end: { x: number; y: number }
): { x: number; y: number }[] => {
  console.log('A* pathfinding started', { start, end });
  
  if (!grid || grid.length === 0 || !grid[0]) {
    console.error('Invalid grid provided to A*');
    return [];
  }

  const openSet: Node[] = [];
  const closedSet: Set<string> = new Set();

  const startNode: Node = {
    x: start.x,
    y: start.y,
    g: 0,
    h: heuristic(start, end),
    f: heuristic(start, end),
    parent: null
  };

  openSet.push(startNode);

  while (openSet.length > 0) {
    // Find node with lowest f score
    let currentIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[currentIndex].f) {
        currentIndex = i;
      }
    }

    const current = openSet.splice(currentIndex, 1)[0];
    const currentKey = `${current.x},${current.y}`;
    closedSet.add(currentKey);

    // Check if we reached the end
    if (current.x === end.x && current.y === end.y) {
      console.log('A* path found');
      return reconstructPath(current);
    }

    // Check all neighbors
    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      
      if (closedSet.has(neighborKey)) {
        continue;
      }

      const tentativeG = current.g + 1;
      let neighborNode = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);

      if (!neighborNode) {
        neighborNode = {
          x: neighbor.x,
          y: neighbor.y,
          g: tentativeG,
          h: heuristic(neighbor, end),
          f: tentativeG + heuristic(neighbor, end),
          parent: current
        };
        openSet.push(neighborNode);
      } else if (tentativeG < neighborNode.g) {
        neighborNode.g = tentativeG;
        neighborNode.f = tentativeG + neighborNode.h;
        neighborNode.parent = current;
      }
    }
  }

  console.log('A* no path found');
  return [];
};

export const dijkstraPathfinding = (
  grid: GridCell[][],
  start: { x: number; y: number },
  end: { x: number; y: number }
): { x: number; y: number }[] => {
  console.log('Dijkstra pathfinding started', { start, end });
  
  if (!grid || grid.length === 0 || !grid[0]) {
    console.error('Invalid grid provided to Dijkstra');
    return [];
  }

  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: DijkstraNode | null } = {};
  const unvisited: DijkstraNode[] = [];

  // Initialize distances and add all walkable cells to unvisited
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x].isWalkable) {
        const key = `${x},${y}`;
        const distance = (x === start.x && y === start.y) ? 0 : Infinity;
        distances[key] = distance;
        previous[key] = null;
        
        const node: DijkstraNode = {
          x,
          y,
          distance,
          parent: null
        };
        unvisited.push(node);
      }
    }
  }

  while (unvisited.length > 0) {
    // Find unvisited node with minimum distance
    unvisited.sort((a, b) => a.distance - b.distance);
    const current = unvisited.shift()!;

    // If we reached the end
    if (current.x === end.x && current.y === end.y) {
      console.log('Dijkstra path found');
      return reconstructPath(current);
    }

    // If the current distance is infinity, no path exists
    if (current.distance === Infinity) {
      break;
    }

    // Check all neighbors
    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      const neighborNode = unvisited.find(n => n.x === neighbor.x && n.y === neighbor.y);
      
      if (neighborNode) {
        const alt = current.distance + 1;
        if (alt < neighborNode.distance) {
          neighborNode.distance = alt;
          neighborNode.parent = current;
          distances[neighborKey] = alt;
        }
      }
    }
  }

  console.log('Dijkstra no path found');
  return [];
};

export const calculatePathLength = (path: { x: number; y: number }[]): number => {
  if (path.length <= 1) return 0;
  
  let length = 0;
  for (let i = 1; i < path.length; i++) {
    const dx = path[i].x - path[i - 1].x;
    const dy = path[i].y - path[i - 1].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  
  return Math.round(length * 100) / 100;
};

// Knapsack optimization algorithm for inventory
export const knapsackOptimization = (items: InventoryItem[], capacity: number): { value: number; items: InventoryItem[] } => {
  const n = items.length;
  const dp: number[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
  
  // Build table dp[][] in bottom up manner
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      const weight = items[i - 1].quantity;
      const value = items[i - 1].cost * items[i - 1].quantity;
      
      if (weight <= w) {
        dp[i][w] = Math.max(value + dp[i - 1][w - weight], dp[i - 1][w]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  // Find which items to include
  const selectedItems: InventoryItem[] = [];
  let w = capacity;
  for (let i = n; i > 0 && dp[i][w] > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedItems.push(items[i - 1]);
      w -= items[i - 1].quantity;
    }
  }
  
  return { value: dp[n][capacity], items: selectedItems };
};

// LRU Cache implementation
export class lruCache<T> {
  private cache: Map<string, T>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)!;
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return undefined;
  }

  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

// HashMap search function
export const hashMapSearch = <T extends Record<string, any>>(
  items: T[],
  searchKey: keyof T,
  searchValue: string
): T[] => {
  const searchMap = new Map<string, T[]>();
  
  // Build hash map
  items.forEach(item => {
    const key = String(item[searchKey]).toLowerCase();
    if (!searchMap.has(key)) {
      searchMap.set(key, []);
    }
    searchMap.get(key)!.push(item);
  });
  
  // Search for matching items
  const searchTerm = searchValue.toLowerCase();
  const results: T[] = [];
  
  for (const [key, itemList] of searchMap.entries()) {
    if (key.includes(searchTerm)) {
      results.push(...itemList);
    }
  }
  
  return results;
};
