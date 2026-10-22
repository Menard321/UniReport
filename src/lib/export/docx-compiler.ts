import { TANZANIA_ACADEMIC_CATALOG } from "@/data/tanzania-academic-catalog";

export interface DocxFormattingRules {
  font?: {
    family?: string;
    body_size?: number;
    heading_1_size?: number;
    heading_2_size?: number;
  };
  spacing?: {
    line_spacing?: number;
    paragraph_after?: number;
  };
  margins?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    unit?: string;
  };
  numbering?: {
    preliminaries?: string;
    body?: string;
  };
  citation?: string;
}

export interface DocxExportOptions {
  title: string;
  institution: string;
  faculty?: string;
  programme?: string;
  studentName?: string;
  registrationNumber?: string;
  yearOfStudy?: string;
  organization?: string;
  supervisorName?: string;
  academicYear?: string;
  content: string;
  templateName?: string;
  formattingRules?: DocxFormattingRules;
  department?: string;
  fieldSupervisor?: string;
  universitySupervisor?: string;
  attachmentPeriod?: string;
  submissionDate?: string;
  discipline?: string;
  institutionShortName?: string;
  logoUrl?: string;
  reportType?: string;
}

/**
 * Universal logo resolver for all Tanzanian universities and institutes
 */
export function resolveInstitutionLogo(institution?: string, shortName?: string, explicitLogoUrl?: string): string | null {
  if (explicitLogoUrl && explicitLogoUrl.trim()) {
    return explicitLogoUrl.trim();
  }
  const cleanInst = (institution || "").toUpperCase().trim();
  const cleanShort = (shortName || "").toUpperCase().trim();

  // Try matching against master catalog first
  const match = TANZANIA_ACADEMIC_CATALOG.find(c => {
    const cShort = c.shortName.toUpperCase();
    const cName = c.name.toUpperCase();
    if (cleanShort && cShort === cleanShort) return true;
    if (cleanInst && (cleanInst === cShort || cleanInst === cName || cleanInst.includes(cName) || cName.includes(cleanInst))) return true;
    return false;
  });

  if (match && match.logoUrl) {
    return match.logoUrl;
  }

  // Known logo filename mapping as fallback
  const knownLogos: Record<string, string> = {
    UDSM: "/logos/UDSM.jpeg",
    IFM: "/logos/IFM.jpeg",
    CBE: "/logos/CBE.png",
    NIT: "/logos/NIT.jpeg",
    ARDHI: "/logos/ARDHI.jpeg",
    ARU: "/logos/ARDHI.jpeg",
    SUA: "/logos/SUA.jpeg",
    UDOM: "/logos/UDOM.png",
    DIT: "/logos/DIT.jpeg",
    MUST: "/logos/MUST.jpeg",
    MUHAS: "/logos/MUHAS.jpeg",
    MU: "/logos/MU.jpeg",
    IAA: "/logos/IAA.jpeg",
    OUT: "/logos/OUT.jpeg",
    SUZA: "/logos/SUZA.jpeg",
    TIA: "/logos/TIA.png",
    SAUT: "/logos/SAUT.png",
    SJUIT: "/logos/SJUIT.jpeg",
    TUMAINI: "/logos/TUMAINI.jpeg",
    UAUT: "/logos/UAUT.png",
    HKMU: "/logos/HKMU.jpeg",
    KCMC: "/logos/KCMC.jpeg",
    MOCU: "/logos/MoCU.jpeg"
  };

  if (cleanShort && knownLogos[cleanShort]) return knownLogos[cleanShort];
  for (const [k, url] of Object.entries(knownLogos)) {
    if (cleanInst.includes(k)) return url;
  }

  return null;
}

/**
 * MICROSOFT WORD DOCX & PDF EXPORT ENGINE
 * Generates formatted MS Word documents and academic vector PDF layouts
 * strictly conforming to institutional guidelines (margins, fonts, chapter page breaks).
 */
