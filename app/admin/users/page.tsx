"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Image from "next/image";
import { getAllUsers } from "@/actions/admin";
import type { User } from "@prisma/client";
import { 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  ShieldAlert,
  GraduationCap,
  Users
} from "lucide-react";

export default function AdminUsersPage() {
  const [filterRole, setFilterRole] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === "ALL" || user.role === filterRole;
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg flex font-sans">
        <Sidebar role="ADMIN" />
        <main className="flex-grow p-10 ml-72 flex items-center justify-center">
           <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-z-red/20 border-t-z-red rounded-full animate-spin"></div>
              <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">Loading Database...</p>
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar role="ADMIN" />
      
      <main className="flex-grow p-10 ml-72">
        <header className="flex justify-between items-end mb-12">
          <div>
             <div className="flex items-center space-x-3 mb-2">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-zinc-100">
                   <Users className="w-5 h-5 text-z-blue" />
                </div>
                <h1 className="text-3xl font-black text-zinc-800 tracking-tight">User Directory</h1>
             </div>
             <p className="text-zinc-500 font-medium ml-1">Manage network access, verify teachers, and audit accounts.</p>
          </div>
          
          <button className="px-6 py-3 bg-z-red text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-z-red/20 cursor-pointer">
             Export CSV
          </button>
        </header>

        {/* Filters */}
        <div className="bg-white/60 backdrop-blur-md p-2 rounded-2xl border border-white/50 flex justify-between items-center mb-8 shadow-sm">
           <div className="flex items-center space-x-2">
              <button 
                onClick={() => setFilterRole("ALL")}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${filterRole === 'ALL' ? 'bg-white shadow-md text-zinc-800' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                 All Users
              </button>
              <button 
                onClick={() => setFilterRole("TEACHER")}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${filterRole === 'TEACHER' ? 'bg-white shadow-md text-z-red' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                 Teachers
              </button>
              <button 
                onClick={() => setFilterRole("STUDENT")}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${filterRole === 'STUDENT' ? 'bg-white shadow-md text-z-blue' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                 Students
              </button>
           </div>
           
           <div className="relative mr-2">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search database..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-zinc-50 border-none rounded-xl text-sm font-semibold text-zinc-600 w-64 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
           </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-xl overflow-hidden">
           <table className="w-full">
              <thead className="bg-zinc-50 border-b border-zinc-100">
                 <tr>
                    <th className="text-left py-6 px-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest">User Identity</th>
                    <th className="text-left py-6 px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Role</th>
                    <th className="text-left py-6 px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                    <th className="text-left py-6 px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Joined On</th>
                    <th className="text-right py-6 px-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                 {filteredUsers.map((user: User) => (
                   <tr key={user.id} className="group hover:bg-zinc-50/50 transition-colors">
                      <td className="py-6 px-8">
                         <div className="flex items-center space-x-4">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-200 group-hover:border-z-blue/30 transition-colors bg-zinc-100 flex items-center justify-center">
                               {user.image ? (
                                 <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                               ) : (
                                 <Users className="w-5 h-5 text-zinc-400" />
                               )}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-zinc-800">{user.name || "No name"}</p>
                               <p className="text-xs text-zinc-400">{user.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="py-6 px-4">
                         <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg border ${user.role === 'TEACHER' ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-blue-50 border-blue-100 text-z-blue'}`}>
                            {user.role === 'TEACHER' ? <GraduationCap className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                            <span className="text-[10px] font-black uppercase tracking-wider">{user.role}</span>
                         </div>
                      </td>
                      <td className="py-6 px-4">
                         {(user as User & { emailVerified: Date | null }).emailVerified ? (
                           <div className="inline-flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                              <CheckCircle2 className="w-3 h-3" />
                              <span className="text-[10px] font-black uppercase tracking-wide">Verified</span>
                           </div>
                         ) : (
                           <div className="inline-flex items-center space-x-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                              <ShieldAlert className="w-3 h-3" />
                              <span className="text-[10px] font-black uppercase tracking-wide">Active</span>
                           </div>
                         )}
                      </td>
                      <td className="py-6 px-4 text-xs font-bold text-zinc-500">
                         {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-6 px-8 text-right">
                         <button className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer">
                            <MoreVertical className="w-5 h-5" />
                         </button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </main>
    </div>
  );
}
