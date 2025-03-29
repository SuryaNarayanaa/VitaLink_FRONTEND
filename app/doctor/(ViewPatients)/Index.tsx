import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CustomHeader from '../../../components/CustomHeader';
import { getPatients } from './services/patientService';
import { Patient } from './types';
import PatientCard from './comp/PatientCard'; // Fixed import path
import { COLORS } from './constants/Theme';
import { Feather } from '@expo/vector-icons';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        console.error('Error loading patients:', error);
      }
    };

    loadPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.caretakerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  const handleReassignDoctor = (patientId: string) => {
    console.log('Reassign doctor for patient', patientId);
  };

  const handleReassignCaretaker = (patientId: string) => {
    console.log('Reassign caretaker for patient', patientId);
  };

  return (
    <View style={styles.container}>
      {/* <CustomHeader
        title="Patient Management"
        leftButton={
          <TouchableOpacity onPress={() => router.push('/doctor')}>
            <Feather name="menu" size={24} color="#000" />
          </TouchableOpacity>
        }
      /> */}

      <View style={styles.searchContainer}>
        <Feather name="search" size={16} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Viewing {filteredPatients.length} Patients</Text>
      </View>

      <FlatList
        data={filteredPatients}
        renderItem={({ item }) => (
          <PatientCard
            patient={item}
            onReassignDoctor={handleReassignDoctor}
            onReassignCaretaker={handleReassignCaretaker}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No patients found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginVertical: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardsList: {
    padding: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});