import { tokenManager } from "./auth";

interface FetcherOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Get auth token (implement based on your auth system)
const getAuthToken = () => {
  // Replace with your actual token retrieval logic
  if (typeof window !== 'undefined') {
    return tokenManager.getToken();
  }
  return '';
};

export const baseFetcher = async <T = any>(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    method = 'GET',
    body,
    headers = {},
    isFormData = false
  } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    method,
    headers: {
      'Accept': 'application/json',
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...headers
    }
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    if (isFormData) {
      config.body = body;
    } else {
      config.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP error! status: ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0,
      null
    );
  }
};

// Default fetcher for useSWR (GET requests only)
export const defaultFetcher = async (url: string) => {
  const response = await baseFetcher(url);
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch data');
  }
  return response;
};
