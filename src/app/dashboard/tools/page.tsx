import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOOLS } from "@/lib/tools-config";

export default function AcademicToolsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Academic Tools</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          Leverage our suite of 11 specialized AI assistants designed to tackle every phase of your university research journey—from topic ideation and fieldwork reports to your final year project defense.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map((tool) => (
          <div key={tool.id} className="flex flex-col group rounded-xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all overflow-hidden relative">
            <div className="p-6 flex-1 flex flex-col">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${tool.color}`}>
                <tool.icon className="size-6" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{tool.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">{tool.description}</p>
              
              <div className="mt-auto">
                <Link href={`/dashboard/tools/${tool.id}`}>
                  <Button variant="outline" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                    Launch Assistant
                    <ArrowRight className="size-4 opacity-70" />
                  </Button>
                </Link>
              </div>
            </div>
            {/* Subtle top border accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400/0 via-teal-400/0 to-teal-400/0 group-hover:from-teal-400/50 group-hover:via-teal-500 group-hover:to-teal-600/50 transition-all"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
