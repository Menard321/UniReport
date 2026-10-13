"use client";

import { useState, useEffect } from "react";
import { 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  RotateCw, 
  X,
  Loader2,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveReportJob {
  id: string;
  title: string;
  reportType: string;
  institution: string;
  status: string;
  targetPages: number;
  totalWordTarget: number;
  citationStyle: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    university: string | null;
  };
  sections: {
    id: string;
    chapterNumber: number;
    title: string;
    status: string;
    qaScore: number | null;
  }[];
}

export default function AdminReportJobsPage() {
  const [jobs, setJobs] = useState<LiveReportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedJob, setSelectedJob] = useState<LiveReportJob | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`/api/admin/report-jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const handleUpdateStatus = async (jobId: string, newStatus: string) => {
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/report-jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, status: newStatus })
      });
      if (res.ok) {
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
        if (selectedJob && selectedJob.id === jobId) {
          setSelectedJob({ ...selectedJob, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredJobs = jobs.filter(j => {
    const term = search.toLowerCase();
    return (
      j.title.toLowerCase().includes(term) ||
      (j.user?.name || "").toLowerCase().includes(term) ||
      j.user?.email.toLowerCase().includes(term) ||
      j.institution.toLowerCase().includes(term)
    );
  });

  const completedCount = jobs.filter(j => j.status === "COMPLETED").length;
  const processingCount = jobs.filter(j => j.status === "GENERATING" || j.status === "PLANNING" || j.status === "VERIFYING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">Report Generation Jobs & Diagnostics</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time tracking of AI chapter drafting, synthesis queues, and export workers in PostgreSQL.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchJobs} 
            variant="outline" 
            size="sm" 
            className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Pipeline
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Total Generation Plans</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-heading">{jobs.length}</span>
            <span className="text-xs font-mono text-teal-400">Database Records</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Active / Processing</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-teal-400 font-heading">{processingCount}</span>
            <span className="text-xs font-mono text-teal-400/80">LLM Workers</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Successfully Completed</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400 font-heading">{completedCount}</span>
            <span className="text-xs font-mono text-emerald-400/80">Delivered</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/70 p-4 border border-slate-800/80 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search jobs by report title or scholar..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PLANNING">Planning</option>
            <option value="GENERATING">Generating</option>
            <option value="VERIFYING">Verifying</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="size-8 text-teal-400 animate-spin mb-3" />
              <p className="text-sm">Querying active report jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center text-slate-400">
              <Cpu className="size-12 text-slate-600 mb-3" />
              <p className="text-base font-semibold text-slate-300">No report jobs found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                When students trigger AI drafts, thesis syntheses, or exports, jobs will register here.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/70 border-b border-slate-800/80 font-mono">
                <tr>
                  <th className="px-5 py-3.5">Report Title</th>
                  <th className="px-5 py-3.5">Student / Scholar</th>
                  <th className="px-5 py-3.5">Institution</th>
                  <th className="px-5 py-3.5">Type & Target</th>
                  <th className="px-5 py-3.5">Created</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-200 line-clamp-1 max-w-md">{job.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Style: {job.citationStyle} • Chapters: {job.sections?.length || 0}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-300">{job.user?.name || "Student"}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{job.user?.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-teal-400 font-medium">
                      {job.institution}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400">
                      {job.reportType} ({job.targetPages}p)
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono">
                      {new Date(job.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                        job.status === "COMPLETED" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : job.status === "GENERATING"
                          ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                          : "bg-slate-800 text-slate-300"
                      }`}>
                        <span className={`size-1.5 rounded-full ${
                          job.status === "COMPLETED" ? "bg-emerald-400" : "bg-teal-400 animate-pulse"
                        }`} />
                        {job.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedJob(job)}
                          className="h-7 text-xs text-slate-300 hover:text-white"
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <h3 className="font-semibold text-sm text-white">Job Details</h3>
              <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <span className="text-xs text-slate-500">Report Title</span>
                <p className="text-sm font-semibold text-white mt-0.5">{selectedJob.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Student:</span>
                  <p className="text-slate-200 mt-0.5">{selectedJob.user?.name || "Student"} ({selectedJob.user?.email})</p>
                </div>
                <div>
                  <span className="text-slate-500">Institution:</span>
                  <p className="text-teal-400 mt-0.5">{selectedJob.institution}</p>
                </div>
                <div>
                  <span className="text-slate-500">Word Target:</span>
                  <p className="text-slate-200 mt-0.5 font-mono">{selectedJob.totalWordTarget.toLocaleString()} words</p>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>
                  <p className="text-teal-400 mt-0.5 font-mono">{selectedJob.status}</p>
                </div>
              </div>

              {selectedJob.sections && selectedJob.sections.length > 0 && (
                <div>
                  <span className="text-xs text-slate-500 block mb-2">Chapters:</span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {selectedJob.sections.map((sec) => (
                      <div key={sec.id} className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-200 truncate">Ch {sec.chapterNumber}: {sec.title}</span>
                        <span className="text-[10px] text-teal-400 font-mono shrink-0 ml-2">{sec.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)}>
                Close
              </Button>
              {selectedJob.status !== "COMPLETED" && (
                <Button 
                  size="sm" 
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus(selectedJob.id, "COMPLETED")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Mark Completed
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
