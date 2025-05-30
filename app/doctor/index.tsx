import React, { useState } from 'react';
import { View,Text, TouchableOpacity, StyleSheet, FlatList,SafeAreaView,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import PatientCard from '../../components/doctor-viewpatients/PatientCard';
import PatientTable from '../../components/doctor-viewpatients/PatientTable';
import PatientDetail from '../../components/doctor-viewpatients/PatientDetail';
import { useDoctorContext } from '@/hooks/context/DoctorContext';
import { Doctor, Patient } from '@/types/doctor';
import NotFoundAnimation from '@/components/animations/NotFoundAnimation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/hooks/api';

type ViewMode = 'cards' | 'table';

const Patients = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const {doctorData} = useDoctorContext();
  
  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };
  
  const handleBackToList = () => {
    setSelectedPatient(null);
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'cards' ? 'table' : 'cards');
  };

  const {data:DoctorsData = null} = useQuery({
    queryKey:["doctors"],
    queryFn:async() => {
      const response = await apiClient.get<{doctors:Doctor[]}>("/doctor/doctors")
      return response.data.doctors
    }
  })
  
  if (selectedPatient) {
    return <PatientDetail patient={selectedPatient} onBack={handleBackToList} />;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#c8b6e2', '#f8c8d8']}
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Viewing {doctorData?.patients.length} Patients</Text>
          <TouchableOpacity 
            style={styles.viewModeButton}
            onPress={toggleViewMode}
          >
            <Text style={styles.viewModeButtonText}>
              {viewMode === 'cards' ? 'Table View' : 'Cards View'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {viewMode === 'cards' ? (
          <FlatList
            data={doctorData?.patients}
            renderItem={({ item }) => (
              <PatientCard 
                patient={item} 
                doctors={DoctorsData || []}
                onViewPatient={handleViewPatient} 
              />
            )}
            keyExtractor={(item) => item.ID}
            contentContainerStyle={styles.cardList}
            ListEmptyComponent={() => (
              <View className='flex-1 mt-5 w-full justify-center items-center'>
                <NotFoundAnimation/>
                <Text className='font-semibold text-center'>No patients available</Text>
              </View>
            )}
          />
        ) : (
          <PatientTable 
            patients={doctorData?.patients!} 
            onViewPatient={handleViewPatient} 
          />
        )}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {format(new Date(), 'dd MMMM yyyy')}
          </Text>
          <Text style={styles.footerText}>
            {format(new Date(), "HH:mm 'Local'")}
          </Text>
        </View>


      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  viewModeButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  viewModeButtonText: {
    color: 'black',
    fontWeight: '500',
  },
  cardList: {
    paddingBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});

export default Patients;
