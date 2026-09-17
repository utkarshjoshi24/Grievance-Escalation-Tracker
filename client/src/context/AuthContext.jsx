// Authentication Context with Seamless Mock Switching and Backend JWT support

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Default to student role for initial experience, or recover saved session
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('get_current_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return MOCK_USERS.student;
      }
    }
    return MOCK_USERS.student;
  });

  const [token, setToken] = useState(() => localStorage.getItem('get_auth_token') || 'mock_jwt_token_active');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('get_current_user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('get_current_user');
      setIsAuthenticated(false);
    }
  }, [user]);

  // Fast developer/tester role switcher
  const switchRole = (roleKey) => {
    if (MOCK_USERS[roleKey]) {
      setUser(MOCK_USERS[roleKey]);
      localStorage.setItem('get_current_role', roleKey);
    }
  };

  const login = async (email, password, roleHint = 'student') => {
    setLoading(true);
    try {
      // Simulate network latency for authentic feel
      await new Promise((resolve) => setTimeout(resolve, 600));

      let matchedUser = Object.values(MOCK_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!matchedUser) {
        // Fallback matched by role or create custom mock user
        matchedUser = {
          ...MOCK_USERS[roleHint] || MOCK_USERS.student,
          email,
          name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        };
      }

      setUser(matchedUser);
      setToken('mock_jwt_session_' + Date.now());
      localStorage.setItem('get_auth_token', 'mock_jwt_session_' + Date.now());
      return { success: true, user: matchedUser };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      const newUser = {
        id: 'usr_' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'student',
        rollNumber: userData.rollNumber || 'REG' + Math.floor(1000 + Math.random() * 9000),
        department: userData.department || 'General Studies',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        joinedAt: new Date().toISOString().split('T')[0],
      };

      setUser(newUser);
      setToken('mock_jwt_session_' + Date.now());
      localStorage.setItem('get_auth_token', 'mock_jwt_session_' + Date.now());
      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
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
        role: user?.role || 'student',
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        switchRole,
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
