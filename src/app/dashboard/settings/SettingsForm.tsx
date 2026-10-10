"use client";

import { useState } from "react";
import { User, Lock, Mail, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SettingsForm({ initialName, initialEmail }: { initialName: string, initialEmail: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-center gap-2">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm border border-emerald-100 flex items-center gap-2">
          Profile updated successfully!
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input 
              type="text"
              name="name"
              defaultValue={initialName}
              className="w-full h-11 pl-10 pr-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input 
              type="email"
              name="email"
              defaultValue={initialEmail}
              className="w-full h-11 pl-10 pr-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
        </div>

        <div>
           <label className="text-sm font-medium mb-1 block">Change Password</label>
           <div className="relative">
             <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
             <input 
               type="password"
               disabled
               placeholder="Contact Admin to change password"
               className="w-full h-11 pl-10 pr-3 py-2 rounded-md border border-input bg-slate-50 dark:bg-slate-900 focus:outline-none cursor-not-allowed opacity-60"
             />
           </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto h-11 px-8 gap-2">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
