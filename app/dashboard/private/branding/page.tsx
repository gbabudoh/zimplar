"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Palette, Upload, Check, Eye } from "lucide-react";

export default function BrandingSettingsPage() {
  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar role="SCHOOL" />
      
      <main className="flex-grow p-10 ml-72">
        <header className="mb-12">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-white p-2 rounded-xl shadow-lg border border-zinc-200">
              <Palette className="w-5 h-5 text-z-red stroke-[2.5]" />
            </div>
            <h1 className="text-3xl font-black text-zinc-800 tracking-tight">
              School <span className="text-zinc-950">Branding</span>
            </h1>
          </div>
          <p className="text-zinc-600 font-medium ml-1">Customize how your school appears to students and parents.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-zinc-100">
              <h3 className="text-xl font-black text-zinc-800 mb-8">Identity Settings</h3>
              
              <div className="space-y-10">
                <div className="flex items-start space-x-8">
                  <div className="w-32 h-32 bg-zinc-50 rounded-[2rem] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400 group cursor-pointer hover:border-z-red transition-colors">
                    <Upload className="w-6 h-6 mb-2 group-hover:text-z-red transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Upload Logo</span>
                  </div>
                  <div className="flex-grow pt-2">
                    <p className="font-black text-zinc-900 mb-1">Institutional Logo</p>
                    <p className="text-xs text-zinc-600 mb-4 font-bold">This logo will appear on student IDs, certificates, and reports.</p>
                    <div className="flex space-x-2">
                      <button className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest">Replace</button>
                      <button className="bg-white border border-zinc-200 text-zinc-600 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
                  <div className="space-y-4">
                    <p className="font-black text-zinc-900">Primary Color</p>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-z-red rounded-xl shadow-lg shadow-z-red/20 border-4 border-white"></div>
                      <input 
                        type="text" 
                        defaultValue="#552121"
                        className="bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-xs font-black text-zinc-800 focus:outline-none focus:border-z-red"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                     <p className="font-black text-zinc-900">Secondary Color</p>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-z-blue rounded-xl shadow-lg shadow-z-blue/20 border-4 border-white"></div>
                      <input 
                        type="text" 
                        defaultValue="#529C9F"
                        className="bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-xs font-black text-zinc-800 focus:outline-none focus:border-z-red"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-zinc-50 flex justify-end">
                <button className="bg-z-red text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-z-red/20 hover:scale-105 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-zinc-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-6 text-z-red">
                  <Eye className="w-5 h-5 shadow-sm" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Live Preview</span>
                </div>
                
                {/* Mock Card Preview */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl transform  scale-90 origin-top">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-z-red rounded-full"></div>
                    <div className="h-2 w-24 bg-zinc-100 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-zinc-50 rounded-lg"></div>
                    <div className="h-32 w-full bg-gradient-to-br from-z-red/5 to-z-blue/5 rounded-2xl border border-zinc-100 flex items-center justify-center">
                       <Check className="w-8 h-8 text-z-red opacity-20" />
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-[10px] text-zinc-400 font-medium text-center italic">How your certificate headers will appear.</p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-z-red/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
