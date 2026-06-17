"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Video, 
  Search, 
  MoreVertical, 
  Plus,
  ShieldCheck,
  Calendar
} from "lucide-react";
import InitializeRoomModal from "./InitializeRoomModal";

interface Classroom {
  id: string;
  name: string;
  course: string;
  students: number;
  active: boolean;
  startTime: string;
  instructor: string;
}

interface Course {
  id: string;
  title: string;
}

interface ClassroomsClientViewProps {
  initialClassrooms: Classroom[];
  courses: Course[];
}

export default function ClassroomsClientView({
  initialClassrooms,
  courses,
}: ClassroomsClientViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter classrooms based on search query
  const filteredClassrooms = initialClassrooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Minimalist Modern Header */}
      <header className="flex justify-between items-end mb-16">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-z-red tracking-tighter leading-none">Classrooms</h1>
          <div className="flex items-center space-x-3 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em]">
            <span>Cohort Management</span>
            <span className="w-1.5 h-1.5 bg-z-red/20 rounded-full"></span>
            <span className="text-z-red/60">Active Hub</span>
          </div>
        </div>

        <div className="flex items-center space-x-8">
          <div className="relative group hidden lg:block">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-z-red transition-all" />
            <input 
              type="text" 
              placeholder="Find room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-b border-zinc-200 py-2 pl-8 pr-4 text-sm font-medium focus:outline-none focus:border-z-red w-40 focus:w-64 transition-all placeholder-zinc-300"
            />
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-3 bg-z-red text-white pr-6 pl-5 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] hover:bg-z-red/90 transition-all shadow-2xl shadow-z-red/20 group cursor-pointer"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span>Initialize Room</span>
          </button>
        </div>
      </header>

      {/* Classroom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {filteredClassrooms.map((room) => (
          <div key={room.id} className="glass-card p-10 rounded-[3rem] group hover:translate-y-[-4px] transition-all duration-500 premium-shadow relative overflow-hidden">
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="space-y-4">
                <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border ${room.active ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-zinc-100 border-zinc-200 text-zinc-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${room.active ? 'bg-green-500 animate-pulse' : 'bg-zinc-300'}`}></span>
                  <span className="text-[10px] font-black tracking-widest uppercase">{room.active ? 'Live Now' : 'Standby'}</span>
                </div>
                <h3 className="text-3xl font-black text-zinc-800 tracking-tighter leading-none">{room.name}</h3>
              </div>
              <button className="text-zinc-500 hover:text-z-red transition-colors p-2">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 relative z-10">
               <div className="flex flex-col space-y-1">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Linked Course</p>
                  <p className="text-lg font-bold text-z-red tracking-tight">{room.course}</p>
               </div>

               <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-100/50">
                  <div className="flex items-center space-x-4">
                     <div className="bg-zinc-50 p-3 rounded-2xl text-zinc-400">
                        <Users className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase leading-none mb-1">Students</p>
                        <p className="text-sm font-black text-zinc-800">{room.students} Enrolled</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-4">
                     <div className="bg-zinc-50 p-3 rounded-2xl text-zinc-400">
                        <Calendar className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase leading-none mb-1">Schedule</p>
                        <p className="text-sm font-black text-zinc-800">{room.startTime}</p>
                     </div>
                  </div>
               </div>

               <div className="pt-8 flex items-center space-x-4">
                  <Link href={`/classroom/${room.id}`} className="flex-grow">
                    <button 
                      className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer ${room.active ? 'bg-z-red text-white shadow-xl shadow-z-red/20 hover:scale-[1.02]' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'}`}
                      disabled={!room.active}
                    >
                       {room.active ? 'Join Classroom' : 'Wait for Schedule'}
                    </button>
                  </Link>
                  <button className="p-4 bg-zinc-50 rounded-2xl text-zinc-400 hover:text-z-red hover:bg-z-red/5 transition-all cursor-pointer">
                     <ShieldCheck className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {/* Subtle background icon */}
            <Video className="absolute -bottom-10 -right-10 w-48 h-48 text-zinc-500/5 group-hover:text-z-red/5 transition-colors duration-1000 rotate-12" />
          </div>
        ))}

        {/* New Cohort Placeholder */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="glass-card rounded-[3rem] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center p-12 group hover:border-z-red/30 hover:bg-z-red/[0.02] transition-all duration-500 min-h-[400px] cursor-pointer"
        >
          <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-z-red/5 transition-all">
             <Plus className="w-10 h-10 text-zinc-300 group-hover:text-z-red transition-colors" />
          </div>
          <h4 className="text-xl font-black text-zinc-400 group-hover:text-z-red transition-colors tracking-tight">Create New Cohort</h4>
          <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mt-2 group-hover:text-z-red/40 transition-colors">Group Students</p>
        </div>
      </div>

      {/* Initialize Room Modal */}
      <InitializeRoomModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courses={courses}
      />
    </>
  );
}
