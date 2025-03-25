import type {DrawerNavigationOptions} from '@react-navigation/drawer'
import React from 'react'
import {View,TouchableOpacity} from 'react-native'
import CustomHeader from '../components/CustomHeader'
import {Ionicons} from '@expo/vector-icons'
export const  DrawerOptions:DrawerNavigationOptions = {
    header:({layout,options,route,navigation}):React.JSX.Element => {
        const title =  options.headerTitle !== undefined? options.headerTitle
        : options.title !== undefined ? options.title: route.name;

        return <CustomHeader 
        title={title as string}
        leftButton={
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons name="menu" size={24} color="black" />
          </TouchableOpacity>
        }
        />
    },
    headerStatusBarHeight: 20,
    drawerHideStatusBarOnOpen:false,
    drawerActiveBackgroundColor:'white',
    drawerActiveTintColor:'Black',
    drawerInactiveTintColor:'Black',
    sceneStyle:{
      backgroundColor: 'transparent',
    },
    drawerStyle:{
      width:290,
      borderTopEndRadius:0,
      borderBottomEndRadius:0
    },
    drawerContentStyle:{
        marginLeft:0,
        marginRight:0,
    },
    drawerItemStyle:{
      borderRadius:0,
      marginHorizontal:0
    }
}