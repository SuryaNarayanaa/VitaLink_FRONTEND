import { View, Text } from 'react-native'
import React from 'react'
import Drawer from 'expo-router/drawer'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import CustomDrawer from '@/components/CustomDrawer';
import { DrawerOptions } from '@/constants/drawerOptions';
import { CustomDrawerLabel } from '@/components/CustomDrawer'
import { usePatientContext } from '@/hooks/context/PatientContext';

const PatientDrawer = () => {
  const {patientData} = usePatientContext()
  return (
    <Drawer
          backBehavior="initialRoute"
          drawerContent={(props: DrawerContentComponentProps) => <CustomDrawer {...props} 
          patientname = {patientData?.patient.name || null} 
          therapy={patientData?.patient?.therapy || null} />}
          screenOptions={DrawerOptions}
        >
          <Drawer.Screen
            name="Profile"
            options={{
              drawerLabel: () => <CustomDrawerLabel iconName="person" label="Profile" />,
              headerTitle: "Profile",
            }}
          />
          <Drawer.Screen
            name="UpdateInr"
            options={{
              drawerLabel: () => <CustomDrawerLabel iconName="create" label="Update INR" />,
              headerTitle: "Update INR",
            }}
          />
          <Drawer.Screen
            name="TakeDosage"
            options={{
              drawerLabel: () => <CustomDrawerLabel iconName="medkit" label="Take Dosage" />,
              headerTitle: "Take Dosage",
            }}
          />
          <Drawer.Screen
            name="LifeStyleChanges"
            options={{
              drawerLabel: () => <CustomDrawerLabel iconName="fitness" label="Lifestyle Changes" />,
              headerTitle: "Lifestyle Changes",
            }}
          />
          <Drawer.Screen
            name="OtherMeditation"
            options={{
              drawerLabel: () => <CustomDrawerLabel iconName="leaf" label="Other Meditation" />,
              headerTitle: "Other Meditation",
            }}
          />
          <Drawer.Screen
            name="ProlongedIllness"
            options={{
              drawerLabel: () => <CustomDrawerLabel iconName="heart-dislike" label="Prolonged Illness" />,
              headerTitle: "Prolonged Illness",
            }}
          />
          <Drawer.Screen
            name="SideEffects"
            options={{
              drawerLabel: () => <CustomDrawerLabel iconName="warning" label="Side Effects" />,
              headerTitle: "Side Effects",
            }}
          />
        </Drawer>
  )
}

export default PatientDrawer