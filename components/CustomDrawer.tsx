import React from 'react';
import {
  View,
  Text,
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
import { usePatientContext } from '@/hooks/context/PatientContext';


export const CustomDrawerLabel = ({ iconName, label }: { iconName: keyof typeof Ionicons.glyphMap; label: string }) => (
  <View className='flex flex-row items-center gap-x-4'>
    <View className='flex flex-row items-center justify-center'><Ionicons name={iconName} size={20} color="#000" className=''/></View>
    <Text className=''>{label}</Text>
  </View>
);

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const { logout } = useAuth(); 
  const handleLogout = async () => {
    try {
      const response = await logout(); 
      if (response) {
        router.replace('/')
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert("Error Occured During Logout.Try Again")
    }
  };

  const { top, bottom } = useSafeAreaInsets();
  
  return (
    <View className='flex-1 rounded-none mt-[100px]'>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: top }}
        scrollEnabled={false}
      >
        <DrawerItemList {...props} />
        <DrawerItem
          label={() => (
            <View className='flex flex-row items-center mx-[10px] gap-x-[12px]'>
              <Ionicons name="log-out" size={20} color="#333" />
              <Text className='text-black'>Logout</Text>
            </View>
          )}
          onPress={handleLogout}
          style={{borderRadius:10,overflow:'hidden'}}
        />
      </DrawerContentScrollView>

      <View className='py-[15px] px-[20px] border-t-[1px] border-t-[#ccc] items-center'>
        <Text style={styles.footerText}>Dummy Patient or Doctor</Text>
        <Text style={styles.footerSubText}>Position</Text>
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

