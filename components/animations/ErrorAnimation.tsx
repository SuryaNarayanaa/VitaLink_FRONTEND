import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';

// Animation data
export const errorAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 800,
  h: 600,
  nm: "Error Animation",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Error Icon",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [400, 300, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { 
          a: 1, 
          k: [
            { t: 0, s: [100, 100], e: [120, 120] },
            { t: 15, s: [120, 120], e: [80, 80] },
            { t: 30, s: [80, 80], e: [110, 110] },
            { t: 45, s: [110, 110], e: [100, 100] },
            { t: 60, s: [100, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [150, 150] },
          p: { a: 0, k: [0, 0] },
          fl: { a: 0, k: [1, 0.8, 0.8, 1] },
          st: { a: 0, k: [0.89, 0.12, 0.31, 1], w: 15 }
        },
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [15, 60] },
          p: { a: 0, k: [0, -10] },
          r: { a: 0, k: 5 },
          fl: { a: 0, k: [0.89, 0.12, 0.31, 1] }
        },
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [15, 15] },
          p: { a: 0, k: [0, 40] },
          fl: { a: 0, k: [0.89, 0.12, 0.31, 1] }
        }
      ]
    }
  ]
};

interface ErrorAnimationProps {
  style?: ViewStyle;
  loop?: boolean;
}

const ErrorAnimation: React.FC<ErrorAnimationProps> = ({ style, loop = false }) => {
  return (
    <LottieView
      source={errorAnimationData}
      autoPlay
      loop={loop}
      style={[styles.animation, style]}
    />
  );
};

const styles = StyleSheet.create({
  animation: {
    width: 150,
    height: 150,
  },
});

export default ErrorAnimation;
