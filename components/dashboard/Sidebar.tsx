"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  ChevronRight,
  ClipboardList,
  CreditCard,
  BarChart3,
  HeartHandshake,
  Sprout
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const teacherLinks: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview", href: "/dashboard/teacher" },
  { icon: <BookOpen className="w-5 h-5" />, label: "My Courses", href: "/dashboard/teacher/courses" },
  { icon: <Users className="w-5 h-5" />, label: "Classrooms", href: "/dashboard/teacher/classrooms" },
  { icon: <ClipboardList className="w-5 h-5" />, label: "Grading", href: "/dashboard/teacher/grading" },
  { icon: <Calendar className="w-5 h-5" />, label: "Live Sessions", href: "/dashboard/teacher/sessions" },
  { icon: <CreditCard className="w-5 h-5" />, label: "Billing Hub", href: "/dashboard/billing" },
];

const studentLinks: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview", href: "/dashboard/student" },
  { icon: <BookOpen className="w-5 h-5" />, label: "Explore", href: "/dashboard/student/explore" },
  { icon: <ClipboardList className="w-5 h-5" />, label: "Assessments", href: "/dashboard/student/assessments" },
  { icon: <Calendar className="w-5 h-5" />, label: "Classroom", href: "/dashboard/student/classroom" },
  { icon: <CreditCard className="w-5 h-5" />, label: "Billing", href: "/dashboard/billing" },
];

const adminLinks: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview", href: "/admin" },
  { icon: <Settings className="w-5 h-5" />, label: "CMS Manager", href: "/admin/cms" },
  { icon: <Users className="w-5 h-5" />, label: "Users", href: "/admin/users" },
  { icon: <BarChart3 className="w-5 h-5" />, label: "Platform Analytics", href: "/admin/analytics" },
  { icon: <CreditCard className="w-5 h-5" />, label: "Payment Hub", href: "/admin/payments" },
];

const orgLinks: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Suite Overview", href: "/dashboard/org" },
  { icon: <Users className="w-5 h-5" />, label: "Schools & Classrooms", href: "/dashboard/org/schools" },
  { icon: <BarChart3 className="w-5 h-5" />, label: "Regional Metrics", href: "/dashboard/org/analytics" },
  { icon: <ClipboardList className="w-5 h-5" />, label: "Institution Audit", href: "/dashboard/org/audit" },
  { icon: <CreditCard className="w-5 h-5" />, label: "Shared Billing", href: "/dashboard/billing" },
];

const ngoLinks: NavItem[] = [
  { icon: <HeartHandshake className="w-5 h-5" />, label: "Impact Hub", href: "/dashboard/ngo" },
  { icon: <Sprout className="w-5 h-5" />, label: "Partner Schools", href: "/dashboard/ngo/schools" },
  { icon: <BarChart3 className="w-5 h-5" />, label: "Impact Analytics", href: "/dashboard/ngo/impact" },
  { icon: <CreditCard className="w-5 h-5" />, label: "Subsidy Wallet", href: "/dashboard/billing" },
];

interface SidebarProps {
  role?: "TEACHER" | "STUDENT" | "ADMIN" | "ORG_ADMIN" | "NGO";
}

export default function Sidebar({ role: initialRole }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  // Use session role as source of truth, fallback to prop if loading or unavailable
  // @ts-expect-error - role is on user
  const effectiveRole = session?.user?.role || initialRole;
  // Check path OR specific NGO demo email to persist nav on shared pages (billing)
  const isNgoContext = pathname?.startsWith("/dashboard/ngo") || session?.user?.email === "ngo@zimplar.com";
  
  const links = effectiveRole === "TEACHER" ? teacherLinks : 
                effectiveRole === "ADMIN" ? adminLinks : 
                (effectiveRole === "ORG_ADMIN" && isNgoContext) ? ngoLinks :
                effectiveRole === "ORG_ADMIN" ? orgLinks : 
                studentLinks;

  return (
    <aside className="w-64 h-[calc(100vh-2rem)] fixed left-4 top-4 bg-white/70 backdrop-blur-2xl border border-white/40 p-6 flex flex-col z-50 rounded-[2.5rem] shadow-2xl shadow-z-red/5">
      {/* Branding */}
      <div className="flex items-center space-x-3 mb-10 px-2">
        <div className="bg-z-red p-2.5 rounded-2xl shadow-lg shadow-z-red/20 rotate-3 group-hover:rotate-0 transition-transform">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-black text-z-red tracking-tighter">Zimplar</span>
      </div>

      {/* Navigation */}
      <nav className="flex-grow space-y-2">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-3 mb-6">Main Analytics</p>
        
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                ? "bg-z-red text-white shadow-xl shadow-z-red/20 scale-[1.02]" 
                : "text-zinc-600 hover:bg-z-red/5 hover:text-z-red"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`${isActive ? "text-white" : "text-zinc-400 group-hover:text-z-red"} transition-colors`}>
                  {link.icon}
                </span>
                <span className="font-bold text-sm tracking-tight">{link.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${isActive ? "opacity-100" : ""}`} />
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-6 mt-6 border-t border-zinc-100 space-y-1">
        <Link 
          href="/settings"
          className="flex items-center space-x-3 p-4 rounded-2xl text-zinc-600 hover:bg-white/50 transition-all font-bold text-sm hover:scale-[1.02]"
        >
          <Settings className="w-5 h-5 text-zinc-400" />
          <span>General Settings</span>
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center space-x-3 p-4 rounded-2xl text-z-red hover:bg-z-red/5 transition-all font-black text-xs uppercase tracking-widest cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
