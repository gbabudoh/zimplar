import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import {
  Building,
  Plus,
  Search,
  Sprout,
  Coins,
  Filter
} from "lucide-react";

export default async function NGOImpactSchoolsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  const ruralClassrooms = await db.classroom.findMany({
    where: { teacherId: session.user.id, regionType: "RURAL" },
    include: {
      students: true,
      courses: { include: { lessons: { include: { videoSessions: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const dataAllocation = await db.dataAllocation.findUnique({
    where: { userId: session.user.id },
  });
  const isSubsidized = (dataAllocation?.subsidyCapGB ?? 0) > 0;

  const since24h = Date.now() - 24 * 60 * 60 * 1000;
  const classrooms = ruralClassrooms.map((c: { id: string; name: string; students: unknown[]; courses: { lessons: { videoSessions: { createdAt: Date }[] }[] }[] }) => {
    const activeStreams = c.courses.reduce(
      (acc: number, course) =>
        acc + course.lessons.reduce(
          (lessonAcc: number, lesson) => lessonAcc + lesson.videoSessions.filter((vs) => vs.createdAt.getTime() >= since24h).length,
          0
        ),
      0
    );
    return { id: c.id, name: c.name, students: c.students.length, activeStreams };
  });

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar role="ORG_ADMIN" />

      <main className="flex-grow p-10 ml-72">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-zinc-100">
                <Sprout className="w-5 h-5 text-emerald-500" />
              </div>
              <h1 className="text-3xl font-black text-zinc-800 tracking-tight">
                Impact <span className="text-emerald-600">Nodes</span>
              </h1>
            </div>
            <p className="text-zinc-600 font-medium ml-1">Monitor rural classrooms and their data subsidy status.</p>
          </div>

          <button disabled title="Coming soon" className="px-8 py-4 bg-zinc-300 text-zinc-500 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed flex items-center space-x-3">
            <Plus className="w-5 h-5" />
            <span>Identify New Node</span>
          </button>
        </header>

        {/* Search and Filters */}
        <div className="mb-8 flex space-x-4">
           <div className="relative flex-grow group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                disabled
                title="Coming soon"
                type="text"
                placeholder="Search rural nodes..."
                className="w-full bg-zinc-50 border border-zinc-100 rounded-[2rem] py-5 pl-16 pr-8 font-medium text-zinc-400 cursor-not-allowed"
              />
           </div>
           <button disabled title="Coming soon" className="px-8 bg-zinc-200 text-zinc-400 rounded-[2rem] font-bold cursor-not-allowed flex items-center space-x-2">
             <Filter className="w-4 h-4" />
             <span>Status: All Active</span>
           </button>
        </div>

        {/* Classrooms Grid */}
        {classrooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {classrooms.map((school) => (
               <div key={school.id} className="bg-white/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/50 shadow-2xl hover:bg-white transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex justify-between items-start mb-8 relative z-10">
                     <div className="flex items-center space-x-4">
                        <div className="bg-zinc-100 p-4 rounded-[1.5rem] group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                           <Building className="w-8 h-8" />
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-zinc-800 tracking-tight">{school.name}</h3>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                     <div className="bg-zinc-50 p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em] mb-1">Students</p>
                        <p className="text-lg font-black text-zinc-800">{school.students}</p>
                     </div>
                     <div className="bg-zinc-50 p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em] mb-1">Active Streams (24h)</p>
                        <p className="text-lg font-black text-zinc-800">{school.activeStreams}</p>
                     </div>
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-zinc-100 relative z-10">
                     <div className="flex space-x-2">
                        <div className="px-3 py-1 bg-amber-100 rounded-lg flex items-center space-x-1.5" title="Rural Impact Node">
                           <Sprout className="w-3 h-3 text-amber-600" />
                           <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Rural</span>
                        </div>

                        {isSubsidized ? (
                           <div className="px-3 py-1 bg-emerald-100 rounded-lg flex items-center space-x-1.5" title="Data Subsidy Active">
                              <Coins className="w-3 h-3 text-emerald-600" />
                              <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Subsidized</span>
                           </div>
                        ) : (
                           <div className="px-3 py-1 bg-zinc-100 rounded-lg flex items-center space-x-1.5" title="No active data subsidy on this account">
                              <Coins className="w-3 h-3 text-zinc-400" />
                              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Not Subsidized</span>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white/40 backdrop-blur-2xl rounded-[3rem] border border-white/50 shadow-2xl py-24 px-12 text-center">
             <div className="bg-zinc-100 p-6 rounded-[2rem] mb-6">
                <Sprout className="w-12 h-12 text-zinc-400" />
             </div>
             <h3 className="text-2xl font-black text-zinc-800 tracking-tight mb-2">No Rural Nodes Yet</h3>
             <p className="text-zinc-500 font-medium max-w-md">Tag a managed classroom as "Rural" from the Impact Hub to see it tracked here.</p>
          </div>
        )}
      </main>
    </div>
  );
}
