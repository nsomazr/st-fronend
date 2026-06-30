import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://api.smarttravel.co.tz/api');

export { API_URL };

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes('/admin/login/') &&
      window.location.pathname.startsWith('/admin')
    ) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const servicesApi = {
  list: (config) => api.get('/services/', config),
};

export const bookingsApi = {
  create: (data) => api.post('/bookings/create/', data),
  list: (params) => api.get('/bookings/', { params }),
  get: (ref) => api.get(`/bookings/${ref}/`),
  updateStatus: (ref, status) => api.patch(`/bookings/${ref}/status/`, { status }),
};

export const contactApi = {
  send: (data) => api.post('/contact/', data),
};

export const adminApi = {
  login: (username, password) => api.post('/admin/login/', { username, password }),
  dashboardStats: () => api.get('/admin/dashboard/stats/'),
  customers: (params) => api.get('/admin/customers/', { params }),
  emails: (params) => api.get('/admin/emails/', { params }),
};

export default api;
