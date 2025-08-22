import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import {
  clearAuthData,
  getAuthToken,
  getUserData,
  hasValidAuthToken,
  markAsReturningUser,
  markSplashAsSeen,
  resetFirstTimeUser,
} from "../lib/utils";
import { ROUTES } from "../routes/constants";

const SparklesIcon = () => (
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

// --- TYPESCRIPT INTERFACES ---
interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  gender: "Male" | "Female" | "Other" | "Prefer not to say" | "Not set" | "";
  dob: string; // Date of Birth, format YYYY-MM-DD
}

interface ProfileFieldProps {
  label: string;
  value: string;
  type?: "text" | "email" | "tel";
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: keyof UserProfile;
}

interface SelectFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: keyof UserProfile;
  options: string[];
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick: () => void;
}

interface SettingRowProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

interface NotificationSettingRowProps {
  title: string;
  description: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  manageLink?: boolean;
}

// --- DYNAMIC USER PROFILE CREATION ---
const createInitialUserProfile = (profile: any): UserProfile => {
  console.log("🔄 ProfilePage: Creating user profile from data:", profile);

  // Handle gender field - convert to proper format if needed
  let genderValue:
    | "Male"
    | "Female"
    | "Other"
    | "Prefer not to say"
    | "Not set"
    | "" = "Not set";
  if (profile?.gender) {
    const genderLower = profile.gender.toLowerCase();
    if (genderLower === "male") {
      genderValue = "Male";
    } else if (genderLower === "female") {
      genderValue = "Female";
    } else if (genderLower === "other") {
      genderValue = "Other";
    } else {
      genderValue = "Prefer not to say";
    }
  }

  // Handle date of birth field
  let dobValue = "Not set";
  if (profile?.date_of_birth) {
    dobValue = profile.date_of_birth;
  } else if (profile?.dob) {
    dobValue = profile.dob;
  }

  const userProfile = {
    name: profile?.name || "Not set",
    email: profile?.email || "Not set",
    mobile: profile?.phone || profile?.phoneno || "Not set",
    address: profile?.address || "Not set",
    city: profile?.city || "Not set",
    state: profile?.state || "Not set",
    country: profile?.country || "Not set",
    gender: genderValue,
    dob: dobValue,
  };

  console.log("✅ ProfilePage: Created user profile:", userProfile);
  return userProfile;
};

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "India",
  "Japan",
];
const genders = ["Male", "Female", "Other", "Prefer not to say"];
// Updated navItems to include icons, matching the image provided
const navItems = [
  { name: "General", icon: Settings },
  { name: "Account", icon: CircleUserRound },
  { name: "Notifications", icon: Bell },
  { name: "Personalization", icon: GaugeCircle },
  { name: "Plan and Billing", icon: SparklesIcon },
  { name: "Privacy and Security", icon: KeyRound },
  { name: "Development", icon: Wrench },
];

const features = [
  "Unlimited uploads, pastes, and records",
  "Unlimited AI chats",
  "Unlimited quiz generation",
  "Unlimited practice exams",
  "Extended voice mode usage",
  "Upload files up to 100 pages / 15 MB",
];

// --- HELPER COMPONENTS ---

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  type = "text",
  isEditing,
  onChange,
  name,
}) => (
  <div>
    <label className="block text-sm font-medium text-secondaryText">
      {label}
    </label>
    {isEditing ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm bg-background text-foreground border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="off"
      />
    ) : (
      <div className="flex items-center gap-2">
        <p
          className={`mt-1 text-base ${
            value === "Not set" ? "text-foreground italic" : "text-foreground"
          }`}
        >
          {value}
        </p>
        {value !== "Not set" && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Set
          </span>
        )}
      </div>
    )}
  </div>
);

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  isEditing,
  onChange,
  name,
  options,
}) => (
  <div>
    <label className="block text-sm font-medium text-foreground">{label}</label>
    {isEditing ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 rounded-md shadow-sm bg-background text-foreground border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Select...
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    ) : (
      <p className="mt-1 text-base text-foreground">{value}</p>
    )}
  </div>
);

