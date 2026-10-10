"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, Copy, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOOLS } from "@/lib/tools-config";

export default function ToolPage() {
  const params = useParams();
  const toolId = params.toolId as string;
  const tool = TOOLS.find(t => t.id === toolId);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Tool Not Found</h2>
        <Link href="/dashboard/tools">
          <Button variant="outline">
            <ArrowLeft className="size-4 mr-2" /> Back to Toolkit
          </Button>
        </Link>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    setOutput("");

    try {
      // Mocking an AI stream response
      const response = await fetch("/api/tools/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, systemPrompt: tool.systemPrompt, input })
      });
      
      const data = await response.json();
      
      // Simulate typing effect for the mock response
      const text = data.result || "No response received.";
      for (let i = 0; i <= text.length; i++) {
        setOutput(text.slice(0, i));
        await new Promise(r => setTimeout(r, 10)); // 10ms per char
      }

      // Persist to database physically
      if (text.length > 30) {
        await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `${tool.title} Output`,
            content: text,
            toolType: toolId
          })
        });
      }

    } catch (e) {
      setOutput("Error generating response. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!output) return;
    
    // Create an MS Word compatible HTML blob
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
                   "xmlns:w='urn:schemas-microsoft-com:office:word' " +
                   "xmlns='http://www.w3.org/TR/REC-html40'>" +
                   "<head><meta charset='utf-8'><title>Export Document</title></head><body>";
    const footer = "</body></html>";
    // Convert newlines to HTML breaks for proper formatting
    const htmlContent = header + (output.replace(/\n/g, "<br>")) + footer;
    
    const blob = new Blob(['\ufeff', htmlContent], {
        type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tool.id}-generation-${new Date().getTime()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 border-b pb-4">
        <Link href="/dashboard/tools">
          <Button variant="ghost" size="icon" className="shrink-0 rounded-full">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${tool.color}`}>
          <tool.icon className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{tool.title}</h1>
          <p className="text-sm text-muted-foreground">{tool.description}</p>
        </div>
      </div>

      {/* Split Pane Workspace */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Side: Input Configuration */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 min-h-0 bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <span className="font-semibold text-sm">Provide Context</span>
          </div>
          <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
            <div className="text-sm font-medium">What should the assistant know?</div>
            <textarea
              className="flex-1 w-full p-4 rounded-lg border bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              placeholder={tool.placeholders.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-lg text-sm text-amber-800 dark:text-amber-400">
              <span className="font-bold flex items-center gap-2 mb-2"><Sparkles className="size-4" /> Pro Tip:</span>
              {tool.placeholders.context}
            </div>
          </div>
          <div className="p-4 border-t bg-slate-50 dark:bg-slate-800/50">
            <Button 
              className="w-full h-12 shadow-md gap-2" 
              onClick={handleGenerate}
              disabled={isGenerating || !input.trim()}
            >
              {isGenerating ? <RefreshCw className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
              {isGenerating ? "Generating..." : "Generate Output"}
            </Button>
          </div>
        </div>

        {/* Right Side: Output Viewer */}
        <div className="w-full lg:w-1/2 flex flex-col h-full bg-slate-50 border dark:bg-slate-900/50 rounded-xl overflow-hidden shadow-sm">
           <div className="p-4 border-b flex justify-between items-center bg-white dark:bg-slate-900">
            <span className="font-semibold text-sm flex items-center gap-2">
              Output Generation
              {isGenerating && <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-2" disabled={!output} onClick={() => navigator.clipboard.writeText(output)}>
                <Copy className="size-4" /> Copy
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-2" disabled={!output} onClick={handleExport}>
                <Download className="size-4" /> Export
              </Button>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-y-auto whitespace-pre-wrap font-serif text-slate-800 dark:text-slate-200 leading-relaxed">
            {output ? output : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 gap-4">
                <tool.icon className="size-16 stroke-[1px]" />
                <p>Awaiting input...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
