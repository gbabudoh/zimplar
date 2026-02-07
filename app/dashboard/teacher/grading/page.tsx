"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  Search, 
  MoreVertical, 
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";

const submissions = [
  {
    id: 1,
    student: "Musa Ibrahim",
    course: "Advanced Algebra 101",
    submission: "Logic HW Sets",
    status: "Pending",
    time: "12m ago",
    initial: "MI",
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: 2,
    student: "Fatima Yusuf",
    course: "Quantum Intro",
    submission: "Quantum States Essay",
    status: "Graded",
    time: "1h ago",
    initial: "FY",
    color: "bg-rose-100 text-rose-600",
    grade: "A+"
  },
  {
    id: 3,
    student: "Kofi Annan",
    course: "Digital Ethics",
    submission: "Weekly Reflection",
    status: "Late",
    time: "3h ago",
    initial: "KA",
    color: "bg-gold-100 text-gold-600"
  },
  {
    id: 4,
    student: "Nia Long",
    course: "Visual Arts",
    submission: "Portfolio Draft",
    status: "Graded",
    time: "Yesterday",
    initial: "NL",
    color: "bg-emerald-100 text-emerald-600",
    grade: "B"
  }
];

export default function TeacherGradingPage() {
  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar />
      
      <main className="flex-grow p-12 ml-72">
        {/* Minimalist Modern Header */}
        <header className="flex justify-between items-end mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-z-red tracking-tighter leading-none">Grading</h1>
            <div className="flex items-center space-x-3 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em]">
              <span>Submission Roster</span>
              <span className="w-1.5 h-1.5 bg-z-red/20 rounded-full"></span>
              <span className="text-z-red/60">Performance Tracking</span>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-z-red transition-all" />
              <input 
                type="text" 
                placeholder="Search submissions..."
                className="bg-transparent border-b border-zinc-200 py-2 pl-8 pr-4 text-sm font-medium focus:outline-none focus:border-z-red w-40 focus:w-64 transition-all"
              />
            </div>
            
            <button className="flex items-center space-x-2 text-zinc-400 hover:text-z-red transition-colors group">
              <Filter className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Filter Status</span>
            </button>
          </div>
        </header>

        {/* Grading Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {[
            { label: "Pending Review", value: "24", icon: <Clock className="w-6 h-6" />, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Completion Rate", value: "92%", icon: <CheckCircle2 className="w-6 h-6" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Late Submissions", value: "3", icon: <AlertCircle className="w-6 h-6" />, color: "text-amber-500", bg: "bg-amber-500/10" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-8 rounded-[2.5rem] flex items-center space-x-6 group hover:translate-y-[-4px] transition-all duration-500 premium-shadow">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl shadow-sm`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-zinc-800 tracking-tight">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Main Roster Workspace */}
        <div className="space-y-8">
          <div className="flex justify-between items-end px-2">
            <h2 className="text-2xl font-black text-z-red tracking-tight">Recent Activity</h2>
            <button className="flex items-center space-x-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b-2 border-z-red pb-1 hover:text-z-red transition-colors">
              <span>Export Reports</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="glass-card rounded-[3rem] overflow-hidden premium-shadow">
            <div className="p-8 border-b border-white/40 bg-white/30">
              <div className="grid grid-cols-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-4">
                <span className="col-span-1">Learner</span>
                <span className="col-span-1">Target Module</span>
                <span className="col-span-1">Submission File</span>
                <span className="col-span-1">Status</span>
                <span className="text-right">Action</span>
              </div>
            </div>
            <div className="divide-y divide-white/20">
              {submissions.map((sub) => (
                <div key={sub.id} className="grid grid-cols-5 items-center p-8 px-12 hover:bg-white/40 transition-all group group/row">
                  {/* Learner */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full ${sub.color} flex items-center justify-center text-[10px] font-black shadow-inner`}>
                      {sub.initial}
                    </div>
                    <span className="font-bold text-zinc-800 text-sm whitespace-nowrap">{sub.student}</span>
                  </div>

                  {/* Module */}
                  <span className="font-medium text-zinc-600 text-xs truncate pr-4">{sub.course}</span>

                  {/* File Name */}
                  <div className="flex items-center space-x-2">
                     <span className="text-zinc-500 text-xs font-medium truncate max-w-[140px]">{sub.submission}</span>
                  </div>

                  {/* Status Tag */}
                  <div>
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      sub.status === 'Graded' ? 'bg-emerald-500/10 text-emerald-600' :
                      sub.status === 'Pending' ? 'bg-blue-500/10 text-blue-600' :
                      'bg-amber-500/10 text-amber-600'
                    }`}>
                      {sub.status === 'Graded' ? `Graded: ${sub.grade}` : sub.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end items-center space-x-4">
                    <button className={`${sub.status === 'Graded' ? 'bg-zinc-800' : 'bg-z-red'} text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10 hover:scale-105 active:scale-95 transition-all`}>
                      {sub.status === 'Graded' ? 'View Details' : 'Grade Submission'}
                    </button>
                    <button className="text-zinc-500 hover:text-z-red transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
