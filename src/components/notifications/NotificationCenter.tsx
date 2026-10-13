"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Info, AlertTriangle, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveNotification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  read: boolean;
  createdAt: string;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
    } catch (e) {
      console.error(e);
    }
  };

  const markSingleRead = async (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getIconConfig = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-950/40" };
      case "WARNING":
        return { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-950/40" };
      case "ERROR":
        return { icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-950/40" };
      default:
        return { icon: Info, color: "text-teal-500", bg: "bg-teal-100 dark:bg-teal-950/40" };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-teal-500 border-2 border-white dark:border-slate-900 animate-pulse"></span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              Platform Alerts
              {unreadCount > 0 && (
                <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs px-2 py-0.5 rounded-full font-bold border border-teal-500/20">
                  {unreadCount} New
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-xs text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1 font-medium"
              >
                <Check className="size-3" /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center text-muted-foreground">
                <ShieldCheck className="size-10 opacity-25 mb-3 text-teal-500" />
                <p className="text-sm font-medium">You're all caught up!</p>
                <p className="text-xs text-muted-foreground/70 mt-1">No system alerts or generation notifications.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.map((notif) => {
                  const { icon: Icon, color, bg } = getIconConfig(notif.type);
                  return (
                    <div 
                      key={notif.id} 
                      className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer flex gap-3.5 ${!notif.read ? 'bg-teal-500/5' : ''}`}
                      onClick={() => markSingleRead(notif.id)}
                    >
                      <div className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center ${bg} ${color}`}>
                        <Icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${!notif.read ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">
                          {new Date(notif.createdAt).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="shrink-0 pt-1.5">
                          <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
