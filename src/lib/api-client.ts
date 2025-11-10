import axios from "axios";

// API configuration
const API_CONFIG = {
  // baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  baseURL: 'https://api.krishak.in',
  headers: {
    "Content-Type": "application/json",
  },
};

// Create axios instance with default config
const apiClient = axios.create(API_CONFIG);

// Global flags to prevent duplicate API calls
const activeRequests = new Map<string, Promise<unknown>>();

// Add request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
  } else {
    
  }
  return config;
});

// Global auth error handler registration
let authErrorHandler: ((status: number, endpoint: string) => void) | null = null;
export const setAuthErrorHandler = (handler: (status: number, endpoint: string) => void) => {
  authErrorHandler = handler;
};

// Endpoints that should trigger logout on 401/403 (critical auth endpoints)
const CRITICAL_AUTH_ENDPOINTS = [
  '/ums/me',
  '/ums/refresh-token',
  '/ums/logout',
  '/ums/verify-otp',
  '/ums/login'
];

// Endpoints that should NOT trigger logout on 401/403 (resource-specific endpoints)
const RESOURCE_ENDPOINTS = [
  '/video/',
  '/chapter/',
  '/test-series/',
  '/learning/',
  '/feedback/',
  '/progress/',
  '/history/',
  '/suggested/',
  '/can-feedback/',
  '/detail/'
];

// Function to check if endpoint should trigger logout
const shouldTriggerLogout = (endpoint: string, status: number): boolean => {
  // Always logout on critical auth endpoints
  if (CRITICAL_AUTH_ENDPOINTS.some(critical => endpoint.includes(critical))) {
    return true;
  }
  
  // For resource endpoints, only logout on 401 (not 403)
  if (RESOURCE_ENDPOINTS.some(resource => endpoint.includes(resource))) {
    return status === 401; // 403 might be permission-related, not auth-related
  }
  
  // For other endpoints, logout on both 401 and 403
  return status === 401 || status === 403;
};

// Function to validate if token exists and is not expired
const isTokenValid = (): boolean => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;
  
  try {
    // Basic JWT token validation (check if it's not expired)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

// Response interceptor to catch auth errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const status = error?.response?.status;
      const endpoint = error?.config?.url || '';
      
      if ((status === 401 || status === 403) && typeof authErrorHandler === 'function') {
        // Only trigger logout if:
        // 1. The endpoint should trigger logout based on our rules
        // 2. AND the token is actually invalid (not just a permission issue)
        if (shouldTriggerLogout(endpoint, status)) {
          // For 401 on resource endpoints, check if token is actually invalid
          if (status === 401 && RESOURCE_ENDPOINTS.some(resource => endpoint.includes(resource))) {
            if (!isTokenValid()) {
              authErrorHandler(status, endpoint);
            } else {
              console.warn(`401 on ${endpoint} but token appears valid - not logging out`);
            }
          } else {
            // For critical auth endpoints or 403s, always logout
            authErrorHandler(status, endpoint);
          }
        }
      }
    } catch {}
    return Promise.reject(error);
  }
);

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

