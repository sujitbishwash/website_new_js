import { Menu } from "lucide-react";
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from "../routes/constants";
import LogoutModal from "./LogoutModal";
import ExamConfigurationModal from "./modals/ExamConfigurationModal";
import ProfileModal from "./ProfilePage";
import Sidebar from "./sidebar/Sidebar";

const Layout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isContracted, setIsContracted] = useState(false); // Sidebar is expanded by default on desktop
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide sidebar on exam goal page
  const shouldHideSidebar = location.pathname === ROUTES.EXAM_GOAL;

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleProfileClick = () => {
    setProfileModalOpen(true);
  };

  const handleUpgradeClick = () => {
    navigate(ROUTES.PREMIUM);
    setIsContracted(true);
    setProfileModalOpen(false);
  };

  const handleExamConfigurationClick = () => {
    setIsExamModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    await logout();
    // Navigate to login page after logout is complete
    navigate(ROUTES.LOGIN, { replace: true });
    setLogoutModalOpen(false);
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  const handleProfileClose = () => {
    setProfileModalOpen(false);
  };

  return (
    <>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        {!shouldHideSidebar && (
          <Sidebar
            isOpen={isOpen}
            isContracted={isContracted}
            onToggle={() => setIsOpen(!isOpen)}
            onContractToggle={() => setIsContracted(!isContracted)}
            onLogoutClick={handleLogoutClick}
            onProfileClick={handleProfileClick}
            onUpgradeClick={handleUpgradeClick}
            onExamConfigurationClick={handleExamConfigurationClick}
          />
        )}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with hamburger menu */}
          {!shouldHideSidebar && (
            <header className="bg-card border-b border-border p-4 lg:hidden flex-shrink-0">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-lg p-2"
              >
                <Menu size={24} />
              </button>
            </header>
          )}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Logout Modal - positioned at root level for proper full-screen coverage */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />

      {/* Profile Modal - positioned at root level for proper full-screen coverage */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleProfileClose}
        onUpgradeClick={handleUpgradeClick}
      />

      {/* Exam Configuration Modal - positioned at root level for proper full-screen coverage */}
      <ExamConfigurationModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
      />
    </>
  );
};

export default Layout;
