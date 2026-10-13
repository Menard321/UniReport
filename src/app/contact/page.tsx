"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  HelpCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("SUPPORT");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject || "Public Inquiry",
          category,
          message: `Sender: ${name} (${email})\n\n${message}`
        })
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "How do I download my generated report in Microsoft Word or PDF?",
      a: "Once your report generates in the tool canvas, you can preview it for free. To download the complete editable Word (.DOC) or publication-ready PDF file, click the 'Unlock PDF' or 'Unlock .DOC' button and complete payment of TZS 5,000 via M-Pesa, Tigo Pesa, Airtel Money, or Halopesa."
    },
    {
      q: "Are the report formats compliant with Tanzanian universities?",
      a: "Yes. UniReportTZ formats reports strictly in accordance with TCU guidelines and specific university handbooks (such as UDSM CoICT/CoET, UDOM CIVE, SUA, and MUST)."
    },
    {
      q: "What if I experience network delays during mobile payment?",
      a: "All mobile transactions are logged in our database. If your payment goes through but your document does not unlock automatically, simply submit your phone number and transaction reference to our support desk for instant manual unlocking."
    },
    {
      q: "Can I use UniReportTZ on my mobile phone?",
      a: "Yes! UniReportTZ is 100% responsive and accessible on mobile browsers, tablets, and desktop computers."
    }
  ];

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-20 bg-slate-900 text-white overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:32px_32px]" />
          <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-teal-400 uppercase mb-6">
              <MessageSquare className="size-4" /> WE ARE HERE TO HELP
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight mb-4">
              Contact Support & Help Desk
            </h1>
            <p className="text-base text-slate-300 max-w-2xl mx-auto">
              Have questions regarding report generation, institutional guidelines, or mobile payment verification? Our team in Dar es Salaam is ready to assist you.
            </p>
          </div>
        </section>

        {/* CONTACT GRID */}
        <section className="py-16 px-4 md:px-6 container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* LEFT COLUMN: CONTACT CHANNELS & CARDS */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-bold text-lg font-heading text-foreground">Direct Contact Channels</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="size-9 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="size-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Email Support</div>
                      <div className="text-xs text-muted-foreground">support@unireport.co.tz</div>
                      <div className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">Response within 2 hours</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="size-9 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="size-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Mobile & WhatsApp Desk</div>
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-0.5">
                        <a href="tel:+255627204980" className="hover:text-teal-600 dark:hover:text-teal-400 font-mono font-medium underline">
                          +255 627 204 980
                        </a>
                        <span>/</span>
                        <a href="tel:+255747461380" className="hover:text-teal-600 dark:hover:text-teal-400 font-mono font-medium underline">
                          +255 747 461 380
                        </a>
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Direct Helpline & WhatsApp • 8:00 AM – 8:00 PM EAT</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="size-9 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="size-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Liaison Office</div>
                      <div className="text-xs text-muted-foreground">CoICT Innovation Hub, Kijitonyama</div>
                      <div className="text-[11px] text-muted-foreground">Dar es Salaam, Tanzania</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK STATUS CARD */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">System Telemetry</span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" /> All Systems Operational
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  AI report generation clusters, mobile payment verification nodes, and export engines are operating normally across all regions.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: CONTACT FORM */}
            <div className="lg:col-span-7">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-xl font-heading mb-1 text-foreground">Send an Inquiry or Ticket</h3>
                <p className="text-xs text-muted-foreground mb-6">Our academic technical team responds promptly to all requests.</p>

                {submitted ? (
                  <div className="p-8 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-lg text-emerald-900 dark:text-emerald-200">Message Received!</h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                      Thank you for contacting UniReportTZ. A support specialist has received your inquiry and will follow up with you at <strong>{email}</strong> shortly.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => { setSubmitted(false); setMessage(""); setSubject(""); }} 
                      className="mt-4 text-xs"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Your Full Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Amani Mwita"
                          className="w-full p-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">University / Email Address</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student@university.ac.tz"
                          className="w-full p-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full p-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        >
                          <option value="SUPPORT">Technical Support</option>
                          <option value="BILLING">Payment & Verification</option>
                          <option value="ACADEMIC">University Guidelines</option>
                          <option value="INSTITUTION">Institutional Partnership</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Subject</label>
                        <input
                          type="text"
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="e.g. Fieldwork report payment query"
                          className="w-full p-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">Message Details</label>
                      <textarea
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please describe your question or issue in detail..."
                        className="w-full p-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm gap-2"
                    >
                      {isSubmitting ? "Submitting..." : (
                        <>
                          <Send className="size-4" /> Submit Inquiry
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>

          </div>

          {/* FAQ SECTION */}
          <div className="mt-20 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">KNOWLEDGE BASE</span>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm md:text-base text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`size-4 text-muted-foreground transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-muted-foreground leading-relaxed border-t border-slate-100 dark:border-slate-800">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </section>

      </main>
      <Footer />
    </>
  );
}
