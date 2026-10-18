"use client";

import { useState } from "react";
import { 
  Check, 
  Zap, 
  ShieldCheck, 
  Lock, 
  Download, 
  FileCheck, 
  FileText, 
  Sparkles, 
  CreditCard, 
  ExternalLink, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_TIERS, SubscriptionTier } from "@/lib/subscriptions";
import { TzPaymentGateway } from "@/components/billing/TzPaymentGateway";
import Link from "next/link";

interface BillingDocumentItem {
  id: string;
  title: string;
  toolType: string;
  isPaid: boolean;
  targetPages: number;
  createdAt: string;
  updatedAt: string;
}

interface BillingTransactionItem {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  provider: string;
  tier: string;
  status: string;
  phone: string | null;
  createdAt: string;
}

interface BillingInteractiveProps {
  currentTierId: string;
  currentTierName: string;
  isProOrSemester: boolean;
  subProjectsUsed: number;
  subTokensUsed: number;
  subStorageMb: number;
  documents: BillingDocumentItem[];
  transactions: BillingTransactionItem[];
  singleReportPrice: number;
  semesterPassPrice: number;
}

export function BillingInteractive({
  currentTierId,
  currentTierName,
  isProOrSemester,
  subProjectsUsed,
  subTokensUsed,
  subStorageMb,
  documents,
  transactions,
  singleReportPrice = 5000,
  semesterPassPrice = 15000,
}: BillingInteractiveProps) {
  // Modal State
  const [checkoutModal, setCheckoutModal] = useState<{
    isOpen: boolean;
    planId: string;
    planName: string;
    amount: number;
    documentId?: string;
    billingCycleLabel?: string;
  } | null>(null);

  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async (doc: BillingDocumentItem, format: "pdf" | "doc") => {
    setDownloadingDocId(doc.id);
    setDownloadError(null);

    try {
      const res = await fetch("/api/v1/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: doc.id,
          format,
          options: {
            title: doc.title,
          }
        })
      });

      const data = await res.json();

      if (res.status === 402 || data.requiresPayment) {
        // Trigger paywall modal for this locked document
        setCheckoutModal({
          isOpen: true,
          planId: "STUDENT",
          planName: doc.title,
          amount: singleReportPrice,
          documentId: doc.id,
          billingCycleLabel: "/ document unlock"
        });
        return;
      }

      if (!res.ok || !data.success) {
        setDownloadError(data.error || "Failed to download document");
        return;
      }

      if (format === "pdf" && data.pdfHtml) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(data.pdfHtml);
          printWindow.document.close();
        }
      } else if (format === "doc" && data.htmlDocument) {
        const blob = new Blob(["\ufeff", data.htmlDocument], {
          type: "application/msword;charset=utf-8"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const safeTitle = (doc.title || "academic-report").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
        a.download = data.filename || `${safeTitle}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      setDownloadError(err.message || "Failed to initiate download");
    } finally {
      setDownloadingDocId(null);
    }
  };

  const handleUnlockDocument = (doc: BillingDocumentItem) => {
    setCheckoutModal({
      isOpen: true,
      planId: "STUDENT",
      planName: `Unlock: ${doc.title}`,
      amount: singleReportPrice,
      documentId: doc.id,
      billingCycleLabel: "/ document unlock"
    });
  };

  const handleUpgradePlan = (tier: SubscriptionTier) => {
    setCheckoutModal({
      isOpen: true,
      planId: tier.id,
      planName: tier.name,
      amount: tier.priceTZS,
      billingCycleLabel: tier.billingCycle === 'monthly' ? '/ month' : tier.billingCycle === 'semester' ? '/ semester' : '/ one-time'
    });
  };

  const unlockedCount = documents.filter(d => d.isPaid || isProOrSemester).length;

  return (
    <div className="space-y-10">
      
      {/* 1. TOP STATUS SUMMARY BANNER */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${
                isProOrSemester 
                  ? "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                  : currentTierId === "STUDENT"
                  ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border"
              }`}>
                {currentTierName}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                <ShieldCheck className="size-3.5 text-emerald-600" /> Account Verified
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
              {isProOrSemester ? (
                "Semester All-Access Pass Active"
              ) : currentTierId === "STUDENT" ? (
                "Single Report Pass Active"
              ) : (
                "Free Preview Account"
              )}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              {isProOrSemester ? (
                "You have unlimited watermark-free PDF & Word downloads unlocked across all 4 generators (Fieldwork, FYP, Labs, Coursework) for the active academic semester."
              ) : currentTierId === "STUDENT" ? (
                "Your unlocked reports have lifetime re-download and editing privileges. You can unlock additional reports for TZS 5,000 each or upgrade to a Semester Pass."
              ) : (
                "You can generate and preview complete 10–20 page reports matching your university outline for free. Pay TZS 5,000 whenever you need to download a clean, official export."
              )}
            </p>
          </div>

          {!isProOrSemester && (
            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
              <Button
                onClick={() => setCheckoutModal({
                  isOpen: true,
                  planId: "PRO",
                  planName: "Semester All-Access Pass",
                  amount: semesterPassPrice,
                  billingCycleLabel: "/ semester"
                })}
                className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-5 px-6 rounded-2xl shadow-md gap-2"
              >
                <Zap className="size-4 fill-current text-amber-300" />
                Upgrade to Semester Pass (TZS 15,000)
              </Button>
            </div>
          )}
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border text-center">
            <span className="text-xs text-muted-foreground block mb-1">Generated Drafts</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{documents.length}</span>
          </div>
          <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 text-center">
            <span className="text-xs text-teal-800 dark:text-teal-300 block mb-1 font-semibold">Ready to Download</span>
            <span className="text-2xl font-black text-teal-700 dark:text-teal-400">
              {isProOrSemester ? documents.length : unlockedCount}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border text-center">
            <span className="text-xs text-muted-foreground block mb-1">Locked Previews</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {isProOrSemester ? 0 : Math.max(0, documents.length - unlockedCount)}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border text-center">
            <span className="text-xs text-muted-foreground block mb-1">Single Unlock Price</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              TZS {new Intl.NumberFormat("en-TZ").format(singleReportPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. "MY DOCUMENTS & DOWNLOAD ACCESS" SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="size-5 text-teal-600" />
              My Documents & Download Access
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Directly download your clean, unwatermarked PDF & Word files or unlock pending drafts.
            </p>
          </div>
          <Link href="/dashboard/create">
            <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300">
              <Sparkles className="size-3.5" />
              Generate New Report
            </Button>
          </Link>
        </div>

        {downloadError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{downloadError}</span>
          </div>
        )}

        {documents.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="size-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 mx-auto flex items-center justify-center mb-3">
              <FileText className="size-6" />
            </div>
            <h3 className="font-bold text-sm text-foreground mb-1">No Academic Reports Generated Yet</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mb-5">
              Start by selecting your university and entering your field logbook or research objectives. Preview the full draft on screen for free.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/dashboard/tools/field-report">
                <Button size="sm" className="rounded-xl text-xs bg-primary">
                  Industrial Field Report
                </Button>
              </Link>
              <Link href="/dashboard/tools/fyp-generator">
                <Button size="sm" variant="outline" className="rounded-xl text-xs">
                  FYP Research Dissertation
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {documents.map((doc) => {
                const isDocUnlocked = doc.isPaid || isProOrSemester;
                const isWorking = downloadingDocId === doc.id;

                return (
                  <div key={doc.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          isDocUnlocked 
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
                            : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1"
                        }`}>
                          {isDocUnlocked ? (
                            <>
                              <CheckCircle2 className="size-3 text-emerald-600" />
                              UNLOCKED & READY
                            </>
                          ) : (
                            <>
                              <Lock className="size-3 text-amber-600" />
                              PREVIEW ONLY (LOCKED)
                            </>
                          )}
                        </span>

                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                          {doc.toolType}
                        </span>

                        <span className="text-[11px] text-muted-foreground font-mono">
                          {doc.targetPages} Pages Target
                        </span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                        {doc.title}
                      </h3>

                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                        <Clock className="size-3" />
                        Last updated {new Date(doc.updatedAt).toLocaleDateString("en-TZ", { dateStyle: "medium" })}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Link href={`/editor/${doc.id}`} target="_blank">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 gap-1.5"
                          title="Open document editor to review content or add supervisor comments"
                        >
                          <ExternalLink className="size-3.5" />
                          Studio
                        </Button>
                      </Link>

                      {isDocUnlocked ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isWorking}
                            onClick={() => handleDownload(doc, "doc")}
                            className="text-xs h-9 rounded-xl border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 gap-1.5 font-semibold"
                          >
                            {isWorking ? <RefreshCw className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                            Word (.docx)
                          </Button>

                          <Button
                            size="sm"
                            disabled={isWorking}
                            onClick={() => handleDownload(doc, "pdf")}
                            className="text-xs h-9 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold gap-1.5 shadow-sm"
                          >
                            {isWorking ? <RefreshCw className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                            Defense PDF
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleUnlockDocument(doc)}
                          className="text-xs h-9 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold gap-1.5 shadow-sm"
                        >
                          <Lock className="size-3.5 text-amber-200" />
                          Unlock for TZS {new Intl.NumberFormat("en-TZ").format(singleReportPrice)}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. "PAYMENT RECEIPTS & TRANSACTION ARCHIVE" TABLE */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="size-5 text-teal-600" />
            Payment Receipts & Transaction Archive
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Official proof of mobile money transactions for university reimbursement and accounting records.
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-muted-foreground">
            No completed payment transactions yet. When you unlock a report via M-Pesa or Tigo Pesa, receipts will appear here automatically.
          </div>
        ) : (
          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-muted-foreground font-semibold">
                  <tr>
                    <th className="p-3.5 sm:px-6">Receipt / Ref Code</th>
                    <th className="p-3.5 sm:px-4">Channel</th>
                    <th className="p-3.5 sm:px-4">Amount</th>
                    <th className="p-3.5 sm:px-4">Tier / Purpose</th>
                    <th className="p-3.5 sm:px-4">Status</th>
                    <th className="p-3.5 sm:px-6">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                      <td className="p-3.5 sm:px-6 font-mono font-bold text-slate-900 dark:text-white">
                        {tx.reference}
                      </td>
                      <td className="p-3.5 sm:px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono">
                          {tx.provider.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3.5 sm:px-4 font-bold text-slate-900 dark:text-white font-mono">
                        {new Intl.NumberFormat("en-TZ").format(tx.amount)} {tx.currency}
                      </td>
                      <td className="p-3.5 sm:px-4 text-muted-foreground">
                        {tx.tier === "STUDENT" ? "Single Report Unlock" : tx.tier === "PRO" ? "Semester Pass" : tx.tier}
                      </td>
                      <td className="p-3.5 sm:px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="size-3.5" />
                          Confirmed
                        </span>
                      </td>
                      <td className="p-3.5 sm:px-6 text-muted-foreground font-mono text-[11px]">
                        {new Date(tx.createdAt).toLocaleString("en-TZ", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 4. SUBSCRIPTION PLANS & PASSES GRID */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="size-5 text-teal-600" />
            Available Subscription Tiers & Passes
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upgrade your student account to unlock batch downloads or research dissertation features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBSCRIPTION_TIERS.map((tier) => {
            const isCurrent = currentTierId === tier.id;
            const priceLabel = tier.priceTZS === 0 
              ? "Free Preview" 
              : `TZS ${new Intl.NumberFormat('en-TZ').format(tier.priceTZS)}`;

            return (
              <div 
                key={tier.id} 
                className={`relative flex flex-col rounded-3xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden p-6 justify-between transition ${
                  tier.highlighted 
                    ? 'border-2 border-teal-500 shadow-lg' 
                    : isCurrent 
                    ? 'border-teal-600/50 bg-teal-50/20 dark:bg-teal-950/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 left-0 w-full bg-teal-500 text-slate-950 text-[10px] font-black text-center py-1 uppercase tracking-wider">
                    Best Value for Final Year
                  </div>
                )}

                <div className={tier.highlighted ? "pt-3" : ""}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{tier.name}</h3>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="mt-2 mb-3">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{priceLabel}</span>
                    {tier.priceTZS > 0 && (
                      <span className="text-xs text-muted-foreground ml-1 font-normal">
                        /{tier.billingCycle === 'monthly' ? 'mo' : tier.billingCycle === 'semester' ? 'semester' : 'document'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-5 min-h-[32px]">
                    {tier.subtitle || `${tier.limits.maxProjects === -1 ? 'Unlimited' : tier.limits.maxProjects} Projects included`}
                  </p>

                  <div className="space-y-2.5 mb-6 text-xs text-slate-700 dark:text-slate-300">
                    {tier.features.slice(0, 5).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="size-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant={isCurrent ? "outline" : tier.highlighted ? "default" : "secondary"}
                  className={`w-full rounded-2xl text-xs font-bold py-5 ${
                    tier.highlighted ? "bg-teal-600 hover:bg-teal-700 text-white" : ""
                  }`}
                  disabled={isCurrent}
                  onClick={() => handleUpgradePlan(tier)}
                >
                  {isCurrent ? "Active Plan" : tier.priceTZS === 0 ? "Default" : `Choose ${tier.name}`}
                  {!isCurrent && tier.priceTZS > 0 && <ChevronRight className="size-3.5 ml-1" />}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {checkoutModal?.isOpen && (
        <TzPaymentGateway 
          planName={checkoutModal.planName}
          planId={checkoutModal.planId}
          amount={checkoutModal.amount}
          documentId={checkoutModal.documentId}
          billingCycleLabel={checkoutModal.billingCycleLabel}
          onSuccess={() => {
            setCheckoutModal(null);
            window.location.reload();
          }}
          onCancel={() => setCheckoutModal(null)}
        />
      )}

    </div>
  );
}
