import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { LinearGradient } from 'expo-linear-gradient';
import DoctorNavigator from '@/hooks/context/DoctorNavigator';
import DoctorProvider from '@/hooks/context/DoctorContext';


const DoctorLayout = () => {
  return (
    <DoctorProvider>
    <LinearGradient colors={['#a7b9ff', '#fab7c5']} dither={false} style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
          <DoctorNavigator/>
      </GestureHandlerRootView>
    </LinearGradient>
    </DoctorProvider>
  );
};

export default DoctorLayout;