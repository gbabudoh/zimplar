"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const db = prisma as any;

export async function createSchool(formData: {
  name: string;
  location: string;
  regionType: "URBAN" | "RURAL";
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "TEACHER" && role !== "ADMIN" && role !== "ORG_ADMIN") {
    throw new Error("Forbidden: Only teachers and admins can provision schools");
  }

  try {
    const school = await db.school.create({
      data: {
        name: formData.name,
        location: formData.location,
        regionType: formData.regionType,
        ownerId: session.user.id,
      },
    });

    revalidatePath("/dashboard/org/schools");
    return { success: true, school };
  } catch (error: any) {
    console.error("Failed to create school:", error);
    return { success: false, error: error.message || "Failed to create school" };
  }
}

export async function getSchools() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const schools = await db.school.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return schools;
  } catch (error: any) {
    console.error("Failed to fetch schools:", error);
    return [];
  }
}

export async function deleteSchool(schoolId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const school = await db.school.findUnique({ where: { id: schoolId } });
    if (!school || school.ownerId !== session.user.id) {
      throw new Error("Forbidden");
    }

    await db.school.delete({ where: { id: schoolId } });

    revalidatePath("/dashboard/org/schools");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete school:", error);
    return { success: false, error: error.message || "Failed to delete school" };
  }
}
