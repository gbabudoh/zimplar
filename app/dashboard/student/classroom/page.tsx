import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { 
  Video, 
  Search, 
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  AlertCircle,
  MoreVertical
} from "lucide-react";

export default async function StudentClassroomPortal() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  // Fetch classrooms the student belongs to
  const classroomMemberships = await db.classroomUser.findMany({
    where: { userId: session.user.id },
    include: {
      classroom: {
        include: {
          teacher: true,
          students: true,
          courses: true,
        },
      },
    },
  });

  const classrooms = classroomMemberships.map((m) => ({
    id: m.classroom.id,
    name: m.classroom.name,
    course: m.classroom.courses?.[0]?.title || "General",
    students: m.classroom.students?.length || 0,
    instructor: m.classroom.teacher?.name || "Instructor",
    avatar: (m.classroom.teacher?.name || "IN").slice(0, 2).toUpperCase(),
    joinedAt: m.joinedAt,
  }));

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar role="STUDENT" />
      
      <main className="flex-grow p-12 ml-72">
        {/* Modern Header */}
        <header className="flex justify-between items-end mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-z-red tracking-tighter leading-none">Classrooms</h1>
            <div className="flex items-center space-x-3 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em]">
              <span>Active Learning Rooms</span>
              <span className="w-1.5 h-1.5 bg-z-red/20 rounded-full"></span>
              <span className="text-z-red/60">Live Hub</span>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <button className="flex items-center space-x-2 text-zinc-400 hover:text-z-red transition-colors group">
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Room History</span>
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {[
            { label: "Enrolled Classrooms", value: String(classrooms.length), icon: <Video className="w-6 h-6" />, color: "text-z-red", bg: "bg-z-red/10" },
            { label: "Active Streak", value: "—", icon: <Sparkles className="w-6 h-6" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Missed Sessions", value: "—", icon: <AlertCircle className="w-6 h-6" />, color: "text-amber-500", bg: "bg-amber-500/10" },
          ].map((stat, i) => (
             <div key={i} className="glass-card p-8 rounded-[2.5rem] flex items-center space-x-6 group hover:translate-y-[-4px] transition-all duration-500 premium-shadow">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl shadow-sm`}>
                   {stat.icon}
                </div>
                <div>
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                   <h3 className="text-2xl font-black text-zinc-800 tracking-tight">{stat.value}</h3>
                </div>
             </div>
          ))}
        </div>

        {/* Classroom Grid */}
        <div className="space-y-8">
          <div className="flex justify-between items-end px-2">
            <h2 className="text-2xl font-black text-z-red tracking-tight">Your Classrooms</h2>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              {classrooms.length > 0 ? `${classrooms.length} classroom${classrooms.length > 1 ? "s" : ""} enrolled` : "No classrooms yet"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {classrooms.length > 0 ? (
              classrooms.map((room) => (
                <div key={room.id} className="glass-card p-10 rounded-[3rem] group hover:translate-y-[-4px] transition-all duration-500 premium-shadow relative overflow-hidden flex flex-col justify-between min-h-[340px]">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                       <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border bg-zinc-100 border-zinc-200 text-zinc-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                          <span className="text-[10px] font-black tracking-widest uppercase">Enrolled</span>
                       </div>
                       <button className="text-zinc-500 hover:text-z-red transition-colors p-2">
                          <MoreVertical className="w-5 h-5" />
                       </button>
                    </div>

                    <div className="space-y-2 mb-8">
                       <h3 className="text-3xl font-black text-zinc-800 tracking-tighter leading-tight group-hover:text-z-red transition-colors">{room.name}</h3>
                       <p className="text-sm font-bold text-zinc-500">{room.course}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-100/50">
                       <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-z-red/10 text-z-red flex items-center justify-center font-black text-xs">
                             {room.avatar}
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-zinc-400 uppercase leading-none mb-1">Instructor</p>
                             <p className="text-xs font-black text-zinc-800">{room.instructor}</p>
                          </div>
                       </div>
                       <div className="flex items-center space-x-4">
                          <div className="bg-zinc-50 p-3 rounded-2xl text-zinc-400">
                             <Clock className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-zinc-400 uppercase leading-none mb-1">Students</p>
                             <p className="text-xs font-black text-zinc-800">{room.students} enrolled</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="pt-8 relative z-10">
                    <Link href={`/classroom/${room.id}`}>
                       <button className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 bg-z-red text-white shadow-xl shadow-z-red/20 hover:scale-[1.02] cursor-pointer">
                          <Video className="w-4 h-4" />
                          <span>Enter Classroom</span>
                       </button>
                    </Link>
                  </div>

                  {/* Subtle background icon */}
                  <Video className="absolute -bottom-10 -right-10 w-48 h-48 text-zinc-500/5 group-hover:text-z-red/5 transition-colors duration-1000 rotate-12" />
                </div>
              ))
            ) : (
              <div className="glass-card rounded-[3rem] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center p-16 col-span-2 group hover:border-z-red/30 hover:bg-z-red/[0.02] transition-all duration-500">
                 <div className="bg-zinc-50 p-6 rounded-[2rem] text-zinc-300 group-hover:text-z-red group-hover:bg-z-red/5 transition-all mb-6">
                    <Video className="w-10 h-10" />
                 </div>
                 <h4 className="text-xl font-black text-zinc-400 group-hover:text-z-red transition-colors tracking-tight">No Classrooms Yet</h4>
                 <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mt-2 text-center max-w-[280px]">You haven&apos;t been added to any classrooms. Contact your teacher or admin to get enrolled.</p>
              </div>
            )}

            {/* Support Card */}
            {classrooms.length > 0 && (
              <div className="glass-card rounded-[3rem] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center p-12 group hover:border-z-red/30 hover:bg-z-red/[0.02] transition-all duration-500">
                 <div className="bg-zinc-50 p-6 rounded-[2rem] text-zinc-300 group-hover:text-z-red group-hover:bg-z-red/5 transition-all mb-6">
                    <ShieldCheck className="w-10 h-10" />
                 </div>
                 <h4 className="text-xl font-black text-zinc-400 group-hover:text-z-red transition-colors tracking-tight">Need Support?</h4>
                 <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mt-2 text-center max-w-[200px]">Contact Admin if you are unable to access your assigned rooms.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
