import { CustomDrawerLabel } from '@/components/CustomDrawer';
import Drawer from 'expo-router/drawer';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import CustomDrawer from '@/components/CustomDrawer';
import { DrawerOptions } from '@/constants/drawerOptions';
import React from 'react'
import { useDoctorContext } from './DoctorContext';

const DoctorNavigator = () => {
  const {doctorData} = useDoctorContext()
  console.log(doctorData?.user.fullname)
  console.log(doctorData?.user.occupation)  
  return (
    <Drawer
          backBehavior="initialRoute"
          drawerContent={(props: DrawerContentComponentProps) => 
          <CustomDrawer {...props} doctorname={doctorData?.user.fullname} doctorOccupation={doctorData?.user.occupation}/>}
          screenOptions={DrawerOptions}
        >
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: () => <CustomDrawerLabel iconName="people" label="View Patient" />,
              headerTitle: "View Patient",
            }}
          />
          <Drawer.Screen
            name="AddPatient"
            options={{
              drawerLabel: () => <CustomDrawerLabel iconName="person-add" label="Add Patient" />,
              headerTitle: "Add Patient",
            }}
          />
          <Drawer.Screen
            name="ViewReports"
            options={{
              drawerLabel: () => <CustomDrawerLabel iconName="document-text" label="View Report" />,
              headerTitle: "View Report",
            }}
          />
        </Drawer>
  )
}

export default DoctorNavigator