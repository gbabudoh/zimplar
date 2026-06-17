"use client";

import React, { useState, useRef } from "react";
import { signOut } from "next-auth/react";
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Lock, 
  Smartphone,
  Check,
  ChevronRight,
  Camera,
  LogOut,
  X,
  Loader2,
  AlertCircle
} from "lucide-react";
import { 
  updateUserProfile,
  updateUserPassword,
  updateUserSecurity,
  updateUserNotificationPreferences,
  updateUserAppearance
} from "@/actions/settings";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: "STUDENT" | "TEACHER" | "ORG_ADMIN" | "ADMIN";
  bio: string | null;
  twoFactorEnabled: boolean;
  theme: string;
  language: string;
  notifCourseSub: boolean;
  notifLiveReminder: boolean;
  notifSystemUpdate: boolean;
  passwordSet: boolean;
}

interface SettingsClientViewProps {
  user: UserData;
}

type SettingsSection = "profile" | "security" | "notifications" | "appearance";

export default function SettingsClientView({ user }: SettingsClientViewProps) {
  const [activeTab, setActiveTab] = useState<SettingsSection>("profile");

  // Profile Form States
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [bio, setBio] = useState(user.bio || "");
  const [image, setImage] = useState<string | null>(user.image);
  
  // Settings Update/Feedback states
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Password Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Toggles and settings
  const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled);
  const [notifCourseSub, setNotifCourseSub] = useState(user.notifCourseSub);
  const [notifLiveReminder, setNotifLiveReminder] = useState(user.notifLiveReminder);
  const [notifSystemUpdate, setNotifSystemUpdate] = useState(user.notifSystemUpdate);
  const [theme, setTheme] = useState(user.theme);
  const [language, setLanguage] = useState(user.language);

  // Active Sessions state
  const [sessions, setSessions] = useState([
    { id: "s1", device: "MacBook Pro - Amsterdam, NL", type: "Current Session", date: "Now", icon: <Check className="w-4 h-4 text-emerald-500" /> },
    { id: "s2", device: "iPhone 13 - Accra, GH", type: "Mobile App", date: "Yesterday, 14:02", icon: null }
  ]);

  // Toast System
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize visual theme classes and cookies/localstorage with active state
  React.useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (currentTheme: string) => {
      const isDark = currentTheme === 'Dark' || (currentTheme === 'System' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'Dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'Light');
      }
      localStorage.setItem('theme', currentTheme);
      document.cookie = `theme=${currentTheme}; path=/; max-age=31536000`;
    };

    applyTheme(theme);

    if (theme === 'System') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('System');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { id: "security", label: "Security", icon: <Shield className="w-5 h-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="w-5 h-5" /> },
  ];

  // Image upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be smaller than 2MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Profile Save
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const res = await updateUserProfile({
        name,
        email,
        bio,
        image: image || undefined,
      });

      if (res.error) {
        showToast(res.error, "error");
      } else {
        showToast("Profile updated successfully", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Password Update
  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (user.passwordSet && !currentPassword) {
      setPasswordError("Please enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await updateUserPassword({
        currentPassword: user.passwordSet ? currentPassword : undefined,
        newPassword,
      });

      if (res.error) {
        setPasswordError(res.error);
      } else {
        showToast("Password updated successfully", "success");
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error(error);
      setPasswordError("An unexpected error occurred");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Two-Factor Toggle
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const handleTwoFactorToggle = async () => {
    if (twoFactorLoading) return;
    const newValue = !twoFactor;
    console.log("[2FA] Toggling to:", newValue);
    setTwoFactorLoading(true);
    setTwoFactor(newValue);
    try {
      const res = await updateUserSecurity({ twoFactorEnabled: newValue });
      console.log("[2FA] Server response:", res);
      if (res.error) {
        showToast(res.error, "error");
        setTwoFactor(!newValue);
      } else {
        showToast(`Two-factor authentication ${newValue ? "enabled" : "disabled"}`, "success");
      }
    } catch (error) {
      console.error("[2FA] Error:", error);
      showToast("Failed to update security settings", "error");
      setTwoFactor(!newValue);
    } finally {
      setTwoFactorLoading(false);
    }
  };

  // Session Revocation
  const handleRevokeSession = (sessionId: string, deviceName: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    showToast(`Session on ${deviceName} revoked successfully`, "success");
  };

  // Notification toggles (Instantly save)
  const handleNotificationToggle = async (
    key: "course" | "reminder" | "system",
    checked: boolean
  ) => {
    let nextCourse = notifCourseSub;
    let nextReminder = notifLiveReminder;
    let nextSystem = notifSystemUpdate;

    if (key === "course") {
      setNotifCourseSub(checked);
      nextCourse = checked;
    } else if (key === "reminder") {
      setNotifLiveReminder(checked);
      nextReminder = checked;
    } else if (key === "system") {
      setNotifSystemUpdate(checked);
      nextSystem = checked;
    }

    try {
      const res = await updateUserNotificationPreferences({
        notifCourseSub: nextCourse,
        notifLiveReminder: nextReminder,
        notifSystemUpdate: nextSystem,
      });

      if (res.error) {
        showToast(res.error, "error");
        // Revert local state
        if (key === "course") setNotifCourseSub(!checked);
        if (key === "reminder") setNotifLiveReminder(!checked);
        if (key === "system") setNotifSystemUpdate(!checked);
      } else {
        showToast("Notification preferences updated", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to save notification settings", "error");
      // Revert local state
      if (key === "course") setNotifCourseSub(!checked);
      if (key === "reminder") setNotifLiveReminder(!checked);
      if (key === "system") setNotifSystemUpdate(!checked);
    }
  };

  // Theme configuration (Instantly save)
  const handleThemeChange = async (selectedTheme: string) => {
    setTheme(selectedTheme);
    try {
      const res = await updateUserAppearance({ theme: selectedTheme, language });
      if (res.error) {
        showToast(res.error, "error");
      } else {
        showToast(`Theme updated to ${selectedTheme}`, "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to save theme setting", "error");
    }
  };

  // Language configuration (Instantly save)
  const handleLanguageChange = async (selectedLang: string) => {
    setLanguage(selectedLang);
    try {
      const res = await updateUserAppearance({ theme, language: selectedLang });
      if (res.error) {
        showToast(res.error, "error");
      } else {
        showToast(`Language set to ${selectedLang}`, "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to save language setting", "error");
    }
  };

  return (
    <>
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-8 right-8 z-[200] animate-in slide-in-from-top-6 duration-300">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl border ${
            toast.type === "success" 
              ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
              : "bg-red-50 border-red-100 text-red-800"
          }`}>
            <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}></div>
            <p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 w-full">
        {/* Navigation Sidebar (Inner) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-4 rounded-[2.5rem] premium-shadow space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsSection)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                  activeTab === tab.id 
                  ? "bg-z-red text-white shadow-xl shadow-z-red/20 scale-[1.02]" 
                  : "text-zinc-600 hover:bg-white/50 hover:text-z-red cursor-pointer"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`${activeTab === tab.id ? "text-white" : "text-zinc-400 group-hover:text-z-red"}`}>
                    {tab.icon}
                  </span>
                  <span className="font-bold text-sm tracking-tight">{tab.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-all ${activeTab === tab.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
              </button>
            ))}
          </div>

          <div className="glass-card p-6 rounded-[2.5rem] premium-shadow bg-z-red/5 border border-z-red/10">
             <p className="text-[10px] font-black text-z-red uppercase tracking-widest mb-4">Quick Action</p>
             <button 
               onClick={() => signOut({ callbackUrl: "/" })}
               className="w-full flex items-center space-x-3 p-4 rounded-2xl text-z-red hover:bg-z-red/10 transition-all font-black text-xs uppercase tracking-widest cursor-pointer"
             >
                <LogOut className="w-5 h-5" />
                <span>Logout Account</span>
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="glass-card p-12 rounded-[3.5rem] premium-shadow min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            
            {/* PROFILE SECTION */}
            {activeTab === "profile" && (
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-zinc-800 tracking-tighter">Public Profile</h2>
                    <p className="text-zinc-500 text-sm font-medium mt-1">Manage how you appear on the Zimplar platform.</p>
                  </div>
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="bg-z-red text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-z-red/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isSavingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isSavingProfile ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-10 pt-6">
                  <div className="relative group">
                     <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-100 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
                        {image ? (
                          <img src={image} alt={name || "Avatar"} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-zinc-300" />
                        )}
                     </div>
                     <input 
                       type="file" 
                       ref={fileInputRef} 
                       onChange={handleImageChange} 
                       className="hidden" 
                       accept="image/*" 
                     />
                     <button 
                       onClick={triggerImageUpload}
                       className="absolute -bottom-2 -right-2 bg-z-red text-white p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform cursor-pointer"
                     >
                        <Camera className="w-4 h-4" />
                     </button>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Profile Picture</p>
                     <p className="text-xs text-zinc-500 max-w-xs font-medium">PNG or JPG. Max 2MB. Image will update instantly in active dashboards.</p>
                     <div className="flex space-x-4 pt-2">
                        <button 
                          onClick={triggerImageUpload}
                          className="text-[10px] font-black text-z-red uppercase tracking-widest border-b border-z-red pb-1 cursor-pointer"
                        >
                          Upload New
                        </button>
                        {image && (
                          <button 
                            onClick={handleRemoveImage}
                            className="text-[10px] font-black text-zinc-400 uppercase tracking-widest cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Display Name</label>
                     <input 
                       type="text" 
                       value={name} 
                       onChange={(e) => setName(e.target.value)}
                       className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 font-bold text-zinc-800" 
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Email Address</label>
                     <input 
                       type="email" 
                       value={email} 
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 font-bold text-zinc-800" 
                     />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Biographical Info</label>
                  <textarea 
                    rows={4} 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Provide a short biography of your role or credentials."
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-3xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 font-medium text-zinc-800 leading-relaxed" 
                  />
                  <p className="text-[10px] text-zinc-400 font-medium text-right mt-1">
                    {Math.max(0, 160 - bio.length)} characters remaining
                  </p>
                </div>
              </div>
            )}

            {/* SECURITY SECTION */}
            {activeTab === "security" && (
              <div className="space-y-10">
                <div>
                  <h2 className="text-3xl font-black text-zinc-800 tracking-tighter">Security & Privacy</h2>
                  <p className="text-zinc-500 text-sm font-medium mt-1">Keep your account protected and your data safe.</p>
                </div>

                <div className="space-y-6 pt-6">
                  <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100 flex items-center justify-between">
                     <div className="flex items-center space-x-6">
                        <div className="bg-white p-4 rounded-2xl shadow-sm">
                           <Lock className="w-6 h-6 text-z-red" />
                        </div>
                        <div>
                           <h4 className="font-black text-zinc-800">Account Password</h4>
                           <p className="text-xs text-zinc-500 font-medium">
                             {user.passwordSet ? "Protect your credentials by rotating passwords regularly." : "No password set. (OAuth Account)"}
                           </p>
                        </div>
                     </div>
                     <button 
                       onClick={() => setShowPasswordModal(true)}
                       className="bg-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-zinc-200 hover:bg-zinc-100 transition-colors cursor-pointer"
                     >
                       {user.passwordSet ? "Change Password" : "Set Password"}
                     </button>
                  </div>

                  <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100 flex items-center justify-between">
                     <div className="flex items-center space-x-6">
                        <div className="bg-white p-4 rounded-2xl shadow-sm">
                           <Smartphone className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                           <h4 className="font-black text-zinc-800">Two-Factor Authentication</h4>
                           <p className="text-xs text-zinc-500 font-medium">Add an extra layer of security to your account logins.</p>
                        </div>
                     </div>
                     <div
                        onClick={handleTwoFactorToggle}
                        style={{
                          width: 56,
                          height: 32,
                          borderRadius: 9999,
                          backgroundColor: twoFactor ? '#552121' : '#d4d4d8',
                          position: 'relative',
                          cursor: twoFactorLoading ? 'wait' : 'pointer',
                          transition: 'background-color 0.2s ease',
                          opacity: twoFactorLoading ? 0.6 : 1,
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 9999,
                            backgroundColor: '#fff',
                            position: 'absolute',
                            top: 4,
                            left: twoFactor ? 28 : 4,
                            transition: 'left 0.2s ease',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          }}
                        />
                     </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-lg font-black text-zinc-800 tracking-tight ml-2">Active Sessions</h3>
                   <div className="divide-y divide-zinc-100">
                      {sessions.length > 0 ? (
                        sessions.map((session) => (
                          <div key={session.id} className="py-6 flex justify-between items-center group">
                             <div className="space-y-1">
                                <p className="font-bold text-zinc-800 text-sm flex items-center space-x-2">
                                   <span>{session.device}</span>
                                   {session.icon}
                                </p>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{session.type} • {session.date}</p>
                             </div>
                             {session.type !== "Current Session" && (
                               <button 
                                 onClick={() => handleRevokeSession(session.id, session.device)}
                                 className="text-[10px] font-black text-zinc-400 hover:text-z-red uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                               >
                                 Revoke
                               </button>
                             )}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-zinc-400 p-4 text-center">No other active sessions detected.</p>
                      )}
                   </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS SECTION */}
            {activeTab === "notifications" && (
              <div className="space-y-10">
                <div>
                  <h2 className="text-3xl font-black text-zinc-800 tracking-tighter">Communication</h2>
                  <p className="text-zinc-500 text-sm font-medium mt-1">Control how and when you hear from Zimplar.</p>
                </div>

                <div className="space-y-10 pt-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-black text-zinc-800 tracking-tight ml-2">Email Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { 
                          id: "course", 
                          title: "Course Submissions", 
                          desc: "Get notified when a student submits work.", 
                          checked: notifCourseSub 
                        },
                        { 
                          id: "reminder", 
                          title: "Live Session Reminders", 
                          desc: "Daily digest of upcoming scheduled classes.", 
                          checked: notifLiveReminder 
                        },
                        { 
                          id: "system", 
                          title: "System Updates", 
                          desc: "Receive alerts about downtime or new features.", 
                          checked: notifSystemUpdate 
                        },
                      ].map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-6 hover:bg-zinc-50 rounded-3xl transition-colors group">
                          <div className="space-y-1">
                            <h4 className="font-black text-zinc-800 text-sm group-hover:text-z-red transition-colors">{item.title}</h4>
                            <p className="text-xs text-zinc-500 font-medium">{item.desc}</p>
                          </div>
                          <div className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={item.checked} 
                              onChange={(e) => handleNotificationToggle(item.id as any, e.target.checked)}
                            />
                            <div className="w-12 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-z-red"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* APPEARANCE SECTION */}
            {activeTab === "appearance" && (
              <div className="space-y-10">
                <div>
                  <h2 className="text-3xl font-black text-zinc-800 tracking-tighter">System Aesthetic</h2>
                  <p className="text-zinc-500 text-sm font-medium mt-1">Customize the interface to match your preference.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest ml-2">Color Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                       {['Light', 'Dark', 'System'].map(t => (
                         <button 
                           key={t} 
                           onClick={() => handleThemeChange(t)}
                           className={`p-4 rounded-2xl border flex flex-col items-center space-y-3 transition-all cursor-pointer ${
                             theme === t 
                               ? 'bg-z-red/5 border-z-red/20 ring-2 ring-z-red/10' 
                               : 'bg-white border-zinc-100 hover:border-zinc-200'
                           }`}
                         >
                            <div className={`w-full aspect-video rounded-xl ${
                              t === 'Dark' 
                                ? 'bg-zinc-800' 
                                : t === 'Light' 
                                  ? 'bg-zinc-50' 
                                  : 'bg-gradient-to-r from-zinc-50 to-zinc-800'
                            }`}></div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                              theme === t ? 'text-z-red' : 'text-zinc-400'
                            }`}>{t}</span>
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest ml-2">Global Language</h3>
                    <div className="space-y-4">
                      <select 
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 focus:outline-none font-bold text-zinc-800 cursor-pointer"
                      >
                         <option value="English (US)">English (US)</option>
                         <option value="French (FR)">French (FR)</option>
                         <option value="Spanish (ES)">Spanish (ES)</option>
                         <option value="Portuguese (PT)">Portuguese (PT)</option>
                      </select>
                      <div className="p-6 bg-z-red/5 rounded-3xl border border-z-red/10 flex items-center space-x-4">
                         <Globe className="w-5 h-5 text-z-red animate-pulse" />
                         <p className="text-[10px] font-medium text-z-red leading-relaxed">System text and student dashboards will adapt translations automatically.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
            onClick={() => !isChangingPassword && setShowPasswordModal(false)}
          ></div>
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-zinc-100">
            <div className="p-8 border-b border-zinc-50 flex justify-between items-center bg-zinc-50/50">
              <h3 className="text-xl font-black text-zinc-800 tracking-tight">
                {user.passwordSet ? "Change Password" : "Set Account Password"}
              </h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                disabled={isChangingPassword}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            
            <form onSubmit={handlePasswordChangeSubmit} className="p-10 space-y-6">
              {passwordError && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-start space-x-3 text-xs">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">{passwordError}</span>
                </div>
              )}

              {user.passwordSet && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 font-bold text-zinc-800" 
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 font-bold text-zinc-800" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-z-red/20 font-bold text-zinc-800" 
                />
              </div>

              <button 
                type="submit"
                disabled={isChangingPassword}
                className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-zinc-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50"
              >
                {isChangingPassword ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-400" />
                )}
                <span>{isChangingPassword ? "Saving Password..." : "Update Password"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
