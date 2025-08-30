import axios from "axios";

// API configuration
const API_CONFIG = {
  baseURL: 'https://api.krishak.in',
  //baseURL: 'http://localhost:8000',
  headers: {
    "Content-Type": "application/json",
  },
};

// Create axios instance with default config
const apiClient = axios.create(API_CONFIG);

// Add request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  console.log("🔑 Request interceptor - Token exists:", !!token);
  console.log(
    "🔑 Request interceptor - Token value:",
    token ? `${token.substring(0, 20)}...` : "null"
  );
  console.log("🔑 Request interceptor - URL:", config.url);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔑 Request interceptor - Authorization header set");
  } else {
    console.log(
      "🔑 Request interceptor - No token found, request will be unauthorized"
    );
  }
  return config;
});

// Response interface
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Error interface
export interface ApiError {
  message: string;
  status: number;
}

// Generic API request function
export const apiRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: any,
  config?: { headers?: Record<string, string> }
): Promise<ApiResponse<T>> => {
  try {
    console.log(`🌐 Making ${method} request to:`, endpoint);
    console.log(`🌐 Request data:`, data);

    const response = await apiClient.request({
      method,
      url: endpoint,
      data,
      headers: config?.headers,
    });

    console.log(`✅ ${method} ${endpoint} response:`, response.data);
    console.log(`✅ ${method} ${endpoint} status:`, response.status);

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    console.error("❌ API Request Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
    });

    throw {
      message: error.response?.data?.message || "An error occurred",
      status: error.response?.status || 500,
    } as ApiError;
  }
};

// Auth related API calls
export const authApi = {
  sendOtp: async (email: string) => {
    return apiRequest<{ success: boolean; message: string }>(
      "POST",
      "/ums/send-otp",
      {
        email,
      }
    );
  },

  verifyOtp: async (email: string, otp: string) => {
    return apiRequest<{
      success: boolean;
      access_token: string;
      message?: string;
    }>("POST", "/ums/verifi-otp", {
      email,
      otp,
    });
  },

  // Keep the old login method for backward compatibility if needed
  login: async (email: string, password: string) => {
    return apiRequest<{ access_token: string }>("POST", "/ums/login", {
      email,
      password,
    });
  },

  // Google OAuth login - initiate OAuth flow
  googleLogin: async () => {
    // For OAuth flows, we need to redirect the entire page, not make an AJAX request
    // This avoids CORS issues with Google's OAuth endpoint
    const redirectUrl = `${API_CONFIG.baseURL}/ums/auth/login`;
    window.location.href = redirectUrl;

    // Return a promise that resolves immediately since we're redirecting
    return Promise.resolve({
      data: { redirect_url: redirectUrl },
      status: 200,
    });
  },

  // Get authenticated user data (for exam goal check)
  getAuthenticatedUser: async () => {
    console.log(
      "🚨 DIRECT API CALL to getAuthenticatedUser",
      new Date().toISOString()
    );
    return apiRequest<{
      exam?: string;
      group_type?: string;
      name?: string;
      email?: string;
      id?: string;
      otp?: string;
      password?: string;
      phoneno?: string;
      type?: string;
      usercode?: string;
      gender?: string;
      date_of_birth?: string;
      exam_goal?: {
        exam: string | null;
        group: string | null;
      };
    }>("GET", "/ums/me");
  },

  // Update user details
  updateUserDetails: async (userData: {
    name: string;
    gender?: string;
    date_of_birth?: string;
  }) => {
    return apiRequest<{ message: string }>("PUT", "/ums/user", userData);
  },
};

// Exam goal related API calls
export interface ExamType {
  value: string;
  label: string;
  group: string[];
}

export const examGoalApi = {
  getExamTypes: async () => {
    return apiRequest<{ success: boolean; data: ExamType[] }>(
      "GET",
      "/exam-goal/exam-type"
    );
  },
  addExamGoal: async (exam: string, groupType: string) => {
    return apiRequest<{ success: boolean; message: string }>(
      "POST",
      "/exam-goal/add",
      {
        exam,
        group_type: groupType,
      }
    );
  },
  getUserExamGoal: async () => {
    return apiRequest<{
      success: boolean;
      data: { exam: string; group_type: string } | null;
    }>("GET", "/exam-goal");
  },
};

export interface VideoDetail {
  external_source_id: string;
  title: string;
  description: string;
  tags: string[];
  url: string;
  type: string;
  user_code: string;
  topics: string[];
  created_at: string;
}

export interface SuggestedVideo {
  id: number;
  title: string;
  topic: string;
  thumbnailUrl: string;
  url: string;
  description?: string;
  tags?: string[];
}

export interface VideoChapter {
  timestamp: string;
  title: string;
  description: string;
}

