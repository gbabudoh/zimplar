"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Calendar, 
  HeartHandshake,
  Download,
  Users,
  Coins
} from "lucide-react";

// Mock Data for NGO Impact Analytics
const impactMetrics = [
  { label: "Lives Impacted", value: "12,402", trend: "+12%", status: "up" },
  { label: "Digital Literacy Rate", value: "68%", trend: "+8%", status: "up" },
  { label: "Grant Utilization", value: "94%", trend: "+1%", status: "up" },
  { label: "Partner Schools", value: "48", trend: "+3", status: "up" },
];

const fundingAllocation = [
  { project: "Infrastructure (Starlink)", amount: "45%", color: "bg-z-blue" },
  { project: "Teacher Training", amount: "25%", color: "bg-emerald-500" },
  { project: "Student stipends", amount: "20%", color: "bg-amber-500" },
  { project: "Admin & Ops", amount: "10%", color: "bg-zinc-300" },
];

export default function NGOImpactAnalyticsPage() {
  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar role="ORG_ADMIN" />
      
      <main className="flex-grow p-10 ml-72">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-zinc-100">
                <BarChart3 className="w-5 h-5 text-z-red" />
              </div>
              <h1 className="text-3xl font-black text-zinc-800 tracking-tight">
                Impact <span className="text-z-red">Analytics</span>
              </h1>
            </div>
            <p className="text-zinc-600 font-medium ml-1">Donor-ready reporting and social return on investment metrics.</p>
          </div>
          
          <div className="flex space-x-4">
             <button className="px-8 py-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center space-x-2">
               <Download className="w-4 h-4" />
               <span>Export Donor Report (PDF)</span>
             </button>
             <button className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-zinc-500/20 hover:scale-[1.02] transition-all flex items-center space-x-3">
               <Calendar className="w-4 h-4 text-z-red" />
               <span>FY 2025-2026</span>
             </button>
          </div>
        </header>

        {/* Impact Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impactMetrics.map((stat, i) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Success Stories / Qualitative Data */}
           <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 shadow-xl border border-zinc-100 relative overflow-hidden">
              <div className="flex justify-between items-start mb-8 z-10 relative">
                 <div>
                    <h3 className="text-2xl font-black text-zinc-800 tracking-tight mb-1">Qualitative Impact</h3>
                    <p className="text-zinc-500 text-sm font-medium">Outcomes beyond the numbers.</p>
                 </div>
                 <HeartHandshake className="w-8 h-8 text-z-red opacity-80" />
              </div>
              
              <div className="grid grid-cols-2 gap-6 relative z-10">
                  <div className="p-6 bg-zinc-50 rounded-3xl group hover:bg-zinc-900 transition-colors">
                      <div className="flex items-center space-x-3 mb-4">
                          <Users className="w-5 h-5 text-z-blue group-hover:text-white" />
                          <h4 className="font-bold text-zinc-800 group-hover:text-white">University Acceptance</h4>
                      </div>
                      <p className="text-sm text-zinc-500 group-hover:text-zinc-400">Rural students from Northern Cluster saw a <span className="text-zinc-900 group-hover:text-white font-black">45% increase</span> in STEM university admissions.</p>
                  </div>
                  <div className="p-6 bg-zinc-50 rounded-3xl group hover:bg-zinc-900 transition-colors">
                      <div className="flex items-center space-x-3 mb-4">
                          <Globe className="w-5 h-5 text-emerald-500 group-hover:text-white" />
                          <h4 className="font-bold text-zinc-800 group-hover:text-white">Global Collaboration</h4>
                      </div>
                      <p className="text-sm text-zinc-500 group-hover:text-zinc-400">Students participated in <span className="text-zinc-900 group-hover:text-white font-black">12 international</span> video exchange programs.</p>
                  </div>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-z-red/5 rounded-full blur-3xl"></div>
           </div>

           {/* Fund Allocation Chart Placeholder */}
           <div className="bg-zinc-900 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden text-white flex flex-col">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50"></div>
              
              <div className="relative z-10 mb-8">
                 <h3 className="text-xl font-black tracking-tight mb-2">Fund Allocation</h3>
                 <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">Q3 2025 Disbursement</p>
              </div>

              <div className="flex-grow flex items-center justify-center relative z-10 mb-8">
                  {/* CSS Pie Chart Placeholder */}
                  <div className="w-40 h-40 rounded-full border-8 border-white/10 flex items-center justify-center relative">
                     <Coins className="w-10 h-10 text-z-gold" />
                     <div className="absolute inset-0 rounded-full border-t-8 border-z-blue rotate-45"></div>
                     <div className="absolute inset-0 rounded-full border-r-8 border-emerald-500 rotate-12"></div>
                  </div>
              </div>

              <div className="space-y-3 relative z-10">
                  {fundingAllocation.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                              <span className="font-bold text-zinc-300">{item.project}</span>
                          </div>
                          <span className="font-black text-white">{item.amount}</span>
                      </div>
                  ))}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
