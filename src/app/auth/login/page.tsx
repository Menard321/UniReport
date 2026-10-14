"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// UniReportTZ Login Page
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Success, route to designated dashboard or admin portal
      const destination = data.redirectTo || (data.user?.role === "UNIREPORT_ADMIN" ? "/admin" : "/dashboard");
      router.push(destination);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative py-12">
       <div className="absolute inset-0 bg-grid-slate-100/[0.05]" />
       
       <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 relative z-10 border border-border">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="relative size-14 rounded-xl overflow-hidden shadow-md flex items-center justify-center mx-auto">
                <Image
                  src="/logo.png"
                  alt="UniReportTZ Logo"
                  width={56}
                  height={56}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <h1 className="text-2xl font-bold font-heading text-primary dark:text-white mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Sign in to continue your academic research.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 text-center">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email or Phone Number</label>
              <input 
                type="text" 
                name="identifier"
                placeholder="student@university.ac.tz or 07XXXXXXXX"
                className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                required
                autoComplete="username"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-teal-600 hover:underline transition-all">Forgot password?</Link>
              </div>
              <input 
                type="password" 
                name="password"
                placeholder="••••••••"
                className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
              {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-6">
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-semibold text-teal-600 hover:underline transition-all">
              Create one now
            </Link>
          </div>
       </div>
    </div>
  );
}
