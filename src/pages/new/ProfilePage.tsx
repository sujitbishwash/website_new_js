import React, { useState } from "react";

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

// --- MOCK DATA & CONSTANTS ---
const initialUserProfile: UserProfile = {
  name: "Alex Doe",
  email: "alex.doe@example.com",
  mobile: "+1 (555) 123-4567",
  address: "123 Learning Lane, Apt 4B",
  city: "Eduville",
  state: "Knowledge",
  country: "United States",
  gender: "Prefer not to say",
  dob: "1995-08-15",
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
const navItems = [
  "Your Account",
  "Personalisation",
  "Plan and Billing",
  "Privacy and Security",
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
        className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
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
        className="mt-1 block w-full pl-3 pr-10 py-2 rounded-md shadow-sm bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
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
        className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
      />
    ) : (
      <p className="mt-1 text-base text-white">{value}</p>
    )}
  </div>
);

// --- MAIN DIALOG COMPONENT ---
const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] =
    useState<UserProfile>(initialUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Your Account");

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

  return (
    <div className="min-h-screen w-full p-4 flex items-center justify-center font-sans bg-gray-900 bg-opacity-90">
      <div className="w-full max-w-6xl h-[700px] mx-auto rounded-xl shadow-2xl bg-gray-800 flex overflow-hidden">
        {/* Left Side Navigation */}
        <nav className="w-1/4 bg-gray-900 p-6">
          <h2 className="text-xl font-bold text-white mb-8">Settings</h2>
          <ul>
            {navItems.map((item) => (
              <li key={item} className="mb-4">
                <a
                  href="#"
                  onClick={() => setActiveTab(item)}
                  className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Side Content */}
        <main className="w-3/4 p-8 overflow-y-auto">
          {activeTab === "Your Account" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Your Account
                  </h1>
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

              <hr className="border-t border-gray-600" />

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
          )}
          {/* You can add content for other tabs here */}
          {activeTab !== "Your Account" && (
            <div className="text-white">
              <h1 className="text-3xl font-bold">{activeTab}</h1>
              <p className="mt-2 text-gray-400">
                Content for this section is not yet implemented.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
