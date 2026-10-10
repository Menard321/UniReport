"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Info, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Subscription Limit Approaching",
    message: "You have used 4 out of 5 free projects. Upgrade to Research Pro.",
    type: "warning",
    time: "2 hours ago",
    read: false,
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    id: 2,
    title: "Literature Synthesis Complete",
    message: "Your literature review on 'Online Learning' has successfully generated.",
    type: "success",
    time: "5 hours ago",
    read: false,
    icon: Check,
    color: "text-emerald-500",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    id: 3,
    title: "New Platform Update",
    message: "We've added 5 new Reference formats. Check them out!",
    type: "info",
    time: "1 day ago",
    read: true,
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-900"></span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-950 border rounded-xl shadow-xl z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
            <h3 className="font-semibold flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} New
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <Check className="size-3" /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center text-muted-foreground">
                <ShieldCheck className="size-10 opacity-20 mb-3" />
                <p>You're all caught up!</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer flex gap-4 ${!notif.read ? 'bg-primary/5 dark:bg-primary/5' : ''}`}
                    onClick={() => {
                      setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
                    }}
                  >
                    <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${notif.bg} ${notif.color}`}>
                      <notif.icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notif.read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-2 font-medium uppercase tracking-wider">
                        {notif.time}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="shrink-0 pt-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t bg-slate-50 dark:bg-slate-900/50 text-center">
            <button className="text-sm font-medium text-primary hover:underline">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
