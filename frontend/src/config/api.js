export const API_ENDPOINTS = {
  ADMIN_LOGIN: '/api/admin/login/',
  ADMIN_REPORTS_TIME: '/api/admin/reports/time-based/',
  ADMIN_REPORTS_STUDENT: '/api/admin/reports/student-based/',
  ADMIN_REPORTS_DAILY: '/api/admin/reports/daily/',
  ADMIN_REPORTS_MONTHLY: '/api/admin/reports/monthly/',
  ADMIN_REPORTS_YEARLY: '/api/admin/reports/yearly/',
  ADMIN_REPORTS_DEPT_STATS: '/api/admin/reports/department-stats/',
  ADMIN_STATS_LIVE: '/api/admin/stats/live/',
  PC_ANALYTICS: '/api/admin/analytics/pc/',
  ADMIN_TOGGLE_PC: '/api/admin/pc/toggle/',
  LIBRARY_ENTRY: '/api/entry/library/',
  ELIBRARY_PC_STATUS: '/api/elibrary/pc_status/',
  ELIBRARY_CHECKIN: '/api/entry/elibrary/checkin/',
  ELIBRARY_CHECKOUT: '/api/entry/elibrary/checkout/',
  CHECK_CURRENT_USER_PC: '/api/elibrary/check_current_pc/',
  STUDENTS: '/api/students/',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
export default API_BASE_URL;
