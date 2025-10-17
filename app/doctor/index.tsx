import React, { useState } from 'react';
import { View,Text, TouchableOpacity, StyleSheet, FlatList,SafeAreaView, TextInput} from 'react-native';
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
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter patients by name or OP number
  const filteredPatients = (doctorData?.patients || []).filter((patient) => {
    const name = patient.name?.toLowerCase() || '';
    const opnum = patient.opnum?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return name.includes(term) || opnum.includes(term);
  });
  
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
          <Text style={styles.headerTitle}>Viewing {filteredPatients.length} Patients</Text>
          <TouchableOpacity 
            style={styles.viewModeButton}
            onPress={toggleViewMode}
          >
            <Text style={styles.viewModeButtonText}>
              {viewMode === 'cards' ? 'Table View' : 'Cards View'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search by name or OP#..."
            placeholderTextColor="#999"
          />
        </View>
        
        {viewMode === 'cards' ? (
          <FlatList
            data={filteredPatients}
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
                <Text className='font-semibold text-center'>No patients found</Text>
              </View>
            )}
          />
        ) : (
          <PatientTable 
            patients={filteredPatients} 
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
    marginBottom: 16,
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
  searchContainer: {
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  searchInput: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: 'black',
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
