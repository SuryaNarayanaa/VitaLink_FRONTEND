import { useState } from 'react';
import apiClient from '../apiClient';
import * as SecureStore from 'expo-secure-store';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  role: 'admin' | 'doctor' | 'patient';
  access_token: string;
  refresh_token : string;
}

const useAuth = () => {
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
      
      const response = await apiClient.post<LoginResponse>('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await SecureStore.setItemAsync('access_token', response.data.access_token);
      await SecureStore.setItemAsync('refresh_token',response.data.refresh_token);
      await SecureStore.setItemAsync('userRole', response.data.role);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {

      await apiClient.get('/auth/logout');
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('userRole');
      return true;
    } catch (err: any) {
      console.log("Logout failed")
      setError(err.response?.data?.detail || 'Logout failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthStatus = async (): Promise<string | null> => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      await apiClient.get('/');
      return token ? await SecureStore.getItemAsync('userRole') : null;
    } catch (err) {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('userRole');
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
