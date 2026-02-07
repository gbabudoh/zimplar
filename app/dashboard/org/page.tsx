"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  Building, 
  Users, 
  Zap, 
  MapPin,
  ShieldCheck,
  BarChart3,
  Globe,
  ArrowUpRight,
  Sprout,
  Building2
} from "lucide-react";

// Mock Data for Institutional View
const stats = [
  { label: "Active Schools", value: "124", icon: Building, color: "text-emerald-500", bg: "bg-emerald-100" },
  { label: "Regional Classrooms", value: "3,842", icon: Globe, color: "text-z-blue", bg: "bg-blue-100" },
  { label: "Total Students", value: "48.2k", icon: Users, color: "text-purple-500", bg: "bg-purple-100" },
  { label: "Rural Reach", value: "42%", icon: Sprout, color: "text-amber-600", bg: "bg-amber-100" },
];

const regionalPerformance = [
  { region: "Greater Accra", schools: 45, engagement: "92%", status: "OPTIMAL" },
  { region: "Ashanti", schools: 38, engagement: "88%", status: "GROWING" },
  { region: "Western", schools: 22, engagement: "74%", status: "ALERT" },
  { region: "Central", schools: 19, engagement: "81%", status: "OPTIMAL" },
];

const recentEvents = [
  { id: 1, type: "VERIFICATION", org: "District Edu Board", event: "Standardization Audit Passed", time: "2 hours ago" },
  { id: 2, type: "SUBSIDY", org: "Rural Literacy NGO", event: "Data Voucher Batch Released", time: "5 hours ago" },
  { id: 3, type: "ONBOARDING", org: "Methodist Academy", event: "School Instance Provisioned", time: "1 day ago" },
];

