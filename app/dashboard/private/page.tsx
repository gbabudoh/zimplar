import React from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
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
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";

export default async function PrivateSchoolDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  const managedClassrooms = await db.classroom.findMany({
    where: { teacherId: session.user.id },
    include: { students: true },
  });
  const totalEnrollment = managedClassrooms.reduce((acc: number, c: { students: unknown[] }) => acc + c.students.length, 0);

  const schoolStats = [
    { label: "Total Enrollment", value: String(totalEnrollment), icon: Users, color: "text-z-blue", bg: "bg-z-blue/20", available: true },
    { label: "Parent Opt-in", value: "—", icon: Smartphone, color: "text-emerald-700", bg: "bg-emerald-500/20", available: false },
    { label: "CRM Leads", value: "—", icon: TrendingUp, color: "text-purple-700", bg: "bg-purple-500/20", available: false },
    { label: "Tuition Health", value: "—", icon: ShieldCheck, color: "text-z-gold", bg: "bg-z-gold/20", available: false },
  ];

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

          <div className="flex items-center space-x-4">
            <NotificationDropdown />
            <button disabled title="Coming soon" className="px-6 py-3 bg-zinc-300 text-zinc-500 rounded-xl font-black text-xs uppercase tracking-widest cursor-not-allowed flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Launch Campaign</span>
            </button>
          </div>
        </header>

        {/* School-specific Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {schoolStats.map((stat, i) => (
            <div key={i} className="p-8 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-xl shadow-z-blue/5 hover:bg-white transition-all group">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                <stat.icon className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em]">{stat.label}</p>
                {!stat.available && (
                  <span className="text-[8px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded uppercase tracking-widest">Soon</span>
                )}
              </div>
              <h3 className={`text-3xl font-black tracking-tight ${stat.available ? "text-zinc-800" : "text-zinc-300"}`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CRM & Growth Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-white min-h-[300px]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-z-blue/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-2xl font-black tracking-tight mb-1">CRM Funnel Insights</h3>
                   <p className="text-zinc-200 text-sm font-semibold">Tracking prospective student leads and conversion rates.</p>
                </div>
                <div className="flex space-x-2">
                  <div className="bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-500/20">Coming Soon</div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center py-12">
                 <TrendingUp className="w-10 h-10 text-zinc-600 mb-4" />
                 <p className="text-sm font-black text-zinc-400 tracking-tight mb-1">CRM Lead Tracking Not Yet Available</p>
                 <p className="text-[10px] font-medium text-zinc-600 max-w-xs text-center">Prospective student lead tracking isn&apos;t built yet.</p>
              </div>
            </div>

            {/* Parent Portal Feed */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-zinc-100">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-black text-zinc-800 tracking-tight">Parent Portal Activity</h3>
                   <button disabled title="Coming soon" className="text-xs font-black text-zinc-300 cursor-not-allowed">Push Notify All</button>
                </div>

                <div className="text-center py-12">
                   <Smartphone className="w-10 h-10 text-zinc-200 mx-auto mb-4" />
                   <p className="text-sm font-bold text-zinc-400">Parent portal accounts aren&apos;t available yet.</p>
                   <p className="text-[10px] text-zinc-300 font-medium mt-1">Parent-facing activity will appear here once parent accounts are supported.</p>
                </div>
            </div>
          </div>

          {/* School Identity Sidebar */}
          <div className="space-y-8">
             {/* Brand Strength */}
             <div className="bg-zinc-950 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-z-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center space-x-3">
                    <Palette className="w-5 h-5 text-z-red" />
                    <h3 className="text-lg font-black text-white tracking-tight">Brand Identity</h3>
                  </div>
                  <span className="text-[8px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase tracking-widest">Soon</span>
                </div>

                <div className="relative z-10 text-center py-6">
                   <p className="text-sm font-black text-zinc-400 mb-1">Branding & Impression Tracking</p>
                   <p className="text-[10px] font-medium text-zinc-600 max-w-xs mx-auto">Logo uploads and impression analytics aren&apos;t available yet.</p>
                </div>

                <button disabled title="Coming soon" className="w-full py-4 bg-white/5 text-zinc-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/5 cursor-not-allowed relative z-10">
                   Open Customizer
                </button>
             </div>

             {/* CRM Overview */}
             <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-zinc-100">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-lg font-black text-zinc-800 tracking-tight">Revenue CRM</h3>
                   <span className="text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded uppercase tracking-widest">Soon</span>
                </div>

                <div className="text-center py-8">
                   <p className="text-sm font-bold text-zinc-400">Tuition and fee tracking aren&apos;t available yet.</p>
                </div>

                <button disabled title="Coming soon" className="w-full mt-4 py-4 bg-zinc-100 text-zinc-400 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed">
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
