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

    // 2. Parse structural chapters, subsections, and preliminary pages from extracted text
    const sections: Array<{
      id: string;
      number: string;
      title: string;
      description: string;
      order: number;
      subsections?: string[];
    }> = [];

    const lines = extractedText.split(/[\r\n]+/).map((l) => l.trim()).filter(Boolean);
    const wordToNum: Record<string, string> = {
      ONE: "1", TWO: "2", THREE: "3", FOUR: "4", FIVE: "5",
      SIX: "6", SEVEN: "7", EIGHT: "8",
      KWANZA: "1", PILI: "2", TATU: "3", NNE: "4", TANO: "5", SITA: "6", SABA: "7", NANE: "8",
      I: "1", II: "2", III: "3", IV: "4", V: "5", VI: "6", VII: "7", VIII: "8"
    };

    let currentSection: {
      id: string;
      number: string;
      title: string;
      description: string;
      order: number;
      subsections: string[];
    } | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Chapter match regex (supports CHAPTER 1, SURA YA KWANZA, SECTION 1, 1.0 TITLE)
      const chMatch =
        line.match(/^(?:#\s*)?(?:CHAPTER|SURA\s+YA|SECTION)\s+([0-9]+|[A-Z]+)[:\s]*(.*)$/i) ||
        line.match(/^([1-8])\.0\s+(.*)$/i);

      if (chMatch) {
        const rawNum = chMatch[1].toUpperCase();
        const chNum = wordToNum[rawNum] || rawNum;
        let titlePart = (chMatch[2] || "").trim();

        // If title is empty or just chapter number, look ahead to next line for subtitle
        if (!titlePart || titlePart.length < 3) {
          if (i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            if (
              nextLine.length > 3 &&
              nextLine.length < 110 &&
              !/^(?:CHAPTER|SURA|SECTION|[0-9]+\.[0-9]+)/i.test(nextLine)
            ) {
              titlePart = nextLine;
              i++; // consume next line
            }
          }
        }

        const cleanTitle = titlePart ? `Chapter ${chNum}: ${titlePart}` : `Chapter ${chNum}`;

        if (currentSection) {
          sections.push(currentSection);
        }

        currentSection = {
          id: `custom-ch${chNum}`,
          number: `CHAPTER ${chNum}`,
          title: cleanTitle,
          description: `Extracted guideline requirements from ${fileName} for Chapter ${chNum}`,
          order: parseInt(chNum, 10) || (sections.length + 1),
          subsections: []
        };
        continue;
      }

      // Subsection match (e.g. 1.1 Profile, 1.2 Mission, 2.1.1 Routine)
      if (currentSection) {
        const subMatch = line.match(/^([0-9]+\.[0-9]+(?:\.[0-9]+)?)\s+([A-Za-z0-9 &,'\(\)\/\-]+)$/);
        if (subMatch && subMatch[2].length > 3 && subMatch[2].length < 120) {
          currentSection.subsections.push(`${subMatch[1]} ${subMatch[2].trim()}`);
        }
      }
    }

    if (currentSection) {
      sections.push(currentSection);
    }

    // Detect Preliminary Pages in the document
    const fullTextUpper = extractedText.toUpperCase();
    const detectedPrelims = {
      includeDeclaration: /DECLARATION|TAMKO/i.test(fullTextUpper),
      includeDedication: /DEDICATION|WAKFU/i.test(fullTextUpper),
      includeAcknowledgement: /ACKNOWLEDGEMENT|SHUKRANI/i.test(fullTextUpper),
      includeAbstract: /ABSTRACT/i.test(fullTextUpper),
      includeExecutiveSummary: /EXECUTIVE SUMMARY|MUHTASARI/i.test(fullTextUpper),
      includeTableOfContents: true,
      includeListOfAbbreviations: /ABBREVIATION|VIFUPISHO/i.test(fullTextUpper),
      includeListOfTables: /LIST OF TABLES|JEDWALI/i.test(fullTextUpper),
      includeListOfFigures: /LIST OF FIGURES|MICHORO|FIGURES/i.test(fullTextUpper)
    };

    // Fallback standard chapters if file didn't include explicit numbered headings
    const isStandardFallback = sections.length < 3;
    if (isStandardFallback) {
      sections.length = 0; // Clear partial matches
      sections.push(
        {
          id: "custom-ch1",
          number: "CHAPTER 1",
          title: "Chapter 1: Organization Overview & Placement Mandate",
          description: `Extracted from ${fileName}: profile, historical background, organizational structure, core operations.`,
          order: 1,
          subsections: [
            "1.1 Profile and Background of Host Organization",
            "1.2 Vision, Mission and Core Functions",
            "1.3 Organizational Governance & Administrative Structure",
            "1.4 Department Profile and Functional Mandate",
            "1.5 Professional Ethics and Workplace Health & Safety Regulations"
          ]
        },
        {
          id: "custom-ch2",
          number: "CHAPTER 2",
          title: "Chapter 2: Technical Duties & Fieldwork Implementation",
          description: `Extracted from ${fileName}: major hands-on tasks, methodology, system diagrams, and tools implemented.`,
          order: 2,
          subsections: [
            "2.1 Departmental Attachment Routine and Standard Operating Procedures",
            "2.2 Major Technical Assignments and Engineering Duties Executed",
            "2.3 Technical Equipment, Software Stacks, and Calibration Tools Handled",
            "2.4 Comparative Technical & Methodological Evaluation Matrix"
          ]
        },
        {
          id: "custom-ch3",
          number: "CHAPTER 3",
          title: "Chapter 3: Industrial Challenges & Problem Solving",
          description: `Extracted from ${fileName}: technical obstacles encountered and solutions formulated.`,
          order: 3,
          subsections: [
            "3.1 Identification and Root Cause Analysis of Industrial Challenges",
            "3.2 Practical Mitigation Strategies Implemented during Attachment"
          ]
        },
        {
          id: "custom-ch4",
          number: "CHAPTER 4",
          title: "Chapter 4: Skills Acquired & Curriculum Relevance",
          description: `Extracted from ${fileName}: theoretical knowledge vs real-world practical application.`,
          order: 4,
          subsections: [
            "4.1 New Practical Skills and Technical Competencies Developed",
            "4.2 Professional and Interpersonal Working Competencies",
            "4.3 Connecting Industrial Fieldwork with University Academic Curriculum"
          ]
        },
        {
          id: "custom-ch5",
          number: "CHAPTER 5",
          title: "Chapter 5: Conclusions & Actionable Recommendations",
          description: `Extracted from ${fileName}: critical evaluation and actionable recommendations.`,
          order: 5,
          subsections: [
            "5.1 Comprehensive Practical Training Conclusion",
            "5.2 Strategic Recommendations to the Host Enterprise",
            "5.3 Actionable Recommendations to the University Academic Board"
          ]
        }
      );
    }

    return NextResponse.json({
      success: true,
      fileName,
      url: url || undefined,
      templateName: `Institutional Guideline: ${fileName.replace(/\.[^/.]+$/, "")}`,
      sections,
      preliminaries: detectedPrelims,
      confidence: isStandardFallback ? "low" : "high",
      isStandardFallback,
      warningMessage: isStandardFallback
        ? "Could not detect explicit chapter headings (e.g., 'Chapter 1', '1.0'). Standard TCU inter-university fieldwork chapters have been provided. You can customize them in Step 4."
        : undefined,
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
