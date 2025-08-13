import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import {
  markAsReturningUser,
  markSplashAsSeen,
  resetFirstTimeUser,
} from "../lib/utils";
import { ROUTES } from "../routes/constants";

//import { useNavigate } from "react-router-dom";

// --- SVG ICON COMPONENTS ---
// Using simple inline SVGs for icons to keep it self-contained.
const GeneralIcon = () => (
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
    <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path>
  </svg>
);
const AccountIcon = () => (
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
);
const NotificationsIcon = () => (
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
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);
const PersonalizationIcon = () => (
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
    <path d="m12 14 4-4"></path>
    <path d="M3.34 19a10 10 0 1 1 17.32 0"></path>
  </svg>
);
const SecurityIcon = () => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const DevelopmentIcon = () => (
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
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);
const BillingIcon = () => (
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
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);
const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M8 5v14l11-7z"></path>
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
  gender: "Male" | "Female" | "Other" | "Prefer not to say" | "";
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

// --- MOCK DATA & CONSTANTS ---
const createInitialUserProfile = (profile: any): UserProfile => ({
  name: profile?.name || "User",
  email: profile?.email || "user@example.com",
  mobile: profile?.phone || "+1 (555) 123-4567",
  address: "123 Learning Lane, Apt 4B",
  city: "Eduville",
  state: "Knowledge",
  country: "United States",
  gender: "Prefer not to say",
  dob: "1995-08-15",
});

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
  { name: "General", icon: GeneralIcon },
  { name: "Account", icon: AccountIcon },
  { name: "Notifications", icon: NotificationsIcon },
  { name: "Personalization", icon: PersonalizationIcon },
  { name: "Plan and Billing", icon: BillingIcon },
  { name: "Privacy and Security", icon: SecurityIcon },
  { name: "Development", icon: DevelopmentIcon },
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
    <label className="block text-sm font-medium text-gray-400">{label}</label>
    {isEditing ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="off"
      />
    ) : (
      <p className="mt-1 text-base text-white">{value}</p>
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
    <label className="block text-sm font-medium text-gray-400">{label}</label>
    {isEditing ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 rounded-md shadow-sm bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <p className="mt-1 text-base text-white">{value}</p>
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
    <label className="block text-sm font-medium text-gray-400">{label}</label>
    {isEditing ? (
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    ) : (
      <p className="mt-1 text-base text-white">{value}</p>
    )}
  </div>
);

// Generic setting row for the "General" tab
const SettingRow: React.FC<SettingRowProps> = ({
  title,
  description,
  children,
}) => (
  <div className="py-4 flex justify-between items-center border-b border-gray-700">
    <div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
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
  <div className="py-4 flex justify-between items-center border-b border-gray-700">
    <div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400 max-w-md">{description}</p>
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
      className="w-40 pl-3 pr-10 py-2 rounded-md shadow-sm bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

  // State for new "General" settings
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [language, setLanguage] = useState("Auto-detect");
  const [spokenLanguage, setSpokenLanguage] = useState("Auto-detect");
  const [voice, setVoice] = useState("Breeze");
  const [showSuggestions, setShowSuggestions] = useState(true);

  // State for new notification settings
  const [responseNotifications, setResponseNotifications] = useState("Push");
  const [taskNotifications, setTaskNotifications] = useState("Push, Email");

  // State for "Privacy and Security" settings
  const [mfaEnabled, setMfaEnabled] = useState(false);

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
            <h1 className="text-3xl font-bold text-white mb-6">General</h1>
            <SettingRow title="Theme">
              <ModeToggle />
            </SettingRow>
            <SettingRow title="Accent color">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Default</span>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 p-1 bg-gray-700 border border-gray-600 rounded-full cursor-pointer"
                />
              </div>
            </SettingRow>
            <SettingRow title="Language">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-40 pl-3 pr-10 py-2 rounded-md shadow-sm bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Auto-detect</option>
                <option>English</option>
                <option>Spanish</option>
              </select>
            </SettingRow>
            <SettingRow
              title="Spoken language"
              description="For best results, select the language you mainly speak. If it's not listed, it may still be supported via auto-detection."
            >
              <select
                value={spokenLanguage}
                onChange={(e) => setSpokenLanguage(e.target.value)}
                className="w-40 pl-3 pr-10 py-2 rounded-md shadow-sm bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Auto-detect</option>
                <option>English (US)</option>
                <option>English (UK)</option>
              </select>
            </SettingRow>
            <SettingRow title="Voice">
              <button className="flex items-center gap-2 text-white hover:bg-gray-700 px-3 py-1.5 rounded-md transition-colors">
                <PlayIcon /> Play
              </button>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-40 pl-3 pr-10 py-2 rounded-md shadow-sm bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Breeze</option>
                <option>Cove</option>
                <option>Juniper</option>
              </select>
            </SettingRow>
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
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white">Your Account</h1>
                <p className="mt-1 text-gray-400">
                  View and edit your personal information.
                </p>
              </div>
              <button
                onClick={toggleEditMode}
                className="px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:shadow-lg focus:shadow-blue-500/50 bg-gradient-to-r from-blue-600 to-blue-700"
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

            <hr className="border-t border-gray-700" />

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
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Password
                </label>
                <p className="mt-1 text-base text-white">********</p>
              </div>
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
            </div>
          </div>
        );
      case "Notifications":
        return (
          <div>
            <h1 className="text-3xl font-bold text-white mb-6">
              Notifications
            </h1>
            <NotificationSettingRow
              title="Responses"
              description="Get notified when ChatGPT responds to requests that take time, like research or image generation."
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
            <SettingRow
              title="Upgrade"
              description="You are currently on the free plan"
            >
              <button
                onClick={onUpgradeClick}
                className="px-5 py-2 text-sm font-semibold bg-white text-gray-900 rounded-lg shadow-md hover:bg-gray-200 transition-colors"
              >
                Upgrade Plan
              </button>
            </SettingRow>
            <div className="mt-8 p-6 bg-gray-700/50 rounded-lg">
              <h2 className="text-xl font-bold text-white">
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
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case "Privacy and Security":
        return (
          <div>
            <h1 className="text-3xl font-bold text-white mb-6">Security</h1>
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
              <button className="px-4 py-1.5 text-sm font-semibold text-white bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors">
                Log out
              </button>
            </SettingRow>
            <SettingRow
              title="Log out of all devices"
              description="Log out of all active sessions across all devices, including your current session. It may take up to 30 minutes for other devices to be logged out."
            >
              <button className="px-4 py-1.5 text-sm font-semibold text-white bg-red-600/20 hover:bg-red-500/30 border border-red-500 rounded-lg transition-colors">
                Log out all
              </button>
            </SettingRow>
          </div>
        );
      case "Development":
        return (
          <div>
            <h1 className="text-3xl font-bold text-white mb-6">
              Development Tools
            </h1>
            <p className="text-gray-400 mb-6">
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
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
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
                    className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    Mark Splash as Completed
                  </button>
                  <button
                    onClick={() => {
                      navigate(ROUTES.SPLASH);
                    }}
                    className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
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
            </div>
          </div>
        );
      default:
        return (
          <div className="text-white flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl font-bold">{activeTab}</h1>
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
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slide-in {
          0% { opacity: 0; transform: scale(0.95) translateY(-10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>

      {/* Backdrop: Added backdrop-blur-sm for the blur effect and adjusted opacity */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
        {/* Modal content: Attach the ref here */}
        <div
          ref={modalRef}
          className="w-full max-w-4xl h-[600px] mx-4 rounded-xl shadow-2xl bg-gray-800 flex overflow-hidden animate-slide-in"
        >
          {/* Left Side Navigation */}
          <nav className="w-1/4 bg-gray-900 p-3 flex flex-col">
            <div
              className="flex justify-between items-center mb-8"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
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
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <ul>
              {navItems.map((item) => (
                <li key={item.name} className="mb-2">
                  <a
                    href="#"
                    onClick={() => setActiveTab(item.name)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === item.name
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <item.icon />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side Content */}
          <main className="w-3/4 p-8 overflow-y-auto">{renderContent()}</main>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
