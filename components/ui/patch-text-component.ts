// patchTextRender.ts
import { Platform, Text, StyleSheet } from 'react-native';
import React from 'react';

export default () => {
  if (Platform.OS !== 'android') return;

  const style = StyleSheet.create({
    font: { fontFamily: 'Roboto' },
  });

  const oldRender =
    // @ts-ignore
    Text.render || Text.prototype?.render;

  if (!oldRender) {
    console.log('No render method found on Text component.');
    return;
  }

  // Patch Text.prototype.render
  if (Text.prototype?.render) {
    // @ts-ignore
    Text.prototype.render = function (...args: any[]) {
      const origin = oldRender.call(this, ...args);
      return React.cloneElement(origin, {
        style: [style.font, origin.props?.style],
        textBreakStrategy: 'simple',
      });
    };
  } else {
    // fallback patching for .render directly
    // @ts-ignore
    Text.render = function (...args: any[]) {
      const origin = oldRender.call(this, ...args);
      return React.cloneElement(origin, {
        style: [style.font, origin.props?.style],
        textBreakStrategy: 'simple',
      });
    };
  }
};
