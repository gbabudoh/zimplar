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

  // 1. Fetch or create User Stats
  const prisma = db as unknown as { userStats: { upsert: (args: unknown) => Promise<UserStats> } };
  let stats: UserStats;
  try {
    stats = await prisma.userStats.upsert({
      where: { userId: session.user.id },
      update: {},
      create: {
        userId: session.user.id,
        points: 0,
        level: 1,
        focusTime: 0,
        currentStreak: 0,
      }
    });
  } catch (e) {
    console.error("Stats upsert failed:", e);
    stats = { points: 0, level: 1, focusTime: 0, currentStreak: 0 };
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
