import { Menu } from "lucide-react";
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from "../routes/constants";
import LogoutModal from "./LogoutModal";
import ProfileModal from "./ProfilePage";
import Sidebar from "./sidebar/Sidebar";

const Layout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleProfileClick = () => {
    setProfileModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    // Navigate to login page
    navigate(ROUTES.LOGIN);
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
      <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
        <Sidebar
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          onLogoutClick={handleLogoutClick}
          onProfileClick={handleProfileClick}
        />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with hamburger menu */}
          <header className="bg-gray-800 border-b border-gray-700 p-4 lg:hidden flex-shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
            >
              <Menu size={24} />
            </button>
          </header>
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
      <ProfileModal isOpen={isProfileModalOpen} onClose={handleProfileClose} />
    </>
  );
};

export default Layout;
