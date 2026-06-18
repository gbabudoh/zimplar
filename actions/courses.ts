"use server";

import prisma from "@/lib/db";

const CATEGORY_COLORS: Record<string, string> = {
  Mathematics: "bg-z-red",
  Science: "bg-z-gold",
  Technology: "bg-z-blue",
  Business: "bg-z-rose",
  Arts: "bg-z-gray",
  Language: "bg-emerald-500",
};

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] || "bg-zinc-800";
}

export async function getExploreCourses() {
  try {
    const db = prisma as unknown as { course: { findMany: (args: unknown) => Promise<unknown[]> } };
    const courses = await db.course.findMany({
      include: {
        teacher: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return (courses as unknown as { id: string, title: string, category: string, teacher: { name: string | null }, _count: { enrollments: number, lessons: number }, thumbnail: string | null }[]).map((course) => ({
      id: course.id,
      title: course.title,
      category: course.category,
      instructor: course.teacher.name || "Unknown Instructor",
      students: course._count.enrollments,
      lessons: course._count.lessons,
      image: course.thumbnail || null,
      color: getCategoryColor(course.category),
    }));
  } catch (error) {
    console.error("Failed to fetch explore courses:", error);
    return [];
  }
}

export async function getActiveLessonsCount() {
  try {
    return await (prisma as any).lesson.count();
  } catch (error) {
    console.error("Failed to fetch active lessons count:", error);
    return 0;
  }
}

export async function getPublicStats() {
  try {
    const [videoSessionCount, revenueAgg] = await Promise.all([
      (prisma as any).videoSession.count(),
      (prisma as any).transaction.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" }
      })
    ]);

    return {
      activeBroadcasts: videoSessionCount,
      totalRevenue: revenueAgg._sum.amount || 0,
    };
  } catch (error) {
    console.error("Failed to fetch public homepage stats:", error);
    return {
      activeBroadcasts: 0,
      totalRevenue: 0,
    };
  }
}

