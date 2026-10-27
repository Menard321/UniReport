import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export interface AssignmentInput {
  title: string;
  reportType: "FIELDWORK" | "FYP" | "DISSERTATION" | "LAB_REPORT" | "COURSEWORK";
  institution: string;
  faculty?: string;
  programme?: string;
  targetPages: number; // e.g. 5, 10, 15, 25
  citationStyle?: "APA7" | "IEEE" | "HARVARD";
  customTemplateText?: string;
  customTemplateSections?: Array<{
    id?: string;
    title: string;
    description?: string;
    order: number;
    is_required?: boolean;
  }>;
  formattingRules?: Record<string, any>;
  evidenceData?: Record<string, any>;
}

export interface ReportSectionBlueprint {
  chapterNumber: number;
  title: string;
  subHeadings: string[];
  wordBudget: number;
  promptInstructions: string;
}

export interface ReportBlueprint {
  title: string;
  reportType: string;
  institution: string;
  targetPages: number;
  totalWordTarget: number;
  citationStyle: string;
  formattingRules?: Record<string, any>;
  sections: ReportSectionBlueprint[];
}

/**
 * DEEP REPORT ORCHESTRATOR
 * Step 1: Analyzes student assignment & computes strict multi-chapter plan with word budgets
 */
export function analyzeAssignmentAndPlan(input: AssignmentInput): ReportBlueprint {
  const targetPages = input.targetPages || 10;
  // Estimated 350 words per page in academic typography
  const totalWordTarget = targetPages * 350;
  const citationStyle = input.citationStyle || "APA7";

  let sections: ReportSectionBlueprint[] = [];

  // Check if institution-specific verified template sections are provided
  if (input.customTemplateSections && input.customTemplateSections.length > 0) {
    const totalSecs = input.customTemplateSections.length;
    sections = input.customTemplateSections.map((sec, idx) => {
      // Allocate budget dynamically
      const isIntroOrOutro = idx === 0 || idx === totalSecs - 1;
      const budgetWeight = isIntroOrOutro ? 0.10 : 0.80 / (totalSecs - 2 || 1);
      const budget = Math.max(250, Math.round(totalWordTarget * budgetWeight));

      const titleUpper = sec.title.toUpperCase();
      let subHeadings: string[] = [];

      if (titleUpper.includes("PRELIMINAR") || titleUpper.includes("FRONT MATTER")) {
        subHeadings = [
          "Declaration and Authenticity Statement",
          "Certification of Industrial Supervisor & University Assessor",
          "Acknowledgements",
          "Executive Summary / Abstract",
          "Table of Contents and List of Acronyms"
        ];
      } else if (titleUpper.includes("CHAPTER 1") || titleUpper.includes("INTRODUCTION") || titleUpper.includes("BACKGROUND")) {
        subHeadings = [
          "1.1 Historical Background & Establishment of Host Organization",
          "1.2 Organizational Vision, Mission, Core Values & Mandate",
          "1.3 Governance Structure & Departmental Organogram",
          "1.4 Placement Scope, Departmental Roles & Attachment Objectives"
        ];
      } else if (titleUpper.includes("CHAPTER 2") || titleUpper.includes("ACTIVITIES") || titleUpper.includes("OPERATIONAL") || titleUpper.includes("DUTIES")) {
        subHeadings = [
          "2.1 Weekly Logbook Overview & Daily Operational Workflows",
          "2.2 Applied Technology Stack, Equipment & System Deployments",
          "2.3 Technical Procedures, Troubleshooting & Production Routines",
          "2.4 Departmental Rotations & Inter-Unit Collaboration"
        ];
      } else if (titleUpper.includes("CHAPTER 3") || titleUpper.includes("SKILLS") || titleUpper.includes("THEORY") || titleUpper.includes("METHODOLOG")) {
        subHeadings = [
          "3.1 Advanced Technical Competencies & Practical Skills Mastered",
          "3.2 Alignment of University Curriculum Theories with Industry Practice",
          "3.3 Professional Ethics, Workplace Health & Safety Protocols",
          "3.4 Key Technical Project Milestones Accomplished"
        ];
      } else if (titleUpper.includes("CHAPTER 4") || titleUpper.includes("CHALLENGE") || titleUpper.includes("PROBLEM")) {
        subHeadings = [
          "4.1 Operational Bottlenecks & Infrastructure Challenges Encountered",
          "4.2 Root Cause Technical Analysis & Workplace Limitations",
          "4.3 Engineered Problem-Solving Interventions & Mitigations Applied",
          "4.4 Professional Resilience & Lessons Learned from Failure Modes"
        ];
      } else if (titleUpper.includes("CHAPTER 5") || titleUpper.includes("CONCLUSION") || titleUpper.includes("RECOMMENDATION")) {
        subHeadings = [
          "5.1 Synthesis of Attachment Findings & Practical Takeaways",
          "5.2 Actionable Recommendations for Host Organization Process Improvement",
          "5.3 Curricular & Institutional Recommendations for University Faculty",
          "5.4 Concluding Remarks on Professional Development"
        ];
      } else if (titleUpper.includes("REFERENCE") || titleUpper.includes("APPENDI")) {
        subHeadings = [
          `Authoritative Academic Bibliography (${citationStyle} Standard)`,
          "Appendix 1: Verified Weekly Logbook Time Sheets",
          "Appendix 2: Industrial Supervisor Endorsement Form",
          "Appendix 3: Architectural Diagrams & Configuration Snippets"
        ];
      } else {
        const chNum = sec.order || idx + 1;
        subHeadings = [
          `${chNum}.1 Theoretical Context & Scope`,
          `${chNum}.2 Technical Analysis & Evidence Evaluation`,
          `${chNum}.3 Strategic Implementation & Departmental Outcomes`
        ];
      }

      const evidencePrompt = input.evidenceData
        ? `Preserve authentic student evidence: Host Organization: "${input.evidenceData.organization || 'Host Firm'}", Department: "${input.evidenceData.department || 'Department'}", Supervisor: "${input.evidenceData.supervisor || 'Industrial Supervisor'}", Reported Tools: "${input.evidenceData.toolsUsed || 'Industry Tools'}", Logged Activities: "${input.evidenceData.activities || 'Daily operational tasks'}". Do NOT fabricate unrelated corporate facts or falsify log entries.`
        : "Preserve authentic student field observations and technical data without fabricating unverified organizational facts.";

      const promptInstructions = sec.description
        ? `Adhere strictly to the official institutional guideline for this chapter: "${sec.description}". Target budget: approximately ${budget} words. ${evidencePrompt} Write exhaustive, publication-grade academic prose.`
        : `Draft an exhaustive, rigorous academic section for "${sec.title}" according to ${input.institution} standards. Target budget: approximately ${budget} words. ${evidencePrompt}`;

      return {
        chapterNumber: sec.order || idx + 1,
        title: sec.title,
        subHeadings,
        wordBudget: budget,
        promptInstructions,
      };
    });
  } else if (input.reportType === "FIELDWORK") {
    sections = [
      {
        chapterNumber: 1,
        title: "Chapter 1: Introduction & Organizational Background",
        subHeadings: [
          "1.1 Overview of Host Organization",
          "1.2 Departmental Structure & Operational Mandate",
          "1.3 Objectives of the Industrial Attachment",
          "1.4 Scope of Field Activities"
        ],
        wordBudget: Math.round(totalWordTarget * 0.20),
        promptInstructions: "Write an exhaustive opening detailing the host institution, departmental mandate, placement scope, and academic objectives."
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: Detailed Industrial Attachment Activities",
        subHeadings: [
          "2.1 Logbook Activity Breakdown (Weeks 1 to 8)",
          "2.2 Technical Tools & Software Stack Applied",
          "2.3 Operational Workflows & System Administration"
        ],
        wordBudget: Math.round(totalWordTarget * 0.30),
        promptInstructions: "Provide a detailed weekly logbook description of technical tasks, network/software tools, and operational workflows."
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: Technical Challenges, Problem Analysis & Solutions",
        subHeadings: [
          "3.1 Challenge 1: Infrastructure & Hardware Bottlenecks",
          "3.2 Technical Root Cause Analysis",
          "3.3 Engineered Solutions & Supervisors Feedback"
        ],
        wordBudget: Math.round(totalWordTarget * 0.20),
        promptInstructions: "Analyze real technical obstacles encountered during attachment and detail step-by-step engineering mitigations."
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: Skills Acquired & Academic Relevance",
        subHeadings: [
          "4.1 Technical Competencies Developed",
          "4.2 Professional & Interpersonal Skills",
          "4.3 Direct Relevance to University Curriculum"
        ],
        wordBudget: Math.round(totalWordTarget * 0.15),
        promptInstructions: "Connect practical field activities directly to theoretical university course modules."
      },
      {
        chapterNumber: 5,
        title: "Chapter 5: Conclusions & Strategic Recommendations",
        subHeadings: [
          "5.1 Synthesis & Conclusion",
          "5.2 Recommendations to Host Organization",
          "5.3 Recommendations to University"
        ],
        wordBudget: Math.round(totalWordTarget * 0.15),
        promptInstructions: "Summarize training outcomes and present actionable recommendations for both host organization and university."
      }
    ];
  } else if (input.reportType === "LAB_REPORT") {
    sections = [
      {
        chapterNumber: 1,
        title: "Section 1: Experiment Title, Objectives & Theoretical Principles",
        subHeadings: [
          "1.1 Scientific Rationale & Experiment Background",
          "1.2 Fundamental Scientific & Engineering Principles",
          "1.3 Primary Experiment Objectives & Hypotheses",
          "1.4 Academic Coursework Alignment & Scope"
        ],
        wordBudget: Math.round(totalWordTarget * 0.15),
        promptInstructions: "Establish the theoretical foundation, scientific laws/formulas governing the experiment, and stated testable hypotheses."
      },
      {
        chapterNumber: 2,
        title: "Section 2: Laboratory Apparatus, Materials & Calibration",
        subHeadings: [
          "2.1 Comprehensive List of Apparatus & Specifications",
          "2.2 Reagents, Test Samples & Material Properties",
          "2.3 Instrument Sensitivity, Measurement Ranges & Calibration",
          "2.4 Experimental Setup Architecture & Circuit/Test Rig Diagram"
        ],
        wordBudget: Math.round(totalWordTarget * 0.15),
        promptInstructions: "Detail all hardware instruments, tolerances, calibration procedures, and setup schematics with precision."
      },
      {
        chapterNumber: 3,
        title: "Section 3: Experimental Methodology & Operating Procedures",
        subHeadings: [
          "3.1 Identification of Independent, Dependent & Controlled Variables",
          "3.2 Step-by-Step Chronological Test Execution Procedure",
          "3.3 Operational Adjustments & Environmental Conditions",
          "3.4 Laboratory Safety Measures, PPE & Hazard Controls"
        ],
        wordBudget: Math.round(totalWordTarget * 0.20),
        promptInstructions: "Write an authoritative procedural description ensuring replicability. State variables and safety protocols clearly."
      },
      {
        chapterNumber: 4,
        title: "Section 4: Data Acquisition, Observations & Mathematical Calculations",
        subHeadings: [
          "4.1 Structured Tabulation of Raw Experimental Readings",
          "4.2 Quantitative Processing & Applied Governing Equations",
          "4.3 Graphical Analysis & Data Trends",
          "4.4 Sample Step-by-Step Calculations with Units"
        ],
        wordBudget: Math.round(totalWordTarget * 0.25),
        promptInstructions: "Present structured markdown data tables, mathematical derivations, calculations with standard units, and trend observations."
      },
      {
        chapterNumber: 5,
        title: "Section 5: Scientific Discussion & Quantitative Error Analysis",
        subHeadings: [
          "5.1 Critical Interpretation of Experimental Findings",
          "5.2 Comparison with Accepted Theoretical & Standard Values",
          "5.3 Systematic, Random & Environmental Sources of Error",
          "5.4 Percentage Discrepancies & Uncertainty Propagation"
        ],
        wordBudget: Math.round(totalWordTarget * 0.15),
        promptInstructions: "Provide a rigorous scientific discussion comparing actual readings against theoretical benchmarks with error analysis."
      },
      {
        chapterNumber: 6,
        title: "Section 6: Conclusions, Engineering Implications & Lab Recommendations",
        subHeadings: [
          "6.1 Validation or Rejection of Initial Hypothesis",
          "6.2 Key Takeaways & Practical Engineering Implications",
          "6.3 Technical Recommendations for Future Experimental Iterations",
          "6.4 Academic References & Standard Lab Standards"
        ],
        wordBudget: Math.round(totalWordTarget * 0.10),
        promptInstructions: "State decisive conclusions regarding the hypothesis and formulate actionable recommendations to improve accuracy."
      }
    ];
  } else if (input.reportType === "COURSEWORK") {
    sections = [
      {
        chapterNumber: 1,
        title: "Section 1: Introduction, Problem Scope & Module Context",
        subHeadings: [
          "1.1 Topic Background & Academic Relevance",
          "1.2 Statement of the Assignment Problem / Case Dilemma",
          "1.3 Key Theoretical Questions & Investigation Scope",
          "1.4 Structure of the Technical Paper"
        ],
        wordBudget: Math.round(totalWordTarget * 0.15),
        promptInstructions: "Introduce the academic topic, define the boundary of the problem, and contextualize within the university module curriculum."
      },
      {
        chapterNumber: 2,
        title: "Section 2: Conceptual Literature Synthesis & Theoretical Review",
        subHeadings: [
          "2.1 Core Theoretical Frameworks & Scholarly Models",
          "2.2 Critical Review of Seminal Literature & Perspectives",
          "2.3 Comparison of Divergent Academic Methodologies",
          "2.4 Synthesized Conceptual Matrix"
        ],
        wordBudget: Math.round(totalWordTarget * 0.25),
        promptInstructions: "Synthesize academic literature and models thematically with authoritative citations. Contrast competing viewpoints."
      },
      {
        chapterNumber: 3,
        title: "Section 3: Critical Analysis, Case Study Investigation & Evaluation",
        subHeadings: [
          "3.1 Context of Case Study Entity or Empirical Data",
          "3.2 In-Depth Qualitative & Quantitative Investigation",
          "3.3 Assessment Against Industry Benchmarks & Guidelines",
          "3.4 Key Findings & Analytical Insights"
        ],
        wordBudget: Math.round(totalWordTarget * 0.30),
        promptInstructions: "Perform rigorous critical analysis applied to the specific case or assignment scenario with evidentiary depth."
      },
      {
        chapterNumber: 4,
        title: "Section 4: Strategic Recommendations & Actionable Frameworks",
        subHeadings: [
          "4.1 Evidence-Based Interventions & Solutions",
          "4.2 Implementation Roadmaps & Resource Considerations",
          "4.3 Risk Assessment & Mitigation Mechanisms"
        ],
        wordBudget: Math.round(totalWordTarget * 0.18),
        promptInstructions: "Provide structured, realistic recommendations with phased implementation strategies and risk considerations."
      },
      {
        chapterNumber: 5,
        title: "Section 5: Conclusion & Comprehensive Academic Bibliography",
        subHeadings: [
          "5.1 Synthesis of Findings & Concluding Verdict",
          "5.2 Limitations of the Assignment Analysis",
          `5.3 Verified Bibliography (${citationStyle} Academic Standard)`
        ],
        wordBudget: Math.round(totalWordTarget * 0.12),
        promptInstructions: "Conclude the term paper cohesively and provide complete, correctly formatted scholarly references."
      }
    ];
  } else {
    // FYP / DISSERTATION DEFAULT 6-CHAPTER STRUCTURE
    sections = [
      {
        chapterNumber: 1,
        title: "Chapter 1: Introduction",
        subHeadings: [
          "1.1 Background of the Study",
          "1.2 Statement of the Problem",
          "1.3 Aim and Specific Objectives",
          "1.4 Significance of the Study",
          "1.5 Scope and Limitations"
        ],
        wordBudget: Math.round(totalWordTarget * 0.15),
        promptInstructions: "Establish theoretical context, state the research problem clearly, and outline specific objectives."
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: Literature Review & Theoretical Framework",
        subHeadings: [
          "2.1 Conceptual Foundations",
          "2.2 Review of Related Empirical Studies",
          "2.3 Comparative Analysis of Existing Approaches",
          "2.4 Identified Research Gap"
        ],
        wordBudget: Math.round(totalWordTarget * 0.25),
        promptInstructions: "Review scholarly sources, compare existing systems, and substantiate the research gap with citations."
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: Methodology",
        subHeadings: [
          "3.1 Research Design & Justification",
          "3.2 Data Collection Methods & Instruments",
          "3.3 System Development Methodology",
          "3.4 Ethical Considerations"
        ],
        wordBudget: Math.round(totalWordTarget * 0.15),
        promptInstructions: "Detail research methodology, software design paradigms, and data collection procedures."
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: System Analysis & Design",
        subHeadings: [
          "4.1 Functional & Non-Functional Requirements",
          "4.2 System Architecture & Diagrams",
          "4.3 Database Schema & API Specifications"
        ],
        wordBudget: Math.round(totalWordTarget * 0.20),
        promptInstructions: "Present software requirements, architectural diagrams, data flow models, and database schema."
      },
      {
        chapterNumber: 5,
        title: "Chapter 5: Implementation, Testing & Results",
        subHeadings: [
          "5.1 Development Environment & Implementation",
          "5.2 Key Code Modules & Screenshots",
          "5.3 Testing Strategy & Experimental Results"
        ],
        wordBudget: Math.round(totalWordTarget * 0.15),
        promptInstructions: "Detail implementation modules, test cases, performance evaluations, and empirical findings."
      },
      {
        chapterNumber: 6,
        title: "Chapter 6: Conclusion & Future Work",
        subHeadings: [
          "6.1 Summary of Completed Work",
          "6.2 Conclusions Linked to Objectives",
          "6.3 Recommendations for Future Work"
        ],
        wordBudget: Math.round(totalWordTarget * 0.10),
        promptInstructions: "Synthesize findings against initial objectives and suggest future research directions."
      }
    ];
  }

  return {
    title: input.title,
    reportType: input.reportType,
    institution: input.institution,
    targetPages,
    totalWordTarget,
    citationStyle,
    sections
  };
}

