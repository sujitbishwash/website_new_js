import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Parent: React.FC = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar
        isOpen={isLeftSidebarOpen}
        onClose={() => setIsLeftSidebarOpen(false)}
        onToggle={toggleLeftSidebar}
        onLogout={handleLogout}
      />
      <main
        className={`flex-1 min-h-screen bg-gray-900 text-white overflow-x-hidden transition-all duration-300 ${
          isLeftSidebarOpen ? "ml-72" : "ml-0"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Parent;
