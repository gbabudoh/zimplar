"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { triggerNotification } from "@/lib/novu";

export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const notifications = await (prisma as unknown as { notification: { findMany: (args: unknown) => Promise<unknown[]> } }).notification.findMany({
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
    await (prisma as unknown as { notification: { update: (args: unknown) => Promise<unknown> } }).notification.update({
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
    await (prisma as unknown as { notification: { updateMany: (args: unknown) => Promise<unknown> } }).notification.updateMany({
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
    const notification = await (prisma as unknown as { notification: { create: (args: unknown) => Promise<unknown> } }).notification.create({
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
