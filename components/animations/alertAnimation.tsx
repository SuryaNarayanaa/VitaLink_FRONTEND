import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import AlertIcon from '../../assets/lottie-icons/alert.json'

const alertAnimation = () => {
  const animation = React.useRef(null);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <LottieView
      source={AlertIcon}
      autoPlay
      ref={animation}
      loop
      style={[styles.animation]}
    />
  </View>
  )
}

const styles = StyleSheet.create({
  animation: {
    width: 25,
    height: 25,
  },
});

export default React.memo(alertAnimation)