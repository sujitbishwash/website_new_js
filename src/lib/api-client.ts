import axios from 'axios';

// API configuration
const API_CONFIG = {
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create axios instance with default config
const apiClient = axios.create(API_CONFIG);

// Add request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
  config?: { headers?: Record<string, string> }
): Promise<ApiResponse<T>> => {
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
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status || 500,
    } as ApiError;
  }
};

// Auth related API calls
export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest<{ access_token: string }>('POST', '/ums/login', {
      email,
      password,
    });
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
    const token = localStorage.getItem('access_token');
    return apiRequest<{ success: boolean; data: ExamType[] }>('GET', '/exam-goal/exam-type', undefined, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  addExamGoal: async (exam: string, groupType: string) => {
    const token = localStorage.getItem('access_token');
    return apiRequest<{ success: boolean; message: string }>('POST', '/exam-goal/add', {
      exam,
      group_type: groupType
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
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
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_CONFIG.baseURL}/video/detail?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch video details');
    }

    return response.json();
  },

  getVideoChapters: async (videoId: string): Promise<VideoChaptersResponse> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_CONFIG.baseURL}/video/chapter?video_id=${encodeURIComponent(videoId)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch video chapters');
    }

    return response.json();
  },

  getVideoTranscript: async (videoId: string): Promise<VideoTranscriptResponse> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_CONFIG.baseURL}/video/transcript?video_id=${encodeURIComponent(videoId)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch video transcript');
    }

    return response.json();
  },
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHistoryResponse {
  memory: ChatMessage[];
}

interface ChatStartResponse {
  role: 'assistant';
  content: string;
}

interface ChatSendResponse{
    role: 'assistant';
    content: string;
  }

export const chatApi = {
  getChatHistory: async (videoId: string): Promise<ChatHistoryResponse> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_CONFIG.baseURL}/ai_agent/history?vedio_id=${encodeURIComponent(videoId)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }

    return response.json();
  },

  startChat: async (videoId: string): Promise<ChatStartResponse> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_CONFIG.baseURL}/ai_agent/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ vedio_id: videoId })
    });

    if (!response.ok) {
      throw new Error('Failed to start chat');
    }

    return response.json();
  },

  sendMessage: async (videoId: string, message: string): Promise<ChatSendResponse> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_CONFIG.baseURL}/ai_agent/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        vedio_id: videoId,
        message: message
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }
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

export const fetchTestSeriesFormData = async (): Promise<TestSeriesFormData> => {
  const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
  const response = await fetch(`${API_CONFIG.baseURL}/test-series/form-data`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch test series data');
  }
  return response.json();
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
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_CONFIG.baseURL}/test-series/form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to create test');
    }

    return response.json();
  }
};

