import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { fetchTestSeriesFormData } from "../../lib/api-client";
import { ROUTES } from "../../routes/constants";
import { Pen } from "lucide-react";
import ExamConfigurationModal from "../../components/modals/ExamConfigurationModal";

// --- Type Definitions ---
interface ChipProps {
  value: string;
  label: string;
  checked: boolean;
  onClick: (value: string) => void;
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
interface SelectionPanelProps {
  title: string;
  options: string[];
  selectedValue?: string | null;
  selectedValues?: string[] | null;
  onSelect: (value: string) => void;
  optionalLabel?: string;
  emptyMessage?: string;
  mapper?: (value: string) => string;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({
  title,
  options,
  selectedValue,
  selectedValues,
  onSelect,
  optionalLabel,
  emptyMessage,
  mapper,
}) => {
  return (
    <div
      className="p-4 bg-background border-1 rounded-xl mb-4 max-h-82 overflow-y-auto
    "
    >
      <h2 className="text-xl font-semibold text-card-foreground dark:text-gray-200 mb-4">
        {title}{" "}
        {optionalLabel && (
          <span className="text-base font-normal text-secondaryText">
            ({optionalLabel})
          </span>
        )}
      </h2>
      <div className="flex flex-wrap gap-1 sm:gap-4 text-white">
        {options.length > 0 ? (
          options.map((option) => {
            // If you really need to check selectedValues:
            if (selectedValues) {
              return (
                <Chip
                  key={option}
                  value={option}
                  label={mapper ? mapper(option) : option}
                  checked={selectedValues.includes(option)}
                  onClick={() => onSelect(option)}
                />
              );
            } else {
              return (
                <Chip
                  key={option}
                  value={option}
                  label={mapper ? mapper(option) : option}
                  checked={selectedValue === option}
                  onClick={() => onSelect(option)}
                />
              );
            }
          })
        ) : (
          <p className="text-gray-500">
            {emptyMessage || "No options available."}
          </p>
        )}
      </div>
    </div>
  );
};

// --- Helper Components for UI elements ---
// Custom Chip Component
const Chip: React.FC<ChipProps> = ({
  value,
  label,
  checked,
  onClick,
  disabled = false,
}) => (
  <button
    onClick={() => !disabled && onClick(value)}
    disabled={disabled}
    className={`py-2 px-3 rounded-lg transition-all duration-300 ease-in-out border text-sm font-medium
      ${
        disabled
          ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
          : "cursor-pointer"
      }
      ${
        checked
          ? "bg-blue-600 border-blue-500 hover:bg-blue-500 hover:border-blue-400"
          : "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500"
      }
    `}
  >
    {label}
  </button>
);

// --- Main Page Component ---
const TestConfigurationPageComponent = () => {
  const navigate = useNavigate();
  const { profile, examGoal } = useUser();

  // State to hold user selections
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubTopic, setSelectedSubTopic] = useState("");
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  // State for dynamic data
  const [testData, setTestData] = useState<TestSeriesFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExamConfigModalOpen, setIsExamConfigModalOpen] = useState(false);

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
          // Set "Medium" as default if available, otherwise use first option
          const mediumIndex = data.level.findIndex(level => level.toLowerCase() === 'medium');
          setSelectedDifficulty(mediumIndex !== -1 ? data.level[mediumIndex] : data.level[0]);
        }
        if (data.language.length > 0) {
          setSelectedLanguage(data.language[0]);
        }
      } catch (err: any) {
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
        sub_topic: selectedSubtopics,
        //sub_topic: [],
        level: selectedDifficulty.toLowerCase(),
        language: selectedLanguage,
      };

      //const response = await testSeriesApi.createTest(testData);

      // Navigate to exam info page with the test ID
      navigate(ROUTES.EXAM_INFO, {
        state: {
          testConfig: testData,
          isDemo: false,
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to create test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-background/10 to-background min-h-screen text-white font-sans flex items-center justify-center">
        <div className="w-full mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-8"></div>
          <p className="text-muted-foreground">Loading Test configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen font-sans p-4 sm:p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto bg-card border border-divider rounded-2xl shadow-2xl p-4 mt-15 mb-10 sm:mb-0 sm:mt-0 sm:p-8 sm:space-y-6 ">
        {/* --- Header --- */}
        <div className="text-center mb-6 sm:mb-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Configure Your Test
          </h1>
          <p className="mt-2 text-lg text-muted-foreground hidden sm:block">
            Select your preferences to start a practice test.
          </p>
        </div>

        {/* --- User Profile Section --- */}
        {profile && examGoal && (
          <div className="mt-4 flex justify-start items-center gap-3 hidden sm:block">
            <span className="text-xs font-medium px-3 py-1">
              Exam Goal: {examGoal.exam}
            </span>
            {/*<span className="text-xs font-medium px-3 py-1">
              Group Type: {examGoal.groupType}
            </span>*/}
            <button
              onClick={() => setIsExamConfigModalOpen(true)}
              className="px-2 py-2 rounded-lg bg-background border border-divider hover:bg-foreground/20 transition-colors cursor-pointer"
              title="Edit exam goal"
            >
              <Pen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* --- Error Display --- */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* --- Form Sections --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          <SelectionPanel
            title="1. Select Subject"
            options={subjects}
            selectedValue={selectedSubject}
            onSelect={setSelectedSubject}
          />

          <SelectionPanel
            title="2. Select Topic"
            options={currentSubTopics}
            selectedValues={selectedSubtopics}
            onSelect={(topic) =>
              setSelectedSubtopics((prev) =>
                prev.includes(topic)
                  ? prev.filter((t) => t !== topic)
                  : [...prev, topic]
              )
            }
            optionalLabel="Optional"
            emptyMessage="No sub-topics available for this subject."
          />

          <SelectionPanel
            title="3. Select Difficulty"
            options={difficulties}
            selectedValue={selectedDifficulty}
            onSelect={setSelectedDifficulty}
          />

          <SelectionPanel
            title="4. Select Language"
            options={languages}
            selectedValue={selectedLanguage}
            onSelect={setSelectedLanguage}
            mapper={languageMapper}
          />
        </div>

        {/* --- Continue Button --- */}
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={
              isSubmitting ||
              !selectedSubject ||
              !selectedDifficulty ||
              !selectedLanguage
            }
            className={`w-full sm:w-auto px-4 py-2 text-xl font-semibold rounded-lg backdrop-blur-sm border-1  transition-all duration-300 ${
              isSubmitting ||
              !selectedSubject ||
              !selectedDifficulty ||
              !selectedLanguage
                ? "bg-border text-background-subtle cursor-not-allowed"
                : "bg-primary hover:bg-primary/80 text-white cursor-pointer"
            }`}
          >
            {isSubmitting ? "Creating Test..." : "Start Test"}
          </button>
        </div>
      </div>

      {/* Exam Configuration Modal */}
      <ExamConfigurationModal
        isOpen={isExamConfigModalOpen}
        onClose={() => setIsExamConfigModalOpen(false)}
      />
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
