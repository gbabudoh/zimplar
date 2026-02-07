"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Link from "next/link";
import { 
  Video, 
  Search, 
  MoreVertical, 
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles
} from "lucide-react";

const classrooms = [
  {
    id: "logic-a",
    name: "Room Logic-A",
    course: "Advanced Algebra & Logic",
    students: 42,
    active: true,
    startTime: "14:00 PM",
    instructor: "Dr. Kwame Mensah",
    avatar: "KM"
  },
  {
    id: "quantum-1",
    name: "Quantum Lab 01",
    course: "Quantum Mechanics Intro",
    students: 28,
    active: false,
    startTime: "09:00 AM",
    instructor: "Eng. Chidi Obi",
    avatar: "CO"
  }
];

export default function StudentClassroomPortal() {
  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar />
      
      <main className="flex-grow p-12 ml-72">
        {/* Modern Header */}
        <header className="flex justify-between items-end mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-z-red tracking-tighter leading-none">Classrooms</h1>
            <div className="flex items-center space-x-3 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em]">
              <span>Active Learning Rooms</span>
              <span className="w-1.5 h-1.5 bg-z-red/20 rounded-full"></span>
              <span className="text-z-red/60">Live Hub</span>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-z-red transition-all" />
              <input 
                type="text" 
                placeholder="Search rooms..."
                className="bg-transparent border-b border-zinc-200 py-2 pl-8 pr-4 text-sm font-medium focus:outline-none focus:border-z-red w-40 focus:w-64 transition-all"
              />
            </div>
            
            <button className="flex items-center space-x-2 text-zinc-400 hover:text-z-red transition-colors group">
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Room History</span>
            </button>
          </div>
        </header>

        {/* Attendance & Engagement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {[
            { label: "Hours Attended", value: "84h", icon: <Clock className="w-6 h-6" />, color: "text-z-red", bg: "bg-z-red/10" },
            { label: "Active Streak", value: "12 Days", icon: <Sparkles className="w-6 h-6" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Missed Sessions", value: "2", icon: <AlertCircle className="w-6 h-6" />, color: "text-amber-500", bg: "bg-amber-500/10" },
          ].map((stat, i) => (
             <div key={i} className="glass-card p-8 rounded-[2.5rem] flex items-center space-x-6 group hover:translate-y-[-4px] transition-all duration-500 premium-shadow">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl shadow-sm`}>
                   {stat.icon}
                </div>
                <div>
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                   <h3 className="text-2xl font-black text-zinc-800 tracking-tight">{stat.value}</h3>
                </div>
             </div>
          ))}
        </div>

        {/* Classroom Grid */}
        <div className="space-y-8">
          <div className="flex justify-between items-end px-2">
            <h2 className="text-2xl font-black text-z-red tracking-tight">Active Schedule</h2>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Showing classrooms for today</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {classrooms.map((room) => (
              <div key={room.id} className="glass-card p-10 rounded-[3rem] group hover:translate-y-[-4px] transition-all duration-500 premium-shadow relative overflow-hidden flex flex-col justify-between min-h-[380px]">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                     <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border ${room.active ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-zinc-100 border-zinc-200 text-zinc-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${room.active ? 'bg-green-500 animate-pulse' : 'bg-zinc-300'}`}></span>
                        <span className="text-[10px] font-black tracking-widest uppercase">{room.active ? 'Live Now' : 'Standby'}</span>
                     </div>
                     <button className="text-zinc-500 hover:text-z-red transition-colors p-2">
                        <MoreVertical className="w-5 h-5" />
                     </button>
                  </div>

                  <div className="space-y-2 mb-8">
                     <h3 className="text-3xl font-black text-zinc-800 tracking-tighter leading-tight group-hover:text-z-red transition-colors">{room.name}</h3>
                     <p className="text-sm font-bold text-zinc-500">{room.course}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-100/50">
                     <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-z-red/10 text-z-red flex items-center justify-center font-black text-xs">
                           {room.avatar}
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-zinc-400 uppercase leading-none mb-1">Instructor</p>
                           <p className="text-xs font-black text-zinc-800">{room.instructor}</p>
                        </div>
                     </div>
                     <div className="flex items-center space-x-4">
                        <div className="bg-zinc-50 p-3 rounded-2xl text-zinc-400">
                           <Clock className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-zinc-400 uppercase leading-none mb-1">Start Time</p>
                           <p className="text-xs font-black text-zinc-800">{room.startTime}</p>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="pt-8 relative z-10">
                   {room.active ? (
                     <Link href={`/classroom/${room.avatar.toLowerCase()}`}>
                        <button className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 bg-z-red text-white shadow-xl shadow-z-red/20 hover:scale-[1.02] cursor-pointer">
                           <Video className="w-4 h-4" />
                           <span>Join Classroom</span>
                        </button>
                     </Link>
                   ) : (
                     <button className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 bg-zinc-100 text-zinc-400 cursor-not-allowed">
                        <span>Wait for Schedule</span>
                     </button>
                   )}
                </div>

                {/* Subtle background icon */}
                <Video className="absolute -bottom-10 -right-10 w-48 h-48 text-zinc-500/5 group-hover:text-z-red/5 transition-colors duration-1000 rotate-12" />
              </div>
            ))}

            {/* Support / Help Card */}
            <div className="glass-card rounded-[3rem] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center p-12 group hover:border-z-red/30 hover:bg-z-red/[0.02] transition-all duration-500">
               <div className="bg-zinc-50 p-6 rounded-[2rem] text-zinc-300 group-hover:text-z-red group-hover:bg-z-red/5 transition-all mb-6">
                  <ShieldCheck className="w-10 h-10" />
               </div>
               <h4 className="text-xl font-black text-zinc-400 group-hover:text-z-red transition-colors tracking-tight">Need Support?</h4>
               <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mt-2 text-center max-w-[200px]">Contact Admin if you are unable to access your assigned rooms.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Minimal AlertCircle helper for the stats
function AlertCircle({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}
