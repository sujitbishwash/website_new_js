import React, { FC, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../../lib/api-client";
import { ROUTES } from "../../routes/constants";
import { useAuth } from "../../contexts/AuthContext";
import {
  Calendar,
  ChevronDown,
  User,
  VenusAndMars,
  Mars,
  Venus,
  CircleSmall,
} from "lucide-react";
import AiPadhaiLogo from "../../assets/ai_padhai_logo.svg";
import CustomLoader from "../../components/icons/customloader";
import { theme } from "@/styles/theme";

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
// Props for the Dropdown component
interface DropdownOption {
  label: string;
  icon?: React.ReactNode;
}

interface Dropdown3Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder: DropdownOption; // 👈 now also an object
  disabled?: boolean;
  id: string;
}

// Custom Dropdown Component
const Dropdown3: FC<Dropdown3Props> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  function capitalizeFirstLetter(str:string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-border-medium"
      >
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {value
              ? options.find((o) => o.label === value)?.icon
              : placeholder.icon}
        </span>
        <button
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full flex justify-between items-center text-left rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-1 bg-background-subtle transition-colors cursor-pointer disabled:cursor-not-allowed sm:text-sm ${
            value ? "text-foreground" : "text-muted-foreground"
          } ${isOpen ? "border border-blue-400" : "border border-border"}`}
        >
          <span className="flex items-center gap-2 first-letter:uppercase">
            {/* when value selected show its icon, else placeholder icon */}
            
            {capitalizeFirstLetter(value || placeholder.label)}
          </span>
          <ChevronDown className="w-5 h-5"/>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-10 mt-2 w-full bg-card rounded-md shadow-lg border-border border">
            <div className="py-1 max-h-60 overflow-auto">
              {options.map((option) => (
                <div
                  key={option.label}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors text-foreground hover:bg-border-medium 
    flex items-center gap-2 ${
      value === option.label ? "bg-border-medium" : "transparent"
    }`}
                  onClick={() => handleOptionClick(option.label)}
                  onMouseEnter={(e) => {
                    if (value !== option.label) {
                      e.currentTarget.style.backgroundColor = theme.dividerHigh;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== option.label) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {option.icon}
                  {capitalizeFirstLetter(option.label)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
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
    : "border-border focus:border-blue-400 focus:ring-blue-400";
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-border-medium"
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
          className={`block w-full rounded-lg bg-background-subtle py-3 pl-10 pr-3 text-foreground placeholder-muted-foreground transition duration-150 ease-in-out border border-border focus:border-blue-400 focus:outline-none focus:ring-1 sm:text-sm ${errorClasses}`}

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
          className={`w-full flex justify-between items-center text-left rounded-xl px-4 py-3 focus:outline-none focus:ring-1 bg-background-subtle transition-colors cursor-pointer disabled:cursor-not-allowed ${
            value ? "text-foreground" : "text-muted-foreground"
          } ${isOpen ? "border border-blue-400" : "border border-border"}`} */
/**
 * A reusable, styled select dropdown component with validation error display.
 */

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

        // Use getUserData from AuthContext instead of direct API call
        const response = await getUserData();

        if (
          response &&
          response.status >= 200 &&
          response.status < 300 &&
          response.data
        ) {
          const userData = response.data;

          // Populate form with existing user data if available
          const updatedFormData: FormData = {
            name: userData.name || "",
            gender: userData.gender || "",
            dob: userData.date_of_birth || "",
          };

          setFormData(updatedFormData);
        } else {
        }
      } catch (error) {
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
  const handleChange2 = (e: string) => {
    const value = e;
    const newFormData = { ...formData, ["gender"]: value };
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
          }
        } catch (error) {}

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
        setSubmitError("Failed to save your details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  
  // Show loading state while fetching user data
  if (isLoadingUserData) {
    return (
      <div className="text-center">
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
        {/**<h2 className="text-2xl font-bold text-white mb-2">
            Loading Profile...
          </h2>
          <p className="text-gray-400">Fetching your existing information</p>*/}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-4 sm:p-8 shadow-2xl transition-all duration-500 border border-divider">
      <div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-center text-sm sm:text-md text-muted-foreground">
          Please provide your personal information to continue.
        </p>
        {/*(formData.name || formData.gender || formData.dob) && (
          <p className="mt-2 text-center text-xs text-blue-400">
            ✓ Your existing information has been loaded
          </p>
        )*/}
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
            icon={<User className="h-5 w-5 text-muted-foreground" />}
            error={errors.name}
          />
          {/**<SelectField
            id="gender"
            label="Gender *"
            value={formData.gender}
            onChange={handleChange}
            icon={<VenusAndMars className="h-5 w-5 text-muted-foreground" />}
            error={errors.gender}
          >
            <option value="" disabled>
              Select your gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </SelectField>*/}
          <Dropdown3
            id="gender"
            label="Gender"
            value={formData.gender}
            onChange={handleChange2}
            options={[
              { label: "male", icon: <Mars className="h-5 w-5 text-muted-foreground"/> },
              { label: "female", icon: <Venus className="h-5 w-5 text-muted-foreground"/> },
              { label: "other", icon: <VenusAndMars className="h-5 w-5 text-muted-foreground"/> },
            ]}
            placeholder={{
              label: "Select Your Gender",
              icon: <CircleSmall className="h-5 w-5 text-muted-foreground"/>,
            }}
          />
          <div>
            <InputField
              id="dob"
              label="Date of Birth *"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              placeholder="Select a date"
              icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
              error={errors.dob}
            />
            {age !== null && !errors.dob && (
              <p className="mt-2 text-xs text-primary">
                You are {age} years old.
              </p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-3 px-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <CustomLoader className="h-5 w-5"/>
                Saving...
              </>
            ) : (
              "Next"
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
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <style>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fadeIn 0.5s ease-in-out;
            }
        `}</style>
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div
          className={`flex items-center gap-2 overflow-hidden transition-all duration-300 lg:w-auto`}
        >
          <img src={AiPadhaiLogo} alt="Logo" width={30} height={30} />
          <h1
            className={`text-xl font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 lg:w-auto`}
          >
            AI Padhai
          </h1>
        </div>
      </header>
      <PersonalInfoForm />
    </main>
  );
}
