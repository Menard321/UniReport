"use client";

import { useState } from "react";
import { 
  Lock, 
  Smartphone, 
  CreditCard, 
  Check, 
  Loader2, 
  AlertCircle, 
  X, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  ShieldCheck, 
  Sparkles, 
  Zap,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DocumentExportPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentId?: string | null;
  targetPages?: number | string;
  university?: string;
  singlePrice?: number;
  semesterPrice?: number;
  onSuccess: () => void;
}

export function DocumentExportPaywallModal({
  isOpen,
  onClose,
  documentTitle,
  documentId,
  targetPages = "10–15",
  university = "Tanzania Higher Education",
  singlePrice = 5000,
  semesterPrice = 15000,
  onSuccess,
}: DocumentExportPaywallModalProps) {
  // Plan Choice: 'SINGLE' (TZS 5,000) or 'SEMESTER' (TZS 15,000)
  const [selectedTier, setSelectedTier] = useState<"SINGLE" | "SEMESTER">("SINGLE");

  // Payment Channel: 'mobile' or 'card'
  const [method, setMethod] = useState<"mobile" | "card">("mobile");
  
  // Mobile Money
  const [mobileProvider, setMobileProvider] = useState<"M_PESA" | "TIGO_PESA" | "AIRTEL_MONEY" | "HALOPESA">("M_PESA");
  const [phone, setPhone] = useState("0627204980");

  // Bank Card
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // SimBanking / Wakala fallback
  const [showSimBanking, setShowSimBanking] = useState(false);
  const [selectedBank, setSelectedBank] = useState<"CRDB" | "NMB">("CRDB");
  const [bankReference, setBankReference] = useState("");
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Status
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const currentAmount = selectedTier === "SINGLE" ? singlePrice : semesterPrice;
  const currentPlanId = selectedTier === "SINGLE" ? "STUDENT" : "PRO";

  const formattedAmount = new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    minimumFractionDigits: 0
  }).format(currentAmount);

  const bankAccounts = {
    CRDB: {
      accountName: "UniReportTZ Academic Services",
      accountNumber: "0152899450000",
      lipaNamba: "5678901",
    },
    NMB: {
      accountName: "UniReportTZ Academic Services",
      accountNumber: "22310089456",
      lipaNamba: "4567890",
    }
  };

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 2) {
      raw = raw.slice(0, 2) + "/" + raw.slice(2);
    }
    setCardExpiry(raw);
  };

  const handleSubmitPayment = async () => {
    if (method === "mobile") {
      if (!phone.match(/^(06|07)\d{8}$/)) {
        setStatus("error");
        setErrorMessage("Please enter a valid 10-digit Tanzanian phone number (e.g., 0627204980 / 0747461380).");
        return;
      }
    } else {
      if (showSimBanking) {
        if (!bankReference.trim()) {
          setStatus("error");
          setErrorMessage("Please enter your SimBanking or NMB Direct transaction reference number.");
          return;
        }
      } else {
        const cleanCard = cardNumber.replace(/\s/g, "");
        if (cleanCard.length !== 16) {
          setStatus("error");
          setErrorMessage("Please enter a valid 16-digit card number.");
          return;
        }
        if (!cardName.trim()) {
          setStatus("error");
          setErrorMessage("Please enter the cardholder name.");
          return;
        }
        if (cardExpiry.length !== 5) {
          setStatus("error");
          setErrorMessage("Please enter a valid expiry date (MM/YY).");
          return;
        }
        if (cardCvv.length < 3) {
          setStatus("error");
          setErrorMessage("Please enter the 3-digit CVV from the back of the card.");
          return;
        }
      }
    }

    setStatus("processing");
    setErrorMessage("");

    try {
      const res = await fetch("/api/billing/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: currentAmount,
          planId: currentPlanId,
          documentId: documentId || undefined,
          phone: method === "mobile" ? phone : undefined,
          provider: method === "mobile" 
            ? mobileProvider 
            : showSimBanking 
              ? "BANK_TRANSFER" 
              : "CARD",
          cardholderName: method === "card" && !showSimBanking ? cardName : undefined,
          last4: method === "card" && !showSimBanking ? cardNumber.replace(/\s/g, "").slice(-4) : undefined,
          cardBrand: method === "card" && !showSimBanking ? (cardNumber.startsWith("4") ? "Visa" : "Mastercard") : undefined,
          bankName: method === "card" && showSimBanking ? selectedBank : undefined,
          bankReference: method === "card" && showSimBanking ? bankReference : undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setErrorMessage(data.error || "Payment processing failed. Please try again.");
        return;
      }

      setStatus("success");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);

    } catch (err: any) {
      setStatus("error");
      setErrorMessage("Network error during payment verification. Please check your connection.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 relative max-h-[92vh] flex flex-col">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="size-5" />
        </button>

        {/* MODAL HEADER */}
        <div className="p-6 border-b text-center bg-slate-50 dark:bg-slate-800/40 shrink-0">
          <div className="size-11 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center mb-2">
            <Lock className="size-5" />
          </div>
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
            Unlock Official Academic Export
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Remove all draft watermarks, get official university cover pages, and download publication-grade PDF and editable Microsoft Word (DOCX) reports.
          </p>

          <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 flex items-center gap-1">
              <Check className="size-3 text-blue-600" /> Microsoft Word (.docx) Included
            </span>
            <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800 flex items-center gap-1">
              <Check className="size-3 text-teal-600" /> Academic PDF (.pdf) Included
            </span>
          </div>

          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border text-[11px] font-mono text-slate-700 dark:text-slate-300">
            <GraduationCap className="size-3.5 text-teal-600" />
            <span className="truncate max-w-[280px] font-semibold">{documentTitle}</span>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-5">
          {status === "success" ? (
            <div className="py-12 text-center space-y-3">
              <div className="size-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Check className="size-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Payment Confirmed!</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Your report has been unlocked permanently. Download is starting automatically...
              </p>
            </div>
          ) : status === "processing" ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="size-12 text-teal-600 animate-spin mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Waiting for Mobile PIN Authorization...
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Please check your phone screen for the USSD push prompt from {mobileProvider.replace("_", " ")} and enter your secret PIN.
              </p>
            </div>
          ) : (
            <>
              {/* TIER SELECTION TABS */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Choose Download Option
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* OPTION 1: SINGLE REPORT UNLOCK */}
                  <button
                    type="button"
                    onClick={() => setSelectedTier("SINGLE")}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                      selectedTier === "SINGLE"
                        ? "border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 ring-2 ring-teal-600/20"
                        : "border-slate-200 dark:border-slate-800 bg-background hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">Single Report</span>
                        {selectedTier === "SINGLE" && <CheckCircle2 className="size-3.5 text-teal-600 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-tight">
                        Unlock Microsoft Word (.docx) & PDF with lifetime re-download.
                      </p>
                    </div>
                    <div className="mt-2.5">
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        TZS {new Intl.NumberFormat("en-TZ").format(singlePrice)}
                      </span>
                    </div>
                  </button>

                  {/* OPTION 2: SEMESTER PASS */}
                  <button
                    type="button"
                    onClick={() => setSelectedTier("SEMESTER")}
                    className={`p-3.5 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                      selectedTier === "SEMESTER"
                        ? "border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 ring-2 ring-teal-600/20"
                        : "border-slate-200 dark:border-slate-800 bg-background hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <span className="absolute -top-2 right-2 bg-teal-600 text-white text-[9px] font-bold px-2 py-0.2 rounded-full uppercase">
                      All 4 Tools
                    </span>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">Semester Pass</span>
                        {selectedTier === "SEMESTER" && <CheckCircle2 className="size-3.5 text-teal-600 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-tight">
                        Unlimited unlocks for Fieldwork + FYP + Labs + Coursework.
                      </p>
                    </div>
                    <div className="mt-2.5">
                      <span className="text-base font-black text-teal-600 dark:text-teal-400">
                        TZS {new Intl.NumberFormat("en-TZ").format(semesterPrice)}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* PAYMENT METHOD SWITCHER */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMethod("mobile")}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                      method === "mobile"
                        ? "border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300"
                        : "border-slate-200 dark:border-slate-800 text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Smartphone className="size-4 text-teal-600" />
                    Mobile Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("card")}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                      method === "card"
                        ? "border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300"
                        : "border-slate-200 dark:border-slate-800 text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <CreditCard className="size-4 text-teal-600" />
                    Card / SimBanking
                  </button>
                </div>
              </div>

              {/* ERROR ALERT */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* METHOD 1: MOBILE MONEY */}
              {method === "mobile" && (
                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                      Select Network Operator
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: "M_PESA", name: "M-Pesa" },
                        { id: "TIGO_PESA", name: "Tigo Pesa" },
                        { id: "AIRTEL_MONEY", name: "Airtel" },
                        { id: "HALOPESA", name: "HaloPesa" }
                      ].map((op) => (
                        <button
                          key={op.id}
                          type="button"
                          onClick={() => setMobileProvider(op.id as any)}
                          className={`py-2 px-1 rounded-xl border text-[11px] font-bold text-center transition ${
                            mobileProvider === op.id
                              ? "border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 ring-1 ring-teal-600"
                              : "border-slate-200 dark:border-slate-800 text-muted-foreground"
                          }`}
                        >
                          {op.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Phone Number (Tanzania)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-muted-foreground text-xs font-bold">+255</span>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="0627204980 / 0747461380"
                        maxLength={10}
                        className="w-full h-10 pl-14 pr-3 rounded-xl border bg-background font-mono text-xs font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      A USSD prompt will pop up on your mobile phone to enter your secret PIN.
                    </p>
                  </div>
                </div>
              )}

              {/* METHOD 2: BANK CARD */}
              {method === "card" && !showSimBanking && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. JOHN M. DOE"
                      className="w-full h-9 px-3 rounded-xl border bg-background text-xs uppercase focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4123 4567 8901 2345"
                      maxLength={19}
                      className="w-full h-9 px-3 rounded-xl border bg-background font-mono text-xs tracking-wider focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full h-9 px-3 rounded-xl border bg-background font-mono text-xs text-center focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="3 digits"
                        maxLength={4}
                        className="w-full h-9 px-3 rounded-xl border bg-background font-mono text-xs text-center focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 text-center border-t">
                    <button
                      type="button"
                      onClick={() => setShowSimBanking(true)}
                      className="text-xs text-teal-600 hover:underline font-semibold"
                    >
                      Pay via CRDB SimBanking or NMB Direct instead?
                    </button>
                  </div>
                </div>
              )}

              {/* METHOD 2B: SIMBANKING FALLBACK */}
              {method === "card" && showSimBanking && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-muted-foreground">Select Bank</span>
                    <button
                      type="button"
                      onClick={() => setShowSimBanking(false)}
                      className="text-xs text-teal-600 hover:underline font-semibold"
                    >
                      Back to Card
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(["CRDB", "NMB"] as const).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`p-2 rounded-xl border text-xs font-bold ${
                          selectedBank === b 
                            ? "border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300"
                            : "border-slate-200 dark:border-slate-800 text-muted-foreground"
                        }`}
                      >
                        {b} ({b === "CRDB" ? "SimBanking" : "Direct / Wakala"})
                      </button>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">A/C:</span>
                      <span className="font-mono font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1">
                        {bankAccounts[selectedBank].accountNumber}
                        <button onClick={() => handleCopyAccount(bankAccounts[selectedBank].accountNumber)} className="p-0.5">
                          <Copy className="size-3" />
                        </button>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lipa Namba:</span>
                      <span className="font-mono font-bold">{bankAccounts[selectedBank].lipaNamba}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Receipt Reference</label>
                    <input
                      type="text"
                      value={bankReference}
                      onChange={(e) => setBankReference(e.target.value)}
                      placeholder="e.g. CRDB-TX98234"
                      className="w-full h-9 px-3 rounded-xl border bg-background font-mono text-xs uppercase outline-none focus:border-teal-600"
                    />
                  </div>
                </div>
              )}

              {/* MODAL ACTIONS */}
              <div className="flex items-center gap-3 pt-3 border-t">
                <Button variant="ghost" onClick={onClose} className="w-full text-xs">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitPayment}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-5 rounded-2xl shadow-md gap-1.5"
                >
                  <Lock className="size-3.5 text-amber-200" />
                  Pay {formattedAmount} & Download
                </Button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
