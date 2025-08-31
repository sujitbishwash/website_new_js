import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import { examGoalApi, ExamType } from "../../lib/api-client";

// --- TYPE DEFINITIONS (TypeScript) ---
// Defines the structure for a single exam's details
type ExamDetails = {
  name: string;
  description: string;
  eligibility: string;
  pattern: string[];
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  duration?: string;
  totalMarks?: string;
  subjects?: string[];
  recommendedFor?: string[];
};

// Defines the structure for a category of exams
type ExamCategory = {
  [examKey: string]: ExamDetails;
};

// Defines the overall structure for all exam data
type ExamData = {
  [categoryKey: string]: {
    displayName: string;
    description: string;
    exams: ExamCategory;
    icon?: string;
    color?: string;
  };
};

// --- ENHANCED EXAM DATA WITH API INTEGRATION ---
// This will be populated from the API and enhanced with additional details
const enhancedExamData: ExamData = {
  ssc: {
    displayName: "SSC",
    description: "Staff Selection Commission - Government job opportunities",
    color: "#3B82F6",
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
        difficulty: "Advanced",
        duration: "2-3 hours per tier",
        totalMarks: "Varies by tier",
        subjects: [
          "General Intelligence",
          "General Knowledge",
          "Quantitative Aptitude",
          "English Language",
        ],
        recommendedFor: [
          "Graduates seeking government jobs",
          "Candidates interested in administrative roles",
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
        difficulty: "Intermediate",
        duration: "1-2 hours per tier",
        totalMarks: "200 marks (Tier 1)",
        subjects: [
          "General Intelligence",
          "General Knowledge",
          "Quantitative Aptitude",
          "English Language",
        ],
        recommendedFor: [
          "12th pass students",
          "Candidates seeking clerical positions",
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
        difficulty: "Advanced",
        duration: "2-3 hours per paper",
        totalMarks: "300 marks (Paper I) + 100 marks (Paper II)",
        subjects: [
          "General Intelligence",
          "General Knowledge",
          "General Engineering",
        ],
        recommendedFor: [
          "Engineering graduates",
          "Diploma holders in engineering",
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
        difficulty: "Beginner",
        duration: "1 hour (CBE)",
        totalMarks: "100 marks",
        subjects: [
          "General Intelligence",
          "General Knowledge",
          "Elementary Mathematics",
          "English/Hindi",
        ],
        recommendedFor: [
          "10th pass students",
          "Candidates interested in security forces",
        ],
      },
    },
  },
  bank: {
    displayName: "Bank",
    description: "Banking sector recruitment exams",
    color: "#10B981",
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
        difficulty: "Advanced",
        duration: "1-3 hours per phase",
        totalMarks: "Varies by phase",
        subjects: [
          "Quantitative Aptitude",
          "Reasoning Ability",
          "English Language",
          "General Awareness",
        ],
        recommendedFor: [
          "Graduates seeking banking careers",
          "Candidates interested in leadership roles",
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
        difficulty: "Advanced",
        duration: "1-3 hours per phase",
        totalMarks: "Varies by phase",
        subjects: [
          "Quantitative Aptitude",
          "Reasoning Ability",
          "English Language",
          "General Awareness",
        ],
        recommendedFor: [
          "Graduates seeking banking careers",
          "Candidates interested in public sector banks",
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
        difficulty: "Intermediate",
        duration: "1-2 hours per phase",
        totalMarks: "200 marks (Prelims) + 200 marks (Mains)",
        subjects: [
          "Quantitative Aptitude",
          "Reasoning Ability",
          "English Language",
          "General Awareness",
        ],
        recommendedFor: [
          "Graduates seeking clerical positions",
          "Candidates interested in SBI",
        ],
      },
      ibps_clerk: {
        name: "IBPS Clerk",
        description:
          "A common recruitment process for clerical positions in various public sector banks across India.",
        eligibility: "A degree (Graduation) in any discipline.",
        pattern: ["Preliminary Examination", "Main Examination"],
        difficulty: "Intermediate",
        duration: "1 hour per phase",
        totalMarks: "100 marks (Prelims) + 200 marks (Mains)",
        subjects: [
          "Quantitative Aptitude",
          "Reasoning Ability",
          "English Language",
          "General Awareness",
        ],
        recommendedFor: [
          "Graduates seeking clerical positions",
          "Candidates interested in public sector banks",
        ],
      },
    },
  },
  class10: {
    displayName: "Class 10",
    description: "Secondary education board examinations",
    color: "#F59E0B",
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
        difficulty: "Beginner",
        duration: "3 hours per subject",
        totalMarks: "100 marks per subject",
        subjects: [
          "Mathematics",
          "Science",
          "Social Science",
          "English",
          "Second Language",
        ],
        recommendedFor: [
          "CBSE students",
          "Students preparing for higher education",
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
        difficulty: "Intermediate",
        duration: "2-3 hours per subject",
        totalMarks: "100 marks per subject",
        subjects: [
          "English",
          "History & Civics",
          "Geography",
          "Second Language",
          "Science",
          "Mathematics",
          "Economics",
        ],
        recommendedFor: [
          "ICSE students",
          "Students seeking comprehensive education",
        ],
      },
    },
  },
  railways: {
    displayName: "Railways",
    description: "Indian Railways recruitment examinations",
    color: "#EF4444",
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
        difficulty: "Intermediate",
        duration: "1-2 hours per stage",
        totalMarks: "Varies by stage",
        subjects: [
          "General Awareness",
          "Mathematics",
          "General Intelligence",
          "Reasoning",
        ],
        recommendedFor: [
          "12th pass students",
          "Graduates seeking railway jobs",
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
        difficulty: "Beginner",
        duration: "1.5 hours (CBT)",
        totalMarks: "100 marks",
        subjects: [
          "Mathematics",
          "General Intelligence",
          "General Science",
          "General Awareness",
        ],
        recommendedFor: [
          "10th pass students",
          "ITI holders",
          "Candidates seeking railway jobs",
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
};

// --- MAIN APP COMPONENT ---
export default function ExamsPage() {
  console.log("🎬 ExamsPage: Component mounted/rendered");

  const {
    profile,
    examGoal,
    
    fetchExamGoal,
    // refreshExamGoal,
    syncExamGoalFromAuthContext,
    
    isDataLoaded,
    // resetFetchFlags,
  } = useUser();
  const { refreshUserData } = useAuth();

  console.log("👤 ExamsPage: User context data:", { profile, examGoal });

  const [examData, setExamData] = useState<ExamData>(enhancedExamData);
  const [apiExamData, setApiExamData] = useState<ExamType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>(
    Object.keys(enhancedExamData)[0]
  );
  const [selectedExamKey, setSelectedExamKey] = useState<string>(
    Object.keys(enhancedExamData[Object.keys(enhancedExamData)[0]].exams)[0]
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isUpdatingExamGoal, setIsUpdatingExamGoal] = useState(false);
  const [examGoalUpdateMessage, setExamGoalUpdateMessage] =
    useState<string>("");

  // Fetch exam data from API (same as ExamGoalPage)
  useEffect(() => {
    console.log("🚀 ExamsPage: Starting to fetch exam data from API...");
    console.log("🔧 ExamsPage: examGoalApi available:", !!examGoalApi);
    console.log(
      "🔧 ExamsPage: examGoalApi.getExamTypes available:",
      !!examGoalApi?.getExamTypes
    );

    const fetchExamData = async () => {
      try {
        console.log("📡 ExamsPage: Making API call to getExamTypes...");
        setIsLoading(true);
        setError("");

        const response = await examGoalApi.getExamTypes();
        console.log("📡 ExamsPage: API Response received:", response);

        if (response.data.success && response.data.data) {
          console.log("📚 ExamsPage: API Exam Data:", response.data.data);
          setApiExamData(response.data.data);

          // Merge API data with enhanced data to create comprehensive exam information
          const mergedData = { ...enhancedExamData };

          // Add any new exam types from API that aren't in our enhanced data
          response.data.data.forEach((examType: ExamType) => {
            if (!mergedData[examType.value.toLowerCase()]) {
              // Create new category if it doesn't exist
              mergedData[examType.value.toLowerCase()] = {
                displayName: examType.label,
                description: `${examType.label} examinations`,
                color: getRandomColor(),
                exams: {},
              };

              // Add specific exams from the group
              examType.group.forEach((examName) => {
                const examKey = examName.toLowerCase().replace(/\s+/g, "_");
                mergedData[examType.value.toLowerCase()].exams[examKey] = {
                  name: examName,
                  description: `${examName} examination`,
                  eligibility: "Varies by exam",
                  pattern: ["Computer Based Test", "Interview (if applicable)"],
                  difficulty: "Intermediate",
                  duration: "2-3 hours",
                  totalMarks: "Varies by exam",
                  subjects: [
                    "General Knowledge",
                    "Quantitative Aptitude",
                    "Reasoning",
                  ],
                  recommendedFor: [`Candidates preparing for ${examName}`],
                };
              });
            }
          });

          console.log("🔄 ExamsPage: Setting merged exam data:", mergedData);
          setExamData(mergedData);
        } else {
          console.error(
            "❌ ExamsPage: API response indicates failure:",
            response
          );
          throw new Error("Failed to fetch exam data");
        }
      } catch (err: any) {
        console.error("❌ ExamsPage: Failed to fetch exam data:", err);
        setError("Failed to load exam data. Please try again.");
        // Fallback to enhanced data if API fails
        setExamData(enhancedExamData);
      } finally {
        setIsLoading(false);
        console.log("✅ ExamsPage: Exam data fetch completed");
      }
    };

    fetchExamData();
  }, []);

  // Fetch current exam goal from UserContext if not available
  // OPTIMIZATION: This only runs once on mount to prevent unnecessary API calls on every navigation
  useEffect(() => {
    console.log("🔍 ExamsPage: Checking exam goal fetch...", { examGoal });

    const fetchCurrentExamGoal = async () => {
      if (!examGoal) {
        try {
          console.log(
            "🔍 ExamsPage: Fetching current exam goal from UserContext..."
          );

          // First try to sync from AuthContext localStorage
          const synced = syncExamGoalFromAuthContext();
          if (synced) {
            console.log(
              "✅ ExamsPage: Successfully synced exam goal from AuthContext"
            );
            return;
          }

                // If no sync, fetch from API
      await fetchExamGoal();
        } catch (err: any) {
          console.error(
            "❌ ExamsPage: Failed to fetch current exam goal:",
            err
          );
          // Don't show error to user, just log it
        }
      } else {
        console.log("✅ ExamsPage: Exam goal already in cache:", examGoal);
      }
    };

    fetchCurrentExamGoal();
  }, []); // Only run once on mount, not on every examGoal change

  // Auto-select category based on user's exam goal
  useEffect(() => {
    if (examGoal?.exam && Object.keys(examData).length > 0) {
      const examName = examGoal.exam.toLowerCase();
      const groupType = examGoal.groupType?.toLowerCase() || "";

      console.log("🎯 Auto-selecting exam based on goal:", {
        examName,
        groupType,
      });

      // Find matching category based on exam goal
      for (const [categoryKey, category] of Object.entries(examData)) {
        for (const [examKey, exam] of Object.entries(category.exams)) {
          if (
            exam.name.toLowerCase().includes(examName) ||
            exam.name.toLowerCase().includes(groupType) ||
            category.displayName.toLowerCase().includes(examName)
          ) {
            console.log("✅ Found matching exam:", {
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
        "⚠️ No exact match found for exam goal, keeping default selection"
      );
    }
  }, [examGoal, examData]);

  // Ensure exam goal is fetched when component mounts and examData is available
  // OPTIMIZATION: Only depends on examData to prevent loops
  useEffect(() => {
    if (Object.keys(examData).length > 0 && !examGoal) {
      console.log("🚀 ExamsPage: Exam data loaded, fetching exam goal...");

      // First try to sync from AuthContext localStorage
      const synced = syncExamGoalFromAuthContext();
      if (synced) {
        console.log(
          "✅ ExamsPage: Successfully synced exam goal from AuthContext after exam data load"
        );
        return;
      }

      // If no sync, fetch from API
      fetchExamGoal();
    }
  }, [examData]); // Only depend on examData, not examGoal to prevent loops

  // Sync exam goal data when component first mounts - only once
  // OPTIMIZATION: Empty dependency array ensures this only runs once on mount
  useEffect(() => {
    console.log(
      "🚀 ExamsPage: Component mounted, attempting to sync exam goal..."
    );

    // Try to sync from AuthContext localStorage first
    const synced = syncExamGoalFromAuthContext();
    if (synced) {
      console.log(
        "✅ ExamsPage: Successfully synced exam goal from AuthContext on mount"
      );
    } else {
      console.log(
        "⚠️ ExamsPage: No exam goal data found in AuthContext on mount"
      );
    }
  }, []); // Only run once on mount

  // Debug: Log exam goal changes - only for debugging, can be removed in production
  useEffect(() => {
    if (examGoal) {
      console.log("🔍 ExamsPage: Exam goal state changed:", examGoal);

      // Also log what's in AuthContext localStorage
      try {
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          console.log(
            "📋 ExamsPage: AuthContext localStorage data:",
            parsedUserData
          );
        } else {
          console.log("📋 ExamsPage: No AuthContext localStorage data found");
        }
      } catch (error) {
        console.warn(
          "ExamsPage: Failed to parse AuthContext localStorage data:",
          error
        );
      }
    }
  }, [examGoal]);

  const { categories, currentExams, selectedExamDetails, filteredExams } =
    useMemo(() => {
      if (Object.keys(examData).length === 0) {
        return {
          categories: [],
          currentExams: [],
          selectedExamDetails: null,
          filteredExams: [],
        };
      }

      const categories = Object.keys(examData).map((key) => ({
        key: key,
        displayName: examData[key].displayName,
        description: examData[key].description,
        color: examData[key].color,
      }));

      const currentExams = Object.keys(
        examData[selectedCategoryKey]?.exams || {}
      ).map((key) => ({
        key: key,
        name: examData[selectedCategoryKey].exams[key].name,
        difficulty: examData[selectedCategoryKey].exams[key].difficulty,
      }));

      const selectedExamDetails =
        examData[selectedCategoryKey]?.exams?.[selectedExamKey];

      // Filter exams based on search query
      const filteredExams = Object.entries(examData).flatMap(
        ([categoryKey, category]) =>
          Object.entries(category.exams)
            .filter(
              ([ _, exam]) =>
                exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exam.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                category.displayName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
            )
            .map(([examKey, exam]) => ({
              categoryKey,
              categoryName: category.displayName,
              examKey,
              examName: exam.name,
              difficulty: exam.difficulty,
              color: category.color,
            }))
      );

      return { categories, currentExams, selectedExamDetails, filteredExams };
    }, [selectedCategoryKey, selectedExamKey, searchQuery, examData]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryKey = e.target.value;
    setSelectedCategoryKey(newCategoryKey);
    const firstExamInNewCategory = Object.keys(
      examData[newCategoryKey]?.exams || {}
    )[0];
    if (firstExamInNewCategory) {
      setSelectedExamKey(firstExamInNewCategory);
    }
  };

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExamKey(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Beginner":
        return "#10B981";
      case "Intermediate":
        return "#F59E0B";
      case "Advanced":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getRandomColor = () => {
    const colors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#EC4899",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Function to update exam goal
  const handleUpdateExamGoal = async () => {
    if (!selectedExamDetails) return;

    try {
      setIsUpdatingExamGoal(true);
      setError("");
      setExamGoalUpdateMessage("");

      // Get the exam name and category from selected exam
      const examName = selectedExamDetails.name;
      const categoryName =
        examData[selectedCategoryKey]?.displayName || selectedCategoryKey;

      console.log("🚀 Updating exam goal:", { examName, categoryName });

      // Call the API to update exam goal
      const response = await examGoalApi.addExamGoal(examName, categoryName);

      if (response.data.success) {
        console.log(
          "✅ Exam goal updated successfully:",
          response.data.message
        );
        setExamGoalUpdateMessage("Exam goal updated successfully!");


        await refreshUserData();

        // Also refresh exam goal data in UserContext
        await fetchExamGoal(true); // Force refresh

        // Show success message for 3 seconds
        setTimeout(() => {
          setExamGoalUpdateMessage("");
        }, 3000);
      } else {
        throw new Error(response.data.message || "Failed to update exam goal");
      }
    } catch (err: any) {
      console.error("Failed to update exam goal:", err);
      setError("Failed to update exam goal. Please try again.");
    } finally {
      setIsUpdatingExamGoal(false);
    }
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      backgroundColor: theme.background,
      color: theme.primaryText,
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
      padding: "1rem",
    },
    main: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem 1rem",
    },
    header: {
      textAlign: "center",
      marginBottom: "2rem",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      color: theme.primaryText,
    },
    subtitle: {
      fontSize: "1.1rem",
      color: theme.secondaryText,
      marginTop: "0.5rem",
    },
    userInfo: {
      backgroundColor: theme.cardBackground,
      padding: "1.5rem",
      borderRadius: "12px",
      marginBottom: "2rem",
      border: "1px solid #374151",
    },
    searchContainer: {
      backgroundColor: theme.cardBackground,
      padding: "1.5rem",
      borderRadius: "12px",
      marginBottom: "2rem",
      border: "1px solid #374151",
    },
    searchInput: {
      width: "100%",
      padding: "0.75rem",
      backgroundColor: theme.inputBackground,
      color: theme.primaryText,
      border: `1px solid ${theme.divider}`,
      borderRadius: "8px",
      fontSize: "1rem",
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
      border: "1px solid #374151",
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
    detailsCard: {
      backgroundColor: theme.cardBackground,
      padding: "2rem",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "1px solid #374151",
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
    searchResults: {
      backgroundColor: theme.cardBackground,
      padding: "1.5rem",
      borderRadius: "12px",
      marginBottom: "2rem",
      border: "1px solid #374151",
    },
    searchResultItem: {
      padding: "1rem",
      border: "1px solid #374151",
      borderRadius: "8px",
      marginBottom: "1rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    searchResultItemHover: {
      backgroundColor: "#374151",
      borderColor: theme.accent,
    },
    difficultyBadge: {
      padding: "0.25rem 0.75rem",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: "bold",
      color: "white",
      display: "inline-block",
      marginLeft: "1rem",
    },
    categoryBadge: {
      padding: "0.25rem 0.75rem",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: "bold",
      color: "white",
      display: "inline-block",
      marginBottom: "0.5rem",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "200px",
      color: theme.secondaryText,
    },
    errorContainer: {
      backgroundColor: "#DC2626",
      color: "white",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "2rem",
      textAlign: "center",
    },
    examGoalUpdateButton: {
      backgroundColor: theme.accent,
      color: "white",
      padding: "0.75rem 1.5rem",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "1rem",
      transition: "all 0.2s ease",
    },
    examGoalUpdateButtonDisabled: {
      backgroundColor: theme.mutedText,
      color: theme.secondaryText,
      cursor: "not-allowed",
    },
    examGoalUpdateMessage: {
      backgroundColor: "#10B981",
      color: "white",
      padding: "0.75rem 1rem",
      borderRadius: "8px",
      marginTop: "1rem",
      textAlign: "center",
      fontSize: "0.9rem",
    },
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <main style={styles.main}>
          <div style={styles.loadingContainer}>
            <div>Loading exam data...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.title}>Exam Information Portal</h1>
          <p style={styles.subtitle}>
            Select a category and an exam to view its details.
          </p>
        </header>

        {/* Error Display */}
        {error && (
          <div style={styles.errorContainer}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* User Profile Information */}
        {profile && (
          <div style={styles.userInfo}>
            <h3 style={{ ...styles.detailHeading, color: theme.accent }}>
              Student Information
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <span style={styles.label}>Name: </span>
                <span style={styles.detailText}>
                  {profile.name || "Not set"}
                </span>
              </div>
              <div>
                <span style={styles.label}>Email: </span>
                <span style={styles.detailText}>{profile.email}</span>
              </div>
              {examGoal && (
                <>
                  <div>
                    <span style={styles.label}>Exam Goal: </span>
                    <span style={styles.detailText}>{examGoal.exam}</span>
                  </div>
                  <div>
                    <span style={styles.label}>Group Type: </span>
                    <span style={styles.detailText}>{examGoal.groupType}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search for exams, categories, or descriptions..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
        </div>

        {/* Search Results */}
        {searchQuery && filteredExams.length > 0 && (
          <div style={styles.searchResults}>
            <h3
              style={{
                ...styles.detailHeading,
                color: theme.accent,
                marginBottom: "1rem",
              }}
            >
              Search Results ({filteredExams.length})
            </h3>
            {filteredExams.map((exam, index) => (
              <div
                key={`${exam.categoryKey}-${exam.examKey}`}
                style={{
                  ...styles.searchResultItem,
                  borderColor: exam.color,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#374151";
                  e.currentTarget.style.borderColor = theme.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor =
                    exam.color || theme.divider;
                }}
                onClick={() => {
                  setSelectedCategoryKey(exam.categoryKey);
                  setSelectedExamKey(exam.examKey);
                  setSearchQuery("");
                }}
              >
                <div
                  style={{
                    ...styles.categoryBadge,
                    backgroundColor: exam.color,
                  }}
                >
                  {exam.categoryName}
                </div>
                <h4
                  style={{
                    ...styles.detailText,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                  }}
                >
                  {exam.examName}
                </h4>
                {exam.difficulty && (
                  <span
                    style={{
                      ...styles.difficultyBadge,
                      backgroundColor: getDifficultyColor(exam.difficulty),
                    }}
                  >
                    {exam.difficulty}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Category and Exam Selection */}
        {categories.length > 0 && (
          <div
            style={{
              ...styles.controlsContainer,
              ...{ flexDirection: window.innerWidth < 600 ? "column" : "row" },
            }}
          >
            <div style={{ ...styles.controlGroup, flex: 1 }}>
              <label htmlFor="category-select" style={styles.label}>
                Exam Category
              </label>
              <select
                id="category-select"
                value={selectedCategoryKey}
                onChange={handleCategoryChange}
                style={styles.select}
              >
                {categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ ...styles.controlGroup, flex: 1 }}>
              <label htmlFor="exam-select" style={styles.label}>
                Specific Exam
              </label>
              <select
                id="exam-select"
                value={selectedExamKey}
                onChange={handleExamChange}
                style={styles.select}
              >
                {currentExams.map((exam) => (
                  <option key={exam.key} value={exam.key}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Exam Details */}
        {selectedExamDetails && (
          <div style={styles.detailsCard}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1rem",
              }}
            >
              <h2 style={styles.detailTitle}>{selectedExamDetails.name}</h2>
              {selectedExamDetails.difficulty && (
                <span
                  style={{
                    ...styles.difficultyBadge,
                    backgroundColor: getDifficultyColor(
                      selectedExamDetails.difficulty
                    ),
                  }}
                >
                  {selectedExamDetails.difficulty}
                </span>
              )}
            </div>

            <div style={styles.detailSection}>
              <h3 style={styles.detailHeading}>Description</h3>
              <p style={styles.detailText}>{selectedExamDetails.description}</p>
            </div>

            <div style={styles.detailSection}>
              <h3 style={styles.detailHeading}>Eligibility</h3>
              <p style={styles.detailText}>{selectedExamDetails.eligibility}</p>
            </div>

            {selectedExamDetails.subjects && (
              <div style={styles.detailSection}>
                <h3 style={styles.detailHeading}>Subjects</h3>
                <ul style={{ ...styles.detailText, ...styles.detailList }}>
                  {selectedExamDetails.subjects.map((subject, index) => (
                    <li key={index} style={styles.detailListItem}>
                      {subject}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={styles.detailSection}>
              <h3 style={styles.detailHeading}>Exam Pattern</h3>
              <ul style={{ ...styles.detailText, ...styles.detailList }}>
                {selectedExamDetails.pattern.map((step, index) => (
                  <li key={index} style={styles.detailListItem}>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {selectedExamDetails.recommendedFor && (
              <div style={styles.detailSection}>
                <h3 style={styles.detailHeading}>Recommended For</h3>
                <ul style={{ ...styles.detailText, ...styles.detailList }}>
                  {selectedExamDetails.recommendedFor.map(
                    (recommendation, index) => (
                      <li key={index} style={styles.detailListItem}>
                        {recommendation}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {(selectedExamDetails.duration ||
              selectedExamDetails.totalMarks) && (
              <div style={styles.detailSection}>
                <h3 style={styles.detailHeading}>Additional Information</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {selectedExamDetails.duration && (
                    <div>
                      <span style={styles.label}>Duration: </span>
                      <span style={styles.detailText}>
                        {selectedExamDetails.duration}
                      </span>
                    </div>
                  )}
                  {selectedExamDetails.totalMarks && (
                    <div>
                      <span style={styles.label}>Total Marks: </span>
                      <span style={styles.detailText}>
                        {selectedExamDetails.totalMarks}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Exam Goal Update Section */}
            <div style={styles.detailSection}>
              <h3 style={styles.detailHeading}>Set as Exam Goal</h3>
              <p style={styles.detailText}>
                {examGoal?.exam === selectedExamDetails.name
                  ? `This is currently your exam goal (${examGoal.groupType})`
                  : "Click the button below to set this exam as your exam goal"}
              </p>

              {examGoalUpdateMessage && (
                <div style={styles.examGoalUpdateMessage}>
                  {examGoalUpdateMessage}
                </div>
              )}

              <button
                onClick={handleUpdateExamGoal}
                disabled={
                  isUpdatingExamGoal ||
                  examGoal?.exam === selectedExamDetails.name
                }
                style={{
                  ...styles.examGoalUpdateButton,
                  ...(isUpdatingExamGoal ||
                  examGoal?.exam === selectedExamDetails.name
                    ? styles.examGoalUpdateButtonDisabled
                    : {}),
                }}
              >
                {isUpdatingExamGoal
                  ? "Updating..."
                  : examGoal?.exam === selectedExamDetails.name
                  ? "Already Set as Goal"
                  : "Set as Exam Goal"}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
