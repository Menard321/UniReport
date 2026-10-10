"use client";

import { useState } from "react";
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  AlertCircle, 
  Phone, 
  DollarSign, 
  Building, 
  Edit3,
  X,
  BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  reference: string;
  userName: string;
  userEmail: string;
  amount: string;
  provider: "M-PESA" | "TIGO_PESA" | "AIRTEL_MONEY" | "CARD";
  tier: "RESEARCH_PRO" | "INSTITUTIONAL";
  status: "SUCCESS" | "PENDING" | "REFUNDED";
  timestamp: string;
}

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx_101",
      reference: "MP-92817491",
      userName: "Amani Kiboko",
      userEmail: "amani.k@udsm.ac.tz",
      amount: "25,000 TZS",
      provider: "M-PESA",
      tier: "RESEARCH_PRO",
      status: "SUCCESS",
      timestamp: "Today, 09:12 AM"
    },
    {
      id: "tx_102",
      reference: "TP-84192018",
      userName: "Fatma Othman",
      userEmail: "f.othman@sua.ac.tz",
      amount: "25,000 TZS",
      provider: "TIGO_PESA",
      tier: "RESEARCH_PRO",
      status: "SUCCESS",
      timestamp: "Yesterday, 04:45 PM"
    },
    {
      id: "tx_103",
      reference: "AM-73910294",
      userName: "Baraka Mushi",
      userEmail: "bmushi@udom.ac.tz",
      amount: "25,000 TZS",
      provider: "AIRTEL_MONEY",
      tier: "RESEARCH_PRO",
      status: "PENDING",
      timestamp: "Oct 8, 2026"
    },
    {
      id: "tx_104",
      reference: "CRD-9401283",
      userName: "Dr. Lilian Ngowi",
      userEmail: "lngowi@muhas.ac.tz",
      amount: "120,000 TZS",
      provider: "CARD",
      tier: "INSTITUTIONAL",
      status: "SUCCESS",
      timestamp: "Oct 6, 2026"
    }
  ]);

  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("ALL");
  const [feedback, setFeedback] = useState("");

  const filtered = transactions.filter((tx) => {
    const matchesSearch = 
      tx.reference.toLowerCase().includes(search.toLowerCase()) ||
      tx.userName.toLowerCase().includes(search.toLowerCase()) ||
      tx.userEmail.toLowerCase().includes(search.toLowerCase());
    const matchesProvider = providerFilter === "ALL" || tx.provider === providerFilter;
    return matchesSearch && matchesProvider;
  });

  const handleRefund = (id: string) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, status: "REFUNDED" } : t));
    setFeedback(`Transaction ${id} refunded and logged in audit register.`);
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleReconcile = (id: string) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, status: "SUCCESS" } : t));
    setFeedback(`Transaction ${id} reconciled with Mobile Money gateway.`);
    setTimeout(() => setFeedback(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <CreditCard className="size-6 text-teal-400" />
            Payments, Mobile Money & Subscription Tiers
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Administer Vodacom M-Pesa, Tigo Pesa, Airtel Money transactions, and semester subscription plans.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Reconciliation statement exported.")}
            className="text-xs bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
          >
            <Download className="size-3.5 mr-1.5" /> Financial Export
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-xs text-teal-300 flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          {feedback}
        </div>
      )}

      {/* Subscription Plans Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-300 font-mono">FREE STARTER</span>
            <span className="text-xs font-mono text-emerald-400">0 TZS</span>
          </div>
          <p className="text-[11px] text-slate-400">1 Academic report project, basic chapter drafts, standard community support.</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-teal-500/40 rounded-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-teal-300 font-mono">RESEARCH PRO</span>
            <span className="text-xs font-mono text-teal-400 font-bold">25,000 TZS / Sem</span>
          </div>
          <p className="text-[11px] text-slate-400">Unlimited drafting, full DOI verification, DOCX & PDF exports, priority queue.</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-purple-300 font-mono">CAMPUS LICENSE</span>
            <span className="text-xs font-mono text-purple-400 font-bold">120,000 TZS / Dept</span>
          </div>
          <p className="text-[11px] text-slate-400">Institutional site license for university departments, supervisor dashboards, custom rubrics.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="size-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search reference, student name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="size-3.5 text-slate-500" />
          <span>Payment Provider:</span>
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="h-8 px-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Gateways</option>
            <option value="M-PESA">Vodacom M-Pesa</option>
            <option value="TIGO_PESA">Tigo Pesa</option>
            <option value="AIRTEL_MONEY">Airtel Money</option>
            <option value="CARD">Credit / Debit Card</option>
          </select>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/70 border-b border-slate-800 font-mono">
              <tr>
                <th className="px-5 py-3.5">Gateway Reference</th>
                <th className="px-5 py-3.5">Student Account</th>
                <th className="px-5 py-3.5">Amount (TZS)</th>
                <th className="px-5 py-3.5">Provider</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-teal-400 font-bold">
                    {tx.reference}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-200">{tx.userName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{tx.userEmail}</div>
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-200">
                    {tx.amount}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-300">
                    <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[10px]">
                      {tx.provider.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      tx.status === "SUCCESS"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : tx.status === "PENDING"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono">
                    {tx.timestamp}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {tx.status === "PENDING" && (
                        <button
                          onClick={() => handleReconcile(tx.id)}
                          className="px-2 py-1 rounded bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/30 text-[11px] font-semibold"
                        >
                          Reconcile
                        </button>
                      )}
                      {tx.status === "SUCCESS" && (
                        <button
                          onClick={() => handleRefund(tx.id)}
                          className="p-1.5 rounded text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Issue Refund"
                        >
                          <RotateCcw className="size-3.5" />
                        </button>
                      )}
                    </div>
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
