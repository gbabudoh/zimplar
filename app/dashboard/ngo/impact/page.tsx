import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import {
  BarChart3,
  Globe,
  Calendar,
  HeartHandshake,
  Download,
  Users,
  Coins
} from "lucide-react";

export default async function NGOImpactAnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  const managedClassrooms = await db.classroom.findMany({
    where: { teacherId: session.user.id },
    include: { students: true, courses: { include: { lessons: { include: { videoSessions: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  const dataAllocation = await db.dataAllocation.findUnique({
    where: { userId: session.user.id },
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

  const impactMetrics = [
    { label: "Students Reached", value: String(totalStudents) },
    { label: "Rural Inclusion Rate", value: `${ruralInclusionRate}%` },
    { label: "Subsidy Utilization", value: isSubsidized ? `${subsidyPercent}%` : "N/A" },
    { label: "Partner Schools", value: String(totalSchools) },
  ];

  const mostActiveClassroom = managedClassrooms
    .map((c: { name: string; courses: { lessons: { videoSessions: unknown[] }[] }[] }) => ({
      name: c.name,
      sessions: c.courses.reduce((acc: number, course) => acc + course.lessons.reduce((a: number, l) => a + l.videoSessions.length, 0), 0),
    }))
    .sort((a: { sessions: number }, b: { sessions: number }) => b.sessions - a.sessions)[0];

  const newestRuralClassroom = managedClassrooms.find((c: { regionType: string }) => c.regionType === "RURAL");

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
             <button disabled title="Coming soon" className="px-8 py-4 bg-emerald-50/50 text-emerald-400 border border-emerald-100 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed flex items-center space-x-2">
               <Download className="w-4 h-4" />
               <span>Export Donor Report (PDF)</span>
             </button>
             <button disabled title="Coming soon" className="px-8 py-4 bg-zinc-200 text-zinc-400 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed flex items-center space-x-3">
               <Calendar className="w-4 h-4" />
               <span>FY 2025-2026</span>
             </button>
          </div>
        </header>

        {/* Impact Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impactMetrics.map((stat, i) => (
            <div key={i} className="p-8 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-xl hover:bg-white transition-all group">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h3 className="text-3xl font-black text-zinc-800 tracking-tight">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Real Highlights */}
           <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 shadow-xl border border-zinc-100 relative overflow-hidden">
              <div className="flex justify-between items-start mb-8 z-10 relative">
                 <div>
                    <h3 className="text-2xl font-black text-zinc-800 tracking-tight mb-1">Network Highlights</h3>
                    <p className="text-zinc-500 text-sm font-medium">Computed from your managed classrooms.</p>
                 </div>
                 <HeartHandshake className="w-8 h-8 text-z-red opacity-80" />
              </div>

              <div className="grid grid-cols-2 gap-6 relative z-10">
                  <div className="p-6 bg-zinc-50 rounded-3xl group hover:bg-zinc-900 transition-colors">
                      <div className="flex items-center space-x-3 mb-4">
                          <Users className="w-5 h-5 text-z-blue group-hover:text-white" />
                          <h4 className="font-bold text-zinc-800 group-hover:text-white">Most Active Classroom</h4>
                      </div>
                      {mostActiveClassroom ? (
                        <p className="text-sm text-zinc-500 group-hover:text-zinc-400">
                          <span className="text-zinc-900 group-hover:text-white font-black">{mostActiveClassroom.name}</span> logged {mostActiveClassroom.sessions} video session{mostActiveClassroom.sessions === 1 ? "" : "s"}.
                        </p>
                      ) : (
                        <p className="text-sm text-zinc-500 group-hover:text-zinc-400">No video session activity recorded yet.</p>
                      )}
                  </div>
                  <div className="p-6 bg-zinc-50 rounded-3xl group hover:bg-zinc-900 transition-colors">
                      <div className="flex items-center space-x-3 mb-4">
                          <Globe className="w-5 h-5 text-emerald-500 group-hover:text-white" />
                          <h4 className="font-bold text-zinc-800 group-hover:text-white">Rural Reach</h4>
                      </div>
                      {newestRuralClassroom ? (
                        <p className="text-sm text-zinc-500 group-hover:text-zinc-400">
                          <span className="text-zinc-900 group-hover:text-white font-black">{newestRuralClassroom.name}</span> is tagged as a rural impact node.
                        </p>
                      ) : (
                        <p className="text-sm text-zinc-500 group-hover:text-zinc-400">No classrooms tagged Rural yet. Tag one from the Impact Hub.</p>
                      )}
                  </div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-z-red/5 rounded-full blur-3xl"></div>
           </div>

           {/* Data Subsidy */}
           <div className="bg-zinc-900 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden text-white flex flex-col">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50"></div>

              <div className="relative z-10 mb-8">
                 <h3 className="text-xl font-black tracking-tight mb-2">Data Subsidy</h3>
                 <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">Bandwidth covered by your subsidy pool</p>
              </div>

              {isSubsidized ? (
                <div className="relative z-10 space-y-4 flex-grow flex flex-col justify-center">
                   <div className="flex justify-between items-end mb-1">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Used</p>
                      <p className="text-xl font-black text-white">{subsidyUsedGB.toFixed(1)} / {subsidyCapGB.toFixed(1)} GB</p>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-gradient-to-r from-z-gold to-emerald-500 shadow-[0_0_20px_rgba(255,215,0,0.3)]" style={{ width: `${subsidyPercent}%` }}></div>
                   </div>
                </div>
              ) : (
                <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center">
                   <Coins className="w-10 h-10 text-zinc-600 mb-4" />
                   <p className="text-sm font-black text-zinc-400 mb-1">No Active Subsidy</p>
                   <p className="text-[10px] font-medium text-zinc-600 max-w-xs">Government and Charity plans unlock subsidized data usage automatically.</p>
                </div>
              )}
           </div>
        </div>
      </main>
    </div>
  );
}
