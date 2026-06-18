"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  Building,
  Plus
} from "lucide-react";



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
          
          <button disabled className="px-8 py-4 bg-zinc-300 text-zinc-500 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed flex items-center space-x-3">
            <Plus className="w-5 h-5" />
            <span>Provision New School</span>
          </button>
        </header>

        {/* Schools Grid — Empty State */}
        <div className="flex flex-col items-center justify-center bg-white/40 backdrop-blur-2xl rounded-[3rem] border border-white/50 shadow-2xl py-24 px-12 text-center">
           <div className="bg-zinc-100 p-6 rounded-[2rem] mb-6">
              <Building className="w-12 h-12 text-zinc-400" />
           </div>
           <div className="bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">Coming Soon</div>
           <h3 className="text-2xl font-black text-zinc-800 tracking-tight mb-2">School Provisioning Isn&apos;t Available Yet</h3>
           <p className="text-zinc-500 font-medium max-w-md">We&apos;re still building multi-school management for institutional accounts. In the meantime, manage classrooms directly from the org dashboard.</p>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-zinc-900 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-z-red/20 to-transparent opacity-50"></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
              <div className="mb-8 md:mb-0 text-center md:text-left">
                 <div className="inline-flex items-center bg-white/10 text-zinc-300 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3">Coming Soon</div>
                 <h2 className="text-3xl font-black text-white tracking-tight mb-2">Mass Provisioning Suite</h2>
                 <p className="text-zinc-500 font-medium">Bulk import and external system sync for schools are planned for a future release.</p>
              </div>
              <div className="flex space-x-4">
                 <button disabled className="px-8 py-4 bg-white/5 text-zinc-500 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/5 cursor-not-allowed">
                    Bulk Import
                 </button>
                 <button disabled className="px-8 py-4 bg-z-red/30 text-zinc-300 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed">
                    Connect External API
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
