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
    <View className='bg-white flex items-center py-5 w-full rounded-b-2xl'>
      <View className='relative w-full flex flex-row items-center justify-around px-5'>
        <View className=''>{leftButton}</View>
        <View className='flex-1 flex-row items-center justify-center gap-x-5 pr-10'>
          <Image
            className='w-[80px] h-[80px]'
            source={psgIMSLogo}
            resizeMode='contain'
          />
          <View className='w-[2px] h-[80px] bg-[#ddd]'/>
          <Image
            className='w-[100px] h-[100px]'
            source={psgLogo}
            resizeMode='contain'
          />
        </View>
      </View>
      <View className='flex flex-row items-center justify-center'>
        <Text className='text-center text-xl font-semibold text-[#2f2929]'>@ {title} Page</Text>
      </View>
    </View>
  )
}

export default CustomHeader
