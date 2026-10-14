"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Search, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  AlertCircle, 
  Phone, 
  DollarSign, 
  Building, 
  BadgeCheck,
  RefreshCw,
  Loader2,
  Sliders,
  Sparkles,
  Save,
  FileText,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveTransaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  provider: "M_PESA" | "TIGO_PESA" | "AIRTEL_MONEY" | "HALOPESA" | "CARD";
  tier: "FREE" | "STUDENT" | "PRO" | "INSTITUTIONAL";
  status: "SUCCESS" | "PENDING" | "FAILED" | "REFUNDED";
  phone: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    university: string | null;
  };
}

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<LiveTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [providerFilter, setProviderFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Dynamic Pricing Configuration State
  const [pricing, setPricing] = useState({
    singleDocumentExportTzs: 5000,
    studentMonthlyTzs: 9900,
    proMonthlyTzs: 24900,
    institutionalYearlyTzs: 450000,
    lastUpdatedBy: "",
    lastUpdatedAt: "",
  });
  const [pricingLoading, setPricingLoading] = useState(true);
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingSuccessMsg, setPricingSuccessMsg] = useState("");
  const [pricingErrorMsg, setPricingErrorMsg] = useState("");

  const fetchPricing = async () => {
    try {
      setPricingLoading(true);
      const res = await fetch("/api/admin/pricing");
      if (res.ok) {
        const data = await res.json();
        if (data.pricing) {
          setPricing(data.pricing);
        }
      }
    } catch (err) {
      console.error("Failed to load pricing configuration", err);
    } finally {
      setPricingLoading(false);
    }
  };

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPricingSaving(true);
      setPricingSuccessMsg("");
      setPricingErrorMsg("");

      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricing),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update pricing.");
      }

      setPricing(data.pricing);
      setPricingSuccessMsg("Pricing configuration saved! Live checkout and mobile money will now charge these updated amounts.");
      setTimeout(() => setPricingSuccessMsg(""), 6000);
    } catch (err: any) {
      setPricingErrorMsg(err.message || "Could not save pricing.");
    } finally {
      setPricingSaving(false);
    }
  };

  const handleResetPricing = async () => {
    if (!confirm("Are you sure you want to reset all rates back to platform defaults?")) {
      return;
    }
    try {
      setPricingSaving(true);
      setPricingSuccessMsg("");
      setPricingErrorMsg("");

      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset: true }),
      });

      const data = await res.json();
      if (res.ok && data.pricing) {
        setPricing(data.pricing);
        setPricingSuccessMsg("Reset all rates back to platform defaults.");
        setTimeout(() => setPricingSuccessMsg(""), 5000);
      }
    } catch (err: any) {
      setPricingErrorMsg(err.message || "Failed to reset pricing.");
    } finally {
      setPricingSaving(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (providerFilter !== "ALL") params.append("provider", providerFilter);

      const res = await fetch(`/api/admin/payments?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error("Failed to load payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchPricing();
  }, [statusFilter, providerFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as any } : t));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter by user or reference search
  const filtered = transactions.filter(t => {
    const term = search.toLowerCase();
    const refMatch = t.reference.toLowerCase().includes(term);
    const userMatch = (t.user?.name || "").toLowerCase().includes(term) || t.user?.email.toLowerCase().includes(term);
    const phoneMatch = (t.phone || "").includes(term);
    return refMatch || userMatch || phoneMatch;
  });

  // Calculate live statistics
  const totalSettledTzs = transactions
    .filter(t => t.status === "SUCCESS")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalPendingTzs = transactions
    .filter(t => t.status === "PENDING")
    .reduce((acc, t) => acc + t.amount, 0);

  const successCount = transactions.filter(t => t.status === "SUCCESS").length;
  const successRate = transactions.length > 0 
    ? Math.round((successCount / transactions.length) * 100) 
    : 100;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">Financial & Revenue Operations</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time reconciliation of Tanzanian mobile money (M-Pesa, Tigo Pesa, Airtel Money) and card settlements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchTransactions} 
            variant="outline" 
            size="sm" 
            className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Feed
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Settled (PostgreSQL)</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white font-heading">{totalSettledTzs.toLocaleString()} TZS</span>
            <span className="text-[11px] text-emerald-400 block mt-1">Confirmed transactions</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Verification</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white font-heading">{totalPendingTzs.toLocaleString()} TZS</span>
            <span className="text-[11px] text-amber-400/90 block mt-1">Awaiting carrier push</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Success Rate</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <BadgeCheck className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white font-heading">{successRate}%</span>
            <span className="text-[11px] text-teal-400/90 block mt-1">Settlement conversion</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Records</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <CreditCard className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white font-heading">{transactions.length}</span>
            <span className="text-[11px] text-slate-400 block mt-1">Transactions in database</span>
          </div>
        </div>
      </div>

      {/* SERVICE RATES & PAYMENT PLANS CONFIGURATION PANEL */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Sliders className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-heading text-white tracking-tight">Active Service Rates & Payment Plans</h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live On Checkout
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure live fees charged to students across Tanzania for document generation, exports, and subscriptions. Changes apply instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pricingSaving || pricingLoading}
              onClick={handleResetPricing}
              className="border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800 text-xs h-9"
            >
              <RotateCcw className="size-3.5 mr-1.5" /> Reset Defaults
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={pricingSaving || pricingLoading}
              onClick={handleSavePricing}
              className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs h-9 px-4 shadow-md shadow-teal-900/30"
            >
              {pricingSaving ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" /> Saving Rates...
                </>
              ) : (
                <>
                  <Save className="size-3.5 mr-1.5" /> Save Pricing Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Status Messages */}
        {pricingSuccessMsg && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
            <span>{pricingSuccessMsg}</span>
          </div>
        )}

        {pricingErrorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="size-4 shrink-0 text-red-400" />
            <span>{pricingErrorMsg}</span>
          </div>
        )}

        {/* Pricing Inputs Grid */}
        <form onSubmit={handleSavePricing} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Single Report Export Fee (The Primary User Request) */}
            <div className="bg-slate-950/80 border border-teal-500/30 rounded-xl p-4 relative group hover:border-teal-500/60 transition-all shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                  <FileText className="size-3.5 text-teal-400" /> Single Report Export Fee
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
                  Primary
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 min-h-[32px] leading-relaxed">
                Fee charged to unlock publication-ready PDF/Word download & full report copying.
              </p>
              
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={pricing.singleDocumentExportTzs}
                    onChange={(e) => setPricing({ ...pricing, singleDocumentExportTzs: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-teal-400 rounded-lg px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none"
                    placeholder="e.g. 10000"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold font-mono">TZS</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Live Checkout:</span>
                  <span className="font-bold font-mono text-teal-300">
                    {new Intl.NumberFormat("en-TZ").format(pricing.singleDocumentExportTzs)} TZS
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Student Essential (Monthly) */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 relative hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">
                  Student Essential (Monthly)
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                  Tier
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 min-h-[32px] leading-relaxed">
                Monthly student plan with 15 projects and 9 AI academic writing tools.
              </p>
              
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={pricing.studentMonthlyTzs}
                    onChange={(e) => setPricing({ ...pricing, studentMonthlyTzs: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-teal-400 rounded-lg px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none"
                    placeholder="e.g. 9900"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold font-mono">TZS</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Live Rate:</span>
                  <span className="font-bold font-mono text-slate-300">
                    {new Intl.NumberFormat("en-TZ").format(pricing.studentMonthlyTzs)} TZS
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Research Pro (Monthly) */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 relative hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">
                  Research Pro (Monthly)
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                  Tier
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 min-h-[32px] leading-relaxed">
                Unlimited projects, dissertation lifecycle engine, and premium citations.
              </p>
              
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={pricing.proMonthlyTzs}
                    onChange={(e) => setPricing({ ...pricing, proMonthlyTzs: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-teal-400 rounded-lg px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none"
                    placeholder="e.g. 24900"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold font-mono">TZS</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Live Rate:</span>
                  <span className="font-bold font-mono text-slate-300">
                    {new Intl.NumberFormat("en-TZ").format(pricing.proMonthlyTzs)} TZS
                  </span>
                </div>
              </div>
            </div>

            {/* 4. University License (Yearly) */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 relative hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">
                  University License (Yearly)
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                  Annual
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 min-h-[32px] leading-relaxed">
                Institutional department-wide access with custom Tanzanian university branding.
              </p>
              
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={pricing.institutionalYearlyTzs}
                    onChange={(e) => setPricing({ ...pricing, institutionalYearlyTzs: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-teal-400 rounded-lg px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none"
                    placeholder="e.g. 450000"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold font-mono">TZS</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Live Rate:</span>
                  <span className="font-bold font-mono text-slate-300">
                    {new Intl.NumberFormat("en-TZ").format(pricing.institutionalYearlyTzs)} TZS
                  </span>
                </div>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-teal-400" />
              Tanzanian Mobile Money carriers (Vodacom M-Pesa, Tigo Pesa, Airtel Money, Halopesa) and CRDB/NMB cards bill these exact amounts.
            </span>
            <span>
              Last updated: {pricing.lastUpdatedAt ? new Date(pricing.lastUpdatedAt).toLocaleString() : "System Defaults"}
            </span>
          </div>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/70 p-4 border border-slate-800/80 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by student, email, ref, or phone..." 
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
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="REFUNDED">Refunded</option>
            <option value="FAILED">Failed</option>
          </select>

          <select 
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Gateways</option>
            <option value="M_PESA">M-Pesa</option>
            <option value="TIGO_PESA">Tigo Pesa</option>
            <option value="AIRTEL_MONEY">Airtel Money</option>
            <option value="HALOPESA">Halopesa</option>
            <option value="CARD">Card / Selcom</option>
          </select>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="size-8 text-teal-400 animate-spin mb-3" />
              <p className="text-sm">Fetching live payment records...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center text-slate-400">
              <CreditCard className="size-12 text-slate-600 mb-3" />
              <p className="text-base font-semibold text-slate-300">No payment transactions found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                When students complete M-Pesa, Tigo Pesa, or card payments on the billing page, their live transaction receipts will appear here.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/70 border-b border-slate-800/80 font-mono">
                <tr>
                  <th className="px-5 py-3.5">Reference & Gateway</th>
                  <th className="px-5 py-3.5">Student / Account</th>
                  <th className="px-5 py-3.5">Plan Tier</th>
                  <th className="px-5 py-3.5">Amount (TZS)</th>
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-mono font-semibold text-slate-200">{t.reference}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {t.provider.replace("_", " ")} {t.phone ? `(${t.phone})` : ""}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-200">{t.user?.name || "Student"}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{t.user?.email}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        t.tier === "PRO" 
                          ? "bg-teal-500/20 text-teal-300 border border-teal-500/30" 
                          : t.tier === "INSTITUTIONAL" 
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-slate-800 text-slate-300"
                      }`}>
                        {t.tier}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-white">
                      {t.amount.toLocaleString()} TZS
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono">
                      {new Date(t.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === "SUCCESS"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : t.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : t.status === "REFUNDED"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        <span className={`size-1.5 rounded-full ${
                          t.status === "SUCCESS" ? "bg-emerald-400" : t.status === "PENDING" ? "bg-amber-400" : "bg-rose-400"
                        }`} />
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {t.status === "PENDING" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updatingId === t.id}
                            onClick={() => handleUpdateStatus(t.id, "SUCCESS")}
                            className="h-7 text-xs text-emerald-400 hover:bg-emerald-500/10"
                          >
                            Verify
                          </Button>
                        )}
                        {t.status === "SUCCESS" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updatingId === t.id}
                            onClick={() => handleUpdateStatus(t.id, "REFUNDED")}
                            className="h-7 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                          >
                            Refund
                          </Button>
                        )}
                      </div>
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
