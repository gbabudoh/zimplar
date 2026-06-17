"use client";

import React, { useState } from "react";
import { 
  Search, 
  MoreVertical, 
  ArrowUpRight,
  Filter,
  CheckCircle2
} from "lucide-react";
import GradeSubmissionModal from "./GradeSubmissionModal";

interface Submission {
  id: string;
  studentName: string;
  courseTitle: string;
  taskTitle: string;
  fileUrl: string;
  status: string;
  grade?: string | null;
  feedback?: string | null;
  timeLabel: string;
}

interface GradingClientViewProps {
  submissions: Submission[];
}

export default function GradingClientView({ submissions }: GradingClientViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "GRADED">("ALL");
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper for avatar initials
  const getInitials = (name: string) => {
    if (!name) return "ST";
    const parts = name.trim().split(/\s+/);
    return parts.map(p => p[0]).join("").toUpperCase().slice(0, 2);
  };

  // Helper for consistent avatar colors
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-rose-100 text-rose-600",
      "bg-emerald-100 text-emerald-600",
      "bg-amber-100 text-amber-600",
      "bg-purple-100 text-purple-600",
      "bg-pink-100 text-pink-600",
    ];
    if (!name) return colors[0];
    const code = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[code % colors.length];
  };

  // Filter logic
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = 
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.taskTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === "ALL" ||
      (statusFilter === "PENDING" && sub.status === "PENDING") ||
      (statusFilter === "GRADED" && sub.status === "GRADED");

    return matchesSearch && matchesStatus;
  });

  const handleOpenGradeModal = (sub: Submission) => {
    setSelectedSub(sub);
    setIsModalOpen(true);
  };

  return (
    <>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-b border-zinc-200 py-2 pl-8 pr-4 text-sm font-medium focus:outline-none focus:border-z-red w-40 focus:w-64 transition-all placeholder-zinc-300"
            />
          </div>
          
          <div className="flex items-center bg-zinc-100/60 p-1.5 rounded-2xl border border-zinc-200/40">
            {(["ALL", "PENDING", "GRADED"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  statusFilter === status 
                    ? "bg-z-red text-white shadow-md" 
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {status === "ALL" ? "All" : status === "PENDING" ? "Pending" : "Graded"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Roster Workspace */}
      <div className="space-y-8">
        <div className="flex justify-between items-end px-2">
          <h2 className="text-2xl font-black text-z-red tracking-tight">Recent Activity</h2>
          <button className="flex items-center space-x-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b-2 border-z-red pb-1 hover:text-z-red transition-colors">
            <span>Export Reports</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        
        {filteredSubmissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 glass-card rounded-[3.5rem] border-2 border-dashed border-zinc-200/50 min-h-[300px] text-center">
            <CheckCircle2 className="w-12 h-12 text-zinc-300 mb-4" />
            <h3 className="text-xl font-black text-zinc-700">No submissions found</h3>
            <p className="text-xs text-zinc-500 font-bold mt-2">
              There are no student submissions matching the selected filters.
            </p>
          </div>
        ) : (
          <div className="glass-card rounded-[3rem] overflow-hidden premium-shadow">
            <div className="p-8 border-b border-white/40 bg-white/30">
              <div className="grid grid-cols-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-4">
                <span className="col-span-1">Learner</span>
                <span className="col-span-1">Target Course</span>
                <span className="col-span-1">Submission File</span>
                <span className="col-span-1">Status</span>
                <span className="text-right">Action</span>
              </div>
            </div>
            <div className="divide-y divide-white/20">
              {filteredSubmissions.map((sub) => (
                <div key={sub.id} className="grid grid-cols-5 items-center p-8 px-12 hover:bg-white/40 transition-all group group/row">
                  {/* Learner */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full ${getAvatarColor(sub.studentName)} flex items-center justify-center text-[10px] font-black shadow-inner`}>
                      {getInitials(sub.studentName)}
                    </div>
                    <span className="font-bold text-zinc-800 text-sm whitespace-nowrap">{sub.studentName}</span>
                  </div>

                  {/* Course */}
                  <span className="font-medium text-zinc-600 text-xs truncate pr-4">{sub.courseTitle}</span>

                  {/* File Name */}
                  <div className="flex items-center space-x-2">
                     <span className="text-zinc-500 text-xs font-medium truncate max-w-[140px]" title={sub.taskTitle}>
                       {sub.taskTitle}
                     </span>
                  </div>

                  {/* Status Tag */}
                  <div>
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      sub.status === 'GRADED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'
                    }`}>
                      {sub.status === 'GRADED' ? `Graded: ${sub.grade}` : 'Pending'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end items-center space-x-4">
                    <button 
                      onClick={() => handleOpenGradeModal(sub)}
                      className={`${sub.status === 'GRADED' ? 'bg-zinc-800' : 'bg-z-red'} text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10 hover:scale-105 active:scale-95 transition-all cursor-pointer`}
                    >
                      {sub.status === 'GRADED' ? 'View Details' : 'Grade Submission'}
                    </button>
                    <button className="text-zinc-500 hover:text-z-red transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grade Submission Modal */}
      <GradeSubmissionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submission={selectedSub}
      />
    </>
  );
}
