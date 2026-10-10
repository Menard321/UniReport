"use client";

import { useState } from "react";
import { 
  Headphones, 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  User, 
  Tag, 
  X,
  Lock,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Ticket {
  id: string;
  studentName: string;
  studentEmail: string;
  institution: string;
  subject: string;
  category: "AI_WRITING" | "CITATIONS" | "FORMATTING" | "EXPORTS" | "PAYMENTS" | "LOGIN";
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  messages: {
    sender: "STUDENT" | "SUPPORT_AGENT";
    text: string;
    timestamp: string;
    isInternal?: boolean;
  }[];
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "tkt_501",
      studentName: "Mwita Chacha",
      studentEmail: "m.chacha@udsm.ac.tz",
      institution: "UDSM",
      subject: "Exported DOCX missing table of contents numbering format",
      category: "FORMATTING",
      priority: "HIGH",
      status: "OPEN",
      createdAt: "25 mins ago",
      messages: [
        {
          sender: "STUDENT",
          text: "Hello support, when I exported my FYP Chapter 1-3 to Word (.docx), the preliminary roman numerals on the Declaration page shifted to arabic numbers. UDSM guidelines strictly require roman numerals.",
          timestamp: "25 mins ago"
        }
      ]
    },
    {
      id: "tkt_502",
      studentName: "Fatma Othman",
      studentEmail: "f.othman@sua.ac.tz",
      institution: "SUA",
      subject: "M-Pesa payment deducted but Pro tier not unlocked automatically",
      category: "PAYMENTS",
      priority: "URGENT",
      status: "OPEN",
      createdAt: "1 hour ago",
      messages: [
        {
          sender: "STUDENT",
          text: "I paid 25,000 TZS via M-Pesa (Ref: MP-92817491) 40 minutes ago. The money was deducted from Vodacom but my account still says 'Free Starter'. Please activate my Research Pro.",
          timestamp: "1 hour ago"
        }
      ]
    },
    {
      id: "tkt_503",
      studentName: "Baraka Mushi",
      studentEmail: "bmushi@udom.ac.tz",
      institution: "UDOM",
      subject: "Need citation format changed from APA to IEEE for CIVE report",
      category: "CITATIONS",
      priority: "MEDIUM",
      status: "RESOLVED",
      createdAt: "Yesterday",
      messages: [
        {
          sender: "STUDENT",
          text: "Can I convert an existing report outline from APA 7th to IEEE without losing my saved draft notes?",
          timestamp: "Yesterday"
        },
        {
          sender: "SUPPORT_AGENT",
          text: "Hi Baraka! Yes, you can navigate to Document Settings > Citation Standards and toggle to IEEE. The generator will automatically reformat your bibliography during next export.",
          timestamp: "Yesterday, 3:15 PM"
        }
      ]
    }
  ]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [feedback, setFeedback] = useState("");

  const filtered = tickets.filter((t) => {
    const matchesSearch = 
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.studentName.toLowerCase().includes(search.toLowerCase()) ||
      t.studentEmail.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || t.category === categoryFilter;
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    const newMessage = {
      sender: "SUPPORT_AGENT" as const,
      text: replyText.trim(),
      timestamp: "Just now",
      isInternal: isInternalNote
    };

    const updated = {
      ...selectedTicket,
      status: isInternalNote ? selectedTicket.status : ("IN_PROGRESS" as const),
      messages: [...selectedTicket.messages, newMessage]
    };

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updated : t));
    setSelectedTicket(updated);
    setReplyText("");
    setFeedback(isInternalNote ? "Internal staff note recorded." : "Reply dispatched to student email.");
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleResolve = (id: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: "RESOLVED" } : t));
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, status: "RESOLVED" });
    }
    setFeedback(`Ticket ${id} marked as RESOLVED.`);
    setTimeout(() => setFeedback(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <Headphones className="size-6 text-teal-400" />
            Support Ticket Helpdesk
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Resolve student technical inquiries, payment reconciliations, and academic template requests.
          </p>
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
            placeholder="Search ticket, student name, email, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="size-3.5 text-slate-500" />
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 px-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Categories</option>
              <option value="PAYMENTS">Payments & M-Pesa</option>
              <option value="FORMATTING">Formatting & Word</option>
              <option value="CITATIONS">Citations & Sources</option>
              <option value="AI_WRITING">AI Drafting</option>
              <option value="LOGIN">Access & Login</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                selectedTicket?.id === t.id
                  ? "bg-slate-900 border-teal-500/80 shadow-md shadow-teal-500/5"
                  : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-400">{t.id}</span>
                  <span className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-mono">
                    {t.institution}
                  </span>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                    t.priority === "URGENT"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : t.priority === "HIGH"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}>
                    {t.priority}
                  </span>
                </div>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                  t.status === "RESOLVED"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : t.status === "IN_PROGRESS"
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}>
                  {t.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">{t.subject}</h4>
              <p className="text-xs text-slate-400 line-clamp-1">{t.messages[0]?.text}</p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>By: <strong className="text-slate-300">{t.studentName}</strong> ({t.studentEmail})</span>
                <span className="font-mono">{t.createdAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Ticket Active Discussion Drawer */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[460px]">
          {selectedTicket ? (
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div>
                    <span className="font-mono text-xs text-teal-400 font-bold">{selectedTicket.id}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{selectedTicket.subject}</h3>
                  </div>
                  {selectedTicket.status !== "RESOLVED" && (
                    <Button
                      size="sm"
                      onClick={() => handleResolve(selectedTicket.id)}
                      className="text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold"
                    >
                      Resolve
                    </Button>
                  )}
                </div>

                {/* Message Thread */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs">
                  {selectedTicket.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border leading-relaxed ${
                        m.isInternal
                          ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                          : m.sender === "SUPPORT_AGENT"
                          ? "bg-teal-500/10 border-teal-500/30 text-teal-200 ml-4"
                          : "bg-slate-950 border-slate-800 text-slate-300 mr-4"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] mb-1 font-mono text-slate-500">
                        <span className="font-bold flex items-center gap-1">
                          {m.isInternal && <Lock className="size-2.5 text-amber-400" />}
                          {m.isInternal ? "INTERNAL STAFF NOTE" : m.sender === "SUPPORT_AGENT" ? "UniReportTZ Agent" : selectedTicket.studentName}
                        </span>
                        <span>{m.timestamp}</span>
                      </div>
                      <p>{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="mt-4 pt-3 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <span>Post as Internal Staff Note (Hidden from Student)</span>
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder={isInternalNote ? "Record private investigation note..." : "Compose official response to student..."}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    className={`text-xs font-semibold ${
                      isInternalNote ? "bg-amber-500 text-slate-950 hover:bg-amber-400" : "bg-teal-500 text-slate-950 hover:bg-teal-400"
                    }`}
                  >
                    <Send className="size-3 mr-1.5" /> {isInternalNote ? "Save Staff Note" : "Send Response"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <MessageSquare className="size-10 mb-3 text-slate-700" />
              <p className="text-xs font-medium">Select a support ticket from the queue to inspect conversation thread or dispatch response.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
