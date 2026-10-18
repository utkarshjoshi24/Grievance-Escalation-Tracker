// Authentication Context with Backend API integration and Mock Fallback support

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('get_current_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('get_auth_token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('get_current_user');
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('get_current_user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('get_current_user');
      localStorage.removeItem('get_auth_token');
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = async (email, password, roleHint = 'student') => {
    setLoading(true);
    try {
      // 1. Try real backend API first
      try {
        const res = await api.auth.login({ email, password });
        if (res.data?.success && res.data?.data) {
          const authUser = res.data.data.user;
          const authToken = res.data.data.token;
          setUser(authUser);
          setToken(authToken);
          localStorage.setItem('get_auth_token', authToken);
          return { success: true, user: authUser };
        }
      } catch (apiErr) {
        console.warn('[AuthContext] Backend login API returned error, falling back to persona credentials:', apiErr?.message);
      }

      // 2. Fallback to mock persona / local credential match
      await new Promise((resolve) => setTimeout(resolve, 400));

      let matchedUser = Object.values(MOCK_USERS).find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!matchedUser) {
        const formattedName = email.split('@')[0].replace(/[\._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        matchedUser = {
          id: 'usr_' + Date.now(),
          name: formattedName || 'User',
          email,
          role: roleHint || 'student',
          department: 'General Administration',
          avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        };
      }

      // Ensure correct role is applied if roleHint was specified
      if (roleHint && matchedUser.role !== roleHint) {
        matchedUser = { ...matchedUser, role: roleHint };
      }

      const generatedToken = 'get_session_token_' + Date.now();
      setUser(matchedUser);
      setToken(generatedToken);
      localStorage.setItem('get_auth_token', generatedToken);
      return { success: true, user: matchedUser };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed. Please check your credentials.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // 1. Try real backend API first
      try {
        const res = await api.auth.register(userData);
        if (res.data?.success && res.data?.data) {
          const authUser = res.data.data.user;
          const authToken = res.data.data.token;
          setUser(authUser);
          setToken(authToken);
          localStorage.setItem('get_auth_token', authToken);
          return { success: true, user: authUser };
        }
      } catch (apiErr) {
        console.warn('[AuthContext] Backend register API returned error, falling back to client creation:', apiErr?.message);
      }

      // 2. Fallback to client mock session
      await new Promise((resolve) => setTimeout(resolve, 500));

      const assignedRole = userData.role || 'student';
      const newUser = {
        id: 'usr_' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: assignedRole,
        rollNumber: userData.rollNumber || (assignedRole === 'student' ? 'REG' + Math.floor(1000 + Math.random() * 9000) : null),
        department: userData.department || 'General Academic Studies',
        hierarchyLevel: assignedRole === 'authority' ? Number(userData.hierarchyLevel || 1) : null,
        tierLevel: assignedRole === 'authority' ? Number(userData.hierarchyLevel || 1) : null,
        title: userData.title || (assignedRole === 'admin' ? 'Ombudsman Officer' : assignedRole === 'authority' ? 'Department Coordinator' : null),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        joinedAt: new Date().toISOString().split('T')[0],
      };

      const generatedToken = 'get_session_token_' + Date.now();
      setUser(newUser);
      setToken(generatedToken);
      localStorage.setItem('get_auth_token', generatedToken);
      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('get_auth_token');
    localStorage.removeItem('get_current_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
