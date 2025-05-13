import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState,useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import {HeaderLogos} from '../../components/HeaderLogos'
import useAuth, { LoginCredentials } from '@/hooks/api/auth/useAuth'
import { AnimatedCard } from '@/components/animations/Animationedcard'
import { Ionicons } from '@expo/vector-icons';

export default function SignIn() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const { login, isLoading, error } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
      const redirect = async () => {
        try{
          const token = await SecureStore.getItemAsync('access_token');
          if(token){
            router.replace('/home')
          }
        }catch(error){
            Alert.alert("Error during Initialing The user")
        }
      }
      redirect()
  },[])
  const handleSignIn = async () => {
    if (!credentials.username || !credentials.password) {
      return;
    }
    if(credentials.username === '' || credentials.password === ''){
      return
    }
    try {
      const response = await login(credentials);
      if (response && response.role) {
        router.replace('/home');
      } else {
        console.error('Login failed - missing role information');
        setCredentials({ username: '', password: '' });
        throw new Error('Unauthorized access: Invalid role or permissions');
      }
    } catch (err) {
      console.error('Login failed', err);
    }
    finally{
      setCredentials({ username: '', password: '' });
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <HeaderLogos />
      
      
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
            value={credentials.username}
            onChangeText={(text) => setCredentials({...credentials, username: text})}
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={{  ...styles.input, flex: 1 , borderWidth: 0 }}
            
              placeholder="Enter your password"
              value={credentials.password}
              onChangeText={(text) => setCredentials({ ...credentials, password: text })}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className='px-4'>
              <Ionicons
                name={isPasswordVisible ? 'eye' : 'eye-off'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.signInButton} 
          onPress={handleSignIn}
          disabled={isLoading}
        >
          <Text style={styles.signInButtonText}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>
        
        {/* <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/SignUp')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View> */}
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
  },signInButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    
    backgroundColor: '#f9f9f9',
  },
  forgotContainer: {
    alignItems: 'flex-end',
    paddingRight: 24,
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
  signInButtoniewText: {
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