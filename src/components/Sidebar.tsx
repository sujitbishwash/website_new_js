import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

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
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems = [
    {
      id: "home",
      label: "Home",
      path: "/dashboard",
      icon: (
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
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
    },
    {
      id: "history",
      label: "History",
      path: "/history",
      icon: (
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
          <path d="M3 3v18h18"></path>
          <path d="m19 9-5 5-4-4-3 3"></path>
        </svg>
      ),
    },
    {
      id: "books",
      label: "Books",
      path: "/books",
      icon: (
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
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
    },
    {
      id: "test-series",
      label: "Test Series",
      path: "/test-series",
      icon: (
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
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>
      ),
    },
    {
      id: "previous-year",
      label: "Previous Year Paper",
      path: "/previous-year",
      icon: (
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
          <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
          <path d="M14 2v6h6"></path>
          <path d="M2 10h3v3a1 1 0 0 0 1 1h3"></path>
          <path d="m9 10-4.5 4.5"></path>
          <path d="m9 15-1-1"></path>
        </svg>
      ),
    },
    {
      id: "attempted-test",
      label: "Attempted Test",
      path: "/attempted-test",
      icon: (
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
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      ),
    },
    {
      id: "premium",
      label: "Premium",
      path: "/premium",
      icon: (
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
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ),
    },
    {
      id: "exams",
      label: "Exams",
      path: "/exams",
      icon: (
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
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <path d="M12 11h4"></path>
          <path d="M12 16h4"></path>
          <path d="M8 11h.01"></path>
          <path d="M8 16h.01"></path>
        </svg>
      ),
    },
    {
      id: "refer-earn",
      label: "Refer and Earn",
      path: "/refer-earn",
      icon: (
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
          <path d="M20 12v10H4V12"></path>
          <path d="M16 6H8a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v0a4 4 0 0 0-4-4Z"></path>
          <path d="M12 12v10"></path>
          <path d="M12 6V2"></path>
        </svg>
      ),
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay for mobile - only show when sidebar is open on mobile */}
      {isOpen && isMobile && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}

      {/* Overlay for desktop - show when sidebar is open on desktop */}
      {isOpen && !isMobile && (
        <div
          className="sidebar-overlay desktop-overlay"
          onClick={onClose}
        ></div>
      )}

      {/* Floating toggle button - show when sidebar is closed */}
      {!isOpen && onToggle && (
        <button
          className="sidebar-floating-toggle"
          onClick={onToggle}
          aria-label="Open sidebar"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
          </svg>
        </button>
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-header-content">
            <h1 className="sidebar-title">AI Padhai</h1>
            {onToggle && (
              <button
                className="sidebar-toggle-btn"
                onClick={onToggle}
                aria-label="Close sidebar"
              >
                X
              </button>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {/* Home */}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/dashboard");
                }}
                className={isActive("/dashboard") ? "active" : ""}
              >
                {menuItems[0].icon}
                <span>Home</span>
              </a>
            </li>

            {/* History */}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/history");
                }}
                className={isActive("/history") ? "active" : ""}
              >
                {menuItems[1].icon}
                <span>History</span>
              </a>
            </li>

            {/* Books */}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/books");
                }}
                className={isActive("/books") ? "active" : ""}
              >
                {menuItems[2].icon}
                <span>Books</span>
              </a>
            </li>

            <li className="sidebar-divider"></li>

            {/* Test Series */}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/test-series");
                }}
                className={isActive("/test-series") ? "active" : ""}
              >
                {menuItems[3].icon}
                <span>Test Series</span>
              </a>
            </li>

            {/* Previous Year Paper */}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/previous-year");
                }}
                className={isActive("/previous-year") ? "active" : ""}
              >
                {menuItems[4].icon}
                <span>Previous Year Paper</span>
              </a>
            </li>

            {/* Attempted Test */}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/attempted-test");
                }}
                className={isActive("/attempted-test") ? "active" : ""}
              >
                {menuItems[5].icon}
                <span>Attempted Test</span>
              </a>
            </li>

            <li className="sidebar-divider"></li>

            {/* Premium */}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/premium");
                }}
                className={isActive("/premium") ? "active" : ""}
              >
                {menuItems[6].icon}
                <span>Premium</span>
              </a>
            </li>

            {/* Exams */}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/exams");
                }}
                className={isActive("/exams") ? "active" : ""}
              >
                {menuItems[7].icon}
                <span>Exams</span>
              </a>
            </li>

            {/* Refer and Earn */}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/refer-earn");
                }}
                className={isActive("/refer-earn") ? "active" : ""}
              >
                {menuItems[8].icon}
                <span>Refer and Earn</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-plan-info">
            <div className="user-avatar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="10" r="3"></circle>
                <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
              </svg>
            </div>
            <div className="user-details">
              <span className="plan-name">Free Plan</span>
              <span className="user-email">learner@aipadhai.com</span>
            </div>
          </div>
          {onLogout && (
            <button
              className="logout-button"
              onClick={onLogout}
              aria-label="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16,17 21,12 16,7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
