import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolId, systemPrompt, input } = body;

    if (!toolId || !input) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // MILSTONE D: Security & Data Protection - Prompt Injection Filtering
    const maliciousPatterns = ["ignore all previous instructions", "system prompt", "jailbreak", "bypass"];
    const isMalicious = maliciousPatterns.some(pattern => input.toLowerCase().includes(pattern));
    
    if (isMalicious) {
      console.warn(`[SECURITY ALERT] Prompt injection attempt mitigated. Input: ${input}`);
      return NextResponse.json({ 
        error: "SECURITY_VIOLATION", 
        message: "Your input triggered our safety filters. Please revise your prompt to adhere to academic guidelines." 
      }, { status: 403 });
    }

    // Domain-Specific System Instructions
    let resolvedSystemPrompt = systemPrompt;
    if (toolId === "topic-assistant") {
      resolvedSystemPrompt = `You are a senior Tanzanian University Academic Advisor and Research Coordinator aligned with TCU regulations.
Your mission is to generate 3 to 4 defense-ready, publication-grade academic research topic proposals for the student.

STRICT FORMATTING REQUIREMENTS:
Present each proposal with clear, consistent markdown headings:
### Option 1: [Formal Publication Title]
- **Statement of the Problem**: (Detailed 2-paragraph context grounded in realistic Tanzanian/East African challenges).
- **Aim and Specific Objectives**:
  - Main Aim: [Comprehensive research aim]
  - 1. [Specific measurable objective]
  - 2. [Specific measurable objective]
  - 3. [Specific measurable objective]
- **Feasibility & Tech Stack**: (Expected data sources, software/hardware tools, and feasibility for a single academic year).
- **Academic & Industry Contribution**: (Practical societal impact and theoretical contribution).

Ensure proposals are rigorous, novel, achievable, and free from superficial AI clichés.`;
    } else if (toolId === "lit-review") {
      resolvedSystemPrompt = `You are an authoritative academic research evaluator. Construct a rigorous thematic literature review synthesis for Chapter 2 adhering to university dissertation guidelines.

STRICT ACADEMIC REQUIREMENTS:
1. Do NOT write a simple chronological summary. Group literature into thematic, conceptual dialogues.
2. Structure output under formal numbered headings:
   - 2.1 Conceptual Foundations & Key Variables
   - 2.2 Theoretical Framework & Scholarly Models
   - 2.3 Thematic Empirical Literature Critique (contrasting local and international findings)
   - 2.4 Identified Research Gap (Pengo la Utafiti - explicitly state what prior studies lacked)
   - 2.5 Conceptual Framework Summary Matrix (tabulated in Markdown)
3. Ensure in-text academic citations adhering to the requested citation standard (APA 7th or IEEE).
4. Write exhaustive, scholarly prose with analytical depth.`;
    } else if (toolId === "methodology") {
      resolvedSystemPrompt = `You are an expert research methodologist and thesis defense assessor. Architect an exhaustive, defense-ready Chapter 3 methodology.

STRICT METHODOLOGICAL REQUIREMENTS:
1. Research Philosophy & Design: State and academically justify the chosen research design (citing methodology authorities such as Kothari, Creswell, or Saunders).
2. Population & Sampling: Detail target population, sampling technique, and write the explicit sample size calculation formula (e.g. Yamane's formula: n = N / [1 + N(e)^2] or Cochran's formula) with sample numbers.
3. Instruments & Reliability: Detail instrument design, pilot testing procedures, and Cronbach's Alpha reliability thresholds.
4. Data Analysis Plan: Detail descriptive/inferential statistical tests or technical system evaluation benchmarks.
5. Research Ethics & Compliance: Detail COSTECH clearance, university ethical approvals, and participant confidentiality protocols.`;
    }

    // Connect to Google Gemini using the Vercel AI SDK
    const { text } = await generateText({
      model: google("gemini-1.5-flash-latest"),
      system: resolvedSystemPrompt || "You are a professional academic research assistant.",
      prompt: input,
      temperature: 0.25, // Academic rigor
    });

    return NextResponse.json({ 
      success: true, 
      result: text 
    });

  } catch (error) {
    console.error("Tools API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
