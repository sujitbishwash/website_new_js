import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../../lib/api-client";
import { ROUTES } from "../../routes/constants";
import { useAuth } from "../../contexts/AuthContext";

// --- ICONS (using SVG for self-containment) ---
const UserIcon = ({ className }: { className?: string }) => (
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
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GenderIcon = ({ className }: { className?: string }) => (
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
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m14.31 8-3.02 6" />
    <path d="m11.29 16 3.02-6" />
    <path d="m9 12h.01" />
    <path d="m15 12h.01" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
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
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const LoaderIcon = ({ className }: { className?: string }) => (
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
    className={`${className} animate-spin`}
  >
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);

// --- TYPE DEFINITIONS (for TypeScript) ---
interface InputFieldProps {
  id: string;
  label: string;
  type: "text" | "date";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  error?: string;
}

interface FormData {
  name: string;
  gender: string;
  dob: string;
}

interface FormErrors {
  name?: string;
  gender?: string;
  dob?: string;
}

// --- REUSABLE MODULAR COMPONENTS ---

/**
 * A reusable, styled input field component with validation error display.
 */
const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  icon,
  error,
  ...props
}) => {
  const errorClasses = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border-gray-600 focus:border-blue-400 focus:ring-blue-400";
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-400 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </span>
        <input
          id={id}
          {...props}
          className={`block w-full rounded-lg bg-gray-700 py-3 pl-10 pr-3 text-white placeholder-gray-500 transition duration-150 ease-in-out focus:outline-none focus:ring-2 sm:text-sm ${errorClasses}`}
        />
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-500 transition-opacity duration-300 ease-in-out opacity-100">
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * A reusable, styled select dropdown component with validation error display.
 */
const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  icon,
  value,
  onChange,
  children,
  error,
}) => {
  const errorClasses = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border-gray-600 focus:border-blue-400 focus:ring-blue-400";
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-400 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </span>
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`block w-full appearance-none rounded-lg bg-gray-700 py-3 pl-10 pr-8 text-white transition duration-150 ease-in-out focus:outline-none focus:ring-2 sm:text-sm ${errorClasses}`}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-500 transition-opacity duration-300 ease-in-out opacity-100">
          {error}
        </p>
      )}
    </div>
  );
};

// --- MAIN FORM COMPONENT ---

const PersonalInfoForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserData } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    gender: "",
    dob: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [age, setAge] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState<boolean>(true);

  // --- Navigation Guard ---
  useEffect(() => {
    // Prevent navigation away from this page if form is not completed
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        !isFormCompleted &&
        (formData.name || formData.gender || formData.dob)
      ) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    // Prevent browser back/forward navigation
    const handlePopState = (e: PopStateEvent) => {
      if (
        !isFormCompleted &&
        (formData.name || formData.gender || formData.dob)
      ) {
        e.preventDefault();
        window.history.pushState(null, "", location.pathname);
        alert("Please complete your profile before leaving this page.");
      }
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    window.history.pushState(null, "", location.pathname);

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isFormCompleted, formData, location.pathname]);

  // --- Fetch User Data from Context (Optimized) ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingUserData(true);
        console.log("🔍 PersonalDetails: Using cached user data from AuthContext...");

        // Use getUserData from AuthContext instead of direct API call
        const response = await getUserData();

        if (
          response &&
          response.status >= 200 &&
          response.status < 300 &&
          response.data
        ) {
          const userData = response.data;
          console.log("📋 PersonalDetails: User data received from context:", userData);

          // Populate form with existing user data if available
          const updatedFormData: FormData = {
            name: userData.name || "",
            gender: userData.gender || "",
            dob: userData.date_of_birth || "",
          };

          setFormData(updatedFormData);
          console.log("✅ PersonalDetails: Form populated with user data:", updatedFormData);
        } else {
          console.log("⚠️ PersonalDetails: No user data found in context");
        }
      } catch (error) {
        console.error("❌ PersonalDetails: Error fetching user data:", error);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [getUserData]);

  // --- Real-time Age Calculation ---
  useEffect(() => {
    if (formData.dob) {
      try {
        const birthDate = new Date(formData.dob);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        setAge(calculatedAge >= 0 ? calculatedAge : null);
      } catch {
        setAge(null);
      }
    } else {
      setAge(null);
    }
  }, [formData.dob]);

  // --- Validation Logic ---
  const validate = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {};
    if (!data.name.trim()) newErrors.name = "Full name is required.";
    else if (data.name.trim().length < 3)
      newErrors.name = "Full name must be at least 3 characters.";
    if (!data.gender) newErrors.gender = "Please select a gender.";
    if (!data.dob) newErrors.dob = "Date of birth is required.";
    else if (new Date(data.dob) > new Date())
      newErrors.dob = "Date of birth cannot be in the future.";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    const newFormData = { ...formData, [id]: value };
    setFormData(newFormData);
    // Clear submit error when user starts typing
    if (submitError) setSubmitError(null);
    // Validate on change for instant feedback
    setErrors(validate(newFormData));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      setSubmitError(null);

      try {
        // Call API to update user details
        console.log("Submitting user details:", formData);

        const response = await authApi.updateUserDetails({
          name: formData.name,
          gender: formData.gender,
          date_of_birth: formData.dob,
        });

        if (response.status !== 200) {
          throw new Error(
            response.data.message || "Failed to update user details"
          );
        }

        console.log("✅ User details saved successfully");

        // Update localStorage with the new user data to ensure validation passes
        try {
          const existingUserData = localStorage.getItem("userData");
          if (existingUserData) {
            const parsedUserData = JSON.parse(existingUserData);
            const updatedUserData = {
              ...parsedUserData,
              name: formData.name,
              gender: formData.gender,
              date_of_birth: formData.dob,
            };
            localStorage.setItem("userData", JSON.stringify(updatedUserData));
            console.log(
              "✅ Updated localStorage with new user details:",
              updatedUserData
            );
          }
        } catch (error) {
          console.error("❌ Error updating localStorage:", error);
        }

        // Also update the form data to reflect the saved state
        setFormData((prevData) => ({
          ...prevData,
          name: formData.name,
          gender: formData.gender,
          dob: formData.dob,
        }));

        // Mark form as completed to allow navigation
        setIsFormCompleted(true);

        // Navigate to exam goal page
        navigate(ROUTES.EXAM_GOAL, { replace: true });
      } catch (error) {
        console.error("❌ Error saving user details:", error);
        setSubmitError("Failed to save your details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Show loading state while fetching user data
  if (isLoadingUserData) {
    return (
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-gray-800 p-6 sm:p-8 shadow-2xl transition-all duration-500">
        <div className="text-center">
          <LoaderIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Loading Profile...
          </h2>
          <p className="text-gray-400">Fetching your existing information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl bg-gray-800 p-6 sm:p-8 shadow-2xl transition-all duration-500">
      <div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-white">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Please provide your personal information to continue. This information
          is required.
        </p>
        {(formData.name || formData.gender || formData.dob) && (
          <p className="mt-2 text-center text-xs text-blue-400">
            ✓ Your existing information has been loaded
          </p>
        )}
      </div>

      {submitError && (
        <div className="rounded-md bg-red-900/50 border border-red-500 p-4">
          <p className="text-sm text-red-400">{submitError}</p>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="space-y-4 rounded-md">
          <InputField
            id="name"
            label="Full Name *"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            icon={<UserIcon className="h-5 w-5 text-gray-500" />}
            error={errors.name}
          />
          <SelectField
            id="gender"
            label="Gender *"
            value={formData.gender}
            onChange={handleChange}
            icon={<GenderIcon className="h-5 w-5 text-gray-500" />}
            error={errors.gender}
          >
            <option value="" disabled>
              Select your gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </SelectField>
          <div>
            <InputField
              id="dob"
              label="Date of Birth *"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              placeholder="Select a date"
              icon={<CalendarIcon className="h-5 w-5 text-gray-500" />}
              error={errors.dob}
            />
            {age !== null && !errors.dob && (
              <p className="mt-2 text-xs text-blue-400">
                You are {age} years old.
              </p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-4 text-sm font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <LoaderIcon className="h-5 w-5 mr-2" />
                Saving...
              </>
            ) : (
              "Continue to Exam Goal"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- ROOT APP COMPONENT ---

export default function PersonalDetails() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-900 p-4 font-sans">
      <style>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fadeIn 0.5s ease-in-out;
            }
        `}</style>
      <PersonalInfoForm />
    </main>
  );
}
