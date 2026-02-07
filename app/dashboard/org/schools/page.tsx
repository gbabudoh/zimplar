"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  Building, 
  MapPin, 
  Plus, 
  Search, 
  MoreVertical, 
  ArrowRight,
  Sprout,
  Coins
} from "lucide-react";

// Mock Data for Schools
const schools = [
  { 
    name: "Accra Technical Academy", 
    location: "Greater Accra", 
    classrooms: 42, 
    teachers: 28, 
    students: 1240, 
    status: "VERIFIED",
    lastAudit: "Oct 2023",
    activeStreams: 12,
    bandwidth: "450 GB"
  },
  { 
    name: "Okomfo Anokye Secondary", 
    location: "Ashanti Region", 
    classrooms: 30, 
    teachers: 22, 
    students: 850, 
    status: "VERIFIED",
    lastAudit: "Nov 2023",
    activeStreams: 12,
    bandwidth: "450 GB",
    type: "URBAN",
    subsidyStatus: "NONE"
  },
  { 
    name: "Rural Northern District Hub", 
    location: "Northern Region", 
    classrooms: 15, 
    teachers: 8, 
    students: 450, 
    status: "VERIFIED",
    lastAudit: "Nov 2023",
    activeStreams: 3,
    bandwidth: "120 GB",
    type: "RURAL",
    subsidyStatus: "ACTIVE"
  },
  { 
    name: "Methodist Academy", 
    location: "Ashanti", 
    classrooms: 24, 
    teachers: 18, 
    students: 890, 
    status: "PENDING",
    lastAudit: "---",
    activeStreams: 0,
    bandwidth: "0 GB",
    type: "URBAN",
    subsidyStatus: "NONE"
  },
  { 
    name: "Volta Regional Model School", 
    location: "Volta", 
    classrooms: 30, 
    teachers: 22, 
    students: 1100, 
    status: "VERIFIED",
    lastAudit: "Sep 2023",
    activeStreams: 8,
    bandwidth: "320 GB",
    type: "RURAL",
    subsidyStatus: "PENDING"
  },
  { 
    name: "Wesley Girls' High", 
    location: "Central Region", 
    classrooms: 55, 
    teachers: 45, 
    students: 1800, 
    status: "VERIFIED",
    lastAudit: "Jan 2024",
    activeStreams: 24,
    bandwidth: "890 GB",
    type: "URBAN",
    subsidyStatus: "NONE"
  },
  { 
    name: "Tamale Senior High", 
    location: "Northern Region", 
    classrooms: 25, 
    teachers: 18, 
    students: 620, 
    status: "PENDING",
    lastAudit: "N/A",
    activeStreams: 0,
    bandwidth: "0 GB",
    type: "RURAL",
    subsidyStatus: "PENDING"
  },
];