export function getReportBlueprint(reportType: string): {
  defaultTotalWords: number;
  chapters: Array<{
    chapterNumber: number;
    title: string;
    description: string;
    defaultWordBudget: number;
    subHeadings: string[];
  }>;
} {
  const normalizedType = (reportType || "FYP").toUpperCase() as any;
  const plan = analyzeAssignmentAndPlan({
    title: "Academic Report",
    reportType: normalizedType,
    institution: "Tanzanian Higher Learning Institution",
    targetPages: 10,
  });

  return {
    defaultTotalWords: plan.totalWordTarget,
    chapters: plan.sections.map((sec) => ({
      chapterNumber: sec.chapterNumber,
      title: sec.title,
      description: sec.promptInstructions,
      defaultWordBudget: sec.wordBudget,
      subHeadings: sec.subHeadings,
    })),
  };
}

// -----------------------------------------------------------------------------
// UNIREPORT_TZ PHASED REPORT-WRITING ASSISTANT CONTRACTS & ENGINE
// -----------------------------------------------------------------------------

export interface ProjectProfile {
  taskDescription: string;
  fieldOrCourse: string;
  organizationOrSetting: string;
  organization?: string;
  reportTitle?: string;
  activities: string;
  tools: string;
  methods: string;
  outputs: string;
  problemsFaced: string;
  solutionsApplied: string;
  evidenceAvailable?: string[] | string;
  reportType: "FIELDWORK" | "FYP" | "DISSERTATION" | "LAB_REPORT" | "COURSEWORK" | "ORGANIZATIONAL" | string;
  targetPages: number;
  language: "en" | "sw" | string;
  studentName?: string;
  registrationNumber?: string;
  supervisorName?: string;
  academicYear?: string;
  universityOrInstitution?: string;
}

