"use client";

import { FileSpreadsheet, Building2, CheckCircle2, ArrowRight, Download, FileText, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AcademicAlerts from "@/lib/sweetalert";

export default function TemplatesPage() {
  const templates = [
    {
      institution: "University of Dar es Salaam (UDSM)",
      shortName: "UDSM",
      code: "UDSM-PT-DOCX",
      fileName: "UDSM.docx",
      downloadUrl: "/templates/UDSM.docx",
      fileType: "DOCX (Word Template)",
      size: "91 KB",
      type: "Practical Training (PT) / Fieldwork Report",
      sections: "Chapter 1: Host Org Profile • Chapter 2: Technical Duties & System Specs • Chapter 3: Industrial Challenges • Chapter 4: Skills Acquired • Chapter 5: Conclusions & Recommendations",
      verified: true,
      badgeText: "Official Institutional DOCX",
      color: "border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20"
    },
    {
      institution: "Ardhi University (ARU / ARDHI)",
      shortName: "ARU",
      code: "ARU-IT-REPORT",
      fileName: "ARTHI IT REPORT 2_110443.pdf",
      downloadUrl: "/templates/ARTHI%20IT%20REPORT%202_110443.pdf",
      fileType: "PDF Guideline & Sample",
      size: "3.0 MB",
      type: "Information Technology & Spatial Fieldwork Report",
      sections: "Chapter 1: Org Governance & Organogram • Chapter 2: Technical Workflow & IT Systems • Chapter 3: Field Challenges • Chapter 4: Curriculum Relevance • Chapter 5: Strategic Recommendations",
      verified: true,
      badgeText: "Verified Sample PDF",
      color: "border-teal-500/30 bg-teal-50/50 dark:bg-teal-950/20"
    },
    {
      institution: "College of Business Education (CBE)",
      shortName: "CBE",
      code: "CBE-FPT-FORMAT",
      fileName: "CBE FIELD REPORT FORMAT .pdf",
      downloadUrl: "/templates/CBE%20FIELD%20REPORT%20FORMAT%20.pdf",
      fileType: "PDF Guideline & Format",
      size: "702 KB",
      type: "Field Practical Training (FPT) Report",
      sections: "Chapter 1: Background & Departmental Setup • Chapter 2: Commercial & Technical Operations • Chapter 3: Analysis of Challenges • Chapter 4: Theory Integration • Chapter 5: Recommendations",
      verified: true,
      badgeText: "Official Senate Format PDF",
      color: "border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20"
    },
    {
      institution: "Institute of Finance Management (IFM)",
      shortName: "IFM",
      code: "IFM-FPT-SAMPLE",
      fileName: "IFM FIELD REPORT SAMPLE.pdf",
      downloadUrl: "/templates/IFM%20FIELD%20REPORT%20SAMPLE.pdf",
      fileType: "PDF Guideline & Sample",
      size: "1.3 MB",
      type: "Banking, Finance & Computing Attachment Report",
      sections: "Chapter 1: Company Profile & Core Services • Chapter 2: Fieldwork Operations & Tools • Chapter 3: Risk & Technical Analysis • Chapter 4: Skills Acquired • Chapter 5: Recommendations",
      verified: true,
      badgeText: "Official Faculty Sample PDF",
      color: "border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20"
    },
    {
      institution: "National Institute of Transport (NIT)",
      shortName: "NIT",
      code: "NIT-IPT-GUIDELINE",
      fileName: "NIT FIELD REPORT.pdf",
      downloadUrl: "/templates/NIT%20FIELD%20REPORT.pdf",
      fileType: "PDF Guideline & Format",
      size: "668 KB",
      type: "Industrial Practical Training (IPT) Report",
      sections: "Chapter 1: Corporate Governance & SOPs • Chapter 2: Technical Maintenance & Operations • Chapter 3: Operational Roadblocks • Chapter 4: Curriculum Alignment • Chapter 5: Conclusions",
      verified: true,
      badgeText: "Official IPT Guideline PDF",
      color: "border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20"
    },
    {
      institution: "National Higher Learning Standard (TCU Aligned)",
      shortName: "TCU-STD",
      code: "TCU-FIELD-STD",
      fileName: "FIELD REPORT SAMPLE.pdf",
      downloadUrl: "/templates/FIELD%20REPORT%20SAMPLE.pdf",
      fileType: "PDF National Standard",
      size: "1.3 MB",
      type: "Industrial Practical Training Benchmark",
      sections: "Chapter 1: Placement Mandate • Chapter 2: Practical Implementation • Chapter 3: Challenges & Mitigation • Chapter 4: Professional Competencies • Chapter 5: Strategic Action Plan",
      verified: true,
      badgeText: "National TCU Standard PDF",
      color: "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20"
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="border-b border-border/60 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-600 dark:text-teal-400 mb-2">
          <BadgeCheck className="size-4" /> LOCAL TEMPLATE REPOSITORY
        </div>
        <h1 className="text-3xl font-bold font-heading tracking-tight flex items-center gap-3">
          <FileSpreadsheet className="size-8 text-teal-600 dark:text-teal-400" />
          University Report Templates & Guidelines
        </h1>
        <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-relaxed">
          Official institutional templates located in <code className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-xs">C:\Users\DevStromer\Desktop\unireport\UniReport\templates</code>. 
          Each template is strictly calibrated with <strong>Times New Roman (10 pt body, 14 pt top headers, 12 pt subheadings)</strong> and Tanzanian university binding specifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl, i) => (
          <div key={i} className={`p-6 border rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between ${tpl.color} hover:shadow-lg transition-all`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {tpl.code}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> {tpl.badgeText}
                </span>
              </div>

              <h3 className="font-bold text-base text-foreground mb-1">{tpl.institution}</h3>
              <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 mb-3">{tpl.type}</p>

              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-[11px] font-mono space-y-1 mb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Source File:</span>
                  <span className="font-semibold text-foreground truncate max-w-[170px]">{tpl.fileName}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>File Size:</span>
                  <span className="font-semibold text-foreground">{tpl.size}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Typography:</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">Times New Roman 10pt</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                <strong className="text-foreground">Official Structure:</strong> {tpl.sections}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/50">
              <Link href={`/dashboard/tools/field-report?institution=${encodeURIComponent(tpl.shortName)}`}>
                <Button size="sm" className="w-full text-xs gap-1.5 shadow-sm">
                  Generate With This Template <ArrowRight className="size-3.5" />
                </Button>
              </Link>
              <a 
                href={tpl.downloadUrl}
                download={tpl.fileName}
                className="block w-full"
                onClick={() => AcademicAlerts.toast(`Downloading ${tpl.fileName}...`, "success")}
              >
                <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 hover:border-teal-500 hover:text-teal-600 transition-colors">
                  <Download className="size-3.5" /> Download Official File ({tpl.fileType})
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
