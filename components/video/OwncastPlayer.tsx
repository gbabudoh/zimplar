"use client";

import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import DataCounter from "./DataCounter";
import { Play, Volume2, Maximize2, Settings } from "lucide-react";

interface OwncastPlayerProps {
  streamUrl?: string; // e.g., http://149.102.155.247:8082/hls/stream.m3u8
  onReady?: () => void;
}

const OwncastPlayer: React.FC<OwncastPlayerProps> = ({ 
  streamUrl = "http://149.102.155.247:8082/hls/stream.m3u8", 
  onReady 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (onReady) onReady();
        });
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = streamUrl;
        videoRef.current.addEventListener("loadedmetadata", () => {
          if (onReady) onReady();
        });
      }
    }
  }, [streamUrl, onReady]);

  return (
    <div className="w-full h-[600px] rounded-[3rem] overflow-hidden shadow-2xl bg-black relative group border-4 border-white/10 ring-1 ring-white/5">
      <video 
        ref={videoRef} 
        className="w-full h-full object-cover" 
        controls={false}
        autoPlay
        muted
      />

      {/* Modern Player UI Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
         <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
               <button className="bg-z-red p-4 rounded-2xl text-white shadow-xl shadow-z-red/20 hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-white" />
               </button>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Live Stream</p>
                  <h4 className="text-xl font-black text-white tracking-tight">Main Lecture Broadcast</h4>
               </div>
            </div>

            <div className="flex items-center space-x-4">
               <button className="p-3 text-white/60 hover:text-white transition-colors">
                  <Volume2 className="w-5 h-5" />
               </button>
               <button className="p-3 text-white/60 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
               </button>
               <button className="p-3 text-white/60 hover:text-white transition-colors">
                  <Maximize2 className="w-5 h-5" />
               </button>
            </div>
         </div>
         
         {/* Custom Progress Bar (Static for Live) */}
         <div className="mt-8 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-full bg-z-red animate-pulse"></div>
         </div>
      </div>

      {/* Live Badge */}
      <div className="absolute top-8 left-8 flex items-center space-x-2 bg-z-red px-4 py-1.5 rounded-full shadow-2xl border border-white/20">
         <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
         <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Broadcast</span>
      </div>

      {/* Data Usage Overlay */}
      <div className="absolute top-8 right-8">
         <DataCounter isLive={true} />
      </div>
    </div>
  );
};

export default OwncastPlayer;
