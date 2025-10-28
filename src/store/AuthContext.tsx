// src/store/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '@/types/auth.types';
import { authApi } from '@/api/auth.api';
import { getItem, setItem, removeItem, getObject, setObject } from '@/utils/storage';
import { STORAGE_KEYS } from '@/constants/config';
import Toast from 'react-native-toast-message';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  loadAuthData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const [storedAccessToken, storedRefreshToken, storedUser] = await Promise.all([
        getItem(STORAGE_KEYS.ACCESS_TOKEN),
        getItem(STORAGE_KEYS.REFRESH_TOKEN),
        getObject<User>(STORAGE_KEYS.USER_DATA),
      ]);

      if (storedAccessToken && storedRefreshToken && storedUser) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(storedUser);

        // Optionally verify token validity by fetching profile
        try {
          const response = await authApi.getProfile();
          if (response.success && response.data.user) {
            setUser(response.data.user);
            await setObject(STORAGE_KEYS.USER_DATA, response.data.user);
          }
        } catch (error) {
          // If profile fetch fails, clear auth data
          await clearAuthData();
        }
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newAccessToken: string, newRefreshToken: string, newUser: User) => {
    try {
      await Promise.all([
        setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken),
        setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken),
        setObject(STORAGE_KEYS.USER_DATA, newUser),
      ]);

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser(newUser);
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      const fcmToken = await getItem(STORAGE_KEYS.FCM_TOKEN);
      await authApi.logout(fcmToken || undefined);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      await clearAuthData();
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been successfully logged out',
      });
    }
  };

  const clearAuthData = async () => {
    await Promise.all([
      removeItem(STORAGE_KEYS.ACCESS_TOKEN),
      removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      removeItem(STORAGE_KEYS.USER_DATA),
    ]);

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    setObject(STORAGE_KEYS.USER_DATA, updatedUser);
  };

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    isLoading,
    isAuthenticated: !!user && !!accessToken,
    login,
    logout,
    updateUser,
    loadAuthData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};