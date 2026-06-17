import React from "react";
import QuizGenerator from "@/components/teacher/QuizGenerator";
import Sidebar from "@/components/dashboard/Sidebar";
import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";

const prisma = db as any;

export default async function ContentCreationPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "TEACHER" && role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch all courses taught by the teacher to link generated assessments
  const courses = await prisma.course.findMany({
    where: {
      teacherId: session.user.id,
    },
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar role="TEACHER" />
      
      <main className="flex-grow p-12 ml-72">
        {/* Minimalist Modern Header */}
        <header className="flex justify-between items-end mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-z-red tracking-tighter leading-none">Content</h1>
            <div className="flex items-center space-x-3 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em]">
              <span>Content Automation Center</span>
              <span className="w-1.5 h-1.5 bg-z-red/20 rounded-full"></span>
              <span className="text-z-red/60">AI Workspace</span>
            </div>
          </div>
        </header>

        <QuizGenerator courses={courses} />
      </main>
    </div>
  );
}
