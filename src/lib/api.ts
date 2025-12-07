import axios from 'axios';

// Use a safe cast so TypeScript doesn't complain about import.meta.env
const API_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { email: string; password: string; full_name?: string; role?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const transactionAPI = {
  getAll: (filters?: Record<string, string>) =>
    api.get('/transactions', { params: filters }),
  getStats: () => api.get('/transactions/stats'),
  getById: (id: string) => api.get(`/transactions/${id}`),
  update: (id: string, data: { status: string }) =>
    api.patch(`/transactions/${id}`, data),
  create: (data: any) => api.post('/transactions', data),
};

export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data: { fullName: string }) => api.patch('/profile', data),
};

export default api;
