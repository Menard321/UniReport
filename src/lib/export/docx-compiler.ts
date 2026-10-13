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
    const bodySize = options.formattingRules?.font?.body_size || 12;
    const h1Size = options.formattingRules?.font?.heading_1_size || 16;
    const h2Size = options.formattingRules?.font?.heading_2_size || 13;
    const lineSpacing = options.formattingRules?.spacing?.line_spacing || 1.5;
    const paragraphAfter = options.formattingRules?.spacing?.paragraph_after || 8;
    
    // Binding margin standards: left 1.5in for binding, 1.0in for top/bottom/right
    const marginTop = options.formattingRules?.margins?.top ?? 1.0;
    const marginBottom = options.formattingRules?.margins?.bottom ?? 1.0;
    const marginLeft = options.formattingRules?.margins?.left ?? 1.5;
    const marginRight = options.formattingRules?.margins?.right ?? 1.0;

    // Convert Markdown headings to Word HTML with institutional styling & chapter page-breaks
    const bodyHtml = options.content
      .replace(/^# (.*$)/gim, `<h1 style="font-family: ${fontFamily}, Times, serif; color: #0f172a; font-size: ${h1Size}pt; font-weight: bold; margin-top: 24pt; margin-bottom: 12pt; border-bottom: 1.5pt solid #0f172a; padding-bottom: 4pt; text-transform: uppercase; page-break-before: always; mso-break-type: section-break;">$1</h1>`)
      .replace(/^## (.*$)/gim, `<h2 style="font-family: ${fontFamily}, Times, serif; color: #1e293b; font-size: ${h2Size}pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt; page-break-before: always; mso-break-type: section-break;">$1</h2>`)
      .replace(/^### (.*$)/gim, `<h3 style="font-family: ${fontFamily}, Times, serif; color: #334155; font-size: ${bodySize}pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt;">$1</h3>`)
      .replace(/^#### (.*$)/gim, `<h4 style="font-family: ${fontFamily}, Times, serif; color: #475569; font-size: ${bodySize - 1}pt; font-weight: bold; font-style: italic; margin-top: 10pt; margin-bottom: 4pt;">$1</h4>`)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, `</p><p style="font-family: ${fontFamily}, Times, serif; font-size: ${bodySize}pt; line-height: ${lineSpacing}; margin-bottom: ${paragraphAfter}pt; text-align: justify; text-justify: inter-ideograph;">`)
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
    h1, h2 {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <!-- COVER PAGE (OFFICIAL INSTITUTIONAL BLOCK) -->
  <div class="cover-page" style="text-align: center; page-break-after: always;">
    <p style="font-size: 15pt; font-weight: bold; font-family: '${fontFamily}', serif; margin-bottom: 30pt; letter-spacing: 0.5pt;">
      ${options.institution.toUpperCase()}
    </p>
    ${options.faculty ? `<p style="font-size: 13pt; font-weight: bold; margin-bottom: 24pt; color: #334155;">${options.faculty.toUpperCase()}</p>` : ''}
    
    <div style="margin-top: 50pt; margin-bottom: 50pt;">
      <p style="font-size: 19pt; font-weight: bold; font-family: '${fontFamily}', serif; text-transform: uppercase; line-height: 1.3;">
        ${options.title}
      </p>
    </div>

    <div style="margin-top: 80pt; font-size: ${bodySize}pt; line-height: 1.8;">
      <p><strong>PROGRAMME:</strong> ${options.programme || 'Degree Programme'}</p>
      <p><strong>ACADEMIC YEAR:</strong> ${options.academicYear || '2025/2026'}</p>
      ${options.supervisorName ? `<p><strong>SUPERVISOR:</strong> ${options.supervisorName}</p>` : ''}
      ${options.templateName ? `<p style="font-size: 10pt; color: #64748b; margin-top: 15pt;">Template Standard: ${options.templateName}</p>` : ''}
      <p style="margin-top: 35pt;">Date of Submission: ${formattedDate}</p>
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

  static compileToPdfHtml(options: DocxExportOptions): string {
    const formattedDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    
    const fontFamily = options.formattingRules?.font?.family || "Times New Roman";
    const bodySize = options.formattingRules?.font?.body_size || 12;
    const h1Size = options.formattingRules?.font?.heading_1_size || 16;
    const h2Size = options.formattingRules?.font?.heading_2_size || 13;
    const lineSpacing = options.formattingRules?.spacing?.line_spacing || 1.6;
    const paragraphAfter = options.formattingRules?.spacing?.paragraph_after || 8;

    const marginTop = options.formattingRules?.margins?.top ?? 1.0;
    const marginBottom = options.formattingRules?.margins?.bottom ?? 1.0;
    const marginLeft = options.formattingRules?.margins?.left ?? 1.5;
    const marginRight = options.formattingRules?.margins?.right ?? 1.0;
    
    const bodyHtml = DocxCompilerEngine.formatContentToAcademicHtml(options.content);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${options.title} - Academic Report PDF</title>
  <style>
    @page {
      size: A4 portrait;
      margin: ${marginTop}in ${marginRight}in ${marginBottom}in ${marginLeft}in;
      @bottom-right {
        content: counter(page);
        font-family: "${fontFamily}", serif;
        font-size: 10pt;
      }
    }
    @media print {
      body {
        margin: 0;
        background: #fff;
        color: #000;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page-break {
        page-break-after: always;
        break-after: page;
      }
      .no-print {
        display: none !important;
      }
    }
    body {
      font-family: "${fontFamily}", Times, serif;
      font-size: ${bodySize}pt;
      line-height: ${lineSpacing};
      color: #111;
      background: #f8fafc;
      margin: 0;
      padding: 0;
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
    }
    .print-btn:hover {
      background: #14b8a6;
    }
    .sheet {
      background: #ffffff;
      width: 210mm;
      min-height: 297mm;
      margin: 20px auto;
      padding: 25mm 20mm;
      box-sizing: border-box;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    @media print {
      .sheet {
        width: 100%;
        min-height: auto;
        margin: 0;
        padding: 0;
        box-shadow: none;
      }
    }
    .cover-page {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 247mm;
      text-align: center;
      page-break-after: always;
      break-after: page;
    }
    .institution-name {
      font-size: 16pt;
      font-weight: bold;
      text-transform: uppercase;
      font-family: Arial, sans-serif;
      margin-top: 20mm;
      letter-spacing: 0.5px;
    }
    .faculty-name {
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 6mm;
      color: #334155;
    }
    .report-title-box {
      margin: 40mm 0;
    }
    .report-title {
      font-size: 20pt;
      font-weight: bold;
      text-transform: uppercase;
      font-family: Arial, sans-serif;
      line-height: 1.4;
      border-top: 2px solid #0f172a;
      border-bottom: 2px solid #0f172a;
      padding: 15mm 0;
    }
    .meta-box {
      font-size: 12pt;
      line-height: 1.8;
      margin-bottom: 20mm;
    }
    .chapter-title {
      font-family: Arial, sans-serif;
      font-size: 16pt;
      font-weight: bold;
      text-transform: uppercase;
      color: #0f172a;
      margin-top: 24pt;
      margin-bottom: 12pt;
      border-bottom: 1.5pt solid #0f172a;
      padding-bottom: 4pt;
      page-break-before: always;
      break-before: page;
    }
    .sub-heading {
      font-family: Arial, sans-serif;
      font-size: 13pt;
      font-weight: bold;
      color: #1e293b;
      margin-top: 16pt;
      margin-bottom: 8pt;
    }
    .section-heading {
      font-family: Arial, sans-serif;
      font-size: 12pt;
      font-weight: bold;
      color: #334155;
      margin-top: 12pt;
      margin-bottom: 6pt;
    }
    .paragraph {
      text-align: justify;
      margin-bottom: 12pt;
      text-indent: 10mm;
    }
    .ascii-diagram {
      font-family: "Courier New", Consolas, monospace !important;
      font-size: 8pt !important;
      line-height: 1.15 !important;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 10px 14px;
      margin: 14pt 0;
      white-space: pre;
      overflow-x: auto;
      text-align: left;
      text-indent: 0 !important;
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <div>
      <strong>${options.title}</strong> — <span>Official PDF Export</span>
    </div>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="sheet">
    <!-- COVER PAGE -->
    <div class="cover-page">
      <div>
        <div class="institution-name">${options.institution}</div>
        ${options.faculty ? `<div class="faculty-name">${options.faculty}</div>` : ''}
      </div>

      <div class="report-title-box">
        <div class="report-title">${options.title}</div>
      </div>

      <div class="meta-box">
        ${options.studentName ? `<div style="font-size: 13pt; margin-bottom: 2mm;"><strong>SUBMITTED BY:</strong> ${options.studentName.toUpperCase()}</div>` : ''}
        ${options.registrationNumber ? `<div><strong>REGISTRATION NO:</strong> ${options.registrationNumber}</div>` : ''}
        ${options.yearOfStudy ? `<div><strong>YEAR OF STUDY:</strong> ${options.yearOfStudy}</div>` : ''}
        <div style="margin-top: 2mm;"><strong>PROGRAMME:</strong> ${options.programme || 'Degree Programme'}</div>
        ${options.organization ? `<div><strong>HOST ORGANIZATION:</strong> ${options.organization}</div>` : ''}
        ${options.supervisorName ? `<div><strong>SUPERVISOR:</strong> ${options.supervisorName}</div>` : ''}
        <div><strong>ACADEMIC YEAR:</strong> ${options.academicYear || '2024/2025'}</div>
        <div style="margin-top: 8mm;"><strong>DATE:</strong> ${formattedDate}</div>
      </div>
    </div>

    <!-- BODY CONTENT -->
    <div>
      <p class="paragraph">${bodyHtml}</p>
    </div>
  </div>

  <script>
    // Auto-trigger print dialog after window loads
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
   * Transforms raw academic text into styled HTML with ASCII diagrams, tables, and page-broken chapters.
   */
  static formatContentToAcademicHtml(rawContent: string): string {
    if (!rawContent) return "";

    // 1. If content starts with ASCII cover page, remove it because PDF has its own HTML cover page
    let content = rawContent;
    const coverMatch = content.match(/^={20,}[\s\S]*?REPORT TITLE:[\s\S]*?={20,}/i);
    if (coverMatch) {
      content = content.replace(coverMatch[0], "").trim();
    }

    // 2. Identify and isolate ASCII diagram / table blocks (lines with +--- or |)
    const lines = content.split("\n");
    const formattedBlocks: string[] = [];
    let currentDiagramLines: string[] = [];
    let inDiagram = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isDiagramLine = /^[ \t]*(\+[-=+]+\+|\|.*\||\+[-+]+\s*$)/.test(line) || 
                            line.includes("+-------") || 
                            line.includes("+======") ||
                            line.startsWith("Figure 1.1:") ||
                            line.startsWith("Figure 2.1:") ||
                            line.startsWith("Table 1.1:") ||
                            line.startsWith("Table 2.1:") ||
                            line.startsWith("Table 3.1:");

      if (isDiagramLine) {
        inDiagram = true;
        currentDiagramLines.push(line);
      } else {
        if (inDiagram) {
          formattedBlocks.push(`<pre class="ascii-diagram">${currentDiagramLines.join("\n")}</pre>`);
          currentDiagramLines = [];
          inDiagram = false;
        }
        formattedBlocks.push(line);
      }
    }
    if (inDiagram && currentDiagramLines.length > 0) {
      formattedBlocks.push(`<pre class="ascii-diagram">${currentDiagramLines.join("\n")}</pre>`);
    }

    let html = formattedBlocks.join("\n");

    // 3. Transform Headings and structural dividers
    html = html
      // Section dividers
      .replace(/={20,}/g, '')
      // Major chapter headings
      .replace(/^CHAPTER\s+([0-9IVX]+[\s\S]*?$)/gim, '<h1 class="chapter-title">CHAPTER $1</h1>')
      .replace(/^(ABSTRACT|ACKNOWLEDGEMENTS|DECLARATION|TABLE OF CONTENTS|LIST OF ABBREVIATIONS|LIST OF TABLES|LIST OF FIGURES & DIAGRAMS|REFERENCES|APPENDICES)$/gm, '<h1 class="chapter-title">$1</h1>')
      // Markdown headings
      .replace(/^# (.*$)/gim, '<h1 class="chapter-title">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="sub-heading">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="section-heading">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="sub-section-heading">$1</h4>')
      // Decimal section headings (1.1, 1.2, 2.1, etc.)
      .replace(/^([0-9]+\.[0-9]+)\s+([^\n<]+)$/gm, '<h2 class="sub-heading">$1 $2</h2>')
      .replace(/^([0-9]+\.[0-9]+\.[0-9]+)\s+([^\n<]+)$/gm, '<h3 class="section-heading">$1 $2</h3>')
      // Bold & Italic markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Images
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<figure style="text-align: center; margin: 20pt 0;"><img src="$2" alt="$1" style="max-width: 85%; max-height: 400px; border-radius: 6px; border: 1px solid #cbd5e1; display: block; margin: 0 auto;" /><figcaption style="font-size: 10pt; font-style: italic; color: #475569; margin-top: 6pt;">$1</figcaption></figure>')
      // Paragraphs
      .replace(/\n\n+/g, '</p><p class="paragraph">')
      .replace(/\n/g, '<br/>');

    // Clean up paragraphs around pre tags
    html = html.replace(/<p class="paragraph">\s*<pre class="ascii-diagram">/g, '<pre class="ascii-diagram">')
               .replace(/<\/pre>\s*<\/p>/g, '</pre>');

    return `<p class="paragraph">${html}</p>`;
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
}

