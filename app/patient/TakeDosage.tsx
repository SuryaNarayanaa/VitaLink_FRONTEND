import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { usePatientContext } from '@/hooks/context/PatientContext';
import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query';
import {apiClient} from '@/hooks/api';
import ConfirmModal from '@/components/Patient/ConfirmModel';
import { useSafeState } from '@/hooks/useSafeState';
import { Ionicons } from '@expo/vector-icons';

const ITEMS_PER_PAGE = 8;

type PatientData = {
  recent_missed_doses:string[]
  missed_doses: string[];
};

const extractRecentMissedDoses = (doses: string[]) => {
  const recent = doses.slice(0, 7);
  const remaining = doses.slice(7);
  return { recent, remaining };
};

export default function TakeDosage() {
  const queryclient = useQueryClient()
  const {data = null,isLoading} = useQuery({
    queryKey:["missed_doses"],
    queryFn:async() => {
      const {data} = await apiClient.get<PatientData>("/patient/missedDoses")
      return data;
    }
  })

  const recentMissedDoses = data?.recent_missed_doses || [];
  const paginatedMissedDoses = data?.missed_doses || [];
  
  const [takenDate, setTakenDate] = useSafeState<string | null>(null);
  const [errormessage,setErrorMessage] = useSafeState<string | null>(null) 
  const [showModal,setShowModal] = useSafeState<boolean>(false);

  const [currentPage, setCurrentPage] = useSafeState(1);
  const totalPages = Math.ceil(paginatedMissedDoses.length / ITEMS_PER_PAGE);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return paginatedMissedDoses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const handleDatePress = (date: string) => {
    setTakenDate(date);
    setShowModal(true)
  };

  useEffect(() => {
      if (!showModal) {
        setTakenDate(null);
        setErrorMessage(null);
      }
    }, [showModal]);

  const {mutateAsync:takeDosageMutate,error,isPending,isSuccess} = useMutation({
      mutationFn:async(date:string | null):Promise<void> => {
        if(!date) {setErrorMessage("No dates chosen. Try again.");return;}
        await apiClient.put(`/patient/take_dose`,{date})
      },
      onSuccess:() => {
          queryclient.invalidateQueries({queryKey:['profile']})
          queryclient.invalidateQueries({queryKey:["missed_doses"]})
      },
      onError:(error)=>{
        setErrorMessage(error?.message || "Failed to take dosage. Try again.");
      }
  })

  return (
    <ScrollView className='flex-1 p-2 font-primary'>
      <View className='bg-[#ffffff99] backdrop:blur-sm p-8 m-[15px] rounded-2xl'>
        <Text className='text-[#333] text-xl mb-2 font-primary font-bold'>Missed Doses</Text>
        <Text className='text-[16px] text-[#666] mb-5'>
          Below are the missed doses for the last 7 days. Click on the date to mark it as taken.
        </Text>

        <View className='flex flex-row flex-wrap gap-3'>
          {recentMissedDoses.map((date) => (
            <TouchableOpacity
              key={date}
              className={`p-[10px] rounded-lg  min-w-20 items-center ${takenDate === date ? 'bg-[#4CAF50]' : 'bg-[#ffffffe8]'}`}
              onPress={() => {handleDatePress(date);}}
            >
              <Text style={[styles.dateText, takenDate === date && styles.takenDateText]}>
                {date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className='mt-5'>
          <Text className='mb-[10px] text-[#333] text-xl font-primary font-bold'>Remaining Missed Doses</Text>
          <View className='flex flex-row flex-wrap items-center gap-3 justify-around'>
            {getPaginatedData().map((dose, index) => (
              <View key={index} style={styles.missedDoseItem}>
                <Ionicons name="alert-circle-outline" size={24} color="#FF5252" />
                <Text style={styles.missedDoseMedication}>{dose}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className='flex flex-row justify-between items-center mt-3'>
          <TouchableOpacity
            onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
          >
            <Text style={styles.paginationButtonText}>Previous</Text>
          </TouchableOpacity>

          <Text style={styles.paginationInfo}>Page {currentPage} of {totalPages}</Text>

          <TouchableOpacity
            onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
          >
            <Text style={styles.paginationButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        <ConfirmModal showModal={showModal} setShowModal={setShowModal}
        onConfirm={() => takeDosageMutate(takenDate)} errormessage={errormessage} isLoading={isPending} 
        isSuccess={isSuccess} date={takenDate}/>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dateText: { fontSize: 14, color: '#333', fontWeight: '500' },
  takenDateText: { color: '#fff' },
  missedDoseItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5252',
    flexDirection:'row',
    alignItems:'center',
    gap:10,
    width: '45%',
  },
  paginationButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 8 },
  disabledButton: { backgroundColor: '#A9CCE3' },
  paginationButtonText: { color: '#fff', fontWeight: 'bold' },
  paginationInfo: { fontSize: 16, color: '#333' },
  missedDoseMedication: {
    fontSize: 15,
    color: '#444',
  }
});
