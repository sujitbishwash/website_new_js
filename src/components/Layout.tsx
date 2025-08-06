import { Menu } from "lucide-react";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";

const Layout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <div className="flex-1 flex flex-col">
        {/* Header with hamburger menu */}
        <header className="bg-gray-800 border-b border-gray-700 p-4 lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
          >
            <Menu size={24} />
          </button>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
