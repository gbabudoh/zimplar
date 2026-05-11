"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { triggerNotification } from "@/lib/novu";

export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const db = prisma as unknown as { Notification: { findMany: (args: unknown) => Promise<unknown[]> } };
    const notifications = await db.Notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return notifications;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
}

export async function markAsRead(id: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  try {
    const db = prisma as unknown as { Notification: { update: (args: unknown) => Promise<unknown> } };
    await db.Notification.update({
      where: { id, userId: session.user.id },
      data: { isRead: true },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
}

export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user?.id) return;

  try {
    const db = prisma as unknown as { Notification: { updateMany: (args: unknown) => Promise<unknown> } };
    await db.Notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to mark all as read:", error);
  }
}

// Helper to create notification from other actions
export async function createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  category?: "SYSTEM" | "COURSE" | "BILLING" | "GAMIFICATION" | "SOCIAL";
  link?: string;
}) {
  try {
    const db = prisma as unknown as { Notification: { create: (args: unknown) => Promise<unknown> } };
    const notification = await db.Notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || "INFO",
        category: data.category || "SYSTEM",
        link: data.link,
      },
    });

    // Trigger Novu workflow for multi-channel delivery (Email, Push, etc.)
    await triggerNotification("zimplar-alert", data.userId, {
      title: data.title,
      message: data.message,
      category: data.category,
      link: data.link,
    });

    revalidatePath("/dashboard");
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}
