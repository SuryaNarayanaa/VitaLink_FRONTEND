import { View, Text } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {Drawer} from 'expo-router/drawer'

const _layout = () => {
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <Drawer>
        <Drawer.Screen name='index' options={{title:"View Patient"}}/>
        <Drawer.Screen name='AddPatient' options={{title:"View Patient"}}/>
        <Drawer.Screen name='ViewReport' options={{title:"View Report"}}/>
        <Drawer.Screen name='Logout' options={{title:"Logout"}}/>
      </Drawer>
    </GestureHandlerRootView>
  )
}

export default _layout