import axios from 'axios';

// Create a custom axios instance with proper configuration
// Use production API URL in production, localhost in development
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    // Replace with your actual backend Render URL
    return process.env.REACT_APP_API_URL || 'https://iubat-smartlibrary-backend.onrender.com';
  }
  return 'http://localhost:8000';
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set up request interceptors for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('🔄 Axios Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      withCredentials: config.withCredentials,
      headers: config.headers,
      cookies: document.cookie
    });
    
    // Ensure withCredentials is always true
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    console.error('❌ Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// Set up response interceptors for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Axios Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
      cookies: document.cookie
    });
    return response;
  },
  (error) => {
    console.error('❌ Axios Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
      cookies: document.cookie
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