export interface VideoChaptersResponse {
  video_id: string;
  chapters: VideoChapter[];
}

export interface VideoTranscriptResponse {
  video_id: string;
  transcript: string;
}

export const videoApi = {
  getVideoDetail: async (url: string): Promise<VideoDetail> => {
    const response = await apiRequest<VideoDetail>(
      "GET",
      `/video/detail?url=${encodeURIComponent(url)}`
    );
    return response.data;
  },

  getSuggestedVideos: async (): Promise<SuggestedVideo[]> => {
    const response = await apiRequest<{ suggested: any[] }>(
      "GET",
      "/video/suggested"
    );
    const result = response.data;

    // Handle the API response structure: { suggested: [...] }
    if (result.suggested && Array.isArray(result.suggested)) {
      // Transform the API response to match our interface
      return result.suggested.map((video: any) => ({
        id: video.video_id, // Map video_id to id
        title: video.title,
        topic: video.channel_title || "General", // Use channel_title as topic
        thumbnailUrl: video.thumbnail, // Map thumbnail to thumbnailUrl
        url: video.url,
        description: video.channel_title, // Use channel_title as description
        tags: [video.source_for], // Use source_for as tags
      }));
    }

    // Fallback to empty array if structure is unexpected
    return [];
  },

  getVideoChapters: async (videoId: string): Promise<VideoChaptersResponse> => {
    const response = await apiRequest<VideoChaptersResponse>(
      "GET",
      `/video/chapter?video_id=${encodeURIComponent(videoId)}`
    );
    return response.data;
  },

  getVideoTranscript: async (
    videoId: string
  ): Promise<VideoTranscriptResponse> => {
    const response = await apiRequest<VideoTranscriptResponse>(
      "GET",
      `/video/transcript?video_id=${encodeURIComponent(videoId)}`
    );
    return response.data;
  },
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatHistoryResponse {
  memory: ChatMessage[];
}

interface ChatStartResponse {
  role: "assistant";
  content: string;
}

interface ChatSendResponse {
  role: "assistant";
  content: string;
}

export const chatApi = {
  getChatHistory: async (videoId: string): Promise<ChatHistoryResponse> => {
    const response = await apiRequest<ChatHistoryResponse>(
      "GET",
      `/ai_agent/history?vedio_id=${encodeURIComponent(videoId)}`
    );
    return response.data;
  },

  startChat: async (videoId: string): Promise<ChatStartResponse> => {
    const response = await apiRequest<ChatStartResponse>(
      "POST",
      "/ai_agent/start",
      { vedio_id: videoId }
    );
    return response.data;
  },

  sendMessage: async (
    videoId: string,
    message: string
  ): Promise<ChatSendResponse> => {
    const response = await apiRequest<ChatSendResponse>(
      "POST",
      "/ai_agent/send",
      {
        vedio_id: videoId,
        message: message,
      }
    );
    return response.data;
  },
};

interface SubTopic {
  subject: string;
  sub_topic: string[];
}

interface TestSeriesFormData {
  subjects: SubTopic[];
  level: string[];
  language: string[];
}

export const fetchTestSeriesFormData =
  async (): Promise<TestSeriesFormData> => {
    const response = await apiRequest<TestSeriesFormData>(
      "GET",
      "/test-series/form-data"
    );
    return response.data;
  };

interface TestSeriesResponse {
  testId: string;
  status: string;
}

export const testSeriesApi = {
  createTest: async (data: {
    subject: string;
    sub_topic: string[];
    level: string;
    language: string;
  }): Promise<TestSeriesResponse> => {
    const response = await apiRequest<TestSeriesResponse>(
      "POST",
      "/test-series/form",
      data
    );
    return response.data;
  },
};

// Quiz/Test Questions API
export interface QuestionResponse {
  session_id: number;
  questions: {
    questionId: number;
    questionType: string;
    content: string;
    option: string[];
    answer: string | null;
  }[];
}

export interface SubmitTestRequest {
  session_id: number;
  answers: {
    question_id: number;
    selected_option: string | null;
    answer: string | null;
  }[];
}

export interface SubmitTestResponse {
  session_id: number;
  score: number;
  total: number;
  attempt: number;
}

// URL Validation API
export interface UrlValidationResponse {
  isValid: boolean;
  isOutOfSyllabus: boolean;
  message?: string;
}

export const validateUrl = async (
  url: string
): Promise<UrlValidationResponse> => {
  try {
    console.log("Validating URL:", url); // Debug log
    // For now, implement dummy logic
    // In a real implementation, this would call the backend API
    const lowerUrl = url.toLowerCase();

    // Check if URL contains "out of syllabus" in any form
    if (
      lowerUrl.includes("out of syllabus") ||
      lowerUrl.includes("outofsyllabus") ||
      lowerUrl.includes("out-of-syllabus") ||
      lowerUrl.includes("out_of_syllabus")
    ) {
      console.log("Out of syllabus detected!"); // Debug log
      return {
        isValid: false,
        isOutOfSyllabus: true,
        message: "This content is out of syllabus",
      };
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return {
        isValid: false,
        isOutOfSyllabus: false,
        message: "Invalid URL format",
      };
    }

    // For now, accept all valid URLs
    return {
      isValid: true,
      isOutOfSyllabus: false,
    };
  } catch (error) {
    console.error("URL validation error:", error);
    return {
      isValid: false,
      isOutOfSyllabus: false,
      message: "Failed to validate URL",
    };
  }
};
type TestLevel = "easy" | "medium" | "hard";
type TestLanguage = "en" | "hn";

interface TestData {
  subject: string;
  topics: string[];
  level: TestLevel;
  language: TestLanguage;
}
export const quizApi = {
  startTest: async (testConfig: TestData): Promise<QuestionResponse> => {
    const response = await apiRequest<QuestionResponse>(
      "POST",
      `/test-series/start-test-session`,
      testConfig
    );
    return response.data;
  },

  getQuestions: async (sessionId: number): Promise<QuestionResponse> => {
    const response = await apiRequest<QuestionResponse>(
      "GET",
      `/test-series/question/${sessionId}`
    );
    return response.data;
  },

  submitTest: async (data: SubmitTestRequest): Promise<SubmitTestResponse> => {
    const response = await apiRequest<SubmitTestResponse>(
      "POST",
      "/test-series/submit-test-session",
      data
    );
    return response.data;
  },
};

// Feedback API
export interface FeedbackRequest {
  component: string;        // Required
  description: string;      // Required (1-4000 chars)
  rating: number;           // Required (1-5)
  source_id: string;        // Required
  page_url: string;         // Required
}

export interface FeedbackResponse {
  id: string;               // Required
  component: string;         // Required
  description: string;       // Required
  rating: number;           // Required
  reporter: any;            // Required (Dict)
  date_submitted: string;   // Required
  source_id: string;        // Required
  page_url: string;         // Required
}

// Component name enum
export enum ComponentName {
  Video = "Video",
  Chat = "Chat", 
  Quiz = "Quiz",
  Summary = "Summary",
  Flashcard = "Flashcard",
  Test = "Test"
}

// Check feedback availability response
export interface FeedbackStatus {
  can_feedback: boolean;
  existing_feedback: {
    id: string;
    rating: number;
    description: string;
    date_submitted: string;
    page_url: string;
  } | null;
  reason: string;
}

// New multi-component feedback status response
export interface MultiComponentFeedbackStatus {
  page_url: string;
  components: Array<{
    component: ComponentName;
    can_feedback: boolean;
    existing_feedback: {
      id: string;
      rating: number;
      description: string;
      date_submitted: string;
      page_url: string;
    } | null;
    reason: string;
    source_id: string;
  }>;
}

// Feedback list response
export interface FeedbackListResponse {
  feedbacks: FeedbackResponse[];
  total: number;
  page: number;
  size: number;
}

export const feedbackApi = {
  // Check if user can submit feedback for a single component (legacy)
  canSubmitFeedback: async (sourceId: string, component: ComponentName, pageUrl: string): Promise<FeedbackStatus> => {
    const response = await apiRequest<FeedbackStatus>('GET', `/feedback/can-feedback?source_id=${sourceId}&component=${component}&page_url=${encodeURIComponent(pageUrl)}`);
    return response.data;
  },

  // Check if user can submit feedback for multiple components (new format)
  canSubmitFeedbackMulti: async (sourceId: string, components: ComponentName[], pageUrl: string): Promise<MultiComponentFeedbackStatus> => {
    const componentsParam = components.join(',');
    const response = await apiRequest<MultiComponentFeedbackStatus>('GET', `/feedback/can-feedback?source_id=${sourceId}&components=${componentsParam}&page_url=${encodeURIComponent(pageUrl)}`);
    return response.data;
  },

  // Submit new feedback
  submitFeedback: async (data: FeedbackRequest): Promise<FeedbackResponse> => {
    const response = await apiRequest<FeedbackResponse>('POST', '/feedback/', data);
    return response.data;
  },

  // Get user's feedback list
  getUserFeedback: async (page: number = 1, size: number = 10): Promise<FeedbackListResponse> => {
    const response = await apiRequest<FeedbackListResponse>('GET', `/feedback/?page=${page}&size=${size}`);
    return response.data;
  },

  // Get specific feedback by ID
  getFeedbackById: async (id: string): Promise<FeedbackResponse> => {
    const response = await apiRequest<FeedbackResponse>('GET', `/feedback/${id}`);
    return response.data;
  },
};
