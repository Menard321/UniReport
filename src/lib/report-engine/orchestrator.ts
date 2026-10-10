export interface AssignmentInput {
  title: string;
  reportType: "FIELDWORK" | "FYP" | "DISSERTATION" | "LAB_REPORT" | "COURSEWORK";
  institution: string;
  faculty?: string;
  programme?: string;
  targetPages: number; // e.g. 5, 10, 15, 25
  citationStyle?: "APA7" | "IEEE" | "HARVARD";
  customTemplateText?: string;
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

  if (input.reportType === "FIELDWORK") {
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
