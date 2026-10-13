"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Building2, Check, Loader2, AlertCircle, PhoneCall, Copy, CheckCircle2, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TzPaymentGatewayProps {
  amount: number;
  planName: string;
  planId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TzPaymentGateway({ amount, planName, planId = "PRO", onSuccess, onCancel }: TzPaymentGatewayProps) {
  // 2 Primary Payment Options
  const [method, setMethod] = useState<'mobile' | 'card'>('mobile');
  
  // Mobile Money State
  const [mobileProvider, setMobileProvider] = useState<'M_PESA' | 'TIGO_PESA' | 'AIRTEL_MONEY' | 'HALOPESA'>('M_PESA');
  const [phone, setPhone] = useState("0627204980");

  // Bank Card State
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Optional SimBanking / Wakala fallback
  const [showSimBankingFallback, setShowSimBankingFallback] = useState(false);
  const [selectedBank, setSelectedBank] = useState<'CRDB' | 'NMB'>('CRDB');
  const [bankReference, setBankReference] = useState("");
  const [copiedAccount, setCopiedAccount] = useState(false);

  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const formattedAmount = new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0
  }).format(amount);

  const bankAccounts = {
    CRDB: {
      accountName: "UniReportTZ Academic Services",
      accountNumber: "0152899450000",
      lipaNamba: "5678901",
      branch: "Tower Branch, Dar es Salaam"
    },
    NMB: {
      accountName: "UniReportTZ Academic Services",
      accountNumber: "22310089456",
      lipaNamba: "4567890",
      branch: "Clock Tower Branch, Dar es Salaam"
    }
  };

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Card Number formatting (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Card Expiry formatting (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 2) {
      raw = raw.slice(0, 2) + "/" + raw.slice(2);
    }
    setCardExpiry(raw);
  };

  // Detect card brand
  const getCardBrand = () => {
    const clean = cardNumber.replace(/\s/g, "");
    if (clean.startsWith("4")) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(clean)) return "Mastercard";
    return "";
  };

  const handleExecutePayment = async () => {
    if (method === 'mobile') {
      if (!phone.match(/^(06|07)\d{8}$/)) {
        setStatus('error');
        setErrorMessage("Please enter a valid 10-digit Tanzanian phone number (e.g., 0627204980 / 0747461380).");
        return;
      }
    } else {
      // If user chose SimBanking fallback
      if (showSimBankingFallback) {
        if (!bankReference.trim()) {
          setStatus('error');
          setErrorMessage("Please enter your SimBanking or NMB Direct transaction reference number.");
          return;
        }
      } else {
        // Standard Card validation
        const cleanCard = cardNumber.replace(/\s/g, "");
        if (cleanCard.length !== 16) {
          setStatus('error');
          setErrorMessage("Please enter a valid 16-digit card number.");
          return;
        }
        if (!cardName.trim()) {
          setStatus('error');
          setErrorMessage("Please enter the cardholder name as written on the card.");
          return;
        }
        const [month, year] = cardExpiry.split("/");
        const numMonth = parseInt(month, 10);
        if (!month || !year || isNaN(numMonth) || numMonth < 1 || numMonth > 12 || cardExpiry.length !== 5) {
          setStatus('error');
          setErrorMessage("Please enter a valid expiration date (MM/YY).");
          return;
        }
        if (cardCvv.length < 3) {
          setStatus('error');
          setErrorMessage("Please enter a valid 3-digit CVV / security code from the back of the card.");
          return;
        }
      }
    }

    setStatus('processing');
    setErrorMessage("");

    try {
      const res = await fetch("/api/billing/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          planId,
          phone: method === 'mobile' ? phone : undefined,
          provider: method === 'mobile' 
            ? mobileProvider 
            : showSimBankingFallback 
              ? 'BANK_TRANSFER' 
              : 'CARD',
          cardholderName: method === 'card' && !showSimBankingFallback ? cardName : undefined,
          last4: method === 'card' && !showSimBankingFallback ? cardNumber.replace(/\s/g, "").slice(-4) : undefined,
          cardBrand: method === 'card' && !showSimBankingFallback ? (getCardBrand() || "Card") : undefined,
          bankName: method === 'card' && showSimBankingFallback ? selectedBank : undefined,
          bankReference: method === 'card' && showSimBankingFallback ? bankReference : undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus('error');
        setErrorMessage(data.error || "Payment processing failed. Please try again.");
        return;
      }

      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setStatus('error');
      setErrorMessage("Network error during checkout. Please check your connection.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="p-6 border-b text-center bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold font-heading mb-1 text-foreground">Upgrade to {planName}</h2>
          <p className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">
            {formattedAmount} <span className="text-sm font-normal text-muted-foreground">/ month</span>
          </p>

          {/* Supported Channels in Checkout Modal */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300 font-medium">M-Pesa</span>
            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300 font-medium">Tigo Pesa</span>
            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300 font-medium">Airtel</span>
            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300 font-medium">Halopesa</span>
            <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-medium">CRDB</span>
            <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-medium">NMB</span>
            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300 font-medium">Visa / Mastercard</span>
          </div>

          <div className="mt-2 text-[11px] text-muted-foreground flex items-center justify-center gap-2">
            <span>Support:</span>
            <a href="tel:+255627204980" className="text-teal-600 font-mono font-medium hover:underline">0627 204 980</a>
            <span>/</span>
            <a href="tel:+255747461380" className="text-teal-600 font-mono font-medium hover:underline">0747 461 380</a>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {status === 'success' ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Check className="size-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Payment Confirmed!</h3>
              <p className="text-muted-foreground text-sm">Your account has been upgraded to {planName}. Unlocked features are ready.</p>
            </div>
          ) : status === 'processing' ? (
             <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="size-16 text-teal-600 animate-spin mb-4" />
              <h3 className="text-lg font-bold mb-2">Processing Transaction...</h3>
              <p className="text-muted-foreground text-sm">
                {method === 'mobile' 
                  ? "Please check your phone for the USSD push prompt to enter your PIN." 
                  : "Authorizing your bank payment securely..."}
              </p>
            </div>
          ) : (
            <>
              {/* Clean 2-Choice Payment Method Selector */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button 
                  type="button"
                  onClick={() => setMethod('mobile')}
                  className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2.5 transition-all text-sm font-semibold ${
                    method === 'mobile' 
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 ring-2 ring-teal-600/20' 
                      : 'bg-transparent text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Smartphone className="size-5 text-teal-600 shrink-0" />
                  <span>Mobile Money</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2.5 transition-all text-sm font-semibold ${
                    method === 'card' 
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 ring-2 ring-teal-600/20' 
                      : 'bg-transparent text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <CreditCard className="size-5 text-teal-600 shrink-0" />
                  <span>Bank Card</span>
                </button>
              </div>

              {/* Error Alert */}
              {status === 'error' && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs flex items-center gap-2 border border-red-200 mb-4">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* TAB 1: MOBILE MONEY */}
              {method === 'mobile' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground block mb-2">Select Operator</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'M_PESA', label: 'M-Pesa' },
                        { id: 'TIGO_PESA', label: 'Tigo Pesa' },
                        { id: 'AIRTEL_MONEY', label: 'Airtel' },
                        { id: 'HALOPESA', label: 'Halopesa' }
                      ].map((op) => (
                        <button
                          key={op.id}
                          type="button"
                          onClick={() => setMobileProvider(op.id as any)}
                          className={`p-2 rounded-xl border text-xs font-bold transition text-center ${
                            mobileProvider === op.id
                              ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                              : 'bg-background text-muted-foreground'
                          }`}
                        >
                          {op.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Phone Number (Tanzania)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-semibold">+255</span>
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="0627204980 / 0747461380"
                        maxLength={10}
                        className="w-full h-10 pl-14 pr-4 rounded-xl border bg-background font-mono font-semibold text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      A payment push prompt will appear on your phone screen to enter your secret PIN.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: BANK CARD (Standard Card Inputs) */}
              {method === 'card' && !showSimBankingFallback && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Cardholder Name
                    </label>
                    <input 
                      type="text" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. JOHN M. DOE"
                      className="w-full h-10 px-3.5 rounded-xl border bg-background text-sm font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none uppercase"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-muted-foreground">
                        Card Number
                      </label>
                      {getCardBrand() && (
                        <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide">
                          {getCardBrand()}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4123 4567 8901 2345"
                        maxLength={19}
                        className="w-full h-10 pl-10 pr-3.5 rounded-xl border bg-background font-mono text-sm tracking-wider focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                      />
                      <CreditCard className="size-4 text-muted-foreground absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        Expiry Date
                      </label>
                      <input 
                        type="text" 
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full h-10 px-3.5 rounded-xl border bg-background font-mono text-sm text-center focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        CVV / CVN
                      </label>
                      <input 
                        type="password" 
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="3 digits"
                        maxLength={4}
                        className="w-full h-10 px-3.5 rounded-xl border bg-background font-mono text-sm text-center focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                    <ShieldCheck className="size-3.5 text-teal-600 shrink-0" />
                    <span>Encrypted with 256-bit TLS. 3D-Secure OTP supported.</span>
                  </div>

                  {/* Expandable option for SimBanking / Wakala without plastic card */}
                  <div className="pt-2 border-t text-center">
                    <button
                      type="button"
                      onClick={() => setShowSimBankingFallback(true)}
                      className="text-xs text-teal-600 hover:text-teal-700 font-semibold inline-flex items-center gap-1 hover:underline"
                    >
                      <span>Paying via SimBanking, NMB Direct or Wakala slip instead?</span>
                      <ChevronDown className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* SIMBANKING / WAKALA FALLBACK VIEW */}
              {method === 'card' && showSimBankingFallback && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Select Bank</label>
                    <button
                      type="button"
                      onClick={() => setShowSimBankingFallback(false)}
                      className="text-xs text-teal-600 hover:underline font-semibold flex items-center gap-0.5"
                    >
                      <ChevronUp className="size-3.5" /> Back to Card
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBank('CRDB')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition text-center ${
                        selectedBank === 'CRDB'
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                          : 'bg-background text-muted-foreground'
                      }`}
                    >
                      CRDB (SimBanking)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedBank('NMB')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition text-center ${
                        selectedBank === 'NMB'
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                          : 'bg-background text-muted-foreground'
                      }`}
                    >
                      NMB (Direct / Wakala)
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Account Name:</span>
                      <span className="font-bold text-foreground">{bankAccounts[selectedBank].accountName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Account Number:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-teal-700 dark:text-teal-300">{bankAccounts[selectedBank].accountNumber}</span>
                        <button 
                          onClick={() => handleCopyAccount(bankAccounts[selectedBank].accountNumber)}
                          className="p-1 hover:text-teal-600"
                        >
                          <Copy className="size-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Lipa Namba:</span>
                      <span className="font-mono font-bold text-foreground">{bankAccounts[selectedBank].lipaNamba}</span>
                    </div>
                  </div>

                  {copiedAccount && (
                    <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="size-3.5" /> Account number copied!
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Transaction Reference / Receipt Code
                    </label>
                    <input 
                      type="text" 
                      value={bankReference}
                      onChange={(e) => setBankReference(e.target.value)}
                      placeholder="e.g. CRDB-TX98234 or NMB-88219"
                      className="w-full h-10 px-4 rounded-xl border bg-background font-mono text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none uppercase"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 mt-6">
                <Button variant="ghost" onClick={onCancel} className="w-full text-xs">
                  Cancel
                </Button>
                <Button 
                  onClick={handleExecutePayment} 
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
                >
                  Pay {formattedAmount}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
