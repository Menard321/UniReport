"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, CreditCard, LogOut, HelpCircle, Shield, ChevronDown } from "lucide-react";

export function UserProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call backend logout API to delete session cookie
      await fetch("/api/auth/logout", {
        method: "POST"
      });
      
      // Clear local storage items if any
      if (typeof window !== "undefined") {
        localStorage.removeItem("unireport_token");
        localStorage.removeItem("unireport_user");
      }

      // Redirect immediately to home page
      window.location.href = "/";
    } catch (e) {
      console.error("Logout error", e);
      window.location.href = "/";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* AVATAR TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/40"
        aria-label="User Profile Menu"
      >
        <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 font-semibold shadow-sm">
          <User className="size-4" />
        </div>
        <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-border/80 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in-80 zoom-in-95 duration-150">
          {/* USER INFO HEADER */}
          <div className="px-4 py-3 border-b border-border/60">
            <p className="text-xs font-bold text-foreground">Student Account</p>
            <p className="text-[11px] text-muted-foreground truncate">student@unireporttz.ac.tz</p>
          </div>

          {/* MENU LINKS */}
          <div className="py-1">
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Settings className="size-4 text-slate-500" />
              <span>Settings</span>
            </Link>

            <Link
              href="/dashboard/billing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <CreditCard className="size-4 text-slate-500" />
              <span>Usage & Plans</span>
            </Link>

            <Link
              href="/dashboard/help"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <HelpCircle className="size-4 text-slate-500" />
              <span>Help & Support</span>
            </Link>
          </div>

          <div className="border-t border-border/60 pt-1 mt-1">
            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="size-4 text-rose-600 dark:text-rose-400" />
              <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
