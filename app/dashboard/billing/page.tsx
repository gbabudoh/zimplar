import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { 
  getUserSubscription, 
  getUserTransactions, 
  getDataAllocation
} from "@/actions/monetization";
import BillingClientView from "@/components/dashboard/BillingClientView";

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Load subscriptions, transactions, and data allocations on the server
  const [sub, txs, alloc] = await Promise.all([
    getUserSubscription(),
    getUserTransactions(),
    getDataAllocation()
  ]);

  // Safely map transactions to correct prop types
  const transactions = txs.map((tx: any) => ({
    id: tx.id,
    type: tx.type,
    reference: tx.reference,
    createdAt: tx.createdAt,
    amount: tx.amount,
    status: tx.status,
  }));

  const allocation = alloc ? {
    totalCapGB: alloc.totalCapGB,
    usedGB: alloc.usedGB,
  } : null;

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-10">
      <Sidebar />
      
      <main className="flex-grow p-10 ml-72">
        <BillingClientView 
          initialSub={sub} 
          initialTransactions={transactions} 
          initialAllocation={allocation} 
        />
      </main>
    </div>
  );
}
