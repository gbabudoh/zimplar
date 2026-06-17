"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// Cast prisma to any to bypass any TypeScript cache issues in some IDE environments
const db = prisma as any;

/**
 * Validates that the current user is authenticated.
 */
async function checkAuth() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized: Access denied.");
  }
  return session as { user: { id: string } };
}

/**
 * Updates the user's display name, email, biography, and profile image.
 */
export async function updateUserProfile(data: {
  name: string;
  email: string;
  bio: string;
  image?: string;
}) {
  const session = await checkAuth();
  const userId = session.user.id;

  const name = data.name.trim();
  const email = data.email.toLowerCase().trim();
  const bio = data.bio;
  const image = data.image;

  if (!name) {
    return { error: "Display name is required." };
  }
  if (!email) {
    return { error: "Email address is required." };
  }

  try {
    // Check if the email is already in use by another user
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      return { error: "This email address is already in use." };
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        bio,
        image,
      },
    });

    revalidatePath("/settings");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("[SETTINGS_PROFILE] Update failed:", error);
    return { error: "Failed to update profile." };
  }
}

/**
 * Validates current password and updates to a new password.
 */
export async function updateUserPassword(data: {
  currentPassword?: string;
  newPassword?: string;
}) {
  const session = await checkAuth();
  const userId = session.user.id;

  const currentPassword = data.currentPassword;
  const newPassword = data.newPassword;

  if (!newPassword || newPassword.length < 6) {
    return { error: "New password must be at least 6 characters long." };
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found." };
    }

    // If the user already has a password set, we require currentPassword to match
    if (user.password) {
      if (!currentPassword) {
        return { error: "Current password is required to change your password." };
      }
      const isCorrect = await bcrypt.compare(currentPassword, user.password);
      if (!isCorrect) {
        return { error: "The current password you entered is incorrect." };
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true, message: "Your password has been changed successfully." };
  } catch (error) {
    console.error("[SETTINGS_PASSWORD] Update failed:", error);
    return { error: "Failed to change password." };
  }
}

/**
 * Toggles two-factor authentication.
 */
export async function updateUserSecurity(data: { twoFactorEnabled: boolean }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be logged in to change security settings." };
    }
    const userId = session.user.id;

    await db.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: data.twoFactorEnabled },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("[SETTINGS_SECURITY] Update failed:", error);
    return { error: "Failed to update security settings." };
  }
}

/**
 * Updates communication and email preferences.
 */
export async function updateUserNotificationPreferences(data: {
  notifCourseSub: boolean;
  notifLiveReminder: boolean;
  notifSystemUpdate: boolean;
}) {
  const session = await checkAuth();
  const userId = session.user.id;

  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        notifCourseSub: data.notifCourseSub,
        notifLiveReminder: data.notifLiveReminder,
        notifSystemUpdate: data.notifSystemUpdate,
      },
    });

    revalidatePath("/settings");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("[SETTINGS_NOTIFICATIONS] Update failed:", error);
    return { error: "Failed to update notification preferences." };
  }
}

/**
 * Updates the user's interface language and visual theme.
 */
export async function updateUserAppearance(data: {
  theme: string;
  language: string;
}) {
  const session = await checkAuth();
  const userId = session.user.id;

  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        theme: data.theme,
        language: data.language,
      },
    });

    revalidatePath("/settings");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("[SETTINGS_APPEARANCE] Update failed:", error);
    return { error: "Failed to update appearance preferences." };
  }
}
