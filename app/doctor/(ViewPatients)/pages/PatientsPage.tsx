import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import PatientsTable from '../comp/PatientsTable'; // Import the table view component
import PatientCard from '../comp/PatientCard'; // Import the card view component
import { getPatients, getPeople, updatePatientCaretaker, updatePatientDoctor } from '../services/patientService';
import { Patient, Person } from '../types';
import { COLORS } from '../constants/Theme';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card'); // Toggle between 'table' and 'card'
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [caretakerModalOpen, setCaretakerModalOpen] = useState(false);
  const [doctors, setDoctors] = useState<Person[]>([]);
  const [caretakers, setCaretakers] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  const navigation = useNavigation();

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

    const loadPeople = async () => {
      try {
        const doctors = await getPeople('Doctor');
        const caretakers = await getPeople('Caretaker');
        setDoctors(doctors);
        setCaretakers(caretakers);
      } catch (error) {
        console.error('Failed to load people:', error);
      }
    };

    loadPatients();
    loadPeople();
  }, []);

  useEffect(() => {
    const filtered = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.caretakerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  // Handle reassigning a doctor
  const handleReassignDoctor = (patientId: string) => {
    setSelectedPatientId(patientId);
    setSelectedPerson('');
    setDoctorModalOpen(true);
  };

  // Handle reassigning a caretaker
  const handleReassignCaretaker = (patientId: string) => {
    setSelectedPatientId(patientId);
    setSelectedPerson('');
    setCaretakerModalOpen(true);
  };

  // Assign a new doctor to a patient
  const handleDoctorAssignment = async () => {
    if (!selectedPatientId || !selectedPerson) {
      console.error('Please select a doctor');
      return;
    }

    const doctor = doctors.find((d) => d.id === selectedPerson);
    if (!doctor) return;

    try {
      await updatePatientDoctor(selectedPatientId, doctor.name);
      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.id === selectedPatientId ? { ...p, doctorName: doctor.name } : p
        )
      );
      console.log('Doctor reassigned successfully');
      setDoctorModalOpen(false);
    } catch (error) {
      console.error('Failed to reassign doctor:', error);
    }
  };

  // Assign a new caretaker to a patient
  const handleCaretakerAssignment = async () => {
    if (!selectedPatientId || !selectedPerson) {
      console.error('Please select a caretaker');
      return;
    }

    const caretaker = caretakers.find((c) => c.id === selectedPerson);
    if (!caretaker) return;

    try {
      await updatePatientCaretaker(selectedPatientId, caretaker.name);
      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.id === selectedPatientId ? { ...p, caretakerName: caretaker.name } : p
        )
      );
      console.log('Caretaker reassigned successfully');
      setCaretakerModalOpen(false);
    } catch (error) {
      console.error('Failed to reassign caretaker:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={16} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Toggle Button */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'card' && styles.activeButton]}
          onPress={() => setViewMode('card')}
        >
          <Text style={[styles.toggleButtonText, viewMode === 'card' && styles.activeButtonText]}>
            Card View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'table' && styles.activeButton]}
          onPress={() => setViewMode('table')}
        >
          <Text style={[styles.toggleButtonText, viewMode === 'table' && styles.activeButtonText]}>
            Table View
          </Text>
        </TouchableOpacity>
      </View>

      {/* Render View Based on Toggle */}
      {viewMode === 'card' ? (
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
      ) : (
        <PatientsTable patients={filteredPatients} />
      )}
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  toggleButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#e5e7eb',
  },
  activeButton: {
    backgroundColor: COLORS.primary,
  },
  toggleButtonText: {
    color: '#6b7280',
  },
  activeButtonText: {
    color: 'white',
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