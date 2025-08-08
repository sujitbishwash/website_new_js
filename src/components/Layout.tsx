import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";

const Layout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="flex h-screen text-white overflow-hidden"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="border-b p-4 lg:hidden flex-shrink-0"
          style={{
            backgroundColor: "var(--color-background-secondary)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
            style={{
              color: "var(--color-secondary-text)",
              backgroundColor: "transparent",
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
