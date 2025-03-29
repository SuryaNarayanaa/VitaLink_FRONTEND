import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Patient } from '../types';
import { COLORS } from '../constants/Theme';

interface PatientCardProps {
  patient: Patient;
  onReassignDoctor: (patientId: string) => void;
  onReassignCaretaker: (patientId: string) => void;
}

const PatientCard = ({ patient, onReassignDoctor, onReassignCaretaker }: PatientCardProps) => {
  const router = useRouter();

  return (
    <View style={styles.card}>
      {/* Patient Name and Info */}
      <Text style={styles.name}>{patient.name}</Text>
      <Text style={styles.info}>Age: {patient.age}, Gender: {patient.gender}</Text>

      {/* Actions */}
      <View style={styles.actions}>
        {/* Reassign Doctor Button */}
        <TouchableOpacity
          style={styles.amberButton}
          onPress={() => {
            try {
              onReassignDoctor(patient.id);
            } catch (error) {
              console.error('Failed to reassign doctor:', error);
            }
          }}
        >
          <Text style={styles.buttonText}>Reassign Doctor</Text>
        </TouchableOpacity>

        {/* Reassign Caretaker Button */}
        <TouchableOpacity
          style={styles.amberButton}
          onPress={() => {
            try {
              onReassignCaretaker(patient.id);
            } catch (error) {
              console.error('Failed to reassign caretaker:', error);
            }
          }}
        >
          <Text style={styles.buttonText}>Reassign Caretaker</Text>
        </TouchableOpacity>

        {/* View Patient Button */}
        <TouchableOpacity
          style={styles.blueButton}
          onPress={() => {
            try {
                console.log(`Navigating to /doctor/ViewPatients/patients/${patient.id}`);
                router.push(`/doctor/ViewPatients/patients/${patient.id}`);
            } catch (error) {
              console.error('Failed to navigate to patient details:', error);
            }
          }}
        >
          <Text style={styles.buttonText}>View Patient</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 10,
  },
  actions: {
    marginTop: 10,
  },
  amberButton: {
    backgroundColor: COLORS.amber,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  blueButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '500',
  },
});

export default PatientCard;