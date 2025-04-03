
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { X } from 'lucide-react';
import { LinearGradient } from 'expo-linear-gradient';

interface ReassignDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  currentDoctor: string;
}

const doctors = [
  "Dr. K. Tamilarasu",
  "Dr. S. Venkatesh",
  "Dr. R. Priya",
  "Dr. M. Kumar"
];

const ReassignDoctorModal: React.FC<ReassignDoctorModalProps> = ({ 
  isOpen, 
  onClose, 
  patientId, 
  currentDoctor 
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<string>(doctors[0]);

  const handleConfirm = () => {
    if (selectedDoctor) {
      // In a real app, this would make an API call to update the doctor
      console.log(`Doctor reassigned to ${selectedDoctor}`);
      onClose();
    } else {
      console.error("Please select a doctor");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Reassign Doctor</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedDoctor}
              onValueChange={(itemValue) => setSelectedDoctor(itemValue)}
              style={styles.picker}
            >
              {doctors.map((doctor) => (
                <Picker.Item key={doctor} label={doctor} value={doctor} />
              ))}
            </Picker>
          </View>
          
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default ReassignDoctorModal;
