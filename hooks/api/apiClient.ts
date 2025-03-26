import axios from 'axios';
import { BASE_URL, API_TIMEOUT } from '@/app/config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          AsyncStorage.removeItem('userRole');
          // You might want to implement a navigation solution here or use a context
          // navigation.navigate('Login');
          break;
        case 403:
          Alert.alert('Access Denied', 'You do not have permission to perform this action.');
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
