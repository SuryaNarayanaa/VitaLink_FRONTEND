import React, { ReactNode } from 'react'
import { View, Text, Dimensions, ViewStyle, StyleProp, Image } from 'react-native'
import {COLORS} from '../constants/Theme'
const psgLogo = require('../assets/images/psg_logo_2.jpg')
const psgIMSLogo = require('../assets/images/PSG_Institute_of_Medical_Sciences_&_Research_Logo.svg.png')

interface CustomHeaderProps {
  title: string
  leftButton?: ReactNode
}

const CustomHeader = ({ title, leftButton }:CustomHeaderProps) => {
  const screenHeight = Dimensions.get("window").height
  return (
    <View className='bg-white flex items-center w-full rounded-b-sm' style = {{ paddingVertical : screenHeight < 725 ?  5 : 20 }}>
      <View className='relative w-full flex flex-row items-center justify-around px-5'>
        <View className=''>{leftButton}</View>
        <View className='flex-1 flex-row items-center justify-center gap-x-5  w-full py-2'>
          <Image
            style={{ 
                maxHeight : screenHeight < 650 ? 60 : 80,
                maxWidth : screenHeight < 650 ? 60 : 80,
             }}
            source={psgIMSLogo}
            resizeMode='contain'
          />
          <View className='w-[2px] h-[70px] bg-[#ddd]'/>
          <Image
            style={{ 
              maxHeight : screenHeight < 650 ? 80 : 80,
              maxWidth : screenHeight < 650 ? 80 : 80,
           }}
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
