import React from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Plus, 
  Video, 
  Search, 
  ChevronRight,
  MoreVertical,
  ShieldCheck
} from "lucide-react";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";
import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export default async function TeacherDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "TEACHER" && role !== "ADMIN") {
    redirect("/login");
  }

  const teacherId = session.user.id;

  // 1. Fetch Dynamic Statistics from Database
  // Courses Hosted
  const coursesCount = await db.course.count({
    where: { teacherId },
  });

  // Active Learners (Total enrollment entries across teacher's courses)
  const activeLearnersCount = await db.enrollment.count({
    where: {
      course: { teacherId },
    },
  });

  // Avg. Proficiency (Average progress percentage across enrollments)
  const averageProgressData = await db.enrollment.aggregate({
    where: {
      course: { teacherId },
    },
    _avg: {
      progress: true,
    },
  });
  const avgProficiency = Math.round(averageProgressData._avg.progress || 0);

  // Alumni Count (Enrollments marked as COMPLETED)
  const alumniCount = await db.enrollment.count({
    where: {
      course: { teacherId },
      status: "COMPLETED",
    },
  });

  // 2. Fetch Pending Grading Submissions from Database
  const pendingSubmissions = await db.submission.findMany({
    where: {
      status: "PENDING",
      OR: [
        {
          assignment: {
            lesson: {
              course: { teacherId },
            },
          },
        },
        {
          assessment: {
            course: { teacherId },
          },
        },
      ],
    },
    include: {
      student: true,
      assignment: {
        include: {
          lesson: {
            include: {
              course: true,
            },
          },
        },
      },
      assessment: {
        include: {
          course: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  // Map submissions to dashboard display format
  const submissions = pendingSubmissions.map((sub) => {
    const studentName = sub.student.name || sub.student.email || "Student";
    const title = sub.assignment?.title || sub.assessment?.title || "Class Task";
    const initial = studentName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "ST";

    const colorSchemes = [
      "bg-blue-100 text-blue-600",
      "bg-rose-100 text-rose-600",
      "bg-gold-100 text-gold-600",
      "bg-emerald-100 text-emerald-600",
      "bg-purple-100 text-purple-600"
    ];
    const charCodeSum = studentName.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const color = colorSchemes[charCodeSum % colorSchemes.length];

    // Simple time-ago formatter
    const msDiff = Date.now() - sub.createdAt.getTime();
    const minDiff = Math.floor(msDiff / 60000);
    const hourDiff = Math.floor(minDiff / 60);
    let timeAgo = "Just now";
    if (minDiff >= 1 && minDiff < 60) timeAgo = `${minDiff}m ago`;
    else if (hourDiff >= 1 && hourDiff < 24) timeAgo = `${hourDiff}h ago`;
    else if (hourDiff >= 24) timeAgo = `${Math.floor(hourDiff / 24)}d ago`;

    return {
      id: sub.id,
      name: studentName,
      title,
      time: timeAgo,
      initial,
      color,
    };
  });

  // 3. Fetch Live Session / Upcoming Class
  const liveLesson = await db.lesson.findFirst({
    where: {
      course: { teacherId },
      NOT: [
        { videoUrl: null },
        { videoUrl: "" }
      ]
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      course: true,
    },
  });

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar role="TEACHER" />
      
      <main className="flex-grow p-12 ml-72">
        {/* Minimalist Modern Header */}
        <header className="flex justify-between items-end mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-z-red tracking-tighter leading-none">Overview</h1>
            <div className="flex items-center space-x-3 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em]">
              <span>Spring Term</span>
              <span className="w-1.5 h-1.5 bg-z-red/20 rounded-full"></span>
              <span className="text-z-red/60">2026 Admin</span>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-z-red transition-all" />
              <input 
                type="text" 
                placeholder="Search..."
                className="bg-transparent border-b border-zinc-200 py-2 pl-8 pr-4 text-sm font-medium focus:outline-none focus:border-z-red w-40 focus:w-64 transition-all"
              />
            </div>
            
            <NotificationDropdown />

            <Link href="/dashboard/teacher/courses/new">
              <button className="flex items-center space-x-3 bg-z-red text-white pr-6 pl-5 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] hover:bg-z-red/90 transition-all shadow-2xl shadow-z-red/20 group cursor-pointer">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                <span>Create New</span>
              </button>
            </Link>
          </div>
        </header>

        {/* Stats Grid - Dynamic Database Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {[
            { label: "Active Learners", value: activeLearnersCount.toLocaleString(), icon: <Users />, color: "text-z-blue", trend: "Enrolled" },
            { label: "Courses Hosted", value: coursesCount.toString(), icon: <BookOpen />, color: "text-z-red", trend: "Created" },
            { label: "Avg. Proficiency", value: `${avgProficiency}%`, icon: <TrendingUp />, color: "text-emerald-500", trend: "Completion" },
            { label: "Alumni Count", value: alumniCount.toString(), icon: <GraduationCap />, color: "text-z-gold", trend: "Graduates" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-10 rounded-[3rem] flex flex-col group hover:translate-y-[-4px] transition-all duration-500 cursor-pointer overflow-hidden relative">
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="text-zinc-400 group-hover:text-z-red transition-colors">
                  {React.cloneElement(stat.icon, { className: "w-8 h-8" })}
                </div>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.trend}</span>
              </div>
              
              <div className="relative z-10">
                <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.25em] mb-2">{stat.label}</p>
                <h3 className="text-4xl font-black text-zinc-800 tracking-tight">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Submissions Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-end px-2">
              <h2 className="text-2xl font-black text-z-red tracking-tight">Pending Grading</h2>
              <Link href="/dashboard/teacher/grading">
                <button className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b-2 border-z-red pb-1 hover:text-z-red transition-colors cursor-pointer">Full Roster</button>
              </Link>
            </div>
            
            <div className="glass-card rounded-[3rem] overflow-hidden premium-shadow">
              {submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 bg-white/30 text-center">
                  <div className="bg-emerald-100/80 p-4 rounded-full text-emerald-600 mb-4">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-700">All caught up!</h3>
                  <p className="text-xs text-zinc-500 font-bold mt-1">There are no pending submissions awaiting grading.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-white/40 bg-white/30">
                    <div className="grid grid-cols-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-4">
                      <span>Student Name</span>
                      <span>Module</span>
                      <span>Submission</span>
                      <span className="text-right">Grading</span>
                    </div>
                  </div>
                  <div className="divide-y divide-white/20">
                    {submissions.map((sub, i) => (
                      <div key={i} className="grid grid-cols-4 items-center p-6 px-10 hover:bg-white/40 transition-all group group/row">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full ${sub.color} flex items-center justify-center text-[10px] font-black shadow-inner`}>
                            {sub.initial}
                          </div>
                          <span className="font-bold text-zinc-800 text-sm">{sub.name}</span>
                        </div>
                        <span className="font-medium text-zinc-600 text-xs truncate pr-4">{sub.title}</span>
                        <span className="text-zinc-400 text-[10px] font-black uppercase tracking-tighter">{sub.time}</span>
                        <div className="flex justify-end">
                          <Link href={`/dashboard/teacher/grading`}>
                            <button className="bg-z-red text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-z-red/20 transition-all hover:scale-105 active:scale-95 cursor-pointer">Grade</button>
                          </Link>
                          <button className="ml-2 p-2 text-zinc-500 hover:text-z-red transition-all"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Live Session & Alerts */}
          <div className="space-y-10">
            <h2 className="text-2xl font-black text-z-red tracking-tight px-2">Live Session</h2>
            
            <Link href={liveLesson ? `/classroom/${liveLesson.videoUrl}` : "/dashboard/teacher/sessions"} className="block">
              <div className="bg-z-red p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-500">
                <div className="absolute top-0 right-0 p-8">
                  <Video className="w-10 h-10 opacity-20 group-hover:opacity-40 transition-opacity" />
                </div>
                
                <div className="relative z-10 space-y-8">
                  <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black tracking-widest uppercase">
                      {liveLesson ? `Room: ${liveLesson.videoUrl}` : "Instant Class"}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-black leading-tight tracking-tighter">
                      {liveLesson ? liveLesson.title : "Start Instant Live Stream"}
                    </h3>
                    <p className="text-white/60 font-medium mt-3 text-sm">
                      {liveLesson 
                        ? `Module of: ${liveLesson.course.title}`
                        : "Broadcast to classrooms instantly."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="space-y-1">
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Scheduled</p>
                      <p className="font-black text-xl">{liveLesson ? "Dynamic Room" : "Now"}</p>
                    </div>
                    <div className="bg-white text-z-red w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-black/20 group-hover:scale-110 transition-all">
                      <ChevronRight className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
              </div>
            </Link>

            {/* Quick Actions / Tips */}
            <div className="glass-card p-10 rounded-[3.5rem] premium-shadow border-z-gold/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-z-gold p-3 rounded-2xl text-white shadow-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-zinc-700 uppercase tracking-widest">Efficiency Tip</h4>
              </div>
              <p className="text-sm text-zinc-600 font-medium leading-relaxed mb-6">You graded <span className="text-z-red font-black">20% faster</span> this week. Try automated rubrics for your next course to save another 5 hours!</p>
              <Link href="/dashboard/teacher/content">
                <button className="w-full py-4 bg-z-rose/50 rounded-2xl text-[10px] font-black text-z-red uppercase tracking-[0.2em] hover:bg-z-rose transition-colors cursor-pointer">Explore Rubrics</button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
