"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "Universities", href: "/universities" },
    { label: "About Us", href: "/about" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 mr-6 hover:opacity-90 transition-opacity">
          <div className="flex bg-primary text-white p-1.5 rounded-lg">
            <BookOpenText className="size-5" />
          </div>
          <span className="text-xl font-bold font-heading hidden md:inline-block tracking-tight text-primary dark:text-white">
            UniReportTZ
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-primary ${
                  isActive ? "text-primary font-bold dark:text-teal-400" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-sm">Sign In</Button>
            </Link>
          </div>
          <Link href="/auth/register">
            <Button variant="accent" className="text-sm shadow-md font-semibold">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
