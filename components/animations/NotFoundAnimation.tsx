import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import NotFoundIcon from '../../assets/lottie-icons/notFound.json'
interface LoadingAnimationProps {
  style?: ViewStyle;
}

const NotFoundAnimation: React.FC<LoadingAnimationProps> = ({ style }) => {
  return (
    <LottieView
      source={NotFoundIcon}
      autoPlay
      loop
      style={[styles.animation, style]}
    />
  );
};

const styles = StyleSheet.create({
  animation: {
    width: 180,
    height: 180,
  },
});

export default NotFoundAnimation;
