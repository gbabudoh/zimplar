"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  Users, 
  ShieldCheck, 
  BarChart3,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  Smartphone,
  Palette
} from "lucide-react";

// Mock Data for Private School View
const schoolStats = [
  { label: "Total Enrollment", value: "842", icon: Users, color: "text-z-blue", bg: "bg-z-blue/20" },
  { label: "Parent Opt-in", value: "92%", icon: Smartphone, color: "text-emerald-700", bg: "bg-emerald-500/20" },
  { label: "CRM Leads", value: "156", icon: TrendingUp, color: "text-purple-700", bg: "bg-purple-500/20" },
  { label: "Tuition Health", value: "98%", icon: ShieldCheck, color: "text-z-gold", bg: "bg-z-gold/20" },
];

const portalActivity = [
  { student: "Liam Osei", parent: "Kwame Osei", event: "Tuition Receipt Downloaded", time: "10m ago" },
  { student: "Sarah Mensah", parent: "Ama Mensah", event: "Progress Report Viewed", time: "45m ago" },
  { student: "Zane Tetteh", parent: "Efua Tetteh", event: "New Message: Absenteeism", time: "2h ago" },
];

export default function PrivateSchoolDashboard() {
  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar role="SCHOOL" />
      
      <main className="flex-grow p-10 ml-72">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-zinc-200">
                <ShieldCheck className="w-5 h-5 text-z-blue stroke-[2.5]" />
              </div>
              <h1 className="text-3xl font-black text-zinc-800 tracking-tight">
                School <span className="text-zinc-950">Management</span>
              </h1>
            </div>
            <p className="text-zinc-800 font-bold ml-1">Premium oversight: Parent portals, CRM tools, and brand identity.</p>
          </div>
          
          <div className="flex space-x-4">
            <Link href="/dashboard/billing">
              <button className="px-6 py-3 bg-white border border-zinc-100 rounded-xl font-black text-xs uppercase tracking-widest text-zinc-600 hover:shadow-lg transition-all flex items-center space-x-2">
                <Palette className="w-4 h-4 text-z-red" />
                <span>Branding Kit</span>
              </button>
            </Link>
            <Link href="/dashboard/billing">
              <button className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-zinc-500/20 hover:scale-[1.02] transition-all flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-z-blue" />
                <span>Launch Campaign</span>
              </button>
            </Link>
          </div>
        </header>

        {/* School-specific Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {schoolStats.map((stat, i) => (
            <div key={i} className="p-8 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-xl shadow-z-blue/5 hover:bg-white transition-all group">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                <stat.icon className="w-6 h-6 stroke-[2.5]" />
              </div>
               <p className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-zinc-800 tracking-tight">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CRM & Growth Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-white min-h-[400px]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-z-blue/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-2xl font-black tracking-tight mb-1">CRM Funnel Insights</h3>
                   <p className="text-zinc-200 text-sm font-semibold">Tracking prospective student leads and conversion rates.</p>
                </div>
                <div className="flex space-x-2">
                  <div className="bg-z-blue/10 text-z-blue px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-z-blue/20">Growth Active</div>
                </div>
              </div>
              
              {/* Funnel Visual Placeholder */}
              <div className="relative z-10 w-full aspect-video flex items-end space-x-4 px-4 pb-4">
                 {[40, 65, 80, 55, 90, 75, 85].map((h, i) => (
                   <div key={i} className="flex-grow bg-white/5 rounded-t-xl group relative cursor-pointer hover:bg-z-blue/20 transition-all border-t border-white/5" style={{ height: `${h}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black text-z-blue">{h}%</span>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="flex justify-between mt-4 px-2 text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </div>

            {/* Parent Portal Feed */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-zinc-100">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-black text-zinc-800 tracking-tight">Parent Portal Activity</h3>
                   <button className="text-xs font-black text-z-blue border-b-2 border-z-blue/20 hover:border-z-blue transition-all pb-0.5">Push Notify All</button>
                </div>
               
                <div className="space-y-4">
                  {portalActivity.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-zinc-50 rounded-3xl border border-zinc-100 hover:bg-white hover:shadow-lg transition-all group">
                       <div className="flex items-center space-x-6">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-z-blue group-hover:bg-z-blue group-hover:text-white transition-all border border-zinc-100">
                             <Smartphone className="w-6 h-6 stroke-[2.5]" />
                          </div>
                          <div>
                             <p className="text-lg font-black text-zinc-800">{activity.event}</p>
                             <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">{activity.parent} &bull; {activity.student}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-zinc-400">{activity.time}</p>
                          <ChevronRight className="w-4 h-4 text-zinc-300 ml-auto mt-1" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* School Identity Sidebar */}
          <div className="space-y-8">
             {/* Brand Strength */}
             <div className="bg-zinc-950 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-z-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center space-x-3 mb-8 relative z-10">
                  <Palette className="w-5 h-5 text-z-red" />
                  <h3 className="text-lg font-black text-white tracking-tight">Brand Identity</h3>
                </div>
                
                <div className="space-y-6 relative z-10">
                   <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                         <div className="w-8 h-8 bg-z-red rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-white font-black text-sm">Active Logo</p>
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">SVG - Transparent</p>
                      </div>
                   </div>
                   
                   <div>
                      <div className="flex justify-between items-end mb-3">
                         <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Impression Rate</p>
                         <p className="text-2xl font-black text-white">84.2k</p>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <div className="h-full bg-z-blue w-[78%] shadow-[0_0_20px_rgba(82,156,159,0.3)]"></div>
                      </div>
                   </div>
                   
                   <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">Your school branding is active across all student certifications.</p>
                   
                   <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all">
                      Open Customizer
                   </button>
                </div>
             </div>

             {/* CRM Overview */}
             <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-zinc-100">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-lg font-black text-zinc-800 tracking-tight">Revenue CRM</h3>
                   <div className="bg-z-blue/10 text-z-blue px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">Active Leads</div>
                </div>
                
                <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 mb-6">
                   <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest mb-4">Tuition Collections</p>
                   <div className="flex items-end justify-between">
                     <h4 className="text-3xl font-black text-zinc-800">$128.4k</h4>
                     <TrendingUp className="w-5 h-5 text-emerald-500 mb-1" />
                   </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-900">
                     <span>Unpaid Fees</span>
                     <span className="text-z-red">$4,200</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                     <div className="h-full bg-z-red w-[12%]"></div>
                  </div>
                </div>
                
                <button className="w-full mt-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                   Manage Collections
                </button>
             </div>

             {/* Quick Actions */}
             <div className="p-1.5 bg-zinc-50 rounded-[2.5rem] border border-zinc-100">
                <div className="flex flex-col space-y-1">
                   <Link href="/dashboard/billing">
                      <button className="w-full flex items-center justify-between p-6 bg-white rounded-[2rem] hover:bg-z-blue hover:text-white transition-all group shadow-sm">
                         <div className="flex items-center space-x-4">
                            <BarChart3 className="w-5 h-5 text-z-blue group-hover:text-white" />
                            <span className="font-bold text-sm tracking-tight">Enrollment Stats</span>
                         </div>
                         <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
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

// Re-using same icons but within this file's scope
function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
