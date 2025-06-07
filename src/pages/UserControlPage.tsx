
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import UserControlPanel from "@/components/UserControlPanel";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const UserControlPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      toast.error("Please log in to access user controls");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <UserControlPanel />
      </div>
    </div>
  );
};

export default UserControlPage;
