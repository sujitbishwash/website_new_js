import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const Parent: React.FC = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };
  return (
    <>
      <Sidebar
        isOpen={isLeftSidebarOpen}
        onClose={() => setIsLeftSidebarOpen(false)}
        onToggle={toggleLeftSidebar}
      />
      <Outlet />
    </>
  );
};

export default Parent;
