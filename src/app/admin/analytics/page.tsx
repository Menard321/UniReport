"use client";

import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  GraduationCap, 
  FileText, 
  Cpu, 
  Users,
  PieChart,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30D");

  const universityAdoption = [
    { name: "University of Dar es Salaam (UDSM)", students: 1420, share: "34%", color: "bg-teal-500" },
    { name: "University of Dodoma (UDOM)", students: 980, share: "24%", color: "bg-indigo-500" },
    { name: "Sokoine Univ. of Agriculture (SUA)", students: 640, share: "15%", color: "bg-emerald-500" },
    { name: "Dar es Salaam Inst. of Tech (DIT)", students: 490, share: "12%", color: "bg-purple-500" },
    { name: "Ardhi University (ARDHI)", students: 310, share: "8%", color: "bg-amber-500" },
    { name: "Other Higher Learning Institutions", students: 280, share: "7%", color: "bg-slate-500" },
  ];

  const reportTypeDistribution = [
    { type: "Final Year Project (FYP)", count: 2140, pct: "52%" },
    { type: "Industrial Practical Training (IPT/PT)", count: 1280, pct: "31%" },
    { type: "Postgraduate Masters Dissertation", count: 490, pct: "12%" },
    { type: "PhD Research & Thesis", count: 210, pct: "5%" },
  ];

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
            Holistic macro metrics, university adoption distribution, and student completion velocities.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {["7D", "30D", "90D", "ACADEMIC_YEAR"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded font-mono transition-colors ${
                  timeRange === range
                    ? "bg-teal-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Aggregated Analytics report downloaded.")}
            className="text-xs bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
          >
            <Download className="size-3.5 mr-1.5" /> Export PDF
          </Button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">New Student Onboardings</span>
            <span className="text-xs font-mono text-emerald-400 flex items-center">+18% <ArrowUpRight className="size-3" /></span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">4,120</h3>
          <p className="text-[11px] text-slate-500 mt-1">Across 11 Tanzanian universities</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Draft Completion Rate</span>
            <span className="text-xs font-mono text-emerald-400 flex items-center">88.4%</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">3,640</h3>
          <p className="text-[11px] text-slate-500 mt-1">Full 6-chapter documents</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Avg. Drafting Duration</span>
            <span className="text-xs font-mono text-teal-400 flex items-center">-42% time</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">1.8 hrs</h3>
          <p className="text-[11px] text-slate-500 mt-1">From outline to final export</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Verified Citation Accuracy</span>
            <span className="text-xs font-mono text-emerald-400 flex items-center">97.8%</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">28,490</h3>
          <p className="text-[11px] text-slate-500 mt-1">Validated Crossref DOIs</p>
        </div>
      </div>

      {/* University Adoption & Report Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* University Share Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="size-4 text-teal-400" /> Institution Adoption Distribution
            </h3>
            <span className="text-xs font-mono text-slate-400">Total: 4,120</span>
          </div>

          <div className="space-y-3">
            {universityAdoption.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.name}</span>
                  <span className="font-mono text-slate-400">{item.students.toLocaleString()} scholars ({item.share})</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full`} 
                    style={{ width: item.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Type Distribution */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="size-4 text-teal-400" /> Academic Report Formats Drafted
            </h3>
            <span className="text-xs font-mono text-slate-400">Total: 4,120</span>
          </div>

          <div className="space-y-3">
            {reportTypeDistribution.map((r) => (
              <div key={r.type} className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">{r.type}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{r.count.toLocaleString()} completed documents</span>
                </div>
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded border border-teal-500/20">
                  {r.pct}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400">
            <span className="text-slate-200 font-semibold block mb-0.5">Academic Cycle Insight:</span>
            Final Year Projects peak in June&ndash;July across UDSM & UDOM, whereas Field Training (IPT) peaks in September&ndash;October.
          </div>
        </div>
      </div>
    </div>
  );
}
