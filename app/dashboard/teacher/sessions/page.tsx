"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Link from "next/link";
import { 
  Plus, 
  Clock, 
  Video, 
  Search, 
  MoreVertical,
  ArrowUpRight,
  Users,
  Bell
} from "lucide-react";

const sessions = [
  {
    id: 1,
    title: "Linear Algebra: Matrices & Vectors",
    course: "Advanced Algebra & Logic",
    time: "14:00 PM - 15:30 PM",
    date: "Today",
    students: 42,
    status: "Live",
    avatar: "LA"
  },
  {
    id: 2,
    title: "Quantum Entanglement Workshop",
    course: "Quantum Mechanics Intro",
    time: "09:00 AM - 10:30 AM",
    date: "Tomorrow",
    students: 28,
    status: "Scheduled",
    avatar: "QE"
  },
  {
    id: 3,
    title: "Digital Ethics: Case Studies",
    course: "Digital Ethics & Society",
    time: "11:00 AM - 12:30 PM",
    date: "Feb 10, 2026",
    students: 56,
    status: "Scheduled",
    avatar: "DE"
  }
];

export default function TeacherSessionsPage() {
  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar />
      
      <main className="flex-grow p-12 ml-72">
        {/* Minimalist Modern Header */}
        <header className="flex justify-between items-end mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-z-red tracking-tighter leading-none">Sessions</h1>
            <div className="flex items-center space-x-3 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em]">
              <span>Live Learning Hub</span>
              <span className="w-1.5 h-1.5 bg-z-red/20 rounded-full"></span>
              <span className="text-z-red/60">Schedule Control</span>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-z-red transition-all" />
              <input 
                type="text" 
                placeholder="Search schedule..."
                className="bg-transparent border-b border-zinc-200 py-2 pl-8 pr-4 text-sm font-medium focus:outline-none focus:border-z-red w-40 focus:w-64 transition-all"
              />
            </div>
            
            <button className="flex items-center space-x-3 bg-z-red text-white pr-6 pl-5 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] hover:bg-z-red/90 transition-all shadow-2xl shadow-z-red/20 group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>Schedule Session</span>
            </button>
          </div>
        </header>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {[
            { label: "Today's Classes", value: "3 Sessions", icon: <Video className="w-6 h-6" />, color: "text-z-red", bg: "bg-z-red/10" },
            { label: "Total Students", value: "126", icon: <Users className="w-6 h-6" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Upcoming Alerts", value: "2 reminders", icon: <Bell className="w-6 h-6" />, color: "text-blue-500", bg: "bg-blue-500/10" },
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

        {/* Sessions Schedule */}
        <div className="space-y-8">
          <div className="flex justify-between items-end px-2">
            <h2 className="text-2xl font-black text-z-red tracking-tight">Active Schedule</h2>
            <button className="flex items-center space-x-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b-2 border-z-red pb-1 hover:text-z-red transition-colors">
              <span>View Full Calendar</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {sessions.map((session) => (
              <div key={session.id} className="glass-card p-8 rounded-[2.5rem] group hover:scale-[1.01] transition-all duration-500 premium-shadow border border-white/40 flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  {/* Status Indicator */}
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-xl font-black shadow-inner ${session.status === 'Live' ? 'bg-z-red text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                      {session.avatar}
                    </div>
                    {session.status === 'Live' && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full animate-pulse"></span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${session.status === 'Live' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
                        {session.status}
                      </span>
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{session.date}</span>
                    </div>
                    <h3 className="text-xl font-black text-zinc-800 tracking-tight group-hover:text-z-red transition-colors">{session.title}</h3>
                    <p className="text-xs font-bold text-zinc-500">{session.course}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-12">
                   {/* Time & Students */}
                   <div className="flex space-x-8 text-right hidden md:flex">
                      <div className="space-y-1">
                         <div className="flex items-center justify-end space-x-2 text-zinc-400">
                            <Clock className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Time</span>
                         </div>
                         <p className="text-xs font-black text-zinc-700">{session.time}</p>
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center justify-end space-x-2 text-zinc-400">
                            <Users className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Enrolled</span>
                         </div>
                         <p className="text-xs font-black text-zinc-700">{session.students} Students</p>
                      </div>
                   </div>

                   {/* Actions */}
                   <div className="flex items-center space-x-4">
                      {session.status === 'Live' ? (
                        <Link href={`/classroom/${session.avatar.toLowerCase()}`}>
                          <button className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all bg-z-red text-white shadow-xl shadow-z-red/20 hover:scale-105 cursor-pointer">
                            Enter Room
                          </button>
                        </Link>
                      ) : (
                        <button 
                          onClick={() => alert(`Starting Session: ${session.title}... Status updated to LIVE.`)}
                          className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all bg-white border border-zinc-200 text-zinc-600 hover:border-z-red hover:text-z-red shadow-sm cursor-pointer"
                        >
                          Start Session
                        </button>
                      )}
                      <button className="p-3 text-zinc-500 hover:text-z-red transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                   </div>
                </div>
              </div>
            ))}

            {/* Empty State / Add New */}
            <div className="glass-card p-8 rounded-[2.5rem] border-2 border-dashed border-zinc-200 flex items-center justify-center group hover:border-z-red/30 hover:bg-z-red/[0.02] transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center group-hover:bg-z-red/5 transition-colors">
                  <Plus className="w-5 h-5 text-zinc-300 group-hover:text-z-red" />
                </div>
                <span className="text-sm font-black text-zinc-400 group-hover:text-z-red transition-colors uppercase tracking-widest">Schedule Next Session</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
