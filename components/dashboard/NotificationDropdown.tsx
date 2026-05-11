"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, ExternalLink, Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { getNotifications, markAsRead, markAllAsRead } from "@/actions/notifications";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  category: "SYSTEM" | "COURSE" | "BILLING" | "GAMIFICATION" | "SOCIAL";
  isRead: boolean;
  link?: string;
  createdAt: Date | string;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "just now";
  };

  async function loadNotifications() {
    try {
      const data = await getNotifications();
      setNotifications(data as Notification[]);
      setUnreadCount((data as Notification[]).filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  }

  useEffect(() => {
    // Defer the initial load to avoid cascading renders warning
    const timeoutId = setTimeout(() => {
      loadNotifications();
    }, 0);
    
    const interval = setInterval(loadNotifications, 30000); // Poll every 30s
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleMarkRead(id: string) {
    await markAsRead(id);
    loadNotifications();
  }

  async function handleMarkAllRead() {
    await markAllAsRead();
    loadNotifications();
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SUCCESS": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "WARNING": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "ERROR": return <XCircle className="w-4 h-4 text-z-red" />;
      default: return <Info className="w-4 h-4 text-z-blue" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all group ${
          isOpen ? "bg-z-red/10 text-z-red" : "bg-white border border-zinc-100 text-zinc-400 hover:text-z-red hover:shadow-md"
        }`}
      >
        <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-z-red text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <h3 className="font-black text-zinc-800 tracking-tight">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-[10px] font-black text-z-red uppercase tracking-widest hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-10 text-center space-y-4">
                <div className="bg-zinc-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <Bell className="w-5 h-5 text-zinc-300" />
                </div>
                <p className="text-sm text-zinc-400 font-medium tracking-tight">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-50">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    onClick={() => !notification.isRead && handleMarkRead(notification.id)}
                    className={`p-5 hover:bg-zinc-50 transition-colors cursor-pointer group relative ${!notification.isRead ? "bg-z-red/[0.02]" : ""}`}
                  >
                    {!notification.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-z-red"></div>
                    )}
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-grow space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className={`text-sm font-bold tracking-tight ${notification.isRead ? "text-zinc-600" : "text-zinc-900"}`}>
                            {notification.title}
                          </h4>
                          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter whitespace-nowrap ml-2">
                            {timeAgo(new Date(notification.createdAt))}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                          {notification.message}
                        </p>
                        {notification.link && (
                          <a 
                            href={notification.link}
                            className="inline-flex items-center space-x-1 text-[10px] font-black text-z-red uppercase tracking-widest mt-2 hover:underline"
                          >
                            <span>View Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-zinc-50/50 border-t border-zinc-100 text-center">
             <button className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] hover:text-z-red transition-colors">
               Full History
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
