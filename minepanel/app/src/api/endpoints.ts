import api from './axios';

export const authApi = {
  login:      (email: string, password: string) => api.post('/auth/login', { email, password }),
  getProfile: ()                                 => api.get('/auth/profile'),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

export const usersApi = {
  getAll:  ()                      => api.get('/users'),
  getOne:  (id: string)            => api.get(`/users/${id}`),
  create:  (data: any)             => api.post('/users', data),
  update:  (id: string, data: any) => api.patch(`/users/${id}`, data),
  remove:  (id: string)            => api.delete(`/users/${id}`),
};


