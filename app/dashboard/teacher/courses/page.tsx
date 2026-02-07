"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import NextImage from "next/image";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  BookOpen, 
  Users, 
  MoreVertical, 
  Filter,
  ArrowUpRight
} from "lucide-react";

const teacherCourses = [
  {
    id: 1,
    title: "Advanced Algebra & Logic",
    category: "Mathematics",
    students: 124,
    modules: 12,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600",
    color: "bg-z-red",
    status: "Published"
  },
  {
    id: 2,
    title: "Quantum Mechanics Intro",
    category: "Physics",
    students: 86,
    modules: 8,
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=600",
    color: "bg-blue-500",
    status: "Published"
  },
  {
    id: 3,
    title: "Digital Ethics & Society",
    category: "Social Sciences",
    students: 210,
    modules: 15,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600",
    color: "bg-emerald-500",
    status: "Draft"
  }
];

export default function TeacherCoursesPage() {
  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar />
      
      <main className="flex-grow p-12 ml-72">
        {/* Minimalist Modern Header */}
        <header className="flex justify-between items-end mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-z-red tracking-tighter leading-none">My Courses</h1>
            <div className="flex items-center space-x-3 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em]">
              <span>Management Hub</span>
              <span className="w-1.5 h-1.5 bg-z-red/20 rounded-full"></span>
              <span className="text-z-red/60">Academy Control</span>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-z-red transition-all" />
              <input 
                type="text" 
                placeholder="Search catalog..."
                className="bg-transparent border-b border-zinc-200 py-2 pl-8 pr-4 text-sm font-medium focus:outline-none focus:border-z-red w-40 focus:w-64 transition-all"
              />
            </div>
            
            <button className="relative p-2 text-zinc-400 hover:text-z-red transition-colors flex items-center space-x-2 group">
              <Filter className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Filter</span>
            </button>

            <Link href="/dashboard/teacher/courses/new" className="flex items-center space-x-3 bg-z-red text-white pr-6 pl-5 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] hover:bg-z-red/90 transition-all shadow-2xl shadow-z-red/20 group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>Create New Course</span>
            </Link>
          </div>
        </header>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {teacherCourses.map((course) => (
            <div key={course.id} className="glass-card rounded-[3rem] overflow-hidden group hover:translate-y-[-8px] transition-all duration-500 flex flex-col premium-shadow">
              {/* Image Preview */}
              <div className="relative h-56 w-full overflow-hidden">
                <NextImage 
                  src={course.image} 
                  alt={course.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div className="flex justify-between items-center w-full">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-xl ${course.color}`}>
                      {course.category}
                    </span>
                    <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">
                       {course.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black text-zinc-800 leading-tight tracking-tighter group-hover:text-z-red transition-colors">
                    {course.title}
                  </h3>
                  <button className="text-zinc-400 hover:text-z-red">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="bg-zinc-50 rounded-2xl p-4 flex items-center space-x-3 border border-zinc-100">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <Users className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase leading-none mb-1">Students</p>
                      <p className="text-sm font-black text-zinc-800">{course.students}</p>
                    </div>
                  </div>
                  <div className="bg-zinc-50 rounded-2xl p-4 flex items-center space-x-3 border border-zinc-100">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <BookOpen className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase leading-none mb-1">Modules</p>
                      <p className="text-sm font-black text-zinc-800">{course.modules}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between pt-6 border-t border-zinc-100">
                  <button className="flex items-center space-x-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-z-red transition-colors group/btn">
                    <span>Manage Content</span>
                    <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                  <button className="bg-z-rose/30 text-z-red px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-z-rose transition-colors">
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* New Course Dynamic Placeholder */}
          <Link href="/dashboard/teacher/courses/new" className="glass-card rounded-[3rem] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center p-12 group hover:border-z-red/30 hover:bg-z-red/[0.02] transition-all duration-500 min-h-[400px]">
            <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-z-red/5 transition-all">
               <Plus className="w-10 h-10 text-zinc-300 group-hover:text-z-red transition-colors" />
            </div>
            <h4 className="text-xl font-black text-zinc-400 group-hover:text-z-red transition-colors tracking-tight">Add New Program</h4>
            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mt-2 group-hover:text-z-red/40 transition-colors">Expand Academy</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
