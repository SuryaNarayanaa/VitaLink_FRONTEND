import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';

// Animation data
export const emptyReportsAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 800,
  h: 600,
  nm: "Empty Reports Animation",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Empty Folder",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [400, 300, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { 
          a: 1, 
          k: [
            { t: 0, s: [100, 100], e: [110, 110] },
            { t: 45, s: [110, 110], e: [100, 100] },
            { t: 90, s: [100, 100] }
          ] 
        }
      },
      shapes: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [200, 150] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 20 }
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.8, 0.8, 0.8, 1] }
        }
      ]
    }
  ]
};

interface EmptyReportsAnimationProps {
  style?: ViewStyle;
  loop?: boolean;
}

const EmptyReportsAnimation: React.FC<EmptyReportsAnimationProps> = ({ style, loop = true }) => {
  return (
    <LottieView
      source={emptyReportsAnimationData}
      autoPlay
      loop={loop}
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

export default EmptyReportsAnimation;
