import React, { ReactNode } from 'react'
import { View, Text, StyleSheet, ViewStyle, StyleProp, Image } from 'react-native'
import {COLORS} from '../constants/Theme'
const psgLogo = require('../assets/images/right-logo.png')
const psgIMSLogo = require('../assets/images/PSG_Institute_of_Medical_Sciences_&_Research_Logo.svg.png')

interface CustomHeaderProps {
  title: string
  leftButton?: ReactNode
}

const CustomHeader = ({ title, leftButton }:CustomHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <View style={styles.leftButton}>{leftButton}</View>
        <View style={styles.logoContainer}>
          <Image
            style={styles.psgIMSLogo}
            source={psgIMSLogo}
            resizeMode='contain'
          />
          <View style={styles.divider} />
          <Image
            style={styles.psgLogo}
            source={psgLogo}
            resizeMode='contain'
          />
        </View>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {/* <Text style={styles.subtitle}>@my Profile Page</Text> */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    headerContainer:{
      backgroundColor:'white',
      paddingHorizontal:20,
      paddingBottom:10,
      borderBottomLeftRadius:20,
      borderBottomRightRadius:20
    },
    header: {
      height: 160,
      justifyContent: 'flex-start'
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      marginTop:30
    },
    leftButton: {
      width: 40
    },
    logo: {
      flex: 1,
      width: 60,
      height: 60,
      resizeMode: 'contain',
      marginLeft: 40
    },
    rightPlaceholder: {
      width: 40
    },
    titleContainer: {
      alignItems: 'center',
      marginTop: 10
    },
    title: {
      fontSize: 18,
      fontWeight: '600'
    },
    subtitle: {
      marginTop: 4,
      fontSize: 12,
      color: '#555',
      textAlign:'center'
    },
    psgIMSLogo: {
      width: 100,
      height: 100,
    },
    psgLogo: {
      width: 100,
      height: 100,
    },
    divider: {
      width: 2,
      height: 100,
      backgroundColor: '#ddd',
      marginHorizontal: 20,
    },
    logoContainer:{
        flexDirection:'row',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:20,
    }
})

export default CustomHeader
