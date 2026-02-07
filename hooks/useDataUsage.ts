"use client";

import { useState, useEffect } from "react";

/**
 * useDataUsage Hook
 * Calculates estimated data usage based on typical bitrates.
 * @param isActive - Whether the tracking is currently active (e.g., in a live meeting)
 */
export function useDataUsage(isActive: boolean) {
  const [megabytesUsed, setMegabytesUsed] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    // Standard Jitsi 360p/480p + Audio approx. 0.6 Mbps = 0.075 MB per second
    const MB_PER_SECOND = 0.075; 

    const interval = setInterval(() => {
      setMegabytesUsed((prev) => prev + MB_PER_SECOND);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  return {
    mb: megabytesUsed.toFixed(2),
    costEstimate: (megabytesUsed * 0.01).toFixed(2) // Example: $0.01 per MB (standard in many regions)
  };
}
