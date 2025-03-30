import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawer from 'expo-router/drawer';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import CustomDrawer from '@/components/CustomDrawer';
import { DrawerOptions } from '@/constants/drawerOptions';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomDrawerLabel } from '@/components/CustomDrawer';

const DoctorLayout = () => {
  return (
    <LinearGradient colors={['#a7b9ff', '#fab7c5']} dither={false} style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          backBehavior="initialRoute"
          drawerContent={(props: DrawerContentComponentProps) => <CustomDrawer {...props} />}
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
          <Drawer.Screen
            name="Logout"
            options={{
              drawerLabel: () => <CustomDrawerLabel iconName="log-out" label="Logout" />,
              headerTitle: "Logout",
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </LinearGradient>
  );
};

export default DoctorLayout;