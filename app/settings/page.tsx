"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Lock, 
  Smartphone,
  Check,
  ChevronRight,
  Camera,
  LogOut
} from "lucide-react";

type SettingsSection = "profile" | "security" | "notifications" | "appearance";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsSection>("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { id: "security", label: "Security", icon: <Shield className="w-5 h-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      {/* Sidebar - Defaulting to TEACHER role for visual consistency in settings for now */}
      <Sidebar role="TEACHER" />
      
      <main className="flex-grow p-12 ml-72">
        {/* Modern Header */}
        <header className="mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-z-red tracking-tighter leading-none">Settings</h1>
            <div className="flex items-center space-x-3 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em]">
              <span>System Control</span>
              <span className="w-1.5 h-1.5 bg-z-red/20 rounded-full"></span>
              <span className="text-z-red/60">Account Hub</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Navigation Sidebar (Inner) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-card p-4 rounded-[2.5rem] premium-shadow space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsSection)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                    activeTab === tab.id 
                    ? "bg-z-red text-white shadow-xl shadow-z-red/20 scale-[1.02]" 
                    : "text-zinc-600 hover:bg-white/50 hover:text-z-red"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`${activeTab === tab.id ? "text-white" : "text-zinc-400 group-hover:text-z-red"}`}>
                      {tab.icon}
                    </span>
                    <span className="font-bold text-sm tracking-tight">{tab.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-all ${activeTab === tab.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                </button>
              ))}
            </div>

            <div className="glass-card p-6 rounded-[2.5rem] premium-shadow bg-z-red/5 border-z-red/10">
               <p className="text-[10px] font-black text-z-red uppercase tracking-widest mb-4">Quick Action</p>
               <button className="w-full flex items-center space-x-3 p-4 rounded-2xl text-z-red hover:bg-z-red/10 transition-all font-black text-xs uppercase tracking-widest">
                  <LogOut className="w-5 h-5" />
                  <span>Logout Account</span>
               </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="glass-card p-12 rounded-[3.5rem] premium-shadow min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "profile" && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-zinc-800 tracking-tighter">Public Profile</h2>
                      <p className="text-zinc-500 text-sm font-medium mt-1">Manage how you appear on the Zimplar platform.</p>
                    </div>
                    <button className="bg-z-red text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-z-red/20 hover:scale-105 active:scale-95 transition-all">
                      Save Changes
                    </button>
                  </div>

                  <div className="flex items-center space-x-10 pt-6">
                    <div className="relative group">
                       <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-100 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
                          <User className="w-12 h-12 text-zinc-300" />
                       </div>
                       <button className="absolute -bottom-2 -right-2 bg-z-red text-white p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform">
                          <Camera className="w-4 h-4" />
                       </button>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Profile Picture</p>
                       <p className="text-xs text-zinc-500 max-w-xs font-medium">PNG or JPG. Max 5MB. Recommended size 400x400px.</p>
                       <div className="flex space-x-4 pt-2">
                          <button className="text-[10px] font-black text-z-red uppercase tracking-widest border-b border-z-red pb-1">Upload New</button>
                          <button className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Remove</button>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Display Name</label>
                       <input type="text" defaultValue="Dr. Kwame Mensah" className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 font-bold text-zinc-800" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Email Address</label>
                       <input type="email" defaultValue="k.mensah@zimplar.com" className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 font-bold text-zinc-800" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Biographical Info</label>
                    <textarea rows={4} defaultValue="Senior Educator specializing in Discrete Mathematics and Computational Theory." className="w-full bg-zinc-50 border border-zinc-100 rounded-3xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 font-medium text-zinc-800 leading-relaxed" />
                    <p className="text-[10px] text-zinc-400 font-medium text-right mt-1">120 characters remaining</p>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-3xl font-black text-zinc-800 tracking-tighter">Security & Privacy</h2>
                    <p className="text-zinc-500 text-sm font-medium mt-1">Keep your account protected and your data safe.</p>
                  </div>

                  <div className="space-y-6 pt-6">
                    <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100 flex items-center justify-between">
                       <div className="flex items-center space-x-6">
                          <div className="bg-white p-4 rounded-2xl shadow-sm">
                             <Lock className="w-6 h-6 text-z-red" />
                          </div>
                          <div>
                             <h4 className="font-black text-zinc-800">Account Password</h4>
                             <p className="text-xs text-zinc-500 font-medium">Last updated 3 months ago</p>
                          </div>
                       </div>
                       <button className="bg-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-zinc-200 hover:bg-zinc-100 transition-colors">Change Password</button>
                    </div>

                    <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100 flex items-center justify-between">
                       <div className="flex items-center space-x-6">
                          <div className="bg-white p-4 rounded-2xl shadow-sm">
                             <Smartphone className="w-6 h-6 text-emerald-500" />
                          </div>
                          <div>
                             <h4 className="font-black text-zinc-800">Two-Factor Authentication</h4>
                             <p className="text-xs text-zinc-500 font-medium">Add an extra layer of security to your account.</p>
                          </div>
                       </div>
                       <div className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-14 h-8 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-z-red"></div>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-lg font-black text-zinc-800 tracking-tight ml-2">Active Sessions</h3>
                     <div className="divide-y divide-zinc-100">
                        {[
                          { device: "MacBook Pro - Amsterdam, NL", type: "Current Session", date: "Now", icon: <Check className="w-4 h-4 text-emerald-500" /> },
                          { device: "iPhone 13 - Accra, GH", type: "Mobile App", date: "Yesterday, 14:02", icon: null }
                        ].map((session, i) => (
                          <div key={i} className="py-6 flex justify-between items-center group">
                             <div className="space-y-1">
                                <p className="font-bold text-zinc-800 text-sm flex items-center space-x-2">
                                   <span>{session.device}</span>
                                   {session.icon}
                                </p>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{session.type} • {session.date}</p>
                             </div>
                             <button className="text-[10px] font-black text-zinc-400 hover:text-z-red uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Revoke</button>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-3xl font-black text-zinc-800 tracking-tighter">Communication</h2>
                    <p className="text-zinc-500 text-sm font-medium mt-1">Control how and when you hear from Zimplar.</p>
                  </div>

                  <div className="space-y-10 pt-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-zinc-800 tracking-tight ml-2">Email Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { title: "Course Submissions", desc: "Get notified when a student submits work.", default: true },
                          { title: "Live Session Reminders", desc: "Daily digest of upcoming scheduled classes.", default: true },
                          { title: "System Updates", desc: "Receive alerts about downtime or new features.", default: false },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center p-6 hover:bg-zinc-50 rounded-3xl transition-colors group">
                            <div className="space-y-1">
                              <h4 className="font-black text-zinc-800 text-sm group-hover:text-z-red transition-colors">{item.title}</h4>
                              <p className="text-xs text-zinc-500 font-medium">{item.desc}</p>
                            </div>
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked={item.default} />
                              <div className="w-12 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-z-red"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-3xl font-black text-zinc-800 tracking-tighter">System Aesthetic</h2>
                    <p className="text-zinc-500 text-sm font-medium mt-1">Customize the interface to match your preference.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest ml-2">Color Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                         {['Light', 'Dark', 'System'].map(theme => (
                           <button key={theme} className={`p-4 rounded-2xl border flex flex-col items-center space-y-3 transition-all ${theme === 'Light' ? 'bg-z-red/5 border-z-red/20 ring-2 ring-z-red/10' : 'bg-white border-zinc-100 hover:border-zinc-200'}`}>
                              <div className={`w-full aspect-video rounded-xl ${theme === 'Dark' ? 'bg-zinc-800' : theme === 'Light' ? 'bg-zinc-50' : 'bg-gradient-to-r from-zinc-50 to-zinc-800'}`}></div>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'Light' ? 'text-z-red' : 'text-zinc-400'}`}>{theme}</span>
                           </button>
                         ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest ml-2">Global Language</h3>
                      <div className="space-y-4">
                        <select className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 focus:outline-none font-bold text-zinc-800">
                           <option>English (US)</option>
                           <option>French (FR)</option>
                           <option>Spanish (ES)</option>
                           <option>Portuguese (PT)</option>
                        </select>
                        <div className="p-6 bg-z-red/5 rounded-3xl border border-z-red/10 flex items-center space-x-4">
                           <Globe className="w-5 h-5 text-z-red" />
                           <p className="text-[10px] font-medium text-z-red leading-relaxed">System text and student dashboards will be translated automatically.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
