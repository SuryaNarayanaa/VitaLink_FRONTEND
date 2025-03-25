import React, { ReactNode } from 'react'
import { View, Text, StyleSheet, ViewStyle, StyleProp, Image } from 'react-native'
import {COLORS} from '../constants/Theme'

interface CustomHeaderProps {
  title: string
  leftButton?: ReactNode
}

const CustomHeader = ({ title, leftButton }:CustomHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <View style={styles.leftButton}>{leftButton}</View>
        <Image
          style={styles.logo}
          source={{ uri: 'https://via.placeholder.com/80' }}
        />
        <View style={styles.rightPlaceholder} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>@ My Profile Page</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    headerContainer:{
        backgroundColor:'white',
        paddingHorizontal:20
    },
    header: {
      height: 160,
      justifyContent: 'flex-start'
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      marginTop: 30
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
      fontWeight: 'bold'
    },
    subtitle: {
      marginTop: 4,
      fontSize: 12,
      color: '#555',
      textAlign:'center'
    }
})

export default CustomHeader
