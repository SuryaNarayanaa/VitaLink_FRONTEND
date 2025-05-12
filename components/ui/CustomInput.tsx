import { View, Text,TextInputProps, KeyboardAvoidingView, TouchableWithoutFeedback,Image, TextInput, Platform, Keyboard,TouchableOpacity } from 'react-native'
import React from 'react'

interface InputFieldProps extends TextInputProps {
    label: string;
    placeholder?:string;
    icon?: any;
    secureTextEntry?: boolean;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
    onIconPress?: () => void;
    iconComponent?: React.ReactNode;
}


const InputField = ({
    label,labelStyle,icon,
    secureTextEntry,containerStyle,
    iconStyle,inputStyle,className,onIconPress,iconComponent,
    placeholder,...props}:InputFieldProps) => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className='my-1 w-full'>
                <Text className={`mb-2 ${labelStyle}`}>{label}</Text>
                <View className={`flex flex-row justify-start items-center relative
                ${containerStyle}`}>
                    {icon && <Image source={icon} className={`w-6 h-6  ${iconStyle}`}/>}
                    <TextInput className={`rounded-full p-4 text-[15px] flex-1 text-left ${inputStyle}`}
                    secureTextEntry={secureTextEntry} placeholder={placeholder} {...props}
                    ></TextInput>
                    {iconComponent && ( <TouchableOpacity onPress={onIconPress}
                        className="bg-transparent flex flex-row items-center rounded-md p-[11px]" activeOpacity={0.7}>
                        {iconComponent}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default InputField
