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
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../routes/constants";
import MoreOptions from "./MoreOptions";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onLogoutClick: () => void;
  onProfileClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onLogoutClick,
  onProfileClick,
}) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: ROUTES.HOME, icon: Home, label: "Home" },
    { path: ROUTES.HISTORY, icon: Clock, label: "History" },
    { path: ROUTES.BOOKS, icon: Book, label: "Books" },
    { path: ROUTES.TEST_SERIES, icon: FileCheck, label: "Test Series" },
    {
      path: ROUTES.PREVIOUS_YEAR_PAPERS,
      icon: FileQuestion,
      label: "Previous Year Papers",
    },
    { path: ROUTES.ATTEMPTED_TESTS, icon: FileText, label: "Attempted Tests" },
    { path: ROUTES.PREMIUM, icon: Star, label: "Premium" },
    { path: ROUTES.EXAMS, icon: Award, label: "Exams" },
    { path: ROUTES.REFER_AND_EARN, icon: Gift, label: "Refer and Earn" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-10 backdrop-blur-sm z-30 lg:hidden "
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-800 border-r border-gray-700 flex flex-col z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
        style={{ width: "256px" }}
      >
        {/* Header with close button for mobile */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
          <h1 className="text-xl font-bold">AI Padhai</h1>
          <button
            onClick={onToggle}
            className="lg:hidden text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto min-h-0">
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
        <MoreOptions
          onLogoutClick={onLogoutClick}
          onProfileClick={onProfileClick}
        />
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
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-3">
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
            <div className="flex-1">
              <p className="font-medium text-gray-300">Free Plan</p>
              <p className="text-sm text-gray-400">{user?.email || 'learner@aipadhai.com'}</p>
            </div>
          </div>
          
          {/* Profile and Logout Buttons */}
        {/*<div className="space-y-2">
            <button
              onClick={() => {
                navigate(ROUTES.PROFILE);
                // Close sidebar on mobile when clicking profile
                if (window.innerWidth < 1024) {
                  onToggle();
                }
              }}
              className="w-full flex items-center space-x-3 p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="text-sm">Profile</span>
            </button>
            
            <button
              onClick={() => {
                logout();
                navigate(ROUTES.LOGIN);
                // Close sidebar on mobile when logging out
                if (window.innerWidth < 1024) {
                  onToggle();
                }
              }}
              className="w-full flex items-center space-x-3 p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm">Logout</span>
            </button>
          </div>*/}
      </aside>
    </>
  );
};

export default Sidebar;
