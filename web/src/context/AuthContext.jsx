import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/initialData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('nexus_cloud_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Error parsing auth user from storage', e);
      }
    }
    // Default logged in as Customer for realistic demo experience
    return INITIAL_USERS[0];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('nexus_cloud_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexus_cloud_user');
    }
  }, [user]);

  const login = (emailOrUsername, password) => {
    // Check demo accounts
    const found = INITIAL_USERS.find(
      u => u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
           u.username.toLowerCase() === emailOrUsername.toLowerCase()
    );

    if (found) {
      setUser(found);
      return { success: true, user: found };
    }

    // Generic login for demo
    const customUser = {
      id: 'usr-' + Date.now(),
      name: emailOrUsername.split('@')[0],
      username: emailOrUsername.split('@')[0],
      email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@example.com`,
      phone: '0988 888 999',
      balance: 1000000,
      role: 'customer',
      twoFactorEnabled: false,
      createdDate: new Date().toISOString(),
      status: 'active'
    };

    setUser(customUser);
    return { success: true, user: customUser };
  };

  const loginAs = (role) => {
    if (role === 'admin') {
      setUser(INITIAL_USERS[1]);
    } else {
      setUser(INITIAL_USERS[0]);
    }
  };

  const register = (data) => {
    const newUser = {
      id: 'usr-' + Date.now(),
      name: data.fullName || data.username,
      username: data.username,
      email: data.email,
      phone: data.phone || '0988 000 111',
      company: data.company || '',
      taxId: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      balance: 500000, // 500,000 VND welcome promo balance
      role: 'customer',
      twoFactorEnabled: false,
      createdDate: new Date().toISOString(),
      status: 'active'
    };

    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      return updated;
    });
  };

  const toggle2FA = () => {
    setUser(prev => {
      if (!prev) return prev;
      return { ...prev, twoFactorEnabled: !prev.twoFactorEnabled };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        loginAs,
        register,
        logout,
        updateProfile,
        toggle2FA
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
