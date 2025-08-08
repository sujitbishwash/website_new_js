import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTestSeriesFormData, testSeriesApi } from "../../lib/api-client";
import { ROUTES } from "../../routes/constants";

// --- Type Definitions ---
interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

interface SubTopic {
  subject: string;
  sub_topic: string[];
}

interface TestSeriesFormData {
  subjects: SubTopic[];
  level: string[];
  language: string[];
}

// --- Helper Components for UI elements ---

// Custom Radio Button Component
const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
}) => (
  <div className="relative flex items-center">
    <input
      id={id}
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="absolute opacity-0 w-0 h-0"
    />
    <label
      htmlFor={id}
      className={`flex items-center cursor-pointer py-2.5 px-5 rounded-lg transition-all duration-300 ease-in-out border
                ${
                  disabled
                    ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
                    : "border-gray-600"
                }
                ${
                  checked
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg ring-2 ring-blue-500/50"
                    : "bg-gray-700 hover:bg-gray-600 hover:border-gray-500"
                }`}
    >
      <span
        className={`w-4 h-4 inline-block mr-3 rounded-full border-2 transition-all duration-300 ${
          checked ? "border-white bg-white" : "border-gray-400 bg-gray-700"
        }`}
      ></span>
      {label}
    </label>
  </div>
);

// --- Main Page Component ---
const TestConfigurationPageComponent = () => {
  const navigate = useNavigate();

  // State to hold user selections
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubTopic, setSelectedSubTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  // State for dynamic data
  const [testData, setTestData] = useState<TestSeriesFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get available subjects from API data
  const subjects = testData?.subjects.map((subject) => subject.subject) || [];

  // Get sub-topics for selected subject
  const currentSubTopics =
    testData?.subjects.find((subject) => subject.subject === selectedSubject)
      ?.sub_topic || [];

  // Get difficulties and languages from API data
  const difficulties = testData?.level || [];
  const languages = testData?.language || [];

  // Fetch test configuration data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchTestSeriesFormData();
        setTestData(data);

        // Set default selections if data is available
        if (data.subjects.length > 0) {
          setSelectedSubject(data.subjects[0].subject);
          if (data.subjects[0].sub_topic.length > 0) {
            setSelectedSubTopic(data.subjects[0].sub_topic[0]);
          }
        }
        if (data.level.length > 0) {
          setSelectedDifficulty(data.level[0]);
        }
        if (data.language.length > 0) {
          setSelectedLanguage(data.language[0]);
        }
      } catch (err: any) {
        console.error("Failed to fetch test configuration data:", err);
        setError("Failed to load test configuration. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Effect to update sub-topic when subject changes
  useEffect(() => {
    if (testData) {
      const newSubTopics =
        testData.subjects.find((subject) => subject.subject === selectedSubject)
          ?.sub_topic || [];

      // Set the default selected sub-topic to the first one in the list, or empty if none exist.
      setSelectedSubTopic(newSubTopics.length > 0 ? newSubTopics[0] : "");
    }
  }, [selectedSubject, testData]);

  // Handler for the continue button click
  const handleContinue = async () => {
    if (!selectedSubject || !selectedDifficulty || !selectedLanguage) {
      setError("Please select all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const testData = {
        subject: selectedSubject,
        // sub_topic: selectedSubTopic ? [selectedSubTopic] : [],
        sub_topic: [],
        level: selectedDifficulty.toLowerCase(),
        language: selectedLanguage,
      };

      const response = await testSeriesApi.createTest(testData);

      // Navigate to exam info page with the test ID
      navigate(ROUTES.EXAM_INFO, {
        state: {
          testId: response.testId,
          testConfig: testData,
          isDemo: false,
        },
      });
    } catch (err: any) {
      console.error("Failed to create test:", err);
      setError(err.message || "Failed to create test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen text-white font-sans p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading test configuration options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen text-white font-sans p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-8">
        {/* --- Header --- */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100">
            Configure Your Test
          </h1>
          <p className="text-gray-400 mt-2">
            Select your preferences to start a practice test.
          </p>
        </div>

        {/* --- Error Display --- */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* --- Form Sections --- */}
        <div className="space-y-10">
          {/* 1. Select Subject */}
          <div className="p-6 bg-black/20 border border-gray-700/80 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              1. Select Subject
            </h2>
            <div className="flex flex-wrap gap-4">
              {subjects.map((subject) => (
                <RadioButton
                  key={subject}
                  id={`subject-${subject}`}
                  name="subject"
                  value={subject}
                  label={subject}
                  checked={selectedSubject === subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedSubject(e.target.value)
                  }
                />
              ))}
            </div>
          </div>

          {/* 2. Select Sub-Topic (dynamic) */}
          <div className="p-6 bg-black/20 border border-gray-700/80 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              2. Select Sub-Topic (Optional)
            </h2>
            <div className="flex flex-wrap gap-4">
              {currentSubTopics.length > 0 ? (
                currentSubTopics.map((topic: string) => (
                  <RadioButton
                    key={topic}
                    id={`subtopic-${topic}`}
                    name="subtopic"
                    value={topic}
                    label={topic}
                    checked={selectedSubTopic === topic}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSelectedSubTopic(e.target.value)
                    }
                  />
                ))
              ) : (
                <p className="text-gray-500">
                  No sub-topics available for this subject.
                </p>
              )}
            </div>
          </div>

          {/* 3. Select Difficulty Level */}
          <div className="p-6 bg-black/20 border border-gray-700/80 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              3. Select Difficulty Level
            </h2>
            <div className="flex flex-wrap gap-4">
              {difficulties.map((level) => (
                <RadioButton
                  key={level}
                  id={`difficulty-${level}`}
                  name="difficulty"
                  value={level}
                  label={level}
                  checked={selectedDifficulty === level}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedDifficulty(e.target.value)
                  }
                />
              ))}
            </div>
          </div>

          {/* 4. Select Language */}
          <div className="p-6 bg-black/20 border border-gray-700/80 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              4. Select Language
            </h2>
            <div className="flex flex-wrap gap-4">
              {languages.map((lang) => (
                <RadioButton
                  key={lang}
                  id={`language-${lang}`}
                  name="language"
                  value={lang}
                  label={languageMapper(lang)}
                  checked={selectedLanguage === lang}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedLanguage(e.target.value)
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* --- Continue Button --- */}
        <div className="pt-6 flex justify-center">
          <button
            onClick={handleContinue}
            disabled={
              isSubmitting ||
              !selectedSubject ||
              !selectedDifficulty ||
              !selectedLanguage
            }
            className={`font-bold py-3 px-12 rounded-full text-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${
              isSubmitting ||
              !selectedSubject ||
              !selectedDifficulty ||
              !selectedLanguage
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
            }`}
          >
            {isSubmitting ? "Creating Test..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

// The main App component that renders our page
export default function TestConfigurationPage() {
  return <TestConfigurationPageComponent />;
}
const languageMapper = (code: string): string => {
  switch (code) {
    case "en":
      return "English";
    case "hi":
      return "Hindi";
    default:
      return "English";
  }
};
