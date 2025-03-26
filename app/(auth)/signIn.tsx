import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { BASE_URL } from '../config/env'
import { router } from 'expo-router'
import {HeaderLogos} from '../../components/HeaderLogos'

export default function SignIn() {
  const [Username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!Username || !password) {
      setError('Please fill in all fields');
      return;
    }
    console.log(Username, password);
    
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Sending request...');
      const formData = new FormData();
      formData.append('username', Username);
      formData.append('password', password);

      const response = await axios.post(`${BASE_URL}/login`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log(response.data);

      const data = response.data;
      
      // Handle role-based navigation
      switch (data.role) {
        case 'admin':
          router.replace('/admin');
          break;
        case 'doctor':
          router.replace('/doctor');
          break;
        case 'patient':
          router.replace('/patient');
          break;
        default:
          throw new Error('Invalid role received');
      }

    } catch (err) {
      setError(
        axios.isAxiosError(err) 
          ? err.response?.data?.detail || 'Login failed. Please try again.' 
          : 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with logos */}
      <View style={styles.container}>
      <HeaderLogos />
      
      {/* Sign-in form */}
      
      <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.title}>Sign in</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
      <View style={styles.loginBox}>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Username"
            value={Username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.signInButton, isLoading && styles.disabledButton]}
          onPress={handleSignIn}
          disabled={isLoading}
        >
          <Text style={styles.signInButtonText}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/signUp')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },

  loginBox: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formContainer: {
    flexGrow: 1,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor : 'red',
    color : 'red',  
    marginBottom: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E41E4F',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#0066CC',
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: '#E41E4F',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signUpText: {
    color: '#666',
    fontSize: 14,
  },
  signUpLink: {
    color: '#0066CC',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 16,
    textAlign: 'center',
  },
});