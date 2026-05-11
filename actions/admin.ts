"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

interface SystemFeatures {
  registration: boolean;
  maintenance: boolean;
  betaFeatures: boolean;
  [key: string]: boolean | string | number | null | undefined;
}

/**
 * Validates that the current user has the ADMIN role.
 * Throws an error if not authorized.
 */
async function checkAdmin() {
  const session = await auth();
  if (!session || (session.user as { role?: Role })?.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Administrative access required.");
  }
  return session;
}

// --- CMS ACTIONS ---

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return settings;
  } catch (error) {
    console.error("[ADMIN_CMS] Failed to fetch settings:", error);
    return null;
  }
}

export async function updateSiteSettings(data: {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  features?: SystemFeatures | Record<string, boolean>;
}) {
  await checkAdmin();
  
  try {
    const current = await prisma.siteSettings.findFirst();
    
    if (current) {
      const updated = await prisma.siteSettings.update({
        where: { id: current.id },
        data
      });
      revalidatePath("/");
      return updated;
    } else {
      const created = await prisma.siteSettings.create({
        data: {
          heroTitle: data.heroTitle || "Welcome to Zimplar",
          ...data
        }
      });
      revalidatePath("/");
      return created;
    }
  } catch (error) {
    console.error("[ADMIN_CMS] Update failed:", error);
    throw new Error("Failed to update site settings.");
  }
}

// --- USER MANAGEMENT ACTIONS ---

export async function getAllUsers() {
  await checkAdmin();
  
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        enrollments: true,
        courses: true, // Teachers courses
      }
    });
    return users;
  } catch (error) {
    console.error("[ADMIN_USERS] Fetch failed:", error);
    return [];
  }
}

export async function updateUserRole(userId: string, role: string) {
  await checkAdmin();
  
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: role as Role }
    });
    revalidatePath("/dashboard/admin/users");
    return updated;
  } catch (error) {
    console.error("[ADMIN_USERS] Role update failed:", error);
    throw new Error("Failed to update user role.");
  }
}

// Note: Future actions for Banning, Subscriptions, and Analytics will be added here.
