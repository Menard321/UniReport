import Link from "next/link";
import { PlusCircle, Building2, GraduationCap, FlaskConical, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateReportLauncher() {
  const reportOptions = [
    {
      title: "Fieldwork & Attachment Report",
      desc: "Industrial practical training (IPT), site observations, and field logbook reports.",
      link: "/dashboard/tools/field-report",
      icon: Building2,
      badge: "Guided 5-Step Wizard"
    },
    {
      title: "Research Proposal & Dissertation",
      desc: "Undergraduate and postgraduate final year projects (FYP) and thesis chapters.",
      link: "/dashboard/tools/fyp-generator",
      icon: GraduationCap,
      badge: "Multi-Chapter AI"
    },
    {
      title: "Practical & Laboratory Report",
      desc: "Scientific experiments, technical setups, data collection, and lab observations.",
      link: "/dashboard/tools/lab-report",
      icon: FlaskConical,
      badge: "Scientific Lab Wizard"
    },
    {
      title: "Coursework & Technical Assignment",
      desc: "Module term papers, literature reviews, and case study reports.",
      link: "/dashboard/tools/coursework",
      icon: BookOpen,
      badge: "Academic Writing"
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight flex items-center gap-3">
          <PlusCircle className="size-8 text-primary" /> Create New Academic Report
        </h1>
        <p className="text-muted-foreground mt-1">
          Select your required university report type or use our dynamic universal institution builder.
        </p>
      </div>

      {/* FEATURED UNIVERSAL UNIVERSITY CREATOR BANNER */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-teal-500/10 to-transparent border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500 text-white">
            Universal Institutional Standard
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Universal Report Wizard (All Registered Universities)
          </h2>
          <p className="text-xs text-muted-foreground max-w-xl">
            Choose from all supported institutions (UDSM, IFM, CBE, ARU, NIT, etc.) to automatically resolve official required chapters and formatting rules.
          </p>
        </div>
        <Link href="/dashboard/reports/new" className="shrink-0 w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-white gap-2 shadow-md">
            Start Universal Wizard <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportOptions.map((opt, i) => (
          <div 
            key={i} 
            className="p-6 border rounded-2xl bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:border-teal-500/40 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 border border-teal-200 dark:border-teal-900/50 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                  <opt.icon className="size-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                  {opt.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors mb-2">
                {opt.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                {opt.desc}
              </p>
            </div>

            <Link href={opt.link} className="block w-full">
              <Button className="w-full gap-2 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-md cursor-pointer">
                <span>Launch Creator</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
