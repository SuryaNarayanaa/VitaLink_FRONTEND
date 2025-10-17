import axios from 'axios';
import { BASE_URL, API_TIMEOUT } from '@/app/config/env';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  }
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

const refreshToken = async (): Promise<string | null> => {
  try {
    const refresh_token = await SecureStore.getItemAsync('refresh_token');
    
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${BASE_URL}/auth/refresh_token`, {
      refresh_token: refresh_token
    });

    const { access_token, refresh_token: newRefreshToken } = response.data;

    // Store the new tokens
    await SecureStore.setItemAsync('access_token', access_token);
    await SecureStore.setItemAsync('refresh_token', newRefreshToken);

    return access_token;
  } catch (error) {
    // Clear tokens if refresh fails
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    await SecureStore.deleteItemAsync('userRole');
    
    throw error;
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('access_token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      switch (error.response.status) {
        case 401:
          await SecureStore.deleteItemAsync('access_token');
          await SecureStore.deleteItemAsync('userRole');
          break;
        case 403:
          // Handle refresh token logic for 403 errors
          if (!originalRequest._retry) {
            if (isRefreshing) {
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              }).then(token => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return apiClient(originalRequest);
              }).catch(err => {
                return Promise.reject(err);
              });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
              const newToken = await refreshToken();
              processQueue(null, newToken);
              
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return apiClient(originalRequest);
            } catch (refreshError) {
              processQueue(refreshError, null);
              Alert.alert('Session Expired', 'Please log in again.');
              
              // Clear tokens if refresh fails
              await SecureStore.deleteItemAsync('access_token');
              await SecureStore.deleteItemAsync('refresh_token');
              await SecureStore.deleteItemAsync('userRole');
              
              return Promise.reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          } else {
            // If retry already attempted, show access denied and clear tokens
            Alert.alert('Access Denied', 'You do not have permission to perform this action.');
            await SecureStore.deleteItemAsync('access_token');
            await SecureStore.deleteItemAsync('refresh_token');
            await SecureStore.deleteItemAsync('userRole');
          }
          break;
        case 500:
          Alert.alert('Server Error', 'Something went wrong. Please try again later.');
          break;
      }
    } else if (error.request) {
      Alert.alert('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
