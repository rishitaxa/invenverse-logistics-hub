
import PathCustomizer from "@/components/PathCustomizer";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const PathCustomizerPage = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <PathCustomizer />
      </div>
    </div>
  );
};

export default PathCustomizerPage;
