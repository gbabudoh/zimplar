import React from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { 
  Building, 
  Users, 
  Zap, 
  MapPin,
  BarChart3,
  Globe,
  ArrowUpRight,
  Sprout,
  Building2
} from "lucide-react";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";
import ClassroomRegionToggle from "@/components/dashboard/ClassroomRegionToggle";

export default async function InstitutionalSuitePage() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  // Fetch real org profile
  const orgProfile = await db.organizationProfile.findUnique({
    where: { userId: session.user.id },
  });

  // Fetch real subscription
  const subscription = await db.subscription.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Fetch real data allocation
  const dataAllocation = await db.dataAllocation.findUnique({
    where: { userId: session.user.id },
  });

  // Fetch classrooms managed by this user (teacher/org admin)
  const managedClassrooms = await db.classroom.findMany({
    where: { teacherId: session.user.id },
    include: { students: true, courses: true },
  });

  // Fetch all courses created by this user
  const courses = await db.course.findMany({
    where: { teacherId: session.user.id },
    include: { enrollments: true },
  });

  // Compute stats from real data
  const totalClassrooms = managedClassrooms.length;
  const totalStudents = managedClassrooms.reduce((acc, c) => acc + c.students.length, 0);
  const totalCourses = courses.length;
  const totalEnrollments = courses.reduce((acc, c) => acc + c.enrollments.length, 0);

  const usedGB = dataAllocation?.usedGB ?? 0;
  const totalCapGB = dataAllocation?.totalCapGB ?? 5;
  const usagePercent = totalCapGB > 0 ? Math.round((usedGB / totalCapGB) * 100) : 0;

  // Fetch recent transactions as audit events
  const recentTransactions = await db.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const classroomBreakdown = [...managedClassrooms]
    .sort((a, b) => b.students.length - a.students.length)
    .slice(0, 5);
  const maxClassroomStudents = Math.max(1, ...classroomBreakdown.map((c) => c.students.length));

  const stats = [
    { label: "Classrooms", value: String(totalClassrooms), icon: Building, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Courses", value: String(totalCourses), icon: Globe, color: "text-z-blue", bg: "bg-z-blue/10" },
    { label: "Total Students", value: String(totalStudents), icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Enrollments", value: String(totalEnrollments), icon: Sprout, color: "text-amber-600", bg: "bg-amber-600/10" },
  ];

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar role="ORG_ADMIN" />
      
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
            <p className="text-zinc-600 font-medium ml-1">
              {orgProfile?.name ? `${orgProfile.name} — ` : ""}Education management and impact metrics.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <NotificationDropdown />
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
                  <h3 className="text-2xl font-black tracking-tight mb-1">Network Overview</h3>
                   <p className="text-zinc-400 text-sm font-medium">Student distribution across your busiest classrooms.</p>
                </div>
                <div className="flex space-x-2">
                  <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">{totalClassrooms} Classrooms</div>
                </div>
              </div>

              {classroomBreakdown.length > 0 ? (
                <div className="relative z-10 space-y-5">
                  {classroomBreakdown.map((c) => (
                    <div key={c.id}>
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-xs font-black text-white tracking-tight">{c.name}</p>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{c.students.length} Students</p>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-z-red to-z-gold shadow-[0_0_20px_rgba(255,27,47,0.3)]"
                          style={{ width: `${Math.round((c.students.length / maxClassroomStudents) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative z-10 w-full aspect-video bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-zinc-500 mx-auto" />
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">No classrooms yet</p>
                  </div>
                </div>
              )}
            </div>

            {/* Managed Classrooms */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-zinc-100">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-black text-zinc-800 tracking-tight">Managed Classrooms</h3>
                   <Link href="/dashboard/org/analytics">
                      <button className="text-xs font-black text-z-blue border-b-2 border-z-blue/20 hover:border-z-blue transition-all pb-0.5">View Analytics</button>
                   </Link>
                </div>
               
               <div className="space-y-4">
                  {managedClassrooms.length > 0 ? (
                    managedClassrooms.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-6 bg-zinc-50 rounded-3xl border border-zinc-100 hover:bg-white hover:shadow-lg transition-all group">
                         <div className="flex items-center space-x-6">
                            <Building2 className="w-8 h-8 text-z-red" />
                            <div>
                               <p className="text-lg font-black text-zinc-800">{c.name}</p>
                               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{c.students.length} Students • {c.courses.length} Courses</p>
                            </div>
                         </div>
                         <div className="flex items-center space-x-4 text-right">
                            <ClassroomRegionToggle classroomId={c.id} regionType={c.regionType} />
                            <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600">
                              Active
                            </div>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Building2 className="w-10 h-10 text-zinc-200 mx-auto mb-4" />
                      <p className="text-sm font-bold text-zinc-400">No classrooms managed yet.</p>
                      <p className="text-[10px] text-zinc-300 font-medium mt-1">Provision schools and create classrooms to see them here.</p>
                    </div>
                  )}
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
                  <h3 className="text-lg font-black text-white tracking-tight">Data Allocation</h3>
                </div>
                
                <div className="space-y-6 relative z-10">
                   <div>
                      <div className="flex justify-between items-end mb-3">
                         <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Storage Quota</p>
                         <p className="text-2xl font-black text-white">{usedGB.toFixed(1)} / {totalCapGB.toFixed(1)} GB</p>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <div className="h-full bg-gradient-to-r from-z-red to-z-gold shadow-[0_0_20px_rgba(255,27,47,0.3)]" style={{ width: `${usagePercent}%` }}></div>
                      </div>
                   </div>
                   
                   <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                     {subscription ? `Plan: ${subscription.planType} • Status: ${subscription.status}` : "No active subscription."}
                   </p>
                   
                   <Link href="/dashboard/billing">
                      <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all">
                         Review Billing
                      </button>
                   </Link>
                </div>
             </div>

             {/* Recent Activity */}
             <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-zinc-100">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-lg font-black text-zinc-800 tracking-tight">Recent Activity</h3>
                   <Link href="/dashboard/org/audit">
                      <div className="bg-z-red/10 text-z-red px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-z-red hover:text-white transition-all">Full Audit</div>
                   </Link>
                </div>
                
                <div className="space-y-6">
                   {recentTransactions.length > 0 ? (
                     recentTransactions.map(tx => (
                       <div key={tx.id} className="relative pl-6 border-l-2 border-zinc-100 last:border-0 pb-2">
                          <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-z-red shadow-[0_0_10px_rgba(255,27,47,0.4)]"></div>
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
