import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import CloseIcon from '../../assets/lottie-icons/closeAnimation.json';

interface CloseAnimationProps {
  style?: ViewStyle;
}

const CloseAnimation: React.FC<CloseAnimationProps> = ({ style }) => {
  const animation = React.useRef<LottieView>(null);

  return (
    <View style={[styles.container, style]}>
      <LottieView
        source={CloseIcon}
        autoPlay
        ref={animation}
        loop
        style={[styles.animation, style]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // No absolute positioning here – positioning will be handled by the parent component
  },
  animation: {
    width: 200, // default sizes (will be overridden by provided style)
    height: 200,
  },
});

export default React.memo(CloseAnimation);
