import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';

// Animation data
export const loadingAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Loading Animation",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Spinner",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [360] },
            { t: 60, s: [360] }
          ]
        },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [40, 40] },
              p: { a: 0, k: [0, -60] },
              r: { a: 0, k: 20 }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.89, 0.12, 0.31, 1] }
            }
          ]
        }
      ]
    }
  ]
};

interface LoadingAnimationProps {
  style?: ViewStyle;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ style }) => {
  return (
    <LottieView
      source={loadingAnimationData}
      autoPlay
      loop
      style={[styles.animation, style]}
    />
  );
};

const styles = StyleSheet.create({
  animation: {
    width: 140,
    height: 140,
  },
});

export default LoadingAnimation;
