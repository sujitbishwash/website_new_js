import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Parent: React.FC = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
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
    <>
      <Sidebar
        isOpen={isLeftSidebarOpen}
        onClose={() => setIsLeftSidebarOpen(false)}
        onToggle={toggleLeftSidebar}
        onLogout={handleLogout}
      />
      <Outlet />
    </>
  );
};

export default Parent;
