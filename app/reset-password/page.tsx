"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Lock, ArrowLeft, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { resetPassword } from "@/actions/auth";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!token) {
      setError("Reset token is missing from the URL.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword(token, password);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setMessage(result.message || "Your password has been reset successfully.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="relative z-10 text-center py-6 space-y-6">
        <div className="flex justify-center">
          <AlertCircle className="w-16 h-16 text-z-red stroke-[2]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-zinc-800">Missing Token</h3>
          <p className="text-sm text-z-gray font-semibold leading-relaxed">
            The password reset link is invalid or incomplete. Please request a new link.
          </p>
        </div>
        <Link href="/forgot-password" className="w-full bg-z-red text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-z-red/20 hover:shadow-z-red/40 transform hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
          <span>Request New Link</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      {message ? (
        <div className="relative z-10 text-center py-6 space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 stroke-[2]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-zinc-800">Password Updated</h3>
            <p className="text-sm text-z-gray font-semibold leading-relaxed">
              {message}
            </p>
          </div>
          <Link href="/login" className="w-full bg-z-red text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-z-red/20 hover:shadow-z-red/40 transform hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer">
            <span>Login Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error && (
            <div className="bg-z-red/10 border border-z-red/20 p-3 rounded-xl text-z-red text-xs font-bold animate-shake">
              {error}
            </div>
          )}
          
          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-z-gray ml-1">New Password</label>
            <div className="relative group/field">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-z-gray group-focus-within/field:text-z-red transition-colors" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/60 backdrop-blur-md border border-z-blue/20 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-z-red/20 focus:border-z-red transition-all shadow-sm group-hover/field:border-z-red/30"
                required
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-z-gray ml-1">Confirm Password</label>
            <div className="relative group/field">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-z-gray group-focus-within/field:text-z-red transition-colors" />
              </div>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/60 backdrop-blur-md border border-z-blue/20 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-z-red/20 focus:border-z-red transition-all shadow-sm group-hover/field:border-z-red/30"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading}
            className="w-full bg-z-red text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-z-red/20 hover:shadow-z-red/40 transform hover:-translate-y-1 transition-all active:scale-95 group/btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Reset Password</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}
    </>
  );
};

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-z-blue rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-z-gold rounded-full blur-3xl opacity-20"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 group cursor-pointer">
            <div className="bg-transparent p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Image src="/zimplarlogo.png" alt="Zimplar" width={200} height={200} className="w-40 h-40 object-contain" />
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-black text-zinc-800">Set New Password</h1>
          <p className="mt-2 text-z-gray font-medium">Please enter your new password below.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/50 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-z-blue/5 to-z-rose/5 opacity-50"></div>
          
          <Suspense fallback={
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-z-red" />
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
