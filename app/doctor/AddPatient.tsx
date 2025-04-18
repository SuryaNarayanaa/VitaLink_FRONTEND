import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDoctorContext } from '@/hooks/context/DoctorContext';
import InputField from '@/components/ui/CustomInput';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/ui/CustomButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/hooks/api';
import { patientSchema } from '@/constants/validator/PatientSchemaValidator';
import { PatientCreateRequest } from '@/types/patient';
import { showToast } from '@/components/ui/CustomToast';
import Toast from 'react-native-toast-message';

const initalData = {
  name: '',
  age: '',
  gender: '',
  target_inr_min: '',
  target_inr_max: '',
  caregiver: 'Not Assigned',
  therapy: '',
  medical_history: [{ diagnosis: '', duration: '', durationUnit: 'Days' }],
  therapy_start_date: '',
  dosage_schedule: {
    mon: { enabled: false, value: '' },
    tue: { enabled: false, value: '' },
    wed: { enabled: false, value: '' },
    thu: { enabled: false, value: '' },
    fri: { enabled: false, value: '' },
    sat: { enabled: false, value: '' },
    sun: { enabled: false, value: '' },
  },
  contact: '',
  kin_name: '',
  kin_contact: '',
}



const AddPatient = () => {
  const {doctorData} = useDoctorContext()
  // Form state
  const [patientData, setPatientData] = useState(initalData);

  // Pickers state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showTherapyPicker, setShowTherapyPicker] = useState(false);
  const [showDurationUnitPicker, setShowDurationUnitPicker] = useState(false);

  const [errormessage,setErrormessage] = useState<string>('');

  const queryclient = useQueryClient();

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setPatientData({ ...patientData, [field]: value });
  };

  const handlemedical_historyChange = (index: number, field: string, value: string) => {
    const updatedHistory = [...patientData.medical_history];
    updatedHistory[index] = { ...updatedHistory[index], [field]: value };
    setPatientData({ ...patientData, medical_history: updatedHistory });
  };

  const addmedical_history = () => {
    setPatientData({
      ...patientData,
      medical_history: [
        ...patientData.medical_history,
        { diagnosis: '', duration: '', durationUnit: 'Days' },
      ],
    });
  };

  // Handle date change for therapy_start_date
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      handleInputChange('therapy_start_date', formattedDate);
    }
  };

  const handledosage_scheduleChange = (day: string, field: string, value: any) => {
    setPatientData((prevData) => ({
      ...prevData,
      dosage_schedule: {
        ...prevData.dosage_schedule,
        [day]: {
          ...prevData.dosage_schedule[day as keyof typeof prevData.dosage_schedule],
          [field]: value,
        },
      },
    }));
  };

  const handemedical_historyClear = (indexToRemove: number) => {
    console.log(indexToRemove)
    setPatientData((prevData) => ({
      ...prevData,
      medical_history: prevData.medical_history.filter((_, index) => index !== indexToRemove),
    }));
  };

  const {mutate:addPatient,isError,isPending,isSuccess} = useMutation({
     mutationFn:async (refinedData:PatientCreateRequest) => {
        console.log("here")
        const response = await apiClient.post('/doctor/add-patient',{...refinedData})
        return response.data;
     },
     onSuccess:() => {
      console.log("success")
        queryclient.invalidateQueries({queryKey:["doctorProfile"]})
        Toast.show({
          type:'success',
          text1:'Patient added successfully'
        })
     },
     onError: (error: any) => {
       Toast.show({
         type:'error',
         text1:'Failed to add patient.Try again...'
       })
     }
  })

  // Handle form submission
  const handleSubmit = async() => {
    console.log('clicked')
    try {
      await patientSchema.validate(patientData, { abortEarly: false });
      const refinedData = {
        name: patientData.name.trim(),
        contact: `+91${patientData.contact}`,
        age: parseInt(patientData.age, 10),
        gender: patientData.gender.charAt(0).toUpperCase(),
        target_inr_min: parseFloat(patientData.target_inr_min),
        target_inr_max: parseFloat(patientData.target_inr_max), 
        therapy: patientData.therapy.charAt(0).toUpperCase() + patientData.therapy.slice(1),
        medical_history: patientData.medical_history.map((item) => ({
          diagnosis: item.diagnosis,
          duration_value: item.duration,
          duration_unit: item.durationUnit.toLowerCase(), 
        })),
        therapy_start_date: patientData.therapy_start_date.split('-').reverse().join('-'),
        dosage_schedule: Object.entries(patientData.dosage_schedule).map(([day, { enabled, value }]) => ({
          day: day.toUpperCase(), 
          dosage: enabled ? parseFloat(value) : 0, 
        })),
        kin_name: patientData.kin_name,
        kin_contact: `+91${patientData.kin_contact}`,
      };
      console.log(refinedData)
      addPatient(refinedData)
      setPatientData(initalData)
    } catch (validationError:any) {
      console.log(validationError)
      setErrormessage(validationError.errors[0]);
      Toast.show({
        type:'error',
        text1:`${validationError.errors[0]}. Try fixing it`
      })
    }
  };

  // Options
  const genderOptions = ['Select', 'Male', 'Female', 'Other'];
  const therapyOptions = ['Select', 'Warfarin', 'Heparin', 'Dabigatran', 'Rivaroxaban'];
  const durationUnitOptions = ['Days', 'Weeks', 'Months', 'Years'];
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  return (
    <ScrollView
      className='flex-1 p-2 font-primary'
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-6 py-3">
        <Text className="text-[#fff] text-2xl font-bold">
          Welcome, Dr. {`${doctorData?.user.fullname}`}
        </Text>
      </View>
      <SafeAreaView className="bg-[#ffffff99] backdrop:blur-sm p-8 m-[15px] rounded-2xl ">
          <InputField label='Name' placeholder='Enter patient name' 
          labelStyle='text-base font-semibold text-gray-800 mb-1'
          inputStyle='bg-white border border-gray-300  px-3 py-2 mt-2 text-base text-gray-800 rounded-none'
          value={patientData.name} onChangeText={(text) => handleInputChange('name',text)}
          placeholderTextColor='#999' />
          

          <InputField label='Age' placeholder='Enter your age' 
          labelStyle='text-base font-semibold text-gray-800 mb-1'
          inputStyle='bg-white border border-gray-300 rounded px-3 py-2 mt-2 text-base text-gray-800 rounded-none'
          value={patientData.age} onChangeText={(text) => handleInputChange('age',text)}
          placeholderTextColor='#999'  keyboardType="numeric"/>

          
          <View className="mb-4 mt-2">
            <Text className="text-base font-semibold text-gray-800 mb-1">Gender</Text>
            <TouchableOpacity
              onPress={() => setShowGenderPicker(!showGenderPicker)}
              className="bg-white border border-gray-300 rounded px-3 py-2 flex-row justify-between items-center"
            >
              <Text className="text-base text-gray-800">
                {patientData.gender || 'Select'}
              </Text>
              <Text className="text-lg">▼</Text>
            </TouchableOpacity>
            {showGenderPicker && (
              <View className="bg-white border border-gray-300 rounded mt-1 z-10">
                {genderOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      handleInputChange('gender', option === 'Select' ? '' : option.toLowerCase());
                      setShowGenderPicker(false);
                    }}
                    className="px-3 py-2"
                  >
                    <Text className="text-base text-gray-800">{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          
          <View className="flex-row mb-4 w-full gap-x-2">
            <View className="flex-1">
              <InputField
                label="Target INR Min" placeholder="Min"
                labelStyle="text-base font-semibold text-gray-800 mb-1"
                inputStyle="bg-white border border-gray-300 rounded px-3 py-2 text-base text-gray-800 rounded-none"
                value={patientData.target_inr_min} onChangeText={(text) => handleInputChange('target_inr_min', text)}
                placeholderTextColor="#999" keyboardType="numeric"/>
            </View>
            <View className="flex-1">
              <InputField
                label="Target INR Max" placeholder="Max"
                labelStyle="text-base font-semibold text-gray-800 mb-1"
                inputStyle="bg-white border border-gray-300 rounded px-3 py-2 text-base text-gray-800 rounded-none"
                value={patientData.target_inr_max} onChangeText={(text) => handleInputChange('target_inr_max', text)}
                placeholderTextColor="#999" keyboardType="numeric" />
            </View>
          </View>
          
          {/* Caregiver Field */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-800 mb-1">Caregiver</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded px-3 py-2 text-base text-gray-800"
              value={patientData.caregiver}
              onChangeText={(text) => handleInputChange('caregiver', text)}
              placeholder="Enter caregiver name"
              placeholderTextColor="#999"
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-800 mb-1">Therapy</Text>
            <TouchableOpacity
              onPress={() => setShowTherapyPicker(!showTherapyPicker)}
              className="bg-white border border-gray-300 rounded px-3 py-2 flex-row justify-between items-center"
            >
              <Text className="text-base text-gray-800">
                {patientData.therapy || 'Select'}
              </Text>
              <Text className="text-lg">▼</Text>
            </TouchableOpacity>
            {showTherapyPicker && (
              <View className="bg-white border border-gray-300 rounded mt-1 z-10">
                {therapyOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      handleInputChange('therapy', option === 'Select' ? '' : option.toLowerCase());
                      setShowTherapyPicker(false);
                    }}
                    className="px-3 py-2"
                  >
                    <Text className="text-base text-gray-800">{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Medical History Section */}
          <View className="mb-6 bg-gray-50 border border-gray-200 rounded p-4">
               <Text className="text-lg font-bold text-gray-800 px-2 mb-4">
                 Medical History
                </Text>
                
            {patientData.medical_history.map((item, index) => (
              <View key={index} className="mb-4 p-4 bg-white rounded border border-gray-200 relative">
                { index !== 0 && <View className='absolute right-4 top-3'>
                <TouchableOpacity className='flex items-center justify-center'
                     onPress={() => handemedical_historyClear(index)}>
                    <Ionicons name='close-outline' size={24}/>
                </TouchableOpacity>
                </View>
                }
                <InputField label="Diagnosis" placeholder="Enter diagnosis" 
                labelStyle="text-base font-semibold text-gray-700 mb-1" 
                inputStyle="bg-white border border-gray-300 rounded px-3 py-2 text-base text-gray-800 rounded-none"
                value={item.diagnosis}
                onChangeText={(text) => handlemedical_historyChange(index, 'diagnosis', text)}
                placeholderTextColor="#999" multiline
                numberOfLines={3} />

                <View className="flex-row justify-between">
                  <View className="flex-1 mr-2">
                    <Text className="text-base font-semibold text-gray-700 mb-1">Duration</Text>
                    <TextInput
                      className="bg-white border border-gray-300 rounded px-3 py-2 text-base text-gray-800"
                      value={item.duration}
                      onChangeText={(text) => handlemedical_historyChange(index, 'duration', text)}
                      placeholder="Duration"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-700 mb-1">Unit</Text>
                    <TouchableOpacity 
                      onPress={() => setShowDurationUnitPicker(!showDurationUnitPicker)}
                      className="bg-white border border-gray-300 rounded px-3 py-2 flex-row justify-between items-center"
                    >
                      <Text className="text-base text-gray-800">{item.durationUnit}</Text>
                      <Text className="text-lg">▼</Text>
                    </TouchableOpacity>
                    {showDurationUnitPicker && (
                      <View className="bg-white border border-gray-300 rounded mt-1 z-10">
                        {durationUnitOptions.map((option, optIndex) => (
                          <TouchableOpacity
                            key={optIndex}
                            onPress={() => {
                              handlemedical_historyChange(index, 'durationUnit', option);
                              setShowDurationUnitPicker(false);
                            }}
                            className="px-3 py-2"
                          >
                            <Text className="text-base text-gray-800">{option}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity
              onPress={addmedical_history}
              className="bg-white border-2 border-black rounded px-4 py-3 items-center mt-2"
            >
              <Text className="text-base font-bold text-black">+ Add Medical History</Text>
            </TouchableOpacity>
          </View>

          {/* Therapy Start Date */}
          <View className="mb-6">
            <InputField label='Therapy Start Date' 
              labelStyle='text-base font-semibold text-gray-800 mb-1' 
               inputStyle='bg-[#fff] border rounded-xl border-[#ddd]' 
                placeholder='dd-mm-yyyy --:--'
                value={patientData.therapy_start_date || 'dd-mm-yyyy'}
                iconComponent={<Ionicons name="calendar" size={20} color="#555" />}
                onIconPress={() => setShowDatePicker(true)}/>
            {showDatePicker && (
              <DateTimePicker
                value={
                  patientData.therapy_start_date
                    ? new Date(
                        patientData.therapy_start_date.split('-').reverse().join('-')
                      )
                    : new Date()
                }
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}
          </View>

          <View className="mb-6">
            <Text className="text-md font-bold text-gray-800 mb-4">Prescripiton</Text>
            <View className="flex-col">
              {days.map((day) => (
                <View key={day} className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center flex-1">
                    <Switch
                      value={
                        patientData.dosage_schedule[day as keyof typeof patientData.dosage_schedule].enabled
                      } 
                      onValueChange={(value) =>
                        handledosage_scheduleChange(day, 'enabled', value)
                      }
                      trackColor={{ false: '#E8E8E8', true: '#000' }}
                      thumbColor="#FFFFFF"
                    />
                    <Text className="ml-3 text-base font-medium text-gray-800">
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Text>
                  </View>
                  <TextInput
                    className={`bg-white border border-gray-300 rounded px-3 py-2 w-20 text-base text-gray-800 text-center ${
                      !patientData.dosage_schedule[day as keyof typeof patientData.dosage_schedule].enabled &&
                      'bg-gray-200 text-gray-500'
                    }`}
                    value={
                      patientData.dosage_schedule[day as keyof typeof patientData.dosage_schedule].value
                    }
                    onChangeText={(text) => handledosage_scheduleChange(day, 'value', text)}
                    placeholder="mg"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    editable={
                      patientData.dosage_schedule[day as keyof typeof patientData.dosage_schedule].enabled
                    }
                  />
                </View>
              ))}
            </View>
          </View>
           

          <InputField label="Contact"  placeholder="Enter contact number"
          labelStyle="text-base font-semibold text-gray-800 mb-1"
          inputStyle="bg-white border border-gray-300 rounded-none px-3 py-2 text-base text-gray-800"
          value={patientData.contact}
          onChangeText={(text) => handleInputChange('contact', text)}
          placeholderTextColor="#999" keyboardType="phone-pad"/>

          <InputField label="Kin Name"  placeholder="Enter Kin name"
          labelStyle="text-base font-semibold text-gray-800 mb-1"
          inputStyle="bg-white border border-gray-300 rounded-none px-3 py-2 text-base text-gray-800"
          value={patientData.kin_name}
          onChangeText={(text) => handleInputChange('kin_name', text)}
          placeholderTextColor="#999"/>

          <InputField label="Kin Contact"  placeholder="Enter Kin Contact "
          labelStyle="text-base font-semibold text-gray-800 mb-1"
          inputStyle="bg-white border border-gray-300 rounded-none px-3 py-2 text-base text-gray-800"
          value={patientData.kin_contact}
          onChangeText={(text) => handleInputChange('kin_contact', text)}
          placeholderTextColor="#999"  keyboardType="phone-pad" />

          <CustomButton title='Add Patient' textVariant='primary' onPress={handleSubmit}
          className='bg-white border-2  border-black rounded-md px-4 py-4 items-center mt-4'/>
          
      </SafeAreaView>
    </ScrollView>
  );
};

export default AddPatient;
