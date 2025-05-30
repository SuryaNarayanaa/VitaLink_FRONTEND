import { Platform, Text, StyleSheet } from "react-native";
import React from "react";

export default () => {
  if (Platform.OS !== "android") {
    return;
  }

  // @ts-expect-error
  const oldRender = Text.render ?? Text.prototype?.render;
  const style = StyleSheet.create({ font: { fontFamily: "Roboto" } });
  if (!oldRender) {
    console.log(
      "Text.render or Text.prototype.render is not defined, cannot patch font.",
    );
    return;
  }

  if (Text.prototype?.render) {
    Text.prototype.render = function (...args: any[]) {
      const origin = oldRender.call(this, ...args);
      return React.cloneElement(origin, {
        style: [style.font, origin.props.style],
      });
    };
    // @ts-expect-error
  } else if (Text.render) {
    // @ts-expect-error
    Text.render = function (...args: any[]) {
      const origin = oldRender.call(this, ...args);
      return React.cloneElement(origin, {
        style: [style.font, origin.props.style],
      });
    };
  } else {
    console.log(
      "Text.render or Text.prototype.render is not defined, cannot patch font.",
    );
  }
};