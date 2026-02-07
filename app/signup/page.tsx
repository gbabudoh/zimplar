"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { GraduationCap, Mail, Lock, User, ArrowRight, UserCircle, ShieldCheck } from "lucide-react";

const SignupPage = () => {
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-z-gold rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-z-blue rounded-full blur-3xl opacity-30"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 group">
            <div className="bg-transparent p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
               <Image src="/zimplarlogo.png" alt="Zimplar" width={200} height={200} className="w-40 h-40 object-contain" />
            </div>
          </Link>
          <p className="mt-4 text-z-gray font-medium">Join our community of learners today.</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/50 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-z-gold/5 to-z-blue/5 opacity-50"></div>
          
          <form className="space-y-5 relative z-10">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-z-gray ml-1">Full Name</label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-z-gray group-focus-within/field:text-z-red transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-white/60 backdrop-blur-md border border-z-blue/20 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-z-red/20 focus:border-z-red transition-all shadow-sm group-hover/field:border-z-red/30"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-z-gray ml-1">Email Address</label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-z-gray group-focus-within/field:text-z-red transition-colors" />
                </div>
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full bg-white/60 backdrop-blur-md border border-z-blue/20 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-z-red/20 focus:border-z-red transition-all shadow-sm group-hover/field:border-z-red/30"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-z-gray ml-1">Password</label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-z-gray group-focus-within/field:text-z-red transition-colors" />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white/60 backdrop-blur-md border border-z-blue/20 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-z-red/20 focus:border-z-red transition-all shadow-sm group-hover/field:border-z-red/30"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 pt-2">
               <button 
                  type="button" 
                  onClick={() => setRole("STUDENT")}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                    role === "STUDENT" 
                    ? "border-z-red bg-z-red/5 text-z-red shadow-inner" 
                    : "border-z-blue/10 bg-white/40 text-z-gray hover:border-z-red/30"
                  }`}
               >
                  <UserCircle className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold uppercase">Student</span>
               </button>
                <button 
                  type="button" 
                  onClick={() => setRole("TEACHER")}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                    role === "TEACHER" 
                    ? "border-z-red bg-z-red/5 text-z-red shadow-inner" 
                    : "border-z-blue/10 bg-white/40 text-z-gray hover:border-z-red/30"
                  }`}
               >
                  <GraduationCap className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold uppercase">Teacher</span>
               </button>
               <button 
                  type="button" 
                  onClick={() => (window.location.href = "/dashboard/private")}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-z-blue/10 bg-white/40 text-z-gray hover:border-z-red/30 transition-all cursor-pointer group"
               >
                  <ShieldCheck className="w-6 h-6 mb-1 group-hover:text-z-red transition-colors" />
                  <span className="text-xs font-bold uppercase">Private</span>
               </button>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-z-red text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-z-red/20 hover:shadow-z-red/40 transform hover:-translate-y-1 transition-all active:scale-95 group/btn mt-4">
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 z-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-z-blue/20"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-transparent px-2 text-z-gray font-bold backdrop-blur-sm">Or sign up with</span>
            </div>
          </div>

          {/* Social Signups */}
          <div className="grid grid-cols-2 gap-4 relative z-10 mb-6">
            <button 
              onClick={() => signIn("google")}
              className="flex items-center justify-center space-x-2 py-3 bg-white/60 backdrop-blur-md border border-z-blue/20 rounded-2xl hover:bg-white/80 transition-all font-semibold text-z-gray shadow-sm cursor-pointer"
            >
              <Image src="https://www.google.com/favicon.ico" width={16} height={16} className="w-4 h-4" alt="Google" />
              <span>Google</span>
            </button>
            <button 
              onClick={() => signIn("microsoft-entra-id")}
              className="flex items-center justify-center space-x-2 py-3 bg-white/60 backdrop-blur-md border border-z-blue/20 rounded-2xl hover:bg-white/80 transition-all font-semibold text-z-gray shadow-sm cursor-pointer"
            >
              <Image src="https://www.microsoft.com/favicon.ico" width={16} height={16} className="w-4 h-4" alt="Microsoft" />
              <span>Microsoft</span>
            </button>
          </div>

          <div className="relative my-6 z-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-z-blue/20"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-transparent px-2 text-z-gray font-bold backdrop-blur-sm">Already have an account?</span>
            </div>
          </div>

          <Link href="/login" className="w-full flex items-center justify-center py-3 bg-white/60 backdrop-blur-md border border-z-blue/20 rounded-2xl hover:bg-white/80 transition-all font-bold text-z-gray shadow-sm relative z-10">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
