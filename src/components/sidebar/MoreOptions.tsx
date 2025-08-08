import React, { useEffect, useRef, useState } from "react";

// Centralized theme colors for easy customization.
const theme = {
  background: "#111827",
  cardBackground: "#1F2937",
  inputBackground: "#374151",
  primaryText: "#FFFFFF",
  secondaryText: "#9CA3AF",
  mutedText: "#6B7280",
  accent: "#60A5FA",
  divider: "#4B5563",
};

// --- TYPE DEFINITIONS ---
type MenuItem = {
  icon: React.ReactNode;
  label: string;
  action?: () => void;
  isDivider?: boolean;
  children?: MenuItem[];
};

// --- HELPER COMPONENTS ---
const Icon = ({
  path,
  className = "w-5 h-5",
}: {
  path: string;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

// --- MAIN COMPONENT ---
interface ProfileMenuProps {
  isContracted: boolean;
  onLogoutClick: () => void;
  onProfileClick: () => void;
  onUpgradeClick: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  isContracted,
  onLogoutClick,
  onProfileClick,
  onUpgradeClick,
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    onProfileClick();
    setMenuOpen(false);
  };

  const handleUpgradeClick = () => {
    onUpgradeClick();
    setMenuOpen(false);
  };

  const menuOptions: MenuItem[] = [
    {
      icon: (
        <Icon path="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.48.398.668 1.03.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.003-.827c.293-.24.438-.613-.438-.995s-.145-.755-.438-.995l-1.003-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.072-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281z" />
      ),
      label: "Settings",
      action: handleProfileClick,
    },
    {
      icon: (
        <Icon path="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      ),
      label: "Upgrade to Premium",
      action: handleUpgradeClick,
    },
    {
      icon: (
        <Icon path="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      ),
      label: "Help",
      children: [
        {
          icon: (
            <Icon path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          ),
          label: "Privacy Policy",
        },
        {
          icon: (
            <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          ),
          label: "Terms of Use",
        },
      ],
    },
    { isDivider: true, label: "", icon: <></> },
    {
      icon: (
        <Icon path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
      ),
      label: "Log Out",
      action: () => {
        onLogoutClick();
        setMenuOpen(false);
      },
    },
  ];

  return (
    <div ref={menuRef} className="relative font-sans">
      <button
        onClick={toggleMenu}
        style={{
          backgroundColor: theme.inputBackground,
          // Correctly applying focus ring colors
          "--tw-ring-offset-color": theme.background,
          "--tw-ring-color": theme.accent,
        }}
        className="flex items-center justify-between w-full space-x-2 p-4 transition-colors duration-200 hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 cursor-pointer"
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = theme.divider)
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = theme.inputBackground)
        }
      >
        <div
          className={`flex items-center space-x-4 ${
            isContracted ? "lg:opacity-0 lg:hidden" : "opacity-100"
          }`}
        >
          <div
            style={{ backgroundColor: theme.mutedText }}
            className="w-8 h-8 rounded-full flex items-center justify-center"
          >
            <Icon
              path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              style={{ color: theme.cardBackground }}
              className="w-5 h-5"
            />
          </div>

          <div
            className={`flex-1 text-left whitespace-nowrap transition-opacity ${
              isContracted ? "lg:opacity-0 lg:hidden" : "opacity-100"
            }`}
          >
            <p className="font-medium text-gray-300 text-sm">nikk070@yoyo</p>{" "}
            {/* reduced */}
            <p className="font-medium text-gray-300 text-xs">Free Plan</p>{" "}
            {/* further reduced */}
          </div>
        </div>
        <Icon
          path="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          style={{ color: theme.secondaryText }}
          className={`w-5 h-5 ${
            isContracted ? "lg:opacity-0 lg:hidden" : "opacity-100"
          }`}
        />
        <div
          style={{ backgroundColor: theme.mutedText }}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isContracted ? "opacity-100" : "lg:opacity-0 lg:hidden"
          }`}
        >
          <Icon
            path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            style={{ color: theme.cardBackground }}
            className="w-5 h-5"
          />
        </div>
      </button>

      {isMenuOpen && (
        <div
          style={{
            backgroundColor: theme.cardBackground,
            borderColor: theme.divider,
          }}
          className="absolute bottom-full left-0 mb-2 w-64 p-2 rounded-lg shadow-2xl z-20 border animate-fade-in-up"
        >
          <div className="space-y-1">
            {menuOptions.map((item) =>
              item.isDivider ? (
                <hr
                  key={`divider-${item.label}`}
                  style={{ borderColor: theme.divider }}
                  className="border-t my-1"
                />
              ) : (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    setActiveSubMenu(item.children ? item.label : null)
                  }
                  onMouseLeave={() => item.children && setActiveSubMenu(null)}
                >
                  <button
                    onClick={() => {
                      if (!item.children) {
                        item.action?.();
                      }
                    }}
                    style={{ color: theme.secondaryText }}
                    className="w-full flex items-center justify-between space-x-3 p-2 text-left text-sm rounded-md transition-colors duration-200 hover:bg-gray-700 hover:text-white cursor-pointer"
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor =
                        theme.inputBackground;
                      e.currentTarget.style.color = theme.primaryText;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = theme.secondaryText;
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span className="text-gray-300 hover:bg-gray-700 hover:text-white">
                        {item.label}
                      </span>
                    </div>
                    {item.children && (
                      <Icon
                        path="M8.25 4.5l7.5 7.5-7.5 7.5"
                        className="w-4 h-4"
                      />
                    )}
                  </button>

                  {item.children && activeSubMenu === item.label && (
                    <div
                      style={{
                        backgroundColor: theme.cardBackground,
                        borderColor: theme.divider,
                      }}
                      className="absolute left-full top-[-0.5rem] ml-0 w-56 p-2 rounded-lg shadow-2xl z-30 border animate-fade-in-up"
                    >
                      <div className="space-y-1">
                        {item.children.map((child) => (
                          <button
                            key={child.label}
                            onClick={() => {
                              child.action?.();
                              setMenuOpen(false);
                            }}
                            style={{ color: theme.secondaryText }}
                            className="w-full flex items-center space-x-3 p-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200 cursor-pointer"
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor =
                                theme.inputBackground;
                              e.currentTarget.style.color = theme.primaryText;
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                              e.currentTarget.style.color = theme.secondaryText;
                            }}
                          >
                            {child.icon}
                            <span>{child.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Moreoptions = ({
  isContracted,
  onLogoutClick,
  onProfileClick,
  onUpgradeClick,
}: {
  isContracted: boolean;
  onLogoutClick: () => void;
  onProfileClick: () => void;
  onUpgradeClick: () => void;
}) => {
  return (
    // Set the background on the main container
    <div
      className="flex flex-col justify-end"
      style={{ backgroundColor: theme.background }}
    >
      <style>{`
          @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.2s ease-out; }
          .animate-fade-in-up { animation: fade-in-up 0.2s ease-out; }
        `}</style>
      <div>
        <ProfileMenu
          isContracted={isContracted}
          onLogoutClick={onLogoutClick}
          onProfileClick={onProfileClick}
          onUpgradeClick={onUpgradeClick}
        />
      </div>
    </div>
  );
};

export default Moreoptions;
