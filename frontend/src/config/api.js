// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-domain.vercel.app' 
    : 'http://127.0.0.1:8000');

export const API_ENDPOINTS = {
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login/`,
  ADMIN_REPORTS_TIME: `${API_BASE_URL}/api/admin/reports/time-based/`,
  ADMIN_REPORTS_STUDENT: `${API_BASE_URL}/api/admin/reports/student-based/`,
  
  // Library endpoints
  LIBRARY_ENTRY: `${API_BASE_URL}/api/entry/library/`,
  
  // E-Library endpoints
  ELIBRARY_PC_STATUS: `${API_BASE_URL}/api/elibrary/pc_status/`,
  ELIBRARY_CHECKIN: `${API_BASE_URL}/api/entry/elibrary/checkin/`,
  ELIBRARY_CHECKOUT: `${API_BASE_URL}/api/entry/elibrary/checkout/`,
};

export default API_BASE_URL;
