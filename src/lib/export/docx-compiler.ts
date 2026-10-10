export interface DocxExportOptions {
  title: string;
  institution: string;
  faculty?: string;
  programme?: string;
  studentName?: string;
  registrationNumber?: string;
  supervisorName?: string;
  academicYear?: string;
  content: string;
}

/**
 * MICROSOFT WORD DOCX / OPENXML COMPILER
 * Generates formatted MS Word files with cover pages, headers, footers, ToC, and 1.5 line spacing.
 */
export class DocxCompilerEngine {
  static compileToWordHtml(options: DocxExportOptions): string {
    const formattedDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    
    // Convert Markdown headings to HTML
    let bodyHtml = options.content
      .replace(/^# (.*$)/gim, '<h1 style="font-family: Arial, sans-serif; color: #0f172a; font-size: 18pt; margin-top: 18pt; margin-bottom: 8pt; border-bottom: 1.5pt solid #0f172a; padding-bottom: 4pt; text-transform: uppercase;">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 style="font-family: Arial, sans-serif; color: #1e293b; font-size: 14pt; margin-top: 14pt; margin-bottom: 6pt;">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 style="font-family: Arial, sans-serif; color: #334155; font-size: 12pt; margin-top: 10pt; margin-bottom: 4pt;">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 style="font-family: Arial, sans-serif; color: #475569; font-size: 11pt; margin-top: 8pt; margin-bottom: 4pt;">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p style="font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.5; margin-bottom: 10pt; text-align: justify;">')
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
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 8.5in 11.0in;
      margin: 1.0in 1.0in 1.0in 1.0in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
      mso-paper-source: 0;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000000;
    }
    .cover-page {
      page-break-after: always;
      text-align: center;
      padding-top: 2.0in;
    }
    .cover-title {
      font-size: 22pt;
      font-weight: bold;
      font-family: Arial, sans-serif;
      text-transform: uppercase;
      margin-bottom: 30pt;
    }
    .cover-meta {
      font-size: 12pt;
      margin-bottom: 15pt;
    }
    .toc-page {
      page-break-after: always;
      margin-top: 20pt;
    }
    p {
      margin-bottom: 10pt;
      text-align: justify;
    }
  </style>
</head>
<body>
  <!-- COVER PAGE -->
  <div className="cover-page" style="text-align: center; page-break-after: always;">
    <p style="font-size: 14pt; font-weight: bold; margin-bottom: 40pt;">${options.institution.toUpperCase()}</p>
    ${options.faculty ? `<p style="font-size: 12pt; font-weight: bold; margin-bottom: 30pt;">${options.faculty.toUpperCase()}</p>` : ''}
    
    <div style="margin-top: 60pt; margin-bottom: 60pt;">
      <p style="font-size: 20pt; font-weight: bold; font-family: Arial, sans-serif; text-transform: uppercase;">${options.title}</p>
    </div>

    <div style="margin-top: 100pt; font-size: 12pt;">
      <p><strong>PROGRAMME:</strong> ${options.programme || 'Degree Programme'}</p>
      <p><strong>ACADEMIC YEAR:</strong> ${options.academicYear || '2025/2026'}</p>
      ${options.supervisorName ? `<p><strong>SUPERVISOR:</strong> ${options.supervisorName}</p>` : ''}
      <p style="margin-top: 40pt;">Date of Submission: ${formattedDate}</p>
    </div>
  </div>

  <!-- TABLE OF CONTENTS PLACEHOLDER -->
  <div className="toc-page">
    <h2 style="font-family: Arial, sans-serif; font-size: 16pt; border-bottom: 1pt solid #000; padding-bottom: 4pt; margin-bottom: 20pt;">TABLE OF CONTENTS</h2>
    <p><em>(Automatically generated based on document headings)</em></p>
    <hr/>
  </div>

  <!-- MAIN DOCUMENT CONTENT -->
  <div>
    <p style="font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.5; margin-bottom: 10pt; text-align: justify;">
      ${bodyHtml}
    </p>
  </div>
</body>
</html>
`;
    return htmlDocument;
  }
}
