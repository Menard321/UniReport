import { FileSpreadsheet, Building2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TemplatesPage() {
  const templates = [
    {
      institution: "University of Dar es Salaam (UDSM)",
      code: "UDSM-CoICT-2025",
      type: "Fieldwork & Practical Attachment Report",
      sections: "Chapter 1 to Chapter 5 (Logbook & Technical Observations)",
      verified: true,
      color: "border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20"
    },
    {
      institution: "Dar es Salaam Institute of Technology (DIT)",
      code: "DIT-IPT-V3",
      type: "Industrial Practical Training (IPT) Report",
      sections: "Executive Summary, Weekly Log, Technical Tasks, Recommendations",
      verified: true,
      color: "border-teal-500/30 bg-teal-50/50 dark:bg-teal-950/20"
    },
    {
      institution: "Mbeya University of Science & Technology (MUST)",
      code: "MUST-ENG-2025",
      type: "Final Year Engineering Project (FYP)",
      sections: "Abstract, Lit Review, System Architecture, Experimental Results",
      verified: true,
      color: "border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20"
    },
    {
      institution: "Sokoine University of Agriculture (SUA)",
      code: "SUA-AGRI-2025",
      type: "Agricultural Fieldwork & Lab Report",
      sections: "Field Methodology, Soil/Crop Analysis, Discussion, References",
      verified: true,
      color: "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20"
    },
    {
      institution: "Institute of Finance Management (IFM)",
      code: "IFM-FIN-2025",
      type: "Banking & Financial Attachment Report",
      sections: "Company Profile, Operations, Risk Analysis, Recommendations",
      verified: true,
      color: "border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20"
    },
    {
      institution: "Open University of Tanzania (OUT)",
      code: "OUT-DISSERT-2025",
      type: "Postgraduate Master Dissertation Proposal",
      sections: "Background, Statement of Problem, Research Objectives, Methodology",
      verified: true,
      color: "border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20"
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight flex items-center gap-3">
          <FileSpreadsheet className="size-8 text-primary" /> University Report Templates & Guidelines
        </h1>
        <p className="text-muted-foreground mt-1 max-w-3xl">
          Pre-configured report structures compliant with official guidelines from Tanzanian higher learning institutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl, i) => (
          <div key={i} className={`p-6 border rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between ${tpl.color}`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {tpl.code}
                </span>
                {tpl.verified && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Verified Standard
                  </span>
                )}
              </div>
              <h3 className="font-bold text-base text-foreground mb-1">{tpl.institution}</h3>
              <p className="text-xs font-semibold text-primary mb-3">{tpl.type}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                <strong>Structure:</strong> {tpl.sections}
              </p>
            </div>

            <Link href="/dashboard/tools/field-report">
              <Button size="sm" className="w-full text-xs gap-2">
                Use Template <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
