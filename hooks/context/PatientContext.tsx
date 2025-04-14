import { View, Text, ActivityIndicator, Alert } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../api';
import { PatientDashboardResponse } from '@/types/patient';
import LoadingAnimation from '@/components/animations/LoadingAnimation';

interface PatientContextProps {
  patientData: PatientDashboardResponse | null
  isLoading: boolean;
  error: string | null;
}

const PatientContext = createContext<PatientContextProps | null>(null);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    // Add error handling for SecureStore
const fetchUserRole = async () => {
  try {
    const role = await SecureStore.getItemAsync('userRole');
    if (!role) {
      router.replace('/signIn');
      return;
    }
    setUserRole(role);
    setIsCheckingRole(false);
  } catch (error) {
    console.error('SecureStore Error:', error);
    router.replace('/signIn');
  }
};

    fetchUserRole();
  }, [router]);

  const { data: patientData = null, isLoading, error } = useQuery<PatientDashboardResponse | null>({
    queryKey: ['profile'],
    queryFn: async() => {
      const response = await apiClient.get<PatientDashboardResponse>('/patient');
      return response.data;
    },
    enabled: userRole === 'patient', // Only fetch data if userRole is 'patient'
  });

  const errorMessage = error instanceof Error ? error.message : null;
  

  if (isCheckingRole || isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50">
        <LoadingAnimation/>
        <Text className='mt-4 text-xl font-semibold'>Loading Patient Data</Text>
      </View>
    );
  }

  

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-red-50 p-4">
        <Text className="text-lg font-semibold text-red-800">Oops! Something went wrong.</Text>
        <Text className="mt-2 text-base text-red-600">
          {errorMessage || 'An error occurred. Please go back to Log In.'}{' '}
          <Link href="/signIn">
            <Text className="text-blue-500">Log In</Text>
          </Link>
        </Text>
      </View>
    );
  }
  return (
    <PatientContext.Provider value={{ patientData, isLoading, error: errorMessage }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatientContext = (): PatientContextProps => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatientContext must be used within a PatientProvider');
  }
  return context;
};

export default PatientProvider;