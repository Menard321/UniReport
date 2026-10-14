"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  CheckCircle2, 
  KeyRound, 
  Loader2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Step = "REQUEST" | "VERIFY" | "NEW_PASSWORD" | "SUCCESS";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("REQUEST");
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Step 2 State (Verification)
  const [ticket, setTicket] = useState("");
  const [maskedTarget, setMaskedTarget] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3 State (New Password)
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "VERIFY" && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  // Handle Step 1: Request Code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Please enter your registered email address or phone number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to find account.");
      }

      setTicket(data.ticket);
      setMaskedTarget(data.maskedTarget || identifier);
      if (data.devCode) {
        setDevCode(data.devCode);
      }
      setCountdown(60);
      setStep("VERIFY");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste handling
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      const nextOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) nextOtp[i] = d;
      });
      setOtp(nextOtp);
      const focusIndex = Math.min(digits.length, 5);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    const nextOtp = [...otp];
    nextOtp[index] = value.replace(/\D/g, "");
    setOtp(nextOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Step 2: Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join("");
    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket, code: fullCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid verification code.");
      }

      setResetToken(data.resetToken);
      setStep("NEW_PASSWORD");
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Quick fill developer helper code
  const handleUseDevCode = () => {
    if (!devCode) return;
    const digits = devCode.split("");
    setOtp(digits);
    inputRefs.current[5]?.focus();
  };

  // Handle Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setSuccessMsg(data.message || "Password successfully changed!");
      setStep("SUCCESS");
    } catch (err: any) {
      setError(err.message || "Could not update password.");
    } finally {
      setLoading(false);
    }
  };

  // Password strength meter
  const calculateStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 6) score += 1;
    if (pw.length >= 8) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[A-Z]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score += 1;
    return score;
  };

  const strength = calculateStrength(newPassword);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative py-12"
      suppressHydrationWarning
    >
      <div className="absolute inset-0 bg-grid-slate-100/[0.05] pointer-events-none" />

      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 relative z-10 border border-border"
        suppressHydrationWarning
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-90 transition-opacity">
            <div className="relative size-14 rounded-xl overflow-hidden shadow-md flex items-center justify-center mx-auto">
              <Image
                src="/logo.png"
                alt="UniReportTZ Logo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold font-heading text-primary dark:text-white mb-1.5">
            {step === "REQUEST" && "Forgot Password?"}
            {step === "VERIFY" && "Verify Your Identity"}
            {step === "NEW_PASSWORD" && "Set New Password"}
            {step === "SUCCESS" && "Password Reset Complete"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {step === "REQUEST" && "Enter your registered email or Tanzanian mobile number to receive a secure recovery code."}
            {step === "VERIFY" && `We've sent a 6-digit verification code to ${maskedTarget}`}
            {step === "NEW_PASSWORD" && "Choose a strong password to secure your academic workspace."}
            {step === "SUCCESS" && "Your password has been updated. You can now log in to your account."}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-5 border border-red-200 dark:border-red-900/50 text-center animate-in fade-in">
            {error}
          </div>
        )}

        {/* STEP 1: REQUEST CODE */}
        {step === "REQUEST" && (
          <form className="space-y-5" onSubmit={handleRequestCode}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center justify-between">
                <span>Email or Phone Number</span>
                <span className="text-xs text-muted-foreground">Tanzania format supported</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="student@udsm.ac.tz or 07XXXXXXXX"
                  className="w-full h-11 pl-10 pr-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  required
                  autoFocus
                />
                <div className="absolute left-3 top-3 text-muted-foreground pointer-events-none">
                  {identifier.includes("@") ? (
                    <Mail className="size-5 text-teal-600" />
                  ) : (
                    <Phone className="size-5 text-teal-600" />
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Accepted: Institutional email, personal email, or Vodacom, Tigo, Airtel, Halotel mobile numbers.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Locating Account...
                </>
              ) : (
                "Send Verification Code"
              )}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline transition-all"
              >
                <ArrowLeft className="size-4" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: VERIFY OTP CODE */}
        {step === "VERIFY" && (
          <form className="space-y-5" onSubmit={handleVerifyOtp}>
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground text-center block">
                Enter 6-Digit Code
              </label>
              <div className="flex justify-between gap-2 max-w-xs mx-auto">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-xl font-bold font-mono rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {/* Developer helper badge in local dev mode */}
              {devCode && (
                <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-lg p-2.5 text-xs text-teal-900 dark:text-teal-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="size-4 text-teal-600" />
                    <strong>Dev Code:</strong> {devCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleUseDevCode}
                    className="text-xs font-semibold text-teal-700 dark:text-teal-300 underline hover:opacity-80"
                  >
                    Auto-fill
                  </button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Verifying Code...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep("REQUEST");
                  setError("");
                }}
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="size-3.5" />
                Change Email / Phone
              </button>

              <button
                type="button"
                disabled={countdown > 0 || loading}
                onClick={handleRequestCode}
                className={`flex items-center gap-1 font-medium ${
                  countdown > 0 ? "text-muted-foreground cursor-not-allowed" : "text-teal-600 hover:underline"
                }`}
              >
                <RefreshCw className="size-3" />
                {countdown > 0 ? `Resend code in ${countdown}s` : "Resend Code"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SET NEW PASSWORD */}
        {step === "NEW_PASSWORD" && (
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3 pr-10 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>

              {/* Password strength progress bar */}
              {newPassword && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 transition-all duration-300 ${
                          strength >= level ? strengthColors[strength - 1] : "opacity-0"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex justify-between">
                    <span>Strength: {strength > 0 ? strengthLabels[strength - 1] : "Too short"}</span>
                    <span>Min. 6 characters</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Confirm New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md font-medium mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Updating Password...
                </>
              ) : (
                "Save & Reset Password"
              )}
            </Button>
          </form>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === "SUCCESS" && (
          <div className="space-y-6 text-center py-2 animate-in fade-in zoom-in-95 duration-300">
            <div className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="size-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold font-heading text-foreground">
                All Set!
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {successMsg || "Your password has been reset securely. You can now access your UniReportTZ projects and documents."}
              </p>
            </div>

            <div className="pt-2">
              <Link href="/auth/login">
                <Button className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md font-semibold text-sm">
                  Sign In to UniReportTZ
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
