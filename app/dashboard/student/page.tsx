import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import StudentDashboardContent from "@/components/student/StudentDashboardContent";

export default async function StudentDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  interface UserStats {
    points: number;
    level: number;
    focusTime: number;
    currentStreak: number;
  }

  // 1. Fetch User Stats
  const prisma = db as unknown as { userStats: { findUnique: (args: unknown) => Promise<UserStats | null>, create: (args: unknown) => Promise<UserStats> } };
  let stats = await prisma.userStats.findUnique({
    where: { userId: session.user.id }
  });

  if (!stats) {
    try {
      stats = await prisma.userStats.create({
        data: {
          userId: session.user.id,
          points: 0,
          level: 1,
          focusTime: 0
        }
      });
    } catch (e) {
      console.error("Stats creation failed (User might not exist yet):", e);
      // Fallback stats to prevent 500 error
      stats = { points: 0, level: 1, focusTime: 0, currentStreak: 0 };
    }
  }

  // 2. Fetch Enrollments with Course details
  const enrollments = await db.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // 3. Fetch Upcoming Assessments
  const upcomingAssessments = await db.assessment.findMany({
    where: {
      course: {
        enrollments: {
          some: {
            userId: session.user.id
          }
        }
      },
      dueDate: {
        gte: new Date()
      }
    },
    orderBy: {
      dueDate: 'asc'
    },
    take: 5
  });

  return (
    <StudentDashboardContent 
      user={session.user}
      stats={stats}
      enrollments={enrollments}
      upcomingAssessments={upcomingAssessments}
    />
  );
}
