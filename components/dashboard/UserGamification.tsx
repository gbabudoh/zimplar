"use client";

import React, { useEffect, useState } from "react";
import { Flame, Trophy, Zap, Loader2 } from "lucide-react";
import { getGamificationStats, updateUserStreak } from "@/actions/gamification";

interface UserStats {
  points: number;
  level: number;
  currentStreak: number;
}

export default function UserGamification() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      // First, update the streak for the day
      await updateUserStreak();
      // Then fetch the latest stats
      const data = await getGamificationStats();
      setStats(data);
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-zinc-50 rounded-[2rem] border border-zinc-100 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-zinc-300 animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const xpToNextLevel = 1000;
  const currentXP = stats.points % xpToNextLevel;
  const progress = (currentXP / xpToNextLevel) * 100;

  return (
    <div className="p-5 bg-gradient-to-br from-zinc-900 to-black rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-z-red/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10 space-y-4">
        {/* Header: Level & Streak */}
        <div className="flex items-center justify-between">
           <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-z-red flex items-center justify-center shadow-lg shadow-z-red/20">
                 <Trophy className="w-4 h-4 text-white" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Level</p>
                 <p className="text-sm font-black text-white">{stats.level}</p>
              </div>
           </div>

           <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
              <Flame className={`w-3.5 h-3.5 ${stats.currentStreak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-zinc-500'}`} />
              <span className="text-[10px] font-black text-white">{stats.currentStreak}</span>
           </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-1.5">
           <div className="flex items-center justify-between px-1">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">XP Progress</span>
              <span className="text-[9px] font-black text-z-red uppercase tracking-widest">{currentXP} / {xpToNextLevel}</span>
           </div>
           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-z-red to-rose-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                style={{ width: `${progress}%` }}
              ></div>
           </div>
        </div>

        {/* Footer Hint */}
        <div className="flex items-center space-x-2 pt-1">
           <Zap className="w-3 h-3 text-amber-400" />
           <p className="text-[8px] font-bold text-white/30 uppercase tracking-tight">Finish a lesson to earn +50 XP</p>
        </div>
      </div>
    </div>
  );
}
