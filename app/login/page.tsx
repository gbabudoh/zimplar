"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      router.refresh();
      
      // Smart redirection based on role/email
      if (email === "org@zimplar.com") {
        router.push("/dashboard/org");
      } else if (email === "ngo@zimplar.com") {
        router.push("/dashboard/ngo");
      } else if (email === "private@zimplar.com") {
        router.push("/dashboard/private");
      } else if (email.includes("admin")) {
        router.push("/admin");
      } else if (email.includes("teacher")) {
        router.push("/dashboard/teacher");
      } else {
        router.push("/dashboard/student");
      }
    }
  };

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
          <p className="mt-4 text-z-gray font-medium">Welcome back! Please enter your details.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/50 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-z-blue/5 to-z-rose/5 opacity-50"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-z-red/10 border border-z-red/20 p-3 rounded-xl text-z-red text-xs font-bold animate-shake">
                {error}
              </div>
            )}
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-z-gray ml-1">Email Address</label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-z-gray group-focus-within/field:text-z-red transition-colors" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white/60 backdrop-blur-md border border-z-blue/20 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-z-red/20 focus:border-z-red transition-all shadow-sm group-hover/field:border-z-red/30"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-z-gray">Password</label>
                <Link href="#" className="text-xs font-bold text-z-red hover:underline cursor-pointer">Forgot password?</Link>
              </div>
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

            {/* Submit Button */}
            <button 
              disabled={loading}
              className="w-full bg-z-red text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-z-red/20 hover:shadow-z-red/40 transform hover:-translate-y-1 transition-all active:scale-95 group/btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform cursor-pointer" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8 z-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-z-blue/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-z-gray font-bold backdrop-blur-sm">Or continue with</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4 relative z-10">
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
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-center text-z-gray font-medium">
          {"Don't have an account?"}{" "}
          <Link href="/signup" className="text-z-red font-bold hover:underline cursor-pointer">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
