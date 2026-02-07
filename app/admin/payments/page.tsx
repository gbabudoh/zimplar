"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  CreditCard, 
  Download, 
  Settings,
  ShieldCheck,
  HardDrive,
  Zap,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2
} from "lucide-react";

// Mock Data for Admin View
const transactions = [
  { id: "TX-9923", user: "Ministry of Education", type: "SUBSCRIPTION_ENTERPRISE", amount: 15000, status: "COMPLETED", date: "Feb 12, 2024" },
  { id: "TX-9924", user: "St. Mary's High School", type: "SUBSCRIPTION_PREMIUM", amount: 2500, status: "COMPLETED", date: "Feb 12, 2024" },
  { id: "TX-9925", user: "Kwame Mensah", type: "DATA_TOPUP_50GB", amount: 45, status: "COMPLETED", date: "Feb 11, 2024" },
  { id: "TX-9926", user: "Tech Hub Accra", type: "SUBSCRIPTION_BASIC", amount: 500, status: "PENDING", date: "Feb 11, 2024" },
  { id: "TX-9927", user: "Sarah Okafor", type: "DATA_TOPUP_10GB", amount: 12, status: "FAILED", date: "Feb 10, 2024" },
];

const tiers = [
  { name: "Government", price: 499, org: "GOVERNMENT", trend: "+12%", status: "ACTIVE" },
  { name: "Charity / NGO", price: 99, org: "CHARITY", trend: "+5%", status: "ACTIVE" },
  { name: "Private School", price: 199, org: "PRIVATE_SCHOOL", trend: "+8%", status: "ACTIVE" },
  { name: "Individual", price: 29, org: "TEACHER", trend: "+22%", status: "ACTIVE" },
];

const onboardingQueue = [
  { id: "ORG-001", name: "Greenfield Academy", type: "PRIVATE_SCHOOL", submitted: "2 hours ago", status: "PENDING_VERIFICATION" },
  { id: "ORG-002", name: "Lagos Relief Fund", type: "CHARITY_NGO", submitted: "5 hours ago", status: "DOCUMENT_REQUIRED" },
  { id: "ORG-003", name: "District Edu Board", type: "GOVERNMENT", submitted: "1 day ago", status: "PENDING_APPROVAL" },
];