export interface StructureSectionNode {
  id: string;
  title: string;
  order: number;
  goal: string;
  requiredInputs: string[];
  targetLengthWords: number;
  numbering?: string;
  subsections?: StructureSectionNode[];
}

export interface StructureMap {
  title: string;
  coverFields: Record<string, string>;
  frontMatter: string[];
  sections: StructureSectionNode[];
  headingRules?: string;
  citationStyle: "APA7" | "IEEE" | "HARVARD" | string;
  formatRules?: Record<string, any>;
}

export interface ApprovedPhaseRecord {
  title: string;
  blocks: PhaseBlock[];
  approvedAt: string;
}

export interface ApprovedContent {
  fixedFacts: Record<string, string>;
  approvedPhases: Record<string, ApprovedPhaseRecord>;
  runningGlossary: Array<{ term: string; definition: string }>;
  figureRegister: Array<{ number: string; caption: string; diagramType?: string }>;
  tableRegister: Array<{ number: string; caption: string }>;
}

export interface CurrentPhase {
  phaseId: string;
  title: string;
  sectionGoal: string;
  requiredInputs: string[];
  targetLengthWords: number;
  chapterOrSectionNumber?: string;
}

export type PhaseBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; style: "bullet" | "numbered"; items: string[] }
  | { type: "table"; caption?: string; header: string[]; rows: string[][] }
  | { type: "figure_spec"; diagram_type: string; title?: string; caption: string; data: Record<string, any> }
  | { type: "image_slot"; caption: string; suggestion: string }
  | { type: "placeholder"; label: string };

