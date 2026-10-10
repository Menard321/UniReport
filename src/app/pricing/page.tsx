import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col min-h-screen">
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary dark:text-white mb-6">Simple, Accessible Pricing</h1>
            <p className="text-lg text-muted-foreground mb-16">
              Designed for Tanzanian students and institutions. Pay via mobile money (M-Pesa, Tigo Pesa) or standard cards.
            </p>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-2">Free Core</h3>
              <p className="text-3xl font-bold mb-6">TZS 0 <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
              <ul className="space-y-4 mb-8">
                {["1 Active Project", "Basic Generation Credits", "Standard Export (Watermarked)", "Basic Research Tools"].map((ft, i) => (
                  <li key={i} className="flex gap-2 items-center">
                    <CheckCircle2 className="size-5 text-teal-600" /> <span className="text-sm">{ft}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">Get Started</Button>
            </div>
            
            {/* Student Tier */}
            <div className="p-8 rounded-2xl bg-primary text-white border border-primary shadow-xl relative scale-105 z-10">
              <div className="absolute top-0 right-0 bg-gold text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl tracking-wide uppercase">Most Popular</div>
              <h3 className="text-xl font-bold mb-2 text-white">Student Pro</h3>
              <p className="text-3xl font-bold mb-6">TZS 10,000 <span className="text-sm font-normal text-teal-200">/ month</span></p>
              <ul className="space-y-4 mb-8">
                {["5 Active Projects", "Advanced AI Models (Claude 3.5)", "Unlimited Watermark-Free Export", "Data Analysis Suite", "Verified Citations limit up to 100"].map((ft, i) => (
                  <li key={i} className="flex gap-2 items-center">
                    <CheckCircle2 className="size-5 text-teal-400" /> <span className="text-sm text-slate-100">{ft}</span>
                  </li>
                ))}
              </ul>
              <Button variant="accent" className="w-full">Upgrade via M-Pesa</Button>
            </div>
            
            {/* Institutional Tier */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-2">Institutional</h3>
              <p className="text-3xl font-bold mb-6">Custom <span className="text-sm font-normal text-muted-foreground">/ volume</span></p>
              <ul className="space-y-4 mb-8">
                {["Custom University Templates", "Supervisor Workflows", "API Research Integrations", "Compliance Analytics", "Priority Support"].map((ft, i) => (
                  <li key={i} className="flex gap-2 items-center">
                    <CheckCircle2 className="size-5 text-teal-600" /> <span className="text-sm">{ft}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
