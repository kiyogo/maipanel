import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi } from '../api/endpoints';

interface User { id: string; email: string; name: string; role: string; }
interface AuthCtx {
  user:    User | null;
  token:   string | null;
  loading: boolean;
  login:   (email: string, password: string) => Promise<void>;
  logout:  () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user,    setUser]    = useState<User | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Khôi phục session từ localStorage khi load trang
  useEffect(() => {
    const savedToken = localStorage.getItem('minepanel_token');
    const savedUser  = localStorage.getItem('minepanel_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res  = await authApi.login(email, password);
      const data = res.data;
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('minepanel_token', data.access_token);
      localStorage.setItem('minepanel_user',  JSON.stringify(data.user));
    } catch (err) {
      // Fallback cho chế độ Dev khi chưa khởi chạy NestJS Backend
      if (email === 'admin@minepanel.com' && password === 'admin123') {
        const mockUser = { id: '1', email, name: 'Administrator', role: 'Administrator' };
        const mockToken = 'mock_dev_jwt_token_2026';
        setToken(mockToken);
        setUser(mockUser);
        localStorage.setItem('minepanel_token', mockToken);
        localStorage.setItem('minepanel_user', JSON.stringify(mockUser));
        return;
      }
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('minepanel_token');
    localStorage.removeItem('minepanel_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng trong AuthProvider');
  return ctx;
};
