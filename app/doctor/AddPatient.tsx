import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  StatusBar,
  Dimensions,
  Modal
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
const AddPatient = () => {
  // State for form data
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    targetINRMin: '',
    targetINRMax: '',
    doctor: 'Dr. K. Tamilarasu',
    caregiver: 'Not Assigned',
    therapy: '',
    medicalHistory: [{ diagnosis: '', duration: '', durationUnit: 'Days' }],
    therapyStartDate: '',
    prescription: {
      mon: { enabled: false, value: '' },
      tue: { enabled: false, value: '' },
      wed: { enabled: false, value: '' },
      thu: { enabled: false, value: '' },
      fri: { enabled: false, value: '' },
      sat: { enabled: false, value: '' },
      sun: { enabled: false, value: '' },
    },
    contact: '',
    kinName: '',
    kinContact: '',
  });

  // State for pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showTherapyPicker, setShowTherapyPicker] = useState(false);
  const [showDurationUnitPicker, setShowDurationUnitPicker] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle form field changes
  const handleInputChange = (field: string, value: string) => {
    setPatientData({ ...patientData, [field]: value });
  };

  // Handle medical history changes
  const handleMedicalHistoryChange = (index: number, field: string, value: string) => {
    const updatedHistory = [...patientData.medicalHistory];
    updatedHistory[index] = { ...updatedHistory[index], [field]: value };
    setPatientData({ ...patientData, medicalHistory: updatedHistory });
  };

  // Handle prescription toggle and value changes
  const handlePrescriptionChange = (day: string, field: 'enabled' | 'value', value: boolean | string) => {
    setPatientData({
      ...patientData,
      prescription: {
        ...patientData.prescription,
        [day]: {
          ...patientData.prescription[day as keyof typeof patientData.prescription],
          [field]: value
        }
      }
    });
  };

  // Add new medical history entry
  const addMedicalHistory = () => {
    setPatientData({
      ...patientData,
      medicalHistory: [...patientData.medicalHistory, { diagnosis: '', duration: '', durationUnit: 'Days' }]
    });
  };

  // Handle date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      handleInputChange('therapyStartDate', formattedDate);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log('Patient data submitted:', patientData);
    alert('Patient added successfully!');
  };

  // Options for dropdowns
  const genderOptions = ['Select', 'Male', 'Female', 'Other'];
  const therapyOptions = ['Select', 'Warfarin', 'Heparin', 'Dabigatran', 'Rivaroxaban'];
  const durationUnitOptions = ['Days', 'Weeks', 'Months', 'Years'];
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  return (
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header with Welcome Message */}
            <View style={styles.header}>
              <Text style={styles.welcomeText}>Welcome, Dr. K. Tamilarasu</Text>
            </View>
            
            {/* Translucent Form Container */}
            <View style={styles.formContainer}>
              {/* Name Field */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={patientData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  placeholder="Enter patient name"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Age Field */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={patientData.age}
                  onChangeText={(text) => handleInputChange('age', text)}
                  placeholder="Enter age"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>

              {/* Gender Field */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Gender</Text>
                <TouchableOpacity 
                  style={styles.select}
                  onPress={() => setShowGenderPicker(!showGenderPicker)}
                >
                  <Text style={styles.selectText}>
                    {patientData.gender || 'Select'}
                  </Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
                {showGenderPicker && (
                  <View style={styles.pickerOptions}>
                    {genderOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.pickerOption}
                        onPress={() => {
                          handleInputChange('gender', option === 'Select' ? '' : option.toLowerCase());
                          setShowGenderPicker(false);
                        }}
                      >
                        <Text style={styles.pickerOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Target INR Fields */}
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Target INR Min</Text>
                  <TextInput
                    style={styles.input}
                    value={patientData.targetINRMin}
                    onChangeText={(text) => handleInputChange('targetINRMin', text)}
                    placeholder="Min"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Target INR Max</Text>
                  <TextInput
                    style={styles.input}
                    value={patientData.targetINRMax}
                    onChangeText={(text) => handleInputChange('targetINRMax', text)}
                    placeholder="Max"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Doctor Field */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Doctor</Text>
                <TextInput
                  style={[styles.input, styles.readOnlyInput]}
                  value={patientData.doctor}
                  editable={false}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Caregiver Field */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Caregiver</Text>
                <TextInput
                  style={styles.input}
                  value={patientData.caregiver}
                  onChangeText={(text) => handleInputChange('caregiver', text)}
                  placeholder="Enter caregiver name"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Therapy Field */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Therapy</Text>
                <TouchableOpacity 
                  style={styles.select}
                  onPress={() => setShowTherapyPicker(!showTherapyPicker)}
                >
                  <Text style={styles.selectText}>
                    {patientData.therapy || 'Select'}
                  </Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
                {showTherapyPicker && (
                  <View style={styles.pickerOptions}>
                    {therapyOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.pickerOption}
                        onPress={() => {
                          handleInputChange('therapy', option === 'Select' ? '' : option.toLowerCase());
                          setShowTherapyPicker(false);
                        }}
                      >
                        <Text style={styles.pickerOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Medical History Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Medical History</Text>
                
                {patientData.medicalHistory.map((item, index) => (
                  <View key={index} style={styles.historyItem}>
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Diagnosis</Text>
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        value={item.diagnosis}
                        onChangeText={(text) => handleMedicalHistoryChange(index, 'diagnosis', text)}
                        placeholder="Enter diagnosis"
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                    
                    <View style={styles.formRow}>
                      <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Duration</Text>
                        <TextInput
                          style={styles.input}
                          value={item.duration}
                          onChangeText={(text) => handleMedicalHistoryChange(index, 'duration', text)}
                          placeholder="Duration"
                          placeholderTextColor="#999"
                          keyboardType="numeric"
                        />
                      </View>
                      
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Unit</Text>
                        <TouchableOpacity 
                          style={styles.select}
                          onPress={() => setShowDurationUnitPicker(!showDurationUnitPicker)}
                        >
                          <Text style={styles.selectText}>{item.durationUnit}</Text>
                          <Text style={styles.dropdownIcon}>▼</Text>
                        </TouchableOpacity>
                        {showDurationUnitPicker && (
                          <View style={styles.pickerOptions}>
                            {durationUnitOptions.map((option, optIndex) => (
                              <TouchableOpacity
                                key={optIndex}
                                style={styles.pickerOption}
                                onPress={() => {
                                  handleMedicalHistoryChange(index, 'durationUnit', option);
                                  setShowDurationUnitPicker(false);
                                }}
                              >
                                <Text style={styles.pickerOptionText}>{option}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
                
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addMedicalHistory}
                >
                  <Text style={styles.addButtonText}>+ Add Medical History</Text>
                </TouchableOpacity>
              </View>

              {/* Therapy Start Date */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Therapy Start Date</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {patientData.therapyStartDate ? patientData.therapyStartDate : "dd-mm-yyyy"}
                  </Text>
                  <Text style={styles.calendarIcon}>📅</Text>
                </TouchableOpacity>
                {showDatePicker && (
  <DateTimePicker
    value={patientData.therapyStartDate ? 
      new Date(
        patientData.therapyStartDate
          .split('-')
          .reverse()
          .join('-')
      ) : 
      new Date()}
    mode="date"
    display="default"
    onChange={handleDateChange}
  />
)}
              </View>

              {/* Prescription Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Prescription</Text>
                
                <View style={styles.prescriptionContainer}>
                  {days.map((day) => (
                    <View key={day} style={styles.prescriptionDay}>
                      <View style={styles.toggleContainer}>
                        <Switch
                          value={patientData.prescription[day as keyof typeof patientData.prescription].enabled}
                          onValueChange={(value) => handlePrescriptionChange(day, 'enabled', value)}
                          trackColor={{ false: '#E8E8E8', true: '#DC267F' }}
                          thumbColor={'#FFFFFF'}
                        />
                        <Text style={styles.dayName}>
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </Text>
                      </View>
                      <TextInput
                        style={[
                          styles.input, 
                          styles.doseInput,
                          !patientData.prescription[day as keyof typeof patientData.prescription].enabled && styles.disabledInput
                        ]}
                        value={patientData.prescription[day as keyof typeof patientData.prescription].value}
                        onChangeText={(text) => handlePrescriptionChange(day, 'value', text)}
                        placeholder="mg"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        editable={patientData.prescription[day as keyof typeof patientData.prescription].enabled}
                      />
                    </View>
                  ))}
                </View>
              </View>

              {/* Contact Information */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Contact</Text>
                <TextInput
                  style={styles.input}
                  value={patientData.contact}
                  onChangeText={(text) => handleInputChange('contact', text)}
                  placeholder="Enter contact number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Kin Name</Text>
                  <TextInput
                    style={styles.input}
                    value={patientData.kinName}
                    onChangeText={(text) => handleInputChange('kinName', text)}
                    placeholder="Enter kin name"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Kin Contact</Text>
                  <TextInput
                    style={styles.input}
                    value={patientData.kinContact}
                    onChangeText={(text) => handleInputChange('kinContact', text)}
                    placeholder="Enter kin contact"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Add Patient</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  hamburgerBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 10,
  },
  hamburgerIcon: {
    fontSize: 24,
    color: 'white',
  },
  sidebar: {
    flex: 1,
    backgroundColor: 'white',
  },
  menuHeader: {
    padding: 20,
    backgroundColor: '#648FFF',
    height: 150,
    justifyContent: 'flex-end',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  menuSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  menuItems: {
    paddingTop: 20,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  activeMenuItem: {
    backgroundColor: 'rgba(100, 143, 255, 0.1)',
  },
  activeMenuItemText: {
    color: '#648FFF',
    fontWeight: 'bold',
  },
  closeMenuBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 101,
  },
  closeMenuIcon: {
    fontSize: 30,
    color: 'white',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 15,
    padding: 25,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  readOnlyInput: {
    backgroundColor: 'rgba(240,240,240,0.9)',
  },
  select: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#555',
  },
  pickerOptions: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
    zIndex: 100,
    position: 'absolute',
    width: '100%',
    top: 50,
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionContainer: {
    marginVertical: 15,
    backgroundColor: 'rgba(249,249,249,0.9)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(224,224,224,0.5)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  historyItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(224,224,224,0.5)',
  },
  addButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: 'black',
  },
  addButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  datePickerButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  calendarIcon: {
    fontSize: 20,
  },
  prescriptionContainer: {
    flexDirection: 'column',
  },
  prescriptionDay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dayName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  doseInput: {
    width: 80,
    textAlign: 'center',
  },
  disabledInput: {
    backgroundColor: 'rgba(240,240,240,0.9)',
    color: '#999',
  },
  submitButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'black',
  },
  submitButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default AddPatient;