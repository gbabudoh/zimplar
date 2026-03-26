"use client";

import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import DataCounter from "./DataCounter";

interface VODPlayerProps {
  url: string;
  onReady?: () => void;
}

const VODPlayer: React.FC<VODPlayerProps> = ({ url, onReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported() && (url.endsWith(".m3u8") || url.includes("m3u8"))) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (onReady) onReady();
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = url;
      video.addEventListener("loadedmetadata", () => {
        if (onReady) onReady();
      });
    } else {
      // Standard MP4
      video.src = url;
      video.addEventListener("loadeddata", () => {
        if (onReady) onReady();
      });
    }
  }, [url, onReady]);

  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-black border-4 border-white relative group">
      <video
        ref={videoRef}
        controls
        className="w-full h-full object-contain"
        poster="/api/placeholder/800/600"
      />
      
      {/* Data Usage Overlay (Still relevant for VOD) */}
      <DataCounter isLive={false} />
    </div>
  );
};

export default VODPlayer;
