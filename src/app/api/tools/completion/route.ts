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

    // Connect to Google Gemini using the Vercel AI SDK
    const { text } = await generateText({
      model: google("gemini-1.5-flash-latest"),
      system: systemPrompt || "You are a professional academic research assistant.",
      prompt: input,
      temperature: 0.2, // Low temperature for academic rigidity
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
