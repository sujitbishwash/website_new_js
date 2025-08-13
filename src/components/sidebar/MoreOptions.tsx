import { ROUTES } from "@/routes/constants";
import { theme } from "@/styles/theme";
import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@/contexts/UserContext";

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
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  isContracted,
  onLogoutClick,
  onProfileClick,
  onUpgradeClick,
  onExamConfigurationClick,
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { profile, isLoading, error } = useUser();

  // Debug logging
  console.log('MoreOptions - Profile:', profile);
  console.log('MoreOptions - Loading:', isLoading);
  console.log('MoreOptions - Error:', error);

  const handleExamConfigurationClick = () => {
    onExamConfigurationClick();
    setMenuOpen(false);
  };

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
  ///yo
  const handleProfileClick = () => {
    onProfileClick();
    setMenuOpen(false);
  };

  const handleUpgradeClick = () => {
    onUpgradeClick();
    setMenuOpen(false);
  };

  const handlePrivacyPolicyClick = () => {
    window.open(ROUTES.PRIVACY_POLICY, "_blank");
  };

  const handleTermsOfUseClick = () => {
    window.open(ROUTES.TERMS_AND_CONDITIONS, "_blank");
  };

  const menuOptions: MenuItem[] = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" ><path d="M17.665 10C17.665 10.6877 17.1785 11.2454 16.5488 11.3945L16.4219 11.4189C14.7098 11.6665 13.6129 12.1305 12.877 12.8623C12.1414 13.5938 11.6742 14.6843 11.4238 16.3887C11.3197 17.0973 10.7182 17.665 9.96484 17.665C9.27085 17.665 8.68836 17.1772 8.53613 16.5215C8.12392 14.7459 7.6623 13.619 6.95703 12.8652C6.31314 12.1772 5.39414 11.7268 3.88672 11.4688L3.57715 11.4199C2.88869 11.319 2.33496 10.734 2.33496 10C2.33496 9.26603 2.88869 8.681 3.57715 8.58008L3.88672 8.53125C5.39414 8.27321 6.31314 7.82277 6.95703 7.13477C7.6623 6.38104 8.12392 5.25413 8.53613 3.47852L8.56934 3.35742C8.76133 2.76356 9.31424 2.33496 9.96484 2.33496C10.7182 2.33497 11.3197 2.9027 11.4238 3.61133L11.5283 4.22266C11.7954 5.58295 12.2334 6.49773 12.877 7.1377C13.6129 7.86952 14.7098 8.33351 16.4219 8.58105C17.1119 8.68101 17.665 9.26667 17.665 10Z"></path></svg>
      ),
      label: "Upgrade plan",
      action: handleUpgradeClick,
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7.916 11.001a3.166 3.166 0 0 1 3.095 2.5h5.655l.135.014a.665.665 0 0 1 0 1.303l-.135.013h-5.655a3.166 3.166 0 0 1-6.19 0H3.334a.665.665 0 0 1 0-1.33h1.489a3.17 3.17 0 0 1 3.094-2.5m0 1.33a1.836 1.836 0 1 0 .001 3.671 1.836 1.836 0 0 0 0-3.67m4.167-9.663c1.52 0 2.79 1.072 3.095 2.5h1.488l.135.014a.665.665 0 0 1 0 1.303l-.135.013H15.18a3.166 3.166 0 0 1-6.19 0H3.334a.665.665 0 0 1 0-1.33H8.99a3.166 3.166 0 0 1 3.094-2.5m0 1.33a1.835 1.835 0 1 0 0 3.67 1.835 1.835 0 0 0 0-3.67"/></svg>
      ),
      label: "Exam Configuration",
      action: handleExamConfigurationClick,
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M10.323 1.627c.828 0 1.595.439 2.014 1.154l.822 1.4.053.07c.062.06.145.096.233.096l1.615.013.154.007c.768.057 1.463.49 1.85 1.164l.329.571.073.136c.315.642.318 1.395.008 2.04l-.071.136-.803 1.422a.34.34 0 0 0 0 .329l.803 1.42.071.137c.31.645.308 1.398-.008 2.04l-.073.136-.328.571a2.34 2.34 0 0 1-1.85 1.165l-.155.005-1.615.014a.34.34 0 0 0-.233.097l-.053.068-.822 1.401a2.34 2.34 0 0 1-2.014 1.155h-.647a2.33 2.33 0 0 1-1.931-1.024l-.082-.13-.822-1.402a.34.34 0 0 0-.2-.153l-.086-.012-1.615-.014A2.34 2.34 0 0 1 3.016 14.6l-.081-.13-.328-.572a2.34 2.34 0 0 1-.01-2.312l.802-1.421.033-.08a.34.34 0 0 0 0-.17l-.033-.08-.802-1.421a2.33 2.33 0 0 1 .01-2.312l.328-.571.081-.13A2.34 2.34 0 0 1 4.94 4.36l1.615-.013.086-.011a.34.34 0 0 0 .2-.155l.822-1.4.082-.13a2.34 2.34 0 0 1 1.931-1.024zm-.647 1.33c-.312 0-.603.144-.792.386l-.074.11-.821 1.401c-.26.443-.706.737-1.206.807l-.217.016-1.615.013c-.312.003-.603.15-.79.394l-.074.11-.328.571a1 1 0 0 0-.004.995l.802 1.421.095.196c.161.399.16.846 0 1.246l-.095.196-.802 1.42c-.174.31-.173.688.004.996l.328.57.075.11a1 1 0 0 0 .789.394l1.615.014.217.015c.5.07.946.366 1.206.808l.821 1.4.074.11c.189.242.48.388.792.388h.647c.356 0 .686-.19.867-.497l.821-1.4.122-.181c.31-.4.788-.639 1.301-.643l1.615-.014.132-.01c.304-.042.576-.223.732-.494l.328-.57.057-.118c.1-.243.102-.515.004-.758l-.057-.12-.803-1.42a1.67 1.67 0 0 1 0-1.638l.803-1.42.057-.12a1 1 0 0 0-.004-.758l-.057-.118-.328-.571a1 1 0 0 0-.732-.494l-.132-.01-1.615-.013a1.67 1.67 0 0 1-1.3-.642l-.123-.18-.821-1.401a1 1 0 0 0-.867-.497zM11.586 10a1.586 1.586 0 1 0-3.173 0 1.586 1.586 0 0 0 3.172 0m1.329 0a2.915 2.915 0 1 1-5.83 0 2.915 2.915 0 0 1 5.83 0" /></svg>
      ),
      label: "Settings",
      action: handleProfileClick,
    },
    { isDivider: true, label: "", icon: <></> },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M10 2.085a7.88 7.88 0 0 1 5.105 1.868l.258-.257.105-.085a.666.666 0 0 1 .836 1.027l-.258.257A7.88 7.88 0 0 1 17.915 10a7.88 7.88 0 0 1-1.87 5.105l.259.258.085.105a.665.665 0 0 1-.921.92l-.105-.084-.258-.258A7.88 7.88 0 0 1 10 17.915a7.88 7.88 0 0 1-5.105-1.87l-.257.259-.105.085a.666.666 0 0 1-.837-1.026l.257-.258A7.88 7.88 0 0 1 2.085 10a7.88 7.88 0 0 1 1.868-5.105l-.257-.257-.085-.105a.666.666 0 0 1 .922-.922l.105.085.257.257A7.88 7.88 0 0 1 10 2.085m2.316 11.172a4 4 0 0 1-2.316.742 4 4 0 0 1-2.317-.741l-1.844 1.844A6.56 6.56 0 0 0 10 16.585a6.56 6.56 0 0 0 4.161-1.483zm-7.419-7.42A6.56 6.56 0 0 0 3.415 10c0 1.579.556 3.027 1.482 4.161l1.845-1.844A4 4 0 0 1 6.002 10c0-.864.274-1.664.74-2.317zm8.36 1.846A4 4 0 0 1 14 10c0 .864-.276 1.663-.742 2.316l1.845 1.845A6.56 6.56 0 0 0 16.585 10a6.56 6.56 0 0 0-1.483-4.161zM10 7.332a2.668 2.668 0 1 0 0 5.337 2.668 2.668 0 0 0 0-5.337m0-3.917a6.56 6.56 0 0 0-4.162 1.482l1.845 1.845A4 4 0 0 1 10 6.002a4 4 0 0 1 2.317.74l1.844-1.845A6.56 6.56 0 0 0 10 3.415" /></svg>
      ),
      label: "Help",
      children: [
        {
          icon: (
            <Icon path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          ),
          label: "Privacy Policy",
          action: handlePrivacyPolicyClick,
        },
        {
          icon: (
            <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          ),
          label: "Terms of Use",
          action: handleTermsOfUseClick,
        },
      ],
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3.502 12.666V7.333c0-.689 0-1.246.036-1.696.037-.458.117-.864.308-1.24l.123-.219c.304-.496.74-.9 1.261-1.165l.143-.066c.336-.145.697-.21 1.097-.243.45-.036 1.008-.036 1.697-.036h1l.134.014a.665.665 0 0 1 0 1.303l-.134.013h-1c-.711 0-1.205.001-1.588.033-.282.023-.472.06-.615.11l-.13.058a1.84 1.84 0 0 0-.732.675L5.032 5c-.08.158-.137.37-.168.745-.031.384-.032.877-.032 1.588v5.333c0 .711 0 1.205.032 1.588.03.376.088.587.168.745l.07.127c.177.288.43.522.732.676l.13.056c.143.051.333.089.615.112.383.031.877.031 1.588.031h1l.134.014a.665.665 0 0 1 0 1.303l-.134.013h-1c-.69 0-1.246.001-1.697-.036-.4-.033-.76-.098-1.097-.242l-.143-.066a3.17 3.17 0 0 1-1.261-1.165l-.123-.218c-.192-.377-.27-.783-.308-1.241-.037-.45-.036-1.008-.036-1.697m10.302 1.138a.666.666 0 0 1-.941-.941zm-.941-7.607a.665.665 0 0 1 .836-.085l.104.085 3.334 3.333c.26.26.26.68 0 .94l-3.334 3.334-.47-.47-.47-.471 2.197-2.198H9.167a.665.665 0 0 1 0-1.33h5.894l-2.198-2.198-.085-.104a.665.665 0 0 1 .085-.836" /></svg>
      ),
      label: "Log Out",
      action: () => {
        onLogoutClick();
        setMenuOpen(false);
      },
    },
  ];

  return (
    <div ref={menuRef} className="relative font-sans bg-card text-foreground">
      <button
        onClick={toggleMenu}
        style={{
          backgroundColor: theme.inputBackground,
        }}
        className="flex items-center justify-between w-full p-4 transition-colors duration-200 hover:bg-accent/20 focus:outline-none focus:ring-1 focus:ring-offset-1 cursor-pointer"
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = theme.divider)
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = theme.inputBackground)
        }
      >
        <div
          className={`flex items-center space-x-4 ${isContracted ? "lg:opacity-0 lg:hidden" : "opacity-100"
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
            className={`flex-1 text-left whitespace-nowrap transition-opacity ${isContracted ? "lg:opacity-0 lg:hidden" : "opacity-100"
              }`}
          >
            <p className="font-medium text-muted-foreground">
              {isLoading ? "Loading..." : profile?.email || "user@example.com"}
            </p>
            <p className="font-medium text-muted-foreground text-xs">
              {error ? "Error loading profile" : "Free Plan"}
            </p>
          </div>
        </div>
        <Icon
          path="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          style={{ color: theme.primaryText }}
          className={`w-5 h-5 ${isContracted ? "lg:opacity-0 lg:hidden" : "opacity-100"
            }`}
        />
        <div
          style={{ backgroundColor: theme.mutedText }}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${isContracted ? "opacity-100" : "lg:opacity-0 lg:hidden"
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
          className="absolute bottom-full left-0 mb-2 w-64 p-2 rounded-lg shadow-2xl z-20 border animate-fade-in-up text-foreground"
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
                    className="w-full flex items-center justify-between space-x-3 p-2 text-left text-sm rounded-md transition-colors duration-200 hover:bg-accent hover:text-accent-foreground cursor-pointer"
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
                    <div className="bg-gray-700  border border-gray-500 absolute left-full top-[-0.5rem] ml-0 w-56 p-2 rounded-lg shadow-2xl z-30 animate-fade-in-up">
                      <div className="space-y-1">
                        {item.children.map((child) => (
                          <button
                            key={child.label}
                            onClick={() => {
                              child.action?.();
                              setMenuOpen(false);
                            }}
                            style={{ color: theme.secondaryText }}
                            className="w-full flex items-center space-x-3 p-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors duration-200 cursor-pointer"
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

                            <span className="text-gray-300 hover:bg-gray-700 hover:text-white">
                              {child.label}
                            </span>
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
}: {
  isContracted: boolean;
  onLogoutClick: () => void;
  onProfileClick: () => void;
  onUpgradeClick: () => void;
  onExamConfigurationClick: () => void;
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
          onExamConfigurationClick={onExamConfigurationClick}
        />
      </div>
    </div>
  );
};

export default Moreoptions;