// Generic API request function with retry mechanism
export const apiRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: unknown,
  config?: { headers?: Record<string, string> }
): Promise<ApiResponse<T>> => {
  const maxRetries = 2;
  let lastError: unknown;

  

  const requestKey = `${method}:${endpoint}:${data ? JSON.stringify(data) : ''}`;

  // De-duplicate identical in-flight requests
  if (activeRequests.has(requestKey)) {
    return (await activeRequests.get(requestKey)) as ApiResponse<T>;
  }

  const runner = (async (): Promise<ApiResponse<T>> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await apiClient.request({
        method,
        url: endpoint,
        data,
        headers: config?.headers,
      });

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: unknown) {
      lastError = error;
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };

      // Don't retry on authentication errors
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        
        break;
      }

      // Don't retry on client errors (4xx except 401/403)
      if (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
        
        break;
      }

      // Retry on server errors (5xx) and network errors
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // If all retries failed, throw the last error
  const finalError = lastError as { response?: { status?: number; data?: { message?: string } } };

  throw {
    message: finalError.response?.data?.message || "An error occurred",
    status: finalError.response?.status || 500,
  } as ApiError;
  })();

  activeRequests.set(requestKey, runner);
  try {
    const result = await runner;
    return result;
  } finally {
    activeRequests.delete(requestKey);
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
    // Determine environment for backend routing (Vite)
    //const mode: string = import.meta.env.MODE;
    const envParam = 'prod';
    //const envParam = mode === 'production' ? 'prod' : 'dev';
    const redirectUrl = `${API_CONFIG.baseURL}/ums/auth/login?env=${envParam}`;
    window.location.href = redirectUrl;

    // Return a promise that resolves immediately since we're redirecting
    return Promise.resolve({
      data: { redirect_url: redirectUrl },
      status: 200,
    });
  },

  // Get authenticated user data (for exam goal check)
  getAuthenticatedUser: async () => {
    
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

// Exam details interface
export interface ExamDetails {
  id: string;
  name: string;
  exam_id: string;
  description: string;
  eligibility: string;
  pattern: string[];
}

// Exam category interface
export interface ExamCategory {
  [examKey: string]: ExamDetails;
}

// Exam data structure interface
export interface ExamData {
  [categoryKey: string]: {
    displayName: string;
    exams: ExamCategory;
  };
}

export const examGoalApi = {
  getExamTypes: async () => {
    return apiRequest<{ success: boolean; data: ExamType[] }>(
      "GET",
      "/exam-goal/exam-type"
    );
  },
  getExamDetails: async (exam: string, groupType: string) => {
    return apiRequest<{ success: boolean; data: ExamDetails[] }>(
      "GET",
      "/exam-goal/exam-detail", {
        exam: exam,
        group: groupType,
      } 
    );
  },
  addExamGoal: async (exam: string, groupType: string) => {
    return apiRequest<{ success: boolean; message: string }>(
      "POST",
      "/exam-goal/add",
      {
        exam: exam,
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
  id: string;
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
    
    // Check if response indicates out of syllabus content
    if (response.status === 204 || (response.data && response.data.topics && response.data.topics.length === 0)) {
      throw {
        message: "This content is out of syllabus",
        status: 204,
        isOutOfSyllabus: true
      };
    }
    
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
      return result.suggested.map((video: unknown) => {
        const videoData = video as { 
          video_id?: string; 
          title?: string; 
          channel_title?: string; 
          thumbnail?: string; 
          url?: string; 
          source_for?: string; 
        };
        return {
          id: videoData.video_id || "", // Map video_id to id
          title: videoData.title || "",
          topic: videoData.channel_title || "General", // Use channel_title as topic
          thumbnailUrl: videoData.thumbnail || "", // Map thumbnail to thumbnailUrl
          url: videoData.url || "",
          description: videoData.channel_title || "", // Use channel_title as description
          tags: videoData.source_for ? [videoData.source_for] : [], // Use source_for as tags
        };
      });
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

  // Video Summary API with global deduplication
  getVideoSummary: async (
    videoId: string
  ): Promise<{ summary: string; sections: Array<{ title: string; content: string }>; transcript?: string }> => {
    const requestKey = `summary-${videoId}`;
    
    // Check if request is already in progress
    if (activeRequests.has(requestKey)) {
      
      return activeRequests.get(requestKey)! as Promise<{ summary: string; sections: Array<{ title: string; content: string }>; transcript?: string }>;
    }

    const requestPromise = (async (): Promise<{ summary: string; sections: Array<{ title: string; content: string }>; transcript?: string }> => {
      try {
        const response = await apiRequest<{ summary: string; sections: Array<{ title: string; content: string }>; transcript?: string }>(
          "GET",
          `/video/summary?video_id=${encodeURIComponent(videoId)}`
        );
        return response.data;
      } catch (error: unknown) {
        
        // Return a fallback structure to prevent component crashes
        return {
          summary: "Summary not available",
          sections: [{
            title: "Video Summary",
            content: "Unable to load summary at this time. Please try again later."
          }]
        };
      } finally {
        // Remove from active requests when done
        activeRequests.delete(requestKey);
      }
    })();

    // Store the promise to prevent duplicate requests
    activeRequests.set(requestKey, requestPromise);
    return requestPromise;
  },

  // Video Flashcards API with global deduplication
  getVideoFlashcards: async (
    videoId: string
  ): Promise<{ cards: Array<{ id: number; question: string; answer: string; hint?: string; difficulty?: string }>; video_id: string }> => {
    const requestKey = `flashcards-${videoId}`;
    
    // Check if request is already in progress
    if (activeRequests.has(requestKey)) {
      
      return activeRequests.get(requestKey)! as Promise<{ cards: Array<{ id: number; question: string; answer: string; hint?: string; difficulty?: string }>; video_id: string }>;
    }

    const requestPromise = (async (): Promise<{ cards: Array<{ id: number; question: string; answer: string; hint?: string; difficulty?: string }>; video_id: string }> => {
      try {
        const response = await apiRequest<{ cards: Array<{ id: number; question: string; answer: string; hint?: string; difficulty?: string }>; video_id: string }>(
          "GET",
          `/video/flash-card?video_id=${encodeURIComponent(videoId)}`
        );
        return response.data;
      } catch (error: unknown) {
        
        // Return a fallback structure to prevent component crashes
        return {
          cards: [{
            id: 1,
            question: "Flashcards not available",
            answer: "Unable to load flashcards at this time. Please try again later."
          }],
          video_id: videoId
        };
      } finally {
        // Remove from active requests when done
        activeRequests.delete(requestKey);
      }
    })();

    // Store the promise to prevent duplicate requests
    activeRequests.set(requestKey, requestPromise);
    return requestPromise;
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
      `/ai_agent/history?video_id=${encodeURIComponent(videoId)}`
    );
    return response.data;
  },

  startChat: async (videoId: string): Promise<ChatStartResponse> => {
    const response = await apiRequest<ChatStartResponse>(
      "POST",
      "/ai_agent/start",
      { video_id: videoId }
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
        video_id: videoId,
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

// New grouped sections response (v3)
export interface SectionQuestions {
  key: string;
  name: string;
  questions: {
    questionId: number;
    questionType: string;
    content: string;
    option: string[];
    answer: string | null;
  }[];
}

export interface StartTestSessionResponseV3 {
  session_id: number;
  sections: Record<string, SectionQuestions>;
  total_questions: number;
  total_marks: number;
  total_time: number; // seconds
}

// Enhanced interfaces for comprehensive test submission
export interface SubmittedAnswer {
  question_id: number;
  selected_option?: string | null;
  answer_order: number; // API requires this field
  time_taken?: number; // Time taken in seconds
}

export interface SubmitTestRequest {
  session_id: number;
  answers: SubmittedAnswer[];
  metadata?: {
    total_time?: number;
    start_time?: string;
    end_time?: string;
    [key: string]: any;
  };
}

export interface SubmitTestResponse {
  session_id: number;
  score: number;
  total: number;
  total_marks_scored: number;
  attempt: number;
  message: string;
}

// Legacy interface for backward compatibility
export interface LegacySubmitTestRequest {
  session_id: number;
  answers: {
    question_id: number;
    selected_option: string | null;
    answer: string | null;
  }[];
}

export interface LegacySubmitTestResponse {
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
// Quiz API interfaces
export interface StartTestRequestV2 {
  topics: string[];
}

export interface QuizResponse {
  questions: Question[];
}

export interface Question {
  questionText: string;
  questionType: "MCQ";
  options: Option[];
}

export interface Option {
  text: string;
  isCorrect: boolean;
}

export const quizApi = {
  initiateTest: async (
    testConfig: TestData
  ): Promise<{"session_id": number}> => {
    // Accept either legacy flat questions or new grouped-sections payload
    const response = await apiRequest<QuestionResponse | StartTestSessionResponseV3>(
      "POST",
      `/test-series/start-test-session`,
      testConfig
    );
    return response.data as any;
  },

  startTest: async (
    sessionId: number
  ): Promise<QuestionResponse | StartTestSessionResponseV3> => {
    // Accept either legacy flat questions or new grouped-sections payload
    const response = await apiRequest<QuestionResponse | StartTestSessionResponseV3>(
      "GET",
      `/test-series/session/${sessionId}`,
    );
    return response.data as any;
  },

  getTestSolutions: async (
    sessionId: number
  ): Promise<QuestionResponse | StartTestSessionResponseV3> => {
    // Accept either legacy flat questions or new grouped-sections payload
    const response = await apiRequest<QuestionResponse | StartTestSessionResponseV3>(
      "GET",
      `/test-series/view-solution/${sessionId}`,
    );
    return response.data as any;
  },

  submitTest: async (data: SubmitTestRequest): Promise<SubmitTestResponse> => {
    const response = await apiRequest<SubmitTestResponse>(
      "POST",
      "/test-series/submit-test-session",
      data
    );
    return response.data;
  },

  // Fetch test analysis by session id
  testAnalysis: async (sessionId: number): Promise<Record<string, unknown>> => {
    const response = await apiRequest<Record<string, unknown>>(
      "GET",
      `/test-series/analysis/${encodeURIComponent(sessionId)}`
    );
    return response.data;
  },

  // Enhanced submit test with comprehensive metadata
  submitTestEnhanced: async (
    sessionId: number, 
    answers: SubmittedAnswer[], 
    metadata?: { total_time?: number; start_time?: string; end_time?: string }
  ): Promise<SubmitTestResponse> => {
    const submitData: SubmitTestRequest = {
      session_id: sessionId,
      answers,
      metadata
    };
    
    const response = await apiRequest<SubmitTestResponse>(
      "POST",
      "/test-series/submit-test-session",
      submitData
    );
    
    
    return response.data;
  },

  // New API for dynamic quiz generation
  generateQuiz: async (topics: string[]): Promise<QuizResponse> => {
    const requestKey = `quiz-${topics.join(',')}`;
    // Check if there's already an active request for the same topics

    /*
    if (activeRequests.has(requestKey)) {
      
      return activeRequests.get(requestKey)! as Promise<QuizResponse>;
    }
      */

    
    const requestPromise = (async () => {
      try {
        
        
        const response = await apiRequest<QuizResponse>(
          "POST",
          "/test-series/quiz",
          { topics }
        );
        
        
        return response.data;
      } catch (error) {
        
        throw error;
      } finally {
        // Clean up the request from active requests
        activeRequests.delete(requestKey);
        
      }
    })();

    // Store the promise for potential reuse
    activeRequests.set(requestKey, requestPromise);
    return requestPromise;
  },
};

// Video Progress Tracking API
export interface VideoProgressRequest {
  video_id: string;         // Required
  watch_percentage: number; // Required (0-100)
  total_duration: number;   // Required (in seconds)
  current_position: number;     // Required (in seconds)
  page_url: string;         // Required
}

export interface VideoProgressResponse {
  success: boolean;
  message: string;
  data: {
    video_id: string;
    watch_percentage: number;
    total_duration: number;
    current_position: number;
    last_updated: string;
    title: string;
    url: string;
    tags: string[];
    topics: string[];
  };
}

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
  reporter: Record<string, unknown>;            // Required (Dict)
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
  Test = "Test",
  TestAnalysis = "TestAnalysis",
  VideoRecommendation = "VideoRecommendation",
  TestRecommentation = "TestRecommentation",
  SnippetRecommendation = "SnippetRecommendation"
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

// Feedback chip item interface
export interface FeedbackChipItem {
  label: string;
  component_type: string;
}

// Feedback chips suggestions response
export interface FeedbackChipsResponse {
  [rating: string]: FeedbackChipItem[]; // Rating as key (1-5), array of chip objects as value
}

// Video Progress Tracking API
export const videoProgressApi = {
  // Track video watch progress with deduplication
  trackProgress: async (data: VideoProgressRequest): Promise<VideoProgressResponse> => {
    const requestKey = `progress-${data.video_id}`;
    
    // Check if request is already in progress
    if (activeRequests.has(requestKey)) {
      return activeRequests.get(requestKey)! as Promise<VideoProgressResponse>;
    }

    const requestPromise = (async (): Promise<VideoProgressResponse> => {
      try {
        const response = await apiRequest<VideoProgressResponse>('POST', '/video/progress', data);
        return response.data;
      } finally {
        // Remove from active requests when done
        activeRequests.delete(requestKey);
      }
    })();

    // Store the promise to prevent duplicate requests
    activeRequests.set(requestKey, requestPromise);
    return requestPromise;
  },

  // Get video progress for a specific video
  getProgress: async (videoId: string): Promise<VideoProgressResponse> => {
    const response = await apiRequest<VideoProgressResponse>('GET', `/video/progress/${videoId}`);
    return response.data;
  },

  // Get all video progress for user
  getAllProgress: async (): Promise<{ videos: VideoProgressResponse[] }> => {
    const response = await apiRequest<{ videos: VideoProgressResponse[] }>('GET', '/video/progress');
    return response.data;
  },
};

export const feedbackApi = {
  // Check if user can submit feedback for a single component (legacy)

  // Check if user can submit feedback for multiple components (new format)
  canSubmitFeedbackMulti: async (sourceId: string, components: ComponentName[], pageUrl: string): Promise<MultiComponentFeedbackStatus> => {
    const componentsParam = components.join(',');
    const response = await apiRequest<MultiComponentFeedbackStatus>('GET', `/feedback/can-feedback?source_id=${sourceId}&components=${componentsParam}&page_url=${encodeURIComponent(pageUrl)}`);
    return response.data;
  },

  // Get feedback chips suggestions based on rating and component type
  getFeedbackChips: async (componentType?: string): Promise<FeedbackChipsResponse> => {
    let endpoint = '/feedback/feedback-chips';
    const params = new URLSearchParams();
    
    if (componentType) {
      params.append('component_type', componentType);
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    const response = await apiRequest<FeedbackChipsResponse>('GET', endpoint);
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

// Attempted Tests API interfaces
export interface AttemptedTest {
  id: string;
  title: string;
  positive_score: number;
  date: string;
  questions: number;
  wrong: number;
  session_id: number;
  total_marks: number;
  total_marks_scored: number;
  attempt: number;
  subject: string;
  topics: string[];
  level: string;
  language?: string;
}

export interface AttemptedTestsResponse {
  tests: AttemptedTest[];
  total: number;
  page: number;
  size: number;
}

export const attemptedTestsApi = {
  // Get user's attempted tests
  getAttemptedTests: async (page: number = 1, size: number = 10): Promise<AttemptedTestsResponse> => {
    const response = await apiRequest<AttemptedTestsResponse>('GET', `/test-series/attempted-tests?page=${page}&size=${size}`);
    return response.data;
  },
};
