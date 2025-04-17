import * as Burnt from "burnt";
import React from "react";
import { Icon } from "./CustomToastIcon";

type ToastType = "success" | "error" | "warning" | "info";
type ToastPosition = "top" | "bottom";
type ToastPreset = "done" | "error" | "none" | "custom";
type HapticFeedback = "success" | "warning" | "error" | "none";

interface ToastProps {
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
}

export const showToast = ({
  title,
  message = "",
  type = "success",
  duration = 2,
  position = "top",
}: ToastProps) => {
  // Map the toast type to the Burnt preset
  const presetMap: Record<ToastType, ToastPreset> = {
    success: "done",
    error: "error",
    warning: "custom",
    info: "custom",
  };

  // Map the toast type to the haptic feedback
  const hapticMap: Record<ToastType, HapticFeedback> = {
    success: "success",
    error: "error",
    warning: "warning",
    info: "none",
  };

  // Icon colors based on type
  const colorMap: Record<ToastType, string> = {
    success: "#22C55E", // green
    error: "#EF4444",   // red
    warning: "#F59E0B", // amber
    info: "#3B82F6",    // blue
  };

  // Icon names based on type
  const iconNameMap: Record<ToastType, string> = {
    success: "checkmark.seal",
    error: "xmark.circle",
    warning: "exclamationmark.triangle",
    info: "info.circle",
  };

  Burnt.toast({
    title,
    message,
    preset: presetMap[type],
    haptic: hapticMap[type],
    duration,
    shouldDismissByDrag: true,
    from: position,
    layout: {
      iconSize: {
        height: 24,
        width: 24,
      },
    },
    icon: {
      ios: {
        name: iconNameMap[type],
        color: colorMap[type],
      },
      web: <Icon type={type} />,
    },
  });
};