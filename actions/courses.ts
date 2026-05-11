"use server";

import prisma from "@/lib/db";

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

    return (courses as unknown as { id: string, title: string, category: string, teacher: { name: string }, _count: { enrollments: number, lessons: number }, thumbnail: string | null }[]).map((course) => ({
      id: course.id,
      title: course.title,
      category: course.category,
      instructor: course.teacher.name || "Unknown Instructor",
      rating: 4.5 + Math.random() * 0.5, // Mock rating for now
      students: course._count.enrollments.toString(),
      duration: `${course._count.lessons * 2}h`, // Mock duration based on lessons
      price: "Free", // Default to free for now
      image: course.thumbnail || `https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800`,
      level: "Intermediate",
      color: getRandomColor(course.category),
    }));
  } catch (error) {
    console.error("Failed to fetch explore courses:", error);
    return [];
  }
}

function getRandomColor(category: string) {
  const colors: Record<string, string> = {
    Mathematics: "bg-z-red",
    Science: "bg-z-gold",
    Technology: "bg-z-blue",
    Business: "bg-z-rose",
    Arts: "bg-z-gray",
    Language: "bg-emerald-500",
  };
  return colors[category] || "bg-zinc-800";
}
