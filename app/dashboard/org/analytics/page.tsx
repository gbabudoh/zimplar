"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Calendar, 
  ArrowUpRight,
  HeartHandshake,
  HardDrive,
  Download
} from "lucide-react";

// Mock Data for Analytics
const engagementStats = [
  { label: "Active Regional Learners", value: "48.2k", trend: "+12%", status: "up" },
  { label: "Daily Video Sessions", value: "1,204", trend: "+8%", status: "up" },
  { label: "Rural Inclusion Rate", value: "42%", trend: "+5%", status: "up" },
  { label: "Subsidy Utilization", value: "88%", trend: "-2%", status: "down" },
];

const dataUsageByRegion = [
  { region: "Greater Accra", used: "420 GB", capacity: "1 TB", percentage: 42 },
  { region: "Ashanti", used: "380 GB", capacity: "1 TB", percentage: 38 },
  { region: "Western", used: "210 GB", capacity: "500 GB", percentage: 42 },
  { region: "Central", used: "190 GB", capacity: "500 GB", percentage: 38 },
];

export default function RegionalAnalyticsPage() {
  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar />
      
      <main className="flex-grow p-10 ml-72">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-zinc-100">
                <BarChart3 className="w-5 h-5 text-z-red" />
              </div>
              <h1 className="text-3xl font-black text-zinc-800 tracking-tight">
                Regional <span className="text-z-red">Analytics</span>
              </h1>
            </div>
            <p className="text-zinc-600 font-medium ml-1">Aggregated engagement and impact trends across all deployment zones.</p>
          </div>
          
          <div className="flex space-x-4">
             <button className="px-8 py-4 bg-white border border-zinc-100 rounded-2xl font-black text-xs uppercase tracking-widest text-zinc-600 hover:shadow-lg transition-all flex items-center space-x-2">
               <Download className="w-4 h-4" />
               <span>Export Government Report</span>
             </button>
             <button className="px-8 py-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center space-x-2">
               <HeartHandshake className="w-4 h-4" />
               <span>Donor Impact Report</span>
             </button>
             <button className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-zinc-500/20 hover:scale-[1.02] transition-all flex items-center space-x-3">
               <Calendar className="w-4 h-4 text-z-red" />
               <span>Range: 30 Days</span>
             </button>
          </div>
        </header>

        {/* Impact Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {engagementStats.map((stat, i) => (
            <div key={i} className="p-8 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-xl hover:bg-white transition-all group">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <div className="flex items-end justify-between">
                 <h3 className="text-3xl font-black text-zinc-800 tracking-tight">{stat.value}</h3>
                 <div className={`flex items-center text-xs font-black ${stat.status === 'up' ? 'text-emerald-500' : 'text-z-red'}`}>
                    <TrendingUp className={`w-4 h-4 mr-1 ${stat.status === 'down' ? 'rotate-180' : ''}`} />
                    {stat.trend}
                 </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Bandwidth Distribution Card */}
           <div className="bg-zinc-950 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-96 h-96 bg-z-red/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10 flex justify-between items-start mb-12">
                 <div>
                    <h3 className="text-2xl font-black tracking-tight mb-2">Regional Data Quotas</h3>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xs">Monitoring shared data pool consumption across institutional hierarchies.</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <HardDrive className="w-6 h-6 text-z-red" />
                 </div>
              </div>

              <div className="space-y-10 relative z-10">
                 {dataUsageByRegion.map((region, i) => (
                   <div key={i}>
                      <div className="flex justify-between items-center mb-4">
                         <p className="text-sm font-black tracking-tight">{region.region}</p>
                         <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{region.used} / {region.capacity}</p>
                      </div>
                      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                         <div 
                           className="h-full bg-gradient-to-r from-z-red to-z-gold rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,27,47,0.3)]"
                           style={{ width: `${region.percentage}%` }}
                         ></div>
                      </div>
                   </div>
                 ))}
              </div>

              <button className="w-full mt-12 py-5 bg-white/5 hover:bg-white/10 text-white rounded-3xl font-black text-xs uppercase tracking-widest border border-white/10 transition-all flex items-center justify-center space-x-3">
                 <span>Recalibrate Allocation Map</span>
                 <ArrowUpRight className="w-4 h-4" />
              </button>
           </div>

           {/* Regional Engagement Breakdown Placeholder */}
           <div className="bg-white rounded-[3.5rem] p-10 shadow-xl border border-zinc-100 flex flex-col">
              <div className="flex justify-between items-start mb-12">
                 <div>
                    <h3 className="text-2xl font-black text-zinc-800 tracking-tight mb-1">Impact Density</h3>
                    <p className="text-zinc-500 text-sm font-medium">Correlation between digital access and student outcomes.</p>
                 </div>
                 <Globe className="w-8 h-8 text-z-blue" />
              </div>
              
              <div className="flex-grow flex items-center justify-center">
                 <div className="text-center group">
                    <div className="w-32 h-32 bg-z-blue/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative">
                        <div className="absolute inset-0 border-4 border-z-blue/10 border-dashed rounded-full animate-spin-slow"></div>
                        <TrendingUp className="w-12 h-12 text-z-blue" />
                    </div>
                    <h4 className="font-black text-zinc-800 italic text-xl mb-1">Generating Impact Curve</h4>
                    <p className="text-[10px] text-zinc-700 font-medium">Only verified Regional Ministry controllers have write access to provisioning.</p>
                 </div>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-4 pt-10 border-t border-zinc-50">
                 <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-z-red"></div>
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Data Subsidy</span>
                 </div>
                 <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-z-blue"></div>
                    <button className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] hover:text-z-red transition-all">Load Archive Ledger</button>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
