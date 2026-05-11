"use client";

import React, { useState } from "react";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  Search, 
  MoreVertical,
  ArrowUpRight,
  FileText,
  TrendingUp,
  Filter,
  AlertCircle
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  course: string;
  deadline: string;
  type: string;
  status: string;
  timeRemaining: string;
  color: string;
  bg: string;
}

interface GradeHistory {
  id: string;
  title: string;
  course: string;
  grade: string;
  percentage: number;
  date: string;
  status: string;
}

interface Stats {
  gpa: string;
  completed: number;
  pending: number;
}

export default function AssessmentsClient({ 
  initialActive, 
  initialHistory, 
  stats 
}: { 
  initialActive: Task[], 
  initialHistory: GradeHistory[], 
  stats: Stats 
}) {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActive = initialActive.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHistory = initialHistory.filter(h => 
    h.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Modern Header */}
      <header className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-16 gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-z-red tracking-tighter leading-none">Assessments</h1>
          <div className="flex items-center space-x-3 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em]">
            <span>Academic Evaluation</span>
            <span className="w-1.5 h-1.5 bg-z-red/20 rounded-full"></span>
            <span className="text-z-red/60">Performance Hub</span>
          </div>
        </div>

        <div className="flex items-center space-x-8">
          <div className="relative group w-full lg:w-auto">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-z-red transition-all" />
            <input 
              type="text" 
              placeholder="Find assignment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-b border-zinc-200 py-2 pl-8 pr-4 text-sm font-medium focus:outline-none focus:border-z-red w-full lg:w-40 lg:focus:w-64 transition-all"
            />
          </div>
          
          <button className="flex items-center space-x-3 text-zinc-400 hover:text-z-red transition-colors group">
            <Filter className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Filter</span>
          </button>
        </div>
      </header>

      {/* Assessment Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
        {[
          { label: "Overall Grade", value: `${stats.gpa} GPA`, icon: <TrendingUp className="w-6 h-6" />, color: "text-z-red", bg: "bg-z-red/10" },
          { label: "Completed", value: `${stats.completed} Tasks`, icon: <CheckCircle2 className="w-6 h-6" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Pending", value: `${stats.pending} Tasks`, icon: <Clock className="w-6 h-6" />, color: "text-blue-500", bg: "bg-blue-500/10" },
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
            filteredActive.length === 0 ? (
              <EmptyState message="No active assessments found" />
            ) : (
              filteredActive.map((task) => (
                <div key={task.id} className="glass-card p-8 rounded-[3rem] group hover:scale-[1.01] transition-all duration-500 premium-shadow border border-white/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center space-x-8">
                    <div className={`${task.bg} ${task.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner`}>
                      <FileText className="w-7 h-7" />
                    </div>

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

                  <div className="flex items-center justify-between md:justify-end md:space-x-12">
                     <div className="text-right">
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Time Left</p>
                        <p className="text-sm font-black text-zinc-800">{task.timeRemaining}</p>
                     </div>

                     <div className="flex items-center space-x-4">
                        <button className="bg-z-red text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-z-red/20 hover:scale-105 active:scale-95 transition-all">
                           {task.status === 'Submitted' ? 'Update Work' : 'Start / Submit'}
                        </button>
                        <button className="p-3 text-zinc-500 hover:text-z-red transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
                </div>
              ))
            )
          ) : (
            filteredHistory.length === 0 ? (
              <EmptyState message="No grade history found" />
            ) : (
              filteredHistory.map((history) => (
                <div key={history.id} className="glass-card p-8 rounded-[3rem] group hover:scale-[1.01] transition-all duration-500 premium-shadow border border-white/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center space-x-8">
                    <div className="bg-zinc-50 w-16 h-16 rounded-[1.5rem] flex flex-col items-center justify-center shadow-inner border border-zinc-100">
                      <span className="text-2xl font-black text-z-red leading-none">{history.grade}</span>
                      <span className="text-[8px] font-black text-zinc-400 uppercase">{history.percentage}%</span>
                    </div>

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

                  <div className="flex items-center justify-end space-x-6">
                     <button className="bg-zinc-800 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all">
                        View Feedback
                     </button>
                     <button className="p-3 text-zinc-500 hover:text-z-red transition-colors">
                        <MoreVertical className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              ))
            )
          )}

          {/* Help State */}
          <div className="glass-card p-10 rounded-[3rem] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center group hover:border-z-red/30 transition-all">
            <ClipboardList className="w-8 h-8 text-zinc-300 group-hover:text-z-red transition-colors mb-4" />
            <p className="text-sm font-black text-zinc-400 group-hover:text-z-red transition-colors uppercase tracking-widest text-center">New assessments will appear automatically</p>
          </div>
        </div>
      </div>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-20 text-center space-y-6 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-dashed border-zinc-200">
       <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
          <Search className="w-10 h-10 text-zinc-300" />
       </div>
       <div className="space-y-2">
          <h3 className="text-xl font-black text-zinc-800">{message}</h3>
          <p className="text-zinc-500 font-medium">Everything looks up to date for now!</p>
       </div>
    </div>
  );
}
