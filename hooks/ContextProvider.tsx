import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';
import useAuth, { LoginCredentials, LoginResponse } from './api/auth/useAuth';

interface AuthContextType {
  login: (credentials: LoginCredentials) => Promise<LoginResponse | null>;
  logout: () => Promise<boolean>;
  checkAuthStatus: () => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
  userRole: 'doctor' | 'patient' | null;
  accessToken: string | null;
  setAuthData: (token: string | null, role: 'doctor' | 'patient' | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { login, logout, checkAuthStatus, isLoading, error } = useAuth();
  const [userRole, setUserRole] = useState<'doctor' | 'patient' | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const segments = useSegments();

  const setAuthData = (token: string | null, role: 'doctor' | 'patient' | null) => {
    setAccessToken(token);
    setUserRole(role);
  };

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('access_token');
      const role = token ? (await SecureStore.getItemAsync('userRole')) as 'doctor' | 'patient' : null;
      setAuthData(token, role);
    })();
  }, []);

  useEffect(() => {
    if (!accessToken) {
      if (segments[0] !== '(auth)') {
        router.push('/(auth)/signIn');
      }
      return;
    }

    if (userRole === 'doctor' && segments[0] !== 'doctor') {
      router.push('/doctor');
    } else if (userRole === 'patient' && segments[0] !== 'patient') {
      router.push('/patient');
    }
  }, [accessToken, userRole, segments, router]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        checkAuthStatus,
        isLoading,
        error,
        userRole,
        accessToken,
        setAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
