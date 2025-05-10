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
            if(token){
              router.replace('/home')
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
