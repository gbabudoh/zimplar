"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Globe
} from "lucide-react";
import { getPlatformAnalytics, getCourseEngagement } from "@/actions/analytics";

interface AnalyticsData {
  stats: {
    users: number;
    teachers: number;
    students: number;
    courses: number;
    revenue: number;
    subscriptions: number;
    alerts: number;
  };
  revenueByPlan: Array<{
    planType: string;
    _sum: { amount: number | null };
    _count: number;
  }>;
}

interface CourseStats {
  id: string;
  title: string;
  _count: { enrollments: number; lessons: number };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [courses, setCourses] = useState<CourseStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [analytics, topCourses] = await Promise.all([
          getPlatformAnalytics(),
          getCourseEngagement()
        ]);
        setData(analytics);
        setCourses(topCourses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg flex font-sans">
        <Sidebar role="ADMIN" />
        <main className="flex-grow flex items-center justify-center ml-72">
           <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-z-red/20 border-t-z-red rounded-full animate-spin"></div>
              <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">Aggregating ecosystem data...</p>
           </div>
        </main>
      </div>
    );
  }

  if (!data) return null;
  const stats = data.stats;

  const statCards = [
    { label: "Total Users", value: stats.users, detail: `${stats.teachers} Teachers`, icon: Users, color: "blue", trend: "+12%" },
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, detail: `${stats.subscriptions} Active Subs`, icon: DollarSign, color: "emerald", trend: "+8.4%" },
    { label: "Active Courses", value: stats.courses, detail: "Across all tiers", icon: BookOpen, color: "purple", trend: "+5%" },
    { label: "Security Alerts", value: stats.alerts, detail: "Malpractice flags", icon: AlertCircle, color: "red", trend: "-15%" },
  ];

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-10">
      <Sidebar role="ADMIN" />
      
      <main className="flex-grow p-10 ml-72">
        <header className="flex justify-between items-end mb-12">
          <div>
             <div className="flex items-center space-x-3 mb-2">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-zinc-100 rotate-3">
                   <BarChart3 className="w-5 h-5 text-z-red" />
                </div>
                <h1 className="text-3xl font-black text-zinc-800 tracking-tight">Platform Analytics</h1>
             </div>
             <p className="text-zinc-500 font-medium ml-1 text-sm tracking-tight">System-wide performance, growth, and engagement metrics.</p>
          </div>
          
          <div className="flex space-x-2">
             <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">System Healthy</span>
             </div>
          </div>
        </header>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {statCards.map((s) => (
             <div key={s.label} className="bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/50 shadow-xl group hover:scale-[1.02] transition-all relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                   <div className={`p-3 rounded-2xl ${s.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : s.color === 'red' ? 'bg-red-50 text-red-600' : s.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                      <s.icon className="w-5 h-5" />
                   </div>
                   <div className={`flex items-center space-x-1 text-[10px] font-black uppercase ${s.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                      {s.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      <span>{s.trend}</span>
                   </div>
                </div>
                <div className="relative z-10">
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{s.label}</p>
                   <h3 className="text-2xl font-black text-zinc-800 mb-1">{s.value}</h3>
                   <p className="text-xs font-bold text-zinc-400">{s.detail}</p>
                </div>
                <div className={`absolute bottom-0 right-0 w-24 h-24 translate-x-1/2 translate-y-1/2 rounded-full blur-3xl opacity-20 ${s.color === 'emerald' ? 'bg-emerald-500' : s.color === 'red' ? 'bg-red-500' : s.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
           {/* Revenue Breakdown */}
           <div className="lg:col-span-2 bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-z-red/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10">
                 <div className="flex justify-between items-center mb-10">
                    <div>
                       <h3 className="text-xl font-black text-white">Revenue Distribution</h3>
                       <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Monthly Recurring Growth</p>
                    </div>
                    <div className="flex space-x-2">
                       <button className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">Export Report</button>
                    </div>
                 </div>

                 <div className="space-y-6">
                    {data.revenueByPlan.map((p) => (
                      <div key={p.planType} className="group cursor-default">
                         <div className="flex justify-between items-end mb-2">
                            <div className="flex items-center space-x-3">
                               <div className={`w-3 h-3 rounded-full ${p.planType === 'ENTERPRISE' ? 'bg-emerald-400' : p.planType === 'PREMIUM' ? 'bg-z-red' : 'bg-z-blue'}`}></div>
                               <span className="text-sm font-black text-white uppercase tracking-tighter">{p.planType}</span>
                            </div>
                            <span className="text-sm font-black text-zinc-400">${p._sum.amount?.toFixed(0) || 0}</span>
                         </div>
                         <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                            <div 
                               className={`h-full transition-all duration-1000 ${p.planType === 'ENTERPRISE' ? 'bg-emerald-400' : p.planType === 'PREMIUM' ? 'bg-z-red' : 'bg-z-blue'}`}
                               style={{ width: `${((p._sum.amount || 0) / (stats.revenue || 1)) * 100}%` }}
                            ></div>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-white/5">
                    <div>
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Retention Rate</p>
                       <p className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">94.8%</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Avg. Ticket</p>
                       <p className="text-lg font-black text-white">$142.3</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Growth Forecast</p>
                       <p className="text-lg font-black text-white text-emerald-400">+22.5%</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Geo Distribution (Simulated for visualization) */}
           <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-xl flex flex-col">
              <div className="flex items-center space-x-3 mb-8">
                 <Globe className="w-5 h-5 text-z-blue" />
                 <h3 className="text-lg font-black text-zinc-800 tracking-tight">Geo Distribution</h3>
              </div>
              
              <div className="flex-grow space-y-6">
                 {[
                    { country: "Nigeria", users: "4.2k", pct: 45, color: "bg-emerald-500" },
                    { country: "Kenya", users: "2.1k", pct: 25, color: "bg-z-blue" },
                    { country: "Ghana", users: "1.5k", pct: 18, color: "bg-z-red" },
                    { country: "Egypt", users: "800", pct: 12, color: "bg-purple-500" },
                 ].map(g => (
                    <div key={g.country} className="flex items-center space-x-4">
                       <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-[10px] font-black text-zinc-400">{g.country.slice(0,2).toUpperCase()}</div>
                       <div className="flex-grow">
                          <div className="flex justify-between items-center mb-1">
                             <span className="text-xs font-black text-zinc-800 uppercase tracking-tighter">{g.country}</span>
                             <span className="text-[10px] font-bold text-zinc-400">{g.users}</span>
                          </div>
                          <div className="h-1.5 bg-zinc-50 rounded-full overflow-hidden">
                             <div className={`h-full ${g.color}`} style={{ width: `${g.pct}%` }}></div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="mt-8 p-6 bg-zinc-50 rounded-3xl border border-zinc-100 text-center">
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Active Regions</p>
                 <p className="text-sm font-black text-zinc-800">14 Major Cities</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Top Courses */}
           <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-black text-zinc-800 tracking-tight">Trending Courses</h3>
                 </div>
                 <button className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-z-red">All Courses</button>
              </div>
              <div className="p-4">
                 <div className="space-y-2">
                    {courses.map((c) => (
                      <div key={c.id} className="group p-4 rounded-3xl hover:bg-zinc-50 transition-all flex items-center justify-between">
                         <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                               <BookOpen className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                               <h4 className="text-sm font-black text-zinc-800 tracking-tight">{c.title}</h4>
                               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{c._count.lessons} Lessons</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-black text-zinc-800">{c._count.enrollments}</p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Students</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Malpractice Heatmap (Simulated) */}
           <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl p-8 relative overflow-hidden">
              <div className="flex items-center space-x-3 mb-10">
                 <AlertCircle className="w-5 h-5 text-z-red" />
                 <h3 className="text-lg font-black text-zinc-800 tracking-tight">Security & Proctoring</h3>
              </div>

              <div className="flex items-center justify-center h-48 mb-10 group relative">
                 <div className="w-32 h-32 rounded-full border-[10px] border-zinc-50 border-t-z-red border-r-z-red group-hover:rotate-45 transition-transform duration-700"></div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-black text-zinc-800">24%</p>
                    <p className="text-[10px] font-black text-z-red uppercase tracking-widest">Alert Rate</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100">
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Phone Detection</p>
                    <p className="text-lg font-black text-red-600">342 Flags</p>
                 </div>
                 <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Out of Frame</p>
                    <p className="text-lg font-black text-amber-600">89 Flags</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
