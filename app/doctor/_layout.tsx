import 'react-native-gesture-handler'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {Drawer} from 'expo-router/drawer'
import CustomDrawer from '@/components/CustomDrawer';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerOptions } from '@/constants/drawerOptions';
import {LinearGradient} from 'expo-linear-gradient'

const _layout = () => {
  return (
    <LinearGradient colors={['#a7b9ff','#fab7c5']} dither={false} style={{flex:1}}>
        <GestureHandlerRootView style={{flex:1}}>
        <Drawer 
          backBehavior='initialRoute' 
          drawerContent={(props:DrawerContentComponentProps) => <CustomDrawer {...props}/>} 
          screenOptions={DrawerOptions}
          
        > 
          <Drawer.Screen name='index' options={{
            drawerLabel:"View Patient",
            headerTitle:"View Patient"
          }}/>
          <Drawer.Screen name='AddPatient' options={{
            drawerLabel:"Add Patient",
            headerTitle:"Add Patient"
          }}/>
          <Drawer.Screen name='ViewReports' options={{
            drawerLabel:"View Report",
            headerTitle:"View Report"
          }}/>
          <Drawer.Screen name='Logout' options={{
            drawerLabel:"Logout",
            headerTitle:"Logout"
          }}/>
        </Drawer>
      </GestureHandlerRootView>
    </LinearGradient>
  )
}

export default _layout