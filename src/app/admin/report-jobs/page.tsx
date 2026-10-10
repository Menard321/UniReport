"use client";

import { useState } from "react";
import { 
  RefreshCw, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  RotateCw, 
  XCircle, 
  ChevronRight, 
  Eye, 
  X,
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportJob {
  id: string;
  reportTitle: string;
  studentEmail: string;
  institution: string;
  jobType: "FULL_DRAFT" | "CHAPTER_GENERATION" | "EXPORT_PDF" | "EXPORT_DOCX";
  status: "COMPLETED" | "PROCESSING" | "QUEUED" | "FAILED";
  duration: string;
  attempts: number;
  createdAt: string;
  errorReason?: string;
  service: string;
}

export default function AdminReportJobsPage() {
  const [jobs, setJobs] = useState<ReportJob[]>([
    {
      id: "job_8921",
      reportTitle: "IoT-Based Smart Soil Moisture Monitoring for Morogoro Farms",
      studentEmail: "f.othman@sua.ac.tz",
      institution: "SUA",
      jobType: "FULL_DRAFT",
      status: "COMPLETED",
      duration: "18.4s",
      attempts: 1,
      createdAt: "10 mins ago",
      service: "Gemini 2.0 Flash / Worker-01"
    },
    {
      id: "job_8922",
      reportTitle: "Automated Traffic Violation Detection Using Computer Vision in DSM",
      studentEmail: "a.kiboko@dit.ac.tz",
      institution: "DIT",
      jobType: "EXPORT_PDF",
      status: "COMPLETED",
      duration: "4.2s",
      attempts: 1,
      createdAt: "22 mins ago",
      service: "Puppeteer Export Node"
    },
    {
      id: "job_8923",
      reportTitle: "Evaluation of FinTech Micro-Loans on Informal Traders in Kariakoo",
      studentEmail: "bmushi@cbe.ac.tz",
      institution: "CBE",
      jobType: "CHAPTER_GENERATION",
      status: "FAILED",
      duration: "12.8s",
      attempts: 2,
      createdAt: "35 mins ago",
      errorReason: "Upstream token limit threshold reached on Chapter 4 raw dataset table.",
      service: "Worker-02"
    },
    {
      id: "job_8924",
      reportTitle: "Solar Micro-Grid Load Forecasting in Rural Dodoma",
      studentEmail: "m.chacha@udom.ac.tz",
      institution: "UDOM",
      jobType: "FULL_DRAFT",
      status: "PROCESSING",
      duration: "9.1s",
      attempts: 1,
      createdAt: "Just now",
      service: "Worker-01"
    },
    {
      id: "job_8925",
      reportTitle: "Blockchain-Enabled Land Titling Framework for Dar es Salaam",
      studentEmail: "j.lyimo@ardhi.ac.tz",
      institution: "ARDHI",
      jobType: "EXPORT_DOCX",
      status: "QUEUED",
      duration: "-",
      attempts: 0,
      createdAt: "1 min ago",
      service: "Queue Manager"
    }
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedJob, setSelectedJob] = useState<ReportJob | null>(null);
  const [feedback, setFeedback] = useState("");

  const filtered = jobs.filter((j) => {
    const matchesSearch = 
      j.reportTitle.toLowerCase().includes(search.toLowerCase()) ||
      j.studentEmail.toLowerCase().includes(search.toLowerCase()) ||
      j.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const retryJob = (id: string) => {
    setJobs(jobs.map(j => {
      if (j.id === id) {
        return { ...j, status: "PROCESSING", attempts: j.attempts + 1, errorReason: undefined };
      }
      return j;
    }));
    setFeedback(`Job ${id} queued for immediate idempotent retry.`);
    setTimeout(() => {
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: "COMPLETED", duration: "14.2s" } : j));
    }, 2500);
    setTimeout(() => setFeedback(""), 4000);
  };

  const cancelJob = (id: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: "FAILED", errorReason: "Cancelled by Administrator" } : j));
    setFeedback(`Job ${id} was cancelled.`);
    setTimeout(() => setFeedback(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <RefreshCw className="size-6 text-teal-400" />
            Report Generation & Document Export Jobs
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Real-time monitoring of asynchronous drafting queues, export workers, and retry diagnostics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFeedback("Refreshed job queue telemetry.");
              setTimeout(() => setFeedback(""), 2500);
            }}
            className="text-xs bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
          >
            <RotateCw className="size-3.5 mr-1.5" /> Refresh Queue
          </Button>
        </div>
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
            placeholder="Search job ID, topic title, scholar email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="size-3.5 text-slate-500" />
          <span>Job Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PROCESSING">Processing</option>
            <option value="QUEUED">Queued</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/70 border-b border-slate-800 font-mono">
              <tr>
                <th className="px-5 py-3.5">Job ID & Task Type</th>
                <th className="px-5 py-3.5">Academic Project Title</th>
                <th className="px-5 py-3.5">Institution</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Duration</th>
                <th className="px-5 py-3.5">Attempts</th>
                <th className="px-5 py-3.5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                    No processing jobs currently in queue.
                  </td>
                </tr>
              ) : (
                filtered.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-teal-400 font-bold">{j.id}</div>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {j.jobType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <div className="font-semibold text-slate-200 truncate">{j.reportTitle}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{j.studentEmail}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-300">
                      {j.institution}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono inline-flex items-center gap-1 ${
                        j.status === "COMPLETED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : j.status === "PROCESSING"
                          ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                          : j.status === "FAILED"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        {j.status === "PROCESSING" && <RotateCw className="size-2.5 animate-spin" />}
                        {j.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400">
                      {j.duration}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400">
                      {j.attempts}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedJob(j)}
                          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Inspect Diagnostics"
                        >
                          <Eye className="size-3.5" />
                        </button>
                        {j.status === "FAILED" && (
                          <button
                            onClick={() => retryJob(j.id)}
                            className="p-1.5 rounded text-teal-400 hover:text-teal-300 hover:bg-teal-950/40 transition-colors"
                            title="Retry Job"
                          >
                            <RotateCw className="size-3.5" />
                          </button>
                        )}
                        {(j.status === "QUEUED" || j.status === "PROCESSING") && (
                          <button
                            onClick={() => cancelJob(j.id)}
                            className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                            title="Cancel Job"
                          >
                            <XCircle className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diagnostics Modal Dialog */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  {selectedJob.id}
                </span>
                <h3 className="text-sm font-bold text-white mt-1">Operational Diagnostics</h3>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Node:</span>
                  <span className="text-slate-200">{selectedJob.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Job Type:</span>
                  <span className="text-teal-400">{selectedJob.jobType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="text-slate-200">{selectedJob.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-slate-200">{selectedJob.status}</span>
                </div>
              </div>

              {selectedJob.errorReason && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300">
                  <span className="font-bold block mb-1">Diagnostic Fault Trace:</span>
                  <p className="text-[11px] leading-relaxed">{selectedJob.errorReason}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </Button>
              {selectedJob.status === "FAILED" && (
                <Button
                  size="sm"
                  onClick={() => {
                    retryJob(selectedJob.id);
                    setSelectedJob(null);
                  }}
                  className="bg-teal-500 text-slate-950 hover:bg-teal-400 font-semibold"
                >
                  Retry Job Now
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
