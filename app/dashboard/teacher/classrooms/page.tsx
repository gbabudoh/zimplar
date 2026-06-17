import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import ClassroomsClientView from "@/components/dashboard/ClassroomsClientView";

const prisma = db as any;

export default async function TeacherClassroomsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "TEACHER" && role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch classrooms created by this teacher
  const classroomsData = await prisma.classroom.findMany({
    where: {
      teacherId: session.user.id,
    },
    include: {
      students: true,
      courses: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch courses created by this teacher to link new classrooms
  const coursesData = await prisma.course.findMany({
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

  // Map database classroom model to front-end presentation format
  const classrooms = classroomsData.map((room: any) => {
    const courseTitle = room.courses.length > 0
      ? room.courses.map((c: any) => c.title).join(", ")
      : "No Linked Course";

    return {
      id: room.id,
      name: room.name,
      course: courseTitle,
      students: room.students.length,
      active: true, // Mark active/accessible by default
      startTime: "Daily Live",
      instructor: session.user.name || "Instructor",
    };
  });

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar role="TEACHER" />
      
      <main className="flex-grow p-12 ml-72">
        <ClassroomsClientView initialClassrooms={classrooms} courses={coursesData} />
      </main>
    </div>
  );
}
