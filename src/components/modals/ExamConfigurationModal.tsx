import { X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import { examGoalApi } from "../../lib/api-client";

// --- TYPE DEFINITIONS (TypeScript) ---
// Defines the structure for a single exam's details
type ExamDetails = {
  name: string;
  description: string;
  eligibility: string;
  pattern: string[];
};

// Defines the structure for a category of exams
type ExamCategory = {
  [examKey: string]: ExamDetails;
};

// Defines the overall structure for all exam data
type ExamData = {
  [categoryKey: string]: {
    displayName: string;
    exams: ExamCategory;
  };
};

// --- MOCK DATA ---
// A comprehensive dataset for various exams.
// This can be easily replaced with data from an API.
const examData: ExamData = {
  ssc: {
    displayName: "SSC",
    exams: {
      cgl: {
        name: "SSC CGL (Combined Graduate Level)",
        description:
          "A national-level exam to recruit candidates for Group B and C posts in various ministries and departments of the Government of India.",
        eligibility: "Bachelor's Degree from a recognized university.",
        pattern: [
          "Tier 1: Computer Based Examination",
          "Tier 2: Computer Based Examination",
          "Tier 3: Pen and Paper Mode (Descriptive)",
          "Tier 4: Computer Proficiency Test/Skill Test",
        ],
      },
      chsl: {
        name: "SSC CHSL (Combined Higher Secondary Level)",
        description:
          "Conducted to recruit candidates for various posts such as LDC, JSA, PA, SA, and DEO in different ministries and departments.",
        eligibility: "Passed 12th Standard or equivalent examination.",
        pattern: [
          "Tier 1: Computer-Based Exam",
          "Tier 2: Descriptive Paper",
          "Tier 3: Typing Test/Skill Test",
        ],
      },
      je: {
        name: "SSC JE (Junior Engineer)",
        description:
          "Recruits Junior Engineers for various government departments and organizations.",
        eligibility:
          "Diploma or Degree in Engineering in the relevant discipline.",
        pattern: [
          "Paper-I: Computer Based Examination (Objective)",
          "Paper-II: Descriptive Type",
        ],
      },
      gd: {
        name: "SSC GD Constable",
        description:
          "Recruitment of constables (General Duty) in Border Security Force (BSF), Central Industrial Security Force (CISF), etc.",
        eligibility: "Matriculation or 10th Class pass.",
        pattern: [
          "Computer Based Examination (CBE)",
          "Physical Efficiency Test (PET)",
          "Physical Standard Test (PST)",
          "Detailed Medical Examination (DME)",
        ],
      },
    },
  },
  bank: {
    displayName: "Bank",
    exams: {
      sbi_po: {
        name: "SBI PO (Probationary Officer)",
        description:
          "A competitive examination to recruit Probationary Officers for the State Bank of India, known for its high standards and career growth.",
        eligibility:
          "Graduation in any discipline from a recognised University.",
        pattern: [
          "Phase-I: Preliminary Examination (Objective)",
          "Phase-II: Main Examination (Objective & Descriptive)",
          "Phase-III: Psychometric Test, Group Exercise & Interview",
        ],
      },
      ibps_po: {
        name: "IBPS PO (Probationary Officer)",
        description:
          "A common written exam for the recruitment of Probationary Officers in multiple public sector banks.",
        eligibility:
          "A degree (Graduation) in any discipline from a University recognised by the Govt. Of India.",
        pattern: [
          "Prelims: Objective Test",
          "Mains: Objective & Descriptive Test",
          "Interview",
        ],
      },
      sbi_clerk: {
        name: "SBI Clerk (Junior Associate)",
        description:
          "Recruits candidates for the clerical cadre in the State Bank of India.",
        eligibility:
          "Graduation in any discipline from a recognised University.",
        pattern: [
          "Preliminary Examination",
          "Main Examination",
          "Test of specified opted local language",
        ],
      },
      ibps_clerk: {
        name: "IBPS Clerk",
        description:
          "A common recruitment process for clerical positions in various public sector banks across India.",
        eligibility: "A degree (Graduation) in any discipline.",
        pattern: ["Preliminary Examination", "Main Examination"],
      },
    },
  },
  class10: {
    displayName: "Class 10",
    exams: {
      cbse: {
        name: "CBSE Board Exam",
        description:
          "Central Board of Secondary Education annual examination for 10th-grade students.",
        eligibility:
          "Students who have passed the 9th-grade examination from a CBSE affiliated school.",
        pattern: [
          "Mathematics",
          "Science (Physics, Chemistry, Biology)",
          "Social Science",
          "English",
          "Second Language",
        ],
      },
      icse: {
        name: "ICSE Board Exam",
        description:
          "Indian Certificate of Secondary Education examination, known for its comprehensive syllabus.",
        eligibility: "Completion of 10 years of formal education.",
        pattern: [
          "Group I (Compulsory): English, History, Civics & Geography, Second Language",
          "Group II (Any 2): Science, Maths, Economics",
          "Group III (Any 1): Computer Applications, Art",
        ],
      },
    },
  },
  railways: {
    displayName: "Railways",
    exams: {
      rrb_ntpc: {
        name: "RRB NTPC",
        description:
          "Recruitment for various non-technical posts in the Indian Railways.",
        eligibility: "Varies from 12th pass to Graduate depending on the post.",
        pattern: [
          "1st Stage CBT",
          "2nd Stage CBT",
          "Typing Skill Test/Computer Based Aptitude Test",
          "Document Verification",
        ],
      },
      rrb_group_d: {
        name: "RRB Group D",
        description: "Recruitment for Level 1 posts in the Indian Railways.",
        eligibility:
          "10th Pass (or ITI from institutions recognised by NCVT/SCVT).",
        pattern: [
          "Computer Based Test (CBT)",
          "Physical Efficiency Test (PET)",
          "Document Verification",
        ],
      },
    },
  },
};

// --- STYLING ---
const theme = {
  background: "#111827",
  cardBackground: "#1F2937",
  inputBackground: "#374151",
  primaryText: "#FFFFFF",
  secondaryText: "#9CA3AF",
  mutedText: "#6B7280",
  accent: "#60A5FA",
  divider: "#4B5563",
  success: "#10B981",
  error: "#EF4444",
};

interface ExamConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExamConfigurationModal({
  isOpen,
  onClose,
}: ExamConfigurationModalProps) {
  // User context hooks
  const {
    examGoal,
    fetchExamGoal,
    syncExamGoalFromAuthContext,
    updateExamGoal,
    clearCache,
    isLoading: userLoading,
    error: userError,
  } = useUser();

  const { refreshUserData } = useAuth();

  // Local state
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>(
    Object.keys(examData)[0]
  );
  const [selectedExamKey, setSelectedExamKey] = useState<string>(
    Object.keys(examData[Object.keys(examData)[0]].exams)[0]
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string>("");
  const [updateError, setUpdateError] = useState<string>("");

  // Memoized values
  const { categories, currentExams, selectedExamDetails } = useMemo(() => {
    const categories = Object.keys(examData).map((key) => ({
      key: key,
      displayName: examData[key].displayName,
    }));
    const currentExams = Object.keys(examData[selectedCategoryKey].exams).map(
      (key) => ({
        key: key,
        name: examData[selectedCategoryKey].exams[key].name,
      })
    );
    const selectedExamDetails =
      examData[selectedCategoryKey].exams[selectedExamKey];
    return { categories, currentExams, selectedExamDetails };
  }, [selectedCategoryKey, selectedExamKey]);

  // Fetch exam goal data when modal opens
  useEffect(() => {
    if (isOpen && !examGoal) {
      console.log(
        "🎯 ExamConfigurationModal: Modal opened, fetching exam goal..."
      );

      // First try to sync from AuthContext localStorage
      const synced = syncExamGoalFromAuthContext();
      if (synced) {
        console.log(
          "✅ ExamConfigurationModal: Successfully synced exam goal from AuthContext"
        );
        return;
      }

      // If no sync, fetch from API using cache-first approach
      fetchExamGoal();
    }
  }, [isOpen, examGoal, fetchExamGoal, syncExamGoalFromAuthContext]);

  // Auto-select category and exam based on user's exam goal
  useEffect(() => {
    if (examGoal?.exam && Object.keys(examData).length > 0) {
      const examName = examGoal.exam.toLowerCase();
      const groupType = examGoal.groupType?.toLowerCase() || "";

      console.log(
        "🎯 ExamConfigurationModal: Auto-selecting exam based on goal:",
        {
          examName,
          groupType,
        }
      );

      // Find matching category based on exam goal
      for (const [categoryKey, category] of Object.entries(examData)) {
        for (const [examKey, exam] of Object.entries(category.exams)) {
          if (
            exam.name.toLowerCase().includes(examName) ||
            exam.name.toLowerCase().includes(groupType) ||
            category.displayName.toLowerCase().includes(examName) ||
            category.displayName.toLowerCase().includes(groupType)
          ) {
            console.log("✅ ExamConfigurationModal: Found matching exam:", {
              categoryKey,
              examKey,
              examName: exam.name,
            });
            setSelectedCategoryKey(categoryKey);
            setSelectedExamKey(examKey);
            return;
          }
        }
      }

      console.log(
        "⚠️ ExamConfigurationModal: No exact match found for exam goal, keeping default selection"
      );
    }
  }, [examGoal, examData]);

  // Event handlers
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryKey = e.target.value;
    setSelectedCategoryKey(newCategoryKey);
    const firstExamInNewCategory = Object.keys(
      examData[newCategoryKey].exams
    )[0];
    setSelectedExamKey(firstExamInNewCategory);
  };

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExamKey(e.target.value);
  };

  // Update exam goal
  const handleUpdateExamGoal = useCallback(async () => {
    if (!selectedExamDetails) return;

    try {
      setIsUpdating(true);
      setUpdateError("");
      setUpdateMessage("");

      // Get the exam name and category from selected exam
      const examName = selectedExamDetails.name;
      const categoryName =
        examData[selectedCategoryKey]?.displayName || selectedCategoryKey;

      console.log("🚀 ExamConfigurationModal: Updating exam goal:", {
        examName,
        categoryName,
      });

      // Call the API to update exam goal
      const response = await examGoalApi.addExamGoal(examName, categoryName);

      if (response.data.success) {
        console.log(
          "✅ ExamConfigurationModal: Exam goal updated successfully:",
          response.data.message
        );
        setUpdateMessage("Exam goal updated successfully!");

        // Clear cache and refresh user data
        clearCache();
        await refreshUserData();

        // Also refresh exam goal data in UserContext
        await fetchExamGoal(true); // Force refresh

        // Show success message for 3 seconds
        setTimeout(() => {
          setUpdateMessage("");
        }, 3000);
      } else {
        throw new Error(response.data.message || "Failed to update exam goal");
      }
    } catch (err: any) {
      console.error("ExamConfigurationModal: Failed to update exam goal:", err);
      setUpdateError("Failed to update exam goal. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }, [
    selectedExamDetails,
    selectedCategoryKey,
    clearCache,
    refreshUserData,
    fetchExamGoal,
  ]);

  // Styles
  const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      display: isOpen ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: theme.background,
      color: theme.primaryText,
      maxWidth: "900px",
      width: "90%",
      maxHeight: "90vh",
      borderRadius: "12px",
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      backgroundColor: theme.cardBackground,
      padding: "1.5rem 2rem",
      borderBottom: `1px solid ${theme.divider}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: theme.primaryText,
      margin: 0,
    },
    closeButton: {
      background: "none",
      border: "none",
      color: theme.secondaryText,
      fontSize: "1.5rem",
      cursor: "pointer",
      padding: "0.5rem",
      borderRadius: "4px",
      transition: "color 0.2s",
    },
    content: {
      padding: "2rem",
      maxHeight: "calc(90vh - 120px)",
      overflowY: "auto",
    },
    controlsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      marginBottom: "2.5rem",
      backgroundColor: theme.cardBackground,
      padding: "2rem",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    controlGroup: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontSize: "0.9rem",
      color: theme.secondaryText,
      marginBottom: "0.5rem",
    },
    select: {
      padding: "0.75rem",
      backgroundColor: theme.inputBackground,
      color: theme.primaryText,
      border: `1px solid ${theme.divider}`,
      borderRadius: "8px",
      fontSize: "1rem",
      cursor: "pointer",
      width: "100%",
    },
    updateButton: {
      backgroundColor: theme.accent,
      color: theme.primaryText,
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      cursor: "pointer",
      fontWeight: "600",
      transition: "background-color 0.2s",
      alignSelf: "flex-end",
    },
    updateButtonDisabled: {
      padding: "0.75rem 1.5rem",
      backgroundColor: theme.mutedText,
      color: theme.secondaryText,
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      cursor: "not-allowed",
      fontWeight: "600",
      alignSelf: "flex-end",
    },
    messageContainer: {
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem",
      textAlign: "center",
    },
    successMessage: {
      backgroundColor: `${theme.success}20`,
      color: theme.success,
      border: `1px solid ${theme.success}`,
    },
    errorMessage: {
      backgroundColor: `${theme.error}20`,
      color: theme.error,
      border: `1px solid ${theme.error}`,
    },
    currentGoalInfo: {
      backgroundColor: `${theme.accent}20`,
      color: theme.accent,
      border: `1px solid ${theme.accent}`,
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1.5rem",
      textAlign: "center",
    },
    detailsCard: {
      backgroundColor: theme.cardBackground,
      padding: "2rem",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    detailTitle: {
      fontSize: "1.75rem",
      fontWeight: "600",
      color: theme.accent,
      marginBottom: "1.5rem",
      borderBottom: `2px solid ${theme.divider}`,
      paddingBottom: "1rem",
    },
    detailSection: {
      marginBottom: "1.5rem",
    },
    detailHeading: {
      fontSize: "1.1rem",
      fontWeight: "bold",
      color: theme.secondaryText,
      marginBottom: "0.5rem",
    },
    detailText: {
      fontSize: "1rem",
      color: theme.primaryText,
      lineHeight: "1.6",
    },
    detailList: {
      listStylePosition: "inside",
      paddingLeft: "0.5rem",
    },
    detailListItem: {
      marginBottom: "0.5rem",
    },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in p-4">
      <div
        className="relative w-full max-w-2xl bg-card text-primary rounded-2xl shadow-2xl border border-border flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h3 className="text-xl font-semibold text-foreground">
            Exam Configuration
          </h3>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 text-foreground rounded-full hover:bg-foreground/10 hover:text-foreground transition-colors z-10 cursor-pointer"
          >
            <X />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Current Goal Display */}
          {examGoal && (
            <div className="bg-background p-4 rounded-lg text-sm">
              <span className="font-semibold text-foreground">Current Goal:</span>{" "}
              {examGoal.exam} ({examGoal.groupType})
            </div>
          )}
          {/* Messages */}
          {updateMessage && (
            <div className="bg-green-500/20 border border-green-500/30 text-green-300 text-sm p-3 rounded-lg">
              {updateMessage}
            </div>
          )}
          {updateError && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg">
              {updateError}
            </div>
          )}

          {/* User Errors */}
          {userError && (
            <div style={{ ...styles.messageContainer, ...styles.errorMessage }}>
              {userError}
            </div>
          )}

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="category-select"
                className="block text-sm font-medium text-muted-foreground"
              >
                Exam Category
              </label>
              <select
                id="category-select"
                value={selectedCategoryKey}
                onChange={handleCategoryChange}
                className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                {categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="exam-select"
                className="block text-sm font-medium text-foreground"
              >
                Specific Exam
              </label>
              <select
                id="exam-select"
                value={selectedExamKey}
                onChange={handleExamChange}
                className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                {currentExams.map((exam) => (
                  <option key={exam.key} value={exam.key}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Details Card */}
          {selectedExamDetails && (
            <div className="bg-background p-5 rounded-lg space-y-4 border border-border animate-fade-in-fast">
              <h3 className="text-lg font-semibold text-foreground">
                {selectedExamDetails.name}
              </h3>

              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Description
                </h4>
                <p className="text-foreground text-sm leading-relaxed">
                  {selectedExamDetails.description}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Eligibility
                </h4>
                <p className="text-foreground text-sm leading-relaxed">
                  {selectedExamDetails.eligibility}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Exam Pattern
                </h4>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  {selectedExamDetails.pattern.map((step, index) => (
                    <li key={index} className="text-foreground text-sm">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        {/* Modal Footer */}
        <div className="flex justify-end items-center gap-4 p-5 border-t border-border bg-card rounded-b-2xl">
          <button
            onClick={onClose}
            className="cursor-pointer px-5 py-2 text-sm font-semibold text-muted-foreground bg-foreground/10 rounded-lg hover:bg-foreground/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateExamGoal}
            disabled={isUpdating}
            className="cursor-pointer px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1d1d1f] transition-all disabled:bg-blue-600/50 disabled:cursor-not-allowed flex items-center"
          >
            {isUpdating && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isUpdating ? "Updating..." : "Update Exam Goal"}
          </button>
        </div>
      </div>
    </div>
  );
}
