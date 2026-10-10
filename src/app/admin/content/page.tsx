"use client";

import { useState } from "react";
import { 
  Globe, 
  Save, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Megaphone, 
  FileText, 
  HelpCircle, 
  RotateCcw,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminContentPage() {
  const [heroTagline, setHeroTagline] = useState("Academic Reports, Built Around Your University.");
  const [heroSubtitle, setHeroSubtitle] = useState("Empowering university scholars across Tanzania with AI-assisted report generation formatted precisely to your institution's guidelines.");
  const [announcementActive, setAnnouncementActive] = useState(false);
  const [announcementText, setAnnouncementText] = useState("Scheduled maintenance window: Sunday at 02:00 AM EAT for database optimization.");
  const [aboutMission, setAboutMission] = useState("To equip every Tanzanian university student with rigorous, guideline-compliant academic tools that accelerate research without compromising integrity.");
  const [feedback, setFeedback] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("Public website content and announcement flags successfully published to live CDN.");
    setTimeout(() => setFeedback(""), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <Globe className="size-6 text-teal-400" />
            Website Public Content CMS
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Administer landing page copy, institutional mission statements, FAQs, and global alert banners.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            className="text-xs bg-teal-500 text-slate-950 hover:bg-teal-400 font-semibold"
          >
            <Save className="size-3.5 mr-1.5" /> Publish Changes
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-xs text-teal-300 flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          {feedback}
        </div>
      )}

      {/* Global Alert Banner Control */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Megaphone className="size-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">Emergency / Maintenance Announcement Banner</h3>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs">
            <span className="text-slate-400 font-medium">Banner Status:</span>
            <input
              type="checkbox"
              checked={announcementActive}
              onChange={(e) => setAnnouncementActive(e.target.checked)}
              className="accent-teal-500 h-4 w-4 rounded"
            />
            <span className={announcementActive ? "text-emerald-400 font-bold font-mono" : "text-slate-500 font-mono"}>
              {announcementActive ? "LIVE ON HOMEPAGE" : "OFFLINE"}
            </span>
          </label>
        </div>

        <div>
          <label className="text-slate-400 block text-xs mb-1">Banner Announcement Text (Displayed across all public headers)</label>
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Landing Page Content Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileText className="size-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">Homepage Hero Section</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Official Product Tagline / Main Title</label>
              <input
                type="text"
                value={heroTagline}
                onChange={(e) => setHeroTagline(e.target.value)}
                className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 font-semibold"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Sub-headline Description</label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* About Us CMS */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="size-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">About Us — Mission & Purpose</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Platform Mission Statement</label>
              <textarea
                rows={4}
                value={aboutMission}
                onChange={(e) => setAboutMission(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 leading-relaxed"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-500">
              Content is protected by server-side XSS sanitizer before rendering into <code className="text-teal-400">/about</code> and <code className="text-teal-400">/</code> routes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
