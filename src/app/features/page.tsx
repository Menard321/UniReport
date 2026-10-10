import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2 } from "lucide-react";

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col min-h-screen">
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary dark:text-white mb-6">Powerful Academic Features</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mb-12">
              Everything you need to write and verify rigorous academic reports that meet Tanzanian university standards.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                {
                  title: "Strict Academic Formatting",
                  desc: "Instantly formats margins, spacing, hierarchy, and fonts to match specific guidelines from all Tanzanian universities and higher learning institutions."
                },
                {
                  title: "Live Source Verification",
                  desc: "Integrated with Crossref and OpenAlex to ensure metadata is flawless and DOIs are verifiable before final export."
                },
                {
                  title: "Data Analysis Workspace",
                  desc: "Upload CSVs or qualitative transcriptions to instantly generate descriptive statistics, correlations, and thematic coding charts without touching Python."
                },
                {
                  title: "RAG Evidence Architecture",
                  desc: "We prevent hallucinatory output by strictly limiting the generative AI strictly to information present in your uploaded source materials."
                }
              ].map((ft, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className="size-8 text-teal-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{ft.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{ft.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
