import axios from 'axios';
import { BASE_URL, API_TIMEOUT } from '@/app/config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // Important for sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - handle authentication
apiClient.interceptors.request.use(
  async (config) => {
    // If needed, you could add token to headers for non-cookie based auth
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle specific error codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear saved data and redirect to login
          AsyncStorage.removeItem('userRole');
          // You might want to implement a navigation solution here or use a context
          // navigation.navigate('Login');
          break;
        case 403:
          // Forbidden - access denied
          Alert.alert('Access Denied', 'You do not have permission to perform this action.');
          break;
        case 500:
          Alert.alert('Server Error', 'Something went wrong. Please try again later.');
          break;
      }
    } else if (error.request) {
      // Network error
      Alert.alert('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
