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
      link: "/dashboard/tools/methodology",
      icon: FlaskConical,
      badge: "Methodology Focus"
    },
    {
      title: "Coursework & Technical Assignment",
      desc: "Module term papers, literature reviews, and case study reports.",
      link: "/dashboard/tools/lit-review",
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
          Select your required university report type to launch the step-by-step guided assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportOptions.map((opt, i) => (
          <div key={i} className="p-6 border rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-primary/50 transition flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 border border-teal-200 dark:border-teal-900/50">
                  <opt.icon className="size-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  {opt.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                {opt.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                {opt.desc}
              </p>
            </div>

            <Link href={opt.link}>
              <Button className="w-full gap-2">
                Launch Creator <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
