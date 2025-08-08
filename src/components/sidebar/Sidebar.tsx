import {
  Award,
  Book,
  Clock,
  FileCheck,
  FileQuestion,
  FileText,
  Gift,
  Home,
  LogOut,
  Star,
  X,
} from "lucide-react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../routes/constants";
import ThemeToggle from "../ThemeToggle";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
          className="fixed inset-0 backdrop-blur-sm z-30 lg:hidden"
          style={{ backgroundColor: "var(--color-overlay)" }}
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen flex flex-col z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
        style={{
          width: "256px",
          backgroundColor: "var(--color-background-secondary)",
          borderRight: "1px solid var(--color-border)",
        }}
      >
        {/* Header with close button for mobile */}
        <div
          className="p-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--color-primary-text)" }}
          >
            AI Padhai
          </h1>
          <div className="flex items-center space-x-2">
            <ThemeToggle size="sm" variant="icon" />
            <button
              onClick={onToggle}
              className="lg:hidden rounded-lg p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                color: "var(--color-secondary-text)",
                backgroundColor: "transparent",
              }}
            >
              <X size={20} />
            </button>
          </div>
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
                        ? "bg-[var(--color-primary)] text-[var(--color-inverse-text)] hover:bg-[var(--color-primary-hover)]"
                        : "text-[var(--color-secondary-text)] hover:bg-[var(--color-card-hover)] hover:text-[var(--color-primary-text)]"
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

        {/* User Profile Section */}
        <div
          className="p-4 flex-shrink-0"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div
              className="rounded-full p-2"
              style={{ backgroundColor: "var(--color-background-tertiary)" }}
            >
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
                style={{ color: "var(--color-secondary-text)" }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="10" r="3"></circle>
                <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
              </svg>
            </div>
            <div className="flex-1">
              <p
                className="font-medium"
                style={{ color: "var(--color-primary-text)" }}
              >
                Free Plan
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--color-secondary-text)" }}
              >
                {user?.email || "learner@aipadhai.com"}
              </p>
            </div>
          </div>

          {/* Profile and Logout Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => {
                navigate(ROUTES.PROFILE);
                // Close sidebar on mobile when clicking profile
                if (window.innerWidth < 1024) {
                  onToggle();
                }
              }}
              className="w-full flex items-center space-x-3 p-2 rounded-lg transition-colors"
              style={{
                color: "var(--color-secondary-text)",
                backgroundColor: "transparent",
              }}
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
              className="w-full flex items-center space-x-3 p-2 rounded-lg transition-colors"
              style={{
                color: "var(--color-secondary-text)",
                backgroundColor: "transparent",
              }}
            >
              <LogOut size={20} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
