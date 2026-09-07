import axios from 'axios';

// ===== Axios instance =====
const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL ?? '/api/v1',
  timeout: 10000,
});

// ===== Request interceptor – tự gắn JWT =====
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kpanel_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ===== Response interceptor – handle 401 =====
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('kpanel_token');
      localStorage.removeItem('kpanel_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;
