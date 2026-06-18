"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  CreditCard,
  Download,
  Settings,
  ShieldCheck,
  HardDrive,
  Zap
} from "lucide-react";
import { getRecentTransactionsAdmin, getDataSalesSummary, getSubscriptionTierCounts } from "@/actions/analytics";

interface AdminTransaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: Date;
  user: { name: string | null; email: string };
}

const TIERS = [
  { name: "Government", planType: "ENTERPRISE", price: 499 },
  { name: "Charity / NGO", planType: "PREMIUM", price: 99 },
  { name: "Private / Individual", planType: "BASIC", price: "29-199" },
];

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-emerald-100 text-emerald-600",
  PENDING: "bg-amber-100 text-amber-600",
  FAILED: "bg-rose-100 text-rose-600",
  REFUNDED: "bg-zinc-100 text-zinc-500",
};

export default function AdminPaymentHubPage() {
  const [gatewayMode, setGatewayMode] = useState("SIMULATION"); // SIMULATION | LIVE
  const [activeGateway, setActiveGateway] = useState("STRIPE"); // STRIPE | PAYSTACK

  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [dataSales, setDataSales] = useState({ totalRevenue: 0, totalGBSold: 0 });
  const [tierCounts, setTierCounts] = useState<Array<{ planType: string; _count: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [txs, sales, tiers] = await Promise.all([
          getRecentTransactionsAdmin(),
          getDataSalesSummary(),
          getSubscriptionTierCounts()
        ]);
        setTransactions(txs as unknown as AdminTransaction[]);
        setDataSales(sales);
        setTierCounts(tiers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const subscriberCountFor = (planType: string) =>
    tierCounts.find((t) => t.planType === planType)?._count ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg flex font-sans">
        <Sidebar role="ADMIN" />
        <main className="flex-grow flex items-center justify-center ml-72">
           <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-z-red/20 border-t-z-red rounded-full animate-spin"></div>
              <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">Loading payment data...</p>
           </div>
        </main>
      </div>
    );
  }

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
             <button disabled title="Coming soon" className="px-6 py-3 bg-zinc-200 text-zinc-400 rounded-xl font-black text-xs uppercase tracking-widest cursor-not-allowed flex items-center space-x-2">
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
                    <button disabled title="Coming soon" className="text-[10px] font-black text-zinc-300 uppercase tracking-widest cursor-not-allowed">Global Pricing Model</button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {TIERS.map((t) => (
                      <div key={t.name} className="p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 hover:bg-white hover:shadow-lg transition-all">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">{t.planType}</p>
                               <h3 className="text-sm font-black text-zinc-800">{t.name}</h3>
                            </div>
                            <span className="text-zinc-500 text-[10px] font-black bg-zinc-100 px-2 py-1 rounded">
                               {subscriberCountFor(t.planType)} Active
                            </span>
                         </div>
                         <div className="flex items-baseline mb-6">
                            <span className="text-xs font-black text-zinc-400">$</span>
                            <span className="text-2xl font-black text-zinc-800">{t.price}</span>
                            <span className="text-xs font-bold text-zinc-400 ml-1">/mo</span>
                         </div>
                         <button disabled title="Coming soon" className="w-full py-3 bg-white border border-zinc-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-zinc-400 cursor-not-allowed">
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
                 </div>

                 {transactions.length > 0 ? (
                   <div className="space-y-3">
                      {transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100 hover:bg-white hover:shadow-md transition-all">
                           <div className="flex items-center space-x-4">
                              <div className={`p-2 rounded-xl ${STATUS_STYLES[tx.status] || STATUS_STYLES.PENDING}`}>
                                 <CreditCard className="w-4 h-4" />
                              </div>
                              <div>
                                 <p className="text-xs font-bold text-zinc-800">{tx.user?.name || tx.user?.email || "Unknown User"}</p>
                                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{tx.type.replace(/_/g, " ")} &bull; {tx.status}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-black text-zinc-800">${tx.amount.toLocaleString()}</p>
                              <p className="text-[10px] text-zinc-400 font-bold">{new Date(tx.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                 ) : (
                   <p className="text-xs font-bold text-zinc-400 text-center py-8">No transactions recorded yet.</p>
                 )}
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
                    <span className="text-[8px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded uppercase tracking-widest">Soon</span>
                 </div>

                 <div className="text-center py-8">
                    <p className="text-xs font-bold text-zinc-400">Institutional onboarding workflow isn&apos;t built yet.</p>
                    <p className="text-[10px] text-zinc-300 font-medium mt-1">There&apos;s no review queue for new organization signups yet.</p>
                 </div>
              </div>

              {/* Data Sales */}
              <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 <div className="flex items-center space-x-3 mb-6 relative z-10">
                    <HardDrive className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-black text-emerald-800 tracking-tight">Data Sales</h3>
                 </div>

                 <div className="relative z-10">
                    <p className="text-4xl font-black text-emerald-900">${dataSales.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">{dataSales.totalGBSold.toFixed(1)} GB Sold</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
