import * as DocumentPicker from 'expo-document-picker'
import { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FileInputFieldProps {
    label: string;
    placeholder?:string;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    FileExtensions: string[];
    onFileSelect?: (file: DocumentPicker.DocumentPickerAsset | null) => void;
}

const mapExtensionsToMime = (extensions: string[]): string[] => {
    const mapping: Record<string, string> = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
  
    return extensions.map(ext => mapping[ext.toLowerCase()]).filter(Boolean);
  };

const FileInputField:React.FC<FileInputFieldProps> = ({
    label,placeholder,labelStyle,containerStyle,
    inputStyle,iconStyle,onFileSelect,FileExtensions,...props
}) => {
    const [selectedFile,setSelectedFile] = useState<string|null>(null)
    const mimeTypes = mapExtensionsToMime(FileExtensions);
    const pickDocument = async() => {
        const result = await DocumentPicker.getDocumentAsync({
            type: mimeTypes.length > 0 ? mimeTypes : '*/*', 
            copyToCacheDirectory:false // review
        })
        if(result.canceled === false){
            setSelectedFile(result.assets[0].name)
            onFileSelect?.(result.assets[0])
        }
    } 
  return (
    <View className="my-3 w-full">
      <Text className={`mb-3 ${labelStyle}`}>{label}</Text>
      <TouchableOpacity
        onPress={pickDocument}
        className={`flex flex-row items-center bg-neutral-100 rounded-lg border border-neutral-300 p-4 ${containerStyle}`}
        {...props}
      >
        <Ionicons name="attach" size={20} color="#555" style={{ marginRight: 8 }} />
        <Text className="text-[15px] text-gray-800 ">
          {selectedFile || 'Select a file'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default FileInputField