import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/authApi';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const userData = await authApi.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user profile', error);
      clearAuthData();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        await fetchUserProfile();
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authApi.login(credentials);
      const { access, refresh, user: userInfo } = data;

      localStorage.setItem(TOKEN_KEY, access);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);

      setToken(access);
      setUser(userInfo);
      return userInfo;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authApi.register(userData);
      const { tokens, user: userInfo } = data;

      if (tokens) {
        localStorage.setItem(TOKEN_KEY, tokens.access);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
        setToken(tokens.access);
      }
      setUser(userInfo);
      return userInfo;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuthData();
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const updatedUser = await authApi.updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role,
        seekerProfile: user?.seeker_profile,
        recruiterProfile: user?.recruiter_profile,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile: fetchUserProfile,
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
