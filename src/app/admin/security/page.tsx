"use client";

import { useState } from "react";
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Key, 
  AlertTriangle, 
  UserCheck, 
  Clock, 
  Terminal,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  resource: string;
  outcome: "SUCCESS" | "BLOCKED" | "FAILED";
  ipAddress: string;
  timestamp: string;
  metadata: string;
}

export default function AdminSecurityPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([
    {
      id: "aud_9011",
      actor: "admin@unireport.tz",
      action: "ADMIN_LOGIN",
      resource: "/admin",
      outcome: "SUCCESS",
      ipAddress: "197.149.168.42 (Dar es Salaam)",
      timestamp: "Today, 09:55 AM",
      metadata: "Privileged JWT session cookie issued via HS256."
    },
    {
      id: "aud_9012",
      actor: "admin@unireport.tz",
      action: "GUIDELINE_PUBLISHED",
      resource: "g_udsm_fyp",
      outcome: "SUCCESS",
      ipAddress: "197.149.168.42 (Dar es Salaam)",
      timestamp: "Today, 09:20 AM",
      metadata: "UDSM CoICT FYP v3.2 published to student portal."
    },
    {
      id: "aud_9013",
      actor: "unauthenticated_bot",
      action: "PRIVILEGE_PROBE",
      resource: "/admin/api/keys",
      outcome: "BLOCKED",
      ipAddress: "45.134.22.18 (External)",
      timestamp: "Today, 06:12 AM",
      metadata: "Middleware intercepted request missing JWT session cookie."
    },
    {
      id: "aud_9014",
      actor: "admin@unireport.tz",
      action: "USER_SUSPEND",
      resource: "usr_03 (bmushi@udom.ac.tz)",
      outcome: "SUCCESS",
      ipAddress: "197.149.168.42 (Dar es Salaam)",
      timestamp: "Oct 8, 2026",
      metadata: "Suspended for repetitive prompt injection probe triggers."
    },
    {
      id: "aud_9015",
      actor: "system_cron",
      action: "AUTOMATED_BACKUP",
      resource: "PostgreSQL pg_dump",
      outcome: "SUCCESS",
      ipAddress: "127.0.0.1 (Internal Worker)",
      timestamp: "Oct 8, 2026, 03:00 AM",
      metadata: "Daily encrypted snapshot saved to cold storage."
    }
  ]);

  const [search, setSearch] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("ALL");
  const [feedback, setFeedback] = useState("");

  const filtered = logs.filter((l) => {
    const matchesSearch = 
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.resource.toLowerCase().includes(search.toLowerCase()) ||
      l.ipAddress.toLowerCase().includes(search.toLowerCase());
    const matchesOutcome = outcomeFilter === "ALL" || l.outcome === outcomeFilter;
    return matchesSearch && matchesOutcome;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="size-6 text-teal-400" />
            Security Vault & Audit Trail
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Immutable chronicle of administrative authorizations, privilege escalations, and firewall alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Immutable audit log archive exported.")}
            className="text-xs bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
          >
            <Download className="size-3.5 mr-1.5" /> Export Audit Archive
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-xs text-teal-300 flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          {feedback}
        </div>
      )}

      {/* Security Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Lock className="size-3.5 text-emerald-400" /> JWT Session Security
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              STRICT
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            HTTPOnly, SameSite=Lax, encrypted via HS256 secret. Automatic 7-day expiration with sliding renewal.
          </p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Key className="size-3.5 text-teal-400" /> Role-Based Access Control
            </span>
            <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
              ENFORCED
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Multi-tier boundary checking on Next.js proxy route, layout component, and API controllers.
          </p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-indigo-400" /> Cryptographic Integrity
            </span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              SALT-10
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Passwords hashed with bcrypt 10 salt rounds. Zero plaintext credential exposure in logs or database.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="size-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search action, actor, resource, IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="size-3.5 text-slate-500" />
          <span>Outcome:</span>
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="h-8 px-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Outcomes</option>
            <option value="SUCCESS">Success</option>
            <option value="BLOCKED">Blocked</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/70 border-b border-slate-800 font-mono">
              <tr>
                <th className="px-5 py-3.5">Event ID</th>
                <th className="px-5 py-3.5">Action & Target Resource</th>
                <th className="px-5 py-3.5">Actor</th>
                <th className="px-5 py-3.5">Outcome</th>
                <th className="px-5 py-3.5">Source IP / Host</th>
                <th className="px-5 py-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5 text-teal-400 font-bold">
                    {log.id}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-200">{log.action}</div>
                    <div className="text-[10px] text-slate-500">{log.resource}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">
                    {log.actor}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.outcome === "SUCCESS"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : log.outcome === "BLOCKED"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}>
                      {log.outcome}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {log.ipAddress}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {log.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
