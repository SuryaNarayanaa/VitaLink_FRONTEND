import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Platform,
  } from 'react-native';


interface TextInputProps {
    label:string
    text:string;
    setText: (value:string) => void;
    handleSubmit: () => void;
    isPending:boolean
}  


const MutltiLinetextInput:React.FC<TextInputProps> = ({label,text,setText,handleSubmit,isPending,...props}) => {
  return (
      <SafeAreaView className='flex-1 p-2 font-primary'>
        <View className='bg-[#ffffffb6] backdrop:blur-sm p-8 m-[15px] rounded-2xl h-auto'>
            <Text className='text-[16px]  font-primary font-[600] mb-5'>
              {label}
            </Text>
            
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              value={text}
              onChangeText={(value) => setText(value)}
              placeholder="List the names of other medications you are taking"
            />
            

            <TouchableOpacity 
                className='bg-slate-50 p-4 rounded-lg items-center border border-slate-800'
            onPress={handleSubmit} disabled={isPending}
            >
            <Text className='font-secondary text-[16px] font-semibold tracking-wide'>
            Submit
            </Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    margin: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    minHeight: 120,
    textAlignVertical: Platform.OS === 'android' ? 'top' : 'auto',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default MutltiLinetextInput