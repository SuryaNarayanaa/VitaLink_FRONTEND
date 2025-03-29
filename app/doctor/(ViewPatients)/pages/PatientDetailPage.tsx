import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native'; // Import DrawerActions
import CustomHeader from '../../../../components/CustomHeader';
import { getPatient } from '../services/patientService';
import { Patient } from '../types';

const PatientDetailPage: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [prescriptionEdit, setPrescriptionEdit] = useState<{ [key: string]: number }>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();
  const navigation = useNavigation(); // Access navigation object

  useEffect(() => {
    const loadPatient = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getPatient(id as string);

        if (data) {
          setPatient(data);
          if (data.prescription) {
            const initialValues: { [key: string]: number } = {};
            Object.entries(data.prescription).forEach(([day, dose]) => {
              initialValues[day] = parseFloat(dose.split(' ')[0]);
            });
            setPrescriptionEdit(initialValues);
          }
        } else {
          console.error('Patient not found');
          router.replace('/');
        }
      } catch (error) {
        console.error('Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [id, router]);

  const handleEditDosage = () => {
    setIsEditing(false);
    console.log('Dosage updated successfully');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomHeader
          title={patient ? `Patient: ${patient.name}` : 'Patient Details'}
          leftButton={
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
              {/* Use DrawerActions.toggleDrawer() */}
              <Feather name="menu" size={24} color="#000" />
            </TouchableOpacity>
          }
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading patient data...</Text>
        </View>
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.container}>
        <CustomHeader
          title="Patient Details"
          leftButton={
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
              {/* Use DrawerActions.toggleDrawer() */}
              <Feather name="menu" size={24} color="#000" />
            </TouchableOpacity>
          }
        />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Patient not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back to Patients</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        title={`Patient: ${patient.name}`}
        leftButton={
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            {/* Use DrawerActions.toggleDrawer() */}
            <Feather name="menu" size={24} color="#000" />
          </TouchableOpacity>
        }
      />

      <TouchableOpacity style={styles.backButtonContainer} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color="#1EAEDB" />
        <Text style={styles.backText}>Back to Patients</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.patientHeader}>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientAgeGender}>
              Age: {patient.age}, Gender: {patient.gender}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Provider Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Doctor:</Text>
              <Text style={styles.infoValue}>{patient.doctorName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Caretaker:</Text>
              <Text style={styles.infoValue}>{patient.caretakerName}</Text>
            </View>
          </View>

          {patient.medicalHistory && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Medical Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Medical History:</Text>
                <Text style={styles.infoValue}>{patient.medicalHistory}</Text>
              </View>
              {patient.yearsDiagnosed && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Years Diagnosed:</Text>
                  <Text style={styles.infoValue}>{patient.yearsDiagnosed}</Text>
                </View>
              )}
            </View>
          )}

          {patient.contactNumber && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contact:</Text>
                <Text style={styles.infoValue}>{patient.contactNumber}</Text>
              </View>
              {patient.kinName && (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Next of Kin:</Text>
                    <Text style={styles.infoValue}>{patient.kinName}</Text>
                  </View>
                  {patient.kinContact && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Kin Contact:</Text>
                      <Text style={styles.infoValue}>{patient.kinContact}</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 20,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1EAEDB',
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
    marginBottom: 15,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  patientAgeGender: {
    fontSize: 16,
    color: '#4b5563',
    marginTop: 5,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  infoLabel: {
    width: 120,
    fontWeight: '500',
    color: '#4b5563',
  },
  infoValue: {
    flex: 1,
    color: '#1f2937',
  },
  backButton: {
    backgroundColor: '#1EAEDB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PatientDetailPage;