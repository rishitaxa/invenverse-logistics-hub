
import InventoryManager from "@/components/InventoryManager";
import ProtectedRoute from "@/components/ProtectedRoute";

const InventoryManagerPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <InventoryManager />
      </div>
    </ProtectedRoute>
  );
};

export default InventoryManagerPage;
