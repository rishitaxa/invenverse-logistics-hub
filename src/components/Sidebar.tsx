
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, Warehouse, Search, ArrowRight, ArrowLeft, ChartBar, Settings } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      active: location.pathname === '/dashboard',
    },
    {
      label: 'Inventory',
      icon: Package,
      href: '/inventory',
      active: location.pathname === '/inventory',
    },
    {
      label: 'Warehouse',
      icon: Warehouse,
      href: '/warehouse',
      active: location.pathname === '/warehouse',
    },
    {
      label: 'Shipments',
      icon: Search,
      href: '/shipments',
      active: location.pathname === '/shipments',
    },
    {
      label: 'Analytics',
      icon: ChartBar,
      href: '/analytics',
      active: location.pathname === '/analytics',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/settings',
      active: location.pathname === '/settings',
    },
  ];

  return (
    <div className={cn(
      "relative flex flex-col border-r bg-sidebar h-screen",
      collapsed ? "w-[70px]" : "w-[240px]",
      className
    )}>
      <div className="flex h-14 items-center border-b px-4 py-2">
        {!collapsed && (
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold">
              WMS<span className="text-primary">Pro</span>
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {routes.map((route, i) => (
            <Link
              key={i}
              to={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all",
                route.active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground",
                collapsed && "justify-center py-3"
              )}
            >
              <route.icon className={cn("h-5 w-5", collapsed ? "h-6 w-6" : "")} />
              {!collapsed && <span>{route.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button
          onClick={() => setCollapsed(!collapsed)}
          size="sm"
          variant="ghost"
          className="w-full justify-center"
        >
          {collapsed ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          {!collapsed && <span className="ml-2">Collapse</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
