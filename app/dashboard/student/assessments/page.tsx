"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  MoreVertical,
  ArrowUpRight,
  FileText,
  TrendingUp,
  Filter
} from "lucide-react";

const activeAssessments = [
  {
    id: 1,
    title: "Matrices & Linear Transformations",
    course: "Advanced Algebra & Logic",
    deadline: "Tomorrow, 23:59",
    type: "Assignment",
    status: "Pending",
    timeRemaining: "1d 4h",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    id: 2,
    title: "Quantum States Midterm",
    course: "Quantum Mechanics Intro",
    deadline: "Feb 12, 10:00 AM",
    type: "Timed Test",
    status: "Upcoming",
    timeRemaining: "5 days",
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    id: 3,
    title: "Digital Ethics Reflection",
    course: "Digital Ethics & Society",
    deadline: "Feb 15, 23:59",
    type: "Essay",
    status: "Pending",
    timeRemaining: "8 days",
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  }
];

const gradeHistory = [
  {
    id: 101,
    title: "Logic Fundamentals Quiz",
    course: "Advanced Algebra & Logic",
    grade: "A",
    percentage: 94,
    date: "Feb 01, 2026",
    status: "Completed"
  },
  {
    id: 102,
    title: "Web Structures Lab",
    course: "Web Development Fundamentals",
    grade: "B+",
    percentage: 88,
    date: "Jan 28, 2026",
    status: "Completed"
  }
];

export default function StudentAssessmentsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar />
      
      <main className="flex-grow p-12 ml-72">
        {/* Modern Header */}
        <header className="flex justify-between items-end mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-z-red tracking-tighter leading-none">Assessments</h1>
            <div className="flex items-center space-x-3 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em]">
              <span>Academic Evaluation</span>
              <span className="w-1.5 h-1.5 bg-z-red/20 rounded-full"></span>
              <span className="text-z-red/60">Performance Hub</span>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-z-red transition-all" />
              <input 
                type="text" 
                placeholder="Find assignment..."
                className="bg-transparent border-b border-zinc-200 py-2 pl-8 pr-4 text-sm font-medium focus:outline-none focus:border-z-red w-40 focus:w-64 transition-all"
              />
            </div>
            
            <button className="flex items-center space-x-3 text-zinc-400 hover:text-z-red transition-colors group">
              <Filter className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Filter Category</span>
            </button>
          </div>
        </header>

        {/* Assessment Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {[
            { label: "Overall Grade", value: "3.8 GPA", icon: <TrendingUp className="w-6 h-6" />, color: "text-z-red", bg: "bg-z-red/10" },
            { label: "Completed", value: "14 Tasks", icon: <CheckCircle2 className="w-6 h-6" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Pending Review", value: "3 Tasks", icon: <Clock className="w-6 h-6" />, color: "text-blue-500", bg: "bg-blue-500/10" },
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

        {/* Content Tabs */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex space-x-10">
               <button 
                  onClick={() => setActiveTab("active")}
                  className={`text-2xl font-black tracking-tight transition-all pb-2 border-b-4 ${activeTab === 'active' ? 'text-z-red border-z-red' : 'text-zinc-300 border-transparent hover:text-zinc-400'}`}
               >
                  Active Tasks
               </button>
               <button 
                  onClick={() => setActiveTab("history")}
                  className={`text-2xl font-black tracking-tight transition-all pb-2 border-b-4 ${activeTab === 'history' ? 'text-z-red border-z-red' : 'text-zinc-300 border-transparent hover:text-zinc-400'}`}
               >
                  Grade History
               </button>
            </div>
            
            <button className="flex items-center space-x-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b-2 border-z-red pb-1 hover:text-z-red transition-colors">
              <span>Performance Report</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {activeTab === "active" ? (
              activeAssessments.map((task) => (
                <div key={task.id} className="glass-card p-8 rounded-[3rem] group hover:scale-[1.01] transition-all duration-500 premium-shadow border border-white/40 flex items-center justify-between">
                  <div className="flex items-center space-x-8">
                    {/* Icon Block */}
                    <div className={`${task.bg} ${task.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner`}>
                      <FileText className="w-7 h-7" />
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${task.bg} ${task.color}`}>
                          {task.type}
                        </span>
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center">
                           <AlertCircle className="w-3 h-3 mr-1" />
                           Due {task.deadline}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-zinc-800 tracking-tight group-hover:text-z-red transition-colors">{task.title}</h3>
                      <p className="text-xs font-bold text-zinc-500">{task.course}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-12">
                     {/* Time Remaining */}
                     <div className="text-right hidden md:block">
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Time Left</p>
                        <p className="text-sm font-black text-zinc-800">{task.timeRemaining}</p>
                     </div>

                     {/* Actions */}
                     <div className="flex items-center space-x-4">
                        <button className="bg-z-red text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-z-red/20 hover:scale-105 active:scale-95 transition-all">
                           {task.type === 'Timed Test' ? 'Start Test' : 'Submit Work'}
                        </button>
                        <button className="p-3 text-zinc-500 hover:text-z-red transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
                </div>
              ))
            ) : (
              gradeHistory.map((history) => (
                <div key={history.id} className="glass-card p-8 rounded-[3rem] group hover:scale-[1.01] transition-all duration-500 premium-shadow border border-white/40 flex items-center justify-between">
                  <div className="flex items-center space-x-8">
                    {/* Grade Block */}
                    <div className="bg-zinc-50 w-16 h-16 rounded-[1.5rem] flex flex-col items-center justify-center shadow-inner border border-zinc-100">
                      <span className="text-2xl font-black text-z-red leading-none">{history.grade}</span>
                      <span className="text-[8px] font-black text-zinc-400 uppercase">{history.percentage}%</span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600">
                          {history.status}
                        </span>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{history.date}</span>
                      </div>
                      <h3 className="text-xl font-black text-zinc-800 tracking-tight">{history.title}</h3>
                      <p className="text-xs font-bold text-zinc-500">{history.course}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                     <button className="bg-zinc-800 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all">
                        View Feedback
                     </button>
                     <button className="p-3 text-zinc-500 hover:text-z-red transition-colors">
                        <MoreVertical className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              ))
            )}

            {/* Empty State / Help */}
            <div className="glass-card p-10 rounded-[3rem] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center p-12 group hover:border-z-red/30 transition-all">
              <ClipboardList className="w-8 h-8 text-zinc-300 group-hover:text-z-red transition-colors mb-4" />
              <p className="text-sm font-black text-zinc-400 group-hover:text-z-red transition-colors uppercase tracking-widest">More assessments will appear as courses progress</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
