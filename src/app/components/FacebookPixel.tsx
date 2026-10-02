"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type FacebookQueue = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: FacebookQueue;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: FacebookQueue;
    _fbq?: FacebookQueue;
  }
}

const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export default function FacebookPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pixelId) return;

    if (!window.fbq) {
      const fbq = ((...args: unknown[]) => {
        if (fbq.callMethod) {
          fbq.callMethod(...args);
        } else {
          fbq.queue.push(args);
        }
      }) as FacebookQueue;

      fbq.queue = [];
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      window.fbq = window._fbq = fbq;

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);
    }

    window.fbq("init", pixelId);
  }, []);

  useEffect(() => {
    if (!pixelId) return;
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
