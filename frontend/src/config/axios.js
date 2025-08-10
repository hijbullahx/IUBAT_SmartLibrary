import axios from 'axios';

// Create a custom axios instance with proper configuration
// Use current domain in production, proxy in development
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : (process.env.REACT_APP_API_URL || 'http://localhost:8000'),
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
