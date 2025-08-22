import { useUser } from "@/contexts/UserContext";
import { ROUTES } from "@/routes/constants";
import { theme } from "@/styles/theme";
import {
  CircleUserRound,
  Ellipsis,
  ExternalLink,
  LifeBuoy,
  LogOut,
  ScrollText,
  Settings,
  Settings2,
  ShieldUser,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// --- TYPE DEFINITIONS ---
type MenuItem = {
  icon: React.ReactNode;
  trailingIcon?: React.ReactNode;
  label: string;
  action?: () => void;
  isDivider?: boolean;
  children?: MenuItem[];
};

// --- HELPER COMPONENTS ---
const Icon = ({
  path,
  className = "w-5 h-5",
  style,
}: {
  path: string;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
    style={style}
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
  onExamConfigurationClick: () => void;
  onToggle: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  isContracted,
  onLogoutClick,
  onProfileClick,
  onUpgradeClick,
  onExamConfigurationClick,
  onToggle,
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { profile, isLoading, error, isDataLoaded, isBackgroundLoading } =
    useUser();

  // Debug logging
  console.log("MoreOptions - Profile:", profile);
  console.log("MoreOptions - Loading:", isLoading);
  console.log("MoreOptions - Error:", error);
  console.log("MoreOptions - Data Loaded:", isDataLoaded);
  console.log("MoreOptions - Background Loading:", isBackgroundLoading);
  console.log(
    "MoreOptions - Email being displayed:",
    profile?.email || "user@example.com"
  );



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
  
  const handleExamConfigurationClick = () => {
    onToggle(); // Close the sidebar if it's open
    onExamConfigurationClick();
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    onToggle(); // Close the sidebar if it's open
    onProfileClick();
    setMenuOpen(false);
  };

  const handleUpgradeClick = () => {
    onToggle(); // Close the sidebar if it's open
    onUpgradeClick();
    setMenuOpen(false);
  };

  const handlePrivacyPolicyClick = () => {
    onToggle(); // Close the sidebar if it's open
    window.open(ROUTES.PRIVACY_POLICY, "_blank");
  };

  const handleTermsOfUseClick = () => {
    onToggle(); // Close the sidebar if it's open
    window.open(ROUTES.TERMS_AND_CONDITIONS, "_blank");
  };
const handleLogoutClick = () => {
    onToggle(); // Close the sidebar if it's open
        onLogoutClick();
        setMenuOpen(false);
      };
  const menuOptions: MenuItem[] = [
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.665 10C17.665 10.6877 17.1785 11.2454 16.5488 11.3945L16.4219 11.4189C14.7098 11.6665 13.6129 12.1305 12.877 12.8623C12.1414 13.5938 11.6742 14.6843 11.4238 16.3887C11.3197 17.0973 10.7182 17.665 9.96484 17.665C9.27085 17.665 8.68836 17.1772 8.53613 16.5215C8.12392 14.7459 7.6623 13.619 6.95703 12.8652C6.31314 12.1772 5.39414 11.7268 3.88672 11.4688L3.57715 11.4199C2.88869 11.319 2.33496 10.734 2.33496 10C2.33496 9.26603 2.88869 8.681 3.57715 8.58008L3.88672 8.53125C5.39414 8.27321 6.31314 7.82277 6.95703 7.13477C7.6623 6.38104 8.12392 5.25413 8.53613 3.47852L8.56934 3.35742C8.76133 2.76356 9.31424 2.33496 9.96484 2.33496C10.7182 2.33497 11.3197 2.9027 11.4238 3.61133L11.5283 4.22266C11.7954 5.58295 12.2334 6.49773 12.877 7.1377C13.6129 7.86952 14.7098 8.33351 16.4219 8.58105C17.1119 8.68101 17.665 9.26667 17.665 10Z"></path>
        </svg>
      ),
      label: "Upgrade plan",
      action: handleUpgradeClick,
    },
    {
      icon: <Settings2 className="w-5 h-5" />,
      label: "Exam Configuration",
      action: handleExamConfigurationClick,
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      action: handleProfileClick,
    },
    { isDivider: true, label: "", icon: <></> },
    {
      icon: <LifeBuoy className="w-5 h-5" />,
      label: "Help",
      children: [
        {
          icon: <ShieldUser className="w-5 h-5" />,
          trailingIcon: <ExternalLink className="w-5 h-5" />,
          label: "Privacy Policy",
          action: handlePrivacyPolicyClick,
        },
        {
          icon: <ScrollText className="w-5 h-5" />,
          trailingIcon: <ExternalLink className="w-5 h-5" />,
          label: "Terms of Use",
          action: handleTermsOfUseClick,
        },
      ],
    },
    {
      icon: <LogOut className="w-5 h-5" />,
      label: "Log Out",
      action: handleLogoutClick
    },
  ];

  return (
    <div ref={menuRef} className="relative font-sans text-foreground">
      <button
        onClick={toggleMenu}
        className={`flex items-center w-full p-4 transition-colors duration-200 hover:bg-foreground/10 cursor-pointer ${
          isContracted ? "justify-center" : "justify-between"
        }`}
      >
        <div
          className={`flex items-center justify-center"
            }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center"}`}>
            <CircleUserRound className="w-8 h-8 text-muted-foreground" />
          </div>

          <div className={`flex-1 text-left whitespace-nowrap transition-opacity mx-2 ${
              isContracted ? "lg:opacity-0 lg:hidden" : "opacity-100"
            }`}
          >
            <p className="font-medium text-muted-foreground">
              {isLoading ? "Loading..." : profile?.name || "Empty"}
            </p>
            <p className="font-medium text-muted-foreground text-sm">
              {error
                ? "Error loading profile"
                : isDataLoaded
                ? "Free Plan"
                : "Free Plan"}
            </p>
            {isBackgroundLoading && (
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-400">Syncing...</span>
              </div>
            )}
          </div>
        </div>
        <Ellipsis
          className={`w-5 h-5 ${
            isContracted ? "lg:opacity-0 lg:hidden" : "opacity-100"
          }`}
        />
      </button>

      {isMenuOpen && (
        <div className="absolute bottom-full left-2 mb-2 w-60 p-2 rounded-lg shadow-2xl z-20 border border-muted-foreground animate-fade-in-up text-foreground bg-card">
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
                    style={{ color: theme.primaryText }}
                    className="w-full flex items-center justify-between space-x-3 p-2 text-left text-sm rounded-md transition-colors duration-200 hover:bg-accent hover:text-accent-foreground hover:text-white cursor-pointer"
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = theme.divider;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.children && (
                      <Icon
                        path="M8.25 4.5l7.5 7.5-7.5 7.5"
                        className="w-4 h-4"
                      />
                    )}
                  </button>

                  {item.children && activeSubMenu === item.label && (
                    <div className="border border-muted-foreground absolute bg-card left-full top-[-0.5rem] ml-0 w-56 p-2 rounded-lg shadow-2xl z-30 animate-fade-in-up">
                      <div className="space-y-1">
                        {item.children.map((child) => (
                          <button
                            key={child.label}
                            onClick={() => {
                              child.action?.();
                              setMenuOpen(false);
                            }}
                            style={{ color: theme.primaryText }}
                            className="w-full flex items-center space-x-3 p-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground text-gray-300 hover:text-white rounded-md transition-colors duration-200 cursor-pointer"
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor =
                                theme.divider;
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }}
                          >
                            {child.icon}

                            <span className="w-full">{child.label}</span>
                            {child.trailingIcon}
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
  onExamConfigurationClick,
  onToggle,
}: {
  isContracted: boolean;
  onLogoutClick: () => void;
  onProfileClick: () => void;
  onUpgradeClick: () => void;
  onExamConfigurationClick: () => void;
  onToggle: () => void;
}) => {
  return (
    // Set the background on the main container
    <div
      className="flex flex-col justify-end"
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
          onExamConfigurationClick={onExamConfigurationClick}
          onToggle={onToggle}
        />
      </div>
    </div>
  );
};

export default Moreoptions;
