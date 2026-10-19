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

export interface FYPSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (text: string) => void;
  field: "problemStatement" | "objectives" | "researchQuestions" | "theoreticalFramework" | "methodology";
  fieldName: string;
  title: string;
  programme: string;
  university: string;
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

export function FYPSuggestionModal({
  isOpen,
  onClose,
  onApply,
  field,
  fieldName,
  title,
  programme,
  university,
  currentValue
}: FYPSuggestionModalProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "rewrite">("browse");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  
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
        const res = await fetch("/api/suggestions/fyp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            programme,
            university,
            field,
            mode: "suggest"
          })
        });

        if (res.ok) {
          const data = await res.json();
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
        console.error("Failed to load FYP suggestions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestions();
    setRoughNotes(currentValue || "");
    setRewrittenResult("");
  }, [isOpen, field, title, programme, university, currentValue]);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleEditChange = (id: string, newDetail: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, detail: newDetail } : item
      )
    );
  };

  const toggleEditMode = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddCustomItem = () => {
    if (!newItemDetail.trim()) return;
    const newItem: Item = {
      id: `custom-user-${Date.now()}`,
      title: newItemTitle.trim() || `Point ${items.length + 1}`,
      detail: newItemDetail.trim(),
      selected: true,
      source: "user"
    };
    setItems((prev) => [...prev, newItem]);
    setNewItemTitle("");
    setNewItemDetail("");
  };

  const handleApplySelected = () => {
    const selected = items.filter((i) => i.selected);
    if (selected.length === 0) return;

    let formattedText = "";
    if (field === "objectives") {
      formattedText = selected
        .map((item, idx) => `${idx + 1}. ${item.detail}`)
        .join("\n");
    } else if (field === "researchQuestions") {
      formattedText = selected
        .map((item, idx) => `${idx + 1}. ${item.detail}`)
        .join("\n");
    } else {
      formattedText = selected.map((item) => item.detail).join("\n\n");
    }

    if (currentValue && currentValue.trim().length > 0) {
      onApply(`${currentValue.trim()}\n\n${formattedText}`);
    } else {
      onApply(formattedText);
    }
    onClose();
  };

  const handleRewrite = async () => {
    if (!roughNotes.trim()) return;
    setIsRewriting(true);
    try {
      const res = await fetch("/api/suggestions/fyp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          programme,
          university,
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
      setRewrittenResult(roughNotes);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleApplyRewritten = () => {
    if (!rewrittenResult.trim()) return;
    onApply(rewrittenResult.trim());
    onClose();
  };

  const selectedCount = items.filter((i) => i.selected).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="p-5 border-b flex items-start justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                <Sparkles className="size-4" />
              </span>
              <h3 className="font-bold text-base text-foreground font-heading">
                Professional Research Drafts: {fieldName}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-purple-600" />
              Calibrated for <strong>{programme || "Your Programme"}</strong> at <strong>{university || "Your University"}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* TAB SWITCHER */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800/70 border-b text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("browse")}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === "browse"
                ? "bg-white dark:bg-slate-700 shadow-sm text-purple-700 dark:text-purple-300 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCheck className="size-3.5" />
            Browse & Customize Drafts ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rewrite")}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === "rewrite"
                ? "bg-white dark:bg-slate-700 shadow-sm text-purple-700 dark:text-purple-300 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Wand2 className="size-3.5" />
            Polish Rough Notes into Academic Prose
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === "browse" ? (
            <>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <HelpCircle className="size-3.5 text-purple-600" />
                  Select the items that match your dissertation, or edit them before applying:
                </span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {selectedCount} selected
                </span>
              </div>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                  <Loader2 className="size-6 animate-spin text-purple-600" />
                  <p className="text-xs text-muted-foreground">
                    Generating academic drafts calibrated to your dissertation title...
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        item.selected
                          ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 ring-1 ring-purple-500/30"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleSelect(item.id)}
                          className="mt-1 size-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-foreground">
                              {item.title}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => toggleEditMode(item.id)}
                                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Edit this suggestion"
                              >
                                <Edit2 className="size-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                                title="Remove"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                          </div>

                          {item.isEditing ? (
                            <div className="mt-2 space-y-1.5">
                              <textarea
                                rows={2}
                                value={item.detail}
                                onChange={(e) => handleEditChange(item.id, e.target.value)}
                                className="w-full p-2 text-xs rounded-lg border bg-background font-mono focus:outline-purple-600"
                              />
                              <button
                                type="button"
                                onClick={() => toggleEditMode(item.id)}
                                className="text-[11px] font-bold text-purple-600 hover:underline"
                              >
                                Save edit
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {item.detail}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* ADD CUSTOM POINT */}
                  <div className="p-3 border border-dashed rounded-xl space-y-2 bg-slate-50/50 dark:bg-slate-800/30">
                    <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                      <Plus className="size-3.5 text-purple-600" /> Add Your Own Custom Draft Point
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Point Heading"
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
                        className="p-2 rounded-lg border text-xs bg-background"
                      />
                      <input
                        type="text"
                        placeholder="Specific description or metric"
                        value={newItemDetail}
                        onChange={(e) => setNewItemDetail(e.target.value)}
                        className="col-span-2 p-2 rounded-lg border text-xs bg-background"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleAddCustomItem}
                        disabled={!newItemDetail.trim()}
                        className="text-xs gap-1 h-8"
                      >
                        <Plus className="size-3.5" /> Add & Select
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* REWRITE TAB */
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
                  Paste Rough Notes, Bullets, or Swahili Draft
                </label>
                <textarea
                  rows={4}
                  value={roughNotes}
                  onChange={(e) => setRoughNotes(e.target.value)}
                  placeholder="e.g. system inafanya triage ya wagonjwa emergency room, inachukua pulse na oxygen kwa sensor halafu inatuma kwa daktari haraka..."
                  className="w-full p-3 rounded-lg border text-xs bg-background resize-none focus:outline-purple-600 leading-relaxed font-mono"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Type your notes casually. The engine will preserve your exact facts while elevating phrasing to official Tanzanian university academic standards.
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleRewrite}
                  disabled={isRewriting || !roughNotes.trim()}
                  className="text-xs gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isRewriting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> Polishing Notes...
                    </>
                  ) : (
                    <>
                      <Wand2 className="size-3.5" /> Transform to Academic Prose
                    </>
                  )}
                </Button>
              </div>

              {rewrittenResult && (
                <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                      <Check className="size-3.5 text-purple-600" /> Polished Academic Draft:
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={rewrittenResult}
                    onChange={(e) => setRewrittenResult(e.target.value)}
                    className="w-full p-2.5 rounded-lg border text-xs bg-background leading-relaxed"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleApplyRewritten}
                      className="text-xs gap-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Check className="size-3.5" /> Apply Polished Text to Field
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>

          {activeTab === "browse" && (
            <Button
              size="sm"
              onClick={handleApplySelected}
              disabled={selectedCount === 0}
              className="text-xs gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Check className="size-3.5" />
              Apply {selectedCount} Selected {selectedCount === 1 ? "Item" : "Items"}
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
