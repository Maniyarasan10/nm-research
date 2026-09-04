import { useState } from "react";
import { useMediaQuery } from "./useMediaQuery";

export type DeviceCapability = {
  isDesktop: boolean;
  isTouch: boolean;
  isLowPower: boolean;
  webgl: boolean;
};

function detectLowPower(): boolean {
  if (typeof navigator === "undefined") return false;
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  const cores = (navigator as unknown as { hardwareConcurrency?: number })
    .hardwareConcurrency;
  if (mem !== undefined && mem <= 4) return true;
  if (cores !== undefined && cores <= 4) return true;
  return false;
}

function detectWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function useDeviceCapability(): DeviceCapability {
  const isDesktop = useMediaQuery("(min-width: 900px)");
  const isTouch = useMediaQuery("(hover: none), (pointer: coarse)");
  const [lowPower] = useState(detectLowPower);
  const [webgl] = useState(detectWebgl);

  return {
    isDesktop,
    isTouch,
    isLowPower: lowPower,
    webgl,
  };
}
