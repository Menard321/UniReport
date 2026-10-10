"use client";

import { useState } from "react";
import { 
  Settings, 
  Database, 
  HardDrive, 
  Save, 
  CheckCircle2, 
  Clock, 
  Server, 
  Mail, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("UniReportTZ");
  const [contactEmail, setContactEmail] = useState("support@unireport.tz");
  const [timezone, setTimezone] = useState("Africa/Dar_es_Salaam (EAT UTC+3)");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [draftRetentionDays, setDraftRetentionDays] = useState(180);
  const [maxUploadMb, setMaxUploadMb] = useState(25);
  const [feedback, setFeedback] = useState("");

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("Operational system settings successfully synchronized with cluster.");
    setTimeout(() => setFeedback(""), 3500);
  };

  const handleTriggerBackup = () => {
    setFeedback("Triggered on-demand PostgreSQL snapshot backup. Worker job queued.");
    setTimeout(() => setFeedback(""), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <Settings className="size-6 text-teal-400" />
            System Settings & Operations
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Configure cluster environment parameters, maintenance locks, storage policies, and disaster recovery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSaveSettings}
            className="text-xs bg-teal-500 text-slate-950 hover:bg-teal-400 font-semibold"
          >
            <Save className="size-3.5 mr-1.5" /> Save Configuration
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-xs text-teal-300 flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          {feedback}
        </div>
      )}

      {/* Backup and Disaster Recovery Status Card */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="size-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">Disaster Recovery & Database Backups</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Protected & Redundant
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Latest Full Backup</span>
            <strong className="text-emerald-400 text-xs">Today, 03:00 AM EAT</strong>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Retention Schedule</span>
            <strong className="text-slate-200 text-xs">30 Daily / 12 Monthly</strong>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Cold Storage Target</span>
            <strong className="text-slate-200 text-xs">Encrypted S3 East-Africa</strong>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-slate-400">
            Automated Point-In-Time-Recovery (PITR) enabled. Transactions logged to Write-Ahead-Log (WAL).
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTriggerBackup}
            className="text-xs bg-slate-900 border-slate-700 text-slate-200 hover:text-white"
          >
            <RotateCcw className="size-3 mr-1.5" /> Trigger Instant Snapshot
          </Button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* General Operational Config */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Server className="size-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">General Platform Identity</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">Public Application Name</label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Official Support & Notification Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Standard Operational Timezone</label>
              <input
                type="text"
                value={timezone}
                disabled
                className="w-full h-9 px-3 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-400 font-mono cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode & Storage Limits */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <HardDrive className="size-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">Maintenance & Storage Policies</h3>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-200 font-semibold block">Platform Maintenance Mode</span>
                <span className="text-[11px] text-slate-500">Temporarily suspends student drafting during critical updates</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Intermediate Draft Retention Duration:</span>
                <span className="font-mono text-teal-400 font-bold">{draftRetentionDays} Days</span>
              </div>
              <input
                type="range"
                min="30"
                max="365"
                step="30"
                value={draftRetentionDays}
                onChange={(e) => setDraftRetentionDays(parseInt(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Maximum Upload File Size (Evidence / Guidelines):</span>
                <span className="font-mono text-teal-400 font-bold">{maxUploadMb} MB</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={maxUploadMb}
                onChange={(e) => setMaxUploadMb(parseInt(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
