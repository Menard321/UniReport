"use client";

import { useState } from "react";
import { 
  GraduationCap, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  X,
  BookOpen,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UniversityItem {
  id: string;
  name: string;
  shortName: string;
  location: string;
  domain: string;
  campuses: number;
  programmesCount: number;
  status: "VERIFIED" | "PENDING_REVIEW";
  reportTypes: string[];
}

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<UniversityItem[]>([
    {
      id: "u_udsm",
      name: "University of Dar es Salaam",
      shortName: "UDSM",
      location: "Dar es Salaam, Tanzania",
      domain: "udsm.ac.tz",
      campuses: 4,
      programmesCount: 42,
      status: "VERIFIED",
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
      status: "VERIFIED",
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
      status: "VERIFIED",
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
      status: "VERIFIED",
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
      status: "VERIFIED",
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
      status: "VERIFIED",
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
      status: "VERIFIED",
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
      status: "VERIFIED",
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
      status: "VERIFIED",
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
      status: "VERIFIED",
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
      status: "VERIFIED",
      reportTypes: ["Accounting Research Project", "Field Work Report"]
    }
  ]);

  const [search, setSearch] = useState("");
  const [selectedUni, setSelectedUni] = useState<UniversityItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const filtered = universities.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.shortName.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUni) return;
    setUniversities(universities.map(u => u.id === selectedUni.id ? selectedUni : u));
    setIsModalOpen(false);
    setFeedback(`Saved changes for ${selectedUni.shortName}`);
    setTimeout(() => setFeedback(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="size-6 text-teal-400" />
            Universities & Academic Programmes
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Administer verified Tanzanian higher learning institutions, guidelines, and faculty catalogs.
          </p>
        </div>
        <div>
          <Button
            size="sm"
            className="text-xs bg-teal-500 text-slate-950 hover:bg-teal-400 font-semibold"
            onClick={() => {
              const newUni: UniversityItem = {
                id: `u_${Date.now()}`,
                name: "New Higher Learning Institution",
                shortName: "NHLI",
                location: "Tanzania",
                domain: "nhli.ac.tz",
                campuses: 1,
                programmesCount: 5,
                status: "PENDING_REVIEW",
                reportTypes: ["Final Year Project", "Field Training"]
              };
              setUniversities([newUni, ...universities]);
              setSelectedUni(newUni);
              setIsModalOpen(true);
            }}
          >
            <Plus className="size-3.5 mr-1.5" /> Add University
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-xs text-teal-300 flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          {feedback}
        </div>
      )}

      {/* Search & Statistics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <Search className="size-4 text-slate-500 shrink-0 ml-2" />
          <input
            type="text"
            placeholder="Search institution by name, acronym (e.g. UDSM, SUA, DIT), or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between px-4 text-xs">
          <span className="text-slate-400">Total Institutions:</span>
          <span className="font-bold text-white font-mono text-sm">{universities.length}</span>
        </div>
      </div>

      {/* University Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((uni) => (
          <div
            key={uni.id}
            className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-bold font-mono text-xs shadow-inner">
                  {uni.shortName}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono flex items-center gap-1 ${
                  uni.status === "VERIFIED" 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}>
                  {uni.status === "VERIFIED" ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                  {uni.status === "VERIFIED" ? "TCU Verified" : "Pending Review"}
                </span>
              </div>

              <h3 className="font-bold text-white text-sm line-clamp-1">{uni.name}</h3>
              <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                <MapPin className="size-3 text-slate-500 shrink-0" />
                {uni.location}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                <div>Campuses: <span className="text-slate-200 font-bold">{uni.campuses}</span></div>
                <div>Programmes: <span className="text-slate-200 font-bold">{uni.programmesCount}</span></div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {uni.reportTypes.map((rt, i) => (
                  <span key={i} className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800/80">
                    {rt}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <a
                href={`https://${uni.domain}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-teal-400/90 hover:text-teal-300 flex items-center gap-1 font-mono"
              >
                {uni.domain} <ExternalLink className="size-2.5" />
              </a>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setSelectedUni(uni);
                    setIsModalOpen(true);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Edit University"
                >
                  <Edit3 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit University Modal Dialog */}
      {isModalOpen && selectedUni && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="size-4 text-teal-400" /> Edit University Details
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Institution Full Name</label>
                <input
                  type="text"
                  value={selectedUni.name}
                  onChange={(e) => setSelectedUni({ ...selectedUni, name: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Acronym / Short Name</label>
                  <input
                    type="text"
                    value={selectedUni.shortName}
                    onChange={(e) => setSelectedUni({ ...selectedUni, shortName: e.target.value })}
                    className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Official Domain</label>
                  <input
                    type="text"
                    value={selectedUni.domain}
                    onChange={(e) => setSelectedUni({ ...selectedUni, domain: e.target.value })}
                    className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Location</label>
                  <input
                    type="text"
                    value={selectedUni.location}
                    onChange={(e) => setSelectedUni({ ...selectedUni, location: e.target.value })}
                    className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Verification Status</label>
                  <select
                    value={selectedUni.status}
                    onChange={(e) => setSelectedUni({ ...selectedUni, status: e.target.value as any })}
                    className="w-full h-9 px-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="VERIFIED">VERIFIED (TCU Accredited)</option>
                    <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="bg-teal-500 text-slate-950 hover:bg-teal-400 font-semibold"
                >
                  Save University
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
