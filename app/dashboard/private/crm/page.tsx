"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Users, Search, Filter, MoreHorizontal } from "lucide-react";

export default function CRMToolsPage() {
  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar role="SCHOOL" />
      
      <main className="flex-grow p-10 ml-72">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-zinc-200">
                <Users className="w-5 h-5 text-z-blue stroke-[2.5]" />
              </div>
              <h1 className="text-3xl font-black text-zinc-800 tracking-tight">
                CRM <span className="text-zinc-950">Tools</span>
              </h1>
            </div>
            <p className="text-zinc-600 font-medium ml-1">Manage prospective student leads and enrollment pipelines.</p>
          </div>
          <button className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
            Add New Lead
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "New Leads", value: "24", sub: "+8 today", color: "text-z-blue" },
            { label: "Open Tours", value: "12", sub: "3 pending", color: "text-amber-500" },
            { label: "Converted", value: "88%", sub: "High Performance", color: "text-emerald-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-zinc-100 group hover:-translate-y-1 transition-all">
              <p className="text-[10px] font-black text-zinc-800 uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className={`text-4xl font-black ${stat.color} mb-1 tracking-tighter`}>{stat.value}</h3>
              <p className="text-[10px] font-bold text-zinc-700">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-zinc-100 ">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-zinc-800">Active Leads Pipeline</h3>
            <div className="flex space-x-2">
              <div className="bg-zinc-50 p-2 rounded-lg border border-zinc-200 cursor-pointer hover:bg-zinc-100">
                <Search className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="bg-zinc-50 p-2 rounded-lg border border-zinc-200 cursor-pointer hover:bg-zinc-100">
                <Filter className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                  <th className="pb-4 px-4 font-black">Lead Name</th>
                  <th className="pb-4 px-4 font-black">Status</th>
                  <th className="pb-4 px-4 font-black">Grade</th>
                  <th className="pb-4 px-4 font-black">Last Contact</th>
                  <th className="pb-4 px-4 font-black text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {[
                  { name: "Emily Watson", status: "Qualified", grade: "Primary 4", contact: "Today" },
                  { name: "Robert Downey", status: "Scheduled Tour", grade: "Senior 1", contact: "Yesterday" },
                  { name: "Natalie Portman", status: "Interested", grade: "Primary 2", contact: "2 days ago" },
                  { name: "Chris Evans", status: "Application Sent", grade: "Senior 3", contact: "3 days ago" },
                ].map((lead, i) => (
                  <tr key={i} className="group hover:bg-zinc-50/50 transition-colors">
                    <td className="py-6 px-4">
                      <p className="font-bold text-zinc-900">{lead.name}</p>
                    </td>
                    <td className="py-6 px-4">
                      <span className="text-[9px] font-black bg-z-blue/10 text-z-blue px-3 py-1 rounded-full uppercase tracking-widest">
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-6 px-4 text-xs font-bold text-zinc-800">{lead.grade}</td>
                    <td className="py-6 px-4 text-[10px] font-black text-zinc-800 uppercase tracking-widest">{lead.contact}</td>
                    <td className="py-6 px-4 text-right">
                      <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
