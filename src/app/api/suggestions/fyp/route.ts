import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { RequirementsResolver } from "@/lib/requirements/resolver";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title = "",
      programme = "",
      university = "",
      field = "objectives",
      roughNotes = "",
      mode = "suggest", // "suggest" | "rewrite"
    } = body;

    const discipline = RequirementsResolver.resolveDisciplineDirectives(programme);

    // MODE A: REWRITE ROUGH DRAFT
    if (mode === "rewrite" && roughNotes && roughNotes.trim().length > 3) {
      try {
        const prompt = `You are a university academic dissertation supervisor in Tanzania.
Degree Programme: ${programme || "Undergraduate / Postgraduate Degree"}
University: ${university || "Tanzanian University"}
Dissertation Title: ${title || "Undergraduate / Postgraduate Final Year Project"}
Target Field: ${field}

The student wrote these rough informal notes or outline:
"""${roughNotes}"""

Rewrite these rough notes into rigorous, publication-grade academic language suitable for an official Final Year Project / Dissertation in Tanzania.
Adhere strictly to TCU / university guidelines. Preserve the core problem and idea, but elevate tone and clarity.
Return ONLY the rewritten prose without conversational comments or greetings.`;

        const { text } = await generateText({
          model: google("gemini-1.5-flash"),
          system: "You are an expert Tanzanian academic dissertation supervisor. Elevate rough research notes into formal academic prose.",
          prompt,
          temperature: 0.25,
        });

        return NextResponse.json({
          success: true,
          mode: "rewrite",
          rewrittenText: text.trim(),
        });
      } catch (err) {
        return NextResponse.json({
          success: true,
          mode: "rewrite",
          rewrittenText: roughNotes.trim(),
        });
      }
    }

    // MODE B: SUGGEST RESEARCH CORE DRAFTS
    let suggestions: Array<{ id: string; title: string; detail: string; source: "ai" | "curated" }> = [];

    try {
      const prompt = `You are a senior university dissertation coordinator in Tanzania.
Given:
Dissertation Title: "${title || "Undergraduate Research Project"}"
Degree Programme: "${programme || "Degree Programme"}"
University: "${university || "Tanzanian Institution"}"
Target Field: "${field}" (Options: problemStatement, objectives, researchQuestions, theoreticalFramework, methodology)

Generate 4 realistic, high-quality, academic options or draft points that directly address this research project for this field.
Return strictly a valid JSON array of objects with keys "title" and "detail".
Example:
[
  { "title": "Primary Objective", "detail": "To investigate the performance impact of..." },
  { "title": "Secondary Objective", "detail": "To evaluate user adoption latency across..." }
]
Do NOT return markdown formatting or backticks.`;

      const { text } = await generateText({
        model: google("gemini-1.5-flash"),
        system: "Generate academic dissertation draft points in strict JSON array format.",
        prompt,
        temperature: 0.3,
      });

      const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        suggestions = parsed.map((item, idx) => ({
          id: `fyp-sug-${idx}`,
          title: item.title || `Item ${idx + 1}`,
          detail: item.detail || "",
          source: "ai",
        }));
      }
    } catch (err) {
      // Curated fallbacks based on field
      if (field === "objectives") {
        suggestions = [
          { id: "obj-1", title: "Empirical Baseline Assessment", detail: "To systematically investigate existing workflow bottlenecks, system inefficiencies, and operational constraints within the target setting.", source: "curated" },
          { id: "obj-2", title: "Architecture Design & Modeling", detail: "To architect and formulate a robust, context-appropriate conceptual model and technical framework addressing identified gaps.", source: "curated" },
          { id: "obj-3", title: "System Implementation / Prototyping", detail: "To develop and deploy a high-fidelity prototype / experimental pipeline integrating key hardware, software, or analytical modules.", source: "curated" },
          { id: "obj-4", title: "Empirical Validation & Evaluation", detail: "To evaluate performance, accuracy, latency, and stakeholder acceptance using standardized benchmarking metrics and statistical analysis.", source: "curated" },
        ];
      } else if (field === "problemStatement") {
        suggestions = [
          { id: "prob-1", title: "Operational Inefficiency & Manual Latency", detail: "Traditional manual protocols within the sector suffer from severe latency, error rates, and vulnerability to data loss, hindering timely decision-making.", source: "curated" },
          { id: "prob-2", title: "Lack of Context-Aware Digital Infrastructure", detail: "Existing commercial solutions fail to accommodate localized infrastructural constraints such as intermittent connectivity, high licensing costs, and low power envelopes.", source: "curated" },
        ];
      } else if (field === "researchQuestions") {
        suggestions = [
          { id: "rq-1", title: "Baseline Performance Diagnostic", detail: "What are the primary operational failure points in the current workflow?", source: "curated" },
          { id: "rq-2", title: "Systemic Efficacy & Latency", detail: "To what extent does the proposed automated architecture reduce processing latency and throughput bottlenecks?", source: "curated" },
        ];
      } else if (field === "theoreticalFramework") {
        suggestions = [
          { id: "tf-1", title: "Technology Acceptance & Usability", detail: "Technology Acceptance Model (TAM) and Unified Theory of Acceptance and Use of Technology (UTAUT) to assess user adoption and perceived utility.", source: "curated" },
          { id: "tf-2", title: "Systems Theory & Process Optimization", detail: "General Systems Theory combined with Queuing Theory (M/M/c models) to analyze operational flow and resource allocation.", source: "curated" },
        ];
      } else {
        suggestions = [
          { id: "meth-1", title: "Applied Quantitative & Experimental Design", detail: "Quasi-experimental research methodology utilizing iterative prototyping, component bench-testing, and field empirical verification.", source: "curated" },
          { id: "meth-2", title: "Modular Architecture & Tech Stack", detail: "Scalable client-server architecture utilizing microservices, secure REST/MQTT communication protocols, and relational database persistence.", source: "curated" },
        ];
      }
    }

    return NextResponse.json({
      success: true,
      discipline: discipline.disciplineId,
      field,
      suggestions,
    });
  } catch (error) {
    console.error("[FYP_SUGGESTIONS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate FYP suggestions" },
      { status: 500 }
    );
  }
}
