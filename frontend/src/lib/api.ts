import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

type SessionWithAccessToken = {
  accessToken?: string;
};

// Initialize the core API client pointed at the FastAPI backend
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically inject the Keycloak Auth Token
api.interceptors.request.use(
  async (config) => {
    // Fetch the NextAuth session which contains the Keycloak JWT
    const session = await getSession() as SessionWithAccessToken | null;
    const token = session?.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    
    // Automatically sign out if token has expired or is invalid
    if (error.response?.status === 401) {
      void signOut();
    }
    
    return Promise.reject(error);
  }
);
