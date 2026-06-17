"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const db = prisma as any;

export async function createClassroom(formData: { name: string; description?: string; courseId?: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "TEACHER" && role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  try {
    const data: any = {
      name: formData.name,
      description: formData.description || "",
      teacherId: session.user.id,
    };

    if (formData.courseId) {
      data.courses = {
        connect: {
          id: formData.courseId,
        },
      };
    }

    const classroom = await db.classroom.create({
      data,
    });

    revalidatePath("/dashboard/teacher/classrooms");
    return { success: true, classroom };
  } catch (error: any) {
    console.error("Failed to create classroom:", error);
    return { success: false, error: error.message || "Failed to create classroom" };
  }
}
