
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import DashboardComponent from "@/components/Dashboard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const DashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      toast.error("Please log in to access the dashboard");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <DashboardComponent />
      </div>
    </div>
  );
};

export default DashboardPage;
