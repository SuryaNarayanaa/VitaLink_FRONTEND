import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import {useQueryClient,useMutation} from '@tanstack/react-query'
import { ReportFormResponse } from '@/types/patient';
import { apiClient } from '@/hooks/api';
const sideEffects = [
  'Heavy Menstrual Bleeding',
  'Black or Bloody Stool',
  'Severe Headache',
  'Severe Stomach Pain',
  'Joint Pain, Discomfort or Swelling',
  'Vomiting of Blood',
  'Coughing up Blood',
  'Bruising without Injury',
  'Dizziness or Weakness',
  'Vision Changes',
];

const  SplitSideEffects = (reportSideEffects:string | null ,checkbox :string[]) => {
  const checked: { [key: string]: boolean } = {};
  let other = "";

  checkbox.forEach((item)=>checked[item] = false)
  if (!reportSideEffects) {
    return { checked, other };
  }

  const parts = reportSideEffects.split(",").map(s=>s.trim()).filter(s=>s.length>0)
  checkbox.forEach((item)=>{
    if(parts.includes(item)) checked[item] = true;
  })

  const extras = parts.filter((item) => !checkbox.includes(item));
  other = extras.join(', ');
  return { checked, other };
} 


const SideEffects = () => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [otherSideEffects, setOtherSideEffects] = useState('');

  const queryClient = useQueryClient()
  const data = queryClient.getQueryData<ReportFormResponse>(['reports']);
  const reportData: ReportFormResponse | null = data ?? null;
  
  console.log(reportData);

  useEffect(() => {
    if(reportData && typeof reportData.sideEffects === 'string'){
        const {checked,other} = SplitSideEffects(reportData.sideEffects,sideEffects)
        setCheckedItems(checked)
        setOtherSideEffects(other)
    }
  },[reportData])

  const handleCheckboxToggle = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const {mutate:reportMutation,isPending} = useMutation({
    mutationFn:async (formdata:FormData) => {
      const result = await apiClient.post('/patient/report',formdata,{
        headers:{'Content-Type': 'multipart/form-data'},
      })
    },
    onSuccess:() => {queryClient.invalidateQueries({queryKey:['reports']})}
  })
  


  const handleSubmit = () => {
    const selected = Object.keys(checkedItems).filter((key) => checkedItems[key]);
    const combined = [...selected, otherSideEffects].filter(Boolean).join(', ');
    const formData = new FormData();
    formData.append('typ', 'sideEffects');
    formData.append('field', combined);
    reportMutation(formData);
  };

  return (
    <ScrollView className='flex-1 p-2 font-primary'>
        <View className='bg-[#ffffffbc] backdrop:blur-sm p-8 m-[15px] rounded-2xl'>
          <Text style={styles.title}>Check all that apply:</Text>

          {sideEffects.map((effect) => (
            <TouchableOpacity
              key={effect}
              style={styles.checkboxContainer}
              onPress={() => handleCheckboxToggle(effect)}
            >
              <Checkbox
                status={checkedItems[effect] ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxToggle(effect)}
                color="#000"
              />
              <Text style={styles.checkboxLabel}>{effect}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.descriptionTitle}>
            Describe any other side effects you are experiencing
          </Text>
          
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            value={otherSideEffects}
            onChangeText={setOtherSideEffects}
            placeholder=""
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isPending}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    margin: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  descriptionTitle: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    minHeight: 100,
    textAlignVertical: Platform.OS === 'android' ? 'top' : 'auto',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default SideEffects;