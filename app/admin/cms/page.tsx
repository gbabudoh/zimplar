"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Image from "next/image";
import { getSiteSettings, updateSiteSettings } from "@/actions/admin";
import { 
  Save, 
  Layout, 
  Type, 
  Image as ImageIcon,
  ToggleLeft, 
  ToggleRight,
  Eye,
  CheckCircle2
} from "lucide-react";

export default function AdminCMSPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [toggles, setToggles] = useState({
    registration: true,
    maintenance: false,
    betaFeatures: true
  });

  useEffect(() => {
    async function fetchSettings() {
      const settings = await getSiteSettings();
      if (settings) {
        setHeroTitle(settings.heroTitle);
        setHeroSubtitle(settings.heroSubtitle || "");
        if (settings.features) {
          setToggles(settings.features as {
            registration: boolean;
            maintenance: boolean;
            betaFeatures: boolean;
          });
        }
      } else {
        setHeroTitle("The Future of Learning in Africa");
        setHeroSubtitle("Empowering maximum potential through accessible, high-quality, and data-efficient education.");
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSiteSettings({
        heroTitle,
        heroSubtitle,
        features: toggles
      });
      // Optional: show toast or success message
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white">
      <Sidebar role="ADMIN" />
      
      <main className="flex-grow p-10 ml-72">
        <header className="flex justify-between items-end mb-12">
          <div>
             <div className="flex items-center space-x-3 mb-2">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-zinc-100">
                   <Layout className="w-5 h-5 text-purple-600" />
                </div>
                <h1 className="text-3xl font-black text-zinc-800 tracking-tight">Content Manager</h1>
             </div>
             <p className="text-zinc-500 font-medium ml-1">Update homepage assets, copy, and system-wide feature flags.</p>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-4 bg-z-red text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-z-red/20 cursor-pointer flex items-center space-x-2 disabled:opacity-70"
          >
             {isSaving ? (
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
             ) : (
               <Save className="w-4 h-4" />
             )}
             <span>{isSaving ? 'Saving Changes...' : 'Publish Updates'}</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Column: Editors */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* Hero Section Card */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 
                 <div className="flex items-center space-x-3 mb-8 relative z-10">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                       <Type className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black text-zinc-800">Hero Section</h2>
                 </div>

                 <div className="space-y-6 relative z-10">
                    <div>
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block ml-1">Main Heading</label>
                       <textarea 
                         value={heroTitle}
                         onChange={(e) => setHeroTitle(e.target.value)}
                         className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl p-4 text-2xl font-black text-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                         rows={2}
                       />
                    </div>
                    
                    <div>
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block ml-1">Sub Heading</label>
                       <textarea 
                         value={heroSubtitle}
                         onChange={(e) => setHeroSubtitle(e.target.value)}
                         className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl p-4 text-sm font-medium text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                         rows={3}
                       />
                    </div>
                 </div>
              </div>

              {/* Asset Manager */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl relative overflow-hidden">
                 <div className="flex items-center space-x-3 mb-8 relative z-10">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                       <ImageIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black text-zinc-800">Visual Assets</h2>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="border-2 border-dashed border-zinc-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-50 transition-colors cursor-pointer group">
                       <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <ImageIcon className="w-5 h-5 text-zinc-400 group-hover:text-blue-600" />
                       </div>
                       <p className="text-xs font-bold text-zinc-600">Update Hero Image</p>
                       <p className="text-[10px] text-zinc-400 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                    <div className="relative h-40 rounded-3xl overflow-hidden group">
                       <Image 
                         src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                         alt="Current Hero"
                         fill
                         className="object-cover"
                       />
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Column: Feature Flags */}
           <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] shadow-2xl h-fit sticky top-8">
              <h3 className="text-xl font-black mb-1">System Controls</h3>
              <p className="text-xs text-zinc-400 mb-8 font-medium">Global feature toggles and maintenance modes.</p>

              <div className="space-y-6">
                 {/* Toggle Item */}
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div>
                       <p className="text-sm font-bold">New Registration</p>
                       <p className="text-[10px] text-zinc-400">Allow new users to sign up</p>
                    </div>
                    <button 
                      onClick={() => setToggles({...toggles, registration: !toggles.registration})}
                      className={`cursor-pointer transition-colors ${toggles.registration ? 'text-emerald-400' : 'text-zinc-600'}`}
                    >
                       {toggles.registration ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                    </button>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div>
                       <p className="text-sm font-bold">Beta Features</p>
                       <p className="text-[10px] text-zinc-400">Enable AI Proctoring V2</p>
                    </div>
                    <button 
                      onClick={() => setToggles({...toggles, betaFeatures: !toggles.betaFeatures})}
                      className={`cursor-pointer transition-colors ${toggles.betaFeatures ? 'text-z-blue' : 'text-zinc-600'}`}
                    >
                       {toggles.betaFeatures ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                    </button>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                    <div>
                       <p className="text-sm font-bold text-red-400">Maintenance Mode</p>
                       <p className="text-[10px] text-red-500/60">Shut down all external access</p>
                    </div>
                    <button 
                      onClick={() => setToggles({...toggles, maintenance: !toggles.maintenance})}
                      className={`cursor-pointer transition-colors ${toggles.maintenance ? 'text-red-500' : 'text-zinc-600'}`}
                    >
                       {toggles.maintenance ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                    </button>
                 </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                 <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold">System Status: Operational</span>
                 </div>
                 <p className="text-[10px] text-zinc-500">Last health check: 2 mins ago</p>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
