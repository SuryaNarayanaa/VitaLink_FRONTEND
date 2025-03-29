import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';

export default function UpdateInr() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>INR Value:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter INR value"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location of Test:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter test location"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date of Test:</Text>
          <TextInput
            style={styles.input}
            placeholder="dd-mm-yyyy --:--"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Attach Report (PDF only):</Text>
          <TouchableOpacity style={styles.fileInput}>
            <Text style={styles.fileInputText}>Choose File</Text>
          </TouchableOpacity>
          <Text style={styles.noFileText}>No file chosen</Text>
        </View>

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit INR Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  fileInput: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  fileInputText: {
    color: '#333',
    fontSize: 16,
  },
  noFileText: {
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});