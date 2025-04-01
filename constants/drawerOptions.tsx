import type {DrawerNavigationOptions} from '@react-navigation/drawer'
import React from 'react'
import {View,TouchableOpacity} from 'react-native'
import CustomHeader from '../components/CustomHeader'
import {Ionicons} from '@expo/vector-icons'
export const DrawerOptions: DrawerNavigationOptions = {
    header: ({ layout, options, route, navigation }): React.JSX.Element => {
        const title = options.headerTitle !== undefined
            ? options.headerTitle
            : options.title !== undefined
            ? options.title
            : route.name;

        return (
          <CustomHeader
            title={title as string}
            leftButton={
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} className='p-5 rounded-full bg-red-500'>
              <Ionicons name="menu" size={26} color="black" />
            </TouchableOpacity>
            }
          />
        );
    },
    headerStatusBarHeight: 20,
    drawerHideStatusBarOnOpen: false,
    drawerActiveBackgroundColor: '#f0f0f0', 
    drawerActiveTintColor: '#4a90e2', 
    drawerInactiveTintColor: '#7a7a7a', 
    sceneStyle: {
        backgroundColor: 'transparent',
    },
    drawerStyle: {
        width: 300,
        backgroundColor: '#ffffff', 
        borderTopEndRadius: 0,
        borderBottomEndRadius: 0,
        elevation: 5, 
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    drawerContentStyle: {
        marginLeft: 10, 
        marginRight: 10,
    },
    drawerItemStyle: {
        borderRadius: 10, 
        marginHorizontal: 5,
        marginVertical: 5,
    },
    drawerContentContainerStyle: {
        padding: 10,
    },
};