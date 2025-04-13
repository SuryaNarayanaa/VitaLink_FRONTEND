import { View, Text, ActivityIndicator, Alert } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useDoctor } from '../api';

interface DoctorContextProps {
  doctorData: DoctorDashboardResponse | null;
  isLoading: boolean;
  error: string | null;
}

const DoctorContext = createContext<DoctorContextProps | null>(null);

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const { getDoctorDashboard } = useDoctor();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await SecureStore.getItemAsync('userRole');
        setUserRole(role);
        if (role !== 'doctor') {
          Alert.alert('Unauthorized', 'You are not authorized to access this route.');
          router.replace('/signIn');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        router.replace('/signIn');
      } finally {
        setIsCheckingRole(false);
      }
    };

    fetchUserRole();
  }, [router]);

  const { data: doctorData = null, isLoading, error } = useQuery<DoctorDashboardResponse | null>({
    queryKey: ['doctorProfile'],
    queryFn: async () => {
      const response = await getDoctorDashboard();
      return response
    },
    enabled: userRole === 'doctor',
  });

  console.log('Doctor Data:', doctorData);

  const errorMessage = error instanceof Error ? error.message : null;

  if (isCheckingRole || isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50">
        <ActivityIndicator size="large" color="#1D4ED8" />
        <Text className="mt-4 text-xl font-bold text-blue-800">
          {isCheckingRole ? 'Checking user role...' : 'Loading doctor data...'}
        </Text>
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
    <DoctorContext.Provider value={{ doctorData, isLoading, error: errorMessage }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctorContext = (): DoctorContextProps => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctorContext must be used within a DoctorProvider');
  }
  return context;
};

export default DoctorProvider;