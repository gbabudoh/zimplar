import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import SettingsClientView from "@/components/dashboard/SettingsClientView";

// Cast prisma to any to bypass TypeScript cached properties
const db = prisma as any;

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Load the authenticated user settings from the database
  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    // Session is valid but user was removed from DB (e.g. database was reset)
    // We redirect to login with a special expired flag so the client can sign out
    redirect("/login?expired=true");
  }

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    bio: user.bio,
    twoFactorEnabled: user.twoFactorEnabled,
    theme: user.theme || "Light",
    language: user.language || "English (US)",
    notifCourseSub: user.notifCourseSub ?? true,
    notifLiveReminder: user.notifLiveReminder ?? true,
    notifSystemUpdate: user.notifSystemUpdate ?? false,
    passwordSet: !!user.password,
  };

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      {/* Sidebar - Dynamically configured based on the user's role */}
      <Sidebar role={user.role} />
      
      <main className="flex-grow p-12 ml-72">
        {/* Modern Header */}
        <header className="mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-z-red tracking-tighter leading-none">Settings</h1>
            <div className="flex items-center space-x-3 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em]">
              <span>System Control</span>
              <span className="w-1.5 h-1.5 bg-z-red/20 rounded-full"></span>
              <span className="text-z-red/60">Account Hub</span>
            </div>
          </div>
        </header>

        <SettingsClientView user={userData} />
      </main>
    </div>
  );
}
