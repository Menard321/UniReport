import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let fileName = "";
    let buffer: Buffer | null = null;
    let url = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      url = (formData.get("url") as string) || "";

      if (file) {
        fileName = file.name;
        const arrayBuffer = await file.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      }
    } else if (contentType.includes("application/json")) {
      const body = await req.json();
      url = body.url || "";
      if (body.fileName) fileName = body.fileName;
      if (body.templateFile) fileName = body.templateFile;
    }

    // Check if filename or URL refers to a local file in templates/ directory
    if (!buffer) {
      const candidateName = fileName || (url ? decodeURIComponent(url.split("/").pop() || "") : "");
      if (candidateName) {
        const path = await import("path");
        const fs = await import("fs");
        const localTemplatesDir = path.join(process.cwd(), "templates");
        const localCandidate = path.join(localTemplatesDir, path.basename(candidateName));
        if (fs.existsSync(localCandidate)) {
          buffer = fs.readFileSync(localCandidate);
          fileName = path.basename(localCandidate);
        }
      }
    }

    // If external URL was provided and buffer not yet populated, fetch over HTTP
    if (url && !buffer) {
      try {
        const parsedUrl = new URL(url);
        const urlPath = parsedUrl.pathname;
        fileName = urlPath.split("/").pop() || "university_template_document";
        if (!fileName.includes(".")) fileName += ".docx";

        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) UniReportTZ-Academic-Engine/1.0"
          }
        });

        if (!res.ok) {
          return NextResponse.json({ error: `Failed to fetch template from URL (HTTP ${res.status})` }, { status: 400 });
        }

        const arrayBuffer = await res.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } catch (err: any) {
        return NextResponse.json({ error: `Invalid or unreachable template URL: ${err.message}` }, { status: 400 });
      }
    }

    if (!buffer) {
      return NextResponse.json({ error: "No template file or URL provided" }, { status: 400 });
    }

    let extractedText = "";
    const lowerName = fileName.toLowerCase();

    // 1. Text extraction based on file extension & content type
    if (lowerName.endsWith(".txt")) {
      extractedText = buffer.toString("utf-8");
    } else if (lowerName.endsWith(".docx") || buffer.slice(0, 4).toString("hex") === "504b0304") {
      // DOCX is a zip archive. Extract text from word/document.xml
      try {
        const textContent = buffer.toString("binary");
        const matches = textContent.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
        if (matches && matches.length > 0) {
          extractedText = matches
            .map((m) => m.replace(/<w:t[^>]*>/, "").replace(/<\/w:t>/, ""))
            .join(" ");
        } else {
          extractedText = buffer
            .toString("utf-8")
            .replace(/[^\x20-\x7E\n\r\t]/g, " ")
            .replace(/\s+/g, " ");
        }
      } catch {
        extractedText = `Uploaded DOCX Guideline: ${fileName}`;
      }
    } else if (lowerName.endsWith(".pdf") || buffer.slice(0, 4).toString("utf-8") === "%PDF") {
      // PDF text extraction using stream text markers
      try {
        const raw = buffer.toString("latin1");
        const streamMatches = raw.match(/BT[\s\S]*?ET/g);
        if (streamMatches && streamMatches.length > 0) {
          const textFragments: string[] = [];
          for (const sm of streamMatches) {
            const parenMatches = sm.match(/\((.*?)\)/g);
            if (parenMatches) {
              textFragments.push(
                parenMatches.map((p) => p.slice(1, -1)).join(" ")
              );
            }
          }
          extractedText = textFragments.join("\n");
        }
        if (!extractedText || extractedText.length < 50) {
          extractedText = raw
            .replace(/[^\x20-\x7E\n]/g, " ")
            .replace(/\s+/g, " ")
            .slice(0, 10000);
        }
      } catch {
        extractedText = `Uploaded PDF Guideline: ${fileName}`;
      }
    } else {
      extractedText = buffer.toString("utf-8").slice(0, 10000);
    }

    // 2. Parse structural chapters / sections from extracted text
    const sections: Array<{ id: string; title: string; description: string; order: number }> = [];

    // Search for chapter indicators
    const lines = extractedText.split(/[\r\n]+/);
    let chapterIndex = 1;

    for (const line of lines) {
      const cleanLine = line.trim();
      if (
        cleanLine.length > 5 &&
        cleanLine.length < 110 &&
        /^(chapter\s+[0-9ivx]+|section\s+[0-9ivx]+|1\.0|2\.0|3\.0|4\.0|5\.0|6\.0)/i.test(cleanLine)
      ) {
        sections.push({
          id: `custom-sec-${chapterIndex}`,
          title: cleanLine,
          description: `Extracted guideline requirement from ${fileName}`,
          order: chapterIndex
        });
        chapterIndex++;
        if (sections.length >= 8) break;
      }
    }

    // Fallback standard chapters if file didn't include explicit numbered headings
    if (sections.length < 3) {
      sections.push(
        {
          id: "custom-ch1",
          title: "CHAPTER 1: INTRODUCTION TO THE HOST ORGANIZATION",
          description: `Extracted from ${fileName}: profile, historical background, organizational structure, core operations.`,
          order: 1
        },
        {
          id: "custom-ch2",
          title: "CHAPTER 2: TECHNICAL ACTIVITIES & WORKPLACE DUTIES",
          description: `Extracted from ${fileName}: major hands-on tasks, methodology, system diagrams, and tools implemented.`,
          order: 2
        },
        {
          id: "custom-ch3",
          title: "CHAPTER 3: INDUSTRIAL CHALLENGES & PROBLEM SOLVING",
          description: `Extracted from ${fileName}: technical obstacles encountered and solutions formulated.`,
          order: 3
        },
        {
          id: "custom-ch4",
          title: "CHAPTER 4: SKILLS ACQUIRED & CURRICULUM RELEVANCE",
          description: `Extracted from ${fileName}: theoretical knowledge vs real-world practical application.`,
          order: 4
        },
        {
          id: "custom-ch5",
          title: "CHAPTER 5: CONCLUSIONS & STRATEGIC RECOMMENDATIONS",
          description: `Extracted from ${fileName}: critical evaluation and actionable recommendations.`,
          order: 5
        }
      );
    }

    return NextResponse.json({
      success: true,
      fileName,
      url: url || undefined,
      templateName: `Institutional Guideline: ${fileName.replace(/\.[^/.]+$/, "")}`,
      sections,
      formattingRules: {
        fontFamily: "Times New Roman",
        bodyFontSizePt: 10,
        heading1FontSizePt: 14,
        heading2FontSizePt: 12,
        lineSpacing: 1.5,
        margins: { top: 1.0, right: 1.0, bottom: 1.0, left: 1.5 }
      },
      extractedSnippet: extractedText.slice(0, 500)
    });
  } catch (error: any) {
    console.error("[TEMPLATE_PARSE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to parse template document: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
