import React from 'react';
import {
  View,
  Text,Dimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/api';
import { Ionicons } from '@expo/vector-icons';
import {router} from 'expo-router'


export const CustomDrawerLabel = ({ iconName, label }: { iconName: keyof typeof Ionicons.glyphMap; label: string }) => (
  <View className='flex flex-row items-center gap-x-4'>
    <View className='flex flex-row items-center justify-center'>
      <Ionicons name={iconName} size={20} color="#000"/>
    </View>
    <Text className='text-black font-semibold'>{label}</Text>
  </View>
);

interface CutsomDrawerProps extends  DrawerContentComponentProps{
   patientname?:string | null;
   therapy?:string | null;
   doctorname?:string | null;
   doctorOccupation?:string | null;
}

export default function CustomDrawer(props: CutsomDrawerProps) {
  const { logout } = useAuth(); 
  const handleLogout = async () => {
    try {
      const response = await logout(); 
      if (response) {
        router.replace('/(auth)/signIn')
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert("Error Occured During Logout.Try Again")
    }
  };

  const { top, bottom } = useSafeAreaInsets();
  const screenHeight = Dimensions.get("window").height

  
  return (
    <View className='flex-1 flex-col justify-around h-full rounded-none' 
    style={{ paddingBottom: bottom,
      marginTop: screenHeight < 650 ? 5 : screenHeight < 750 ? 50 : 100
     }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: top }}
        scrollEnabled={true}
      >
        <DrawerItemList {...props} />
        <DrawerItem
          label={() => (
            <View className='flex flex-row items-center mx-[10px] gap-x-[12px]'>
              <Ionicons name="log-out" size={20} color="#333" />
              <Text className='text-black font-medium tracking-wide'>Logout</Text>
            </View>
          )}
          onPress={handleLogout}
          style={{borderRadius:10,overflow:'hidden'}}
        />
      </DrawerContentScrollView>

      <View className='py-[15px] px-[20px] border-t-[1px] border-t-[#ccc] items-center'>
        <Text style={styles.footerText}>{props.patientname || props.doctorname || 'Patient'}</Text>
        <Text style={styles.footerSubText}>{props.therapy || props.doctorOccupation || 'Therapy'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  footerSubText: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
});

