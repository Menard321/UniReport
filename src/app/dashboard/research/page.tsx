import { Search, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResearchAssistantPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight flex items-center gap-3">
          <Search className="size-8 text-primary" /> AI Academic Research Assistant
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore scholarly literature, extract research gaps, and verify theoretical frameworks.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-4">
        <label className="text-xs font-bold uppercase text-muted-foreground block">Search Academic Literature & Gaps</label>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="E.g., Impact of mobile money on agricultural productivity in Tanzania..."
            className="flex-1 p-3 rounded-xl border text-sm bg-background"
          />
          <Button className="gap-2">
            <Search className="size-4" /> Search Literature
          </Button>
        </div>
      </div>
    </div>
  );
}
