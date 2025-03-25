import { View, Text } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Drawer from 'expo-router/drawer'

const _layout = () => {
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <Drawer>
        <Drawer.Screen name='index' options={{title:"Profile"}}/>
        <Drawer.Screen name='UpdateInr' options={{title:"UpdateInr"}}/>
        <Drawer.Screen name='TakeDosage' options={{title:"Take_Dosage"}}/>
        <Drawer.Screen name='LifeStyleChanges' options={{title:"LifeStyleChanges"}}/>
        <Drawer.Screen name='OtherMeditation' options={{title:"OtherMeditation"}}/>
        <Drawer.Screen name='ProLongIllness' options={{title:"ProLongIllness"}}/>
        <Drawer.Screen name='SideEffects' options={{title:"Side Effects"}}/>
        <Drawer.Screen name='Logout' options={{title:"Logout"}}/>
      </Drawer>
    </GestureHandlerRootView>
  )
}

export default _layout