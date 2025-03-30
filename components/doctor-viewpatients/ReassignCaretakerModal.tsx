

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
import { LinearGradient } from 'expo-linear-gradient';

interface ReassignCaretakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  currentCaretaker: string;
}

const caretakers = [
  "Dr. P. Ramasamy",
  "Dr. S. Venkatesh", 
  "Dr. L. Devi",
  "Dr. T. Suresh"
];

const ReassignCaretakerModal: React.FC<ReassignCaretakerModalProps> = ({ 
  isOpen, 
  onClose, 
  patientId, 
  currentCaretaker 
}) => {
  const [selectedCaretaker, setSelectedCaretaker] = useState<string>(caretakers[0]);

  const handleConfirm = () => {
    if (selectedCaretaker) {
      // In a real app, this would make an API call to update the caretaker
      console.log(`Caretaker reassigned to ${selectedCaretaker}`);
      onClose();
    } else {
      console.error("Please select a caretaker");
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
            <Text style={styles.modalTitle}>Reassign Caretaker</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCaretaker}
              onValueChange={(itemValue) => setSelectedCaretaker(itemValue)}
              style={styles.picker}
            >
              {caretakers.map((caretaker) => (
                <Picker.Item key={caretaker} label={caretaker} value={caretaker} />
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

export default ReassignCaretakerModal;
