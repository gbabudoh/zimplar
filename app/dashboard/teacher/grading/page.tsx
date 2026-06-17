import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import GradingClientView from "@/components/dashboard/GradingClientView";

const prisma = db as any;

export default async function TeacherGradingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "TEACHER" && role !== "ADMIN") {
    redirect("/login");
  }

  const teacherId = session.user.id;

  // Fetch all student submissions linked to courses this teacher hosts
  const submissionsData = await prisma.submission.findMany({
    where: {
      OR: [
        {
          assignment: {
            lesson: {
              course: {
                teacherId,
              },
            },
          },
        },
        {
          assessment: {
            course: {
              teacherId,
            },
          },
        },
      ],
    },
    include: {
      student: {
        select: {
          name: true,
        },
      },
      assignment: {
        include: {
          lesson: {
            include: {
              course: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      },
      assessment: {
        include: {
          course: {
            select: {
              title: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate stats dynamically
  const totalSubmissions = submissionsData.length;
  const pendingCount = submissionsData.filter((sub: any) => sub.status === "PENDING").length;
  const gradedCount = totalSubmissions - pendingCount;
  const completionRate = totalSubmissions > 0 ? Math.round((gradedCount / totalSubmissions) * 100) : 100;

  // Calculate late count: if assessment has a due date and submission is past it
  const lateCount = submissionsData.filter((sub: any) => {
    if (sub.assessment && sub.assessment.dueDate) {
      return new Date(sub.createdAt) > new Date(sub.assessment.dueDate);
    }
    return false;
  }).length;

  const submissions = submissionsData.map((sub: any) => {
    const studentName = sub.student?.name || "Student";
    const courseTitle = sub.assignment?.lesson?.course?.title || sub.assessment?.course?.title || "General";
    const taskTitle = sub.assignment?.title || sub.assessment?.title || "Classroom Assignment";
    const timeLabel = new Date(sub.createdAt).toLocaleDateString();

    return {
      id: sub.id,
      studentName,
      courseTitle,
      taskTitle,
      fileUrl: sub.fileUrl,
      status: sub.status,
      grade: sub.grade,
      feedback: sub.feedback,
      timeLabel,
    };
  });

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar role="TEACHER" />
      
      <main className="flex-grow p-12 ml-72">
        {/* Grading Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {[
            { label: "Pending Review", value: pendingCount.toString(), icon: <Clock className="w-6 h-6" />, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Completion Rate", value: `${completionRate}%`, icon: <CheckCircle2 className="w-6 h-6" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Late Submissions", value: lateCount.toString(), icon: <AlertCircle className="w-6 h-6" />, color: "text-amber-500", bg: "bg-amber-500/10" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-8 rounded-[2.5rem] flex items-center space-x-6 group hover:translate-y-[-4px] transition-all duration-500 premium-shadow">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl shadow-sm`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-zinc-800 tracking-tight">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <GradingClientView submissions={submissions} />
      </main>
    </div>
  );
}
