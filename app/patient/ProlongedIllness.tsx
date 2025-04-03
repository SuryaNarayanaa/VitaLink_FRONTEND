import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ProlongedIllness = () => {
  const [illnessDetails, setIllnessDetails] = useState('');

  const handleSubmit = () => {
    console.log('Prolonged Illness Details:', illnessDetails);
    // Add logic to submit data here
  };

  return (
    <LinearGradient
      colors={['#E0D0FF', '#FFD0E0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>Provide details about your prolonged illness</Text>
            
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              value={illnessDetails}
              onChangeText={setIllnessDetails}
              placeholder=""
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
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

export default ProlongedIllness;