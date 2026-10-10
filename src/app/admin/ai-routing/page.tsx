"use client";

import { useState } from "react";
import { 
  Cpu, 
  Settings2, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  Activity, 
  CheckCircle2, 
  Key, 
  Clock, 
  Sliders,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminAIRoutingPage() {
  const [activeModel, setActiveModel] = useState("gemini-2.0-flash");
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [shieldStrictness, setShieldStrictness] = useState("HIGH");
  const [rateLimitPerMin, setRateLimitPerMin] = useState(60);
  const [feedback, setFeedback] = useState("");

  const models = [
    {
      id: "gemini-2.0-flash",
      name: "Google Gemini 2.0 Flash",
      provider: "Google Cloud",
      tier: "Free & Student Default",
      costPer1kTokens: "$0.0001",
      latency: "380ms",
      status: "Active & Primary",
      recommended: true
    },
    {
      id: "gemini-1.5-pro",
      name: "Google Gemini 1.5 Pro",
      provider: "Google Cloud",
      tier: "Research Pro Tier",
      costPer1kTokens: "$0.00125",
      latency: "850ms",
      status: "Online",
      recommended: false
    },
    {
      id: "claude-3-5-sonnet",
      name: "Anthropic Claude 3.5 Sonnet",
      provider: "Anthropic",
      tier: "Enterprise / Dissertation",
      costPer1kTokens: "$0.0030",
      latency: "920ms",
      status: "Online (Fallback)",
      recommended: false
    },
    {
      id: "gpt-4o",
      name: "OpenAI GPT-4o",
      provider: "OpenAI",
      tier: "Optional Fallback",
      costPer1kTokens: "$0.0025",
      latency: "740ms",
      status: "Configured",
      recommended: false
    }
  ];

  const handleSave = () => {
    setFeedback("AI Routing & Defense configurations persisted to environment runtime.");
    setTimeout(() => setFeedback(""), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <Cpu className="size-6 text-teal-400" />
            AI & LLM Model Routing Configuration
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Manage upstream generative AI engines, prompt injection defenses, and token budgets.
          </p>
        </div>
        <div>
          <Button
            size="sm"
            onClick={handleSave}
            className="text-xs bg-teal-500 text-slate-950 hover:bg-teal-400 font-semibold"
          >
            Save AI Policy
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-xs text-teal-300 flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          {feedback}
        </div>
      )}

      {/* Model Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings2 className="size-4 text-teal-400" /> Primary Generator Model Routing
            </h2>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Auto-Failover Active
            </span>
          </div>

          <div className="space-y-3">
            {models.map((m) => (
              <label
                key={m.id}
                className={`flex items-start justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                  activeModel === m.id
                    ? "border-teal-500/80 bg-teal-500/10 shadow-sm"
                    : "border-slate-800 bg-slate-950/60 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="modelSelection"
                    value={m.id}
                    checked={activeModel === m.id}
                    onChange={(e) => setActiveModel(e.target.value)}
                    className="mt-1 accent-teal-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{m.name}</span>
                      {m.recommended && (
                        <span className="text-[9px] bg-teal-500/20 text-teal-300 font-mono px-1.5 py-0.2 rounded border border-teal-500/30">
                          Recommended
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{m.tier}</span>
                    <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-slate-500">
                      <span>Provider: <strong className="text-slate-400">{m.provider}</strong></span>
                      <span>Latency: <strong className="text-emerald-400">{m.latency}</strong></span>
                      <span>Cost: <strong className="text-slate-400">{m.costPer1kTokens}</strong></span>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Hyperparameters Controls */}
          <div className="pt-4 border-t border-slate-800 space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Creativity / Temperature (Hallucination Control):</span>
                <span className="font-mono text-teal-400 font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-teal-500"
              />
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Low temperature (0.1 - 0.3) strictly forces factuality and citation obedience.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Max Generation Budget (Tokens):</span>
                <span className="font-mono text-teal-400 font-bold">{maxTokens} tokens</span>
              </div>
              <input
                type="range"
                min="1024"
                max="8192"
                step="512"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Security & Shield */}
        <div className="space-y-5">
          {/* Prompt Injection Shield Card */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="size-4 text-teal-400" /> Prompt Injection & Integrity Shield
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Active & Defending
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time deep semantic inspection applied before requests reach the generative models. Blocks jailbreaks, instruction overrides, and fake academic citation forging.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 font-semibold block">Academic Integrity Enforcement</span>
                  <span className="text-[10px] text-slate-500">Requires verified DOI/Crossref source metadata</span>
                </div>
                <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                  ENABLED
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 font-semibold block">Jailbreak & Exploit Defense</span>
                  <span className="text-[10px] text-slate-500">Heuristic filter for roleplay prompt attacks</span>
                </div>
                <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                  STRICT
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 font-semibold block">Per-Scholar Rate Limit</span>
                  <span className="text-[10px] text-slate-500">Protects against automated scraping bots</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-teal-400">
                  <input
                    type="number"
                    value={rateLimitPerMin}
                    onChange={(e) => setRateLimitPerMin(parseInt(e.target.value))}
                    className="w-14 h-7 bg-slate-900 border border-slate-700 rounded px-1.5 text-xs text-right text-white focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">req/min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Masked API Secrets status */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Key className="size-3.5 text-teal-400" /> Configured Provider Credentials
            </h3>
            
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">GOOGLE_GENERATIVE_AI_API_KEY</span>
                <span className="text-emerald-400 text-[11px]">AQ.Ab8RN6*** (Encrypted)</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">ANTHROPIC_API_KEY</span>
                <span className="text-slate-500 text-[11px]">sk-ant-*** (Optional Fallback)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
