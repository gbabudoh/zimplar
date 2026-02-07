"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, Loader2, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid administrative credentials.");
      } else {
        router.push("/admin");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="mb-6 hover:scale-105 transition-transform">
            <Image src="/logo.png" alt="Zimplar" width={180} height={50} priority />
          </Link>
          <div className="bg-zinc-900 text-white px-4 py-1.5 rounded-full flex items-center space-x-2 shadow-xl shadow-zinc-900/10">
            <Shield className="w-4 h-4 text-z-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Administrative Access</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/70 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/50 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-z-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-zinc-800 tracking-tight mb-2 text-center">
              Admin <span className="text-z-red">Portal</span>
            </h1>
            <p className="text-zinc-500 text-center text-sm font-medium mb-8">
              Enter your privileged credentials to manage the ecosystem.
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-shake">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-zinc-400 group-focus-within:text-z-red transition-colors" />
                  </div>
                  <input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-z-red/10 focus:border-z-red/50 transition-all font-semibold"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-zinc-400 group-focus-within:text-z-red transition-colors" />
                  </div>
                  <input
                    type="password"
                    placeholder="Access Key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-z-red/10 focus:border-z-red/50 transition-all font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 group relative py-4 rounded-2xl font-black text-white text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-900/20 disabled:opacity-50 disabled:scale-100 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-z-red translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Unlock Command Center</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Security Notice */}
        <p className="mt-8 text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-loose">
          Authorized Personnel Only. <br />
          All login attempts and activities are logged for safety.
        </p>

        <div className="mt-12 flex justify-center space-x-6">
           <Link href="/login" className="text-xs font-bold text-zinc-500 hover:text-z-red flex items-center space-x-2 transition-colors">
              <LayoutDashboard className="w-4 h-4" />
              <span>Standard Login</span>
           </Link>
        </div>
      </div>
    </div>
  );
}
