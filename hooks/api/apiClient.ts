import axios from 'axios';
import { BASE_URL, API_TIMEOUT } from '@/app/config/env';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

console.log(BASE_URL)

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
    if (error.response) {
      switch (error.response.status) {
        case 401:
          await SecureStore.deleteItemAsync('access_token');
          await SecureStore.deleteItemAsync('userRole');
          break;
        case 403:
          Alert.alert('Access Denied', 'You do not have permission to perform this action.');
          //handle request Token call to /refresh-token
          await SecureStore.deleteItemAsync('access_token');
          await SecureStore.deleteItemAsync('userRole');
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
