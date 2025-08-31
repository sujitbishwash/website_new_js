import {
  LibraryBig,
  ChevronsLeft,
  FilePen,
  FileClock,
  Gift,
  Home,
  X,
  FileCheck2,
  History,
  GaugeCircle,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AiPadhaiLogo from "../../assets/ai_padhai_logo.svg"; // Adjust path as needed
import { ROUTES } from "../../routes/constants";
import MoreOptions from "./MoreOptions";

// --- Type Definitions ---
interface IconProps {
  className?: string;
}
interface SidebarProps {
  isOpen: boolean;
  isContracted: boolean;
  onToggle: () => void;

  onContractToggle: () => void;
  onLogoutClick: () => void;
  onProfileClick: () => void;
  onUpgradeClick: () => void;
  onExamConfigurationClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isContracted,
  onToggle,
  onContractToggle,
  onLogoutClick,
  onProfileClick,
  onUpgradeClick,
  onExamConfigurationClick,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isHovering, setIsHovering] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const str = location.pathname;
  const parts = str.split("/");
  const firstPart = "/" + parts[1];
  const navItems = [
    { path: ROUTES.HOME, icon: Home, label: "Home" },
    { path: ROUTES.HISTORY, icon: History, label: "History" },
    { path: ROUTES.BOOKS, icon: LibraryBig, label: "Books" },
    { path: ROUTES.TEST_SERIES, icon: FilePen, label: "Test Series" },
    {
      path: ROUTES.PREVIOUS_YEAR_PAPERS,
      icon: FileClock,
      label: "Previous Year Papers",
    },
    {
      path: ROUTES.ATTEMPTED_TESTS,
      icon: FileCheck2,
      label: "Attempted Tests",
    },
    { path: ROUTES.REFER_AND_EARN, icon: Gift, label: "Refer and Earn" },
    { path: ROUTES.STATS, icon: GaugeCircle, label: "Stats" },
  ];
  const SparklesIcon: React.FC<IconProps> = ({ }) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.665 10C17.665 10.6877 17.1785 11.2454 16.5488 11.3945L16.4219 11.4189C14.7098 11.6665 13.6129 12.1305 12.877 12.8623C12.1414 13.5938 11.6742 14.6843 11.4238 16.3887C11.3197 17.0973 10.7182 17.665 9.96484 17.665C9.27085 17.665 8.68836 17.1772 8.53613 16.5215C8.12392 14.7459 7.6623 13.619 6.95703 12.8652C6.31314 12.1772 5.39414 11.7268 3.88672 11.4688L3.57715 11.4199C2.88869 11.319 2.33496 10.734 2.33496 10C2.33496 9.26603 2.88869 8.681 3.57715 8.58008L3.88672 8.53125C5.39414 8.27321 6.31314 7.82277 6.95703 7.13477C7.6623 6.38104 8.12392 5.25413 8.53613 3.47852L8.56934 3.35742C8.76133 2.76356 9.31424 2.33496 9.96484 2.33496C10.7182 2.33497 11.3197 2.9027 11.4238 3.61133L11.5283 4.22266C11.7954 5.58295 12.2334 6.49773 12.877 7.1377C13.6129 7.86952 14.7098 8.33351 16.4219 8.58105C17.1119 8.68101 17.665 9.26667 17.665 10Z"></path>
    </svg>
  );
  return (
    <>
      {/* Upgrade Button */}

      <style>{`.glow-purple:hover {
              box-shadow: 0 0 10px rgba(168, 85, 247, 0.8), 
              0 0 20px rgba(168, 85, 247, 0.6), 
              0 0 30px rgba(168, 85, 247, 0.4);
            `}</style>
      {firstPart != ROUTES.VIDEO_LEARNING &&
        firstPart != ROUTES.PREMIUM &&
        firstPart != ROUTES.EXAM_INFO &&
        firstPart != ROUTES.EXAM_RECONFIRM &&
        firstPart != ROUTES.TEST_MAIN_PAGE &&
        (
          <button
            onClick={() => {
              navigate(ROUTES.PREMIUM);
            }}
            className="
            fixed top-4 right-4 sm:right-8 z-30 flex items-center gap-1 rounded-full 
            py-2 ps-2.5 pe-3 text-sm font-semibold
            bg-gray-200/50 dark:bg-[#373669]/50 backdrop-blur-md
            text-gray 
            hover:text-white 
            hover:bg-[#E4E4F6] dark:hover:bg-[#414071] 
            hover:bg-gradient-to-r from-blue-600 to-purple-700 
            hover:backdrop-blur-0 hover:bg-opacity-100
            cursor-pointer transition-all duration-300
            glow-purple transform hover:scale-105 focus:outline-none
          "
          >
            <SparklesIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Upgrade plan</span>
            <span className="sm:hidden">Upgrade</span>
          </button>
        )}
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 dark:bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-card text-foreground border-r border-border flex flex-col z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static w-72 ${
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
        <div className="p-4 border-border bg-card text-foreground flex items-center justify-between flex-shrink-0 h-[65px]">
          {/* Title hides when contracted on large screens */}
          <div
            className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${
              isContracted ? "lg:w-0" : "lg:w-auto"
            }`}
          >
            <img src={AiPadhaiLogo} alt="Logo" width={30} height={30} />
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
            className="hidden lg:block flex items-center justify-center text-muted-foreground hover:text-foreground focus:outline-none rounded-lg p-2 cursor-pointer"
          >
            {isContracted ? (
              isHovering ? (
                <ChevronsLeft size={30} className="rotate-180" />
              ) : (
                <img src={AiPadhaiLogo} alt="Logo" width={30} height={30} />
              )
            ) : (
              <ChevronsLeft size={30} />
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onToggle}
            className="lg:hidden text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-lg p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto min-h-0 bg-card text-foreground">
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
                      if (item.path === ROUTES.TEST_SERIES) {
                        onContractToggle();
                      }
                    }}
                    className={`group flex items-center ${
                      isContracted ? "" : "space-x-3"
                    } p-3 rounded-lg transition-colors ${
                      isContracted ? "lg:justify-center" : ""
                    } ${
                      isActive(item.path)
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={`flex-shrink-0 ${
                        isActive(item.path)
                          ? "text-white"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />
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
          onExamConfigurationClick={onExamConfigurationClick}
          onToggle={onToggle}
        />
      </aside>
    </>
  );
};

export default Sidebar;