export class DocxCompilerEngine {
  static compileToWordHtml(options: DocxExportOptions): string {
    const formattedDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    
    const fontFamily = options.formattingRules?.font?.family || "Times New Roman";
    const bodySize = options.formattingRules?.font?.body_size || 10;
    const h1Size = options.formattingRules?.font?.heading_1_size || 14;
    const h2Size = options.formattingRules?.font?.heading_2_size || 12;
    const lineSpacing = options.formattingRules?.spacing?.line_spacing || 1.5;
    const paragraphAfter = options.formattingRules?.spacing?.paragraph_after || 8;
    
    // Binding margin standards: left 1.5in for binding, 1.0in for top/bottom/right
    const marginTop = options.formattingRules?.margins?.top ?? 1.0;
    const marginBottom = options.formattingRules?.margins?.bottom ?? 1.0;
    const marginLeft = options.formattingRules?.margins?.left ?? 1.5;
    const marginRight = options.formattingRules?.margins?.right ?? 1.0;

    const resolvedLogoUrl = resolveInstitutionLogo(options.institution, options.institutionShortName, options.logoUrl);

    // Convert Markdown headings to Word HTML with institutional styling & chapter page-breaks
    const bodyHtml = options.content
      .replace(/^# (.*$)/gim, `<h1 style="font-family: '${fontFamily}', Times, serif; color: #0f172a; font-size: ${h1Size}pt; font-weight: bold; margin-top: 24pt; margin-bottom: 12pt; border-bottom: 1.5pt solid #0f172a; padding-bottom: 4pt; text-transform: uppercase; page-break-before: always; mso-break-type: section-break;">$1</h1>`)
      .replace(/^## (.*$)/gim, `<h2 style="font-family: '${fontFamily}', Times, serif; color: #1e293b; font-size: ${h2Size}pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt; mso-break-type: section-break;">$1</h2>`)
      .replace(/^### (.*$)/gim, `<h3 style="font-family: '${fontFamily}', Times, serif; color: #334155; font-size: ${h2Size}pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt;">$1</h3>`)
      .replace(/^#### (.*$)/gim, `<h4 style="font-family: '${fontFamily}', Times, serif; color: #475569; font-size: ${bodySize}pt; font-weight: bold; font-style: italic; margin-top: 10pt; margin-bottom: 4pt;">$1</h4>`)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, `</p><p style="font-family: '${fontFamily}', Times, serif; font-size: ${bodySize}pt; line-height: ${lineSpacing}; margin-bottom: ${paragraphAfter}pt; text-align: justify; text-justify: inter-ideograph;">`)
      .replace(/\n/g, '<br/>');

    const htmlDocument = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${options.title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
      <w:ValidateAgainstSchemas/>
      <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
      <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
      <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 8.5in 11.0in;
      margin: ${marginTop}in ${marginRight}in ${marginBottom}in ${marginLeft}in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
      mso-paper-source: 0;
    }
    body {
      font-family: '${fontFamily}', Times, serif;
      font-size: ${bodySize}pt;
      line-height: ${lineSpacing};
      color: #000000;
    }
    .cover-page {
      page-break-after: always;
      text-align: center;
      padding-top: 1.5in;
    }
    .cover-title {
      font-size: 20pt;
      font-weight: bold;
      font-family: '${fontFamily}', Times, serif;
      text-transform: uppercase;
      margin-bottom: 24pt;
    }
    .cover-meta {
      font-size: ${bodySize}pt;
      margin-bottom: 12pt;
    }
    .toc-page {
      page-break-after: always;
      margin-top: 20pt;
    }
    p {
      margin-bottom: ${paragraphAfter}pt;
      text-align: justify;
      line-height: ${lineSpacing};
    }
    h1 {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <!-- COVER PAGE (OFFICIAL INSTITUTIONAL BLOCK) -->
  <div class="cover-page" style="text-align: center; page-break-after: always;">
    <p style="font-size: 15pt; font-weight: bold; font-family: '${fontFamily}', serif; margin-bottom: 20pt; letter-spacing: 0.5pt;">
      ${(options.institution || "HIGHER LEARNING INSTITUTION").toUpperCase()}
    </p>
    ${options.faculty ? `<p style="font-size: 13pt; font-weight: bold; margin-bottom: 16pt; color: #334155;">${options.faculty.toUpperCase()}</p>` : ''}
    ${options.department ? `<p style="font-size: 11pt; font-weight: bold; margin-bottom: 16pt; color: #475569;">DEPARTMENT OF ${options.department.toUpperCase()}</p>` : ''}
    
    ${resolvedLogoUrl ? `
    <div style="margin: 20pt 0; text-align: center;">
      <img src="${resolvedLogoUrl}" alt="${options.institution} Logo" style="max-height: 75pt; max-width: 130pt;" />
    </div>` : ''}

    <p style="font-size: 13pt; font-weight: bold; margin-top: 16pt; margin-bottom: 16pt; letter-spacing: 1pt;">
      ${(options.reportType || options.templateName || "FIELD PRACTICAL TRAINING REPORT").toUpperCase()}
    </p>

    <div style="margin-top: 30pt; margin-bottom: 40pt;">
      <p style="font-size: 18pt; font-weight: bold; font-family: '${fontFamily}', serif; text-transform: uppercase; line-height: 1.3;">
        ${options.title}
      </p>
    </div>

    <div style="margin-top: 40pt; font-size: ${bodySize}pt; line-height: 1.8;">
      <p><strong>PROGRAMME:</strong> ${options.programme || 'Degree Programme'}</p>
      <p><strong>ACADEMIC YEAR:</strong> ${options.academicYear || '2024/2025'}</p>
      ${options.supervisorName ? `<p><strong>SUPERVISOR:</strong> ${options.supervisorName}</p>` : ''}
      ${options.templateName ? `<p style="font-size: 10pt; color: #64748b; margin-top: 15pt;">Template Standard: ${options.templateName}</p>` : ''}
      <p style="margin-top: 30pt;">Date of Submission: ${formattedDate}</p>
    </div>
  </div>

  <!-- TABLE OF CONTENTS -->
  <div class="toc-page">
    <h2 style="font-family: '${fontFamily}', serif; font-size: ${h1Size}pt; font-weight: bold; border-bottom: 1.5pt solid #000; padding-bottom: 4pt; margin-bottom: 16pt;">TABLE OF CONTENTS</h2>
    <p style="font-style: italic; color: #475569;">(Formatted according to institutional structural sequence)</p>
    <hr style="border: 0.5pt solid #cbd5e1; margin-bottom: 20pt;"/>
  </div>

  <!-- MAIN DOCUMENT CONTENT -->
  <div>
    <p style="font-family: '${fontFamily}', serif; font-size: ${bodySize}pt; line-height: ${lineSpacing}; margin-bottom: ${paragraphAfter}pt; text-align: justify;">
      ${bodyHtml}
    </p>
  </div>
</body>
</html>
`;
    return htmlDocument;
  }

  static toRoman(num: number): string {
    const romans: Array<[number, string]> = [
      [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"]
    ];
    let res = "";
    for (const [v, r] of romans) {
      while (num >= v) {
        res += r;
        num -= v;
      }
    }
    return res || "i";
  }

  static compileToPdfHtml(options: DocxExportOptions): string {
    const formattedDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const resolvedLogoUrl = resolveInstitutionLogo(options.institution, options.institutionShortName, options.logoUrl);
    
    const fontFamily = options.formattingRules?.font?.family || "Times New Roman";
    const bodySize = options.formattingRules?.font?.body_size || 12;
    const h1Size = options.formattingRules?.font?.heading_1_size || 14;
    const h2Size = options.formattingRules?.font?.heading_2_size || 12;
    const lineSpacing = options.formattingRules?.spacing?.line_spacing || 1.5;
    const paragraphAfter = options.formattingRules?.spacing?.paragraph_after || 8;

    const marginTop = options.formattingRules?.margins?.top ?? 1.0;
    const marginBottom = options.formattingRules?.margins?.bottom ?? 1.0;
    const marginLeft = options.formattingRules?.margins?.left ?? 1.5;
    const marginRight = options.formattingRules?.margins?.right ?? 1.0;
    
    const bodyHtml = DocxCompilerEngine.formatContentToAcademicHtml(options.content, options);
    const contentSheets = DocxCompilerEngine.splitContentIntoA4Sheets(bodyHtml);
    const ch1Index = contentSheets.findIndex(s => 
      /<h1[^>]*class="[^"]*chapter-title[^"]*"[^>]*>\s*CHAPTER\s+(?:1|ONE)\b/i.test(s) ||
      /<h1[^>]*id="ch-1"[^>]*>/i.test(s)
    );
    const effectiveCh1Index = ch1Index >= 0 ? ch1Index : 6;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${options.title} - Academic Report PDF</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    @media print {
      body {
        margin: 0;
        padding: 0;
        background: #fff;
        color: #000;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print {
        display: none !important;
      }
      .print-page {
        width: 210mm;
        min-height: 297mm;
        margin: 0;
        padding: 22mm 20mm 18mm 28mm;
        box-sizing: border-box;
        page-break-after: always;
        break-after: page;
        page-break-inside: avoid;
        position: relative;
        background: #fff;
      }
      .print-page.cover-sheet {
        padding: 16mm 20mm 14mm 20mm;
        height: 297mm;
        max-height: 297mm;
        overflow: hidden;
      }
    }
    @media screen {
      body {
        font-family: "${fontFamily}", Times, serif;
        font-size: ${bodySize}pt;
        line-height: ${lineSpacing};
        color: #111;
        background: #f1f5f9;
        margin: 0;
        padding: 0;
      }
      .print-page {
        width: 210mm;
        min-height: 297mm;
        margin: 24px auto;
        padding: 22mm 20mm 18mm 28mm;
        box-sizing: border-box;
        background: #ffffff;
        box-shadow: 0 4px 20px rgba(0,0,0,0.12);
        position: relative;
        border-radius: 2px;
      }
      .print-page.cover-sheet {
        padding: 16mm 20mm 14mm 20mm;
        height: 297mm;
        max-height: 297mm;
        overflow: hidden;
      }
    }
    .print-bar {
      position: sticky;
      top: 0;
      background: #0f172a;
      color: #fff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: Arial, sans-serif;
      z-index: 999;
    }
    .print-btn {
      background: #0d9488;
      color: #fff;
      border: none;
      padding: 8px 20px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    .print-btn:hover {
      background: #14b8a6;
    }
    .sheet-content {
      min-height: calc(297mm - 40mm - 14mm);
      box-sizing: border-box;
      font-family: "${fontFamily}", Times, serif;
      font-size: ${bodySize}pt;
      line-height: ${lineSpacing};
      color: #0f172a;
    }
    .sheet-footer {
      position: absolute;
      bottom: 10mm;
      left: 28mm;
      right: 20mm;
      text-align: center;
      font-family: "${fontFamily}", Times, serif;
      font-size: 10pt;
      color: #334155;
    }
    .cover-page {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      max-height: 100%;
      overflow: hidden;
      text-align: center;
      box-sizing: border-box;
      padding: 0;
    }
    .cover-header {
      margin-bottom: 2mm;
    }
    .institution-name {
      font-size: 15pt;
      font-weight: bold;
      text-transform: uppercase;
      font-family: "${fontFamily}", Arial, sans-serif;
      letter-spacing: 0.5px;
      color: #0f172a;
      line-height: 1.25;
    }
    .faculty-name {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 2mm;
      color: #334155;
      line-height: 1.25;
    }
    .department-name {
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 1.5mm;
      color: #475569;
      line-height: 1.2;
    }
    .report-type-badge {
      font-size: 11pt;
      font-weight: bold;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #0f172a;
      margin-top: 2mm;
      margin-bottom: 2mm;
    }
    .report-title-box {
      margin: 3mm 0;
      border-top: 1.5pt solid #0f172a;
      border-bottom: 1.5pt solid #0f172a;
      padding: 3mm 0;
    }
    .report-title {
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      font-family: "${fontFamily}", Arial, sans-serif;
      line-height: 1.3;
      color: #0f172a;
    }
    .meta-grid {
      text-align: left;
      margin: 2mm auto 0 auto;
      max-width: 95%;
      font-size: 9.5pt;
      line-height: 1.45;
    }
    .meta-row {
      display: flex;
      margin-bottom: 2pt;
    }
    .meta-label {
      width: 190px;
      font-weight: bold;
      color: #1e293b;
      flex-shrink: 0;
    }
    .meta-val {
      flex-grow: 1;
      color: #0f172a;
    }
    .meta-placeholder-alert {
      color: #b91c1c;
      font-weight: bold;
      background: #fef2f2;
      padding: 1px 6px;
      border-radius: 4px;
      border: 1px dashed #ef4444;
    }
    .chapter-title {
      font-family: "${fontFamily}", Times, serif;
      font-size: ${h1Size}pt;
      font-weight: bold;
      text-transform: uppercase;
      color: #0f172a;
      margin-top: 28pt;
      margin-bottom: 14pt;
      border-bottom: 1.5pt solid #0f172a;
      padding-bottom: 4pt;
      page-break-before: always;
      break-before: page;
    }
    .sub-heading {
      font-family: "${fontFamily}", Times, serif;
      font-size: ${h2Size}pt;
      font-weight: bold;
      color: #1e293b;
      margin-top: 18pt;
      margin-bottom: 8pt;
      page-break-after: avoid;
      break-after: avoid;
    }
    .section-heading {
      font-family: "${fontFamily}", Times, serif;
      font-size: ${h2Size}pt;
      font-weight: bold;
      color: #334155;
      margin-top: 14pt;
      margin-bottom: 6pt;
      page-break-after: avoid;
      break-after: avoid;
    }
    .sub-section-heading {
      font-family: "${fontFamily}", Times, serif;
      font-size: ${bodySize}pt;
      font-weight: bold;
      font-style: italic;
      color: #475569;
      margin-top: 10pt;
      margin-bottom: 4pt;
      page-break-after: avoid;
      break-after: avoid;
    }
    .paragraph {
      font-family: "${fontFamily}", Times, serif;
      font-size: ${bodySize}pt;
      text-align: justify;
      text-justify: inter-word;
      margin-bottom: 12pt;
      line-height: ${lineSpacing};
      text-indent: 10mm;
    }
    /* DYNAMIC TABLE OF CONTENTS CSS DOT LEADERS */
    .toc-container, .lot-container, .lof-container {
      margin: 10pt 0 16pt 0;
    }
    .toc-entry {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 2.5pt;
      font-family: "${fontFamily}", Times, serif;
      font-size: 9.5pt;
      line-height: 1.25;
      page-break-inside: avoid;
    }
    .toc-entry.depth-1 {
      font-weight: bold;
      margin-top: 5pt;
      font-size: 10pt;
    }
    .toc-entry.depth-2 {
      padding-left: 14pt;
      font-weight: normal;
      font-size: 9pt;
      margin-bottom: 1.5pt;
    }
    .toc-entry.depth-prelim {
      font-weight: bold;
      font-size: 9.5pt;
      margin-bottom: 2pt;
    }
    .toc-title {
      padding-right: 6px;
      flex-shrink: 0;
      max-width: 82%;
    }
    .toc-title a {
      color: #0f172a;
      text-decoration: none;
    }
    .toc-title a:hover {
      text-decoration: underline;
    }
    .toc-leader {
      flex-grow: 1;
      border-bottom: 1.2pt dotted #64748b;
      margin: 0 4px;
      position: relative;
      top: -4px;
      min-width: 20px;
    }
    .toc-page-num {
      padding-left: 6px;
      flex-shrink: 0;
      font-weight: bold;
      text-align: right;
      min-width: 24px;
      color: #0f172a;
    }
    .academic-table {
      width: 100%;
      border-collapse: collapse;
      margin: 14pt 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .academic-figure {
      text-align: center;
      margin: 16pt auto;
      page-break-inside: avoid;
      break-inside: avoid;
      display: block;
    }
    .academic-figure svg {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <div>
      <div style="font-size: 14px; font-weight: bold;">${options.title} — Official University Standard PDF</div>
      <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
        💡 <em>To export a clean official report: In the print dialog, uncheck <strong>Headers and footers</strong>.</em>
      </div>
    </div>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="document-container">
    <!-- SHEET 1: OFFICIAL COVER PAGE -->
    <div class="print-page cover-sheet" id="sheet-1">
      ${DocxCompilerEngine.compileCoverPageHtml(options)}
    </div>

    <!-- SHEETS 2+: PRELIMINARIES & INDIVIDUAL CHAPTER SHEETS -->
    ${contentSheets.map((sheetHtml, index) => {
      const isPrelim = index < effectiveCh1Index;
      const pageNumText = isPrelim
        ? DocxCompilerEngine.toRoman(index + 1)
        : `${index - effectiveCh1Index + 1}`;

      return `
      <div class="print-page content-sheet" id="sheet-${index + 2}">
        <div class="sheet-content">
          ${sheetHtml}
        </div>
        <div class="sheet-footer">
          <span class="sheet-page-number">${pageNumText}</span>
        </div>
      </div>`;
    }).join("\n")}
  </div>

  <script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;
  }

  /**
   * Dynamically constructs the Table of Contents matching the document's actual chapters,
   * preliminary pages, sections, and final page anchors.
   */
  static generateDynamicTableOfContentsHtml(content: string, options?: DocxExportOptions): string {
    const entries: string[] = [];

    // Split content by <!-- PAGE_BREAK --> to find the true sheet index where each section starts
    const rawSheets = content
      .split(/<!--\s*PAGE_BREAK\s*-->/i)
      .map(s => s.trim())
      .filter(Boolean);

    // Find the sheet index containing Chapter 1
    let ch1SheetIndex = -1;
    for (let sIdx = 0; sIdx < rawSheets.length; sIdx++) {
      if (/^(?:#\s*)?CHAPTER\s+(?:1|ONE)\b/im.test(rawSheets[sIdx])) {
        ch1SheetIndex = sIdx;
        break;
      }
    }
    if (ch1SheetIndex === -1) ch1SheetIndex = 6; // standard 6 preliminary sheets

    const getPageNumberForPattern = (regex: RegExp, fallbackPage: number | string): number | string => {
      for (let sIdx = 0; sIdx < rawSheets.length; sIdx++) {
        if (regex.test(rawSheets[sIdx])) {
          if (sIdx < ch1SheetIndex) {
            return DocxCompilerEngine.toRoman(sIdx + 1);
          }
          return sIdx - ch1SheetIndex + 1;
        }
      }
      return fallbackPage;
    };

    // 1. Preliminary entries in formal academic sequence (Roman numerals)
    if (/DECLARATION/i.test(content)) {
      const pNum = getPageNumberForPattern(/DECLARATION/i, "i");
      entries.push(`  <div class="toc-entry depth-prelim">
    <span class="toc-title"><a href="#sec-declaration">DECLARATION AND APPROVAL</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="sec-declaration" data-is-roman="true">${pNum}</span>
  </div>`);
    }
    if (/ACKNOWLEDGEMENTS?/i.test(content)) {
      const pNum = getPageNumberForPattern(/ACKNOWLEDGEMENTS?/i, "ii");
      entries.push(`  <div class="toc-entry depth-prelim">
    <span class="toc-title"><a href="#sec-acknowledgements">ACKNOWLEDGEMENTS</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="sec-acknowledgements" data-is-roman="true">${pNum}</span>
  </div>`);
    }
    if (/ABSTRACT/i.test(content)) {
      const pNum = getPageNumberForPattern(/ABSTRACT/i, "iii");
      entries.push(`  <div class="toc-entry depth-prelim">
    <span class="toc-title"><a href="#sec-abstract">ABSTRACT</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="sec-abstract" data-is-roman="true">${pNum}</span>
  </div>`);
    }
    if (/DEDICATION/i.test(content)) {
      const pNum = getPageNumberForPattern(/DEDICATION/i, "iv");
      entries.push(`  <div class="toc-entry depth-prelim">
    <span class="toc-title"><a href="#sec-dedication">DEDICATION</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="sec-dedication" data-is-roman="true">${pNum}</span>
  </div>`);
    }
    if (/LIST OF TABLES/i.test(content)) {
      const pNum = getPageNumberForPattern(/LIST OF TABLES/i, "v");
      entries.push(`  <div class="toc-entry depth-prelim">
    <span class="toc-title"><a href="#sec-list-of-tables">LIST OF TABLES</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="sec-list-of-tables" data-is-roman="true">${pNum}</span>
  </div>`);
    }
    if (/LIST OF FIGURES/i.test(content)) {
      const pNum = getPageNumberForPattern(/LIST OF FIGURES/i, "v");
      entries.push(`  <div class="toc-entry depth-prelim">
    <span class="toc-title"><a href="#sec-list-of-figures">LIST OF FIGURES & DIAGRAMS</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="sec-list-of-figures" data-is-roman="true">${pNum}</span>
  </div>`);
    }
    if (/LIST OF ABBREVIATIONS/i.test(content)) {
      const pNum = getPageNumberForPattern(/LIST OF ABBREVIATIONS/i, "vi");
      entries.push(`  <div class="toc-entry depth-prelim">
    <span class="toc-title"><a href="#sec-abbreviations">LIST OF ABBREVIATIONS</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="sec-abbreviations" data-is-roman="true">${pNum}</span>
  </div>`);
    }

    // 2. Scan lines for actual chapters and decimal sections
    const lines = content.split('\n');
    const wordToNum: Record<string, string> = { ONE: '1', TWO: '2', THREE: '3', FOUR: '4', FIVE: '5', SIX: '6' };
    const defaultTitles: Record<string, string> = {
      "1": "INTRODUCTION TO THE HOST ORGANIZATION",
      "2": "PRACTICAL ACTIVITIES & MAIN TECHNICAL ASSIGNMENT",
      "3": "CHALLENGES ENCOUNTERED & PRACTICAL PROBLEM SOLVING",
      "4": "SKILLS ACQUIRED & CURRICULUM SYNTHESIS",
      "5": "CONCLUSIONS & PRACTICAL RECOMMENDATIONS"
    };

    let currentChapterNum = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Match Chapter
      const chMatch = line.match(/^(?:#\s*)?CHAPTER\s+([0-9]+|ONE|TWO|THREE|FOUR|FIVE|SIX)[:\s]*(.*)$/i);
      if (chMatch) {
        const rawNum = chMatch[1].toUpperCase();
        const chNum = wordToNum[rawNum] || rawNum;
        let chTitle = chMatch[2].trim();

        // If title on line is empty, inspect next non-empty line
        if (!chTitle && i + 1 < lines.length) {
          const nextL = lines[i + 1].trim();
          if (nextL && !nextL.startsWith("#") && !nextL.startsWith("=") && !nextL.match(/^[0-9]+\.[0-9]+/)) {
            chTitle = nextL;
          }
        }

        // Clean any redundant "CHAPTER X:" prefix
        chTitle = chTitle.replace(/^CHAPTER\s+[0-9IVX]+[:\s-]*/i, "").trim();

        // If empty or duplicated "CHAPTER X", apply official institutional chapter title
        if (!chTitle || chTitle.toUpperCase() === `CHAPTER ${chNum}`) {
          chTitle = defaultTitles[chNum] || `CHAPTER ${chNum}`;
        }

        const chId = `ch-${chNum}`;
        currentChapterNum = parseInt(chNum, 10) || currentChapterNum;
        const chPage = getPageNumberForPattern(new RegExp(`(?:#\\s*)?CHAPTER\\s+${chNum}\\b`, 'i'), currentChapterNum === 1 ? 1 : 4);

        entries.push(`  <div class="toc-entry depth-1">
    <span class="toc-title"><a href="#${chId}">CHAPTER ${chNum}: ${chTitle}</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="${chId}">${chPage}</span>
  </div>`);
        continue;
      }

      // Match Section (e.g. 1.1 Profile and Background)
      const secMatch = line.match(/^([0-9]+)\.([0-9]+)\s+([^\n<]+)$/) ||
                       line.match(/^##\s+([0-9]+)\.([0-9]+)\s+([^\n<]+)$/);
      if (secMatch) {
        const n1 = secMatch[1];
        const n2 = secMatch[2];
        const title = secMatch[3].trim();
        const secId = `sec-${n1}-${n2}`;
        const secPage = getPageNumberForPattern(new RegExp(`(?:^|\\n)(?:##\\s+)?${n1}\\.${n2}\\s+`, 'i'), 1);
        entries.push(`  <div class="toc-entry depth-2">
    <span class="toc-title"><a href="#${secId}">${n1}.${n2} ${title}</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="${secId}">${secPage}</span>
  </div>`);
        continue;
      }

      // Match Subsection (e.g. 1.1.1 Sub-item)
      const subMatch = line.match(/^([0-9]+)\.([0-9]+)\.([0-9]+)\s+([^\n<]+)$/) ||
                       line.match(/^###\s+([0-9]+)\.([0-9]+)\.([0-9]+)\s+([^\n<]+)$/);
      if (subMatch) {
        const n1 = subMatch[1];
        const n2 = subMatch[2];
        const n3 = subMatch[3];
        const title = subMatch[4].trim();
        const subId = `sec-${n1}-${n2}-${n3}`;
        const subPage = getPageNumberForPattern(new RegExp(`(?:^|\\n)(?:###\\s+)?${n1}\\.${n2}\\.${n3}\\s+`, 'i'), 1);
        entries.push(`  <div class="toc-entry depth-2" style="padding-left: 28pt;">
    <span class="toc-title"><a href="#${subId}">${n1}.${n2}.${n3} ${title}</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="${subId}">${subPage}</span>
  </div>`);
      }
    }

    if (/REFERENCES/i.test(content)) {
      const refPage = getPageNumberForPattern(/REFERENCES/i, 19);
      entries.push(`  <div class="toc-entry depth-1">
    <span class="toc-title"><a href="#sec-refs">REFERENCES</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="sec-refs">${refPage}</span>
  </div>`);
    }

    if (/APPENDICES/i.test(content)) {
      const appPage = getPageNumberForPattern(/APPENDICES/i, 19);
      entries.push(`  <div class="toc-entry depth-1">
    <span class="toc-title"><a href="#sec-apps">APPENDICES</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="sec-apps">${appPage}</span>
  </div>`);
    }

    return `<nav class="toc-container" id="doc-toc">\n${entries.join('\n')}\n</nav>`;
  }

  static generateDynamicListOfTablesHtml(content: string): string {
    const rawSheets = content.split(/<!--\s*PAGE_BREAK\s*-->/i).map(s => s.trim()).filter(Boolean);
    let ch1SheetIndex = rawSheets.findIndex(s => /^(?:#\s*)?CHAPTER\s+(?:1|ONE)\b/im.test(s));
    if (ch1SheetIndex === -1) ch1SheetIndex = 6;

    const getPage = (pattern: RegExp, fallback: number) => {
      const idx = rawSheets.findIndex(s => pattern.test(s));
      return idx >= ch1SheetIndex ? (idx - ch1SheetIndex + 1) : fallback;
    };

    const entries: string[] = [];
    if (/Table\s+1\.1|tbl-1-1/i.test(content)) {
      const p = getPage(/Table\s+1\.1|tbl-1-1/i, 2);
      entries.push(`  <div class="toc-entry">
    <span class="toc-title"><a href="#tbl-1-1">Table 1.1: Technical Staff Cadre, Academic Qualifications and Key Responsibilities</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="tbl-1-1">${p}</span>
  </div>`);
    }
    if (/Table\s+2\.1|tbl-2-1/i.test(content)) {
      const p = getPage(/Table\s+2\.1|tbl-2-1/i, 6);
      entries.push(`  <div class="toc-entry">
    <span class="toc-title"><a href="#tbl-2-1">Table 2.1: Technical Evaluation Matrix of Alternative Solutions</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="tbl-2-1">${p}</span>
  </div>`);
    }
    if (/Table\s+3\.1|tbl-3-1/i.test(content)) {
      const p = getPage(/Table\s+3\.1|tbl-3-1/i, 9);
      entries.push(`  <div class="toc-entry">
    <span class="toc-title"><a href="#tbl-3-1">Table 3.1: Log of Fieldwork Challenges, Severity Levels and Mitigations</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="tbl-3-1">${p}</span>
  </div>`);
    }
    if (/tbl-app-a|APPENDIX\s+A/i.test(content)) {
      const p = getPage(/tbl-app-a|APPENDIX\s+A/i, 14);
      entries.push(`  <div class="toc-entry">
    <span class="toc-title"><a href="#tbl-app-a">Table A.1: Comprehensive Fieldwork Daily Logbook Summary</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="tbl-app-a">${p}</span>
  </div>`);
    }
    return `<nav class="lot-container" id="doc-lot">\n${entries.join('\n')}\n</nav>`;
  }

  static generateDynamicListOfFiguresHtml(content: string): string {
    const rawSheets = content.split(/<!--\s*PAGE_BREAK\s*-->/i).map(s => s.trim()).filter(Boolean);
    let ch1SheetIndex = rawSheets.findIndex(s => /^(?:#\s*)?CHAPTER\s+(?:1|ONE)\b/im.test(s));
    if (ch1SheetIndex === -1) ch1SheetIndex = 6;

    const getPage = (pattern: RegExp, fallback: number) => {
      const idx = rawSheets.findIndex(s => pattern.test(s));
      return idx >= ch1SheetIndex ? (idx - ch1SheetIndex + 1) : fallback;
    };

    const entries: string[] = [];
    if (/Figure\s+1\.1|fig-1-1/i.test(content)) {
      const p = getPage(/Figure\s+1\.1|fig-1-1/i, 2);
      entries.push(`  <div class="toc-entry">
    <span class="toc-title"><a href="#fig-1-1">Figure 1.1: Organizational Administrative Hierarchy (Organogram) of Host Enterprise</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="fig-1-1">${p}</span>
  </div>`);
    }
    if (/Figure\s+2\.1|fig-2-1/i.test(content)) {
      const p = getPage(/Figure\s+2\.1|fig-2-1/i, 5);
      entries.push(`  <div class="toc-entry">
    <span class="toc-title"><a href="#fig-2-1">Figure 2.1: Operational Process Architecture & Technical Workflow Diagram</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="fig-2-1">${p}</span>
  </div>`);
    }
    if (entries.length === 0) {
      entries.push(`  <div class="toc-entry">
    <span class="toc-title"><a href="#fig-1-1">Figure 1.1: Administrative Organogram of the Enterprise</a></span>
    <span class="toc-leader"></span>
    <span class="toc-page-num" data-target="fig-1-1">2</span>
  </div>`);
    }
    return `<nav class="lof-container" id="doc-lof">\n${entries.join('\n')}\n</nav>`;
  }

  /**
   * Transforms raw academic text into styled HTML with protected vector SVGs, semantic tables, and dynamic TOC.
   */
  static formatContentToAcademicHtml(rawContent: string, options?: DocxExportOptions): string {
    if (!rawContent || !rawContent.trim()) return "";

    // 1. Remove ASCII cover page if present because PDF renderer creates the official cover page
    let content = rawContent;
    const coverMatch = content.match(/^={20,}[\s\S]*?REPORT TITLE:[\s\S]*?={20,}/i);
    if (coverMatch) {
      content = content.replace(coverMatch[0], "").trim();
    }

    // 2. Protect existing HTML/SVG blocks from regex mangling
    const htmlBlocks: string[] = [];
    content = content.replace(/(<figure[\s\S]*?<\/figure>|<div style="margin: 20pt[\s\S]*?<\/div>|<table[\s\S]*?<\/table>)/gi, (match) => {
      const idx = htmlBlocks.length;
      htmlBlocks.push(match);
      return `__PROTECTED_HTML_BLOCK_${idx}__`;
    });

    // 3. Generate dynamic Table of Contents, List of Tables, and List of Figures components
    const dynamicTocHtml = DocxCompilerEngine.generateDynamicTableOfContentsHtml(content, options);
    const dynamicLotHtml = DocxCompilerEngine.generateDynamicListOfTablesHtml(content);
    const dynamicLofHtml = DocxCompilerEngine.generateDynamicListOfFiguresHtml(content);

    // 4. Inject Dynamic Navigation Placeholders
    content = content
      .replace(/<!-- DYNAMIC_TABLE_OF_CONTENTS_PLACEHOLDER -->/g, dynamicTocHtml)
      .replace(/<!-- DYNAMIC_LIST_OF_TABLES_PLACEHOLDER -->/g, dynamicLotHtml)
      .replace(/<!-- DYNAMIC_LIST_OF_FIGURES_PLACEHOLDER -->/g, dynamicLofHtml);

    // 5. Normalize ASCII and chapter headers, ensuring clean single page breaks
    let normalized = content
      .replace(/={10,}\s*(?:#\s*)?CHAPTER\s+([0-9IVX]+)[:\s]*\n+([^\n=]+)\s*={10,}/gi, '\n<!-- PAGE_BREAK -->\n# CHAPTER $1: $2\n')
      .replace(/^[ \t]*(?:#\s*)?CHAPTER\s+([0-9]+|ONE|TWO|THREE|FOUR|FIVE|SIX)[:\s]*\n+([A-Z0-9 &,'\(\)\/\-]+)$/gim, '\n<!-- PAGE_BREAK -->\n# CHAPTER $1: $2\n')
      .replace(/={10,}/g, '');

    // Collapse multiple consecutive PAGE_BREAK comments or whitespace
    normalized = normalized.replace(/(?:[ \t]*<!--\s*PAGE_BREAK\s*-->[ \t]*\n*)+/gi, '\n<!-- PAGE_BREAK -->\n');

    // 6. Transform Headings and assign anchor IDs (single clean page break token)
    const defaultTitles: Record<string, string> = {
      "1": "INTRODUCTION TO THE HOST ORGANIZATION",
      "2": "PRACTICAL ACTIVITIES & MAIN TECHNICAL ASSIGNMENT",
      "3": "CHALLENGES ENCOUNTERED & PRACTICAL PROBLEM SOLVING",
      "4": "SKILLS ACQUIRED & CURRICULUM SYNTHESIS",
      "5": "CONCLUSIONS & PRACTICAL RECOMMENDATIONS"
    };

    let html = normalized
      .replace(/<!--\s*PAGE_BREAK\s*-->/gi, '<div class="page-break"></div>')
      // Major chapter headings with IDs (NO extra page-break div prepended)
      .replace(/^(?:#\s*)?CHAPTER\s+(?:1|ONE)[:\s]*(.*)$/gim, (m, title) => {
        const cleanT = (title || "").trim().replace(/^CHAPTER\s+[0-9IVX]+[:\s-]*/i, "") || defaultTitles["1"];
        return `<h1 class="chapter-title" id="ch-1">CHAPTER 1: ${cleanT}</h1>`;
      })
      .replace(/^(?:#\s*)?CHAPTER\s+(?:2|TWO)[:\s]*(.*)$/gim, (m, title) => {
        const cleanT = (title || "").trim().replace(/^CHAPTER\s+[0-9IVX]+[:\s-]*/i, "") || defaultTitles["2"];
        return `<h1 class="chapter-title" id="ch-2">CHAPTER 2: ${cleanT}</h1>`;
      })
      .replace(/^(?:#\s*)?CHAPTER\s+(?:3|THREE)[:\s]*(.*)$/gim, (m, title) => {
        const cleanT = (title || "").trim().replace(/^CHAPTER\s+[0-9IVX]+[:\s-]*/i, "") || defaultTitles["3"];
        return `<h1 class="chapter-title" id="ch-3">CHAPTER 3: ${cleanT}</h1>`;
      })
      .replace(/^(?:#\s*)?CHAPTER\s+(?:4|FOUR)[:\s]*(.*)$/gim, (m, title) => {
        const cleanT = (title || "").trim().replace(/^CHAPTER\s+[0-9IVX]+[:\s-]*/i, "") || defaultTitles["4"];
        return `<h1 class="chapter-title" id="ch-4">CHAPTER 4: ${cleanT}</h1>`;
      })
      .replace(/^(?:#\s*)?CHAPTER\s+(?:5|FIVE)[:\s]*(.*)$/gim, (m, title) => {
        const cleanT = (title || "").trim().replace(/^CHAPTER\s+[0-9IVX]+[:\s-]*/i, "") || defaultTitles["5"];
        return `<h1 class="chapter-title" id="ch-5">CHAPTER 5: ${cleanT}</h1>`;
      })
      .replace(/^(?:#\s*)?CHAPTER\s+([0-9]+)[:\s]*(.*)$/gim, (m, num, title) => {
        const cleanT = (title || "").trim().replace(/^CHAPTER\s+[0-9IVX]+[:\s-]*/i, "") || defaultTitles[num] || `CHAPTER ${num}`;
        return `<h1 class="chapter-title" id="ch-${num}">CHAPTER ${num}: ${cleanT}</h1>`;
      })
      // Preliminaries
      .replace(/^(?:#\s*)?DECLARATION(?:\s+AND\s+APPROVAL)?$/gim, '<h1 class="chapter-title" id="sec-declaration">DECLARATION AND APPROVAL</h1>')
      .replace(/^(?:#\s*)?ACKNOWLEDGEMENTS?$/gim, '<h1 class="chapter-title" id="sec-acknowledgements">ACKNOWLEDGEMENTS</h1>')
      .replace(/^(?:#\s*)?ABSTRACT$/gim, '<h1 class="chapter-title" id="sec-abstract">ABSTRACT</h1>')
      .replace(/^(?:#\s*)?DEDICATION$/gim, '<h1 class="chapter-title" id="sec-dedication">DEDICATION</h1>')
      .replace(/^(?:#\s*)?TABLE OF CONTENTS$/gim, '<h1 class="chapter-title" id="sec-toc">TABLE OF CONTENTS</h1>')
      .replace(/^(?:#\s*)?LIST OF TABLES$/gim, '<h1 class="chapter-title" id="sec-list-of-tables">LIST OF TABLES</h1>')
      .replace(/^(?:#\s*)?LIST OF FIGURES(?:\s*&\s*DIAGRAMS)?$/gim, '<h1 class="chapter-title" id="sec-list-of-figures">LIST OF FIGURES & DIAGRAMS</h1>')
      .replace(/^(?:#\s*)?LIST OF ABBREVIATIONS$/gim, '<h1 class="chapter-title" id="sec-abbreviations">LIST OF ABBREVIATIONS</h1>')
      .replace(/^(?:#\s*)?REFERENCES$/gim, '<h1 class="chapter-title" id="sec-refs">REFERENCES</h1>')
      .replace(/^(?:#\s*)?APPENDICES$/gim, '<h1 class="chapter-title" id="sec-apps">APPENDICES</h1>')
      // Markdown headings
      .replace(/^# (.*$)/gim, '<h1 class="chapter-title">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="sub-heading">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="section-heading">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="sub-section-heading">$1</h4>')
      // Decimal section headings (1.1, 1.2, 2.1, etc.) with IDs
      .replace(/^([0-9]+)\.([0-9]+)\s+([^\n<]+)$/gm, '<h2 class="sub-heading" id="sec-$1-$2">$1.$2 $3</h2>')
      .replace(/^([0-9]+)\.([0-9]+)\.([0-9]+)\s+([^\n<]+)$/gm, '<h3 class="section-heading" id="sec-$1-$2-$3">$1.$2.$3 $4</h3>')
      // Bold & Italic markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Images
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<figure class="academic-figure"><img src="$2" alt="$1" style="max-width: 85%; max-height: 400px; border-radius: 6px; border: 1px solid #cbd5e1; display: block; margin: 0 auto;" /><figcaption style="font-size: 10pt; font-style: italic; color: #475569; margin-top: 6pt;">$1</figcaption></figure>')
      // Paragraphs
      .replace(/\n\n+/g, '</p><p class="paragraph">')
      .replace(/\n/g, '<br/>');

    // 7. Format clean abbreviations table if raw lines are present
    html = html.replace(/<p class="paragraph">\s*([A-Z0-9]{2,10}\s{2,}[^\n<]+(?:\s*<br\/>\s*[A-Z0-9]{2,10}\s{2,}[^\n<]+)*)\s*<\/p>/gi, (match, rawAbbrevs) => {
      const lines = rawAbbrevs.split(/<br\/>|\n/).map((l: string) => l.trim()).filter(Boolean);
      const rows = lines.map((l: string) => {
        const parts = l.split(/\s{2,}/);
        if (parts.length >= 2) {
          return `<tr><td style="padding: 5pt 10pt; font-weight: bold; border: 1px solid #cbd5e1; width: 22%; font-family: inherit;">${parts[0]}</td><td style="padding: 5pt 10pt; border: 1px solid #cbd5e1; font-family: inherit;">${parts.slice(1).join(' ')}</td></tr>`;
        }
        return '';
      }).filter(Boolean);
      if (rows.length >= 3) {
        return `<table class="academic-table" style="width: 100%; border-collapse: collapse; margin: 14pt 0; font-size: 9.5pt;"><thead><tr style="background: #f1f5f9; border-top: 1.5pt solid #0f172a; border-bottom: 1.5pt solid #0f172a;"><th style="padding: 6pt 10pt; text-align: left; border: 1px solid #cbd5e1;">Abbreviation</th><th style="padding: 6pt 10pt; text-align: left; border: 1px solid #cbd5e1;">Definition / Institutional Expansion</th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
      }
      return match;
    });

    // 8. Restore protected HTML/SVG blocks
    htmlBlocks.forEach((block, idx) => {
      html = html.replace(`__PROTECTED_HTML_BLOCK_${idx}__`, block);
    });

    // Clean up empty paragraphs around block elements and strip completely empty paragraph tags
    html = html
      .replace(/<p class="paragraph">\s*(<div class="page-break"|<h1|<h2|<h3|<h4|<nav|<figure|<div|<table)/gi, '$1')
      .replace(/(<\/h1>|<\/h2>|<\/h3>|<\/h4>|<\/nav>|<\/figure>|<\/div>|<\/table>)\s*<\/p>/gi, '$1')
      .replace(/<p class="paragraph">\s*(?:<br\s*\/?>\s*)*<\/p>/gi, '');

    return `<p class="paragraph">${html}</p>`;
  }

  /**
   * Compiles the official university cover page as a strict single A4 sheet.
   */
  static compileCoverPageHtml(options: DocxExportOptions): string {
    const formattedDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const resolvedLogoUrl = resolveInstitutionLogo(options.institution, options.institutionShortName, options.logoUrl);

    const instUpper = (options.institution || "").toUpperCase();
    const progUpper = (options.programme || "").toUpperCase();
    let resolvedFaculty = options.faculty?.trim() || "";
    if (!resolvedFaculty && (instUpper.includes("DAR ES SALAAM") || instUpper.includes("UDSM"))) {
      if (progUpper.includes("BUSINESS INFORMATION") || progUpper.includes("COMPUTER") || progUpper.includes("BIT") || progUpper.includes("SOFTWARE")) {
        resolvedFaculty = "COLLEGE OF INFORMATION AND COMMUNICATION TECHNOLOGIES (CoICT)";
      }
    }

    return `
    <div class="cover-page">
      <div class="cover-header">
        <div class="institution-name">${options.institution ? options.institution.toUpperCase() : "HIGHER LEARNING INSTITUTION"}</div>
        ${resolvedFaculty ? `<div class="faculty-name">${resolvedFaculty.toUpperCase()}</div>` : ''}
        ${options.department ? `<div class="department-name">${options.department.toUpperCase().startsWith("DEPARTMENT") ? options.department.toUpperCase() : `DEPARTMENT OF ${options.department.toUpperCase()}`}</div>` : ''}
      </div>

      ${resolvedLogoUrl ? `
      <div class="cover-logo-wrapper" style="margin: 2mm 0; text-align: center;">
        <img src="${resolvedLogoUrl}" alt="${options.institution || 'University'} Official Logo" style="max-height: 70px; max-width: 125px; object-fit: contain; display: inline-block; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.08));" />
      </div>` : ''}

      <div class="report-type-badge">${options.reportType ? options.reportType.toUpperCase() : (options.templateName || "FIELD PRACTICAL TRAINING REPORT").toUpperCase()}</div>

      <div class="report-title-box">
        <div class="report-title">${options.title}</div>
      </div>

      <div class="meta-grid">
        <div class="meta-row">
          <span class="meta-label">Student Name:</span>
          <span class="meta-val">${options.studentName && options.studentName.trim() ? options.studentName : '<span class="meta-placeholder-alert">[STUDENT NAME REQUIRED]</span>'}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Registration No:</span>
          <span class="meta-val">${options.registrationNumber && options.registrationNumber.trim() ? options.registrationNumber : '<span class="meta-placeholder-alert">[REGISTRATION NUMBER REQUIRED]</span>'}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Practical Training Year:</span>
          <span class="meta-val">${options.yearOfStudy ? options.yearOfStudy.replace(/[^0-9]/g, "") || "2" : "2"}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Degree Programme:</span>
          <span class="meta-val">${options.programme && options.programme.trim() ? options.programme : '<span class="meta-placeholder-alert">[DEGREE PROGRAMME REQUIRED]</span>'}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Host Organization:</span>
          <span class="meta-val">${options.organization && options.organization.trim() ? options.organization : '<span class="meta-placeholder-alert">[HOST ENTERPRISE REQUIRED]</span>'}</span>
        </div>
        ${options.fieldSupervisor || options.supervisorName ? `
        <div class="meta-row">
          <span class="meta-label">Field Supervisor:</span>
          <span class="meta-val">${options.fieldSupervisor || options.supervisorName}</span>
        </div>` : ''}
        ${options.universitySupervisor ? `
        <div class="meta-row">
          <span class="meta-label">Academic Supervisor:</span>
          <span class="meta-val">${options.universitySupervisor}</span>
        </div>` : ''}
        <div class="meta-row">
          <span class="meta-label">Academic Year:</span>
          <span class="meta-val">${options.academicYear || "2024/2025"}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Date of Submission:</span>
          <span class="meta-val">${options.submissionDate || formattedDate}</span>
        </div>
      </div>
    </div>`;
  }

  /**
   * Splits compiled academic document HTML into discrete printable A4 sheets for visual preview.
   */
  static splitContentIntoA4Sheets(htmlContent: string): string[] {
    if (!htmlContent || !htmlContent.trim()) return [];
    // Split on explicit page breaks or chapter headings
    const rawParts = htmlContent.split(/<div class="page-break"[^>]*><\/div>/gi);
    return rawParts
      .map(p => p.trim())
      .filter(p => {
        const textOnly = p.replace(/<[^>]+>/g, '').trim();
        return textOnly.length > 0 || /<(?:img|svg|table|figure)/i.test(p);
      });
  }

  static openPdfPrintWindow(options: DocxExportOptions): void {
    if (typeof window === "undefined") return;
    const html = this.compileToPdfHtml(options);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    }
  }

  static openCoverPageOnlyPdfWindow(options: DocxExportOptions): void {
    if (typeof window === "undefined") return;
    const coverOnlyOptions: DocxExportOptions = {
      ...options,
      content: "" // Empty content renders only the page 1 official cover
    };
    const html = this.compileToPdfHtml(coverOnlyOptions);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    }
  }

  static downloadDocxFile(options: DocxExportOptions, filename?: string): void {
    if (typeof window === "undefined") return;
    const wordHtml = this.compileToWordHtml(options);
    const blob = new Blob(["\ufeff", wordHtml], {
      type: "application/msword;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeTitle = (options.title || "academic-report").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
    a.download = filename || `${safeTitle}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

