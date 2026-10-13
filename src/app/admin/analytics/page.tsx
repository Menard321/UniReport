"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  GraduationCap, 
  FileText, 
  Cpu, 
  Users,
  RefreshCw,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  totalStudents: number;
  totalUsers: number;
  totalDocs: number;
  totalAiTokens: number;
  universityAdoption: { name: string; students: number; share: string }[];
  reportTypeDistribution: { type: string; count: number; pct: string }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const totalTokensStr = data?.totalAiTokens 
    ? (data.totalAiTokens > 1000 ? `${(data.totalAiTokens / 1000).toFixed(1)}k` : data.totalAiTokens.toString())
    : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="size-6 text-teal-400" />
            Analytics & Institutional Intelligence
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Holistic macro metrics, university adoption distribution, and student completion velocities from PostgreSQL.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            className="text-xs bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Telemetry
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center text-slate-400">
          <Loader2 className="size-8 text-teal-400 animate-spin mx-auto mb-3" />
          <p className="text-sm">Aggregating live university telemetry...</p>
        </div>
      ) : (
        <>
          {/* Top Level Macro KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Enrolled Students</span>
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                  <Users className="size-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-white font-heading">{data?.totalStudents || 0}</span>
                <span className="text-[11px] text-teal-400 block mt-1">Active Scholars</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Documents Saved</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <FileText className="size-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-white font-heading">{data?.totalDocs || 0}</span>
                <span className="text-[11px] text-emerald-400 block mt-1">Saved drafts & projects</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Tokens Generated</span>
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Cpu className="size-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-white font-heading">{totalTokensStr}</span>
                <span className="text-[11px] text-indigo-400 block mt-1">Gemini AI tokens</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Total System Accounts</span>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <TrendingUp className="size-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-white font-heading">{data?.totalUsers || 0}</span>
                <span className="text-[11px] text-purple-400 block mt-1">Total user records</span>
              </div>
            </div>
          </div>

          {/* Distribution Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* University Adoption */}
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <GraduationCap className="size-4 text-teal-400" />
                  <h3 className="font-bold text-sm text-white">University Adoption Distribution</h3>
                </div>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                  Live Counts
                </span>
              </div>

              {!data?.universityAdoption || data.universityAdoption.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-xs">No university affiliations recorded on accounts yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.universityAdoption.map((uni) => (
                    <div key={uni.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{uni.name}</span>
                        <span className="font-mono text-slate-400">{uni.students} scholars ({uni.share})</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div 
                          className="bg-teal-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: uni.share }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Document Types */}
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">Report Format Categories</h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Documents Created
                </span>
              </div>

              {!data?.reportTypeDistribution || data.reportTypeDistribution.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-xs">No document types recorded yet. Created reports will be charted here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.reportTypeDistribution.map((t) => (
                    <div key={t.type} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{t.type}</span>
                        <span className="font-mono text-slate-400">{t.count} drafts ({t.pct})</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: t.pct }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
