// API Configuration - Development
// Note: These are relative URLs since axios instance has baseURL configured
export const API_ENDPOINTS = {
  // Admin endpoints
  ADMIN_LOGIN: '/api/admin/login/',
  ADMIN_REPORTS_TIME: '/api/admin/reports/time-based/',
  ADMIN_REPORTS_STUDENT: '/api/admin/reports/student-based/',
  ADMIN_REPORTS_DEPT_STATS: '/api/admin/reports/department-stats/',
  ADMIN_STATS_LIVE: '/api/admin/stats/live/',
  
  // Library endpoints
  LIBRARY_ENTRY: '/api/entry/library/',
  
  // E-Library endpoints
  ELIBRARY_PC_STATUS: '/api/elibrary/pc_status/',
  ELIBRARY_CHECKIN: '/api/entry/elibrary/checkin/',
  ELIBRARY_CHECKOUT: '/api/entry/elibrary/checkout/',
  CHECK_CURRENT_USER_PC: '/api/elibrary/check_current_pc/',
  
  // Student endpoints
  STUDENTS: '/api/students/',
};

// For backward compatibility
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
export default API_BASE_URL;
