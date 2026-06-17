import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import SessionsClientView from "@/components/dashboard/SessionsClientView";

const prisma = db as any;

export default async function TeacherSessionsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "TEACHER" && role !== "ADMIN") {
    redirect("/login");
  }

  const teacherId = session.user.id;

  // Retrieve lessons that have a videoUrl and belong to the teacher's courses
  const lessonsData = await prisma.lesson.findMany({
    where: {
      videoUrl: {
        not: null,
      },
      course: {
        teacherId,
      },
    },
    include: {
      course: {
        include: {
          enrollments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Retrieve teacher's courses to populate scheduling list
  const coursesData = await prisma.course.findMany({
    where: {
      teacherId,
    },
    include: {
      enrollments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate total unique student enrollments across all teacher's courses
  const totalStudents = await db.enrollment.count({
    where: {
      course: { teacherId },
    },
  });

  // Helper for consistent initials
  const getInitials = (title: string) => {
    return title.split(" ").map((p: string) => p[0]).join("").toUpperCase().slice(0, 2);
  };

  // Map database lessons to front-end presentation sessions format
  const sessions = lessonsData.map((lesson: any, i: number) => {
    // If it's the most recently scheduled lesson, mark it as "Live", else "Scheduled"
    const status = i === 0 ? "Live" : "Scheduled";
    const dateLabel = new Date(lesson.createdAt).toLocaleDateString();

    return {
      id: lesson.id,
      title: lesson.title,
      course: lesson.course.title,
      time: "14:00 PM - 15:30 PM", // Default scheduling block
      date: dateLabel,
      students: lesson.course.enrollments.length,
      status,
      avatar: getInitials(lesson.title),
      videoUrl: lesson.videoUrl,
    };
  });

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar role="TEACHER" />
      
      <main className="flex-grow p-12 ml-72">
        <SessionsClientView 
          initialSessions={sessions} 
          courses={coursesData} 
          totalStudents={totalStudents} 
        />
      </main>
    </div>
  );
}
