"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Success, route to dashboard
      router.push("/dashboard");
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
            <h1 className="text-2xl font-bold font-heading text-primary dark:text-white mb-2">Create Your Account</h1>
            <p className="text-muted-foreground text-sm">Join the leading academic platform in Tanzania.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  placeholder="John"
                  className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  placeholder="Doe"
                  className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="student@university.ac.tz"
                className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <div className="relative flex items-center">
                <Phone className="size-4 text-muted-foreground absolute left-3 pointer-events-none" />
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="0712 345 678 or +255 7XX XXX XXX"
                  className="w-full h-11 pl-9 pr-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <input 
                type="password" 
                name="password"
                placeholder="••••••••"
                className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 bg-teal-600 text-white hover:bg-teal-500 mt-2 transition-all">
              {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            By signing up, you agree to our <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>

          <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-primary hover:underline transition-all">
              Sign In
            </Link>
          </div>
       </div>
    </div>
  );
}
