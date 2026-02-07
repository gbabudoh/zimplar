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
  Bell,
  ChevronRight,
  Sparkles
} from "lucide-react";

const myCourses = [
  {
    title: "Advanced Algebra & Logic",
    instructor: "Dr. Kwame Mensah",
    progress: 65,
    nextLesson: "Module 4: Quadratic Equations",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=300",
    color: "bg-z-red",
    bgFade: "from-z-red/10"
  },
  {
    title: "Web Development Fundamentals",
    instructor: "Eng. Chidi Obi",
    progress: 30,
    nextLesson: "Lesson 7: CSS Flexbox",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=300",
    color: "bg-z-blue",
    bgFade: "from-z-blue/10"
  }
];

export default function StudentDashboard() {
  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar />
      
      <main className="flex-grow p-10 ml-72">
        {/* Modern Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-z-red tracking-tighter">My Learning</h1>
            <div className="flex items-center space-x-2 text-zinc-500 font-bold text-xs uppercase tracking-widest">
              <span>Personal Portal</span>
              <span className="w-1 h-1 bg-z-red rounded-full"></span>
              <span className="text-z-red">Goal: 4h/Day</span>
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
            
            <button className="relative p-3 bg-white/50 backdrop-blur-xl rounded-2xl border border-white/40 text-z-red hover:scale-110 transition-all shadow-xl shadow-z-red/5">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-z-red rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200 ring-2 ring-transparent hover:ring-z-red transition-all cursor-pointer">
                    <NextImage src={`https://i.pravatar.cc/150?u=${i+20}`} alt="User" width={40} height={40} />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none">Global Pulse</p>
                <p className="text-[10px] font-black text-z-red tracking-tighter">1.2k Live Now</p>
              </div>
            </div>
          </div>
        </header>

        {/* Learning Stats - Student Edition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           <div className="glass-card p-8 rounded-[3rem] flex items-center space-x-6 group hover:scale-[1.03] transition-all cursor-pointer overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-z-red/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
              <div className="bg-z-red p-5 rounded-2xl text-white shadow-2xl shadow-z-red/20">
                 <Clock className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Focus Time</p>
                 <h3 className="text-3xl font-black text-z-red tracking-tighter">24.5 <span className="text-xs font-bold text-zinc-400">HRS</span></h3>
              </div>
           </div>
           
           <div className="glass-card p-8 rounded-[3rem] flex items-center space-x-6 group hover:scale-[1.03] transition-all cursor-pointer overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-z-gold/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
              <div className="bg-z-gold p-5 rounded-2xl text-white shadow-2xl shadow-z-gold/20">
                 <Trophy className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Total Points</p>
                 <h3 className="text-3xl font-black text-z-red tracking-tighter">1,450 <span className="text-xs font-bold text-zinc-400">XP</span></h3>
              </div>
           </div>

           <div className="bg-z-red p-8 rounded-[3rem] text-white flex items-center space-x-6 group hover:scale-[1.03] transition-all shadow-2xl shadow-z-red/30 cursor-pointer overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="bg-white/20 backdrop-blur-md p-5 rounded-2xl text-white border border-white/20">
                 <Target className="w-7 h-7" />
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Courses Left</p>
                 <h3 className="text-3xl font-black tracking-tighter">2 <span className="text-xs font-bold text-white/50">LEVELS</span></h3>
              </div>
           </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Active Courses */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-2xl font-black text-z-red tracking-tight">Continue Learning</h2>
               <button className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b-2 border-z-red pb-1 hover:text-z-red transition-colors flex items-center space-x-2">
                 <span>Full Catalog</span>
                 <ArrowRight className="w-3 h-3" />
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {myCourses.map((course, i) => (
                <div key={i} className="glass-card rounded-[3rem] overflow-hidden group cursor-pointer premium-shadow hover:translate-y-[-8px] transition-all duration-500">
                   <div className="relative h-48 w-full overflow-hidden">
                      <NextImage src={course.image} alt={course.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-all flex items-center justify-center">
                         <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100">
                            <Play className="w-6 h-6 text-white fill-white" />
                         </div>
                      </div>
                      <div className="absolute top-6 left-6">
                        <span className={`${course.color} px-4 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-xl`}>
                          Active
                        </span>
                      </div>
                   </div>
                   
                   <div className="p-8 space-y-6 relative">
                      <div className={`absolute -right-4 -bottom-4 w-32 h-32 bg-gradient-to-br ${course.bgFade} to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                      
                      <div className="relative z-10">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Dr. Kwame Mensah</p>
                        <h3 className="text-2xl font-black text-z-red leading-tight tracking-tighter">{course.title}</h3>
                      </div>
                      
                      <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-end">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter leading-none">Up Next</p>
                              <p className="text-xs font-bold text-zinc-700 truncate max-w-[150px]">{course.nextLesson}</p>
                           </div>
                           <span className="text-xl font-black text-z-red tracking-tighter">{course.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-z-blue/10 rounded-full overflow-hidden border border-white/50">
                           <div className={`h-full ${i === 0 ? 'bg-z-red' : 'bg-z-blue'} rounded-full transition-all duration-1000`} style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Tests & Achievement */}
          <div className="space-y-10">
             <div className="space-y-6 px-2">
                <h2 className="text-2xl font-black text-z-red tracking-tight">Upcoming Tests</h2>
                <div className="space-y-4">
                   {[
                     { title: "Algebra Mid-Term", date: "Tomorrow, 10:00 AM", color: "bg-z-red" },
                     { title: "Business Ethics Quiz", date: "Fri, 14 Feb", color: "bg-z-gold" },
                   ].map((test, i) => (
                     <div key={i} className="glass-card p-6 rounded-[2.5rem] flex items-center space-x-5 group hover:border-z-red/30 transition-all cursor-pointer relative overflow-hidden">
                        <div className={`${test.color} p-4 rounded-2xl text-white shadow-xl shadow-current/20 group-hover:rotate-12 transition-transform`}>
                           <CalendarDays className="w-6 h-6" />
                        </div>
                        <div className="flex-grow">
                           <h4 className="font-black text-zinc-800 text-base leading-tight tracking-tight">{test.title}</h4>
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">{test.date}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-z-red transition-colors" />
                     </div>
                   ))}
                </div>
             </div>

             {/* Achievement Card - High Fidelity */}
             <div className="bg-z-gold p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-500">
                <div className="relative z-10 space-y-8">
                   <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[10px] font-black tracking-[0.2em] uppercase">Season 2 Progress</span>
                   </div>
                   
                   <div>
                      <h3 className="text-4xl font-black leading-tight tracking-tighter">Master of Logic</h3>
                      <p className="text-white/70 font-medium mt-4 text-sm leading-relaxed">You are <span className="text-white font-black underline decoration-2 underline-offset-4">2 modules away</span> from your next legendary badge.</p>
                   </div>

                   <div className="pt-2">
                      <button className="bg-white text-z-red px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition-all">Unlock Milestone</button>
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