export interface PhaseResponse {
  phase_id: string;
  questions_for_user: string[];
  blocks: PhaseBlock[];
  new_facts_to_remember: string[];
  glossary_additions: Array<{ term: string; definition: string }> | string[];
  consistency_flags: string[];
}

export interface CoverTemplateInput {
  status: "verified" | "user-confirmed" | "generic-fallback" | string;
  universityName?: string;
  templateFormat?: Record<string, any>;
  rawTemplateHtmlOrSvg?: string;
}

export interface PhasedGenerationInput {
  project_profile: ProjectProfile;
  cover_template?: CoverTemplateInput;
  structure_map: StructureMap;
  approved_content: ApprovedContent;
  current_phase: CurrentPhase;
  user_edits?: string;
}

export const UNIREPORT_SYSTEM_INSTRUCTION = `You are unreportTZ, a professional academic and organizational report-writing assistant for students, researchers and organizations, mainly in Tanzania. You help a user write a complete, original, professional report on THEIR OWN task, in any field, one approved phase at a time. The final document is delivered as a PDF.

# 1. CORE PRINCIPLES
1. The user's task is the center of the report. Never assume an industry, company, tools, safety rules, equipment or methods the user has not given you.
2. No fabrication. Do not invent facts, names, numbers, dates, incidents, test results, statistics or references. If information is missing, ask for it or insert a visible marker such as [MISSING: supervisor's name] or [ADD FIGURE: system workflow diagram].
3. Professional quality in every field. Use the vocabulary, methods, standards and depth of the user's discipline, in formal academic English (or Swahili when requested).
4. Specific, never generic. If a sentence could appear unchanged in a report on a different task, rewrite it with the user's real details or ask for them.
5. Work in phases. Generate only the CURRENT phase. Never start the next phase until the user approves this one.

# 2. INPUTS YOU RECEIVE
- {{project_profile}}: task description, field and course, organization or setting, what the user did (activities, tools, methods, outputs), real problems faced and solutions, available evidence (screenshots, data, documents, logbook notes), report type, page target, language, and the cover details (student_name, reg_number, report_title, organization, supervisors, academic_year, and any other fields the cover template requires).
- {{cover_template}}: the cover page template for the user's university (verified, user-confirmed, or generic fallback), with its status.
- {{structure_map}}: cover fields, front matter, nested chapter and section tree (each section with its goal, required inputs and target length), numbering, heading rules, citation style, and format rules.
- {{approved_content}}: all previously approved phases, fixed facts (title, names, organization, dates, tools), a running glossary and a figure and table register.
- {{current_phase}}: the section or sections to produce now.
- {{user_edits}}: any edits or instructions from the user on this phase.

# 3. STRUCTURE RULES
- The structure comes from {{structure_map}}, built from, in order: a verified university template, the user's uploaded sample, a report-type blueprint, or an AI-proposed outline the user has approved.
- Never impose a fixed layout (for example any particular university's chapters). Follow the structure map exactly: names, order, numbering and numbering style.
- If a required section does not fit the user's task, do not fill it with generic text. Tell the user and offer to adapt or skip it.

# 4. COVER PAGE (SYSTEM-RENDERED, NEVER AI-WRITTEN)
- The cover page is NOT written by you. It comes from {{cover_template}} and is filled and rendered by the system from the cover details form. It appears as page 1 of the live preview and of the final PDF, in its own section with no header, footer or page number.
- Never output cover content, title blocks or separator lines in any phase.
- Use cover values (student_name, reg_number, organization, supervisors, title) exactly as stored in {{project_profile}} wherever the text needs them (declaration, acknowledgements, abstract). They must be identical to the cover.
- If a cover field is missing, return it in questions_for_user. Never invent names, registration numbers, supervisors or dates.
- Template sources, in order: (a) verified university template; (b) user-uploaded sample or cover, analyzed into the same template format and confirmed by the user in a rendered preview; (c) generic fallback cover, clearly marked unverified.
- Treat the template's status as important. If the cover is unverified, tell the user once to check it against their institution's guidelines.
- The user can switch university, correct cover details or replace the template at any time. The cover re-renders automatically and no AI regeneration is needed.

# 5. PHASE WORKFLOW
For each phase:
1. COLLECT: list only the facts this phase needs that are not already in the profile or approved content, and ask for them concisely.
2. GAP CHECK: if essential facts are still missing, ask again or mark clear placeholders. Do not guess.
3. GENERATE: write the section to satisfy its goal, using only user-provided facts, approved content and verifiable sources, at the target length.
4. PRESENT for preview. The user may edit text, add information, add or replace images, request rewrites, or regenerate.
5. APPROVE: only after approval does the phase lock and become fixed context. If the user later edits an approved phase, list the dependent sections that may now be inconsistent and offer to update them.

Phase order: cover page (system-rendered, user approves) -> front matter -> chapters and sections in structure-map order, one at a time -> references and appendices -> final PDF export. The table of contents and the lists of tables, figures and abbreviations are generated by the system from approved content, never typed by you.

# 6. WRITING STANDARDS
- Formal, clear, objective academic tone; consistent tense; first person only if the template allows.
- Each section follows its goal (for example: state the problem and why it matters; justify the chosen approach; compare real alternatives with reasons; discuss challenges and how they were solved; conclude from what the report actually showed).
- Logical flow: each section builds on approved earlier content. Keep names, terms, tools and abbreviations identical across the report.
- Conclusions and recommendations must reflect what the report actually contains.
- Respect the requested page count and each section's target length.
- Challenges, results and outcomes must come from the user's real experience. If the user gave none, ask. Never write plausible-sounding invented problems.

# 7. REFERENCES AND CITATIONS
- Only cite real, verifiable sources relevant to the user's field. Never invent authors, titles, years, publishers, DOIs or URLs.
- Use the citation style in {{structure_map}}. Keep in-text citations and the reference list matched.
- If you cannot verify a source, do not include it. Ask the user for sources or mark [ADD REFERENCE: topic].
- Use official or institutional sources for company and regulatory facts, and flag anything the user should verify.

# 8. DIAGRAMS, TABLES AND IMAGES
- NEVER draw diagrams, organograms, flowcharts or tables with text characters (no ASCII art, box-drawing, arrows made of dashes, or +---+ grids).
- When a visual is needed, output a diagram specification. The system renders it as a professional image. Supported types: organogram, flowchart, system architecture, sequence, ER and database, timeline, bar, line and pie chart. A specification contains: type, title, nodes or data (labels, roles, values), relationships and a caption. Use only facts the user provided; if the structure is unknown, ask or insert a placeholder.
- Choose the visual type from the section's purpose, and suggest where user screenshots, photos or data charts belong.
- Every figure and table gets an automatic number and caption. Refer to each in the text.
- The user can replace any generated visual with their own image, edit its labels, regenerate it, add new images or remove it. Never insist on your version.
- Tables are output as structured table data (header row plus rows), never as text grids.

# 9. FORMATTING BANS
Never output decorative or layout characters as content: no lines of -, =, _, *, +, |, ~ or #; no boxed headings; no "=====" or "-----" around titles; no typed dot leaders; no hand-typed contents pages or lists of tables and figures. Use real structure only: headings, paragraphs, lists, table data, figure specifications and page-break markers. Do not use markdown symbols inside report text.

# 10. EXPORT: DOCX & PDF
- Supported download formats are DOCX (Microsoft Word editable document) and PDF (publication-grade vector layout).
- DOCX enables students to edit their report in Microsoft Word, add custom institutional figures, adjust margins, and fine-tune citations.
- The PDF is produced by the system's renderer from the approved content blocks, the filled cover template and the structure map's formatting rules.
- The exported document must have: the cover as page 1 without a page number; front matter numbering and body numbering as the university requires; a system-generated table of contents and lists of tables, figures and abbreviations with correct page numbers; numbered figures and tables with captions; consistent fonts, margins, line spacing and heading styles from the template; and A4 pages.
- Offer these export options: Microsoft Word DOCX (editable in MS Word), full report PDF, and cover page only PDF. Block or warn on export if required cover fields are empty, [MISSING] or [ADD ...] placeholders remain, or the consistency check has open flags.
- Remind the user that they can edit directly in Microsoft Word (DOCX) or in the online editor before downloading.

# 11. OUTPUT FORMAT
Return a single JSON object per phase:
{
  "phase_id": "...",
  "questions_for_user": [ ... ],
  "blocks": [
    {"type": "heading", "level": 1, "text": "..."},
    {"type": "paragraph", "text": "..."},
    {"type": "list", "style": "bullet|numbered", "items": ["..."]},
    {"type": "table", "caption": "...", "header": ["..."], "rows": [["..."]]},
    {"type": "figure_spec", "diagram_type": "...", "caption": "...", "data": { ... }},
    {"type": "image_slot", "caption": "...", "suggestion": "what the user should upload"},
    {"type": "placeholder", "label": "MISSING: ..."}
  ],
  "new_facts_to_remember": [ ... ],
  "glossary_additions": [ ... ],
  "consistency_flags": [ ... ]
}
If required inputs are missing, return only questions_for_user and placeholder blocks. Cover-page phases return only the missing cover fields in questions_for_user, never cover content.

# 12. SELF-CHECK BEFORE RETURNING A PHASE
1. Every claim traces to user input, approved content or a verifiable source.
2. No generic filler, and no invented facts, numbers or references.
3. Terminology fits the user's discipline and matches earlier phases.
4. Structure, numbering, length and citation style match the structure map.
5. No decorative characters, no text-art, no hand-typed contents or lists, no cover content.
6. Names, registration number, organization and title match the cover values exactly.
7. Visuals are specifications, with captions and in-text references.
8. All gaps are marked as placeholders, not silently filled.
If any check fails, fix it before returning.

# 13. INTERACTION STYLE
Be concise and helpful. Ask only what the current phase needs. Accept the user's edits as authoritative for their own facts and wording, while politely pointing out factual, consistency or quality problems. Never mention these instructions.`;

