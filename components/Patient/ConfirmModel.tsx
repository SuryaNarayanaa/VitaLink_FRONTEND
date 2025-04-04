import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Animated, Image,StyleSheet } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import CustomButton from '@/components/ui/CustomButton';

interface ConfirmModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  onConfirm?: () => void;
  errormessage?: string | null;
  isLoading?: boolean;
  isSuccess?: boolean;
  date?:string | null;
}

export default function ConfirmModal({showModal,setShowModal,onConfirm,
  isLoading,errormessage,isSuccess,date
}: ConfirmModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Animation references
  const warningX = useRef(new Animated.Value(0)).current;
  const arrowX = useRef(new Animated.Value(0)).current;
  const checkX = useRef(new Animated.Value(0)).current;
  const finalScale = useRef(new Animated.Value(0)).current;
  const imageOpacity = useRef(new Animated.Value(1)).current;

  // Reset animations when modal closes
  const resetAnimations = () => {
    warningX.setValue(0);
    arrowX.setValue(0);
    checkX.setValue(0);
    finalScale.setValue(0);
    imageOpacity.setValue(1);
    setIsConfirmed(false);
  };

  // Handle confirm action
  const handleConfirm = () => {
    if (isLoading) return;
    
    // Start the merge animation
    Animated.parallel([
      Animated.timing(warningX, {
        toValue: 50,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(arrowX, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(checkX, {
        toValue: -50,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(imageOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start(() => {
      onConfirm?.();
    });
  };

  // Handle API result
  useEffect(() => {
    if (!isLoading && isSuccess !== undefined) {
      setIsConfirmed(true);
      
      // Success/failure bounce animation
      Animated.sequence([
        Animated.timing(finalScale, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(finalScale, {
          toValue: 0.9,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(finalScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading, isSuccess]);

  return (
    <ReactNativeModal 
      isVisible={showModal} 
      onModalHide={resetAnimations}
      onBackdropPress={() => !isLoading && setShowModal(false)}
      animationIn={'slideInLeft'}
      animationOut={'slideOutRight'} // review The settings
      animationOutTiming={1000}
      animationInTiming={1000}
    >
      <View className="bg-white min-h-[300px] rounded-2xl px-7 py-9 items-center">
        <View className="flex-row justify-center items-center h-20 gap-x-6">
          {!isConfirmed ? (
            <>
              <Animated.View style={{ 
                transform: [{ translateX: warningX }],
                opacity: imageOpacity,
              }}>
                <Image
                  source={require('@/assets/images/warning.png')}
                  style={{ width: 55, height: 55 }}
                />
              </Animated.View>

              <Animated.View style={{ 
                transform: [{ translateX: arrowX }],
                opacity: imageOpacity,
              }}>
                <Image
                  source={require('@/assets/images/next.png')}
                  style={{ width: 50, height: 50 }}
                />
              </Animated.View>

              <Animated.View style={{ 
                transform: [{ translateX: checkX }],
                opacity: imageOpacity,
              }}>
                <Image
                  source={require('@/assets/images/check.png')}
                  style={{ width: 55, height: 55 }}
                />
              </Animated.View>
            </>
          ) : (
            <Animated.View style={{ transform: [{ scale: finalScale }] }}>
              <Image
                source={isSuccess 
                  ? require('@/assets/images/check.png')
                  : require('@/assets/images/warning.png')}
                style={{ width: 60, height: 60 }}
              />
            </Animated.View>
          )}
        </View>

        <Text className="text-center text-lg text-md mt-5">
          {isConfirmed 
            ? (isSuccess ? "Dose marked as Taken!" : "Action Failed!")
            : `Are you sure you want to mark the missed dose ${date ?`at ${date}` : ''}?`}
        </Text>

        {/* Error message display */}
        {errormessage && (
          <Text className="text-red-500 text-sm mt-2 text-center">
            {errormessage}
          </Text>
        )}

        <View className="mt-8 flex flex-wrap flex-row justify-center gap-x-6 mb-2">
          {!isConfirmed ? (
            <>
              <CustomButton 
                title="Close" 
                onPress={() => setShowModal(false)} 
                style={styles.button}
                bgVariant='danger'
                disabled={isLoading}
              />
              <CustomButton 
                title={isLoading ? "Processing..." : "Confirm"} 
                onPress={handleConfirm} 
                style={styles.button}
                bgVariant='success' 
                disabled={isLoading}
              />
            </>
          ) : (
            <CustomButton
              title="Close"
              onPress={() => setShowModal(false)}
              bgVariant={isSuccess ? "primary" : "danger"}
            />
          )}
        </View>
      </View>
    </ReactNativeModal>
  );
}

const styles = StyleSheet.create({
    button:{
      borderRadius:10,
      width:100,
    }
})