const DateField: React.FC<{
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: "dob";
}> = ({ label, value, isEditing, onChange, name }) => (
  <div>
    <label className="block text-sm font-medium text-foreground">{label}</label>
    {isEditing ? (
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm bg-background text-foreground border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    ) : (
      <p className="mt-1 text-base text-foreground">{value}</p>
    )}
  </div>
);

// Generic setting row for the "General" tab
const SettingRow: React.FC<SettingRowProps> = ({
  title,
  description,
  children,
}) => (
  <div className="py-4 flex justify-between items-center border-b border-foreground/20">
    <div>
      <h3 className="text-base text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 max-w-md mt-1">{description}</p>
      )}
    </div>
    <div className="flex items-center gap-4">{children}</div>
  </div>
);

// New component for notification settings, as seen in the image
const NotificationSettingRow: React.FC<NotificationSettingRowProps> = ({
  title,
  description,
  value,
  onChange,
  options,
  manageLink,
}) => (
  <div className="py-4 flex justify-between items-center border-b border-foreground/20">
    <div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-sm text-foreground max-w-md">{description}</p>
      {manageLink && (
        <a
          href="#"
          className="text-sm text-blue-500 hover:underline mt-1 inline-block"
        >
          Manage tasks
        </a>
      )}
    </div>
    <select
      value={value}
      onChange={onChange}
      className="w-40 pl-3 pr-10 py-2 rounded-md shadow-sm bg-background text-foreground border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

// --- MAIN MODAL COMPONENT ---
import { useAuth } from "@/contexts/AuthContext";
import {
  Bell,
  CircleCheck,
  CircleUserRound,
  GaugeCircle,
  KeyRound,
  RefreshCcw,
  Settings,
  Wrench,
  X,
} from "lucide-react";
import { AccentToggle } from "./Accent-toggle";
import { ModeToggle } from "./mode-toggle";

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onUpgradeClick,
}) => {
  const navigate = useNavigate();
  const { profile } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    createInitialUserProfile(profile)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("General");
  const modalRef = useRef<HTMLDivElement>(null); // Create a ref for the modal content

  // Update userProfile when profile from UserContext changes
  useEffect(() => {
    if (profile) {
      console.log("🔄 ProfilePage: Profile updated from UserContext:", profile);
      const newUserProfile = createInitialUserProfile(profile);
      setUserProfile(newUserProfile);
      console.log(
        "✅ ProfilePage: User profile state updated:",
        newUserProfile
      );
    } else {
      console.log("⚠️ ProfilePage: No profile data available from UserContext");
    }
  }, [profile]);

  // State for new "General" settings
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [language, setLanguage] = useState("Auto-detect");
  const [spokenLanguage, setSpokenLanguage] = useState("Auto-detect");
  const [voice, setVoice] = useState("Breeze");
  const [showSuggestions, setShowSuggestions] = useState(true);
  // State for new notification settings
  const [responseNotifications, setResponseNotifications] = useState("Push");
  const [taskNotifications, setTaskNotifications] = useState("Push, Email");
  const { logout } = useAuth();

  // State for "Privacy and Security" settings
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const handleLogoutConfirm = async () => {
    await logout();
    // Navigate to login page after logout is complete
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      console.log("Saving data:", userProfile);
      // Here you would typically also handle saving the data to a backend
    }
  };

  // Wrap handleClose in useCallback to prevent it from being recreated on every render,
  // which is important for the useEffect dependency array.
  const handleClose = useCallback(() => {
    if (isEditing) {
      setIsEditing(false);
      setUserProfile(createInitialUserProfile(profile)); // Reset to initial state on close if editing
    }
    onClose();
  }, [isEditing, onClose]);

  // Add an effect to listen for clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // If click is inside modal, ignore
      if (modalRef.current && modalRef.current.contains(target)) return;

      // Ignore clicks inside Radix DropdownMenu portals or triggers
      const isInsideDropdown = Boolean(
        target.closest("[data-slot^='dropdown-menu-']") ||
          target.closest("[data-slot='button']")
      );
      if (isInsideDropdown) return;

      // Otherwise, close modal
      handleClose();
    };

    // Add the event listener when the modal is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClose]); // Rerun effect if isOpen or handleClose changes

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <div>
            <h1 className="text-3xl text-foreground mb-6">General</h1>
            <SettingRow title="Theme">
              <ModeToggle />
            </SettingRow>
            <SettingRow title="Accent color">
              <AccentToggle />
            </SettingRow>
            <SettingRow title="Language">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-40 pl-3 pr-10 py-2 rounded-lg shadow-sm bg-background text-foreground border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option>English</option>
                <option>Hindi</option>
              </select>
            </SettingRow>
            {/*<SettingRow title="Voice">
              <button className="flex items-center gap-2 text-foreground hover:bg-gray-700 px-3 py-1.5 rounded-md transition-colors">
                <PlayIcon /> Play
              </button>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-40 pl-3 pr-10 py-2 rounded-md shadow-sm bg-background text-foreground border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option>Breeze</option>
                <option>Cove</option>
                <option>Juniper</option>
              </select>
            </SettingRow>*/}
            <SettingRow title="Show follow up suggestions in chats">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSuggestions}
                  onChange={() => setShowSuggestions(!showSuggestions)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </SettingRow>
          </div>
        );
      case "Account":
        return (
          <div>
            <div className="items-end mb-6 pb-4 flex justify-between items-center border-b border-foreground/20">
              <div>
                <h1 className="text-3xl  text-foreground">Your Account</h1>
                <p className="mt-1 text-muted-foreground">
                  View and edit your personal information.
                </p>
                {profile && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <CircleCheck className="w-3 h-3" />
                      Data synced from your account
                    </span>
                    {(profile.gender || profile.date_of_birth) && (
                      <div className="mt-1 text-xs text-blue-400">
                        <span className="inline-flex items-center gap-1">
                          <CircleCheck className="w-3 h-3" />
                          Personal details loaded from API
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    console.log("🔄 ProfilePage: Manual refresh requested");
                    // This will trigger a re-render when profile changes
                  }}
                  className="px-2 py-2 rounded-lg bg-background border border-divider hover:bg-foreground/20 transition-colors cursor-pointer"
                  title="Refresh profile data"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleEditMode}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-foreground bg-background border border-divider hover:bg-foreground/20 transition-transform transform hover:scale-105 focus:outline-none focus:shadow-sm cursor-pointer"
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <ProfileField
                label="Full Name"
                name="name"
                value={userProfile.name}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <ProfileField
                label="Email Address"
                name="email"
                value={userProfile.email}
                type="email"
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <ProfileField
                label="Mobile Number"
                name="mobile"
                value={userProfile.mobile}
                type="tel"
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              {false && (
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <p className="mt-1 text-base text-foreground">********</p>
                </div>
              )}
              <DateField
                label="Date of Birth"
                name="dob"
                value={userProfile.dob}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <SelectField
                label="Gender"
                name="gender"
                value={userProfile.gender}
                isEditing={isEditing}
                onChange={handleInputChange}
                options={genders}
              />
              <ProfileField
                label="Address"
                name="address"
                value={userProfile.address}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <ProfileField
                label="City"
                name="city"
                value={userProfile.city}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <ProfileField
                label="State / Province"
                name="state"
                value={userProfile.state}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <SelectField
                label="Country"
                name="country"
                value={userProfile.country}
                isEditing={isEditing}
                onChange={handleInputChange}
                options={countries}
              />

              {/* Debug Information */}
              {process.env.NODE_ENV === "development" && profile && (
                <div className="col-span-1 md:col-span-2 mt-6 p-4 bg-accent rounded-lg border border-divider">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Debug Info (Development Only)
                  </h4>
                  <div className="text-xs text-foreground space-y-1">
                    <div>
                      <strong>Profile ID:</strong> {profile.id || "N/A"}
                    </div>
                    <div>
                      <strong>Last Updated:</strong>{" "}
                      {profile.updatedAt
                        ? new Date(profile.updatedAt).toLocaleString()
                        : "N/A"}
                    </div>
                    <div>
                      <strong>Data Source:</strong> UserContext
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case "Notifications":
        return (
          <div>
            <h1 className="text-3xl text-foreground mb-6">Notifications</h1>
            <NotificationSettingRow
              title="Responses"
              description="Get notified when chatbot responds to requests that take time, like research or image generation."
              value={responseNotifications}
              onChange={(e) => setResponseNotifications(e.target.value)}
              options={["Push", "Email", "None"]}
            />
            <NotificationSettingRow
              title="Tasks"
              description="Get notified when tasks you've created have updates."
              value={taskNotifications}
              onChange={(e) => setTaskNotifications(e.target.value)}
              options={["Push, Email", "Push", "Email", "None"]}
              manageLink
            />
          </div>
        );

      case "Plan and Billing":
        return (
          <div>
            <style>{`.glow-purple:hover {
              box-shadow: 0 0 10px rgba(168, 85, 247, 0.8), 
              0 0 20px rgba(168, 85, 247, 0.6), 
              0 0 30px rgba(168, 85, 247, 0.4);
            `}</style>
            <div className="flex justify-between items-end border-b border-foreground/20 pb-4">
              <div>
                <h1 className="text-3xl  text-foreground">Upgrade</h1>
                <p className="mt-1 text-muted-foreground">
                  You are currently on the free plan
                </p>
              </div>
              <button
                onClick={onUpgradeClick}
                className="flex gap-1 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md hover:bg-purple-100 transition-colors glow-purple transition-transform transform hover:scale-105 focus:outline-none focus:shadow-lg focus:shadow-blue-500/50 bg-gradient-to-r from-blue-600 to-purple-700 cursor-pointer"
              >
                <SparklesIcon />
                Upgrade Plan
              </button>
            </div>
            <div className="mt-8 p-6 bg-accent rounded-lg">
              <h2 className="text-xl text-foreground">
                Get everything in Free, and more.
              </h2>
              <ul className="mt-4 space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="#238636"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case "Privacy and Security":
        return (
          <div>
            <h1 className="text-3xl  text-foreground mb-6">Security</h1>
            <SettingRow
              title="Multi-factor authentication"
              description="Require an extra security challenge when logging in. If you are unable to pass this challenge, you will have the option to recover your account via email."
            >
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={mfaEnabled}
                  onChange={() => setMfaEnabled(!mfaEnabled)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </SettingRow>
            <SettingRow title="Log out of this device">
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-1.5 text-sm font-semibold text-foreground bg-background hover:bg-foreground/20 border border-divider rounded-lg  transition-transform transition-colors transform focus:outline-none focus:shadow-sm cursor-pointer"
              >
                Log out
              </button>
            </SettingRow>
            <SettingRow
              title="Log out of all devices"
              description="Log out of all active sessions across all devices, including your current session. It may take up to 30 minutes for other devices to be logged out."
            >
              <button className="px-4 py-1.5 text-sm font-semibold text-foreground bg-red-600/20 hover:bg-red-500/30 border border-red-500 rounded-lg transition-colors cursor-pointer">
                Log out all
              </button>
            </SettingRow>
          </div>
        );
      case "Development":
        return (
          <div>
            <h1 className="text-3xl text-foreground mb-3">Development Tools</h1>
            <p className="text-muted-foreground mb-6">
              Development and testing utilities for debugging purposes.
            </p>

            <div className="space-y-6">
              <SettingRow
                title="Splash Screen Management"
                description="Reset splash screen state to test the onboarding flow again."
              >
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      resetFirstTimeUser();
                      alert(
                        "Splash screen state has been reset. Refresh the page to see the splash screen again."
                      );
                    }}
                    className="px-4 py-2 text-sm font-semibold text-foreground bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Reset Splash State
                  </button>
                  <button
                    onClick={() => {
                      markSplashAsSeen();
                      markAsReturningUser();
                      alert(
                        'Splash screen state has been set to "completed". User will not see splash again.'
                      );
                    }}
                    className="px-4 py-2 text-sm font-semibold text-foreground bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    Mark Splash as Completed
                  </button>
                  <button
                    onClick={() => {
                      navigate(ROUTES.SPLASH);
                    }}
                    className="px-4 py-2 text-sm font-semibold text-foreground bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    View Splash Screen
                  </button>
                </div>
              </SettingRow>

              <SettingRow
                title="Local Storage Status"
                description="Current state of splash screen related localStorage values."
              >
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">First Time User:</span>
                      <span className="text-white">
                        {localStorage.getItem("aipadhai_first_time_user") ===
                        null
                          ? "Yes (null)"
                          : "No (false)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Has Seen Splash:</span>
                      <span className="text-white">
                        {localStorage.getItem("aipadhai_has_seen_splash") ===
                        "true"
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Should Show Splash:</span>
                      <span className="text-white">
                        {localStorage.getItem("aipadhai_first_time_user") ===
                          null &&
                        localStorage.getItem("aipadhai_has_seen_splash") !==
                          "true"
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              </SettingRow>

              <SettingRow
                title="Authentication Management"
                description="Manage authentication state and tokens for testing."
              >
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      clearAuthData();
                      alert(
                        "Authentication data has been cleared. You will need to login again."
                      );
                    }}
                    className="px-4 py-2 text-sm font-semibold text-foreground bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Clear Auth Data
                  </button>
                  <button
                    onClick={() => {
                      const token = getAuthToken();
                      const userData = getUserData();
                      alert(
                        `Auth Token: ${
                          token ? "Present" : "Not found"
                        }\nUser Data: ${userData ? "Present" : "Not found"}`
                      );
                    }}
                    className="px-4 py-2 text-sm font-semibold text-foreground bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                  >
                    Check Auth Status
                  </button>
                </div>
              </SettingRow>

              <SettingRow
                title="Authentication Status"
                description="Current authentication state."
              >
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Has Valid Token:</span>
                      <span className="text-white">
                        {hasValidAuthToken() ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Auth Token:</span>
                      <span className="text-white">
                        {getAuthToken() ? "Present" : "Not found"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">User Data:</span>
                      <span className="text-white">
                        {getUserData() ? "Present" : "Not found"}
                      </span>
                    </div>
                  </div>
                </div>
              </SettingRow>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-foreground flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl ">{activeTab}</h1>
            <p className="mt-2 text-gray-400">
              Content for this section is not yet implemented.
            </p>
          </div>
        );
    }
  };

  return (
    <>
      <style>{`
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes slide-in { 0% { opacity: 0; transform: scale(0.95) translateY(-10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in p-4">
        <div
          ref={modalRef}
          className="relative w-full max-w-4xl h-[80vh] max-h-[600px] rounded-2xl shadow-2xl bg-card flex flex-col md:flex-row overflow-hidden animate-slide-in"
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-2 text-gray-400 rounded-full hover:bg-foreground/10 hover:text-foreground transition-colors z-10 cursor-pointer"
          >
            <X />
          </button>

          <nav className="w-full md:w-1/3 lg:w-1/4 bg-background p-4 flex-shrink-0 border-b md:border-b-0 md:border-r border-border">
            <h2 className="text-lg font-semibold text-foreground px-2 mt-2 mb-4 hidden md:block">
              Settings
            </h2>
            <ul className="flex flex-row flex-wrap md:flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.name} className="flex-shrink-0">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(item.name);
                    }}
                    className={`flex items-center gap-2 md:gap-3 px-3 py-2 rounded-full md:rounded-md text-sm font-medium transition-colors ${
                      activeTab === item.name
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="whitespace-nowrap md:whitespace-normal">
                      {item.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <main className="w-full md:w-2/3 lg:w-3/4 p-4 md:p-8 overflow-y-auto flex-grow">
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
