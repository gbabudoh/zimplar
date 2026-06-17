"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const db = prisma as any;

export async function gradeSubmission(formData: { submissionId: string; grade: string; feedback?: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "TEACHER" && role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  try {
    const submission = await db.submission.update({
      where: { id: formData.submissionId },
      data: {
        grade: formData.grade,
        feedback: formData.feedback || "",
        status: "GRADED",
      },
    });

    revalidatePath("/dashboard/teacher/grading");
    revalidatePath("/dashboard/teacher");
    return { success: true, submission };
  } catch (error: any) {
    console.error("Failed to grade submission:", error);
    return { success: false, error: error.message || "Failed to grade submission" };
  }
}
