"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const db = prisma as any;

export async function createSession(formData: { title: string; courseId: string; description?: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "TEACHER" && role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  try {
    // Generate a unique room name for LiveKit / WebRTC (e.g. room-xxxxxx)
    const roomName = `room-${Math.random().toString(36).substring(2, 11)}`;

    const lesson = await db.lesson.create({
      data: {
        title: formData.title,
        description: formData.description || "",
        courseId: formData.courseId,
        videoUrl: roomName,
      },
    });

    revalidatePath("/dashboard/teacher/sessions");
    revalidatePath("/dashboard/teacher");
    return { success: true, lesson };
  } catch (error: any) {
    console.error("Failed to create session:", error);
    return { success: false, error: error.message || "Failed to create session" };
  }
}
