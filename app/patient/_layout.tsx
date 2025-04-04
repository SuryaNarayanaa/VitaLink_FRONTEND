import 'react-native-gesture-handler'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient'
import { PatientProvider } from '@/hooks/context/PatientContext' 
import PatientDrawer from '@/components/Patient/PatientDrawer'

const PatientLayout = () => {
  return (
    <PatientProvider>
    <LinearGradient colors={['#a7b9ff', '#fab7c5']} dither={false} style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PatientDrawer/>
      </GestureHandlerRootView>
    </LinearGradient>
    </PatientProvider>
  );
};

export default PatientLayout;