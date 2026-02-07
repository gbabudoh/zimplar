"use client";

import React from "react";
import { useDataUsage } from "@/hooks/useDataUsage";
import { Wifi, Info } from "lucide-react";

interface DataCounterProps {
  isLive: boolean;
}

export default function DataCounter({ isLive }: DataCounterProps) {
  const { mb, costEstimate } = useDataUsage(isLive);

  if (!isLive) return null;

  return (
    <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl z-50 text-white min-w-[160px] animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Live Session</span>
        </div>
        <Wifi className="w-4 h-4 opacity-50" />
      </div>
      
      <div className="space-y-0.5">
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-black">{mb}</span>
          <span className="text-xs font-bold opacity-60 uppercase">MB</span>
        </div>
        <div className="flex items-center justify-between group">
          <p className="text-[10px] font-bold text-white/50 italic">Est. Cost: ${costEstimate}</p>
          <div className="relative">
            <Info className="w-3 h-3 opacity-30 cursor-help" />
            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-black/90 backdrop-blur-md rounded-lg text-[8px] font-medium leading-tight opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Estimated based on standard bandwidth usage and average carrier rates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
