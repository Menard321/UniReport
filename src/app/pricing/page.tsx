"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TzPaymentGateway } from "@/components/billing/TzPaymentGateway";

export default function PricingPage() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [studentPrice, setStudentPrice] = useState(10000);

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d) => {
        if (d.pricing?.studentMonthlyTzs) {
          setStudentPrice(d.pricing.studentMonthlyTzs);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col min-h-screen">
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary dark:text-white mb-4">
              Simple, Accessible Pricing
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-12">
              Tailored specifically for Tanzanian university students and faculties. Transparent plans with instant activation.
            </p>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
            {/* Free Tier */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Free Core</h3>
                <p className="text-3xl font-bold mb-6">
                  TZS 0 <span className="text-sm font-normal text-muted-foreground">/ month</span>
                </p>
                <ul className="space-y-4 mb-8">
                  {["1 Active Project", "Basic Generation Credits", "Standard Export (Watermarked)", "Basic Research Tools"].map((ft, i) => (
                    <li key={i} className="flex gap-2 items-center">
                      <CheckCircle2 className="size-5 text-teal-600" /> <span className="text-sm">{ft}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/register">
                <Button variant="outline" className="w-full rounded-xl">Get Started Free</Button>
              </Link>
            </div>
            
            {/* Student Tier */}
            <div className="p-8 rounded-3xl bg-primary text-white border border-primary shadow-2xl relative scale-105 z-10 flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-gold text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-2xl tracking-wide uppercase">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Student Pro</h3>
                <p className="text-3xl font-bold mb-6">
                  TZS {new Intl.NumberFormat("en-TZ").format(studentPrice)} <span className="text-sm font-normal text-teal-200">/ month</span>
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "5 Active Projects",
                    "Advanced AI Models (Claude 3.5 & GPT-4o)",
                    "Unlimited Watermark-Free Export (DOCX & PDF)",
                    "Direct Tanzania Field & FYP Generator",
                    "Full Anti-Copy Document Unlock",
                    "Verified Citations limit up to 100"
                  ].map((ft, i) => (
                    <li key={i} className="flex gap-2 items-center">
                      <CheckCircle2 className="size-5 text-teal-400" /> <span className="text-sm text-slate-100">{ft}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Button 
                  onClick={() => setShowCheckout(true)} 
                  variant="accent" 
                  className="w-full py-6 text-base font-bold rounded-xl shadow-lg hover:shadow-teal-500/25 transition"
                >
                  Upgrade to Student Pro
                </Button>
              </div>
            </div>
            
            {/* Institutional Tier */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Institutional</h3>
                <p className="text-3xl font-bold mb-6">
                  Custom <span className="text-sm font-normal text-muted-foreground">/ volume</span>
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Custom University Guidelines (UDSM, DIT, MUST)",
                    "Supervisor Workflows & Grading Rubrics",
                    "API Research Integrations",
                    "Institutional Compliance Analytics",
                    "Dedicated Account Manager & SLA"
                  ].map((ft, i) => (
                    <li key={i} className="flex gap-2 items-center">
                      <CheckCircle2 className="size-5 text-teal-600" /> <span className="text-sm">{ft}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/contact">
                <Button variant="outline" className="w-full rounded-xl">Contact Sales & Invoicing</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Checkout Modal */}
      {showCheckout && (
        <TzPaymentGateway 
          planName="Student Pro"
          planId="STUDENT"
          amount={studentPrice}
          onSuccess={() => {
            setShowCheckout(false);
            window.location.href = "/dashboard";
          }}
          onCancel={() => setShowCheckout(false)}
        />
      )}

      <Footer />
    </>
  );
}
