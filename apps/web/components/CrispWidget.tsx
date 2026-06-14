"use client";

import { useEffect } from "react";

// Extend window with Crisp globals
declare global {
  interface Window {
    $crisp: unknown[];
    CRISP_WEBSITE_ID: string;
  }
}

/**
 * Crisp Live-Chat Widget
 *
 * Wird nur geladen wenn NEXT_PUBLIC_CRISP_WEBSITE_ID gesetzt ist.
 * Account anlegen: https://app.crisp.chat → Settings → Website → Copy Website ID
 */
export default function CrispWidget() {
  const websiteId = process.env["NEXT_PUBLIC_CRISP_WEBSITE_ID"];

  useEffect(() => {
    if (!websiteId) return;

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = websiteId;

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Clean up on unmount (z.B. HMR in dev)
      document.head.removeChild(script);
    };
  }, [websiteId]);

  return null;
}
