import api from './axios';

export const authApi = {
  login:      (email: string, password: string) => api.post('/auth/login', { email, password }),
  getProfile: ()                                 => api.get('/auth/profile'),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

export const serversApi = {
  getAll:    ()                      => api.get('/servers'),
  getSummary:()                      => api.get('/servers/summary'),
  getOne:    (id: string)            => api.get(`/servers/${id}`),
  create:    (data: any)             => api.post('/servers', data),
  update:    (id: string, data: any) => api.patch(`/servers/${id}`, data),
  remove:    (id: string)            => api.delete(`/servers/${id}`),
};

export const projectsApi = {
  getAll:    ()                      => api.get('/projects'),
  getSummary:()                      => api.get('/projects/summary'),
  getOne:    (id: string)            => api.get(`/projects/${id}`),
  create:    (data: any)             => api.post('/projects', data),
  update:    (id: string, data: any) => api.patch(`/projects/${id}`, data),
  remove:    (id: string)            => api.delete(`/projects/${id}`),
};

export const databasesApi = {
  getAll:  ()                      => api.get('/databases'),
  getOne:  (id: string)            => api.get(`/databases/${id}`),
  create:  (data: any)             => api.post('/databases', data),
  update:  (id: string, data: any) => api.patch(`/databases/${id}`, data),
  remove:  (id: string)            => api.delete(`/databases/${id}`),
};

export const usersApi = {
  getAll:  ()                      => api.get('/users'),
  getOne:  (id: string)            => api.get(`/users/${id}`),
  create:  (data: any)             => api.post('/users', data),
  update:  (id: string, data: any) => api.patch(`/users/${id}`, data),
  remove:  (id: string)            => api.delete(`/users/${id}`),
};

export const logsApi = {
  getAll: (limit?: number) => api.get(`/logs${limit ? `?limit=${limit}` : ''}`),
  clear:  ()               => api.delete('/logs'),
};

export const securityApi = {
  getFirewallRules: () => api.get('/security/firewall'),
  addFirewallRule:  (data: any) => api.post('/security/firewall', data),
  deleteFirewallRule: (id: string) => api.delete(`/security/firewall/${id}`),
  getSslCerts:      () => api.get('/security/ssl'),
  addSslCert:       (data: any) => api.post('/security/ssl', data),
};

export const backupApi = {
  create: (type: string, id: string) => api.post(`/backup/${type}/${id}`),
  list:   () => api.get('/backup'),
};

export const aiApi = {
  getConversations: () => api.get('/ai/conversations'),
  createConversation: (title?: string) => api.post('/ai/conversations', { title }),
  deleteConversation: (id: string) => api.delete(`/ai/conversations/${id}`),
  getMessages: (conversationId: string) => api.get(`/ai/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, content: string, thinking?: boolean) => api.post(`/ai/conversations/${conversationId}/messages`, { content, thinking }),
  approveAction: (messageId: string, approvalId: string, status: 'approved' | 'rejected') => api.post(`/ai/messages/${messageId}/approve`, { approvalId, status }),
  getMemories: () => api.get('/ai/memories'),
  createMemory: (data: { category: string; title: string; details: string }) => api.post('/ai/memories', data),
  deleteMemory: (id: string) => api.delete(`/ai/memories/${id}`),
  getTasks: () => api.get('/ai/tasks'),
  getLogs: () => api.get('/ai/logs'),
};

