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