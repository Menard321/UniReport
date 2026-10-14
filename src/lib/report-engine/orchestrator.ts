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
