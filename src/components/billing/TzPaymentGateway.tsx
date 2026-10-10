"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TzPaymentGatewayProps {
  amount: number;
  planName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TzPaymentGateway({ amount, planName, onSuccess, onCancel }: TzPaymentGatewayProps) {
  const [method, setMethod] = useState<'mobile' | 'card'>('mobile');
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const formattedAmount = new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0
  }).format(amount);

  const handleSimulatePayment = () => {
    if (method === 'mobile' && !phone.match(/^(06|07)\d{8}$/)) {
      setStatus('error');
      return;
    }

    setStatus('processing');
    
    // Simulate API delay for Mobile Money Push Push
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b text-center bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold mb-1">Upgrade to {planName}</h2>
          <p className="text-3xl font-bold text-primary">{formattedAmount} <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {status === 'success' ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Check className="size-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground">Your account has been upgraded to {planName}.</p>
            </div>
          ) : status === 'processing' ? (
             <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="size-16 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-bold mb-2">Processing Payment...</h3>
              <p className="text-muted-foreground">Please check your phone to authorize the transaction.</p>
            </div>
          ) : (
            <>
              {/* Payment Method Toggle */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                  onClick={() => setMethod('mobile')}
                  className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${method === 'mobile' ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary' : 'bg-transparent text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <Smartphone className="size-6" />
                  <span className="font-medium text-sm">Mobile Money</span>
                </button>
                <button 
                  onClick={() => setMethod('card')}
                  className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${method === 'card' ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary' : 'bg-transparent text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <CreditCard className="size-6" />
                  <span className="font-medium text-sm">Credit / Debit</span>
                </button>
              </div>

               <div className="space-y-4">
                  {status === 'error' && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-200">
                      <AlertCircle className="size-4 shrink-0" />
                      Please enter a valid 10-digit Tanzanian phone number (e.g., 0712345678).
                    </div>
                  )}

                 {method === 'mobile' ? (
                   <div>
                     <label className="block text-sm font-medium mb-2">Mobile Number (M-Pesa / Tigo Pesa)</label>
                     <div className="relative">
                       <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-medium">+255</span>
                       <input 
                         type="text" 
                         value={phone}
                         onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                         placeholder="0712345678"
                         maxLength={10}
                         className="w-full h-10 pl-12 pr-4 rounded-lg border bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                       />
                     </div>
                     <p className="text-xs text-muted-foreground mt-2">A push notification will be sent to your phone to enter your PIN.</p>
                   </div>
                 ) : (
                   <div className="p-4 border border-dashed rounded-lg text-center bg-slate-50 dark:bg-slate-900/50">
                     <p className="text-sm text-muted-foreground">Card payments are handled securely via Selcom gateway.</p>
                     <p className="text-xs text-muted-foreground mt-1">(Simulation ignores card data)</p>
                   </div>
                 )}
               </div>

              <div className="flex items-center justify-between gap-4 mt-8">
                <Button variant="ghost" onClick={onCancel} className="w-full">Cancel</Button>
                <Button onClick={handleSimulatePayment} className="w-full">
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
