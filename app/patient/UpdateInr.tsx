import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, Alert, Platform, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '@/components/ui/CustomButton';
import InputField from '@/components/ui/CustomInput';
import FileInputField from '@/components/ui/FileInputField';
import { usePatient } from '@/hooks/api';
import { INRReport, fileProps } from '@/types/patient';
import { useSafeState } from '@/hooks/useSafeState';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/hooks/api/apiClient';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { showToast } from '@/components/ui/CustomToast';
import Toast from 'react-native-toast-message';

function isValidDate(dateString: string): boolean {
  const regex = /^(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{2}:\d{2}))?$/;
  const match = dateString.trim().match(regex);
  if (!match) {
    return false;
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12) {
    return false;
  }

  const maxDays = new Date(year, month, 0).getDate(); 
  if (day < 1 || day > maxDays) {
    return false;
  }

  if (match[4]) {
    const [hoursStr, minutesStr] = match[4].split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return false;
    }
  }

  return true;
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  // Optionally add time if you want "dd-mm-yyyy hh:mm"
  return `${day}-${month}-${year}`;
}


export default function UpdateInr() {
  const {updateINR} = usePatient()
  const [form, setForm] = useSafeState({
    inr_value: '',
    date: '',
  })
  const [selectedFile, setSelectedFile] = useSafeState<fileProps>({
    uri: '',
    name: '',
    file: "",
    mimeType: '',
  });
  const [formError, setFormError] = useSafeState<string | null>(null);
  const [buttonStatus, setButtonStatus] = useSafeState<'default' | 'pending' | 'success' | 'error'>('default');
  const [showDatePicker, setShowDatePicker] = useSafeState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const queryclient = useQueryClient();

  useEffect(() => {
    if (buttonStatus !== 'default') {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [buttonStatus, scaleAnim]);

  useEffect(() => {
    if (buttonStatus === 'success' || buttonStatus === 'error') {
      const timer = setTimeout(() => {
        setButtonStatus('default');
        setFormError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [buttonStatus]);


  const {mutate:updateInrMutate, isError, isPending, isSuccess} = useMutation({
    mutationFn: async(report: INRReport) => {
      if(!selectedFile.uri || !form.inr_value || !form.date) {
        Toast.show({
           type:'error',
           text1:'All the fields are required'
        })
      }
      const formData = new FormData();
      formData.append("inr_value", form.inr_value);
      formData.append("date", form.date);
      formData.append("file", selectedFile.file);
      formData.append("file_name", selectedFile.name);
      
      const response = await apiClient.post("/patient/update-inr", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["profile"] });
      setButtonStatus("success");
      Toast.show({
        type:'success',
        text1:"INR report has been submitted successfully"
      })
      // Reset form
      setForm({ inr_value: "", date: "" });
      setSelectedFile({ uri: "", name: "", file: "", mimeType: "" });
    },
    onError: (error: any) => {
      setButtonStatus("error");
      Toast.show({
        type:'error',
        text1:'failed to submit The INR report.Try again...'
      })
    }
  });

  const handleSubmit = async() => {
    const inrNumber = parseFloat(form.inr_value);
    if (isNaN(inrNumber)) {
      setFormError("invalid Inr_value");
      setButtonStatus('error');
      setForm({inr_value:'',date:''})
      return;
    }
    if(!isValidDate(form.date)) {setFormError("The Provided Date is invalid");setButtonStatus('error');;return;}
    setButtonStatus('pending');

    const report = {
      inr_value: inrNumber,
      date: form.date,
      file: selectedFile.file, 
      file_name: selectedFile ? selectedFile.name : '',
      file_path: selectedFile ? selectedFile.uri : '',
      type: selectedFile ? selectedFile.mimeType : '',
    };
    await updateInrMutate(report)
  }

  const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    // If user pressed "OK"
    if (event.type === 'set' && selected) {
      const formatted = formatDate(selected);
      setForm({ ...form, date: formatted });
    }
    // Close the picker
    setShowDatePicker(false);
  };


  return (
    <ScrollView className='flex-1 p-2 font-primary'>
      <View className='bg-[#ffffff99] backdrop:blur-sm p-8 m-[15px] rounded-2xl'>
        {formError && (
          <View className='mt-2'>
            <Text className="text-center text-red-600 mb-2 tracking-wider">{formError}</Text>
          </View>
        )}
        <InputField label='INR Value : ' 
        labelStyle='text-[16px] font-bold  text-[#333] tracking-wider mb-2' 
        inputStyle='bg-[#fff] border rounded-xl border-[#ddd]' 
        placeholder='Enter INR value' keyboardType='numeric'
        value={form.inr_value}
        onChangeText={(value)=>setForm({...form,inr_value:value})}/>

        <InputField label='Date of Test :' 
        labelStyle='text-[16px] font-bold text-[#333] tracking-wider mb-2' 
        inputStyle='bg-[#fff] border rounded-xl border-[#ddd]' 
        placeholder='dd-mm-yyyy --:--'
        value={form.date}
        onChangeText={(value)=>setForm({...form,date:value})}
        iconComponent={<Ionicons name="calendar" size={20} color="#555" />}
        onIconPress={() => setShowDatePicker(true)}/>

        {showDatePicker && (
        <Modal
            transparent={true}
            animationType="fade"
            visible={showDatePicker}
            onRequestClose={() => setShowDatePicker(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-4 rounded-xl">
              <DateTimePicker value={new Date()} mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'} textColor="black"
              onChange={handleDateChange}
            />
            </View>
          </View>
        </Modal>
        )}
      
        <FileInputField  label="Upload Document:" labelStyle='text-[16px] font-bold text-[#333] tracking-wider mb-2' 
        containerStyle="bg-transparent border rounded-xl border-[#ddd]"
        FileExtensions={['pdf', 'docx']}
        onFileSelect={(file) => {
          if (file) {
            setSelectedFile({
              uri: file.uri,
              name: file.name,
              file: file.file,
              mimeType: file.mimeType,
            });
          } else {
            setSelectedFile({ uri: '', name: '', file: '', mimeType: '' });
          }
        }}
        />

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <CustomButton
            title={ 
              buttonStatus === 'default'
                ? 'Submit INR Report'
                : buttonStatus === 'pending'
                ? 'Submitting...'
                : buttonStatus === 'success'
                ? 'Submitted!'
                : 'Submit Failed'
            }
            bgVariant={
              buttonStatus === 'default' || buttonStatus === 'pending'
                ? 'primary'
                : buttonStatus === 'success'
                ? 'success'
                : 'danger'
            }
            className="rounded-xl my-2"
            onPress={handleSubmit}
            disabled={buttonStatus === 'pending'}
          />
        </Animated.View>

      </View>
    </ScrollView>
  );
}