export default function InstitutionalSuitePage() {
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
                Institutional <span className="text-z-red">Suite</span>
              </h1>
            </div>
            <p className="text-zinc-600 font-medium ml-1">Nationwide education management and regional impact metrics.</p>
          </div>
          
          <div className="flex space-x-4">
            <Link href="/dashboard/org/audit">
              <button className="px-6 py-3 bg-white border border-zinc-100 rounded-xl font-black text-xs uppercase tracking-widest text-zinc-600 hover:shadow-lg transition-all flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Compliance Audit</span>
              </button>
            </Link>
            <Link href="/dashboard/org/schools">
              <button className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-zinc-500/20 hover:scale-[1.02] transition-all">
                Provision New School
              </button>
            </Link>
          </div>
        </header>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="p-8 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-xl shadow-z-red/5 hover:bg-white transition-all group">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-zinc-800 tracking-tight">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Regional Map Analytics Placeholder */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-white min-h-[400px]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-z-red/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-2xl font-black tracking-tight mb-1">Regional Impact Map</h3>
                   <p className="text-zinc-400 text-sm font-medium">Real-time engagement density across deployment zones.</p>
                </div>
                <div className="flex space-x-2">
                  <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Live Sync</div>
                </div>
              </div>
              
              {/* Visual Map Placeholder */}
              <div className="relative z-10 w-full aspect-video bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center">
                 <div className="text-center group cursor-crosshair">
                   <div className="w-20 h-20 bg-z-red/20 rounded-full flex items-center justify-center animate-ping absolute opacity-20"></div>
                   <div className="w-20 h-20 bg-z-red/40 rounded-full flex items-center justify-center relative">
                      <MapPin className="w-8 h-8 text-z-red group-hover:scale-125 transition-transform" />
                   </div>
                   <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Scanning Nodes...</p>
                 </div>
              </div>
            </div>

            {/* Performance Ledger */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-zinc-100">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-black text-zinc-800 tracking-tight">Deployment Performance</h3>
                   <Link href="/dashboard/org/analytics">
                      <button className="text-xs font-black text-z-blue border-b-2 border-z-blue/20 hover:border-z-blue transition-all pb-0.5">Regional Metrics</button>
                   </Link>
                </div>
               
               <div className="space-y-4">
                  {regionalPerformance.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-zinc-50 rounded-3xl border border-zinc-100 hover:bg-white hover:shadow-lg transition-all group">
                       <div className="flex items-center space-x-6">
                          <Building2 className="w-8 h-8 text-z-red" />
                          <div>
                             <p className="text-lg font-black text-zinc-800">{p.region}</p>
                             <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{p.schools} Managed Schools</p>
                          </div>
                       </div>
                       <div className="flex items-center space-x-10 text-right">
                          <div>
                             <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Engagement</p>
                             <p className="font-black text-zinc-800">{p.engagement}</p>
                          </div>
                          <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                            p.status === 'OPTIMAL' ? 'bg-emerald-100 text-emerald-600' : 
                            p.status === 'ALERT' ? 'bg-red-100 text-z-red' : 'bg-blue-100 text-z-blue'
                          }`}>
                            {p.status}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Institutional Audit Sidebar */}
          <div className="space-y-8">
             {/* Shared Data Pool */}
             <div className="bg-zinc-950 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-z-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center space-x-3 mb-8 relative z-10">
                  <BarChart3 className="w-5 h-5 text-z-red" />
                  <h3 className="text-lg font-black text-white tracking-tight">Shared Data Pool</h3>
                </div>
                
                <div className="space-y-6 relative z-10">
                   <div>
                      <div className="flex justify-between items-end mb-3">
                         <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Quota</p>
                         <p className="text-2xl font-black text-white">1.2 / 2.5 TB</p>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <div className="h-full bg-gradient-to-r from-z-red to-z-gold w-[48%] shadow-[0_0_20px_rgba(255,27,47,0.3)]"></div>
                      </div>
                   </div>
                   
                   <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">System prediction shows 15% growth in data demand for Ashanti region next month.</p>
                   
                   <Link href="/dashboard/billing">
                      <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all">
                         Review Shared Billing
                      </button>
                   </Link>
                </div>
             </div>

             {/* Verification Ledger */}
             <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-zinc-100">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-lg font-black text-zinc-800 tracking-tight">Security Audit</h3>
                   <Link href="/dashboard/org/audit">
                      <div className="bg-z-red/10 text-z-red px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest animate-pulse cursor-pointer hover:bg-z-red hover:text-white transition-all">Full Audit Ledger</div>
                   </Link>
                </div>
                
                <div className="space-y-6">
                   {recentEvents.map(event => (
                     <div key={event.id} className="relative pl-6 border-l-2 border-zinc-100 last:border-0 pb-2">
                        <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-z-red shadow-[0_0_10px_rgba(255,27,47,0.4)]"></div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{event.time} — {event.type}</p>
                        <p className="text-xs font-bold text-zinc-800 leading-tight">{event.event}</p>
                        <p className="text-[9px] text-z-blue font-black mt-1 uppercase tracking-tighter">{event.org}</p>
                     </div>
                   ))}
                </div>
                
                <button className="w-full mt-8 py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                   System Health Monitor
                </button>
             </div>

             {/* Quick Actions */}
             <div className="p-1.5 bg-zinc-50 rounded-[2.5rem] border border-zinc-100">
                <div className="flex flex-col space-y-1">
                   <Link href="/dashboard/org/schools">
                      <button className="w-full flex items-center justify-between p-6 bg-white rounded-[2rem] hover:bg-z-red hover:text-white transition-all group shadow-sm">
                         <div className="flex items-center space-x-4">
                            <Zap className="w-5 h-5 text-z-gold group-hover:text-white" />
                            <span className="font-bold text-sm tracking-tight">Schools & Classrooms</span>
                         </div>
                         <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                   </Link>
                   <Link href="/dashboard/billing">
                      <button className="w-full flex items-center justify-between p-6 bg-white/50 rounded-[2rem] hover:bg-zinc-900 hover:text-white transition-all group">
                         <div className="flex items-center space-x-4 text-zinc-600 group-hover:text-white">
                            <Globe className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-tight text-zinc-700 group-hover:text-white">Shared Billing</span>
                         </div>
                         <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