export default function SchoolsManagementPage() {
  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar />
      
      <main className="flex-grow p-10 ml-72">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-zinc-100">
                <Building className="w-5 h-5 text-z-red" />
              </div>
              <h1 className="text-3xl font-black text-zinc-800 tracking-tight">
                Managed <span className="text-z-red">Schools</span>
              </h1>
            </div>
            <p className="text-zinc-600 font-medium ml-1">Deploy and monitor regional educational institutions.</p>
          </div>
          
          <button className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-zinc-500/20 hover:scale-[1.02] transition-all flex items-center space-x-3 group">
            <Plus className="w-5 h-5 text-z-red group-hover:rotate-90 transition-transform" />
            <span>Provision New School</span>
          </button>
        </header>

        {/* Search and Filters */}
        <div className="mb-8 flex space-x-4">
           <div className="relative flex-grow group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-z-red transition-colors" />
              <input 
                type="text" 
                placeholder="Search schools by name or region..." 
                className="w-full bg-white/60 backdrop-blur-md border border-zinc-100 rounded-[2rem] py-5 pl-16 pr-8 focus:outline-none focus:ring-4 focus:ring-z-red/5 focus:bg-white transition-all font-medium text-zinc-800"
              />
           </div>
           <button className="px-8 bg-white/60 backdrop-blur-md border border-zinc-100 rounded-[2rem] font-bold text-zinc-600 hover:bg-white transition-all">
             Region: All
           </button>
           <button className="px-8 bg-amber-50 backdrop-blur-md border border-amber-100 rounded-[2rem] font-bold text-amber-700 hover:bg-amber-100 transition-all flex items-center space-x-2">
             <Sprout className="w-4 h-4" />
             <span>Type: Rural Only</span>
           </button>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {schools.map((school, i) => (
             <div key={i} className="bg-white/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/50 shadow-2xl hover:bg-white transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-z-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Active Stream Indicator */}
                {school.activeStreams > 0 && (
                  <div className="absolute top-8 right-8 flex items-center space-x-2 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">
                      {school.activeStreams} Live Rooms
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div className="flex items-center space-x-4">
                      <div className="bg-zinc-100 p-4 rounded-[1.5rem] group-hover:bg-z-red group-hover:text-white transition-all duration-500">
                         <Building className="w-8 h-8" />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-zinc-800 tracking-tight">{school.name}</h3>
                         <div className="flex items-center text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {school.location}
                         </div>
                      </div>
                   </div>
                   {school.activeStreams === 0 && (
                     <button className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                      <MoreVertical className="w-5 h-5 text-zinc-500" />
                   </button>
                   )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8 relative z-10">
                   <div className="bg-zinc-50 p-4 rounded-2xl text-center">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em] mb-1">Classrooms</p>
                      <p className="text-lg font-black text-zinc-800">{school.classrooms}</p>
                   </div>
                   <div className="bg-zinc-50 p-4 rounded-2xl text-center">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em] mb-1">Bandwidth</p>
                      <p className="text-lg font-black text-zinc-800">{school.bandwidth}</p>
                   </div>
                   <div className="bg-zinc-50 p-4 rounded-2xl text-center">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em] mb-1">Students</p>
                      <p className="text-lg font-black text-zinc-800">{school.students}</p>
                   </div>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-zinc-100 relative z-10">
                   <div className="flex items-center space-x-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${school.status === 'VERIFIED' ? 'bg-emerald-500 animate-pulse' : 'bg-z-gold'}`}></div>
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                         Status: <span className={school.status === 'VERIFIED' ? 'text-emerald-600' : 'text-z-gold'}>{school.status}</span>
                      </span>
                   </div>
                   
                   <div className="flex space-x-2">
                      {school.type === 'RURAL' && (
                         <div className="px-3 py-1 bg-amber-100 rounded-lg flex items-center space-x-1.5" title="Rural Impact Node">
                            <Sprout className="w-3 h-3 text-amber-600" />
                            <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Rural</span>
                         </div>
                      )}
                      
                      {school.subsidyStatus === 'ACTIVE' && (
                         <div className="px-3 py-1 bg-emerald-100 rounded-lg flex items-center space-x-1.5" title="Data Subsidy Active">
                            <Coins className="w-3 h-3 text-emerald-600" />
                            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Subsidized</span>
                         </div>
                      )}
                      
                      {school.subsidyStatus === 'PENDING' && (
                         <button className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg flex items-center space-x-1.5 transition-colors" title="Allocate Subsidy">
                            <Coins className="w-3 h-3 text-zinc-400" />
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Allocate</span>
                         </button>
                      )}
                   </div>
                   <button className="flex items-center text-xs font-black text-z-blue uppercase tracking-widest hover:mr-2 transition-all group/link">
                      Manage Live Feeds
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
           ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-zinc-900 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-z-red/20 to-transparent opacity-50"></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
              <div className="mb-8 md:mb-0 text-center md:text-left">
                 <h2 className="text-3xl font-black text-white tracking-tight mb-2">Mass Provisioning Suite</h2>
                 <p className="text-zinc-500 font-medium">Download CSV templates or connect your regional database for bulk school discovery.</p>
              </div>
              <div className="flex space-x-4">
                 <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 transition-all">
                    Bulk Import
                 </button>
                 <button className="px-8 py-4 bg-z-red text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-z-red/20 hover:scale-105 transition-all">
                    Connect External API
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
