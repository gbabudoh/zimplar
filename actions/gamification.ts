"use server";

import db from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Using any cast to handle potential IDE sync lag with Prisma Client
const prisma = db as unknown as { userStats: { findUnique: (a: unknown) => Promise<{ points: number, level: number, currentStreak: number, longestStreak: number, lastActive: Date | null } | null>, create: (a: unknown) => Promise<{ points: number, level: number, currentStreak: number, longestStreak: number }>, upsert: (a: unknown) => Promise<{ points: number, level: number }>, update: (a: unknown) => Promise<unknown> }, badge: { findUnique: (a: unknown) => Promise<{ id: string } | null> }, userBadge: { upsert: (a: unknown) => Promise<unknown> } };

export async function getGamificationStats() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const stats = await prisma.userStats.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          include: {
            badges: {
              include: {
                badge: true
              }
            }
          }
        }
      }
    });

    if (!stats) {
      return await prisma.userStats.create({
        data: {
          userId: session.user.id,
          points: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
        }
      });
    }

    return stats;
  } catch (error) {
    console.error("Gamification Stats Error:", error);
    return null;
  }
}

export async function updateUserXP(amount: number) {
  const session = await auth();
  if (!session?.user?.id) return;

  try {
    const stats = await prisma.userStats.upsert({
      where: { userId: session.user.id },
      update: {
        points: { increment: amount },
      },
      create: {
        userId: session.user.id,
        points: amount,
        level: 1,
      }
    });

    const newLevel = Math.floor(stats.points / 1000) + 1;
    if (newLevel > stats.level) {
      await prisma.userStats.update({
        where: { userId: session.user.id },
        data: { level: newLevel }
      });
    }

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Update XP Error:", error);
  }
}

export async function updateUserStreak() {
  const session = await auth();
  if (!session?.user?.id) return;

  try {
    const stats = await prisma.userStats.findUnique({
      where: { userId: session.user.id }
    });

    if (!stats) {
      await prisma.userStats.create({
        data: { userId: session.user.id, currentStreak: 1, longestStreak: 1 }
      });
      return;
    }

    const now = new Date();
    const lastActive = stats.lastActive ? new Date(stats.lastActive) : new Date(now.getTime() - 86400000 * 2); // Default to 2 days ago if null to trigger new streak
    const diffTime = Math.abs(now.getTime() - lastActive.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      const newStreak = stats.currentStreak + 1;
      await prisma.userStats.update({
        where: { userId: session.user.id },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, stats.longestStreak),
          lastActive: now
        }
      });
    } else if (diffDays > 1) {
      await prisma.userStats.update({
        where: { userId: session.user.id },
        data: {
          currentStreak: 1,
          lastActive: now
        }
      });
    } else {
      await prisma.userStats.update({
        where: { userId: session.user.id },
        data: { lastActive: now }
      });
    }

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Update Streak Error:", error);
  }
}

export async function awardBadge(badgeName: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  try {
    const badge = await prisma.badge.findUnique({
      where: { name: badgeName }
    });

    if (!badge) return;

    await prisma.userBadge.upsert({
      where: {
        userId_badgeId: {
          userId: session.user.id,
          badgeId: badge.id
        }
      },
      update: {},
      create: {
        userId: session.user.id,
        badgeId: badge.id
      }
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Award Badge Error:", error);
  }
}
