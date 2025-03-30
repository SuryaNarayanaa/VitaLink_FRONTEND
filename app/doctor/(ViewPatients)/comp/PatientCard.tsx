
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal 
} from 'react-native';
import { Patient } from '../data/mockPatients';

interface PatientCardProps {
  patient: Patient;
  onViewPatient: (patient: Patient) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onViewPatient }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showCaretakerModal, setShowCaretakerModal] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{patient.name}</Text>
      <Text style={styles.info}>Age: {patient.age}, Gender: {patient.gender}</Text>
      
      {isExpanded && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.amberButton]}
            onPress={() => setShowDoctorModal(true)}
          >
            <Text style={styles.buttonText}>Reassign Doctor</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.amberButton]}
            onPress={() => setShowCaretakerModal(true)}
          >
            <Text style={styles.buttonText}>Reassign Caretaker</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.blueButton]}
            onPress={() => onViewPatient(patient)}
          >
            <Text style={styles.buttonText}>View Patient</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <TouchableOpacity 
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.toggleButton}
      >
        <Text style={styles.toggleButtonText}>
          {isExpanded ? 'Hide Options' : 'Show Options'}
        </Text>
      </TouchableOpacity>

      {/* Modals would go here - simplified for this example */}
      <Modal
        visible={showDoctorModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reassign Doctor</Text>
            <Text>Current Doctor: {patient.doctorName}</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowDoctorModal(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCaretakerModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reassign Caretaker</Text>
            <Text>Current Caretaker: {patient.caretakerName}</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowCaretakerModal(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 12,
  },
  optionsContainer: {
    marginTop: 12,
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  amberButton: {
    backgroundColor: '#FFC107',
  },
  blueButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  toggleButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#2196F3',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 16,
  },
});

export default PatientCard;
