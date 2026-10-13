"use client";

import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Loader2,
  Terminal,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveAuditLog {
  id: string;
  action: string;
  tokensCost: number | null;
  metadata: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
}

export default function AdminSecurityPage() {
  const [logs, setLogs] = useState<LiveAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/security");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(l => {
    const term = search.toLowerCase();
    return (
      l.action.toLowerCase().includes(term) ||
      (l.user?.email || "").toLowerCase().includes(term) ||
      (l.user?.name || "").toLowerCase().includes(term) ||
      (l.metadata || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">Security Audit & Activity Logs</h1>
          <p className="text-slate-400 text-sm mt-1">
            Immutable PostgreSQL activity trails, session verifications, and administrative event auditing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchLogs} 
            variant="outline" 
            size="sm" 
            className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Trail
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Total Activity Entries</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-heading">{logs.length}</span>
            <span className="text-xs font-mono text-teal-400">PostgreSQL</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Security Engine Status</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400 font-heading">Enforced</span>
            <span className="text-xs font-mono text-emerald-400/80">RBAC / JWT</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Retention Horizon</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-indigo-400 font-heading">365 Days</span>
            <span className="text-xs font-mono text-indigo-400/80">TCU Compliance</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/70 p-4 border border-slate-800/80 rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search audit trail by actor, action, or metadata..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="size-8 text-teal-400 animate-spin mb-3" />
              <p className="text-sm">Fetching immutable audit logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center text-slate-400">
              <ShieldCheck className="size-12 text-slate-600 mb-3" />
              <p className="text-base font-semibold text-slate-300">No activity logs recorded</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                As users log in, run AI generations, or perform plan updates, real-time audit records will be logged here.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/70 border-b border-slate-800/80 font-mono">
                <tr>
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-5 py-3.5">Actor</th>
                  <th className="px-5 py-3.5">Action Event</th>
                  <th className="px-5 py-3.5">Tokens</th>
                  <th className="px-5 py-3.5">Metadata / Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                      {new Date(log.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-200">{log.user?.email || "Unknown"}</div>
                      <div className="text-[10px] text-slate-500">{log.user?.role}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {log.tokensCost ? `${log.tokensCost} tok` : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 text-[11px] max-w-xs truncate">
                      {log.metadata || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
