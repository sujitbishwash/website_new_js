import {
  Award,
  Book,
  Clock,
  FileCheck,
  FileQuestion,
  FileText,
  Gift,
  Home,
  Star,
  X,
} from "lucide-react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MoreOptions from "./MoreOptions";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/history", icon: Clock, label: "History" },
    { path: "/books", icon: Book, label: "Books" },
    { path: "/test-series", icon: FileCheck, label: "Test Series" },
    {
      path: "/previous-year-papers",
      icon: FileQuestion,
      label: "Previous Year Papers",
    },
    { path: "/attempted-tests", icon: FileText, label: "Attempted Tests" },
    { path: "/premium", icon: Star, label: "Premium" },
    { path: "/exams", icon: Award, label: "Exams" },
    { path: "/refer-and-earn", icon: Gift, label: "Refer and Earn" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 flex flex-col z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
        style={{ width: "256px" }}
      >
        {/* Header with close button for mobile */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-bold">AI Padhai</h1>
          <button
            onClick={onToggle}
            className="lg:hidden text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      // Close sidebar on mobile when clicking a link
                      if (window.innerWidth < 1024) {
                        onToggle();
                      }
                    }}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {<MoreOptions></MoreOptions>}
        {/* User Profile Section */}
        {/*
        <div
          onClick={() => {
            navigate("/profile");
            // Close sidebar on mobile when clicking profile
            if (window.innerWidth < 1024) {
              onToggle();
            }
          }}
          className="p-4 border-t border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-gray-600 rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="10" r="3"></circle>
                <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium">Free Plan</p>
              <p className="text-sm text-gray-400">learner@aipadhai.com</p>
            </div>
          </div>
        </div>
          */}
      </aside>
    </>
  );
};

export default Sidebar;
