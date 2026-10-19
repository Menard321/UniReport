import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { RequirementsResolver } from "@/lib/requirements/resolver";
import { getCuratedSuggestions } from "@/data/placement-suggestions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      programmeId = "",
      organization = "",
      department = "",
      duration = "",
      field = "activities",
      roughNotes = "",
      mode = "suggest" // "suggest" | "rewrite"
    } = body;

    // 1. Resolve discipline directives
    const discipline = RequirementsResolver.resolveDisciplineDirectives(programmeId);
    const validField = ["activities", "toolsUsed", "challenges", "keyLearnings"].includes(field)
      ? (field as "activities" | "toolsUsed" | "challenges" | "keyLearnings")
      : "activities";

    // 2. Fetch curated baseline suggestions
    const curatedItems = getCuratedSuggestions(discipline.disciplineId, validField);

    // MODE A: REWRITE ROUGH NOTES
    if (mode === "rewrite" && roughNotes && roughNotes.trim().length > 3) {
      try {
        const rewritePrompt = `You are a university academic supervisor evaluating an Industrial Practical Training / Field Attachment report in Tanzania.
Student Discipline: ${discipline.disciplineId}
Host Enterprise: ${organization || "Host Organization"}
Department: ${department || "Technical Department"}
Field Type: ${validField}

The student wrote these rough informal notes:
"""${roughNotes}"""

Rewrite these rough notes into professional, defense-ready academic prose adhering to official TCU / institutional standards.
Rules:
- Preserve the authentic facts, duties, and tools mentioned by the student.
- Elevate vocabulary to rigorous engineering, clinical, business, or academic nomenclature.
- Return ONLY the rewritten text without conversational commentary or greetings.`;

        const { text } = await generateText({
          model: google("gemini-1.5-flash"),
          system: "You are an expert Tanzanian academic supervisor. Elevate student placement notes into formal academic prose.",
          prompt: rewritePrompt,
          temperature: 0.25,
        });

        return NextResponse.json({
          success: true,
          mode: "rewrite",
          discipline: discipline.disciplineId,
          rewrittenText: text.trim(),
        });
      } catch (aiErr) {
        console.warn("[PLACEMENT_SUGGESTION_AI_FAIL_REWRITE]", aiErr);
        // Fallback: return trimmed rough notes with professional prefix
        return NextResponse.json({
          success: true,
          mode: "rewrite",
          discipline: discipline.disciplineId,
          rewrittenText: roughNotes.trim(),
        });
      }
    }

    // MODE B: SUGGEST DRAFTS (Hybrid: Curated + Optional AI Personalization)
    let aiItems: Array<{ id: string; title: string; detail: string; source: "ai" }> = [];

    if (organization || department) {
      try {
        const suggestionPrompt = `Generate 3 distinct, authentic academic suggestions for a student's Field Attachment / Practical Training report in Tanzania.
Discipline: ${discipline.disciplineId}
Host Firm: ${organization || "Industrial Placement Firm"}
Department: ${department || "Operational Department"}
Duration: ${duration || "8 Weeks"}
Section to populate: ${validField}

Output strictly valid JSON array of 3 objects with keys "title" and "detail".
Example format:
[
  { "title": "Short descriptive title", "detail": "Detailed 1-2 sentence description of duty, instrument, challenge, or learning." }
]`;

        const { text } = await generateText({
          model: google("gemini-1.5-flash"),
          system: "You are an expert Tanzanian university internship coordinator. Generate realistic placement duties.",
          prompt: suggestionPrompt,
          temperature: 0.3,
        });

        const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) {
            aiItems = parsed.map((item, idx) => ({
              id: `ai-${validField}-${idx + 1}`,
              title: item.title || `Suggestion ${idx + 1}`,
              detail: item.detail || "",
              source: "ai" as const,
            }));
          }
        }
      } catch (aiErr) {
        console.warn("[PLACEMENT_SUGGESTION_AI_OPTIONAL_FAIL]", aiErr);
        // Silently continue; curated items are already ready
      }
    }

    const suggestions = [
      ...aiItems,
      ...curatedItems.map((c) => ({
        id: c.id,
        title: c.title,
        detail: c.detail,
        source: "curated" as const,
      })),
    ];

    return NextResponse.json({
      success: true,
      discipline: discipline.disciplineId,
      field: validField,
      suggestions,
    });
  } catch (error) {
    console.error("[PLACEMENT_SUGGESTION_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
