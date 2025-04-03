import { View, Text, TouchableOpacity,TouchableOpacityProps } from 'react-native'
import React from 'react'

/** Custom Header for Evey Button in The user Interface */

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
    textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
}


const getbgVariantStyle = (varaiant:ButtonProps['bgVariant']):string =>{
    switch(varaiant){
        case 'secondary': return 'bg-gray-500'
        case 'danger': return 'bg-red-500'
        case 'success': return 'bg-green-500'
        case 'outline': return 'bg-transparent border-netrual-300 border-[0.5px]'
        default: return 'bg-[#0286FF]'
    }
}

const getTextVariantStyle = (varaiant:ButtonProps['textVariant']):string =>{
    switch(varaiant){
        case 'primary': return 'text-black'
        case 'secondary': return 'text-gray-100'
        case 'danger': return 'text-red-100'
        case 'success': return 'text-green-100'
        default: return 'text-white'
    }
}

const CustomButton = ({onPress,title,bgVariant='primary',textVariant="default",
    IconLeft,IconRight,className,...props}:ButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} 
    className={`w-full rounded-full p-3 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70
    ${getbgVariantStyle(bgVariant)}   ${className} `}
    {...props} 
    >
        {IconLeft && <IconLeft/>}
        <Text className={`text-lg font-bold ${getTextVariantStyle(textVariant)}`}>{title}</Text>
        {IconRight && <IconRight/>}
    </TouchableOpacity>
  )
}

export default CustomButton