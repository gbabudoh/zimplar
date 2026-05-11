"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import NextImage from "next/image";
import { 
  Clock, 
  Trophy, 
  Target, 
  ArrowRight, 
  Play, 
  CalendarDays,
  Search,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";

interface UserStats {
  points: number;
  level: number;
  focusTime: number;
  currentStreak: number;
}

interface StudentDashboardProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  stats: UserStats | null;
  enrollments: {
    id: string;
    status?: string | null;
    progress?: number | null;
    course: {
      id: string;
      title: string;
      thumbnail?: string | null;
    };
  }[];
  upcomingAssessments: {
    id: string;
    title: string;
    dueDate?: Date | string | null;
  }[];
}

export default function StudentDashboardContent({ 
  user, 
  stats, 
  enrollments, 
  upcomingAssessments 
}: StudentDashboardProps) {
  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar role="STUDENT" />
      
      <main className="flex-grow p-10 lg:ml-72">
        {/* Modern Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-z-red tracking-tighter">Welcome back, {user?.name?.split(' ')[0] || 'Student'}</h1>
            <div className="flex items-center space-x-2 text-zinc-500 font-bold text-xs uppercase tracking-widest">
              <span>Personal Portal</span>
              <span className="w-1 h-1 bg-z-red rounded-full"></span>
              <span className="text-z-red">Streak: {stats?.currentStreak || 0} Days</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-z-red transition-colors" />
              <input 
                type="text" 
                placeholder="Search your library..."
                className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-2xl py-3 pl-12 pr-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-z-red/20 w-80 transition-all"
              />
            </div>
            
            <NotificationDropdown />

            <div className="flex items-center space-x-4">
               <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200 ring-2 ring-transparent hover:ring-z-red transition-all cursor-pointer">
                  {user?.image ? (
                    <NextImage src={user.image} alt="User" width={40} height={40} />
                  ) : (
                    <div className="w-full h-full bg-z-red flex items-center justify-center text-white font-black text-xs">
                      {user?.name?.[0] || 'S'}
                    </div>
                  )}
               </div>
            </div>
          </div>
        </header>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           <div className="glass-card p-8 rounded-[3rem] flex items-center space-x-6 group hover:scale-[1.03] transition-all cursor-pointer overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-z-red/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
              <div className="bg-z-red p-5 rounded-2xl text-white shadow-2xl shadow-z-red/20">
                 <Clock className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Focus Time</p>
                 <h3 className="text-3xl font-black text-z-red tracking-tighter">{((stats?.focusTime || 0) / 60).toFixed(1)} <span className="text-xs font-bold text-zinc-400">HRS</span></h3>
              </div>
           </div>
           
           <div className="glass-card p-8 rounded-[3rem] flex items-center space-x-6 group hover:scale-[1.03] transition-all cursor-pointer overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-z-gold/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
              <div className="bg-z-gold p-5 rounded-2xl text-white shadow-2xl shadow-z-gold/20">
                 <Trophy className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Total Points</p>
                 <h3 className="text-3xl font-black text-z-red tracking-tighter">{stats?.points?.toLocaleString() || 0} <span className="text-xs font-bold text-zinc-400">XP</span></h3>
              </div>
           </div>

           <div className="bg-z-red p-8 rounded-[3rem] text-white flex items-center space-x-6 group hover:scale-[1.03] transition-all shadow-2xl shadow-z-red/30 cursor-pointer overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="bg-white/20 backdrop-blur-md p-5 rounded-2xl text-white border border-white/20">
                 <Target className="w-7 h-7" />
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Level</p>
                 <h3 className="text-3xl font-black tracking-tighter">{stats?.level || 1} <span className="text-xs font-bold text-white/50">RANK</span></h3>
              </div>
           </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Active Courses */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-2xl font-black text-z-red tracking-tight">Continue Learning</h2>
               <Link href="/dashboard/student/explore" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b-2 border-z-red pb-1 hover:text-z-red transition-colors flex items-center space-x-2">
                 <span>Full Catalog</span>
                 <ArrowRight className="w-3 h-3" />
               </Link>
            </div>

            {enrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {enrollments.map((enr, i) => (
                  <Link key={enr.id} href={`/dashboard/student/courses/${enr.course.id}`} className="glass-card rounded-[3rem] overflow-hidden group cursor-pointer premium-shadow hover:translate-y-[-8px] transition-all duration-500">
                    <div className="relative h-48 w-full overflow-hidden">
                        <NextImage 
                          src={enr.course.thumbnail || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=300"} 
                          alt={enr.course.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-all flex items-center justify-center">
                           <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100">
                              <Play className="w-6 h-6 text-white fill-white" />
                           </div>
                        </div>
                        <div className="absolute top-6 left-6">
                          <span className="bg-z-red px-4 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-xl">
                            {enr.status || 'Active'}
                          </span>
                        </div>
                    </div>
                    
                    <div className="p-8 space-y-6 relative">
                        <div className="relative z-10">
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Learning Track</p>
                          <h3 className="text-2xl font-black text-z-red leading-tight tracking-tighter">{enr.course.title}</h3>
                        </div>
                        
                        <div className="space-y-4 relative z-10">
                          <div className="flex justify-between items-end">
                             <div className="space-y-1">
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter leading-none">Course ID</p>
                                <p className="text-xs font-bold text-zinc-700 truncate max-w-[150px]">{enr.course.id.substring(0, 8)}...</p>
                             </div>
                             <span className="text-xl font-black text-z-red tracking-tighter">{enr.progress || 0}%</span>
                          </div>
                          <div className="h-2 w-full bg-z-blue/10 rounded-full overflow-hidden border border-white/50">
                             <div className="h-full bg-z-red rounded-full transition-all duration-1000" style={{ width: `${enr.progress || 0}%` }}></div>
                          </div>
                        </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 rounded-[3rem] text-center space-y-4">
                 <p className="text-zinc-400 font-bold">You haven&apos;t enrolled in any courses yet.</p>
                 <Link href="/dashboard/student/explore" className="inline-block bg-z-red text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest">Explore Catalog</Link>
              </div>
            )}
          </div>

          {/* Right Column: Tests & Achievement */}
          <div className="space-y-10">
             <div className="space-y-6 px-2">
                <h2 className="text-2xl font-black text-z-red tracking-tight">Upcoming Assessments</h2>
                <div className="space-y-4">
                   {upcomingAssessments.length > 0 ? upcomingAssessments.map((test, i) => (
                     <div key={test.id} className="glass-card p-6 rounded-[2.5rem] flex items-center space-x-5 group hover:border-z-red/30 transition-all cursor-pointer relative overflow-hidden">
                        <div className="bg-z-red p-4 rounded-2xl text-white shadow-xl shadow-current/20 group-hover:rotate-12 transition-transform">
                           <CalendarDays className="w-6 h-6" />
                        </div>
                        <div className="flex-grow">
                           <h4 className="font-black text-zinc-800 text-base leading-tight tracking-tight">{test.title}</h4>
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                             {test.dueDate ? new Date(test.dueDate).toLocaleDateString() : 'No due date'}
                           </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-z-red transition-colors" />
                     </div>
                   )) : (
                    <div className="p-8 border-2 border-dashed border-zinc-200 rounded-[2.5rem] text-center">
                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">No pending tests</p>
                    </div>
                   )}
                </div>
             </div>

             {/* Achievement Card */}
             <div className="bg-z-gold p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-500">
                <div className="relative z-10 space-y-8">
                   <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[10px] font-black tracking-[0.2em] uppercase">Reward Status</span>
                   </div>
                   
                   <div>
                      <h3 className="text-4xl font-black leading-tight tracking-tighter">Level {stats?.level || 1} Achieved</h3>
                      <p className="text-white/70 font-medium mt-4 text-sm leading-relaxed">Keep learning to unlock your next <span className="text-white font-black underline decoration-2 underline-offset-4">Legendary Badge</span>.</p>
                   </div>

                   <div className="pt-2">
                      <button className="bg-white text-z-red px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition-all">View All Badges</button>
                   </div>
                </div>
                
                <Trophy className="absolute -bottom-20 -right-20 w-80 h-80 text-white/10 group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
