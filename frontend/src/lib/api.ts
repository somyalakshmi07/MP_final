import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add token and guest ID to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add guest ID for cart operations if not authenticated
  if (!token) {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem('guestId', guestId);
    }
    config.headers['x-guest-id'] = guestId;
  }
  
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        error.response = {
          data: { error: 'Request timeout. Please check your connection and try again.' },
          status: 408,
        };
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        error.response = {
          data: { error: 'Cannot connect to server. Please ensure all backend services are running and check your network connection.' },
          status: 503,
        };
      } else {
        error.response = {
          data: { error: 'Service unavailable. Please check backend services and Cosmos DB connection.' },
          status: 503,
        };
      }
    }
    return Promise.reject(error);
  }
);

export default api;
