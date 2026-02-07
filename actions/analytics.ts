"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { Role } from "@prisma/client";

async function checkAdmin() {
  const session = await auth();
  if (!session || (session.user as { role?: Role })?.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Administrative access required.");
  }
  return session;
}

interface AggregateResult {
  _sum: { amount: number | null };
  _count: number | null;
}

export async function getPlatformAnalytics() {
  await checkAdmin();

  try {
    const [
      totalUsers,
      totalTeachers,
      totalStudents,
      totalCourses,
      totalRevenueData,
      recentAlerts
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.TEACHER } }),
      prisma.user.count({ where: { role: Role.STUDENT } }),
      prisma.course.count(),
      // @ts-expect-error - Prisma model name "Transaction" collides with internal methods in some IDEs
      prisma.transaction.aggregate({
        _count: true,
        _sum: { amount: true }
      }),
      // @ts-expect-error - Prisma model "AIAlert" pending full IDE type synchronization
      prisma.aIAlert.count()
    ]);

    // Aggregate revenue by plan type
    // @ts-expect-error - Prisma model "Subscription" pending full IDE type synchronization
    const revenueByPlan = await prisma.subscription.groupBy({
      by: ['planType'],
      _sum: { amount: true },
      _count: true
    });

    return {
      stats: {
        users: totalUsers,
        teachers: totalTeachers,
        students: totalStudents,
        courses: totalCourses,
        revenue: (totalRevenueData as AggregateResult)._sum.amount || 0,
        subscriptions: (totalRevenueData as AggregateResult)._count || 0,
        alerts: recentAlerts
      },
      revenueByPlan,
      recentTransactions: totalRevenueData
    };
  } catch (error) {
    console.error("[ANALYTICS] Failed to fetch metrics:", error);
    throw new Error("Analytics retrieval failed.");
  }
}

export async function getCourseEngagement() {
  await checkAdmin();
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { enrollments: true, lessons: true }
        }
      },
      take: 5,
      orderBy: { enrollments: { _count: "desc" } }
    });
    return courses;
  } catch (error) {
    console.error("[ANALYTICS_COURSES] Failed:", error);
    return [];
  }
}
