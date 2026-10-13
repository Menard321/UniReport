"use client";

import { useState, useEffect } from "react";
import { 
  Headphones, 
  Search, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  User, 
  RefreshCw,
  Loader2,
  Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveTicketMessage {
  id: string;
  sender: "STUDENT" | "SUPPORT_AGENT" | "SYSTEM";
  text: string;
  createdAt: string;
}

interface LiveTicket {
  id: string;
  subject: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  institution: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    university: string | null;
  };
  messages: LiveTicketMessage[];
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<LiveTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`/api/admin/support?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const tList: LiveTicket[] = data.tickets || [];
        setTickets(tList);
        if (tList.length > 0 && !selectedTicketId) {
          setSelectedTicketId(tList[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || null;

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;

    try {
      setSendingReply(true);
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          text: replyText.trim(),
          statusUpdate: "IN_PROGRESS"
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Update local messages
        setTickets(prev => prev.map(t => {
          if (t.id === selectedTicket.id) {
            return {
              ...t,
              status: "IN_PROGRESS",
              messages: [...t.messages, data.message]
            };
          }
          return t;
        }));
        setReplyText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingReply(false);
    }
  };

  const handleResolveTicket = async () => {
    if (!selectedTicket) return;
    try {
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          status: "RESOLVED"
        })
      });

      if (res.ok) {
        setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: "RESOLVED" } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTickets = tickets.filter(t => {
    const term = search.toLowerCase();
    return (
      t.subject.toLowerCase().includes(term) ||
      (t.user?.name || "").toLowerCase().includes(term) ||
      t.user?.email.toLowerCase().includes(term) ||
      (t.institution || "").toLowerCase().includes(term)
    );
  });

  const openCount = tickets.filter(t => t.status === "OPEN").length;
  const inProgressCount = tickets.filter(t => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter(t => t.status === "RESOLVED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">Academic Helpdesk & Inquiry Center</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time student inquiry resolution, billing queries, and formatting support across Tanzanian campuses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchTickets} 
            variant="outline" 
            size="sm" 
            className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Tickets
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Open Tickets</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-400 font-heading">{openCount}</span>
            <span className="text-xs font-mono text-amber-400/80">Pending Action</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400">In Progress</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-teal-400 font-heading">{inProgressCount}</span>
            <span className="text-xs font-mono text-teal-400/80">Staff Replying</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Resolved Cases</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400 font-heading">{resolvedCount}</span>
            <span className="text-xs font-mono text-emerald-400/80">Completed</span>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Tickets List & Active Discussion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tickets Queue */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm flex flex-col h-[650px]">
          <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search tickets by student or subject..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {loading ? (
              <div className="p-8 text-center text-slate-400">
                <Loader2 className="size-6 text-teal-400 animate-spin mx-auto mb-2" />
                <span className="text-xs">Fetching support tickets...</span>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                <Inbox className="size-10 text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-300">No support tickets found</p>
                <p className="text-xs text-slate-500 mt-1">Student help inquiries will appear here in real time.</p>
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = t.id === selectedTicketId;
                return (
                  <div 
                    key={t.id} 
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-4 cursor-pointer transition-colors ${isSelected ? 'bg-teal-500/10 border-l-2 border-teal-500' : 'hover:bg-slate-800/40'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-xs text-white line-clamp-1">{t.subject}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 font-mono ${
                        t.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-300' :
                        t.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {t.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                      <span>{t.user?.name || "Student"}</span>
                      <span>•</span>
                      <span className="font-mono text-teal-400/90">{t.institution || t.user?.university || "Tanzania"}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/40">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                        t.status === 'OPEN' ? 'text-amber-400' :
                        t.status === 'IN_PROGRESS' ? 'text-teal-400' : 'text-emerald-400'
                      }`}>
                        <span className={`size-1.5 rounded-full ${
                          t.status === 'OPEN' ? 'bg-amber-400' :
                          t.status === 'IN_PROGRESS' ? 'bg-teal-400' : 'bg-emerald-400'
                        }`} />
                        {t.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(t.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ticket Conversation Thread */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm flex flex-col h-[650px]">
          {selectedTicket ? (
            <>
              {/* Ticket Header */}
              <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedTicket.subject}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span>From: <strong className="text-slate-200">{selectedTicket.user?.name || "Student"}</strong> ({selectedTicket.user?.email})</span>
                    <span>•</span>
                    <span className="text-teal-400 font-mono">{selectedTicket.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedTicket.status !== "RESOLVED" && (
                    <Button 
                      size="sm" 
                      onClick={handleResolveTicket}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8"
                    >
                      <CheckCircle2 className="size-3.5 mr-1" /> Mark Resolved
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {selectedTicket.messages.map((m) => {
                  const isStaff = m.sender === "SUPPORT_AGENT";
                  return (
                    <div 
                      key={m.id} 
                      className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[10px] text-slate-400">
                        <span>{isStaff ? "Support Team" : selectedTicket.user?.name || "Student"}</span>
                        <span>•</span>
                        <span className="font-mono">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className={`p-3.5 rounded-xl max-w-xl text-xs leading-relaxed ${
                        isStaff 
                          ? 'bg-teal-500/20 border border-teal-500/30 text-teal-100 rounded-br-none' 
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input Box */}
              <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
                <div className="flex gap-2">
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response to the student..."
                    rows={2}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                  />
                  <Button 
                    onClick={handleSendReply}
                    disabled={sendingReply || !replyText.trim()}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold self-end h-10 px-4"
                  >
                    {sendingReply ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500">
              <MessageSquare className="size-12 mb-3 opacity-30 text-teal-400" />
              <p className="text-sm">Select a ticket from the left to view the inquiry thread.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
