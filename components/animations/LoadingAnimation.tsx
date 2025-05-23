import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import Loadingicon from '../../assets/lottie-icons/loading1.json'
interface LoadingAnimationProps {
  style?: ViewStyle;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ style }) => {
  return (
    <LottieView
      source={Loadingicon}
      autoPlay
      loop
      style={[styles.animation, style]}
    />
  );
};

const styles = StyleSheet.create({
  animation: {
    width: 200,
    height: 200,
  },
});

export default LoadingAnimation;
