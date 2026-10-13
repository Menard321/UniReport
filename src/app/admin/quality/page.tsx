"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  Check, 
  Eye, 
  HelpCircle,
  RefreshCw,
  Loader2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface QualityIssue {
  id: string;
  reportId: string;
  topic: string;
  institution: string;
  studentName: string;
  studentEmail: string;
  issueType: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "REVIEWED" | "RESOLVED";
  detectedAt: string;
  chapterTitle: string;
  qaScore: number;
  excerptSnippet: string;
  automatedNote: string;
}

export default function AdminQualityPage() {
  const [issues, setIssues] = useState<QualityIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedIssue, setSelectedIssue] = useState<QualityIssue | null>(null);
  const [feedback, setFeedback] = useState("");

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/quality");
      if (res.ok) {
        const data = await res.json();
        setIssues(data.issues || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const resolveIssue = async (id: string) => {
    try {
      const res = await fetch("/api/admin/quality", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId: id, status: "APPROVED" })
      });
      if (res.ok) {
        setIssues(issues.map(i => i.id === id ? { ...i, status: "RESOLVED" } : i));
        if (selectedIssue && selectedIssue.id === id) {
          setSelectedIssue({ ...selectedIssue, status: "RESOLVED" });
        }
        setFeedback(`Issue marked as RESOLVED and section approved.`);
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = issues.filter(i => {
    const term = search.toLowerCase();
    const matchesSearch = 
      i.topic.toLowerCase().includes(term) ||
      i.institution.toLowerCase().includes(term) ||
      i.id.toLowerCase().includes(term) ||
      i.studentName.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "ALL" || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="size-6 text-teal-400" />
            Academic Quality & Citation Integrity
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Audit flagged citations, missing sections, and formatting non-compliance across student drafts in PostgreSQL.
          </p>
        </div>
        <div>
          <Button 
            onClick={fetchIssues} 
            variant="outline" 
            size="sm" 
            className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh QA Audit
          </Button>
        </div>
      </div>

      {/* Academic Disclaimer Notice */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start gap-3">
        <HelpCircle className="size-4 text-teal-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Academic Review Protocol:</strong> Automated quality scans evaluate chapter alignment against TCU guidelines. Flagged sections can be reviewed and approved directly by administrators.
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-xs text-teal-300 flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          {feedback}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="size-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search report topic, university, or scholar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="size-3.5 text-slate-500" />
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open (Requires Action)</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 text-center text-slate-400">
              <Loader2 className="size-8 text-teal-400 animate-spin mx-auto mb-3" />
              <p className="text-sm">Scanning database for compliance flags...</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/70 border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-5 py-3.5">Section / Chapter</th>
                  <th className="px-5 py-3.5">Project / Research Topic</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Severity</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">QA Score</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                      <ShieldCheck className="size-10 text-slate-600 mx-auto mb-2" />
                      <p className="font-semibold text-slate-300">No academic quality flags detected</p>
                      <p className="text-xs text-slate-500 mt-1">All student report chapters meet guideline compliance standards.</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-200">
                        {item.chapterTitle}
                      </td>
                      <td className="px-5 py-3.5 max-w-xs">
                        <div className="font-semibold text-slate-200 truncate">{item.topic}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{item.institution} &bull; {item.studentName}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] font-mono bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                          {item.issueType.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          item.severity === "HIGH" 
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : item.severity === "MEDIUM"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                        }`}>
                          {item.severity}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          item.status === "RESOLVED"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : item.status === "REVIEWED"
                            ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-teal-400 font-bold">
                        {item.qaScore}%
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedIssue(item)}
                            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Inspect Excerpt"
                          >
                            <Eye className="size-3.5" />
                          </button>
                          {item.status !== "RESOLVED" && (
                            <button
                              onClick={() => resolveIssue(item.id)}
                              className="p-1.5 rounded text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-colors"
                              title="Mark Approved"
                            >
                              <Check className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Inspect Excerpt Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  {selectedIssue.institution}
                </span>
                <h3 className="text-sm font-bold text-white mt-1">Quality Inspection Excerpt</h3>
              </div>
              <button onClick={() => setSelectedIssue(null)} className="text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1 text-[11px] font-semibold">Flagged Report Excerpt:</span>
                <blockquote className="p-2.5 bg-slate-900 border-l-2 border-teal-500 text-slate-300 italic text-xs leading-relaxed">
                  &ldquo;{selectedIssue.excerptSnippet}&rdquo;
                </blockquote>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300">
                <span className="font-bold block mb-1">Automated Auditor Finding:</span>
                <p className="text-[11px] leading-relaxed">{selectedIssue.automatedNote}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIssue(null)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </Button>
              {selectedIssue.status !== "RESOLVED" && (
                <Button
                  size="sm"
                  onClick={() => resolveIssue(selectedIssue.id)}
                  className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold"
                >
                  Approve Section
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
