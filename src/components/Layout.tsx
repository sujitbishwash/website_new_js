import { Menu } from "lucide-react";
import React, { useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from "../routes/constants";
import LogoutModal from "./LogoutModal";
import ExamConfigurationModal from "./modals/ExamConfigurationModal";
import ProfileModal from "./ProfilePage";
import Sidebar from "./sidebar/Sidebar"; // Adjust path as needed
import BugReportModal from "./modals/BugReportModal";

const Layout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isContracted, setIsContracted] = useState(false); // Sidebar is expanded by default on desktop
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isExamModalOpen, setExamModalOpen] = useState(false);
  const [isBugReportModalOpen, setBugReportModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const appContainerRef = useRef(null);
  // Hide sidebar on exam goal page
  const shouldHideSidebar = location.pathname === ROUTES.EXAM_GOAL;

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleProfileClick = () => {
    setProfileModalOpen(true);
  };

  const onBugReportClick = () => {
    setBugReportModalOpen(true);
  };

  const handleUpgradeClick = () => {
    navigate(ROUTES.PREMIUM);
    setIsContracted(true);
    setProfileModalOpen(false);
  };

  const handleExamConfigurationClick = () => {
    setExamModalOpen(true);
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
      <div className="flex h-screen" ref={appContainerRef}>
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
            onBugReportClick={onBugReportClick}
          />
        )}
        <div className="flex-1 flex flex-col min-w-0">
              
          {/* Header with hamburger menu */}
          {!shouldHideSidebar && (
            
            <header className="absolute top-0 left-0 right-0 z-10 p-4 lg:hidden flex-shrink-0 flex items-center">
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-muted-foreground bg-card border border-gray hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-lg p-2"
              >
                 <Menu className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
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
        onClose={() => setExamModalOpen(false)}
      />

      <BugReportModal
        isOpen={isBugReportModalOpen}
        onClose={() => setBugReportModalOpen(false)}
        appContainerRef={appContainerRef}
      />
    </>
  );
};

export default Layout;
