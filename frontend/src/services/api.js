import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export const endpoints = {
  LIBRARY_ENTRY: '/api/entry/library/',
  ELIBRARY_PC_STATUS: '/api/elibrary/pc_status/',
  ELIBRARY_CHECKIN: '/api/entry/elibrary/checkin/',
  ELIBRARY_CHECKOUT: '/api/entry/elibrary/checkout/',
  ADMIN_LOGIN: '/api/admin/login/',
};
