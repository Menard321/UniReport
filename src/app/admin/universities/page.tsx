"use client";

import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ExternalLink, 
  Trash2, 
  X,
  RefreshCw,
  Loader2,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveUniversity {
  id: string;
  name: string;
  shortName: string;
  location: string;
  domain: string | null;
  campuses: number;
  programmesCount: number;
  status: "VERIFIED" | "PENDING_REVIEW";
  reportTypes: string[];
}

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<LiveUniversity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  // New University Form State
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [location, setLocation] = useState("");
  const [domain, setDomain] = useState("");
  const [campuses, setCampuses] = useState(1);
  const [programmesCount, setProgrammesCount] = useState(10);
  const [saving, setSaving] = useState(false);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/universities");
      if (res.ok) {
        const data = await res.json();
        setUniversities(data.universities || []);
      }
    } catch (err) {
      console.error("Failed to load universities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const handleCreateUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !shortName || !location) return;

    try {
      setSaving(true);
      const res = await fetch("/api/admin/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          shortName,
          location,
          domain,
          campuses,
          programmesCount,
          reportTypes: ["Final Year Project (FYP)", "Industrial Practical Training (IPT)"]
        })
      });

      if (res.ok) {
        setFeedback(`Institution ${shortName} added to database.`);
        setIsAddModalOpen(false);
        setName("");
        setShortName("");
        setLocation("");
        setDomain("");
        fetchUniversities();
        setTimeout(() => setFeedback(""), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUniversity = async (id: string, uniShort: string) => {
    if (!confirm(`Are you sure you want to remove ${uniShort}?`)) return;

    try {
      const res = await fetch(`/api/admin/universities?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setUniversities(prev => prev.filter(u => u.id !== id));
        setFeedback(`Removed institution ${uniShort}.`);
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = universities.filter(u => {
    const term = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.shortName.toLowerCase().includes(term) ||
      u.location.toLowerCase().includes(term) ||
      (u.domain || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">Accredited Tanzanian Universities</h1>
          <p className="text-slate-400 text-sm mt-1">
            Official institutional directory governing report templates and formatting compliance across Tanzania.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchUniversities} 
            variant="outline" 
            size="sm" 
            className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Catalog
          </Button>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            size="sm" 
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold shadow-sm"
          >
            <Plus className="size-4 mr-1.5" /> Add University
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="bg-teal-500/10 border border-teal-500/20 text-teal-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          {feedback}
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Total Accredited Universities</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-heading">{universities.length}</span>
            <span className="text-xs font-mono text-teal-400">TCU Catalog</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Total Campuses Mapped</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-teal-400 font-heading">
              {universities.reduce((acc, u) => acc + u.campuses, 0)}
            </span>
            <span className="text-xs font-mono text-teal-400/80">Regional Hubs</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Programmes Covered</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400 font-heading">
              {universities.reduce((acc, u) => acc + u.programmesCount, 0)}
            </span>
            <span className="text-xs font-mono text-emerald-400/80">Degree Tracks</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-900/70 p-4 border border-slate-800/80 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search university by name, acronym, location..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>
      </div>

      {/* University Grid Cards */}
      {loading ? (
        <div className="p-16 text-center text-slate-400">
          <Loader2 className="size-8 text-teal-400 animate-spin mx-auto mb-3" />
          <p className="text-sm">Fetching university catalog from PostgreSQL...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-slate-900/90 border border-slate-800/80 rounded-xl">
          <GraduationCap className="size-12 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-300">No universities found</p>
          <p className="text-xs text-slate-500 mt-1">Add your first institution using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((u) => (
            <div key={u.id} className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {u.shortName}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {u.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeleteUniversity(u.id, u.shortName)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                <h3 className="font-bold text-sm text-white mt-3 line-clamp-1">{u.name}</h3>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="size-3 text-slate-500" />
                  <span>{u.location}</span>
                </div>

                {u.domain && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-mono">
                    <ExternalLink className="size-3" />
                    <span>{u.domain}</span>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Campuses: <strong className="text-slate-200">{u.campuses}</strong></span>
                  <span>Programmes: <strong className="text-slate-200">{u.programmesCount}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add University Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <h3 className="font-semibold text-sm text-white">Add Accredited University</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUniversity} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Institution Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. State University of Zanzibar" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Acronym</label>
                  <input 
                    type="text" 
                    required
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    placeholder="e.g. SUZA" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Domain</label>
                  <input 
                    type="text" 
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g. suza.ac.tz" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Location / City</label>
                <input 
                  type="text" 
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Zanzibar, Tanzania" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Campuses</label>
                  <input 
                    type="number" 
                    min={1}
                    value={campuses}
                    onChange={(e) => setCampuses(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Programmes Count</label>
                  <input 
                    type="number" 
                    min={1}
                    value={programmesCount}
                    onChange={(e) => setProgrammesCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-800 -mx-5 -mb-5 bg-slate-950/40 flex justify-end gap-3 mt-6">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" disabled={saving} className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold">
                  {saving ? "Saving..." : "Add to Database"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
