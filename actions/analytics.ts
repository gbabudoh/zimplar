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
      totalOrgAdmins,
      totalAdmins,
      totalCourses,
      completedRevenueData,
      activeSubscriptions,
      recentAlerts,
      alertsByType
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.TEACHER } }),
      prisma.user.count({ where: { role: Role.STUDENT } }),
      prisma.user.count({ where: { role: Role.ORG_ADMIN } }),
      prisma.user.count({ where: { role: Role.ADMIN } }),
      prisma.course.count(),
      prisma.transaction.aggregate({
        _count: true,
        _sum: { amount: true },
        where: { status: "COMPLETED" }
      }),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.aIAlert.count(),
      prisma.aIAlert.groupBy({ by: ["type"], _count: true })
    ]);

    // Aggregate revenue by plan type
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
        orgAdmins: totalOrgAdmins,
        admins: totalAdmins,
        courses: totalCourses,
        revenue: (completedRevenueData as AggregateResult)._sum.amount || 0,
        transactionCount: (completedRevenueData as AggregateResult)._count || 0,
        subscriptions: activeSubscriptions,
        alerts: recentAlerts
      },
      revenueByPlan,
      alertsByType
    };
  } catch (error) {
    console.error("[ANALYTICS] Failed to fetch metrics:", error);
    throw new Error("Analytics retrieval failed.");
  }
}

export async function getRecentTransactionsAdmin() {
  await checkAdmin();
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { name: true, email: true } } }
    });
    return transactions;
  } catch (error) {
    console.error("[ANALYTICS_TX] Failed:", error);
    return [];
  }
}

export async function getDataSalesSummary() {
  await checkAdmin();
  try {
    const agg = await prisma.dataPurchase.aggregate({
      _sum: { cost: true, amountGB: true }
    });
    return {
      totalRevenue: agg._sum.cost || 0,
      totalGBSold: agg._sum.amountGB || 0
    };
  } catch (error) {
    console.error("[ANALYTICS_DATA] Failed:", error);
    return { totalRevenue: 0, totalGBSold: 0 };
  }
}

export async function getSubscriptionTierCounts() {
  await checkAdmin();
  try {
    const counts = await prisma.subscription.groupBy({
      by: ["planType"],
      where: { status: "ACTIVE" },
      _count: true
    });
    return counts;
  } catch (error) {
    console.error("[ANALYTICS_TIERS] Failed:", error);
    return [];
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