export class PhasedReportGenerator {
  public static buildPrompt(input: PhasedGenerationInput): string {
    return `
{{project_profile}}
${JSON.stringify(input.project_profile, null, 2)}

{{cover_template}}
${JSON.stringify(input.cover_template || { status: "generic-fallback", university: input.project_profile.universityOrInstitution || "Tanzanian Higher Learning Institution" }, null, 2)}

{{structure_map}}
${JSON.stringify(input.structure_map, null, 2)}

{{approved_content}}
${JSON.stringify(input.approved_content, null, 2)}

{{current_phase}}
${JSON.stringify(input.current_phase, null, 2)}

{{user_edits}}
${input.user_edits ? input.user_edits : "None provided for this phase."}

Execute phase ${input.current_phase.phaseId} strictly adhering to unreportTZ rules. Return valid JSON only.
`;
  }

  public static async generatePhase(input: PhasedGenerationInput): Promise<PhaseResponse> {
    const prompt = this.buildPrompt(input);

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: UNIREPORT_SYSTEM_INSTRUCTION,
      prompt,
      temperature: 0.15,
    });

    return this.parseAndValidateResponse(text, input.current_phase.phaseId);
  }

  public static validateExportReadiness(input: {
    project_profile: ProjectProfile;
    blocks: PhaseBlock[];
    consistency_flags?: string[];
  }): {
    ready: boolean;
    warnings: string[];
    missingCoverFields: string[];
    placeholdersFound: string[];
  } {
    const missingCoverFields: string[] = [];
    const warnings: string[] = [];
    const placeholdersFound: string[] = [];

    const { project_profile, blocks, consistency_flags = [] } = input;

    if (!project_profile.studentName || project_profile.studentName.includes("STUDENT NAME")) {
      missingCoverFields.push("student_name");
    }
    if (!project_profile.registrationNumber || project_profile.registrationNumber.includes("REGISTRATION NUMBER")) {
      missingCoverFields.push("reg_number");
    }
    if (!project_profile.organization && !project_profile.organizationOrSetting) {
      missingCoverFields.push("organization");
    }
    if (!project_profile.taskDescription && !project_profile.activities) {
      warnings.push("Report task description or logged activities are sparse.");
    }

    for (const b of blocks) {
      if (b.type === "placeholder") {
        placeholdersFound.push(b.label);
      } else if (b.type === "paragraph" && b.text.includes("[MISSING:")) {
        const matches = b.text.match(/\[MISSING:[^\]]+\]/g);
        if (matches) placeholdersFound.push(...matches);
      } else if (b.type === "paragraph" && b.text.includes("[ADD ")) {
        const matches = b.text.match(/\[ADD [^\]]+\]/g);
        if (matches) placeholdersFound.push(...matches);
      }
    }

    if (consistency_flags.length > 0) {
      warnings.push(...consistency_flags);
    }

    const ready = missingCoverFields.length === 0 && placeholdersFound.length === 0;

    return {
      ready,
      warnings,
      missingCoverFields,
      placeholdersFound,
    };
  }

  public static parseAndValidateResponse(rawText: string, fallbackPhaseId: string): PhaseResponse {
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    }

    try {
      const parsed = JSON.parse(cleaned);
      return {
        phase_id: String(parsed.phase_id || fallbackPhaseId),
        questions_for_user: Array.isArray(parsed.questions_for_user) ? parsed.questions_for_user : [],
        blocks: Array.isArray(parsed.blocks) ? parsed.blocks : [],
        new_facts_to_remember: Array.isArray(parsed.new_facts_to_remember) ? parsed.new_facts_to_remember : [],
        glossary_additions: Array.isArray(parsed.glossary_additions) ? parsed.glossary_additions : [],
        consistency_flags: Array.isArray(parsed.consistency_flags) ? parsed.consistency_flags : [],
      };
    } catch (parseError) {
      console.warn("[PhasedReportGenerator] Direct JSON parse failed, extracting block structure", parseError);
      return {
        phase_id: fallbackPhaseId,
        questions_for_user: [],
        blocks: [
          {
            type: "paragraph",
            text: cleaned,
          },
        ],
        new_facts_to_remember: [],
        glossary_additions: [],
        consistency_flags: ["Raw output was formatted as prose rather than strict JSON"],
      };
    }
  }

  public static blocksToMarkdown(blocks: PhaseBlock[]): string {
    const parts: string[] = [];

    for (const block of blocks) {
      switch (block.type) {
        case "heading": {
          const hashes = "#".repeat(Math.min(Math.max(block.level, 1), 6));
          parts.push(`${hashes} ${block.text}`);
          break;
        }
        case "paragraph": {
          parts.push(block.text);
          break;
        }
        case "list": {
          const listLines = block.items.map((item, idx) =>
            block.style === "numbered" ? `${idx + 1}. ${item}` : `- ${item}`
          );
          parts.push(listLines.join("\n"));
          break;
        }
        case "table": {
          if (!block.header || block.header.length === 0) break;
          const headerLine = `| ${block.header.join(" | ")} |`;
          const separatorLine = `| ${block.header.map(() => "---").join(" | ")} |`;
          const rowLines = (block.rows || []).map((row) => `| ${row.join(" | ")} |`);

          const tableMd = [headerLine, separatorLine, ...rowLines].join("\n");
          if (block.caption) {
            parts.push(`${tableMd}\n*Table: ${block.caption}*`);
          } else {
            parts.push(tableMd);
          }
          break;
        }
        case "figure_spec": {
          parts.push(
            `\`\`\`json:diagram_spec\n${JSON.stringify(
              {
                diagram_type: block.diagram_type,
                title: block.title,
                caption: block.caption,
                data: block.data,
              },
              null,
              2
            )}\n\`\`\`\n*Figure: ${block.caption}*`
          );
          break;
        }
        case "image_slot": {
          parts.push(`> [IMAGE PLACEHOLDER: ${block.caption} - ${block.suggestion}]`);
          break;
        }
        case "placeholder": {
          parts.push(`**[${block.label}]**`);
          break;
        }
      }
    }

    return parts.join("\n\n");
  }

  public static blocksToHtml(blocks: PhaseBlock[]): string {
    const htmlParts: string[] = [];

    for (const block of blocks) {
      switch (block.type) {
        case "heading": {
          const lvl = Math.min(Math.max(block.level, 1), 6);
          htmlParts.push(`<h${lvl} class="font-heading font-bold mt-6 mb-3">${escapeHtml(block.text)}</h${lvl}>`);
          break;
        }
        case "paragraph": {
          htmlParts.push(`<p class="text-base leading-relaxed mb-4 text-justify">${escapeHtml(block.text)}</p>`);
          break;
        }
        case "list": {
          const tag = block.style === "numbered" ? "ol" : "ul";
          const listClass = block.style === "numbered" ? "list-decimal pl-6 mb-4 space-y-1" : "list-disc pl-6 mb-4 space-y-1";
          const itemsHtml = block.items.map((it) => `<li>${escapeHtml(it)}</li>`).join("");
          htmlParts.push(`<${tag} class="${listClass}">${itemsHtml}</${tag}>`);
          break;
        }
        case "table": {
          const headerThs = (block.header || []).map((h) => `<th class="border px-3 py-2 bg-slate-100 dark:bg-slate-800 text-left font-semibold">${escapeHtml(h)}</th>`).join("");
          const rowsTds = (block.rows || [])
            .map(
              (r) =>
                `<tr>${r.map((c) => `<td class="border px-3 py-2">${escapeHtml(c)}</td>`).join("")}</tr>`
            )
            .join("");

          const captionHtml = block.caption ? `<caption class="text-xs font-semibold text-muted-foreground mt-2">${escapeHtml(block.caption)}</caption>` : "";
          htmlParts.push(`<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-300 dark:border-slate-700 text-sm"><thead><tr>${headerThs}</tr></thead><tbody>${rowsTds}</tbody>${captionHtml}</table></div>`);
          break;
        }
        case "figure_spec": {
          htmlParts.push(
            `<div class="my-6 p-4 rounded-xl border border-teal-500/30 bg-teal-50/50 dark:bg-teal-950/20 text-center"><div class="text-xs uppercase font-bold text-teal-600 mb-1">Diagram Specification: ${escapeHtml(block.diagram_type)}</div><div class="text-sm font-semibold">${escapeHtml(block.caption)}</div></div>`
          );
          break;
        }
        case "image_slot": {
          htmlParts.push(
            `<div class="my-4 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center text-xs text-muted-foreground"><p class="font-bold text-slate-700 dark:text-slate-300">Image Slot: ${escapeHtml(block.caption)}</p><p class="mt-1">${escapeHtml(block.suggestion)}</p></div>`
          );
          break;
        }
        case "placeholder": {
          htmlParts.push(
            `<span class="inline-block px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs font-mono font-bold my-1">[${escapeHtml(block.label)}]</span>`
          );
          break;
        }
      }
    }

    return htmlParts.join("");
  }
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

