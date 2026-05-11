"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Check if already installed - if so, don't even start the logic
    if (typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-right-10 duration-500">
      <div className="bg-white rounded-[2rem] p-6 shadow-2xl border border-zinc-100 flex items-center space-x-4 max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-z-red flex items-center justify-center shadow-lg shadow-z-red/20 shrink-0">
           <Smartphone className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-grow">
           <h3 className="text-sm font-black text-zinc-900 leading-tight">Install Zimplar App</h3>
           <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Offline learning & faster access</p>
        </div>

        <div className="flex items-center space-x-2">
           <button 
             onClick={handleInstallClick}
             className="bg-z-red hover:bg-rose-600 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-z-red/10"
           >
              <Download className="w-4 h-4" />
           </button>
           <button 
             onClick={() => setShowInstall(false)}
             className="text-zinc-300 hover:text-zinc-500 p-1"
           >
              <X className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
}
