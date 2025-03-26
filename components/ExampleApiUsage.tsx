import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useAuth, usePatient } from '@/hooks/api';

const ExampleApiUsage: React.FC = () => {
  const { login, isLoading: authLoading, error: authError } = useAuth();
  const { 
    getPatientDashboard, 
    isLoading: patientLoading, 
    error: patientError 
  } = usePatient();
  
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  // Example login
  const handleLogin = async () => {
    const response = await login({
      username: 'PAT00001',
      password: '1234567890'
    });
    
    if (response) {
      console.log('Logged in as:', response.role);
    }
  };
  
  // Example loading dashboard data
  const loadDashboard = async () => {
    const data = await getPatientDashboard();
    if (data) {
      setDashboardData(data);
    }
  };
  
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        API Usage Example
      </Text>
      
      {/* Auth section */}
      <View style={{ marginBottom: 20 }}>
        <Button title="Login" onPress={handleLogin} disabled={authLoading} />
        {authLoading && <ActivityIndicator />}
        {authError && <Text style={{ color: 'red' }}>{authError}</Text>}
      </View>
      
      {/* Patient dashboard section */}
      <View>
        <Button title="Load Dashboard" onPress={loadDashboard} disabled={patientLoading} />
        {patientLoading && <ActivityIndicator />}
        {patientError && <Text style={{ color: 'red' }}>{patientError}</Text>}
        
        {dashboardData && (
          <View style={{ marginTop: 10 }}>
            <Text>Patient Name: {dashboardData.patient.name}</Text>
            <Text>Missed Doses: {dashboardData.missed_doses.length}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ExampleApiUsage;
