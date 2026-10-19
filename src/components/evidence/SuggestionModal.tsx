"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Check,
  Plus,
  Edit2,
  Trash2,
  Wand2,
  Loader2,
  X,
  FileCheck,
  ShieldCheck,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (text: string) => void;
  field: "activities" | "toolsUsed" | "challenges" | "keyLearnings";
  fieldName: string;
  programmeId: string;
  organization: string;
  department: string;
  duration: string;
  currentValue: string;
}

interface Item {
  id: string;
  title: string;
  detail: string;
  selected: boolean;
  isEditing?: boolean;
  source?: "curated" | "ai" | "user";
}

export function SuggestionModal({
  isOpen,
  onClose,
  onApply,
  field,
  fieldName,
  programmeId,
  organization,
  department,
  duration,
  currentValue
}: SuggestionModalProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "rewrite">("browse");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [discipline, setDiscipline] = useState("");
  
  // Custom item state
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemDetail, setNewItemDetail] = useState("");

  // Rewrite state
  const [roughNotes, setRoughNotes] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenResult, setRewrittenResult] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    async function fetchSuggestions() {
      setLoading(true);
      try {
        const res = await fetch("/api/suggestions/placement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            programmeId,
            organization,
            department,
            duration,
            field,
            mode: "suggest"
          })
        });

        if (res.ok) {
          const data = await res.json();
          setDiscipline(data.discipline || "General");
          if (Array.isArray(data.suggestions)) {
            setItems(
              data.suggestions.map((s: any) => ({
                id: s.id,
                title: s.title,
                detail: s.detail,
                selected: false,
                source: s.source
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to load suggestions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestions();
  }, [isOpen, field, programmeId, organization, department, duration]);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, selected: !it.selected } : it))
    );
  };

  const handleEditChange = (id: string, newDetail: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, detail: newDetail } : it))
    );
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleAddNewItem = () => {
    if (!newItemDetail.trim()) return;
    const item: Item = {
      id: `custom-${Date.now()}`,
      title: newItemTitle.trim() || "My Custom Observation",
      detail: newItemDetail.trim(),
      selected: true,
      source: "user"
    };
    setItems((prev) => [item, ...prev]);
    setNewItemTitle("");
    setNewItemDetail("");
  };

  const handleRewrite = async () => {
    if (!roughNotes.trim()) return;
    setIsRewriting(true);
    try {
      const res = await fetch("/api/suggestions/placement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programmeId,
          organization,
          department,
          duration,
          field,
          roughNotes,
          mode: "rewrite"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setRewrittenResult(data.rewrittenText || roughNotes);
      }
    } catch (err) {
      console.error("Rewrite error:", err);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleApplySelected = () => {
    const selected = items.filter((it) => it.selected);
    if (selected.length === 0) return;

    let formatted = "";
    if (field === "toolsUsed") {
      // Comma-separated list for tools
      const toolNames = selected.map((s) => s.detail).join("; ");
      formatted = currentValue
        ? `${currentValue.trim()}; ${toolNames}`
        : toolNames;
    } else {
      // Numbered list for activities, challenges, learnings
      const newItemsText = selected
        .map((s, idx) => `${s.title}: ${s.detail}`)
        .join("\n\n");
      formatted = currentValue
        ? `${currentValue.trim()}\n\n${newItemsText}`
        : newItemsText;
    }

    onApply(formatted);
    onClose();
  };

  const handleApplyRewrite = () => {
    if (!rewrittenResult.trim()) return;
    const formatted = currentValue
      ? `${currentValue.trim()}\n\n${rewrittenResult.trim()}`
      : rewrittenResult.trim();
    onApply(formatted);
    onClose();
  };

  const selectedCount = items.filter((it) => it.selected).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <Sparkles className="size-4" />
              </span>
              <h2 className="text-lg font-bold font-heading text-foreground">
                Professional Draft: {fieldName}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span>Discipline: <strong className="text-foreground capitalize">{discipline.replace("-", " ")}</strong></span>
              {organization && <span>• Target: <strong className="text-foreground">{organization}</strong></span>}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-5 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab("browse")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "browse"
                ? "border-teal-500 text-teal-600 dark:text-teal-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCheck className="size-3.5" /> Curated & Suggested Items ({items.length})
          </button>
          <button
            onClick={() => setActiveTab("rewrite")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "rewrite"
                ? "border-teal-500 text-teal-600 dark:text-teal-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Wand2 className="size-3.5" /> Polish My Rough Notes
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {activeTab === "browse" && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Select items that match your real attachment duties. You can edit them before inserting.
                </span>
                <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                  {selectedCount} selected
                </span>
              </div>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <Loader2 className="size-6 animate-spin text-teal-500" />
                  <span className="text-xs">Preparing academic suggestions...</span>
                </div>
              ) : items.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No predefined items found. You can add your own custom item below.
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        item.selected
                          ? "border-teal-500 bg-teal-50/40 dark:bg-teal-950/20"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleSelect(item.id)}
                          className="mt-1 size-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-foreground">
                              {item.title}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {item.source === "ai" && (
                                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                                  AI Adapted
                                </span>
                              )}
                              {item.source === "user" && (
                                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                                  My Entry
                                </span>
                              )}
                              {item.source === "curated" && (
                                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                  Standard
                                </span>
                              )}
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-slate-400 hover:text-rose-500 p-0.5 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                          <textarea
                            value={item.detail}
                            onChange={(e) => handleEditChange(item.id, e.target.value)}
                            rows={2}
                            className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-foreground resize-none focus:outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Custom Item Box */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Plus className="size-3.5 text-teal-600" /> Add Custom Activity / Detail
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <input
                    type="text"
                    placeholder="Short Title (optional, e.g. Network Cabling)"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-teal-500"
                  />
                  <textarea
                    placeholder="Describe your specific observation, duty, or equipment..."
                    value={newItemDetail}
                    onChange={(e) => setNewItemDetail(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-teal-500 resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddNewItem}
                    disabled={!newItemDetail.trim()}
                    className="text-xs h-8 gap-1.5"
                  >
                    <Plus className="size-3" /> Add to List
                  </Button>
                </div>
              </div>
            </>
          )}

          {activeTab === "rewrite" && (
            <div className="space-y-4">
              <div className="bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/50 dark:border-teal-900/50 p-3 rounded-xl text-xs text-teal-800 dark:text-teal-300">
                Type rough bullet points or quick notes in English or Swahili. The AI rewrites them strictly into formal, defense-ready academic prose for {fieldName}.
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Your Rough Observations:
                </label>
                <textarea
                  value={roughNotes}
                  onChange={(e) => setRoughNotes(e.target.value)}
                  rows={4}
                  placeholder="e.g. I worked on server room, replaced bad cables, configured router password, helped users with printer errors..."
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <Button
                onClick={handleRewrite}
                disabled={isRewriting || roughNotes.trim().length < 4}
                className="w-full gap-2 text-xs h-9 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
              >
                {isRewriting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Polishing into Academic Prose...
                  </>
                ) : (
                  <>
                    <Wand2 className="size-4" /> Polish into Professional Academic Prose
                  </>
                )}
              </Button>

              {rewrittenResult && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Check className="size-3.5" /> Academic Rewrite Preview:
                  </label>
                  <textarea
                    value={rewrittenResult}
                    onChange={(e) => setRewrittenResult(e.target.value)}
                    rows={5}
                    className="w-full text-xs p-3 rounded-xl bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>

          {activeTab === "browse" ? (
            <Button
              size="sm"
              onClick={handleApplySelected}
              disabled={selectedCount === 0}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs gap-1.5 font-semibold px-4"
            >
              <Check className="size-3.5" />
              Insert Selected ({selectedCount})
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleApplyRewrite}
              disabled={!rewrittenResult.trim()}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs gap-1.5 font-semibold px-4"
            >
              <Check className="size-3.5" />
              Insert Rewritten Text
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
