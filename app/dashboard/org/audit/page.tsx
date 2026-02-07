"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Search, 
  Filter, 
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  Globe
} from "lucide-react";

// Mock Audit Logs
const auditLogs = [
  { id: "LOG-8842", type: "CERTIFICATION", org: "District Education Board", event: "Bi-Annual Security Audit Passed", status: "SUCCESS", time: "2 hours ago" },
  { id: "LOG-8839", type: "PROVISIONING", org: "Methodist Academy", event: "School Instance Infrastructure Created", status: "SUCCESS", time: "5 hours ago" },
  { id: "LOG-8835", type: "SUBSIDY", org: "Rural Literacy NGO", event: "Bandwidth Voucher Batch Authored (500GB)", status: "SUCCESS", time: "1 day ago" },
  { id: "LOG-8831", type: "ACCESS", org: "Regional Ministry Controller", event: "New Admin Credentials Generated", status: "WARNING", time: "1 day ago" },
  { id: "LOG-8828", type: "COMPLIANCE", org: "Zimplar SecOps", event: "Nightly Data Encryption Verification", status: "SUCCESS", time: "2 days ago" },
  { id: "LOG-8825", type: "VERIFICATION", org: "Global NGO Fund", event: "Institutional Identity Documents Verified", status: "SUCCESS", time: "3 days ago" },
];

export default function InstitutionalAuditPage() {
  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar />
      
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
          
          <button className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-zinc-500/20 hover:scale-[1.02] transition-all flex items-center space-x-3 group">
            <Download className="w-5 h-5 text-z-red group-hover:-translate-y-1 transition-transform" />
            <span>Export Compliance Report</span>
          </button>
        </header>

        {/* Audit Search and Filter */}
        <div className="mb-10 flex space-x-4">
           <div className="relative flex-grow group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-z-red transition-colors" />
              <input 
                type="text" 
                placeholder="Search audit ledger by Log ID, Event, or Organization..." 
                className="w-full bg-white/60 backdrop-blur-md border border-zinc-100 rounded-[2rem] py-5 pl-16 pr-8 focus:outline-none focus:ring-4 focus:ring-z-red/5 focus:bg-white transition-all font-medium text-zinc-800"
              />
           </div>
           <button className="px-8 bg-zinc-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center space-x-3">
             <Filter className="w-4 h-4 text-z-red" />
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
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em]">Issuing Entity</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em]">Verification Status</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-right">Timestamp</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100/50">
                 {auditLogs.map((log) => (
                   <tr key={log.id} className="hover:bg-white/80 transition-all group">
                      <td className="px-10 py-8">
                         <span className="bg-zinc-100 text-zinc-700 px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest">#{log.id}</span>
                      </td>
                      <td className="px-10 py-8 text-zinc-800 font-black tracking-tight">
                         <div className="flex items-center space-x-3">
                            {log.type === 'ACCESS' ? <Lock className="w-4 h-4 text-z-gold" /> : <FileText className="w-4 h-4 text-zinc-500 group-hover:text-z-red transition-colors" />}
                            <span>{log.event}</span>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         <span className="text-xs font-black text-z-blue uppercase tracking-tighter">{log.org}</span>
                      </td>
                      <td className="px-10 py-8">
                         <div className={`flex items-center space-x-2 text-[10px] font-black tracking-widest ${log.status === 'SUCCESS' ? 'text-emerald-500' : 'text-z-gold'}`}>
                            {log.status === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            <span>{log.status}</span>
                         </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                          <div className="flex items-center justify-end space-x-2 text-zinc-500 text-[10px] font-black tracking-widest">
                            <Clock className="w-3 h-3" />
                            <span>{log.time}</span>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
           
           <div className="p-10 bg-zinc-50/50 text-center">
              <button className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] hover:text-z-red transition-all">Load Archive Ledger</button>
           </div>
        </div>

        {/* Security Summary Banner */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-8 bg-zinc-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white border border-white/5">
              <div className="absolute top-0 right-0 w-24 h-24 bg-z-red/10 rounded-full blur-2xl"></div>
              <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Encryption Status</h4>
              <div className="flex items-center space-x-3 mb-4">
                 <ShieldCheck className="w-6 h-6 text-emerald-500" />
                 <span className="text-xl font-black">AES-256 ACTIVE</span>
              </div>
              <p className="text-[10px] text-zinc-600 font-medium">Regional data nodes are utilizing military-grade encryption cycles.</p>
           </div>

           <div className="p-8 bg-white/60 backdrop-blur-md border border-white/50 rounded-[2.5rem] shadow-xl">
               <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Access Distribution</h4>
              <div className="flex items-center space-x-3 mb-4 text-zinc-800">
                 <Users className="w-6 h-6 text-z-blue" />
                 <span className="text-xl font-black">14 Authorized</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-medium">Only verified Regional Ministry controllers have write access to provisioning.</p>
           </div>

           <div className="p-8 bg-white/60 backdrop-blur-md border border-white/50 rounded-[2.5rem] shadow-xl">
              <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-4">Uptime Reliability</h4>
              <div className="flex items-center space-x-3 mb-4 text-emerald-600">
                 <Globe className="w-6 h-6 animate-pulse" />
                 <span className="text-xl font-black">99.98% Sync</span>
              </div>
              <p className="text-[10px] text-zinc-700 font-medium">Infrastructure availability across Western and Central zones remains optimal.</p>
           </div>
        </div>
      </main>
    </div>
  );
}
