"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Search,
  MapPin,
  CheckCircle2,
  FileText,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Building2
} from "lucide-react";

interface UniversityItem {
  id: string;
  name: string;
  shortName: string;
  location: string;
  domain: string;
  campuses: number;
  programmesCount: number;
  reportTypes: string[];
}

const UNIVERSITIES_CATALOG: UniversityItem[] = [
  {
    id: "u_udsm",
    name: "University of Dar es Salaam",
    shortName: "UDSM",
    location: "Dar es Salaam, Tanzania",
    domain: "udsm.ac.tz",
    campuses: 4,
    programmesCount: 42,
    reportTypes: ["Final Year Project (FYP)", "Field Training (IPT)", "Postgraduate Dissertation"]
  },
  {
    id: "u_udom",
    name: "University of Dodoma",
    shortName: "UDOM",
    location: "Dodoma, Tanzania",
    domain: "udom.ac.tz",
    campuses: 6,
    programmesCount: 38,
    reportTypes: ["Final Year Project", "Industrial Attachment", "Masters Thesis"]
  },
  {
    id: "u_sua",
    name: "Sokoine University of Agriculture",
    shortName: "SUA",
    location: "Morogoro, Tanzania",
    domain: "sua.ac.tz",
    campuses: 3,
    programmesCount: 29,
    reportTypes: ["Special Project", "Practical Training (PT)", "Dissertation"]
  },
  {
    id: "u_ardhi",
    name: "Ardhi University",
    shortName: "ARDHI",
    location: "Dar es Salaam, Tanzania",
    domain: "aru.ac.tz",
    campuses: 1,
    programmesCount: 18,
    reportTypes: ["Final Year Dissertation", "Industrial Training (IT)"]
  },
  {
    id: "u_dit",
    name: "Dar es Salaam Institute of Technology",
    shortName: "DIT",
    location: "Dar es Salaam, Tanzania",
    domain: "dit.ac.tz",
    campuses: 2,
    programmesCount: 16,
    reportTypes: ["Final Year Engineering Project", "Industrial Practical Training"]
  },
  {
    id: "u_cbe",
    name: "College of Business Education",
    shortName: "CBE",
    location: "Dar es Salaam & Dodoma",
    domain: "cbe.ac.tz",
    campuses: 4,
    programmesCount: 14,
    reportTypes: ["Business Research Project", "Field Attachment"]
  },
  {
    id: "u_ifm",
    name: "Institute of Finance Management",
    shortName: "IFM",
    location: "Dar es Salaam, Tanzania",
    domain: "ifm.ac.tz",
    campuses: 2,
    programmesCount: 15,
    reportTypes: ["Applied Research Project", "Field Practical Report"]
  },
  {
    id: "u_must",
    name: "Mbeya University of Science and Technology",
    shortName: "MUST",
    location: "Mbeya, Tanzania",
    domain: "must.ac.tz",
    campuses: 2,
    programmesCount: 22,
    reportTypes: ["Final Year Engineering Project", "IPT Report"]
  },
  {
    id: "u_muhas",
    name: "Muhimbili University of Health and Allied Sciences",
    shortName: "MUHAS",
    location: "Dar es Salaam, Tanzania",
    domain: "muhas.ac.tz",
    campuses: 2,
    programmesCount: 24,
    reportTypes: ["Clinical Research Dissertation", "Public Health Field Report"]
  },
  {
    id: "u_nit",
    name: "National Institute of Transport",
    shortName: "NIT",
    location: "Dar es Salaam, Tanzania",
    domain: "nit.ac.tz",
    campuses: 1,
    programmesCount: 12,
    reportTypes: ["Logistics & Engineering Project", "Industrial Training"]
  },
  {
    id: "u_iaa",
    name: "Institute of Accountancy Arusha",
    shortName: "IAA",
    location: "Arusha, Tanzania",
    domain: "iaa.ac.tz",
    campuses: 2,
    programmesCount: 14,
    reportTypes: ["Accounting Research Project", "Field Work Report"]
  }
];

export default function UniversitiesPage() {
  const [search, setSearch] = useState("");

  const filtered = UNIVERSITIES_CATALOG.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.shortName.toLowerCase().includes(search.toLowerCase()) ||
    u.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-20 bg-slate-900 text-white overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:32px_32px]" />
          <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-teal-400 uppercase mb-6">
              <GraduationCap className="size-4" /> HIGHER EDUCATION DIRECTORY
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight mb-4">
              Accredited Tanzanian Universities
            </h1>
            <p className="text-base text-slate-300 max-w-2xl mx-auto mb-8">
              UniReportTZ incorporates tailored report guidelines, margin specifications, and faculty rubrics across all accredited higher learning institutions in Tanzania.
            </p>

            {/* SEARCH INPUT */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-3.5 size-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search university by name, acronym (e.g. UDSM, SUA), or region..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
              />
            </div>
          </div>
        </section>

        {/* STATS BANNER */}
        <section className="border-b bg-white dark:bg-slate-900 py-6 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold font-heading text-teal-600 dark:text-teal-400">100%</div>
              <div className="text-xs text-muted-foreground">TCU Compliance</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-heading text-foreground">30+</div>
              <div className="text-xs text-muted-foreground">Supported Campuses</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-heading text-foreground">250+</div>
              <div className="text-xs text-muted-foreground">Degree Programmes</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-heading text-purple-600 dark:text-purple-400">APA & IEEE</div>
              <div className="text-xs text-muted-foreground">Standard Citation Styles</div>
            </div>
          </div>
        </section>

        {/* UNIVERSITIES DIRECTORY GRID */}
        <section className="py-16 px-4 md:px-6 container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
              <Building2 className="size-5 text-teal-600" /> Participating Institutions ({filtered.length})
            </h2>
            <span className="text-xs text-muted-foreground">All formats calibrated to official 2026 guidelines</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((uni) => (
              <div
                key={uni.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                      {uni.shortName}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="size-3.5" /> Verified
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {uni.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="size-3 text-slate-400" /> {uni.location}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider block">
                      Supported Formats:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {uni.reportTypes.map((rt, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {rt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">{uni.domain}</span>
                  <Link href="/dashboard/tools/field-report">
                    <Button size="sm" variant="outline" className="text-xs gap-1 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/40 group-hover:text-teal-700 dark:group-hover:text-teal-300 border-teal-200 dark:border-teal-900">
                      Build Report <ArrowRight className="size-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="p-12 text-center text-muted-foreground bg-white dark:bg-slate-900 rounded-2xl border">
              <p>No universities found matching "{search}". Try searching by university acronym (e.g. UDSM, UDOM).</p>
            </div>
          )}
        </section>

      </main>
      <Footer />
    </>
  );
}
