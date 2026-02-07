"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  History, 
  Building2, 
  Heart, 
  School, 
  UserCircle,
  Database,
  ArrowUpRight,
  TrendingUp,
  Clock
} from "lucide-react";
import { 
  createSubscription, 
  getUserSubscription, 
  getUserTransactions, 
  topUpData,
  getDataAllocation
} from "@/actions/monetization";
// @ts-expect-error - Prisma client generation sync
import { PlanType, OrgType } from "@prisma/client";

interface Subscription {
  id: string;
  planType: string;
  orgType: string;
  amount: number;
  endDate: Date;
}

interface Transaction {
  id: string;
  type: string;
  reference: string | null;
  createdAt: Date;
  amount: number;
}

interface Allocation {
  totalCapGB: number;
  usedGB: number;
}

interface CheckoutItem {
  name: string;
  price: number;
  category: 'SUBSCRIPTION' | 'DATA_TOPUP';
  type: PlanType | string; 
  org?: OrgType | string;
  gbAmount?: number;
}

const tiers = [
  {
    type: PlanType.ENTERPRISE,
    org: OrgType.GOVERNMENT,
    name: "Government",
    price: 499,
    description: "Scale public education across regions with zero physical overhead.",
    icon: Building2,
    color: "emerald",
    features: ["Unlimited Classrooms", "Regional Multi-Tenancy", "Gov-grade Security", "Whitelist Enrollment"],
    impact: "Democratize Mass Education"
  },
  {
    type: PlanType.PREMIUM,
    org: OrgType.CHARITY,
    name: "Charity / NGO",
    price: 99,
    description: "Subsidize learning for underprivileged communities worldwide.",
    icon: Heart,
    color: "z-red",
    features: ["Grant Tracking", "Donation Receipts", "Rural Access Mode", "Community Support"],
    impact: "Impact-First Scaling"
  },
  {
    type: PlanType.BASIC,
    org: OrgType.PRIVATE,
    name: "Private School",
    price: 199,
    description: "Professionalize your school with premium digital management.",
    icon: School,
    color: "z-blue",
    features: ["Proprietary Branding", "Parent Portals", "Advanced Analytics", "Enrollment CRM"],
    impact: "Premium Experience"
  },
  {
    type: PlanType.BASIC,
    org: OrgType.PRIVATE, // Using PRIVATE as proxy for individual business entity
    name: "Individual Teacher",
    price: 29,
    description: "Monetize your expertise and build your personal brand.",
    icon: UserCircle,
    color: "purple",
    features: ["Direct Student Billing", "Personal Branding", "Course Sales", "Unlimited Lessons"],
    impact: "Edu-preneurship"
  }
];

