import { BookMarked, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SourcesPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight flex items-center gap-3">
            <BookMarked className="size-8 text-primary" /> Sources & Citation Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize academic references, format APA/Harvard/IEEE citations, and verify source integrity.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" /> Add Citation
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between p-4 border rounded-xl bg-slate-50 dark:bg-slate-800/40">
          <div>
            <h4 className="font-bold text-sm">Mushi, J. K. (2023)</h4>
            <p className="text-xs text-muted-foreground">Digital Transformation in Tanzanian Public Sector Universities. Journal of African Tech, 14(2), 45-62.</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="size-3.5" /> Verified DOI
          </span>
        </div>
      </div>
    </div>
  );
}
