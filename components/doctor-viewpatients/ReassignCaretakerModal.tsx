

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Doctor, Patient } from '@/types/doctor';
import { useQueryClient,useMutation } from '@tanstack/react-query';
import { apiClient } from '@/hooks/api';
import { showToast } from '../ui/CustomToast';
import Toast from 'react-native-toast-message';

interface ReassignCaretakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  doctors:Doctor[];
}

const ReassignCaretakerModal: React.FC<ReassignCaretakerModalProps> = ({ 
  isOpen, 
  onClose, 
  patient,
  doctors  
}) => { 
  const [selectedCaretaker, setSelectedCaretaker] = useState<string>(doctors[0]?.fullname || '');
  const [selectedCaretakerID,setSelectedCaretakerID] = useState<string>(doctors[0]?.ID || ''); 
  const queryclient = useQueryClient()

  const {mutate:reassignDoctor} = useMutation({
    mutationFn: async(doctorId:string) => {
      const response = await apiClient.put(`/doctor/reassign/${patient.ID}?doc=${doctorId}&typ=caretaker`)
      return response.data
    },
    onSuccess:() => {
      queryclient.invalidateQueries({queryKey:["doctorProfile"]})
      Toast.show({
        text1: "The Caretaker has been reassigned Successfully",
        type: "success",
      });
    } ,
    onError:(err) => {
      Toast.show({
        type:'error',
        text1:'Failed to reassign caretaker. Try Again...'
      })
    }
  })
  
  
  const handleConfirm = () => {
    if (selectedCaretaker) {
      reassignDoctor(selectedCaretakerID)
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
      <SafeAreaView className="flex-1 justify-center items-center bg-black/50">
        <LinearGradient
          colors={['#ffffff', '#f2f2f2']}
          className="w-[85%] rounded-2xl p-6 shadow-lg "
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-800">Reassign Doctor</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close-outline" size={24} />
            </TouchableOpacity>
          </View>

          {/* Picker Container */}
          <View className="bg-gray-100 rounded-lg mb-6">
            <Picker
              selectedValue={selectedCaretaker}
              onValueChange={(itemValue) => {
                const selected = doctors.find((doctor) => doctor.ID === itemValue);
                setSelectedCaretaker(selected?.fullname || '');
                setSelectedCaretakerID(itemValue);
              }}
              style={{ height: 50, width: '100%' }}
              itemStyle={{ fontSize: 16 }}
            >
              {doctors?.map((doctor) => {
                return (
                  <Picker.Item key={doctor.ID} label={doctor.fullname} value={doctor.ID} />
                );
              })}
            </Picker>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            className="bg-blue-600 py-3 rounded-lg items-center"
          >
            <Text className="text-white text-lg font-semibold">Confirm</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );
};

export default ReassignCaretakerModal;
