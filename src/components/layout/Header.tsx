"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "Universities", href: "/universities" },
    { label: "About Us", href: "/about" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      suppressHydrationWarning
    >
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6" suppressHydrationWarning>
        <Link 
          href="/" 
          className="group flex items-center gap-2.5 mr-6 cursor-pointer"
          suppressHydrationWarning
        >
          <div className="relative size-9 rounded-xl overflow-hidden flex items-center justify-center shadow-sm border border-border group-hover:border-teal-500 group-hover:shadow-md group-hover:shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 bg-white dark:bg-slate-900" suppressHydrationWarning>
            <Image
              src="/logo.png"
              alt="UniReportTZ Logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold font-heading hidden md:inline-block tracking-tight text-primary dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200" suppressHydrationWarning>
              UniReport<span className="text-teal-600 dark:text-teal-400">TZ</span>
            </span>
            <span className="hidden lg:inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              ACADEMIC
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50/80 dark:hover:bg-slate-800/60"
                }`}
              >
                <span className="group-hover:-translate-y-0.5 inline-block transition-transform duration-200">{item.label}</span>
                <span 
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-300 ${
                    isActive ? "w-3/5" : "w-0 group-hover:w-3/5"
                  }`} 
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:flex">
            <Link href="/auth/login">
              <Button 
                variant="ghost" 
                className="text-sm font-semibold hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all"
              >
                Sign In
              </Button>
            </Link>
          </div>
          <Link href="/auth/register">
            <Button 
              variant="accent" 
              className="text-sm shadow-md hover:shadow-lg hover:shadow-teal-500/25 font-bold hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Get Started
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/60 bg-background/98 px-6 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-primary/10 text-primary font-bold dark:text-teal-400" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full text-sm">Sign In</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
