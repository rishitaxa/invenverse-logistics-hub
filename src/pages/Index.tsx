
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Warehouse } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in, redirect to dashboard
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-8">
          <Warehouse className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          WMS<span className="text-primary">Pro</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10">
          Advanced Warehouse Management System with AI-powered optimization
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={() => navigate("/login")}>
            Log In
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>
      </div>
      
      {/* Feature Section */}
      <div className="py-16 px-6 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-2">Inventory Management</h3>
              <p className="text-muted-foreground">
                Comprehensive tracking and optimization of all warehouse inventory
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-2">Warehouse Layout</h3>
              <p className="text-muted-foreground">
                Interactive visualization and optimization of warehouse spaces
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-2">Shipment Tracking</h3>
              <p className="text-muted-foreground">
                Real-time monitoring of inbound and outbound shipments
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-2">AI Optimization</h3>
              <p className="text-muted-foreground">
                Advanced algorithms for route planning and space utilization
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 px-6 bg-background border-t">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
            &copy; 2025 WMSPro. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
