"use client";

import React from "react";
import QuizGeneratorDemo from "@/components/teacher/QuizGeneratorDemo";
import Sidebar from "@/components/dashboard/Sidebar";

export default function ContentCreationPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-z-red/30">
      <Sidebar role="TEACHER" />
      
      <main className="lg:ml-72 p-8 pt-12">
        <div className="mb-12">
           <h1 className="text-4xl font-black tracking-tighter mb-2">Teacher Workspace</h1>
           <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Content Automation Center</p>
        </div>

        <QuizGeneratorDemo />
      </main>
    </div>
  );
}
