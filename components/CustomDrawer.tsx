import { View, Text } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'

export default function CustomDrawer(props:any) {
  return (
    <DrawerContentScrollView {...props}>
        <DrawerItemList {...props}/>
    </DrawerContentScrollView>
  )
}