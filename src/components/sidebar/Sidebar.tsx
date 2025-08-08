import {
  ChevronsLeft,
  Award,
  Book,
  Clock,
  FileCheck,
  FileQuestion,
  FileText,
  Gift,
  Home,
  X,
} from "lucide-react";
import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../routes/constants";
import MoreOptions from "./MoreOptions";
import AiPadhaiLogo from '../../assets/ai_padhai_logo.svg'; // Adjust path as needed

interface SidebarProps {
  isOpen: boolean;
  isContracted: boolean;
  onToggle: () => void;

  onContractToggle: () => void;
  onLogoutClick: () => void;
  onProfileClick: () => void;
  onUpgradeClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isContracted,
  onToggle,
  onContractToggle,
  onLogoutClick,
  onProfileClick,
  onUpgradeClick,
}) => {
  const location = useLocation();

  
  const [isHovering, setIsHovering] = useState(false);

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
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white border-r border-gray-700 flex flex-col z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static ${
          isContracted ? "lg:w-20" : "lg:w-64"
        }`}
      >
        {/*Header with close button for mobile
        <div className="p-4 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
          <h1 className="text-xl font-bold">AI Padhai</h1>
          <button
            onClick={onToggle}
            className="lg:hidden text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
          >
            <X size={20} />
          </button>
        </div>*/}

        {/* Header with contract/close buttons */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between flex-shrink-0 h-[65px]">
          {/* Title hides when contracted on large screens */}
           <div
            className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${
              isContracted ? "lg:w-0" : "lg:w-auto"
            }`}
          >
          <img src={AiPadhaiLogo} alt="Logo" width={30} height={30}/>
          <h1
            className={`text-xl font-bold whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isContracted ? "lg:w-0" : "lg:w-auto"
            }`}
          >
            AI Padhai
          </h1>
          </div>

          {/* Desktop contract/expand button */}
          <button
            onClick={onContractToggle}
            
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="hidden lg:block text-gray-400 hover:text-white focus:outline-none rounded-lg p-1 cursor-pointer"
          >
            {isContracted ? (
              isHovering ? (
                <ChevronsLeft size={30} className="rotate-180" />
              ) : (
          <img src={AiPadhaiLogo} alt="Logo" width={30} height={30}/>
              )
            ) : (
              <ChevronsLeft size={30} />
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onToggle}
            className="lg:hidden text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto min-h-0">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    title={isContracted ? item.label : ""}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onToggle();
                      }
                    }}
                    className={`flex items-center ${
                      isContracted ? "" : "space-x-3"
                    } p-3 rounded-lg transition-colors ${
                      isContracted ? "lg:justify-center" : ""
                    } ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span
                      className={`whitespace-nowrap transition-opacity ${
                        isContracted ? "lg:opacity-0 lg:hidden" : "opacity-100"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <MoreOptions
          isContracted={isContracted}
          onLogoutClick={onLogoutClick}
          onProfileClick={onProfileClick}
          onUpgradeClick={onUpgradeClick}
        />
      </aside>
    </>
  );
};

export default Sidebar;
