import React, { useState } from 'react';
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

const SideEffects = () => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [otherSideEffects, setOtherSideEffects] = useState('');

  const handleCheckboxToggle = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleSubmit = () => {
    console.log('Checked items:', checkedItems);
    console.log('Other side effects:', otherSideEffects);
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

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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