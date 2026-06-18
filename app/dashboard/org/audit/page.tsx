import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Users,
  Globe
} from "lucide-react";

const EVENT_LABELS: Record<string, string> = {
  SUBSCRIPTION: "Subscription Payment",
  DATA_TOPUP: "Data Top-Up",
};

export default async function InstitutionalAuditPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  const transactions = await db.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const managedClassrooms = await db.classroom.findMany({
    where: { teacherId: session.user.id },
    include: { students: true },
  });
  const authorizedUsers = managedClassrooms.reduce((acc: number, c: { students: unknown[] }) => acc + c.students.length, 0) + 1;

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar role="ORG_ADMIN" />

      <main className="flex-grow p-10 ml-72">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-zinc-100">
                <ShieldCheck className="w-5 h-5 text-z-red" />
              </div>
              <h1 className="text-3xl font-black text-zinc-800 tracking-tight">
                Institutional <span className="text-z-red">Audit</span>
              </h1>
            </div>
            <p className="text-zinc-600 font-medium ml-1">Comprehensive security ledger and compliance tracking for your region.</p>
          </div>

          <button disabled title="Coming soon" className="px-8 py-4 bg-zinc-200 text-zinc-400 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed flex items-center space-x-3">
            <Download className="w-5 h-5" />
            <span>Export Compliance Report</span>
          </button>
        </header>

        {/* Audit Search and Filter */}
        <div className="mb-10 flex space-x-4">
           <div className="relative flex-grow group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                disabled
                title="Coming soon"
                type="text"
                placeholder="Search audit ledger by Log ID, Event, or Organization..."
                className="w-full bg-zinc-50 border border-zinc-100 rounded-[2rem] py-5 pl-16 pr-8 font-medium text-zinc-400 cursor-not-allowed"
              />
           </div>
           <button disabled title="Coming soon" className="px-8 bg-zinc-200 text-zinc-400 rounded-[2rem] font-black text-[10px] uppercase tracking-widest cursor-not-allowed flex items-center space-x-3">
             <Filter className="w-4 h-4" />
             <span>Filters</span>
           </button>
        </div>

        {/* Audit Ledger */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-[3.5rem] border border-white/50 shadow-2xl overflow-hidden">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-zinc-950/5 text-zinc-600">
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em]">Log Index</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em]">Compliance Event</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em]">Amount</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em]">Verification Status</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-right">Timestamp</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100/50">
                 {transactions.length > 0 ? (
                   transactions.map((tx: { id: string; reference: string | null; type: string; amount: number; currency: string; status: string; createdAt: Date }) => (
                     <tr key={tx.id} className="hover:bg-white/60 transition-all">
                        <td className="px-10 py-6 text-xs font-black text-zinc-700">{tx.reference || tx.id.slice(-8).toUpperCase()}</td>
                        <td className="px-10 py-6 text-xs font-bold text-zinc-700">{EVENT_LABELS[tx.type] || tx.type}</td>
                        <td className="px-10 py-6 text-xs font-bold text-zinc-700">{tx.currency} {tx.amount.toFixed(2)}</td>
                        <td className="px-10 py-6">
                           <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${tx.status === "COMPLETED" ? "bg-emerald-100 text-emerald-600" : tx.status === "PENDING" ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"}`}>
                             {tx.status}
                           </span>
                        </td>
                        <td className="px-10 py-6 text-xs font-bold text-zinc-500 text-right">{new Date(tx.createdAt).toLocaleString()}</td>
                     </tr>
                   ))
                 ) : (
                   <tr>
                      <td colSpan={5} className="px-10 py-20 text-center">
                         <ShieldCheck className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
                         <p className="text-lg font-black text-zinc-400 tracking-tight mb-1">No Audit Logs</p>
                         <p className="text-[10px] font-medium text-zinc-500 max-w-sm mx-auto">Compliance events will be recorded here as institutional actions occur across your region.</p>
                      </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>

        {/* Security Summary Banner */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-8 bg-zinc-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white border border-white/5">
              <div className="absolute top-0 right-0 w-24 h-24 bg-z-red/10 rounded-full blur-2xl"></div>
               <div className="flex items-center justify-between mb-4">
                 <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Encryption Status</h4>
                 <span className="text-[8px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase tracking-widest">Soon</span>
               </div>
               <div className="flex items-center space-x-3 mb-4">
                  <ShieldCheck className="w-6 h-6 text-zinc-600" />
                  <span className="text-xl font-black text-zinc-500">—</span>
               </div>
               <p className="text-[10px] text-zinc-600 font-medium">Encryption status will appear once regional data nodes are provisioned.</p>
           </div>

           <div className="p-8 bg-white/60 backdrop-blur-md border border-white/50 rounded-[2.5rem] shadow-xl">
               <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Access Distribution</h4>
               <div className="flex items-center space-x-3 mb-4 text-zinc-800">
                  <Users className="w-6 h-6 text-z-blue" />
                  <span className="text-xl font-black text-zinc-800">{authorizedUsers}</span>
               </div>
               <p className="text-[10px] text-zinc-500 font-medium">Authorized users across your managed classrooms.</p>
           </div>

           <div className="p-8 bg-white/60 backdrop-blur-md border border-white/50 rounded-[2.5rem] shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Uptime Reliability</h4>
                <span className="text-[8px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded uppercase tracking-widest">Soon</span>
              </div>
               <div className="flex items-center space-x-3 mb-4 text-zinc-400">
                  <Globe className="w-6 h-6" />
                  <span className="text-xl font-black">—</span>
               </div>
               <p className="text-[10px] text-zinc-700 font-medium">Uptime data will be available once infrastructure zones are active.</p>
           </div>
        </div>
      </main>
    </div>
  );
}
