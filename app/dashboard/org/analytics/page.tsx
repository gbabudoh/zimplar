import React from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import {
  BarChart3,
  Globe,
  HardDrive,
  Download,
  HeartHandshake,
  Calendar
} from "lucide-react";

export default async function RegionalAnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  const managedClassrooms = await db.classroom.findMany({
    where: { teacherId: session.user.id },
    include: { students: true },
  });

  const dataAllocation = await db.dataAllocation.findUnique({
    where: { userId: session.user.id },
  });

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const dailyVideoSessions = await db.videoSession.count({
    where: {
      createdAt: { gte: since24h },
      lesson: { course: { teacherId: session.user.id } },
    },
  });

  const totalStudents = managedClassrooms.reduce((acc: number, c: { students: unknown[] }) => acc + c.students.length, 0);
  const ruralStudents = managedClassrooms
    .filter((c: { regionType: string }) => c.regionType === "RURAL")
    .reduce((acc: number, c: { students: unknown[] }) => acc + c.students.length, 0);
  const ruralInclusionRate = totalStudents > 0 ? Math.round((ruralStudents / totalStudents) * 100) : 0;

  const usedGB = dataAllocation?.usedGB ?? 0;
  const totalCapGB = dataAllocation?.totalCapGB ?? 5;
  const usagePercent = totalCapGB > 0 ? Math.round((usedGB / totalCapGB) * 100) : 0;

  const subsidyCapGB = dataAllocation?.subsidyCapGB ?? 0;
  const subsidyUsedGB = dataAllocation?.subsidyUsedGB ?? 0;
  const isSubsidized = subsidyCapGB > 0;
  const subsidyUtilization = isSubsidized ? Math.round((subsidyUsedGB / subsidyCapGB) * 100) : null;

  const stats = [
    { label: "Active Regional Learners", value: String(totalStudents), available: true },
    { label: "Daily Video Sessions", value: String(dailyVideoSessions), available: true },
    { label: "Rural Inclusion Rate", value: `${ruralInclusionRate}%`, available: true },
    { label: "Subsidy Utilization", value: isSubsidized ? `${subsidyUtilization}%` : "N/A", available: true },
  ];

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
                Regional <span className="text-z-red">Analytics</span>
              </h1>
            </div>
            <p className="text-zinc-600 font-medium ml-1">Aggregated engagement and impact trends across all deployment zones.</p>
          </div>

          <div className="flex space-x-4">
             <button disabled title="Coming soon" className="px-8 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-black text-xs uppercase tracking-widest text-zinc-400 cursor-not-allowed flex items-center space-x-2">
               <Download className="w-4 h-4" />
               <span>Export Government Report</span>
             </button>
             <button disabled title="Coming soon" className="px-8 py-4 bg-emerald-50/50 text-emerald-400 border border-emerald-100 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed flex items-center space-x-2">
               <HeartHandshake className="w-4 h-4" />
               <span>Donor Impact Report</span>
             </button>
             <button disabled title="Coming soon" className="px-8 py-4 bg-zinc-200 text-zinc-400 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed flex items-center space-x-3">
               <Calendar className="w-4 h-4" />
               <span>Range: 30 Days</span>
             </button>
          </div>
        </header>

        {/* Impact Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="p-8 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-xl hover:bg-white transition-all group">
               <div className="flex items-center justify-between mb-2">
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
                 {!stat.available && (
                   <span className="text-[8px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded uppercase tracking-widest">Soon</span>
                 )}
               </div>
              <div className="flex items-end justify-between">
                 <h3 className={`text-3xl font-black tracking-tight ${stat.available ? "text-zinc-800" : "text-zinc-300"}`}>{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Regional Data Quotas */}
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

              {dataAllocation ? (
                <div className="relative z-10 space-y-4">
                   <div className="flex justify-between items-end mb-1">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Storage Quota</p>
                      <p className="text-2xl font-black text-white">{usedGB.toFixed(1)} / {totalCapGB.toFixed(1)} GB</p>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-gradient-to-r from-z-red to-z-gold shadow-[0_0_20px_rgba(255,27,47,0.3)]" style={{ width: `${usagePercent}%` }}></div>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 relative z-10">
                   <HardDrive className="w-10 h-10 text-zinc-600 mb-4" />
                   <p className="text-sm font-black text-zinc-400 tracking-tight mb-1">No Regional Data Yet</p>
                   <p className="text-[10px] font-medium text-zinc-600 max-w-xs text-center">Region usage data will appear here once schools are provisioned and streaming.</p>
                </div>
              )}

              <Link href="/dashboard/billing">
                <button className="w-full mt-12 py-5 bg-white/5 hover:bg-white/10 text-white rounded-3xl font-black text-xs uppercase tracking-widest border border-white/10 transition-all flex items-center justify-center space-x-3">
                   <span>Review Billing</span>
                </button>
              </Link>
           </div>

           {/* Impact Density — Coming Soon */}
           <div className="bg-white rounded-[3.5rem] p-10 shadow-xl border border-zinc-100 flex flex-col">
              <div className="flex justify-between items-start mb-12">
                 <div>
                    <h3 className="text-2xl font-black text-zinc-800 tracking-tight mb-1">Impact Density</h3>
                    <p className="text-zinc-500 text-sm font-medium">Correlation between digital access and student outcomes.</p>
                 </div>
                 <Globe className="w-8 h-8 text-z-blue" />
              </div>

              <div className="flex-grow flex items-center justify-center">
                 <div className="text-center">
                    <div className="w-32 h-32 bg-z-blue/5 rounded-full flex items-center justify-center mb-6">
                        <Globe className="w-12 h-12 text-z-blue/40" />
                    </div>
                    <div className="bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 inline-block">Coming Soon</div>
                    <h4 className="font-black text-zinc-800 text-xl mb-1">Impact Curve Not Yet Available</h4>
                    <p className="text-[10px] text-zinc-500 font-medium max-w-xs mx-auto">This correlation requires outcome data we don&apos;t yet collect.</p>
                 </div>
              </div>

              <div className="mt-auto pt-10 border-t border-zinc-50">
                 <Link href="/dashboard/org/audit">
                    <button className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] hover:text-z-red transition-all">View Audit Ledger</button>
                 </Link>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
