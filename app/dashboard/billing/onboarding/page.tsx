"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  FileCheck, 
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  Save,
  Loader2
} from "lucide-react";
import { updateOrganizationProfile, getOrganizationProfile } from "@/actions/monetization";
// @ts-expect-error - Prisma client generation sync
import { OrgType } from "@prisma/client";

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgType = searchParams.get("org") as OrgType || "PRIVATE";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    regNumber: "",
    contactEmail: "",
    address: ""
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const profile = await getOrganizationProfile();
      if (profile) {
        setFormData({
          name: profile.name || "",
          description: profile.description || "",
          website: profile.website || "",
          regNumber: profile.regNumber || "",
          contactEmail: profile.contactEmail || "",
          address: profile.address || ""
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateOrganizationProfile(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/billing");
      }, 2000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const titles = {
    GOVERNMENT: "Government Verification",
    CHARITY: "Charity Accreditation",
    PRIVATE: "Institutional Setup"
  };

  const subtitles = {
    GOVERNMENT: "Connect your department to the national education network.",
    CHARITY: "Validate your NGO status to unlock grant-eligible pricing.",
    PRIVATE: "Finalize your school's digital profile for professional billing."
  };

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg flex font-sans">
        <Sidebar role="TEACHER" />
        <main className="flex-grow flex items-center justify-center ml-72">
           <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 text-z-red animate-spin" />
              <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">Loading organization data...</p>
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar role="TEACHER" />
      
      <main className="flex-grow p-10 ml-72 max-w-5xl">
        <button 
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-600 transition-colors mb-10 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Plans</span>
        </button>

        <header className="mb-12">
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white/50 border border-white/50 mb-6 backdrop-blur-sm">
             <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Awaiting Verification</span>
          </div>
          <h1 className="text-5xl font-black text-zinc-800 tracking-tight leading-none mb-4">
            {titles[orgType as keyof typeof titles]}
          </h1>
          <p className="text-zinc-500 font-medium text-lg max-w-2xl">{subtitles[orgType as keyof typeof subtitles]}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8 bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/50 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-z-red/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Entity Name</label>
                       <div className="relative group">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-z-red transition-colors" />
                          <input 
                            required
                            type="text"
                            placeholder={orgType === 'GOVERNMENT' ? "Department of Education" : "Organization Name"}
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-z-red/20 focus:border-z-red/50 transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Contact Email</label>
                       <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-z-red transition-colors" />
                          <input 
                            required
                            type="email"
                            placeholder="admin@organization.org"
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-z-red/20 focus:border-z-red/50 transition-all"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Official Website</label>
                       <div className="relative group">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-z-red transition-colors" />
                          <input 
                            type="url"
                            placeholder="https://www.organization.org"
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-z-red/20 focus:border-z-red/50 transition-all"
                            value={formData.website}
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Reg/Accreditation ID</label>
                       <div className="relative group">
                          <FileCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-z-red transition-colors" />
                          <input 
                            required
                            type="text"
                            placeholder={orgType === 'GOVERNMENT' ? "Gov ID" : "NGO-8342-99"}
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-z-red/20 focus:border-z-red/50 transition-all"
                            value={formData.regNumber}
                            onChange={(e) => setFormData({...formData, regNumber: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Location / HQ</label>
                       <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-z-red transition-colors" />
                          <input 
                            required
                            type="text"
                            placeholder="City, Country"
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-z-red/20 focus:border-z-red/50 transition-all"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Brief Description</label>
                       <textarea 
                          rows={4}
                          placeholder="Tell us about the learning community you are empowering..."
                          className="w-full bg-zinc-50 border border-zinc-100 rounded-[2rem] p-6 text-sm font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-z-red/20 focus:border-z-red/50 transition-all resize-none"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="pt-6 relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-zinc-400">
                       <ShieldAlert className="w-5 h-5" />
                       <p className="text-[10px] font-bold leading-tight max-w-[200px]">Data is encrypted and reviewed by our compliance team.</p>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isSaving || success}
                      className={`px-10 py-5 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-zinc-900/30 active:scale-95 flex items-center space-x-3 cursor-pointer ${success ? 'bg-emerald-600 shadow-emerald-600/20' : ''}`}
                    >
                       {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                       <span>{isSaving ? "Submitting..." : success ? "Verified & Ready" : "Save Profile"}</span>
                    </button>
                 </div>
              </form>
           </div>

           <div className="space-y-8">
              <div className="bg-zinc-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-z-red/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                 <h3 className="text-xl font-black mb-6">Verification Process</h3>
                 <div className="space-y-6">
                    <div className="flex space-x-4">
                       <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xs font-black">1</div>
                       <div>
                          <p className="text-sm font-black text-white">Document Review</p>
                          <p className="text-[10px] text-zinc-400 font-medium">Compliance teams verify the Accreditation ID with local authorities.</p>
                       </div>
                    </div>
                    <div className="flex space-x-4">
                       <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xs font-black">2</div>
                       <div>
                          <p className="text-sm font-black text-white">Trust Handshake</p>
                          <p className="text-[10px] text-zinc-400 font-medium">Domain verification for governmental portals.</p>
                       </div>
                    </div>
                    <div className="flex space-x-4">
                       <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xs font-black">3</div>
                       <div>
                          <p className="text-sm font-black text-rose-400">Impact Unlock</p>
                          <p className="text-[10px] text-zinc-400 font-medium">Receive your official &quot;Zimplar Partner&quot; badge and full platform access.</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl">
                 <h3 className="text-lg font-black text-zinc-800 mb-4 tracking-tight">Need Help?</h3>
                 <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-6">
                   Our institutional support team is standing by to assist with multi-region setups and grant inquiries.
                 </p>
                 <button className="w-full py-4 bg-zinc-50 text-zinc-800 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-100 transition-colors border border-zinc-100 cursor-pointer">
                    Chat with Support
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
