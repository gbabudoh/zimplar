import React from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import {
  Building,
  HeartHandshake,
  Sprout,
  Coins,
  ArrowUpRight
} from "lucide-react";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";
import ClassroomRegionToggle from "@/components/dashboard/ClassroomRegionToggle";

export default async function NGOImpactHubPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  const managedClassrooms = await db.classroom.findMany({
    where: { teacherId: session.user.id },
    include: { students: true },
    orderBy: { createdAt: "desc" },
  });

  const dataAllocation = await db.dataAllocation.findUnique({
    where: { userId: session.user.id },
  });

  const recentTransactions = await db.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalSchools = managedClassrooms.length;
  const totalStudents = managedClassrooms.reduce((acc: number, c: { students: unknown[] }) => acc + c.students.length, 0);
  const ruralStudents = managedClassrooms
    .filter((c: { regionType: string }) => c.regionType === "RURAL")
    .reduce((acc: number, c: { students: unknown[] }) => acc + c.students.length, 0);
  const ruralInclusionRate = totalStudents > 0 ? Math.round((ruralStudents / totalStudents) * 100) : 0;

  const subsidyCapGB = dataAllocation?.subsidyCapGB ?? 0;
  const subsidyUsedGB = dataAllocation?.subsidyUsedGB ?? 0;
  const isSubsidized = subsidyCapGB > 0;
  const subsidyPercent = isSubsidized ? Math.round((subsidyUsedGB / subsidyCapGB) * 100) : 0;

  const maxClassroomStudents = Math.max(1, ...managedClassrooms.map((c: { students: unknown[] }) => c.students.length));

  const impactStats = [
    { label: "Partner Schools", value: String(totalSchools), icon: Building, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Rural Students", value: String(ruralStudents), icon: Sprout, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Rural Inclusion Rate", value: `${ruralInclusionRate}%`, icon: HeartHandshake, color: "text-z-red", bg: "bg-red-100" },
    { label: "Data Subsidy Used", value: isSubsidized ? `${subsidyPercent}%` : "N/A", icon: Coins, color: "text-z-gold", bg: "bg-yellow-100" },
  ];

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar role="ORG_ADMIN" />

      <main className="flex-grow p-10 ml-72">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-zinc-100">
                <HeartHandshake className="w-5 h-5 text-z-red" />
              </div>
              <h1 className="text-3xl font-black text-zinc-800 tracking-tight">
                Impact <span className="text-z-red">Hub</span>
              </h1>
            </div>
            <p className="text-zinc-600 font-medium ml-1">Manage donor relations and rural education subsidies.</p>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationDropdown />
            <button disabled title="Coming soon" className="px-6 py-3 bg-zinc-300 text-zinc-500 rounded-xl font-black text-xs uppercase tracking-widest cursor-not-allowed flex items-center space-x-2">
              <Coins className="w-4 h-4" />
              <span>Allocate Grant</span>
            </button>
          </div>
        </header>

        {/* Key Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impactStats.map((stat, i) => (
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
          <div className="lg:col-span-2 space-y-8">
            {/* Rural Reach Breakdown */}
            <div className="bg-zinc-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-white min-h-[400px]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-2xl font-black tracking-tight mb-1">Rural Reach Breakdown</h3>
                   <p className="text-zinc-400 text-sm font-medium">Student distribution across rural vs. urban classrooms.</p>
                </div>
                <div className="flex space-x-2">
                  <div className="bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-500/20">{totalSchools} Classrooms</div>
                </div>
              </div>

              {managedClassrooms.length > 0 ? (
                <div className="relative z-10 space-y-5">
                  {managedClassrooms.slice(0, 6).map((c: { id: string; name: string; students: unknown[]; regionType: string }) => (
                    <div key={c.id}>
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-xs font-black text-white tracking-tight flex items-center space-x-2">
                          <span>{c.name}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded uppercase tracking-widest ${c.regionType === "RURAL" ? "bg-amber-500/20 text-amber-400" : "bg-white/10 text-zinc-400"}`}>{c.regionType}</span>
                        </p>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{c.students.length} Students</p>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className={`h-full shadow-[0_0_20px_rgba(16,185,129,0.3)] ${c.regionType === "RURAL" ? "bg-gradient-to-r from-amber-500 to-z-gold" : "bg-gradient-to-r from-emerald-500 to-emerald-700"}`}
                          style={{ width: `${Math.round((c.students.length / maxClassroomStudents) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative z-10 w-full aspect-video bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <Sprout className="w-8 h-8 text-zinc-500 mx-auto" />
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">No classrooms yet</p>
                  </div>
                </div>
              )}
            </div>

            {/* Managed Classrooms */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-zinc-100">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-black text-zinc-800 tracking-tight">Managed Classrooms</h3>
                   <Link href="/dashboard/ngo/impact">
                      <button className="text-xs font-black text-z-blue border-b-2 border-z-blue/20 hover:border-z-blue transition-all pb-0.5">Full Analytics</button>
                   </Link>
                </div>

               <div className="space-y-4">
                  {managedClassrooms.length > 0 ? (
                    managedClassrooms.map((c: { id: string; name: string; students: unknown[]; regionType: "URBAN" | "RURAL" }) => (
                      <div key={c.id} className="flex items-center justify-between p-6 bg-zinc-50 rounded-3xl border border-zinc-100 hover:bg-white hover:shadow-lg transition-all group">
                         <div className="flex items-center space-x-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-zinc-400 group-hover:text-emerald-500 transition-colors">
                               <Sprout className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="text-lg font-black text-zinc-800">{c.name}</p>
                               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{c.students.length} Students Supported</p>
                            </div>
                         </div>
                         <div className="flex items-center space-x-4 text-right">
                            <ClassroomRegionToggle classroomId={c.id} regionType={c.regionType} />
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Building className="w-10 h-10 text-zinc-200 mx-auto mb-4" />
                      <p className="text-sm font-bold text-zinc-400">No classrooms managed yet.</p>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Subsidiary Sidebar */}
          <div className="space-y-8">
             {/* Data Subsidy */}
             <div className="bg-zinc-950 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-z-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center space-x-3 mb-8 relative z-10">
                  <Coins className="w-5 h-5 text-z-gold" />
                  <h3 className="text-lg font-black text-white tracking-tight">Data Subsidy</h3>
                </div>

                {isSubsidized ? (
                  <div className="space-y-6 relative z-10">
                     <div>
                        <div className="flex justify-between items-end mb-3">
                           <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Subsidy Used</p>
                           <p className="text-2xl font-black text-white">{subsidyUsedGB.toFixed(1)} / {subsidyCapGB.toFixed(1)} GB</p>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                           <div className="h-full bg-gradient-to-r from-z-gold to-emerald-500 shadow-[0_0_20px_rgba(255,215,0,0.3)]" style={{ width: `${subsidyPercent}%` }}></div>
                        </div>
                     </div>

                     <Link href="/dashboard/billing">
                       <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all">
                          Review Billing
                       </button>
                     </Link>
                  </div>
                ) : (
                  <div className="relative z-10 text-center py-6">
                     <p className="text-sm font-black text-zinc-400 mb-1">No Active Subsidy</p>
                     <p className="text-[10px] font-medium text-zinc-600 max-w-xs mx-auto">Government and Charity plans unlock subsidized data usage automatically.</p>
                  </div>
                )}
             </div>

             {/* Recent Activity */}
             <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-zinc-100">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-lg font-black text-zinc-800 tracking-tight">Recent Activity</h3>
                   <Link href="/dashboard/org/audit">
                      <div className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-emerald-500 hover:text-white transition-all">Full Audit</div>
                   </Link>
                </div>

                <div className="space-y-6">
                   {recentTransactions.length > 0 ? (
                     recentTransactions.map((tx: { id: string; createdAt: Date; type: string; currency: string; amount: number; status: string; reference: string | null }) => (
                       <div key={tx.id} className="relative pl-6 border-l-2 border-zinc-100 last:border-0 pb-2">
                          <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                            {new Date(tx.createdAt).toLocaleDateString()} — {tx.type}
                          </p>
                          <p className="text-xs font-bold text-zinc-800 leading-tight">
                            {tx.currency} {tx.amount.toFixed(2)} • {tx.status}
                          </p>
                          {tx.reference && (
                            <p className="text-[9px] text-z-blue font-black mt-1 uppercase tracking-tighter">Ref: {tx.reference}</p>
                          )}
                       </div>
                     ))
                   ) : (
                     <div className="text-center py-8">
                       <p className="text-xs font-bold text-zinc-400">No recent activity.</p>
                     </div>
                   )}
                </div>
             </div>

             {/* Quick Actions */}
             <div className="p-1.5 bg-zinc-50 rounded-[2.5rem] border border-zinc-100">
                <div className="flex flex-col space-y-1">
                   <Link href="/dashboard/ngo/schools">
                      <button className="w-full flex items-center justify-between p-6 bg-white rounded-[2rem] hover:bg-emerald-600 hover:text-white transition-all group shadow-sm">
                         <div className="flex items-center space-x-4">
                            <Sprout className="w-5 h-5 text-emerald-600 group-hover:text-white" />
                            <span className="font-bold text-sm tracking-tight">Partner Schools</span>
                         </div>
                         <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                   </Link>
                   <Link href="/dashboard/billing">
                      <button className="w-full flex items-center justify-between p-6 bg-white/50 rounded-[2rem] hover:bg-zinc-900 hover:text-white transition-all group">
                         <div className="flex items-center space-x-4 text-zinc-600 group-hover:text-white">
                            <Coins className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-tight text-zinc-700 group-hover:text-white">Subsidy Billing</span>
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
