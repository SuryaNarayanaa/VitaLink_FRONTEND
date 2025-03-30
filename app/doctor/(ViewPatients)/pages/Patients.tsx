
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { patients } from '../data/mockPatients';
import PatientCard from '../comp/PatientCard';
import PatientTable from '../comp/PatientTable';
import PatientDetail from '../comp/PatientDetail';
import {Patient} from '../data/mockPatients';

type ViewMode = 'cards' | 'table';

const Patients = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  
  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };
  
  const handleBackToList = () => {
    setSelectedPatient(null);
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'cards' ? 'table' : 'cards');
  };
  
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
          <Text style={styles.headerTitle}>Viewing {patients.length} Patients</Text>
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
            data={patients}
            renderItem={({ item }) => (
              <PatientCard 
                patient={item} 
                onViewPatient={handleViewPatient} 
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cardList}
          />
        ) : (
          <PatientTable 
            patients={patients} 
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
    marginTop: StatusBar.currentHeight || 0,
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
