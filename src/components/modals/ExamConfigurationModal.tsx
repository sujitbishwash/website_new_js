import { X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import { examGoalApi } from "../../lib/api-client";
import Dropdown from "../ui/dropdown";


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
    error: userError,
  } = useUser();

  const { refreshUserData, getUserData } = useAuth();

  // Local state
  const [examTypes, setExamTypes] = useState<any[]>([]);
  const [allExamDetails, setAllExamDetails] = useState<any[]>([]);
  const [selectedExamDetail, setSelectedExamDetail] = useState<any>(null);
  const [userExamGoal, setUserExamGoal] = useState<{exam: string, group_type: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [examTypesError, setExamTypesError] = useState<string>("");
  const [examDetailsError, setExamDetailsError] = useState<string>("");
  const [userGoalError, setUserGoalError] = useState<string>("");
  const [selectedExamType, setSelectedExamType] = useState<string>("");
  const [selectedGroupType, setSelectedGroupType] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string>("");
  const [updateError, setUpdateError] = useState<string>("");

  // Memoized values for exam types and groups
  const { availableGroups } = useMemo(() => {
    if (!selectedExamType || examTypes.length === 0) {
      return { availableGroups: [] };
    }

    const selectedType = examTypes.find(type => type.value === selectedExamType);
    const availableGroups = selectedType?.group || [];

    return { availableGroups };
  }, [selectedExamType, examTypes]);

  // Fetch user exam goal data when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchUserExamGoal = async () => {
        try {
          setUserGoalError("");
          console.log("🎯 ExamConfigurationModal: Fetching user exam goal...");
          
          const response = await getUserData();
          
          if (response?.data?.exam_goal) {
            setUserExamGoal({
              exam: response.data.exam_goal.exam || "",
              group_type: response.data.exam_goal.group || ""
            });
            console.log("✅ ExamConfigurationModal: User exam goal loaded successfully:", response.data.exam_goal);
          } else {
            console.log("ℹ️ ExamConfigurationModal: No exam goal found for user");
            setUserExamGoal(null);
          }
        } catch (error: any) {
          console.error("❌ ExamConfigurationModal: Failed to fetch user exam goal:", error);
          setUserGoalError("Failed to load user exam goal. Please try again.");
        }
      };

      fetchUserExamGoal();
    }
  }, [isOpen]);

  // Fetch exam types and all exam details when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchInitialData = async () => {
        try {
          setIsLoading(true);
          setExamTypesError("");
          setExamDetailsError("");
          console.log("🎯 ExamConfigurationModal: Fetching exam types and details...");
          
          // Fetch exam types
          const examTypesResponse = await examGoalApi.getExamTypes();
          
          if (examTypesResponse.data.success) {
            setExamTypes(examTypesResponse.data.data);
            console.log("✅ ExamConfigurationModal: Exam types loaded successfully");
          } else {
            throw new Error("Failed to load exam types");
          }

          // Fetch all exam details (we'll use the first exam type and group as a way to get all data)
          if (examTypesResponse.data.data.length > 0) {
            const firstExamType = examTypesResponse.data.data[0];
            if (firstExamType.group && firstExamType.group.length > 0) {
              const firstGroup = firstExamType.group[0];
              const examDetailsResponse = await examGoalApi.getExamDetails(firstExamType.value, firstGroup);
              
              if (examDetailsResponse.data.success) {
                setAllExamDetails(examDetailsResponse.data.data);
                console.log("✅ ExamConfigurationModal: All exam details loaded successfully");
              } else {
                throw new Error("Failed to load exam details");
              }
            }
          }
        } catch (error: any) {
          console.error("❌ ExamConfigurationModal: Failed to fetch initial data:", error);
          setExamTypesError("Failed to load exam data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchInitialData();
    }
  }, [isOpen]);



  // Initialize selected exam type when exam types are loaded
  useEffect(() => {
    if (examTypes.length > 0 && !selectedExamType) {
      setSelectedExamType(examTypes[0].value);
    }
  }, [examTypes, selectedExamType]);

  // Initialize selected group type when exam type changes
  useEffect(() => {
    if (availableGroups.length > 0 && !selectedGroupType) {
      setSelectedGroupType(availableGroups[0]);
    }
  }, [availableGroups, selectedGroupType]);

  // Function to filter exam details locally
  const filterExamDetails = useCallback(() => {
    if (!selectedExamType || !selectedGroupType || allExamDetails.length === 0) {
      setSelectedExamDetail(null);
      return;
    }

    console.log("🎯 ExamConfigurationModal: Filtering exam details for:", {
      exam: selectedExamType,
      groupType: selectedGroupType
    });

    // Filter exam details based on selected exam type and group type
    const filteredDetails = allExamDetails.filter(exam => 
      exam.exam_id === selectedExamType && 
      exam.id.includes(selectedGroupType)
    );

    if (filteredDetails.length > 0) {
      setSelectedExamDetail(filteredDetails[0]);
      console.log("✅ ExamConfigurationModal: Exam detail filtered successfully");
    } else {
      setSelectedExamDetail(null);
      console.log("⚠️ ExamConfigurationModal: No matching exam detail found");
    }
  }, [selectedExamType, selectedGroupType, allExamDetails]);

  // Auto-select exam type and group based on user's exam goal
  useEffect(() => {
    if (userExamGoal?.exam && examTypes.length > 0) {
      const examName = userExamGoal.exam.toLowerCase();
      const groupType = userExamGoal.group_type?.toLowerCase() || "";

      console.log(
        "🎯 ExamConfigurationModal: Auto-selecting exam based on user goal:",
        {
          examName,
          groupType,
        }
      );

      // Find matching exam type based on exam goal
      const matchingExamType = examTypes.find(type => 
        type.value.toLowerCase().includes(examName) ||
        type.label.toLowerCase().includes(examName)
      );

      if (matchingExamType) {
        setSelectedExamType(matchingExamType.value);
        
        // Find matching group type
        const matchingGroup = matchingExamType.group.find((group: string) =>
          group.toLowerCase().includes(groupType)
        );
        
        if (matchingGroup) {
          setSelectedGroupType(matchingGroup);
        }
        
        console.log("✅ ExamConfigurationModal: Found matching exam type:", {
          examType: matchingExamType.value,
          groupType: matchingGroup || matchingExamType.group[0]
        });
      } else {
        console.log(
          "⚠️ ExamConfigurationModal: No exact match found for exam goal, keeping default selection"
        );
      }
    }
  }, [userExamGoal, examTypes]);

  // Filter exam details when exam type or group type changes
  useEffect(() => {
    filterExamDetails();
  }, [filterExamDetails]);

  // Event handlers
  const handleExamTypeChange = (value: string) => {
    setSelectedExamType(value);
    setSelectedGroupType(""); // Reset group type when exam type changes
    setSelectedExamDetail(null); // Clear selected exam detail
  };

  const handleGroupTypeChange = (value: string) => {
    setSelectedGroupType(value);
    setSelectedExamDetail(null); // Clear selected exam detail
  };

  // Update exam goal
  const handleUpdateExamGoal = useCallback(async () => {
    if (!selectedExamType || !selectedGroupType) return;

    try {
      setIsUpdating(true);
      setUpdateError("");
      setUpdateMessage("");

      console.log("🚀 ExamConfigurationModal: Updating exam goal:.....................s", {
        exam: selectedExamType,
        groupType: selectedGroupType,
      });

      // Call the API to update exam goal
      const response = await examGoalApi.addExamGoal(selectedExamType, selectedGroupType);

      if (response.data.success) {
        console.log(
          "✅ ExamConfigurationModal: Exam goal updated successfully:",
          response.data.message
        );
        setUpdateMessage("Exam goal updated successfully!");

        await refreshUserData();

        // Refresh user exam goal data from context
        const updatedUserResponse = await getUserData();
        if (updatedUserResponse?.data?.exam_goal) {
          setUserExamGoal({
            exam: updatedUserResponse.data.exam_goal.exam || "",
            group_type: updatedUserResponse.data.exam_goal.group || ""
          });
        }

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
    selectedExamType,
    selectedGroupType,
    refreshUserData,
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
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-primary"
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
                <span className="text-foreground">Loading exam data...</span>
              </div>
            </div>
          )}

          {/* Exam Types Error */}
          {examTypesError && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg">
              {examTypesError}
            </div>
          )}

          {/* Exam Details Error */}
          {examDetailsError && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg">
              {examDetailsError}
            </div>
          )}

          {/* User Goal Error */}
          {userGoalError && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg">
              {userGoalError}
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

          {/* Current User Exam Goal Display */}
          {userExamGoal && (
            <div className="bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm p-3 rounded-lg">
              <span className="font-semibold">Current Goal:</span> {userExamGoal.exam} ({userExamGoal.group_type})
            </div>
          )}

                    {/* Controls - Only show when exam types are loaded */}
          {!isLoading && !examTypesError && examTypes.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Dropdown
                  id="exam-type-select"
                  label="Exam Type"
                  value={selectedExamType}
                  onChange={handleExamTypeChange}
                  options={examTypes.map(examType => examType.label)}
                  placeholder="Select Exam Type"
                />
                <Dropdown
                  id="group-type-select"
                  label="Group Type"
                  value={selectedGroupType}
                  onChange={handleGroupTypeChange}
                  options={availableGroups}
                  placeholder="Select Group Type"
                  disabled={!selectedExamType || availableGroups.length === 0}
                />
              </div>
            </div>
          )}

          {/* Details Card - Show when exam detail is loaded */}
          {!isLoading && !examDetailsError && selectedExamDetail && (
            <div className="bg-background p-5 rounded-lg space-y-4 border border-border animate-fade-in-fast">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                {selectedExamDetail.name}
              </h3>

              {selectedExamDetail.description && (
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    Description
                  </h4>
                  <p className="text-foreground text-sm leading-relaxed">
                    {selectedExamDetail.description}
                  </p>
                </div>
              )}

              {selectedExamDetail.eligibility && (
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    Eligibility
                  </h4>
                  <p className="text-foreground text-sm leading-relaxed">
                    {selectedExamDetail.eligibility}
                  </p>
                </div>
              )}

              {selectedExamDetail.pattern && selectedExamDetail.pattern.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    Exam Pattern
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    {selectedExamDetail.pattern.map((step: string, stepIndex: number) => (
                      <li key={stepIndex} className="text-foreground text-sm">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
            disabled={isUpdating || isLoading || !!examTypesError || !!userGoalError || !selectedExamType || !selectedGroupType}
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
