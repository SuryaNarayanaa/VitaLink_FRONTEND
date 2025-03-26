import { useState } from 'react';
import apiClient from '../apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  role: 'admin' | 'doctor' | 'patient';
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Login with username and password
   */
  const login = async (credentials: LoginCredentials): Promise<LoginResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      
      const response = await apiClient.post<LoginResponse>('/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Store user role for future use
      await AsyncStorage.setItem('userRole', response.data.role);
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.get('/logout');
      await AsyncStorage.removeItem('userRole');
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Logout failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check if user is authenticated
   */
  const checkAuthStatus = async (): Promise<string | null> => {
    try {
      // Try to get the stored role
      const role = await AsyncStorage.getItem('userRole');
      // Make a test request to verify session is still valid
      await apiClient.get('/');
      return role;
    } catch (err) {
      // If request fails, session is likely invalid
      await AsyncStorage.removeItem('userRole');
      return null;
    }
  };

  return { 
    login, 
    logout, 
    checkAuthStatus,
    isLoading,
    error
  };
};

export default useAuth;
