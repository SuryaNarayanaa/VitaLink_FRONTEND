import '../styles/global.css'
import {Redirect} from 'expo-router'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { Alert } from 'react-native'
import { useEffect } from 'react'

export default function Index() {
  useEffect(() => {
        const redirect = async () => {
          try{
            const token = await SecureStore.getItemAsync('access_token');
            const userRole = await SecureStore.getItemAsync('userRole');
            if(token){
              if(userRole === 'doctor') router.replace('/doctor')
              else if(userRole === 'patient') router.replace('/patient/Profile')
            }
          }catch(error){
              Alert.alert("Error during Initialing The user")
          }
        }
        redirect()
    },[])
  return (
    <Redirect href={'/(auth)/signIn'}/>
  );
}