export default function BillingPage() {
  const router = useRouter();
  const [currentSub, setCurrentSub] = useState<Subscription | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allocation, setAllocation] = useState<Allocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState<{ open: boolean; item: CheckoutItem | null }>({ open: false, item: null });
  const [showInvoice, setShowInvoice] = useState<{ open: boolean; tx: Transaction | null }>({ open: false, tx: null });

  useEffect(() => {
    async function loadData() {
      const [sub, txs, alloc] = await Promise.all([
        getUserSubscription(),
        getUserTransactions(),
        getDataAllocation()
      ]);
      setCurrentSub(sub);
      setTransactions(txs);
      setAllocation(alloc as unknown as Allocation);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubscribe = (tier: typeof tiers[0]) => {
    setShowCheckout({ open: true, item: { ...tier, category: 'SUBSCRIPTION' } });
  };

  const handleTopUp = () => {
    setShowCheckout({ 
      open: true, 
      item: { 
        name: "10GB Data Top-up", 
        price: 5, 
        type: 'TOPUP', 
        category: 'DATA_TOPUP',
        gbAmount: 10
      } 
    });
  };

  const processPayment = async () => {
    const item = showCheckout.item;
    if (!item) return;

    setIsProcessing(item.name);
    try {
      if (item.category === 'SUBSCRIPTION') {
        await createSubscription({
          planType: item.type as PlanType,
          orgType: item.org as OrgType,
          amount: item.price
        });
        
        if (item.name !== "Individual Teacher") {
           router.push(`/dashboard/billing/onboarding?plan=${item.type}&org=${item.org}`);
           return;
        }
      } else if (item.category === 'DATA_TOPUP') {
        await topUpData(item.gbAmount || 0, item.price);
      }

      const [sub, txs, alloc] = await Promise.all([
        getUserSubscription(),
        getUserTransactions(),
        getDataAllocation()
      ]);
      setCurrentSub(sub);
      setTransactions(txs);
      setAllocation(alloc as unknown as Allocation);
      setShowCheckout({ open: false, item: null });
    } catch (error) {
      console.error("Payment processing failed:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg flex font-sans">
      <Sidebar />
        <main className="flex-grow flex items-center justify-center ml-72">
           <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-z-red/20 border-t-z-red rounded-full animate-spin"></div>
              <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">Financial synchronization...</p>
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-10">
      <Sidebar />
      
      <main className="flex-grow p-10 ml-72">
        <header className="flex justify-between items-end mb-12">
          <div>
             <div className="flex items-center space-x-3 mb-2">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-zinc-100">
                   <CreditCard className="w-5 h-5 text-z-red" />
                </div>
                <h1 className="text-3xl font-black text-zinc-800 tracking-tight">Financial Hub</h1>
             </div>
             <p className="text-zinc-500 font-medium ml-1">Manage subscriptions, data allocation, and transaction history.</p>
          </div>
          
          <div className="flex space-x-4">
             <div className="bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/50 shadow-sm flex items-center space-x-4">
                <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center">
                   <Database className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Remaining Data</p>
                   <p className="text-sm font-black text-zinc-800 tracking-tight">
                      {allocation ? (allocation.totalCapGB - allocation.usedGB).toFixed(1) : "..." } GB
                   </p>
                </div>
             </div>
             <button 
                onClick={handleTopUp}
                disabled={isProcessing === "TOPUP"}
                className={`px-6 py-3 bg-zinc-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-zinc-900/20 cursor-pointer flex items-center space-x-2 ${isProcessing === "TOPUP" ? "opacity-70" : ""}`}
             >
                {isProcessing === "TOPUP" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Zap className="w-4 h-4 text-amber-400" />}
                <span>Top up 10GB</span>
             </button>
          </div>
        </header>

        {/* Current Subscription Banner */}
        {currentSub && (
          <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] shadow-2xl mb-12 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-z-red/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
             <div className="relative z-10 flex justify-between items-center">
                <div>
                   <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-black tracking-widest uppercase">Verified Subscription</span>
                   </div>
                   <h2 className="text-4xl font-black mb-2">{currentSub.orgType} {currentSub.planType}</h2>
                   <p className="text-zinc-400 font-medium tracking-tight flex items-center space-x-2">
                       <span>Renews on {new Date(currentSub.endDate).toLocaleDateString()}</span>
                       <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                       <span>${currentSub.amount}/mo</span>
                   </p>
                </div>
                <button className="px-8 py-4 bg-white text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 cursor-pointer">
                   Modify Plan
                </button>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
           {tiers.map((tier) => (
             <div key={tier.name} className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-xl flex flex-col items-center text-center group hover:scale-[1.02] transition-all relative overflow-hidden">
                <div className={`absolute top-0 inset-x-0 h-1 ${tier.color === 'z-red' ? 'bg-z-red' : tier.color === 'z-blue' ? 'bg-z-blue' : tier.color === 'emerald' ? 'bg-emerald-500' : 'bg-purple-500'}`}></div>
                <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center ${tier.color === 'z-red' ? 'bg-red-50 text-z-red' : tier.color === 'z-blue' ? 'bg-blue-50 text-z-blue' : tier.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'}`}>
                   <tier.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-zinc-800 mb-1">{tier.name}</h3>
                <p className="text-xs font-bold text-zinc-400 mb-4 uppercase tracking-wider">{tier.impact}</p>
                <div className="flex items-baseline mb-6">
                   <span className="text-sm font-black text-zinc-800">$</span>
                   <span className="text-4xl font-black text-zinc-800">{tier.price}</span>
                   <span className="text-sm font-bold text-zinc-400 ml-1">/mo</span>
                </div>
                
                <div className="space-y-3 mb-8 w-full">
                   {tier.features.map(f => (
                     <div key={f} className="flex items-center space-x-2 text-left">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-200"></div>
                        <span className="text-[10px] font-bold text-zinc-500">{f}</span>
                     </div>
                   ))}
                </div>

                <button 
                  onClick={() => handleSubscribe(tier)}
                  disabled={isProcessing === tier.name}
                  className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center space-x-2 ${tier.color === 'z-red' ? 'bg-z-red text-white shadow-z-red/20' : tier.color === 'z-blue' ? 'bg-z-blue text-white shadow-z-blue/20' : tier.color === 'emerald' ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 'bg-purple-600 text-white shadow-purple-600/20'}`}
                >
                   {isProcessing === tier.name ? (
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   ) : (
                     <>
                        <Zap className="w-3 h-3" />
                        <span>Select Plan</span>
                     </>
                   )}
                </button>
             </div>
           ))}
        </div>

        {/* Transactions and Secondary info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-zinc-50 flex justify-between items-center">
                 <div className="flex items-center space-x-3">
                    <History className="w-5 h-5 text-zinc-400" />
                    <h3 className="text-xl font-black text-zinc-800">Transaction History</h3>
                 </div>
                 <button className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-z-red transition-colors cursor-pointer">Export CSV</button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead className="bg-zinc-50 border-b border-zinc-100">
                       <tr>
                          <th className="text-left py-4 px-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Type</th>
                          <th className="text-left py-4 px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Reference</th>
                          <th className="text-left py-4 px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Date</th>
                          <th className="text-right py-4 px-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Amount</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                       {transactions.length > 0 ? transactions.map((tx) => (
                         <tr key={tx.id} className="hover:bg-zinc-50/50 transition-colors">
                            <td className="py-5 px-8">
                               <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${tx.type === 'SUBSCRIPTION' ? 'bg-z-blue' : 'bg-purple-500'}`}></div>
                                  <span className="text-xs font-black text-zinc-800">{tx.type}</span>
                               </div>
                            </td>
                            <td className="py-5 px-4 text-xs font-bold text-zinc-400 tracking-tight font-mono">{tx.reference}</td>
                            <td className="py-5 px-4 text-xs font-bold text-zinc-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                            <td className="py-5 px-8 text-right">
                               <div className="flex items-center justify-end space-x-6">
                                  <span className="text-sm font-black text-zinc-800">${tx.amount.toFixed(2)}</span>
                                  <button 
                                    onClick={() => setShowInvoice({ open: true, tx })}
                                    className="text-[10px] font-black text-z-blue uppercase tracking-widest hover:underline cursor-pointer"
                                  >
                                    Details
                                  </button>
                               </div>
                            </td>
                         </tr>
                       )) : (
                         <tr>
                            <td colSpan={4} className="py-20 text-center">
                               <p className="text-sm font-black text-zinc-300 uppercase tracking-widest">No recent transactions</p>
                            </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                 <div className="flex items-center space-x-3 mb-6">
                    <TrendingUp className="w-5 h-5 text-emerald-300" />
                    <h3 className="text-lg font-black">Ecosystem Impact</h3>
                 </div>
                 <p className="text-xs font-medium text-emerald-100 mb-6 leading-relaxed">
                   Every Premium and Enterprise subscription contributes to the 
                   <span className="font-black text-white ml-1 underline decoration-emerald-400/50 underline-offset-4">Rural Africa Learning Fund</span>.
                 </p>
                 <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white/80 hover:text-white transition-colors">
                    <span>Read Impact Report</span>
                    <ArrowUpRight className="w-3 h-3" />
                 </button>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl relative overflow-hidden">
                 <div className="flex items-center space-x-3 mb-6">
                    <Clock className="w-5 h-5 text-z-red" />
                    <h3 className="text-lg font-black text-zinc-800">Next Audit</h3>
                 </div>
                 <p className="text-xs font-bold text-zinc-500 mb-2">March 01, 2026</p>
                 <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">Your account will be automatically audited for compliance with the Charity/Gov whitelist enrollment policies.</p>
              </div>
           </div>
        </div>

        {/* Checkout Simulation Modal */}
        {showCheckout.open && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
              <div 
                className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
                onClick={() => !isProcessing && setShowCheckout({ open: false, item: null })}
              ></div>
              <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                 <div className="p-8 border-b border-zinc-50 flex justify-between items-center bg-zinc-50/50">
                    <h3 className="text-xl font-black text-zinc-800 tracking-tight">Secure Checkout</h3>
                    <div className="flex space-x-2">
                       <div className="w-8 h-5 bg-zinc-200 rounded-sm"></div>
                       <div className="w-8 h-5 bg-zinc-200 rounded-sm"></div>
                    </div>
                 </div>
                 
                 <div className="p-10 space-y-8">
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Items</p>
                          <p className="text-lg font-black text-zinc-800 leading-tight">{showCheckout.item?.name}</p>
                          <p className="text-xs font-bold text-zinc-500">{showCheckout.item?.category === 'SUBSCRIPTION' ? 'Institutional Plan' : 'Data Top-up package'}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total</p>
                          <p className="text-2xl font-black text-zinc-800 tracking-tight">${showCheckout.item?.price}</p>
                       </div>
                    </div>

                    <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-4">
                       <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center">
                             <CreditCard className="w-5 h-5 text-zinc-400" />
                          </div>
                          <div className="flex-grow">
                             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Card Details</p>
                             <p className="text-xs font-bold text-zinc-800">4242 •••• •••• 4242</p>
                          </div>
                          <button className="text-[10px] font-black text-z-red uppercase tracking-widest">Change</button>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <button 
                         onClick={processPayment}
                         disabled={!!isProcessing}
                         className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-zinc-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50"
                       >
                          {isProcessing ? (
                             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : <Zap className="w-4 h-4 text-amber-400 animate-pulse" />}
                          <span>{isProcessing ? "Processing..." : "Authorize Payment"}</span>
                       </button>
                       <p className="text-center text-[10px] font-bold text-zinc-400">
                          Secure simulation by Stripe & Paystack
                       </p>
                    </div>
                 </div>

                 <div className="bg-zinc-50 p-6 flex items-center justify-center space-x-6 border-t border-zinc-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">256-bit AES Encryption</span>
                 </div>
              </div>
           </div>
        )}

        {/* Invoice Detail Modal */}
        {showInvoice.open && showInvoice.tx && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <div 
                className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
                onClick={() => setShowInvoice({ open: false, tx: null })}
              ></div>
              <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
                 <div className="p-12">
                    <div className="flex justify-between items-start mb-12">
                       <div>
                          <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4">
                             <Zap className="w-6 h-6 text-z-red" />
                          </div>
                          <h3 className="text-2xl font-black text-zinc-800 tracking-tight">Official Receipt</h3>
                          <p className="text-sm font-bold text-zinc-400">Transaction #{showInvoice.tx.reference}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Completed</span>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-12">
                       <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Billed To</p>
                          <p className="text-sm font-black text-zinc-800">
                             {currentSub?.orgType || "Individual"} Account
                          </p>
                          <p className="text-xs font-bold text-zinc-500 leading-relaxed max-w-[200px]">
                             Organization details on file in your Onboarding Profile.
                          </p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Date of Issue</p>
                          <p className="text-sm font-black text-zinc-800">{new Date(showInvoice.tx.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                       </div>
                    </div>

                    <div className="bg-zinc-50 rounded-[2rem] border border-zinc-100 overflow-hidden mb-12">
                       <table className="w-full text-sm">
                          <thead className="border-b border-zinc-200">
                             <tr>
                                <th className="text-left py-6 px-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Description</th>
                                <th className="text-right py-6 px-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Amount</th>
                             </tr>
                          </thead>
                          <tbody>
                             <tr className="border-b border-zinc-100 last:border-0">
                                <td className="py-6 px-8 flex items-center space-x-4">
                                   <div className="w-8 h-8 bg-white rounded-xl border border-zinc-200 flex items-center justify-center">
                                      {showInvoice.tx.type === 'SUBSCRIPTION' ? <ShieldCheck className="w-4 h-4 text-z-blue" /> : <Database className="w-4 h-4 text-purple-500" />}
                                   </div>
                                   <div>
                                      <p className="font-black text-zinc-800">{showInvoice.tx.type === 'SUBSCRIPTION' ? 'Monthly Service Subscription' : 'Bandwidth Data Top-up'}</p>
                                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">One-time charge</p>
                                   </div>
                                </td>
                                <td className="py-6 px-8 text-right font-black text-zinc-800">${showInvoice.tx.amount.toFixed(2)}</td>
                             </tr>
                          </tbody>
                          <tfoot className="bg-zinc-100/50">
                             <tr>
                                <td className="py-6 px-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Paid</td>
                                <td className="py-6 px-8 text-right text-lg font-black text-zinc-800">${showInvoice.tx.amount.toFixed(2)}</td>
                             </tr>
                          </tfoot>
                       </table>
                    </div>

                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-bold text-zinc-400 flex items-center space-x-2">
                          <ShieldCheck className="w-3 h-3 text-emerald-500" />
                          <span>This is a digital receipt. Verified by Zimplar Finance.</span>
                       </p>
                       <button 
                         onClick={() => window.print()}
                         className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-zinc-900/20 hover:scale-105 transition-all cursor-pointer"
                       >
                          Download PDF
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
}