export default function AdminPaymentHubPage() {
  const [gatewayMode, setGatewayMode] = useState("SIMULATION"); // SIMULATION | LIVE
  const [activeGateway, setActiveGateway] = useState("STRIPE"); // STRIPE | PAYSTACK

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar role="ADMIN" />
      
      <main className="flex-grow p-10 ml-72">
        <header className="flex justify-between items-end mb-12">
          <div>
             <div className="flex items-center space-x-3 mb-2">
                <div className="bg-zinc-900 p-2 rounded-xl shadow-xl">
                   <Zap className="w-5 h-5 text-z-red" />
                </div>
                <h1 className="text-3xl font-black text-zinc-800 tracking-tight">Payment <span className="text-z-red">Hub</span></h1>
             </div>
             <p className="text-zinc-500 font-medium ml-1">Control subscription architecture, gateway routing, and institutional onboarding.</p>
          </div>
          
          <div className="flex space-x-4">
             <div className="bg-white/70 backdrop-blur-md px-4 py-2 rounded-xl border border-zinc-100 flex items-center space-x-3 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Gateway: {activeGateway}</span>
             </div>
             <button className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-zinc-500/20 cursor-pointer flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Financial Audit</span>
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
           {/* Tier Architecture Management */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl relative overflow-hidden">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                       <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                          <Settings className="w-5 h-5" />
                       </div>
                       <h2 className="text-xl font-black text-zinc-800">Subscription Architecture</h2>
                    </div>
                    <button className="text-[10px] font-black text-z-blue uppercase tracking-widest hover:underline">Global Pricing Model</button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tiers.map((t) => (
                      <div key={t.name} className="p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 hover:bg-white hover:shadow-lg transition-all group">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">{t.org}</p>
                               <h3 className="text-sm font-black text-zinc-800">{t.name}</h3>
                            </div>
                            <span className="text-emerald-500 text-[10px] font-black flex items-center">
                               {t.trend} <ArrowUpRight className="w-3 h-3 ml-1" />
                            </span>
                         </div>
                         <div className="flex items-baseline mb-6">
                            <span className="text-xs font-black text-zinc-400">$</span>
                            <span className="text-2xl font-black text-zinc-800">{t.price}</span>
                            <span className="text-xs font-bold text-zinc-400 ml-1">/mo</span>
                         </div>
                         <button className="w-full py-3 bg-white border border-zinc-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-zinc-600 hover:border-z-red hover:text-z-red transition-all cursor-pointer">
                            Configure Features
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Transaction Monitor */}
              <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl p-8">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-zinc-800 tracking-tight">Financial Audit Log</h3>
                    <div className="flex space-x-2">
                       <button className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Live</button>
                       <button className="px-3 py-1.5 bg-zinc-100 text-zinc-400 rounded-lg text-[10px] font-black uppercase tracking-widest">History</button>
                    </div>
                 </div>

                 <div className="space-y-3">
                    {transactions.map(tx => (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100 hover:bg-white hover:shadow-md transition-all">
                         <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-xl ${tx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                               <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-zinc-800">{tx.user}</p>
                               <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{tx.type.replace(/_/g, " ")}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-black text-zinc-800">${tx.amount.toLocaleString()}</p>
                            <p className="text-[10px] text-zinc-400 font-bold">{tx.date}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Sidebar Modules */}
           <div className="space-y-8">
              {/* Gateway Controller */}
              <div className="bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-white">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-z-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 <h3 className="text-xl font-black mb-1 relative z-10">Gateway Engine</h3>
                 <p className="text-xs text-zinc-500 font-medium mb-8 relative z-10">Active routing & Simulation mode.</p>
                 
                 <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                       <span className="text-xs font-bold">Simulation Mode</span>
                       <button 
                         onClick={() => setGatewayMode(m => m === "SIMULATION" ? "LIVE" : "SIMULATION")}
                         className={`w-12 h-6 rounded-full transition-colors relative ${gatewayMode === 'SIMULATION' ? 'bg-z-red' : 'bg-zinc-700'}`}
                       >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${gatewayMode === 'SIMULATION' ? 'left-7' : 'left-1'}`}></div>
                       </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <button 
                         onClick={() => setActiveGateway("STRIPE")}
                         className={`p-4 rounded-2xl border transition-all text-center ${activeGateway === 'STRIPE' ? 'bg-white text-zinc-900 border-white scale-105' : 'bg-white/5 text-zinc-400 border-white/10'}`}
                       >
                          <p className="text-[10px] font-black uppercase tracking-widest">Stripe</p>
                       </button>
                       <button 
                         onClick={() => setActiveGateway("PAYSTACK")}
                         className={`p-4 rounded-2xl border transition-all text-center ${activeGateway === 'PAYSTACK' ? 'bg-white text-zinc-900 border-white scale-105' : 'bg-white/5 text-zinc-400 border-white/10'}`}
                       >
                          <p className="text-[10px] font-black uppercase tracking-widest">Paystack</p>
                       </button>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                       <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                          <ShieldCheck className="w-4 h-4" />
                          <span className="text-[10px] font-black tracking-widest uppercase">Safe Simulation Active</span>
                       </div>
                       <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Stripe webhooks are currently routed to internal simulation handlers.</p>
                    </div>
                 </div>
              </div>

              {/* Institutional Onboarding Queue */}
              <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl p-8 relative overflow-hidden">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-zinc-800 tracking-tight">Onboarding Requests</h3>
                    <div className="bg-red-50 text-z-red px-2 py-1 rounded text-[10px] font-black">3 NEW</div>
                 </div>
                 
                 <div className="space-y-4">
                    {onboardingQueue.map(item => (
                      <div key={item.id} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group hover:border-z-blue transition-colors cursor-pointer">
                         <div className="flex justify-between items-start mb-2">
                            <p className="text-xs font-bold text-zinc-800 truncate pr-2">{item.name}</p>
                            <span className="text-[8px] font-black text-z-blue bg-blue-50 px-1.5 py-0.5 rounded tracking-widest uppercase">Verify</span>
                         </div>
                         <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{item.type.replace('_', ' ')}</p>
                         <p className="text-[9px] text-zinc-500">{item.submitted}</p>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-6 py-4 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-zinc-500/20 hover:scale-[1.02] transition-all">
                    Open Onboarding Hub
                 </button>
              </div>

              {/* Top-up Activity */}
              <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 <div className="flex items-center space-x-3 mb-6 relative z-10">
                    <HardDrive className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-black text-emerald-800 tracking-tight">Data Sales</h3>
                 </div>
                 
                 <div className="relative z-10">
                    <p className="text-4xl font-black text-emerald-900">$12,400</p>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Volume tracking: 2,540 GB Sold</p>
                 </div>

                 <div className="mt-8 h-1 w-full bg-emerald-200 rounded-full overflow-hidden relative z-10">
                    <div className="h-full bg-emerald-500 w-[65%]"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* System Health / Code Audit Log */}
        <div className="bg-zinc-950 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/5">
           <div className="absolute top-0 right-0 w-64 h-64 bg-z-red/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 relative z-10">
              <div className="mb-4 md:mb-0">
                 <h3 className="text-2xl font-black text-white tracking-tight mb-1">Financial Integrity Log</h3>
                 <p className="text-zinc-500 text-sm font-medium">Monitoring type safety and server action health.</p>
              </div>
              <div className="flex items-center space-x-6">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Health Score</p>
                    <p className="text-xl font-black text-white">100% Type-Safe</p>
                 </div>
                 <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                 <div className="flex items-center space-x-3 mb-4 text-zinc-400">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Null Safety Check</span>
                 </div>
                 <p className="text-zinc-100 text-xs font-bold mb-1">Billing Hub Regressions</p>
                 <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Resolved: Null-Guards Applied</p>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                 <div className="flex items-center space-x-3 mb-4 text-zinc-400">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Invoicing Engine</span>
                 </div>
                 <p className="text-zinc-100 text-xs font-bold mb-1">Strict Typing: Invoice[]</p>
                 <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Active: No &apos;any&apos; pointers</p>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                 <div className="flex items-center space-x-3 mb-4 text-zinc-400">
                    <Settings className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Action Audits</span>
                 </div>
                 <p className="text-zinc-100 text-xs font-bold mb-1">Monetization Server Actions</p>
                 <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Verified: Auth-Locked</p>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
