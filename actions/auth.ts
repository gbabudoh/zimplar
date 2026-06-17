"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "@/lib/mail";

// Bypass IDE TypeScript cache lag by casting prisma to any
const db = prisma as any;

/**
 * Initiates the password reset flow.
 * Generates a secure token, saves it, and emails it to the user.
 */
export async function requestPasswordReset(email: string) {
  if (!email || typeof email !== "string") {
    return { error: "Email is required." };
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // 1. Verify user exists
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Return success to avoid email enumeration attacks
      return { success: true, message: "If your email is registered, a password reset link has been sent." };
    }

    // 2. Generate secure token & expiry (1 hour)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // 3. Clear existing tokens for this email and save the new one
    await db.passwordResetToken.deleteMany({
      where: { email: normalizedEmail },
    });

    await db.passwordResetToken.create({
      data: {
        email: normalizedEmail,
        token,
        expires,
      },
    });

    // 4. Send email
    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 12px;">
        <h2 style="color: #ef4444; text-align: center;">Reset Your Zimplar Password</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your Zimplar digital learning account. Click the button below to set a new password. This link will expire in 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If the button doesn't work, copy and paste the link below into your web browser:</p>
        <p style="word-break: break-all; color: #3b82f6;">${resetUrl}</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">If you did not request this, please ignore this email. Your password will remain safe.</p>
      </div>
    `;

    await sendEmail({
      to: normalizedEmail,
      subject: "Reset your Zimplar Password",
      html,
      text: `Reset your Zimplar password by visiting: ${resetUrl}`,
    });

    return { success: true, message: "If your email is registered, a password reset link has been sent." };
  } catch (error) {
    console.error("Request Password Reset Error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

/**
 * Validates the token and updates the user's password.
 */
export async function resetPassword(token: string, newPassword: string) {
  if (!token) {
    return { error: "Token is required." };
  }
  if (!newPassword || newPassword.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  try {
    // 1. Fetch and validate token
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return { error: "Invalid or expired reset token." };
    }

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update user password
    await db.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    // 4. Delete token
    await db.passwordResetToken.delete({
      where: { token },
    });

    return { success: true, message: "Your password has been reset successfully. You can now log in." };
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
