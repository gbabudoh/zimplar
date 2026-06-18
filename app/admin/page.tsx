import React from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import {
  Users,
  DollarSign,
  Activity,
  HardDrive,
  Settings,
  ShieldAlert
} from "lucide-react";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user?.id || (session.user as { role?: string }).role !== "ADMIN") {
    return redirect("/login");
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [totalUsers, revenueAgg, videoSessions24h, allocationAgg] = await Promise.all([
    db.user.count(),
    db.transaction.aggregate({
      _sum: { amount: true },
      where: { status: "COMPLETED", createdAt: { gte: startOfMonth } },
    }),
    db.videoSession.count({ where: { createdAt: { gte: since24h } } }),
    db.dataAllocation.aggregate({
      _sum: { totalCapGB: true, usedGB: true },
    }),
  ]);

  const monthlyRevenue = revenueAgg._sum.amount ?? 0;
  const totalCapGB = allocationAgg._sum.totalCapGB ?? 0;
  const usedGB = allocationAgg._sum.usedGB ?? 0;

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar role="ADMIN" />

      <main className="flex-grow p-10 ml-72">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-zinc-800 tracking-tight">
              Admin <span className="text-z-red">Command Center</span>
            </h1>
            <p className="text-zinc-500 font-medium">System Overview & Global Controls</p>
          </div>
          <div className="flex items-center space-x-6">
             <NotificationDropdown />
             <div className="bg-white px-4 py-2.5 rounded-xl flex items-center space-x-2 border border-zinc-100 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Database Connected</span>
             </div>
          </div>
        </header>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           <Link href="/admin/users" className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-xl shadow-z-blue/5 flex flex-col justify-between h-40 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-z-blue/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex justify-between items-start z-10">
                 <div className="bg-z-blue/10 p-3 rounded-2xl text-z-blue">
                    <Users className="w-6 h-6" />
                 </div>
              </div>
              <div>
                 <p className="text-2xl font-black text-zinc-800">{totalUsers.toLocaleString()}</p>
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Users</p>
              </div>
           </Link>

           <Link href="/admin/payments" className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-xl shadow-z-gold/5 flex flex-col justify-between h-40 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-z-gold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex justify-between items-start z-10">
                 <div className="bg-z-gold/10 p-3 rounded-2xl text-z-gold">
                    <DollarSign className="w-6 h-6" />
                 </div>
              </div>
              <div>
                 <p className="text-2xl font-black text-zinc-800">${monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Revenue This Month</p>
              </div>
           </Link>

           <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-xl shadow-z-red/5 flex flex-col justify-between h-40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-z-red/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex justify-between items-start z-10">
                 <div className="bg-z-red/10 p-3 rounded-2xl text-z-red">
                    <Activity className="w-6 h-6" />
                 </div>
              </div>
              <div>
                 <p className="text-2xl font-black text-zinc-800">{videoSessions24h.toLocaleString()}</p>
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Video Sessions (24h)</p>
              </div>
           </div>

           <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-xl shadow-zinc-500/5 flex flex-col justify-between h-40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-200/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex justify-between items-start z-10">
                 <div className="bg-zinc-100 p-3 rounded-2xl text-zinc-600">
                    <HardDrive className="w-6 h-6" />
                 </div>
                 <span className="text-z-blue flex items-center text-xs font-black bg-blue-50 px-2 py-1 rounded-lg">
                    {usedGB.toFixed(1)} GB Used
                 </span>
              </div>
              <div>
                 <p className="text-2xl font-black text-zinc-800">{totalCapGB.toFixed(1)} GB</p>
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Data Allocation Cap</p>
              </div>
           </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-black text-zinc-800 tracking-tight mb-6">Management Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {/* CMS Card */}
           <Link
             href="/admin/cms"
             className="block p-8 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 hover:bg-white transition-all cursor-pointer group hover:scale-[1.02] shadow-xl shadow-purple-500/5"
           >
              <div className="mb-6 bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-black text-zinc-800 mb-2">CMS Engine</h3>
              <p className="text-sm text-zinc-500 mb-6">Manage hero text, featured courses, and homepage announcements.</p>
              <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                 <div className="h-full bg-purple-500 w-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
           </Link>

           {/* User Management Card */}
           <Link
             href="/admin/users"
             className="block p-8 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 hover:bg-white transition-all cursor-pointer group hover:scale-[1.02] shadow-xl shadow-z-blue/5"
           >
              <div className="mb-6 bg-z-blue/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Users className="w-6 h-6 text-z-blue" />
              </div>
              <h3 className="text-xl font-black text-zinc-800 mb-2">User Directory</h3>
              <p className="text-sm text-zinc-500 mb-6">Verify teachers, ban accounts, and audit activity logs.</p>
              <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                 <div className="h-full bg-z-blue w-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
           </Link>

           {/* Alerts Card */}
           <Link
             href="/admin/analytics"
             className="block p-8 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 hover:bg-white transition-all cursor-pointer group hover:scale-[1.02] shadow-xl shadow-z-red/5"
           >
              <div className="mb-6 bg-z-red/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                 <ShieldAlert className="w-6 h-6 text-z-red" />
              </div>
              <h3 className="text-xl font-black text-zinc-800 mb-2">Security Audits</h3>
              <p className="text-sm text-zinc-500 mb-6">Review AI proctoring flags and suspicious login attempts.</p>
              <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                 <div className="h-full bg-z-red w-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
           </Link>

           {/* Payment Hub Card */}
           <Link
             href="/admin/payments"
             className="block p-8 bg-zinc-900 rounded-[2.5rem] shadow-2xl hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="mb-6 bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10">
                 <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Payment Hub</h3>
              <p className="text-sm text-zinc-400 mb-6">Subscription architecture, gateway simulation, and institutional billing.</p>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
           </Link>
        </div>
      </main>
    </div>
  );
}
