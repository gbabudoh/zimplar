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
  Coins,
  Filter
} from "lucide-react";

// Mock Data for NGO Schools - Filtered for Rural/Impact Focus
const schools = [
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

export default function NGOImpactSchoolsPage() {
  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar role="ORG_ADMIN" />
      
      <main className="flex-grow p-10 ml-72">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-zinc-100">
                <Sprout className="w-5 h-5 text-emerald-500" />
              </div>
              <h1 className="text-3xl font-black text-zinc-800 tracking-tight">
                Impact <span className="text-emerald-600">Nodes</span>
              </h1>
            </div>
            <p className="text-zinc-600 font-medium ml-1">Monitor rural deployments and allocate subsidy grants.</p>
          </div>
          
          <button className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-zinc-500/20 hover:scale-[1.02] transition-all flex items-center space-x-3 group">
            <Plus className="w-5 h-5 text-emerald-500 group-hover:rotate-90 transition-transform" />
            <span>Identify New Node</span>
          </button>
        </header>

        {/* Search and Filters */}
        <div className="mb-8 flex space-x-4">
           <div className="relative flex-grow group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search rural nodes..." 
                className="w-full bg-white/60 backdrop-blur-md border border-zinc-100 rounded-[2rem] py-5 pl-16 pr-8 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-medium text-zinc-800"
              />
           </div>
           <button className="px-8 bg-emerald-50 backdrop-blur-md border border-emerald-100 rounded-[2rem] font-bold text-emerald-700 hover:bg-emerald-100 transition-all flex items-center space-x-2">
             <Filter className="w-4 h-4" />
             <span>Status: All Active</span>
           </button>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {schools.map((school, i) => (
             <div key={i} className="bg-white/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/50 shadow-2xl hover:bg-white transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div className="flex items-center space-x-4">
                      <div className="bg-zinc-100 p-4 rounded-[1.5rem] group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
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
                   <button className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                      <MoreVertical className="w-5 h-5 text-zinc-500" />
                   </button>
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
                   <div className="flex space-x-2">
                      <div className="px-3 py-1 bg-amber-100 rounded-lg flex items-center space-x-1.5" title="Rural Impact Node">
                         <Sprout className="w-3 h-3 text-amber-600" />
                         <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Rural</span>
                      </div>
                      
                      {school.subsidyStatus === 'ACTIVE' && (
                         <div className="px-3 py-1 bg-emerald-100 rounded-lg flex items-center space-x-1.5" title="Data Subsidy Active">
                            <Coins className="w-3 h-3 text-emerald-600" />
                            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Subsidized</span>
                         </div>
                      )}
                      
                      {school.subsidyStatus === 'PENDING' && (
                         <button className="px-3 py-1 bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg flex items-center space-x-1.5 transition-colors shadow-lg shadow-zinc-900/10" title="Allocate Subsidy">
                            <Coins className="w-3 h-3 text-z-gold" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Allocate Grant</span>
                         </button>
                      )}
                   </div>
                   <button className="flex items-center text-xs font-black text-zinc-400 uppercase tracking-widest hover:text-emerald-600 hover:mr-2 transition-all group/link">
                      Details
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
}
