import 'react-native-gesture-handler'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {Drawer} from 'expo-router/drawer'

const _layout = () => {
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <Drawer>
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
  )
}

export default _layout