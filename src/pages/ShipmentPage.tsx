
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import Shipment from "@/components/Shipment";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const ShipmentPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      toast.error("Please log in to access shipment management");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <Shipment />
      </div>
    </div>
  );
};

export default ShipmentPage;
