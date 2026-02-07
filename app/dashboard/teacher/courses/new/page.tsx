"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  ArrowLeft, 
  ArrowRight,
  Upload, 
  Brain
} from "lucide-react";
import Link from "next/link";

export default function NewCoursePage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      
      <main className="flex-grow p-8 ml-64">
        {/* Breadcrumbs & Header */}
        <div className="mb-10">
          <Link href="/dashboard/teacher/courses" className="flex items-center space-x-2 text-z-gray/60 hover:text-z-red transition-all group mb-4">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             <span className="text-xs font-black uppercase tracking-widest">Back to Courses</span>
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-z-red tracking-tight leading-none">New Course Wizard</h1>
              <p className="text-z-gray font-medium mt-2">Design a premium learning experience for your students.</p>
            </div>
            <div className="flex space-x-3">
               <button className="px-6 py-2.5 bg-white border border-z-blue/10 rounded-2xl font-black text-z-gray text-xs hover:bg-z-blue/5 transition-all cursor-pointer">
                  SAVE DRAFT
               </button>
               <button className="px-6 py-2.5 bg-z-red text-white rounded-2xl font-black text-xs shadow-lg shadow-z-red/20 hover:bg-z-red/90 transition-all cursor-pointer">
                  PUBLISH COURSE
               </button>
            </div>
          </div>
        </div>

        {/* Step Progress */}
        <div className="flex items-center space-x-4 mb-12">
           {[
             { n: 1, label: "Basic Info" },
             { n: 2, label: "Curriculum" },
             { n: 3, label: "Assessments" },
             { n: 4, label: "Final Review" }
           ].map((s) => (
             <React.Fragment key={s.n}>
                <div className="flex items-center space-x-3">
                   <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all ${step === s.n ? 'bg-z-red text-white shadow-xl scale-110' : 'bg-white text-z-gray/30 border border-z-blue/5'}`}>
                      {s.n}
                   </div>
                   <span className={`text-xs font-black uppercase tracking-widest ${step === s.n ? 'text-z-red' : 'text-z-gray/30'}`}>{s.label}</span>
                </div>
                {s.n < 4 && <div className="h-0.5 w-12 bg-z-blue/5 rounded-full"></div>}
             </React.Fragment>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-12">
            {step === 1 && (
              <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-z-gray/60 uppercase tracking-widest ml-2">Course Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Quantum Mechanics for Beginners"
                        className="w-full bg-slate-50 border border-z-blue/10 rounded-2xl py-5 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all text-xl font-bold text-z-gray"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-z-gray/60 uppercase tracking-widest ml-2">Description</label>
                      <textarea 
                        rows={4}
                        placeholder="Describe the core outcomes and value of this course..."
                        className="w-full bg-slate-50 border border-z-blue/10 rounded-2xl py-5 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 transition-all text-sm font-medium text-z-gray leading-relaxed"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-z-gray/60 uppercase tracking-widest ml-2">Thumbnail</label>
                      <div className="h-48 bg-slate-50 border-2 border-dashed border-z-blue/20 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-6 group cursor-pointer hover:border-z-red/50 hover:bg-z-red/5 transition-all">
                         <div className="bg-white p-4 rounded-3xl shadow-lg mb-2 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-z-red" />
                         </div>
                         <p className="text-xs font-black text-z-gray/60">Upload Image</p>
                         <p className="text-[8px] font-bold text-z-gray/40 mt-1 uppercase tracking-tighter">(1200x800 recommended)</p>
                      </div>
                   </div>
                   <div className="space-y-6 flex flex-col justify-end">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-z-gray/60 uppercase tracking-widest ml-2">Category</label>
                         <select className="w-full bg-slate-50 border border-z-blue/10 rounded-2xl py-4 px-6 focus:outline-none font-bold text-z-gray">
                            <option>Science</option>
                            <option>Mathematics</option>
                            <option>Technology</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-z-gray/60 uppercase tracking-widest ml-2">Level</label>
                         <div className="flex space-x-2">
                            {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                              <button key={l} className="flex-1 py-3 px-4 rounded-xl border border-z-blue/10 font-black text-[10px] uppercase hover:bg-z-red hover:text-white transition-all">
                                {l}
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Tips Sidebar */}
          <div className="space-y-8">
             <div className="bg-z-blue p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                   <div className="flex items-center space-x-2 text-white/60">
                      <Brain className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Expert Tip</span>
                   </div>
                   <h3 className="text-xl font-black leading-tight">Engage with Video</h3>
                   <p className="text-white/70 text-xs font-medium">Courses with intro videos have a <span className="text-white font-black">40% higher</span> student enrollment rate.</p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
             </div>

             <div className="bg-white p-8 rounded-[3rem] border border-z-blue/5 shadow-xl space-y-6">
                <h4 className="text-[10px] font-black text-z-gray/40 uppercase tracking-widest">Live Help</h4>
                <div className="space-y-4">
                   <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-z-red flex items-center justify-center text-white font-black text-[10px]">AI</div>
                      <div>
                         <p className="text-xs font-medium text-z-gray">Need help title ideas? I can generate several based on your description.</p>
                         <button className="text-[10px] font-black text-z-red mt-2 hover:opacity-70">GENERATE TITLES</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="mt-12 flex justify-end">
           <button 
             onClick={() => setStep(step + 1)}
             className="flex items-center space-x-3 bg-z-red text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-z-red/20 transform hover:-translate-y-1 active:scale-95 transition-all cursor-pointer"
           >
              <span>Next Step</span>
              <ArrowRight className="w-5 h-5" />
           </button>
        </div>
      </main>
    </div>
  );
}
