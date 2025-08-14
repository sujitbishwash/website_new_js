import { useUser } from "@/contexts/UserContext";
import { ROUTES } from "@/routes/constants";
import { theme } from "@/styles/theme";
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
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7.916 11.001a3.166 3.166 0 0 1 3.095 2.5h5.655l.135.014a.665.665 0 0 1 0 1.303l-.135.013h-5.655a3.166 3.166 0 0 1-6.19 0H3.334a.665.665 0 0 1 0-1.33h1.489a3.17 3.17 0 0 1 3.094-2.5m0 1.33a1.836 1.836 0 1 0 .001 3.671 1.836 1.836 0 0 0 0-3.67m4.167-9.663c1.52 0 2.79 1.072 3.095 2.5h1.488l.135.014a.665.665 0 0 1 0 1.303l-.135.013H15.18a3.166 3.166 0 0 1-6.19 0H3.334a.665.665 0 0 1 0-1.33H8.99a3.166 3.166 0 0 1 3.094-2.5m0 1.33a1.835 1.835 0 1 0 0 3.67 1.835 1.835 0 0 0 0-3.67" /></svg>
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
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><g stroke-width="0" /><g stroke-linecap="round" stroke-linejoin="round" /><g stroke="currentColor" stroke-width="1.5"><path d="M2.5 8.681c0 -2.665 0 -3.998 0.315 -4.446 0.314 -0.448 1.567 -0.877 4.072 -1.734l0.477 -0.163C8.671 1.89 9.323 1.667 10 1.667s1.329 0.223 2.635 0.671l0.477 0.163c2.506 0.857 3.758 1.287 4.072 1.734C17.5 4.683 17.5 6.017 17.5 8.681v1.312c0 4.698 -3.533 6.979 -5.749 7.947C11.15 18.202 10.85 18.333 10 18.333s-1.15 -0.132 -1.751 -0.394C6.032 16.971 2.5 14.692 2.5 9.992z" /><path cx="12" cy="9" r="2" d="M11.667 7.5A1.667 1.667 0 0 1 10 9.167A1.667 1.667 0 0 1 8.333 7.5A1.667 1.667 0 0 1 11.667 7.5z" /><path d="M13.333 12.5c0 0.921 0 1.667 -3.333 1.667s-3.333 -0.746 -3.333 -1.667 1.492 -1.667 3.333 -1.667 3.333 0.746 3.333 1.667Z" /></g></svg>

          ),
          trailingIcon: (
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(270)" width="20" height="20"><g stroke-width="0" /><g stroke-linecap="round" stroke-linejoin="round" /><path d="m5.833 5.833 8.333 8.333m0 0V5.833m0 8.333H5.833" stroke="currentColor" stroke-width="1.6666666666666667" stroke-linecap="round" stroke-linejoin="round" /></svg>
          ),
          label: "Privacy Policy",
          action: handlePrivacyPolicyClick,
        },
        {
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M16.001 9.042V7.337c0-.711 0-1.205-.031-1.588a2.4 2.4 0 0 0-.112-.615l-.056-.13a1.84 1.84 0 0 0-.676-.732L15 4.202c-.158-.08-.37-.137-.745-.168-.383-.031-.877-.032-1.588-.032H7.333c-.71 0-1.204 0-1.588.032a2.4 2.4 0 0 0-.615.111L5 4.202a1.84 1.84 0 0 0-.731.676l-.07.126c-.081.158-.138.37-.168.745-.032.383-.033.877-.033 1.588v5.33c0 .71.001 1.204.033 1.588.03.375.087.587.167.745l.07.126c.177.287.43.522.732.676l.13.055c.144.052.333.09.615.113.384.03.877.032 1.588.032h3.262c.55 0 .874-.008 1.1-.03a4 4 0 0 1-.278-.533l-.053-.14a3.17 3.17 0 0 1 .841-3.348l.114-.099c.277-.225.643-.427 1.152-.714l2.453-1.38.034.062c.007-.032.017-.063.022-.095l.011-.103c.01-.113.01-.269.01-.58m-1.878 3.256c-.487.274-.732.415-.885.525l-.128.102a1.84 1.84 0 0 0-.489 1.942l.065.151c.04.083.099.182.181.319.142-.185.311-.47.624-1.016l1.404-2.458zM10 9.335a.666.666 0 0 1 0 1.33H6.666a.665.665 0 0 1 0-1.33zM7.796 6.002l.134.013a.665.665 0 0 1 0 1.303l-.134.014h-1.13a.665.665 0 0 1 0-1.33zm5.537 0 .134.013a.665.665 0 0 1 0 1.303l-.134.014h-3.037a.665.665 0 0 1 0-1.33zm3.998 3.04c0 .281.002.497-.014.695l-.024.194a3 3 0 0 1-.114.479l-.054.155a3 3 0 0 1-.169.364l-.239.427-2.071 3.625c-.348.608-.595 1.053-.913 1.392l-.142.14a3.2 3.2 0 0 1-.986.607l-.158.055c-.502.164-1.052.157-1.852.157H7.333c-.689 0-1.246 0-1.696-.036-.4-.033-.761-.098-1.098-.242l-.142-.067a3.17 3.17 0 0 1-1.262-1.166l-.122-.218c-.192-.376-.271-.782-.309-1.24-.036-.45-.036-1.007-.036-1.696v-5.33c0-.69 0-1.246.036-1.697.038-.457.117-.863.309-1.24l.122-.219c.304-.495.74-.9 1.262-1.165l.142-.066c.337-.144.697-.21 1.098-.242.45-.037 1.007-.036 1.696-.036h5.333c.69 0 1.246-.001 1.697.036.458.037.864.116 1.24.308l.219.122c.495.305.9.741 1.165 1.262l.066.143c.144.336.21.697.242 1.097.037.45.036 1.008.036 1.697z" />
            </svg>

          ),
          trailingIcon: (
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(270)" width="20" height="20"><g stroke-width="0" /><g stroke-linecap="round" stroke-linejoin="round" /><path d="m5.833 5.833 8.333 8.333m0 0V5.833m0 8.333H5.833" stroke="currentColor" stroke-width="1.6666666666666667" stroke-linecap="round" stroke-linejoin="round" /></svg>
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
            borderColor: theme.divider,
          }}
          className="bg-gray-700 absolute bottom-full left-0 mb-1 w-64 p-2 rounded-t-lg shadow-2xl z-20 border animate-fade-in-up text-foreground"
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
                    style={{ color: theme.primaryText }}
                    className="w-full flex items-center justify-between space-x-3 p-2 text-left text-sm rounded-md transition-colors duration-200 hover:bg-accent hover:text-accent-foreground hover:text-white cursor-pointer"
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor =
                        theme.divider;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span>
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

                            <span className="w-full">
                              {child.label}
                            </span>
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
