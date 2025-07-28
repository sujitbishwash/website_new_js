import { LogOut, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SIDEBAR_BREAKPOINTS,
  SIDEBAR_MENU_ITEMS,
  SIDEBAR_USER_INFO,
} from "../constants/sidebar";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  onToggle,
  onLogout,
}) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= SIDEBAR_BREAKPOINTS.MOBILE);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay for mobile - only show when sidebar is open on mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Overlay for desktop - show when sidebar is open on desktop */}
      {isOpen && !isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 hidden lg:block"
          onClick={onClose}
        />
      )}

      {/* Floating toggle button - show when sidebar is closed */}
      {!isOpen && onToggle && (
        <button
          className="fixed top-4 left-4 z-50 bg-gray-800 text-white p-3 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          onClick={onToggle}
          aria-label="Open sidebar"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
          </svg>
        </button>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gray-800 text-white z-50 flex flex-col shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">AI Padhai</h1>
            {onToggle && (
              <button
                className="text-white hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                onClick={onToggle}
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {SIDEBAR_MENU_ITEMS.map((item, index) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 border-l-3 border-transparent hover:border-gray-400 ${
                    isActive(item.path)
                      ? "bg-gray-700 text-white border-white"
                      : ""
                  }`}
                >
                  {item.icon}
                  <span className="ml-3 font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">
                {SIDEBAR_USER_INFO.plan}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {SIDEBAR_USER_INFO.email}
              </p>
            </div>
          </div>
          {onLogout && (
            <button
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 rounded-lg text-white text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              onClick={onLogout}
              aria-label="Logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
