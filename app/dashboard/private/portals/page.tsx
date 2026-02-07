"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Smartphone, ArrowRight } from "lucide-react";

export default function ParentPortalsPage() {
  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar role="SCHOOL" />
      
      <main className="flex-grow p-10 ml-72">
        <header className="mb-12">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-white p-2 rounded-xl shadow-lg border border-zinc-200">
              <Smartphone className="w-5 h-5 text-z-blue stroke-[2.5]" />
            </div>
            <h1 className="text-3xl font-black text-zinc-800 tracking-tight">
              Parent <span className="text-zinc-950">Portals</span>
            </h1>
          </div>
          <p className="text-zinc-600 font-medium ml-1">Manage mobile access and communication for student guardians.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-zinc-100">
            <h3 className="text-xl font-black text-zinc-800 mb-6">Portal Configuration</h3>
            <div className="space-y-6">
              <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-800">Auto-Enrollment</p>
                  <p className="text-xs text-zinc-500">Automatically invite parents on student registration.</p>
                </div>
                <div className="w-12 h-6 bg-z-blue rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-800">Fee Notifications</p>
                  <p className="text-xs text-zinc-500">Push alerts for upcoming tuition deadlines.</p>
                </div>
                <div className="w-12 h-6 bg-z-blue rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-[3rem] p-10 shadow-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-4">Adoption Rate</h3>
              <p className="text-zinc-400 text-sm mb-8">Current active parents using the Zimplar Mobile App.</p>
              <div className="text-6xl font-black text-z-blue mb-2">92%</div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Growth: +5% this month</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-z-blue/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-[3rem] p-10 shadow-xl border border-zinc-100">
          <h3 className="text-xl font-black text-zinc-800 mb-8 text-center">Recent Invite Activity</h3>
          <div className="space-y-4">
            {[
              { name: "John Doe", student: "Alice Doe", status: "PENDING", date: "2h ago" },
              { name: "Sarah Smith", student: "Bob Smith", status: "ACTIVE", date: "5h ago" },
              { name: "Michael Gray", student: "David Gray", status: "ACTIVE", date: "1d ago" },
            ].map((invite, i) => (
              <div key={i} className="flex items-center justify-between p-6 hover:bg-zinc-50 rounded-3xl transition-all border border-transparent hover:border-zinc-100">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 font-black text-xs">
                    {invite.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-800">{invite.name}</p>
                    <p className="text-[10px] text-zinc-900 font-bold uppercase tracking-widest">Parent of {invite.student}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                    invite.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {invite.status}
                  </span>
                  <p className="text-[10px] font-black text-zinc-900 uppercase">{invite.date}</p>
                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
