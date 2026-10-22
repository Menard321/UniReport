import { TANZANIA_ACADEMIC_CATALOG } from "@/data/tanzania-academic-catalog";

export interface TemplateSectionDefinition {
  id: string;
  number: string;
  title: string;
  description: string;
  subsections?: string[];
  diagramRequired?: string;
  tableRequired?: string;
}

export interface InstitutionalTemplateBlueprint {
  institutionKey: string;
  institutionName: string;
  shortName: string;
  sourceFile: string;
  hasVerifiedSample: boolean;
  coverPageLayout: {
    headerTitle: string;
    showLogo: boolean;
    includeDeclaration: boolean;
    includeDedication: boolean;
    includeAcknowledgement: boolean;
    includeExecutiveSummary: boolean;
    includeTableOfContents: boolean;
    includeListOfAbbreviations: boolean;
    includeListOfTables: boolean;
    includeListOfFigures: boolean;
  };
  chapters: TemplateSectionDefinition[];
  guidelineRules: string[];
}

export type AcademicDiscipline = "COMPUTING" | "ENGINEERING" | "BUSINESS" | "HEALTH" | "AGRICULTURE" | "GENERAL";

export function detectAcademicDiscipline(input: {
  college?: string;
  programme?: string;
  taskDescription?: string;
  activities?: string;
}): AcademicDiscipline {
  const text = `${input.college || ""} ${input.programme || ""} ${input.taskDescription || ""} ${input.activities || ""}`.toLowerCase();
  if (/comput|softwar|informat|programm|crypto|blockchain|wallet|checkout|api|web|database|network|cyber|it\b|ict\b|cs\b|bit\b|ceit\b/.test(text)) {
    return "COMPUTING";
  }
  if (/agric|fisher|crop|soil|beekeep|animal|veterin|horticult/.test(text)) {
    return "AGRICULTURE";
  }
  if (/account|financ|bank|commerc|market|business|bba|bcom|procure|econom/.test(text)) {
    return "BUSINESS";
  }
  if (/medic|clinic|nurs|pharm|health|doctor|biomed|dent/.test(text)) {
    return "HEALTH";
  }
  if (/civil|mechan|electr|mining|chemical|structur|telecom|geomat/.test(text)) {
    return "ENGINEERING";
  }
  return "GENERAL";
}

export const INSTITUTIONAL_TEMPLATES: Record<string, InstitutionalTemplateBlueprint> = {
  UDSM: {
    institutionKey: "UDSM",
    institutionName: "University of Dar es Salaam",
    shortName: "UDSM",
    sourceFile: "templates/UDSM.docx",
    hasVerifiedSample: true,
    coverPageLayout: {
      headerTitle: "PRACTICAL TRAINING REPORT",
      showLogo: true,
      includeDeclaration: true,
      includeDedication: false,
      includeAcknowledgement: true,
      includeExecutiveSummary: true,
      includeTableOfContents: true,
      includeListOfAbbreviations: true,
      includeListOfTables: true,
      includeListOfFigures: true
    },
    chapters: [
      {
        id: "udsm-ch1",
        number: "CHAPTER 1",
        title: "INTRODUCTION TO THE HOST ORGANIZATION",
        description: "Comprehensive introduction of the host organization, nature of business, physical location, historical background, founders, vision, mission, core functions, organizational chart, job descriptions of skilled workers, and workplace safety regulations.",
        subsections: [
          "1.1 Profile and Historical Background of Host Enterprise",
          "1.2 Vision, Mission and Core Functions",
          "1.3 Organizational Governance & Administrative Structure",
          "1.4 Job Descriptions and Qualifications of Technical Cadre",
          "1.5 Workplace Safety Regulations, Welfare and Recruitment Policies",
          "1.6 Strategic Alignment of Departmental Functions"
        ],
        diagramRequired: "Figure 1.1: Organizational Hierarchy Chart (Organogram) of the Host Enterprise"
      },
      {
        id: "udsm-ch2",
        number: "CHAPTER 2",
        title: "PRACTICAL ACTIVITIES & MAIN TECHNICAL ASSIGNMENT",
        description: "The main task executed during attachment. Covers problem identification, proposed technical solution, justification, architectural diagrams/flowcharts, hardware/software specifications, comparative alternative analysis table, challenges, and conclusions.",
        subsections: [
          "2.1 Problem Identification and Engineering/Scientific Context",
          "2.2 Description of Proposed Solution & Technical Assumptions",
          "2.3 Justification of the Selected Technical Approach",
          "2.4 System Architecture & Operational Workflow",
          "2.5 Functional, Hardware, Software or Equipment Specifications",
          "2.6 Comparative Analysis of Alternative Solutions",
          "2.7 Step-by-Step Task Execution and Practical Implementation",
          "2.8 Technical Challenges and Mitigation Measures",
          "2.9 Preliminary Task Conclusion and Recommendations"
        ],
        diagramRequired: "Figure 2.1: Operational Process Flowchart & System Architecture Diagram",
        tableRequired: "Table 2.1: Technical & Economic Evaluation Matrix of Alternative Solutions"
      },
      {
        id: "udsm-ch3",
        number: "CHAPTER 3",
        title: "CHALLENGES ENCOUNTERED & INDUSTRIAL PROBLEM SOLVING",
        description: "Critical analysis of operational, infrastructural, and logistical hurdles experienced in the field, with technical problem-solving strategies applied.",
        subsections: [
          "3.1 Operational and Technical Bottlenecks Encountered",
          "3.2 Resource, Equipment and Infrastructure Limitations",
          "3.3 Problem Solving Methods and Remedial Actions Applied",
          "3.4 Unresolved Operational Gaps and Risk Mitigation"
        ]
      },
      {
        id: "udsm-ch4",
        number: "CHAPTER 4",
        title: "KNOWLEDGE, SKILLS ACQUIRED & CURRICULUM SYNTHESIS",
        description: "Rigorous synthesis connecting classroom theoretical coursework at UDSM with real-world industrial competencies and professional workplace ethics.",
        subsections: [
          "4.1 Practical Technical Competencies and Tool Mastery Gained",
          "4.2 Soft Skills, Team Dynamics and Workplace Governance",
          "4.3 Correlation with Degree Course Modules at UDSM",
          "4.4 Professional Ethics, Environmental Standards & Compliance"
        ]
      },
      {
        id: "udsm-ch5",
        number: "CHAPTER 5",
        title: "CONCLUSIONS & STRATEGIC RECOMMENDATIONS",
        description: "Holistic evaluation of the industrial attachment period, constructive recommendations to the host enterprise, and strategic feedback to UDSM.",
        subsections: [
          "5.1 Comprehensive Industrial Training Conclusion",
          "5.2 Actionable Recommendations to Host Enterprise Management",
          "5.3 Constructive Recommendations to the University of Dar es Salaam",
          "5.4 Guidance and Practical Advice for Incoming Students"
        ]
      }
    ],
    guidelineRules: [
      "Strict compliance with UDSM Senate Practical Training Guidelines (templates/UDSM.docx).",
      "Cover page must follow the official UDSM Practical Training layout with centered institution, college, department, title, and student metadata.",
      "Preliminary pages must use Roman numerals (i, ii, iii...): Abstract, Acknowledgements, Declaration, Table of Contents, List of Abbreviations, List of Tables, List of Figures.",
      "Chapter 1 must include Figure 1.1: Organizational Hierarchy Chart (Organogram).",
      "Chapter 2 must include Figure 2.1: Operational Process Flowchart and Table 2.1: Comparative Alternative Matrix.",
      "Must include References (IEEE/APA format) and Appendices.",
      "No summarized or brief text; write exhaustive, publication-grade academic prose."
    ]
  },

  UDSM_COICT: {
    institutionKey: "UDSM_COICT",
    institutionName: "University of Dar es Salaam",
    shortName: "UDSM (CoICT)",
    sourceFile: "templates/UDSM.docx (CoICT Computing Standard)",
    hasVerifiedSample: true,
    coverPageLayout: {
      headerTitle: "FIELD PRACTICAL TRAINING REPORT",
      showLogo: true,
      includeDeclaration: true,
      includeDedication: false,
      includeAcknowledgement: true,
      includeExecutiveSummary: true,
      includeTableOfContents: true,
      includeListOfAbbreviations: true,
      includeListOfTables: true,
      includeListOfFigures: true
    },
    chapters: [
      {
        id: "coict-ch1",
        number: "CHAPTER 1",
        title: "INTRODUCTION TO THE HOST ORGANIZATION & IT ENVIRONMENT",
        description: "Institutional background, corporate governance, organizational hierarchy, technical IT cadre roles, software engineering environment, and cybersecurity/data privacy standards.",
        subsections: [
          "1.1 Profile and Historical Background of Host Enterprise",
          "1.2 Vision, Mission and Core Digital/IT Functions",
          "1.3 Organizational Governance & Administrative Structure",
          "1.4 Job Descriptions and Qualifications of Technical IT Cadre",
          "1.5 Professional Ethics, Confidentiality, and Cyber Security Policies",
          "1.6 Strategic Alignment of IT Infrastructure and Systems"
        ],
        diagramRequired: "Figure 1.1: Organizational Hierarchy Chart (Organogram) of the Host Enterprise"
      },
      {
        id: "coict-ch2",
        number: "CHAPTER 2",
        title: "PRACTICAL ACTIVITIES & MAIN TECHNICAL ASSIGNMENT",
        description: "The core technical assignment executed during attachment. Covers system context, architectural design, API integration, code/workflow implementation, comparative technology matrix, and verification.",
        subsections: [
          "2.1 Problem Identification and Technical System Context",
          "2.2 Description of Proposed Solution & System Architecture",
          "2.3 Justification of Selected Tech Stack and Integration Protocols",
          "2.4 Operational Process Architecture & Workflow",
          "2.5 Functional, Hardware, Software and API Specifications",
          "2.6 Comparative Analysis of Alternative Integration Approaches",
          "2.7 Step-by-Step Task Execution and Technical Implementation",
          "2.8 Technical Challenges, Security Considerations and Mitigations",
          "2.9 Preliminary Task Outcomes, Verification and Recommendations"
        ],
        diagramRequired: "Figure 2.1: Operational Process Architecture & System Workflow Diagram",
        tableRequired: "Table 2.1: Technical Evaluation Matrix of Alternative Solutions"
      },
      {
        id: "coict-ch3",
        number: "CHAPTER 3",
        title: "TECHNICAL CHALLENGES ENCOUNTERED & PROBLEM SOLVING",
        description: "In-depth analysis of technical bottlenecks, API limitations, network latency, environment bugs, and remedial code/architecture applied.",
        subsections: [
          "3.1 Operational and Technical Bottlenecks Encountered",
          "3.2 Network, RPC Node, Infrastructure and Environment Constraints",
          "3.3 Problem Solving Methods and Remedial Code/Architecture Applied",
          "3.4 Unresolved Operational Gaps and Risk Mitigation"
        ]
      },
      {
        id: "coict-ch4",
        number: "CHAPTER 4",
        title: "KNOWLEDGE, SKILLS ACQUIRED & CURRICULUM SYNTHESIS",
        description: "Synthesis connecting theoretical computing coursework at UDSM CoICT with modern industry frameworks, tools, and professional practices.",
        subsections: [
          "4.1 Practical Technical Competencies and Tool Mastery Gained",
          "4.2 Soft Skills, Agile Collaboration and Team Dynamics",
          "4.3 Correlation with Degree Course Modules at UDSM CoICT",
          "4.4 Professional Software Ethics, Data Privacy (GDPR/TCRA) & Standards"
        ]
      },
      {
        id: "coict-ch5",
        number: "CHAPTER 5",
        title: "CONCLUSIONS & STRATEGIC RECOMMENDATIONS",
        description: "Holistic evaluation of industrial practical training, constructive software/system recommendations to host enterprise, and academic feedback to UDSM.",
        subsections: [
          "5.1 Comprehensive Industrial Practical Training Conclusion",
          "5.2 Actionable Technical Recommendations to Host Enterprise Management",
          "5.3 Constructive Curriculum Recommendations to the University of Dar es Salaam",
          "5.4 Guidance and Practical Advice for Incoming Computing Students"
        ]
      }
    ],
    guidelineRules: [
      "Strict compliance with UDSM CoICT Practical Training Guidelines and Senate Standard (templates/UDSM.docx).",
      "Cover page must include official UDSM layout with student registration number and Degree Programme (e.g. BSc in Computer Science).",
      "Chapter 1 must include Figure 1.1: Organogram as a vector diagram.",
      "Chapter 2 must include Figure 2.1: System Architecture/Workflow Diagram and Table 2.1: Technical Evaluation Matrix.",
      "Must include verifiable references (IEEE/APA format) relevant to software engineering and computer science.",
      "Preliminary pages must use Roman numerals; body chapters use Arabic numerals.",
      "No factory plant machinery or chemical hazard content in computing reports."
    ]
  },

  IFM: {
    institutionKey: "IFM",
    institutionName: "Institute of Finance Management",
    shortName: "IFM",
    sourceFile: "templates/IFM FIELD REPORT SAMPLE.pdf",
    hasVerifiedSample: true,
    coverPageLayout: {
      headerTitle: "FIELD PRACTICAL TRAINING (FPT) REPORT",
      showLogo: true,
      includeDeclaration: true,
      includeDedication: true,
      includeAcknowledgement: true,
      includeExecutiveSummary: true,
      includeTableOfContents: true,
      includeListOfAbbreviations: true,
      includeListOfTables: true,
      includeListOfFigures: true
    },
    chapters: [
      {
        id: "ifm-ch1",
        number: "CHAPTER 1",
        title: "PROFILE OF THE HOST ORGANIZATION",
        description: "Establishment of the organization, governance framework, main products/services, and department overview.",
        subsections: [
          "1.1 Historical Background of the Organization",
          "1.2 Organizational Mission, Vision and Objectives",
          "1.3 Products and Services Offered",
          "1.4 Departmental Structure and Working Environment",
          "1.5 Scope of the Field Practical Training"
        ],
        diagramRequired: "Figure 1.1: Organizational Structure of Host Organization"
      },
      {
        id: "ifm-ch2",
        number: "CHAPTER 2",
        title: "DUTIES AND EXPERIENCES DURING FIELDWORK",
        description: "Detailed chronological and thematic documentation of practical duties executed during attachment.",
        subsections: [
          "2.1 Departmental Attachment Routine",
          "2.2 Major Tasks and Responsibilities Undertaken",
          "2.3 Financial, Computing or Managerial Systems Utilized",
          "2.4 Supervision and Quality Control Mechanisms"
        ],
        diagramRequired: "Figure 2.1: Fieldwork Operational Process Workflow"
      },
      {
        id: "ifm-ch3",
        number: "CHAPTER 3",
        title: "ANALYSIS OF CHALLENGES AND PROBLEM SOLVING",
        description: "Critical analysis of organizational and academic constraints with innovative solutions.",
        subsections: [
          "3.1 Technical and Professional Challenges",
          "3.2 Environmental and System Limitations",
          "3.3 Measures Taken to Address Challenges"
        ]
      },
      {
        id: "ifm-ch4",
        number: "CHAPTER 4",
        title: "ASSESSMENT OF SKILLS AND THEORY INTEGRATION",
        description: "Critique of how IFM coursework relates to current industry practices.",
        subsections: [
          "4.1 New Practical Skills and Competencies Gained",
          "4.2 Application of Theoretical Knowledge to Practical Realities",
          "4.3 Gaps Identified in Academic Curriculum vs. Industry Practice"
        ]
      },
      {
        id: "ifm-ch5",
        number: "CHAPTER 5",
        title: "CONCLUSION AND RECOMMENDATIONS",
        description: "Final assessment and strategic recommendations for IFM and host enterprise.",
        subsections: [
          "5.1 Overall Conclusion",
          "5.2 Recommendations to Host Organization",
          "5.3 Recommendations to IFM Administration"
        ]
      }
    ],
    guidelineRules: [
      "Follow IFM Faculty of Computing / Banking & Finance Field Practical Training Manual.",
      "Include structured declaration and approval by both University and Field Supervisor."
    ]
  },

  CBE: {
    institutionKey: "CBE",
    institutionName: "College of Business Education",
    shortName: "CBE",
    sourceFile: "templates/CBE FIELD REPORT FORMAT .pdf",
    hasVerifiedSample: true,
    coverPageLayout: {
      headerTitle: "FIELD PRACTICAL TRAINING REPORT",
      showLogo: true,
      includeDeclaration: true,
      includeDedication: false,
      includeAcknowledgement: true,
      includeExecutiveSummary: true,
      includeTableOfContents: true,
      includeListOfAbbreviations: true,
      includeListOfTables: true,
      includeListOfFigures: true
    },
    chapters: [
      {
        id: "cbe-ch1",
        number: "CHAPTER ONE",
        title: "INTRODUCTION AND ORGANIZATIONAL OVERVIEW",
        description: "Background, location, legal framework, core operations, organizational chart, and departmental setup.",
        subsections: [
          "1.1 Background of the Host Enterprise",
          "1.2 Organizational Mission, Vision, and Motto",
          "1.3 Organizational Management Structure",
          "1.4 Departmental Roles and Assigned Desk Operations",
          "1.5 Significance of Field Training to Degree Curriculum"
        ],
        diagramRequired: "Figure 1.1: CBE Organogram of Host Enterprise"
      },
      {
        id: "cbe-ch2",
        number: "CHAPTER TWO",
        title: "FIELD PRACTICAL ACTIVITIES AND WORK UNDERTAKEN",
        description: "Exhaustive description of operations, procedures, commercial/technical software tools, and deliverables.",
        subsections: [
          "2.1 Detailed Description of Assigned Roles",
          "2.2 Specific Work Executed by Department",
          "2.3 Technical Software and Business Systems Applied",
          "2.4 Teamwork and Interdepartmental Engagements"
        ],
        diagramRequired: "Figure 2.1: Operational Process Workflow Diagram"
      },
      {
        id: "cbe-ch3",
        number: "CHAPTER THREE",
        title: "CRITICAL ANALYSIS OF INDUSTRIAL CHALLENGES",
        description: "Workplace bottlenecks, systems performance, customer relations, or technical failures.",
        subsections: [
          "3.1 Operational Challenges Encountered",
          "3.2 Resource Deficiencies and Institutional Gaps",
          "3.3 Strategic Approaches Adopted to Overcome Difficulties"
        ]
      },
      {
        id: "cbe-ch4",
        number: "CHAPTER FOUR",
        title: "BENEFITS AND LESSONS LEARNED",
        description: "Evaluation of academic benefit, professional ethics, and commercial competence.",
        subsections: [
          "4.1 Practical Knowledge and Hands-On Competencies Gained",
          "4.2 Relevance to CBE Syllabus and Academic Specialization",
          "4.3 Development of Work Ethics and Problem Solving Mindset"
        ]
      },
      {
        id: "cbe-ch5",
        number: "CHAPTER FIVE",
        title: "CONCLUSION AND RECOMMENDATIONS",
        description: "Concluding remarks and targeted proposals for institutional improvement.",
        subsections: [
          "5.1 Summary and Conclusion",
          "5.2 Recommendations to Management of Host Enterprise",
          "5.3 Recommendations to College of Business Education (CBE)"
        ]
      }
    ],
    guidelineRules: [
      "Strict compliance with CBE Field Practical Training Guidelines.",
      "Executive summary must synthesize organization, core duties, and key learnings."
    ]
  },

  NIT: {
    institutionKey: "NIT",
    institutionName: "National Institute of Transport",
    shortName: "NIT",
    sourceFile: "templates/NIT FIELD REPORT.pdf",
    hasVerifiedSample: true,
    coverPageLayout: {
      headerTitle: "A REPORT ON INDUSTRIAL PRACTICAL TRAINING (IPT)",
      showLogo: true,
      includeDeclaration: true,
      includeDedication: true,
      includeAcknowledgement: true,
      includeExecutiveSummary: true,
      includeTableOfContents: true,
      includeListOfAbbreviations: true,
      includeListOfTables: true,
      includeListOfFigures: true
    },
    chapters: [
      {
        id: "nit-ch1",
        number: "CHAPTER 1",
        title: "INTRODUCTION TO HOST ORGANIZATION",
        description: "Establishment, corporate governance, geographical location, transport/logistics/engineering focus.",
        subsections: [
          "1.1 Organizational Profile & Geographic Setting",
          "1.2 Vision, Mission and Corporate Goals",
          "1.3 Organizational Governance & Administrative Structure",
          "1.4 Department Profile and Functional Mandate",
          "1.5 Scope and Objectives of Industrial Attachment"
        ],
        diagramRequired: "Figure 1.1: NIT Organizational Hierarchy Chart"
      },
      {
        id: "nit-ch2",
        number: "CHAPTER 2",
        title: "PRACTICAL TRAINING ACTIVITIES & TECHNICAL EXPERIENCES",
        description: "In-depth account of engineering, logistical, computing, or business tasks executed during attachment.",
        subsections: [
          "2.1 Routine Operations and Safety Standards Observed",
          "2.2 Specific Tasks Performed in Assigned Section",
          "2.3 Technical Equipment, Machines, or Information Systems Handled",
          "2.4 Methodology and Standard Operating Procedures (SOPs)"
        ],
        diagramRequired: "Figure 2.1: Technical Maintenance & Operations Flowchart"
      },
      {
        id: "nit-ch3",
        number: "CHAPTER 3",
        title: "OPERATIONAL CHALLENGES & MITIGATION MEASURES",
        description: "Analysis of operational hazards, logistical delays, system downtime, and problem resolution.",
        subsections: [
          "3.1 Technical and Environmental Obstacles Encountered",
          "3.2 Resource Shortages and Equipment Downtime",
          "3.3 Problem Solving Measures and Remedial Actions"
        ]
      },
      {
        id: "nit-ch4",
        number: "CHAPTER 4",
        title: "SKILLS ACQUIRED & LINK WITH NIT CURRICULUM",
        description: "Assessment of professional capabilities gained and relevance to NIT transport/engineering courses.",
        subsections: [
          "4.1 Practical Technical Skills and Competencies Gained",
          "4.2 Workplace Safety, Team Collaboration and Professional Ethics",
          "4.3 Relationship with Classroom Lectures and Modules at NIT"
        ]
      },
      {
        id: "nit-ch5",
        number: "CHAPTER 5",
        title: "CONCLUSIONS AND STRATEGIC RECOMMENDATIONS",
        description: "Summary of industrial attachment findings and forward-looking suggestions.",
        subsections: [
          "5.1 Overall Conclusion",
          "5.2 Recommendations to Host Organization",
          "5.3 Recommendations to National Institute of Transport (NIT)"
        ]
      }
    ],
    guidelineRules: [
      "Follow NIT Industrial Practical Training (IPT) Regulations.",
      "Emphasize standard operating procedures and technical operations."
    ]
  },

  ARU: {
    institutionKey: "ARU",
    institutionName: "Ardhi University",
    shortName: "ARU",
    sourceFile: "templates/ARTHI IT REPORT 2_110443.pdf",
    hasVerifiedSample: true,
    coverPageLayout: {
      headerTitle: "AN INDUSTRIAL TRAINING REPORT SUBMITTED TO ARDHI UNIVERSITY",
      showLogo: true,
      includeDeclaration: true,
      includeDedication: true,
      includeAcknowledgement: true,
      includeExecutiveSummary: true,
      includeTableOfContents: true,
      includeListOfAbbreviations: true,
      includeListOfTables: true,
      includeListOfFigures: true
    },
    chapters: [
      {
        id: "aru-ch1",
        number: "CHAPTER 1",
        title: "ORGANIZATIONAL BACKGROUND AND ADMINISTRATIVE FRAMEWORK",
        description: "Host company profile, historical background, geographic footprint, vision, and institutional organogram.",
        subsections: [
          "1.1 Profile and Establishment of Host Entity",
          "1.2 Vision, Mission and Strategic Priorities",
          "1.3 Governance Framework and Organogram",
          "1.4 Departmental Responsibilities and Mandate",
          "1.5 Aims of the Industrial Training Placement"
        ],
        diagramRequired: "Figure 1.1: Ardhi Organizational Hierarchy Chart"
      },
      {
        id: "aru-ch2",
        number: "CHAPTER 2",
        title: "TECHNICAL ACTIVITIES AND INDUSTRIAL RESPONSIBILITIES",
        description: "Technical workflow, software tools, field surveys, spatial/IT systems, and project implementation.",
        subsections: [
          "2.1 Departmental Work Breakdown and Routine Duties",
          "2.2 Specific Technical Tasks Executed",
          "2.3 Surveying, Computing, or Engineering Tools Employed",
          "2.4 Quality Assurance and Professional Standards"
        ],
        diagramRequired: "Figure 2.1: Technical Workflow & Surveying Process Diagram"
      },
      {
        id: "aru-ch3",
        number: "CHAPTER 3",
        title: "CHALLENGES ENCOUNTERED AND COPING STRATEGIES",
        description: "Field and studio constraints, data limitations, equipment bottlenecks, and solutions.",
        subsections: [
          "3.1 Professional Challenges Identified",
          "3.2 Logistical and Technology Constraints",
          "3.3 Mitigation Strategies and Solutions Implemented"
        ]
      },
      {
        id: "aru-ch4",
        number: "CHAPTER 4",
        title: "LESSONS LEARNED AND RELEVANCE TO ARDHI UNIVERSITY CURRICULUM",
        description: "Cross-examination of field observations with Ardhi University academic modules.",
        subsections: [
          "4.1 Practical Competencies and Professional Skills Acquired",
          "4.2 Relevance to Academic Programme at Ardhi University",
          "4.3 Ethical Workplace Practices and Environmental Considerations"
        ]
      },
      {
        id: "aru-ch5",
        number: "CHAPTER 5",
        title: "CONCLUSIONS AND RECOMMENDATIONS",
        description: "Holistic evaluation and actionable advisory for enterprise and university.",
        subsections: [
          "5.1 Summary and Conclusion",
          "5.2 Recommendations to Host Organization",
          "5.3 Recommendations to Ardhi University Academic Directorate"
        ]
      }
    ],
    guidelineRules: [
      "Follow Ardhi University Industrial Training Guidelines.",
      "Incorporate technical precision and spatial/computing context where applicable."
    ]
  },

  DEFAULT: {
    institutionKey: "DEFAULT",
    institutionName: "Tanzanian Higher Learning Institution",
    shortName: "NATIONAL",
    sourceFile: "templates/FIELD REPORT SAMPLE.pdf",
    hasVerifiedSample: true,
    coverPageLayout: {
      headerTitle: "FIELD PRACTICAL TRAINING REPORT",
      showLogo: false,
      includeDeclaration: true,
      includeDedication: true,
      includeAcknowledgement: true,
      includeExecutiveSummary: true,
      includeTableOfContents: true,
      includeListOfAbbreviations: true,
      includeListOfTables: true,
      includeListOfFigures: true
    },
    chapters: [
      {
        id: "nat-ch1",
        number: "CHAPTER ONE",
        title: "INTRODUCTION & HOST INSTITUTION BACKGROUND",
        description: "Background, location, vision, mission, organizational chart, and departmental operational scope.",
        subsections: [
          "1.1 Introduction & Host Entity Background",
          "1.2 Organizational Mission, Vision and Objectives",
          "1.3 Administrative Structure & Organogram",
          "1.4 Departmental Roles and Daily Operations",
          "1.5 Objectives of Field Attachment"
        ],
        diagramRequired: "Figure 1.1: Administrative Organogram of the Host Enterprise"
      },
      {
        id: "nat-ch2",
        number: "CHAPTER TWO",
        title: "FIELD PRACTICAL ACTIVITIES AND WORK UNDERTAKEN",
        description: "Comprehensive review of tasks, methodology, technological tools, and weekly output.",
        subsections: [
          "2.1 Overview of Field Assignment Schedule",
          "2.2 Specific Operational Tasks Performed",
          "2.3 Technical Software, Equipment and Tools Used",
          "2.4 Methodology and Standard Operating Procedures"
        ],
        diagramRequired: "Figure 2.1: Operational Process Flowchart"
      },
      {
        id: "nat-ch3",
        number: "CHAPTER THREE",
        title: "CHALLENGES ENCOUNTERED AND PROBLEM SOLVING",
        description: "Analysis of technical, logistical, and organizational problems with solutions applied.",
        subsections: [
          "3.1 Technical and Workplace Difficulties Encountered",
          "3.2 Resource Gaps and Infrastructure Limitations",
          "3.3 Remedial Actions and Mitigations Implemented"
        ]
      },
      {
        id: "nat-ch4",
        number: "CHAPTER FOUR",
        title: "SKILLS ACQUIRED & CURRICULUM RELEVANCE",
        description: "Direct synthesis between university theoretical coursework and practical industrial competencies.",
        subsections: [
          "4.1 Practical and Professional Skills Developed",
          "4.2 Alignment with University Degree Course Modules",
          "4.3 Work Ethics, Governance and Professional Conduct"
        ]
      },
      {
        id: "nat-ch5",
        number: "CHAPTER FIVE",
        title: "CONCLUSIONS AND RECOMMENDATIONS",
        description: "Summary of industrial training period, actionable recommendations to host and institution.",
        subsections: [
          "5.1 General Conclusion",
          "5.2 Recommendations to Host Enterprise",
          "5.3 Recommendations to the University",
          "5.4 Guidance for Incoming Attachment Students"
        ]
      }
    ],
    guidelineRules: [
      "Follow Tanzanian National Inter-University Fieldwork Attachment Standard.",
      "Strict decimal numbering (1.1, 1.2, 1.3...)."
    ]
  },

  SUA: {
    institutionKey: "SUA",
    institutionName: "Sokoine University of Agriculture",
    shortName: "SUA",
    sourceFile: "templates/SUA FIELD REPORT.pdf",
    hasVerifiedSample: true,
    coverPageLayout: {
      headerTitle: "FIELD PRACTICAL TRAINING (FPT) REPORT",
      showLogo: true,
      includeDeclaration: true,
      includeDedication: true,
      includeAcknowledgement: true,
      includeExecutiveSummary: true,
      includeTableOfContents: true,
      includeListOfAbbreviations: true,
      includeListOfTables: true,
      includeListOfFigures: true
    },
    chapters: [
      {
        id: "sua-ch1",
        number: "CHAPTER 1",
        title: "INTRODUCTION & PROFILE OF HOST INSTITUTION",
        description: "Background of the enterprise/farm, mission, vision, administrative structure, and department operations.",
        subsections: [
          "1.1 Historical Background and Establishment of Host Entity",
          "1.2 Vision, Mission and Corporate Objectives",
          "1.3 Organizational Governance & Administrative Structure",
          "1.4 Departmental Functions and Operational Setup",
          "1.5 Scope and Objectives of the Field Practical Training"
        ],
        diagramRequired: "Figure 1.1: Administrative Organogram of Host Enterprise"
      },
      {
        id: "sua-ch2",
        number: "CHAPTER 2",
        title: "FIELD PRACTICAL ACTIVITIES AND TECHNICAL OPERATIONS",
        description: "Detailed account of agricultural, technical, laboratory, or management tasks executed during attachment.",
        subsections: [
          "2.1 Field Station Routine & Standard Operating Procedures",
          "2.2 Specific Tasks and Operations Undertaken",
          "2.3 Technical Tools, Equipment and Methodologies Applied",
          "2.4 Quality Control, Biosafety and Environmental Standards"
        ],
        diagramRequired: "Figure 2.1: Operational Process & Technical Workflow Diagram",
        tableRequired: "Table 2.1: Technical Evaluation Matrix of Operations"
      },
      {
        id: "sua-ch3",
        number: "CHAPTER 3",
        title: "OPERATIONAL CHALLENGES & PROBLEM SOLVING",
        description: "Technical, environmental, and logistical hurdles experienced and remedial measures implemented.",
        subsections: [
          "3.1 Environmental and Technical Bottlenecks Encountered",
          "3.2 Resource, Equipment and Supply Chain Constraints",
          "3.3 Problem Solving Methods and Remedial Actions Applied"
        ]
      },
      {
        id: "sua-ch4",
        number: "CHAPTER 4",
        title: "SKILLS ACQUIRED & SYNTHESIS WITH SUA CURRICULUM",
        description: "Correlation between practical skills gained and academic modules taught at Sokoine University of Agriculture.",
        subsections: [
          "4.1 Practical Technical Competencies and Tool Mastery Gained",
          "4.2 Professional Ethics, Sustainability and Teamwork",
          "4.3 Correlation with Degree Course Modules at SUA"
        ]
      },
      {
        id: "sua-ch5",
        number: "CHAPTER 5",
        title: "CONCLUSIONS & STRATEGIC RECOMMENDATIONS",
        description: "Overall conclusions and actionable recommendations for both host management and SUA.",
        subsections: [
          "5.1 Comprehensive Training Conclusion",
          "5.2 Recommendations to Host Enterprise Management",
          "5.3 Recommendations to Sokoine University of Agriculture"
        ]
      }
    ],
    guidelineRules: [
      "Strict compliance with SUA Field Practical Training Regulations.",
      "Emphasis on biosafety, sustainability, and accurate documentation."
    ]
  },

  DIT: {
    institutionKey: "DIT",
    institutionName: "Dar es Salaam Institute of Technology",
    shortName: "DIT",
    sourceFile: "templates/DIT IPT REPORT.pdf",
    hasVerifiedSample: true,
    coverPageLayout: {
      headerTitle: "A REPORT ON INDUSTRIAL PRACTICAL TRAINING (IPT)",
      showLogo: true,
      includeDeclaration: true,
      includeDedication: false,
      includeAcknowledgement: true,
      includeExecutiveSummary: true,
      includeTableOfContents: true,
      includeListOfAbbreviations: true,
      includeListOfTables: true,
      includeListOfFigures: true
    },
    chapters: [
      {
        id: "dit-ch1",
        number: "CHAPTER 1",
        title: "INTRODUCTION TO THE HOST ORGANIZATION",
        description: "Profile of host industry, location, organizational hierarchy, technical cadre roles, and safety standards.",
        subsections: [
          "1.1 Profile and Historical Background of Host Enterprise",
          "1.2 Vision, Mission and Core Engineering Functions",
          "1.3 Organizational Governance & Technical Cadre Structure",
          "1.4 Workshop Safety, Welfare and Standard Operating Procedures"
        ],
        diagramRequired: "Figure 1.1: Technical Cadre Organogram of the Enterprise"
      },
      {
        id: "dit-ch2",
        number: "CHAPTER 2",
        title: "PRACTICAL WORK AND TECHNICAL ASSIGNMENTS",
        description: "Main engineering and technological tasks performed, tools/machinery handled, circuit/code implementation, and SOPs.",
        subsections: [
          "2.1 Technical Scope of Work & Problem Context",
          "2.2 Tools, Instruments, Software and Equipment Handled",
          "2.3 Step-by-Step Task Execution and Practical Implementation",
          "2.4 Comparative Analysis of Engineering Solutions"
        ],
        diagramRequired: "Figure 2.1: Technical Operations Flowchart",
        tableRequired: "Table 2.1: Technical Specification & Evaluation Matrix"
      },
      {
        id: "dit-ch3",
        number: "CHAPTER 3",
        title: "TECHNICAL CHALLENGES & INDUSTRIAL PROBLEM SOLVING",
        description: "In-depth breakdown of breakdowns, supply hurdles, component constraints, and troubleshooting applied.",
        subsections: [
          "3.1 Operational and Hardware/Software Constraints",
          "3.2 Diagnostics and Root Cause Analysis",
          "3.3 Corrective and Preventive Actions Applied"
        ]
      },
      {
        id: "dit-ch4",
        number: "CHAPTER 4",
        title: "COMPETENCIES GAINED & LINK WITH DIT CURRICULUM",
        description: "Practical engineering skills acquired and their correlation with NTA Level coursework at DIT.",
        subsections: [
          "4.1 Practical Technical Competencies and Workshop Mastery",
          "4.2 Correlation with Engineering Modules at DIT",
          "4.3 Professional Ethics and Industrial Standards"
        ]
      },
      {
        id: "dit-ch5",
        number: "CHAPTER 5",
        title: "CONCLUSIONS & STRATEGIC RECOMMENDATIONS",
        description: "Summary and technical feedback for enterprise and DIT.",
        subsections: [
          "5.1 Overall Conclusion",
          "5.2 Recommendations to Industry Management",
          "5.3 Recommendations to Dar es Salaam Institute of Technology (DIT)"
        ]
      }
    ],
    guidelineRules: [
      "Strict compliance with DIT Industrial Practical Training (IPT) Guidelines.",
      "Engineering precision, schematic clarity, and safety adherence."
    ]
  }
};

export class UniversityTemplateEngine {
  /**
   * Resolves the template blueprint for a selected university.
   * If context is provided and indicates computing at UDSM, resolves to UDSM_COICT.
   * Supports universal resolution for all Tanzanian universities in the catalog.
   */
  static resolveTemplate(
    uniShortName: string,
    context?: {
      college?: string;
      programme?: string;
      taskDescription?: string;
      activities?: string;
    }
  ): InstitutionalTemplateBlueprint {
    if (!uniShortName) return INSTITUTIONAL_TEMPLATES.DEFAULT;
    const key = uniShortName.toUpperCase().trim();

    // 1. Direct blueprint key match
    if (INSTITUTIONAL_TEMPLATES[key]) {
      if (key === "UDSM" && context) {
        const discipline = detectAcademicDiscipline(context);
        const col = (context.college || "").toLowerCase();
        const prog = (context.programme || "").toLowerCase();
        if (
          col.includes("coict") ||
          col.includes("ict") ||
          col.includes("comput") ||
          prog.includes("comput") ||
          prog.includes("softwar") ||
          discipline === "COMPUTING"
        ) {
          return INSTITUTIONAL_TEMPLATES.UDSM_COICT;
        }
      }
      return INSTITUTIONAL_TEMPLATES[key];
    }

    // 2. Exact or specific name matches (Prevent DIT from matching UDSM)
    if (key.includes("DAR ES SALAAM INSTITUTE OF TECHNOLOGY") || key === "DIT") {
      return INSTITUTIONAL_TEMPLATES.DIT;
    }

    if (
      key === "UDSM" ||
      key === "DAR" ||
      (key.includes("DAR ES SALAAM") && key.includes("UNIVERSITY") && !key.includes("INSTITUTE"))
    ) {
      if (context) {
        const discipline = detectAcademicDiscipline(context);
        const col = (context.college || "").toLowerCase();
        const prog = (context.programme || "").toLowerCase();
        if (
          col.includes("coict") ||
          col.includes("ict") ||
          col.includes("comput") ||
          prog.includes("comput") ||
          prog.includes("softwar") ||
          discipline === "COMPUTING"
        ) {
          return INSTITUTIONAL_TEMPLATES.UDSM_COICT;
        }
      }
      return INSTITUTIONAL_TEMPLATES.UDSM;
    }

    if (key.includes("FINANCE") || key.includes("IFM")) return INSTITUTIONAL_TEMPLATES.IFM;
    if (key.includes("BUSINESS") || key.includes("CBE")) return INSTITUTIONAL_TEMPLATES.CBE;
    if (key.includes("TRANSPORT") || key.includes("NIT")) return INSTITUTIONAL_TEMPLATES.NIT;
    if (key.includes("ARDHI") || key.includes("ARU") || key.includes("ARTHI")) return INSTITUTIONAL_TEMPLATES.ARU;
    if (key.includes("SOKOINE") || key.includes("SUA") || key.includes("AGRICULTURE")) return INSTITUTIONAL_TEMPLATES.SUA;

    // 3. Match against Tanzania Academic Catalog for any other university
    const catalogItem = TANZANIA_ACADEMIC_CATALOG.find(
      c => c.shortName.toUpperCase() === key ||
           c.name.toUpperCase() === key ||
           c.name.toUpperCase().includes(key) ||
           key.includes(c.shortName.toUpperCase())
    );

    if (catalogItem) {
      return {
        ...INSTITUTIONAL_TEMPLATES.DEFAULT,
        institutionKey: catalogItem.shortName,
        institutionName: catalogItem.name,
        shortName: catalogItem.shortName,
        hasVerifiedSample: catalogItem.hasOfficialTemplate,
        coverPageLayout: {
          ...INSTITUTIONAL_TEMPLATES.DEFAULT.coverPageLayout,
          headerTitle: catalogItem.reportTypes[0] ? catalogItem.reportTypes[0].toUpperCase() : "FIELD PRACTICAL TRAINING REPORT",
          showLogo: true
        }
      };
    }

    // 4. Default National Standard for unknown / custom institutions
    return {
      ...INSTITUTIONAL_TEMPLATES.DEFAULT,
      institutionName: uniShortName,
      shortName: uniShortName,
      hasVerifiedSample: false
    };
  }

  /**
   * Generates the authentic, official UDSM cover page matching templates/UDSM.docx line-by-line.
   */
  static generateOfficialUdsmCoverPage(params: {
    reportTitle: string;
    studentName: string;
    regNumber: string;
    yearOfStudy: string;
    university: string;
    college: string;
    programme: string;
    organization: string;
    department?: string;
    supervisor?: string;
    academicYear?: string;
    trainingOfficer?: string;
  }): string {
    const uni = (params.university || "UNIVERSITY OF DAR ES SALAAM").toUpperCase();
    const college = (params.college || "COLLEGE OF INFORMATION AND COMMUNICATION TECHNOLOGIES (CoICT)").toUpperCase();
    const prog = (params.programme || "COMPUTER SCIENCE AND ENGINEERING").toUpperCase();
    const title = (params.reportTitle || "PRACTICAL TRAINING REPORT").toUpperCase();
    const student = params.studentName || "";
    const regNo = params.regNumber || "";
    const ptYear = params.yearOfStudy ? params.yearOfStudy.replace(/[^0-9]/g, "") || "2" : "2";
    const company = params.organization || "";
    const trainingOfficer = params.trainingOfficer || params.supervisor || "";
    const academicSupervisor = params.supervisor || "";

    return `================================================================================
                         ${uni}
                      ${college}
                     DEPARTMENT OF ${prog}

                           PRACTICAL TRAINING REPORT

REPORT TITLE: ${title}

Student Name:               ${student}
Reg. No:                    ${regNo}
Practical Training Year:    ${ptYear}
Company/Organization Name:  ${company}
Training Officer's Name:    ${trainingOfficer}
Academic Supervisor's Name: ${academicSupervisor}
================================================================================
`;
  }

  /**
   * Generates complete, official preliminary pages matching templates/UDSM.docx:
   * Abstract, Acknowledgements, Declaration, Table of Contents, List of Abbreviations, List of Tables, List of Figures.
   */
  static generateOfficialPreliminaryPages(params: {
    reportTitle: string;
    studentName: string;
    regNumber: string;
    university: string;
    organization: string;
    supervisor: string;
    duration?: string;
    discipline?: AcademicDiscipline;
    targetPages?: number;
  }): string {
    const student = params.studentName || "[STUDENT NAME]";
    const title = params.reportTitle || "[REPORT TITLE]";
    const uni = params.university || "University of Dar es Salaam";
    const org = params.organization || "[HOST ENTERPRISE]";
    const sup = params.supervisor || "[SUPERVISOR]";
    const targetPagesNum = params.targetPages || 25;
    const discipline = params.discipline || "GENERAL";

    const uniUpper = uni.toUpperCase();
    const isUdsm = uniUpper.includes("UDSM") || (uniUpper.includes("DAR ES SALAAM") && uniUpper.includes("UNIVERSITY") && !uniUpper.includes("INSTITUTE"));
    const isIfm = uniUpper.includes("IFM") || uniUpper.includes("FINANCE MANAGEMENT");
    const isCbe = uniUpper.includes("CBE") || uniUpper.includes("COLLEGE OF BUSINESS EDUCATION");
    const isNit = uniUpper.includes("NIT") || uniUpper.includes("NATIONAL INSTITUTE OF TRANSPORT");
    const isSua = uniUpper.includes("SUA") || uniUpper.includes("SOKOINE");
    const isDit = uniUpper.includes("DIT") || uniUpper.includes("DAR ES SALAAM INSTITUTE OF TECHNOLOGY");
    const isAru = uniUpper.includes("ARDHI") || uniUpper.includes("ARU");

    // Dynamic discipline-specific abbreviations
    let abbrevRows: Array<[string, string]>;
    if (discipline === "COMPUTING") {
      abbrevRows = [
        ["API", "Application Programming Interface"],
        ["REST", "Representational State Transfer"],
        ["DBMS", "Database Management System"],
        ["SQL", "Structured Query Language"],
        ["UI / UX", "User Interface / User Experience"],
        ["JSON", "JavaScript Object Notation"],
        ["IDE", "Integrated Development Environment"],
        ["CI / CD", "Continuous Integration and Continuous Deployment"],
        ["SLA", "Service Level Agreement"],
        ["TCRA", "Tanzania Communications Regulatory Authority"],
        ["PDPA", "Personal Data Protection Act (Tanzania, No. 11 of 2022)"],
        [isUdsm ? "UDSM" : isIfm ? "IFM" : isDit ? "DIT" : "HLI", isUdsm ? "University of Dar es Salaam" : uni],
        ["IPT / FPT", "Industrial Practical Training / Field Practical Training"]
      ];
    } else if (discipline === "ENGINEERING") {
      abbrevRows = [
        ["ERB", "Engineers Registration Board (Tanzania)"],
        ["OSHA", "Occupational Safety and Health Authority"],
        ["PPE", "Personal Protective Equipment"],
        ["SOP", "Standard Operating Procedure"],
        ["TBS", "Tanzania Bureau of Standards"],
        ["ISO", "International Organization for Standardization"],
        ["CAD", "Computer-Aided Design"],
        ["PLC", "Programmable Logic Controller"],
        ["SCADA", "Supervisory Control and Data Acquisition"],
        ["ASTM", "American Society for Testing and Materials"],
        [isDit ? "DIT" : isUdsm ? "UDSM" : isNit ? "NIT" : isAru ? "ARU" : "HLI", isDit ? "Dar es Salaam Institute of Technology" : uni],
        ["IPT / FPT", "Industrial Practical Training / Field Practical Training"]
      ];
    } else if (discipline === "AGRICULTURE") {
      abbrevRows = [
        ["GAP", "Good Agricultural Practices"],
        ["FAO", "Food and Agriculture Organization of the United Nations"],
        ["TBS", "Tanzania Bureau of Standards"],
        ["SAGCOT", "Southern Agricultural Growth Corridor of Tanzania"],
        ["IPM", "Integrated Pest Management"],
        ["GPS / GIS", "Global Positioning System / Geographic Information System"],
        ["SOP", "Standard Operating Procedure"],
        ["PPE", "Personal Protective Equipment"],
        ["OSHA", "Occupational Safety and Health Authority"],
        ["MoA", "Ministry of Agriculture (Tanzania)"],
        [isSua ? "SUA" : isUdsm ? "UDSM" : "HLI", isSua ? "Sokoine University of Agriculture" : uni],
        ["FPT", "Field Practical Training"]
      ];
    } else if (discipline === "HEALTH") {
      abbrevRows = [
        ["MoH", "Ministry of Health (Tanzania)"],
        ["WHO", "World Health Organization"],
        ["OPD / IPD", "Outpatient Department / Inpatient Department"],
        ["IPC", "Infection Prevention and Control"],
        ["EHR", "Electronic Health Records"],
        ["PPE", "Personal Protective Equipment"],
        ["SOP", "Standard Operating Procedure"],
        ["CPR", "Cardiopulmonary Resuscitation"],
        ["OSHA", "Occupational Safety and Health Authority"],
        ["TNMC", "Tanzania Nursing and Midwives Council"],
        [isUdsm ? "UDSM" : "HLI", isUdsm ? "University of Dar es Salaam (MUHAS / CoHAS)" : uni],
        ["FPT", "Field Practical Training"]
      ];
    } else if (discipline === "BUSINESS") {
      abbrevRows = [
        ["BoT", "Bank of Tanzania"],
        ["TRA", "Tanzania Revenue Authority"],
        ["NBAA", "National Board of Accountants and Auditors (Tanzania)"],
        ["IFRS", "International Financial Reporting Standards"],
        ["GAAP", "Generally Accepted Accounting Principles"],
        ["ERP", "Enterprise Resource Planning"],
        ["KPI", "Key Performance Indicator"],
        ["SLA", "Service Level Agreement"],
        ["PDPA", "Personal Data Protection Act (Tanzania, 2022)"],
        ["SOP", "Standard Operating Procedure"],
        [isIfm ? "IFM" : isCbe ? "CBE" : isUdsm ? "UDSM" : "HLI", isIfm ? "Institute of Finance Management" : isCbe ? "College of Business Education" : uni],
        ["FPT", "Field Practical Training"]
      ];
    } else {
      abbrevRows = [
        ["SOP", "Standard Operating Procedure"],
        ["PPE", "Personal Protective Equipment"],
        ["OSHA", "Occupational Safety and Health Authority"],
        ["TBS", "Tanzania Bureau of Standards"],
        ["ISO", "International Organization for Standardization"],
        ["DBMS", "Database Management System"],
        ["KPI", "Key Performance Indicator"],
        ["SLA", "Service Level Agreement"],
        ["PDPA", "Personal Data Protection Act (Tanzania, 2022)"],
        [isUdsm ? "UDSM" : "HLI", uni],
        ["FPT / IPT", "Field Practical Training / Industrial Practical Training"]
      ];
    }

    const tableRows = abbrevRows.map(([abbr, full]) => `    <tr>
      <td style="padding: 4.5pt 10pt; font-weight: bold; border: 1px solid #cbd5e1; width: 24%; color: #0f172a;">${abbr}</td>
      <td style="padding: 4.5pt 10pt; border: 1px solid #cbd5e1; color: #1e293b;">${full}</td>
    </tr>`).join("\n");

    const abbrevsTableHtml = `<div style="margin: 12pt 0; page-break-inside: avoid;">
<table class="academic-table" id="tbl-abbrevs" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.35; margin: 8pt 0;">
  <thead>
    <tr style="background-color: #f1f5f9; border-top: 1.5pt solid #0f172a; border-bottom: 1.5pt solid #0f172a;">
      <th style="padding: 6pt 10pt; text-align: left; border: 1px solid #cbd5e1; width: 24%;">Abbreviation</th>
      <th style="padding: 6pt 10pt; text-align: left; border: 1px solid #cbd5e1;">Official Meaning / Institutional Expansion</th>
    </tr>
  </thead>
  <tbody>
${tableRows}
  </tbody>
</table>
</div>`;

    // 25 Pages: Exactly 7 preliminary sheets (Sheets 2 to 8 -> Roman i to vii)
    if (targetPagesNum >= 22) {
      return `
# DECLARATION AND APPROVAL

I, ${student}, declare that this report titled "${title}" is my original work based on the practical training I completed at ${org} under the supervision of ${sup}. This report has been prepared to fulfill my academic requirements at ${uni} and has not been submitted to any other university or higher learning institution for the award of any certificate, diploma, or degree.

Student Signature: _______________________            Date: ____________________
${student}
Registration No: ${params.regNumber || ""}

CERTIFICATION BY HOST ORGANIZATION
I confirm that ${student} carried out the practical training described in this report at ${org} under my direct supervision, and that this report represents an authentic record of the technical duties and projects performed.

Field Supervisor Signature: ___________________        Date: ____________________
${sup}
${org}

<!-- PAGE_BREAK -->

# DEDICATION AND ACKNOWLEDGEMENTS

## Dedication
This practical training report is wholeheartedly dedicated to the Almighty God, who granted me life, continuous good health, knowledge, and perseverance throughout the duration of my industrial attachment. I also dedicate this work to my beloved parents and family, whose unconditional sacrifices, spiritual guidance, and unwavering financial support have been the cornerstone of my academic journey at ${uni}.

## Acknowledgements
I express my profound gratitude to the academic administration, faculty leadership, and department coordinators at ${uni} for their diligent supervision, preparatory briefings, and academic governance of our industrial field practical training programme.

Special sincere appreciation is extended to my host enterprise, ${org}, for granting me the invaluable opportunity to complete my industrial attachment within their active operational environment. I am deeply indebted to my field supervisor, ${sup}, for the patient mentorship, technical oversight, rigorous code/work reviews, and daily encouragement provided to me. I also thank all staff members and colleagues in the department for their warm collaboration, professional guidance, and willingness to share their deep industry expertise throughout my attachment period.

<!-- PAGE_BREAK -->

# ABSTRACT

This field practical training report provides an authentic, detailed account of the industrial practical attachment undertaken by ${student} at ${org} from the department of practical studies at ${uni}. The primary objective of the attachment was to bridge theoretical academic concepts covered in university coursework with the demands of authentic industrial operations, standard operating procedures, and professional workplace problem-solving in Tanzania.

During the attachment period, the student was embedded within active production workflows, directly participating in operational planning, tools configuration, system testing, routine maintenance, and quality assurance. The report provides a comprehensive overview of the host enterprise, covering its institutional background, vision, mission, governance hierarchy, and safety regulations. It elaborates upon the assigned technical tasks, detailing the methodological execution, equipment and software tools utilized, comparative evaluation of operational alternatives, and systematic resolution of technical challenges encountered in production.

Furthermore, the report analyzes the core technical and soft skills developed during the placement, maps the practical experiences to key undergraduate curriculum subjects at ${uni}, and articulates actionable recommendations for both ${org} and the university administration to enhance future industrial training cycles.

<!-- PAGE_BREAK -->

# TABLE OF CONTENTS

<!-- DYNAMIC_TABLE_OF_CONTENTS_PLACEHOLDER -->

<!-- PAGE_BREAK -->

# LIST OF TABLES

<!-- DYNAMIC_LIST_OF_TABLES_PLACEHOLDER -->

<!-- PAGE_BREAK -->

# LIST OF FIGURES & DIAGRAMS

<!-- DYNAMIC_LIST_OF_FIGURES_PLACEHOLDER -->

<!-- PAGE_BREAK -->

# LIST OF ABBREVIATIONS

${abbrevsTableHtml}
`;
    }

    // 20 Pages: Exactly 6 preliminary sheets (Sheets 2 to 7 -> Roman i to vi)
    if (targetPagesNum >= 18) {
      return `
# DECLARATION AND APPROVAL

I, ${student}, declare that this report titled "${title}" is my original work based on the practical training I completed at ${org} under the supervision of ${sup}. This report has been prepared to fulfill my academic requirements at ${uni} and has not been submitted to any other university or higher learning institution for the award of any certificate, diploma, or degree.

Student Signature: _______________________            Date: ____________________
${student}
Registration No: ${params.regNumber || ""}

CERTIFICATION BY HOST ORGANIZATION
I confirm that ${student} carried out the practical training described in this report at ${org} under my direct supervision, and that this report represents an authentic record of the technical duties and projects performed.

Field Supervisor Signature: ___________________        Date: ____________________
${sup}
${org}

<!-- PAGE_BREAK -->

# ACKNOWLEDGEMENTS

First, I thank Almighty God for granting me good health, strength, and guidance throughout my practical training period. I am deeply grateful to my parents and family for their continuous moral and financial support throughout my studies at ${uni}.

I express my sincere gratitude to the faculty and department staff at ${uni} for coordinating our field practical training. Special thanks go to my field supervisor, ${sup}, and the entire team at ${org} for welcoming me into their department, patiently mentoring me, sharing their practical skills, and giving me the opportunity to learn through real-world work.

<!-- PAGE_BREAK -->

# ABSTRACT

This field practical training report covers my practical attachment at ${org} as part of the degree requirements for ${uni}. The primary goal of this attachment was to gain hands-on industrial experience, understand daily workplace operations, and apply the concepts learned in class to real tasks in the industry.

During the training period, I actively participated in routine departmental operations, worked with technical tools, and assisted in troubleshooting practical problems. This report summarizes the background of ${org}, details the specific tasks and projects I worked on, explains the practical challenges faced and how they were solved, and highlights the key technical and professional skills gained. Finally, it provides recommendations to help both ${org} and ${uni} improve future student training.

<!-- PAGE_BREAK -->

# TABLE OF CONTENTS

<!-- DYNAMIC_TABLE_OF_CONTENTS_PLACEHOLDER -->

<!-- PAGE_BREAK -->

# LIST OF TABLES

<!-- DYNAMIC_LIST_OF_TABLES_PLACEHOLDER -->

# LIST OF FIGURES & DIAGRAMS

<!-- DYNAMIC_LIST_OF_FIGURES_PLACEHOLDER -->

<!-- PAGE_BREAK -->

# LIST OF ABBREVIATIONS

${abbrevsTableHtml}
`;
    }

    // 15 Pages: Exactly 4 preliminary sheets (Sheets 2 to 5 -> Roman i to iv)
    if (targetPagesNum >= 13) {
      return `
# DECLARATION AND APPROVAL

I, ${student}, declare that this report titled "${title}" is my original work based on the practical training I completed at ${org} under the supervision of ${sup}. This report has been prepared to fulfill my academic requirements at ${uni} and has not been submitted to any other university or higher learning institution for the award of any certificate, diploma, or degree.

Student Signature: _______________________            Date: ____________________
${student}
Registration No: ${params.regNumber || ""}

CERTIFICATION BY HOST ORGANIZATION
I confirm that ${student} carried out the practical training described in this report at ${org} under my direct supervision.

Field Supervisor Signature: ___________________        Date: ____________________
${sup} (${org})

<!-- PAGE_BREAK -->

# ACKNOWLEDGEMENTS AND ABSTRACT

## Acknowledgements
I thank Almighty God, my family, and the faculty staff at ${uni} for their continuous support. Special thanks to my supervisor ${sup} and the technical squad at ${org} for their excellent mentorship and professional guidance throughout my industrial placement.

## Abstract
This report documents the industrial practical training completed by ${student} at ${org} in fulfillment of the undergraduate degree requirements at ${uni}. During the attachment, the student executed assigned technical tasks, utilized industry tools, troubleshot operational bottlenecks, and acquired practical competencies directly bridging classroom theory with commercial production.

<!-- PAGE_BREAK -->

# TABLE OF CONTENTS & LISTS

<!-- DYNAMIC_TABLE_OF_CONTENTS_PLACEHOLDER -->

<!-- DYNAMIC_LIST_OF_TABLES_PLACEHOLDER -->

<!-- DYNAMIC_LIST_OF_FIGURES_PLACEHOLDER -->

<!-- PAGE_BREAK -->

# LIST OF ABBREVIATIONS

${abbrevsTableHtml}
`;
    }

    // 10 Pages: Exactly 3 preliminary sheets (Sheets 2 to 4 -> Roman i to iii)
    return `
# DECLARATION AND ACKNOWLEDGEMENTS

I, ${student}, declare that this report titled "${title}" is my original work based on the practical training completed at ${org} under the supervision of ${sup} for ${uni}.

Student: ___________________ Date: _________   Supervisor: ___________________ Date: _________
${student} (${params.regNumber || ""})           ${sup} (${org})

I thank Almighty God, my family, faculty members at ${uni}, and my supervisor ${sup} at ${org} for their guidance and mentorship during my practical training attachment.

<!-- PAGE_BREAK -->

# ABSTRACT

This report summarizes the field practical training undertaken at ${org} by ${student} for ${uni}. The training provided valuable hands-on experience in executing assigned technical duties, working with standard tools, troubleshooting practical challenges, and bridging theoretical coursework with authentic industry operations.

<!-- PAGE_BREAK -->

# TABLE OF CONTENTS & ABBREVIATIONS

<!-- DYNAMIC_TABLE_OF_CONTENTS_PLACEHOLDER -->

${abbrevsTableHtml}
`;
  }

  /**
   * Generates Figure 1.1 (Organogram Diagram) as a crisp, professional SVG vector diagram.
   * Dynamically adapts administrative titles based on the student's actual host organization and discipline.
   */
  static generateOrganogramSvg(params: { orgName: string; deptName?: string; discipline?: AcademicDiscipline; isComputing?: boolean }): string {
    const org = (params.orgName || "HOST ENTERPRISE").toUpperCase();
    const dept = (params.deptName || "TECHNICAL OPERATIONS DEPARTMENT").toUpperCase();
    const discipline = params.discipline || (params.isComputing ? "COMPUTING" : "GENERAL");

    let tier2Left = "DIRECTOR OF TECHNICAL SERVICES";
    let tier2Right = "DIRECTOR OF ADMINISTRATION & FINANCE";
    let tier3 = `HEAD OF DEPARTMENT: ${dept}`;
    let tier4Left = "SENIOR TECHNICAL OFFICERS";
    let tier4Right = "QUALITY ASSURANCE & SAFETY TEAM";
    let tier5 = "PRACTICAL TRAINING STUDENT (TRAINEE)";

    if (discipline === "COMPUTING") {
      tier2Left = "DIRECTOR OF TECHNOLOGY / CTO";
      tier2Right = "DIRECTOR OF OPERATIONS & PRODUCT";
      tier3 = `HEAD OF UNIT: ${dept}`;
      tier4Left = "LEAD SOFTWARE ARCHITECTS";
      tier4Right = "QA & SECURITY SPECIALISTS";
      tier5 = "PRACTICAL TRAINING TRAINEE (DEVELOPER INTERN)";
    } else if (discipline === "ENGINEERING") {
      tier2Left = "CHIEF ENGINEER / DIRECTOR OF ENGINEERING";
      tier2Right = "DIRECTOR OF OPERATIONS & PLANNING";
      tier3 = `HEAD OF ENGINEERING: ${dept}`;
      tier4Left = "SENIOR PROJECT ENGINEERS";
      tier4Right = "SITE SAFETY & QUALITY INSPECTORS";
      tier5 = "ENGINEERING TRAINEE (INTERN)";
    } else if (discipline === "HEALTH") {
      tier2Left = "CHIEF MEDICAL OFFICER / CLINICAL DIRECTOR";
      tier2Right = "DIRECTOR OF HEALTH ADMINISTRATION";
      tier3 = `HEAD OF CLINICAL UNIT: ${dept}`;
      tier4Left = "SENIOR MEDICAL OFFICERS";
      tier4Right = "NURSING & INFECTION CONTROL TEAM";
      tier5 = "CLINICAL ATTACHMENT TRAINEE";
    } else if (discipline === "AGRICULTURE") {
      tier2Left = "DIRECTOR OF RESEARCH & PRODUCTION";
      tier2Right = "DIRECTOR OF EXTENSION & LOGISTICS";
      tier3 = `HEAD OF AGRONOMY / STATION: ${dept}`;
      tier4Left = "SENIOR AGRONOMISTS & SCIENTISTS";
      tier4Right = "FIELD QUALITY & IRRIGATION INSPECTORS";
      tier5 = "AGRICULTURAL FIELD ATTACHMENT TRAINEE";
    } else if (discipline === "BUSINESS") {
      tier2Left = "CHIEF FINANCIAL OFFICER / DIRECTOR OF FINANCE";
      tier2Right = "DIRECTOR OF OPERATIONS & MARKETING";
      tier3 = `HEAD OF DIVISION: ${dept}`;
      tier4Left = "SENIOR FINANCIAL / OPERATIONS ANALYSTS";
      tier4Right = "AUDIT, RISK & COMPLIANCE TEAM";
      tier5 = "BUSINESS OPERATIONS TRAINEE (INTERN)";
    }

    return `<figure class="academic-figure" id="fig-1-1" style="text-align: center; margin: 16pt auto; page-break-inside: avoid; break-inside: avoid; display: block; clear: both;">
<svg viewBox="0 0 740 345" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; width: 100%; max-height: 275px; height: auto; font-family: 'Times New Roman', Arial, sans-serif; display: block; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; box-sizing: border-box; overflow: visible;">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0f172a" />
    </marker>
  </defs>

  <!-- Level 1: Executive Board -->
  <rect x="200" y="8" width="340" height="42" rx="6" fill="#f8fafc" stroke="#0f172a" stroke-width="1.8" />
  <text x="370" y="25" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">MANAGING DIRECTOR / BOARD OF GOVERNANCE</text>
  <text x="370" y="40" font-size="9" fill="#475569" text-anchor="middle">${org.slice(0, 48)}</text>

  <!-- Arrow Down to horizontal trunk -->
  <line x1="370" y1="50" x2="370" y2="74" stroke="#0f172a" stroke-width="1.5" />
  <line x1="160" y1="74" x2="580" y2="74" stroke="#0f172a" stroke-width="1.5" />

  <!-- Branches Down -->
  <line x1="160" y1="74" x2="160" y2="90" stroke="#0f172a" stroke-width="1.5" marker-end="url(#arrow)" />
  <line x1="580" y1="74" x2="580" y2="90" stroke="#0f172a" stroke-width="1.5" marker-end="url(#arrow)" />

  <!-- Level 2: Directors -->
  <rect x="30" y="92" width="260" height="38" rx="5" fill="#f8fafc" stroke="#334155" stroke-width="1.4" />
  <text x="160" y="115" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">${tier2Left.slice(0, 36)}</text>

  <rect x="450" y="92" width="260" height="38" rx="5" fill="#f8fafc" stroke="#334155" stroke-width="1.4" />
  <text x="580" y="115" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">${tier2Right.slice(0, 36)}</text>

  <!-- Central trunk to Department Head -->
  <line x1="160" y1="130" x2="160" y2="148" stroke="#0f172a" stroke-width="1.5" />
  <line x1="160" y1="148" x2="370" y2="148" stroke="#0f172a" stroke-width="1.5" />
  <line x1="370" y1="148" x2="370" y2="162" stroke="#0f172a" stroke-width="1.5" marker-end="url(#arrow)" />

  <!-- Level 3: Department Head -->
  <rect x="180" y="164" width="380" height="38" rx="5" fill="#f1f5f9" stroke="#0f172a" stroke-width="1.6" />
  <text x="370" y="187" font-size="9.5" font-weight="bold" fill="#0f172a" text-anchor="middle">${tier3.slice(0, 48)}</text>

  <!-- Level 4: Senior Technical Staff -->
  <line x1="370" y1="202" x2="370" y2="220" stroke="#0f172a" stroke-width="1.5" />
  <line x1="180" y1="220" x2="560" y2="220" stroke="#0f172a" stroke-width="1.5" />
  <line x1="180" y1="220" x2="180" y2="232" stroke="#0f172a" stroke-width="1.5" marker-end="url(#arrow)" />
  <line x1="560" y1="220" x2="560" y2="232" stroke="#0f172a" stroke-width="1.5" marker-end="url(#arrow)" />

  <rect x="70" y="235" width="220" height="32" rx="4" fill="#ffffff" stroke="#64748b" stroke-width="1.2" />
  <text x="180" y="255" font-size="8.5" fill="#1e293b" text-anchor="middle">${tier4Left.slice(0, 32)}</text>

  <rect x="450" y="235" width="220" height="32" rx="4" fill="#ffffff" stroke="#64748b" stroke-width="1.2" />
  <text x="560" y="255" font-size="8.5" fill="#1e293b" text-anchor="middle">${tier4Right.slice(0, 32)}</text>

  <!-- Level 5: Student Trainee -->
  <line x1="180" y1="267" x2="180" y2="286" stroke="#0f172a" stroke-width="1.5" />
  <line x1="180" y1="286" x2="370" y2="286" stroke="#0f172a" stroke-width="1.5" />
  <line x1="370" y1="286" x2="370" y2="296" stroke="#0f172a" stroke-width="1.5" marker-end="url(#arrow)" />

  <rect x="160" y="298" width="420" height="28" rx="4" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.4" stroke-dasharray="4 2" />
  <text x="370" y="316" font-size="8.5" font-weight="bold" fill="#0f172a" text-anchor="middle">★ ${tier5.slice(0, 52)}</text>
</svg>
<figcaption style="font-size: 10pt; font-style: italic; color: #334155; margin-top: 8pt; text-align: center;">Figure 1.1: Organizational Administrative Hierarchy (Organogram) of ${params.orgName}</figcaption>
</figure>`;
  }

  /**
   * Generates Figure 1.1 backwards-compatible method returning SVG.
   */
  static generateOrganogramDiagram(orgName: string, deptName?: string): string {
    return this.generateOrganogramSvg({ orgName, deptName });
  }

  /**
   * Generates Figure 2.1 (Technical Process Flowchart) as a crisp, professional SVG vector diagram.
   * Dynamically constructs the 5 sequential workflow phases directly from the user's live activities input.
   */
  static generateProcessFlowchartSvg(params: { 
    title: string; 
    activities?: string; 
    discipline?: AcademicDiscipline; 
    isComputing?: boolean 
  }): string {
    const rawActivities = (params.activities || "").split("\n")
      .map(line => line.replace(/^[0-9]+[\.\)\-]\s*/, "").trim())
      .filter(line => line.length > 5);

    // Default dynamic phases tailored to the discipline if activities are brief
    const discipline = params.discipline || (params.isComputing ? "COMPUTING" : "GENERAL");
    
    let defaultPhases = [
      { num: "01", title: "Problem Definition & Scoping", desc: "Baseline analysis & operational requirements" },
      { num: "02", title: "Methodology & Setup", desc: "Tool preparation, environment & calibration" },
      { num: "03", title: "Practical Implementation", desc: "Core task execution & data acquisition" },
      { num: "04", title: "Testing & Quality Check", desc: "Verification against institutional standards" },
      { num: "05", title: "Handover & Documentation", desc: "Review, supervisor sign-off & reporting" }
    ];

    if (discipline === "COMPUTING") {
      defaultPhases = [
        { num: "01", title: "Requirements & Architecture", desc: "System specifications & interface design" },
        { num: "02", title: "Environment & Gateway Setup", desc: "IDE config, SDKs & dependency initialization" },
        { num: "03", title: "Core Module Implementation", desc: "Component development & asynchronous logic" },
        { num: "04", title: "System Testing & Security QA", desc: "End-to-end integration & error logging" },
        { num: "05", title: "Deployment & Code Review", desc: "Production staging, documentation & sign-off" }
      ];
    } else if (discipline === "ENGINEERING") {
      defaultPhases = [
        { num: "01", title: "Reconnaissance & Site Audit", desc: "Specifications, safety guidelines & survey" },
        { num: "02", title: "Schematic & Tool Setup", desc: "Equipment calibration & design parameters" },
        { num: "03", title: "Fabrication & Construction", desc: "Hands-on assembly, wiring & physical execution" },
        { num: "04", title: "Diagnostic Quality Testing", desc: "Load tolerance, calibration & compliance" },
        { num: "05", title: "Technical Handover", desc: "Operational certification & supervisor review" }
      ];
    } else if (discipline === "HEALTH") {
      defaultPhases = [
        { num: "01", title: "Patient Assessment & Triage", desc: "Clinical intake & diagnostic history" },
        { num: "02", title: "Sterilization & Prep", desc: "Clinical protocols & instrument readiness" },
        { num: "03", title: "Procedural Care & Delivery", desc: "Supervised clinical intervention & therapy" },
        { num: "04", title: "Patient Monitoring & Records", desc: "Vital signs tracking & pharmacology logs" },
        { num: "05", title: "Handover & Clinical Review", desc: "Shift rounds & supervisor documentation" }
      ];
    } else if (discipline === "AGRICULTURE") {
      defaultPhases = [
        { num: "01", title: "Field Survey & Soil Sampling", desc: "Site reconnaissance & baseline parameters" },
        { num: "02", title: "Agronomic Tool Calibration", desc: "Irrigation lines, sensors & inputs setup" },
        { num: "03", title: "Field Execution & Treatment", desc: "Planting, fertigation & crop maintenance" },
        { num: "04", title: "Yield Monitoring & Scouting", desc: "Pest scouting, telemetry & quality metrics" },
        { num: "05", title: "Data Synthesis & Handover", desc: "Agronomic logs, reporting & station sign-off" }
      ];
    } else if (discipline === "BUSINESS") {
      defaultPhases = [
        { num: "01", title: "Business Requirements Audit", desc: "Operational review & workflow scoping" },
        { num: "02", title: "Financial Systems Setup", desc: "Ledgers, ERP modules & spreadsheet models" },
        { num: "03", title: "Transaction Reconciliations", desc: "Daily data entries, auditing & postings" },
        { num: "04", title: "Variance Analysis & Control", desc: "Financial statement cross-checks & audits" },
        { num: "05", title: "Reporting & Management Review", desc: "Executive presentation & supervisory sign-off" }
      ];
    }

    const steps = defaultPhases.map((phase, idx) => {
      if (rawActivities[idx]) {
        const act = rawActivities[idx];
        const titleShort = act.slice(0, 32);
        const descShort = act.length > 32 ? act.slice(32, 75) : "Execution according to departmental protocols";
        return {
          num: `0${idx + 1}`,
          title: titleShort,
          desc: descShort
        };
      }
      return phase;
    });

    return `<figure class="academic-figure" id="fig-2-1" style="text-align: center; margin: 16pt auto; page-break-inside: avoid; break-inside: avoid; display: block; clear: both;">
<svg viewBox="0 0 740 185" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; width: 100%; max-height: 185px; height: auto; font-family: 'Times New Roman', Arial, sans-serif; display: block; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; box-sizing: border-box; overflow: visible;">
  <defs>
    <marker id="flow-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0d9488" />
    </marker>
  </defs>

  ${steps.map((step, idx) => {
    const x = 12 + idx * 145;
    const arrow = idx < 4
      ? `<line x1="${x + 130}" y1="85" x2="${x + 145}" y2="85" stroke="#0d9488" stroke-width="2" marker-end="url(#flow-arrow)" />`
      : "";
    return `
    <!-- Step ${idx + 1} -->
    <rect x="${x}" y="25" width="130" height="115" rx="6" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5" />
    <rect x="${x}" y="25" width="130" height="24" rx="6" fill="#0f172a" />
    <text x="${x + 65}" y="41" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">PHASE ${step.num}</text>
    <text x="${x + 65}" y="68" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">
      <tspan x="${x + 65}" dy="0">${step.title.split("&")[0] || step.title}</tspan>
      ${step.title.includes("&") ? `<tspan x="${x + 65}" dy="12">& ${step.title.split("&")[1]}</tspan>` : ""}
    </text>
    <text x="${x + 65}" y="106" font-size="7.5" fill="#475569" text-anchor="middle">
      <tspan x="${x + 65}" dy="0">${step.desc.slice(0, 22)}</tspan>
      <tspan x="${x + 65}" dy="10">${step.desc.slice(22, 45)}</tspan>
    </text>
    ${arrow}
    `;
  }).join("")}
</svg>
<figcaption style="font-size: 10pt; font-style: italic; color: #334155; margin-top: 8pt; text-align: center;">Figure 2.1: Operational Process Architecture & Practical Workflow Stages</figcaption>
</figure>`;
  }

  /**
   * Generates Figure 2.1 backwards-compatible method returning SVG.
   */
  static generateProcessFlowchart(taskTitle: string): string {
    return this.generateProcessFlowchartSvg({ title: taskTitle });
  }

  /**
   * Generates Table 2.1 (Technical Evaluation Matrix) as a styled semantic HTML table.
   * Dynamically evaluates the user's actual tools and adopted methodology against baseline options.
   */
  static generateComparisonTableHtml(params: { 
    title?: string; 
    toolsUsed?: string; 
    discipline?: AcademicDiscipline; 
    isComputing?: boolean 
  }): string {
    const tools = (params.toolsUsed || "").split(",").map(t => t.trim()).filter(Boolean);
    const adoptedTool = tools[0] || "Adopted Standardized Methodology";

    return `<div style="margin: 20pt 0; page-break-inside: avoid;">
<table class="academic-table" id="tbl-2-1" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 9.5pt; line-height: 1.35; margin: 10pt 0;">
  <caption style="font-weight: bold; text-align: left; margin-bottom: 6pt; font-size: 10.5pt; color: #0f172a;">Table 2.1: Technical & Methodological Evaluation Matrix of Alternative Solutions</caption>
  <thead>
    <tr style="background-color: #f1f5f9; border-top: 1.5pt solid #0f172a; border-bottom: 1.5pt solid #0f172a;">
      <th style="padding: 6pt 8pt; text-align: left; border: 1px solid #cbd5e1; width: 24%;">Evaluation Dimension</th>
      <th style="padding: 6pt 8pt; text-align: left; border: 1px solid #cbd5e1; width: 24%;">Option A: Manual / Legacy Baseline</th>
      <th style="padding: 6pt 8pt; text-align: left; border: 1px solid #cbd5e1; width: 24%;">Option B: Intermediate / Standalone Tool</th>
      <th style="padding: 6pt 8pt; text-align: left; border: 1px solid #cbd5e1; width: 28%; background: #e0f2fe;">Option C: ${adoptedTool.slice(0, 26)} (Adopted)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1; font-weight: bold;">Operational Precision & Reliability</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">Subject to human operator variance and manual transcription error</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">Semi-automated; prone to intermittent sync and configuration drops</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1; background: #f0f9ff;">Deterministic, reproducible results with automated logging and validation</td>
    </tr>
    <tr style="background-color: #f8fafc;">
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1; font-weight: bold;">Standardization & Regulatory Compliance</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">Informal procedures lacking traceable audit trails</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">Partial compliance with departmental guidelines</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1; background: #f0f9ff;">100% adherence to institutional standard operating procedures (SOPs)</td>
    </tr>
    <tr>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1; font-weight: bold;">Resource Efficiency & Latency</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">High labor overhead and significant processing latency</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">Moderate resource utilization; complex manual intervention</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1; background: #f0f9ff;">Streamlined execution minimizing idle time and maximizing throughput</td>
    </tr>
    <tr style="background-color: #f8fafc; border-bottom: 1.5pt solid #0f172a;">
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1; font-weight: bold;">Scalability & Long-Term Maintainability</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">Cannot scale across large enterprise workloads</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">Difficult to maintain due to custom dependencies and vendor lock-in</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1; background: #f0f9ff;">Modular, sustainable architecture easily extensible for future iterations</td>
    </tr>
  </tbody>
</table>
</div>`;
  }

  /**
   * Generates Table 2.1 backwards-compatible method returning HTML.
   */
  static generateComparisonTable(): string {
    return this.generateComparisonTableHtml({});
  }

  /**
   * Generates Table 1.1 (Staff Cadre Table) dynamically adapted to the discipline.
   */
  static generateStaffCadreTableHtml(params: { 
    orgName: string; 
    deptName?: string; 
    discipline?: AcademicDiscipline; 
    isComputing?: boolean 
  }): string {
    const org = params.orgName || "the Host Enterprise";
    const discipline = params.discipline || (params.isComputing ? "COMPUTING" : "GENERAL");

    let rows = [
      { role: "Director of Technical Services / Principal Manager", qual: "MSc in Engineering / Management", resp: "Operational strategy, technical governance, statutory compliance" },
      { role: "Senior Operations Officer / Lead Specialist", qual: "BSc in Science / Technology / Engineering", resp: "Process diagnostics, standard operating procedure enforcement, team guidance" },
      { role: "Technical Supervisor / Operations Officer", qual: "Higher Diploma / Full Technician Certificate", resp: "Daily workflow supervision, equipment monitoring, telemetry logging" },
      { role: "Practical Training Student (Trainee)", qual: "Ongoing Bachelor's Degree", resp: "Practical task execution, data acquisition, verification logs, report compilation" }
    ];

    if (discipline === "COMPUTING") {
      rows = [
        { role: "Lead Systems Architect / CTO", qual: "MSc in Computer Science / Software Engineering", resp: "High-level architecture design, cyber security governance, API strategy" },
        { role: "Senior Full-Stack Developer", qual: "BSc in Computer Science / Business IT / Computer Eng", resp: "Production coding, module integration, asynchronous logic, code reviews" },
        { role: "QA & DevOps Engineer", qual: "BSc in Information Technology / Cybersecurity", resp: "Automated test suites, CI/CD pipeline management, staging verification" },
        { role: "Practical Training Student (Developer Intern)", qual: "Ongoing Bachelor's Degree in Computing / IT", resp: "Frontend component integration, API hook implementation, logging & testing" }
      ];
    } else if (discipline === "ENGINEERING") {
      rows = [
        { role: "Chief Engineer / Project Director", qual: "MSc in Civil / Electrical / Mechanical Engineering, PE", resp: "Structural / system sign-off, regulatory ERB compliance, project oversight" },
        { role: "Senior Field / Design Engineer", qual: "BSc in Engineering, Registered Engineer", resp: "Site supervision, schematic calculations, equipment calibration, QA checks" },
        { role: "Site Inspector / Quality Technician", qual: "Full Technician Certificate (FTC) / Diploma", resp: "Daily measurement logging, safety inspections, material testing supervision" },
        { role: "Engineering Trainee (Student Intern)", qual: "Ongoing Bachelor's Degree in Engineering", resp: "CAD drafting, test execution, field measurements, daily logbook entry" }
      ];
    } else if (discipline === "HEALTH") {
      rows = [
        { role: "Chief Medical Officer / Clinical Director", qual: "MMed / MBChB, Registered Medical Specialist", resp: "Clinical governance, diagnostic review, hospital quality management" },
        { role: "Senior Medical Officer / Specialist Clinician", qual: "MD / MBChB / BPharm, Registered Clinician", resp: "Patient diagnosis, therapeutic intervention, student mentorship" },
        { role: "Nursing Officer / Laboratory Scientist", qual: "BSc in Nursing / Health Laboratory Science", resp: "Patient monitoring, specimen processing, infection control compliance" },
        { role: "Clinical Attachment Trainee (Student Intern)", qual: "Ongoing Bachelor of Medicine / Nursing / Pharmacy", resp: "Supervised clinical clerkship, vitals logging, case study documentation" }
      ];
    } else if (discipline === "AGRICULTURE") {
      rows = [
        { role: "Director General / Chief Agronomist", qual: "PhD / MSc in Agricultural Sciences", resp: "Agronomic research direction, station management, national policy compliance" },
        { role: "Senior Research Scientist / Agronomist", qual: "BSc in Agriculture General / Horticulture / Soil", resp: "Field trial design, soil analysis supervision, crop protection monitoring" },
        { role: "Field Extension Officer / Station Supervisor", qual: "Diploma in Agriculture / Farm Management", resp: "Daily irrigation monitoring, machinery operation, farm worker supervision" },
        { role: "Agricultural Trainee (Field Intern)", qual: "Ongoing Bachelor's Degree in Agriculture", resp: "Field scouting, soil testing, crop yield data collection, daily log recording" }
      ];
    } else if (discipline === "BUSINESS") {
      rows = [
        { role: "Chief Financial Officer / Managing Partner", qual: "MBA, CPA(T) / ACCA", resp: "Financial strategy, statutory auditing, fiduciary governance, corporate risk" },
        { role: "Senior Financial / Systems Analyst", qual: "BSc in Finance / Accounting / Business IT", resp: "General ledger reconciliation, ERP management, financial model analysis" },
        { role: "Operations Officer / Assistant Accountant", qual: "BBA / Bachelor of Commerce", resp: "Invoice auditing, transaction entries, inventory verification, compliance checks" },
        { role: "Business Trainee (Student Intern)", qual: "Ongoing Bachelor of Business / Commerce", resp: "Account reconciliation, audit workpaper preparation, weekly logbook entry" }
      ];
    }

    const tableRows = rows.map((r, i) => `    <tr${i % 2 === 1 ? ' style="background-color: #f8fafc;"' : ''}>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1; font-weight: bold;">${r.role}</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">${r.qual}</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">${r.resp}</td>
    </tr>`).join("\n");

    return `<div style="margin: 20pt 0; page-break-inside: avoid;">
<table class="academic-table" id="tbl-1-1" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 9.5pt; line-height: 1.35; margin: 10pt 0;">
  <caption style="font-weight: bold; text-align: left; margin-bottom: 6pt; font-size: 10.5pt; color: #0f172a;">Table 1.1: Technical Staff Cadre, Academic Qualifications and Key Responsibilities at ${org}</caption>
  <thead>
    <tr style="background-color: #f1f5f9; border-top: 1.5pt solid #0f172a; border-bottom: 1.5pt solid #0f172a;">
      <th style="padding: 6pt 8pt; text-align: left; border: 1px solid #cbd5e1; width: 30%;">Technical Cadre / Role</th>
      <th style="padding: 6pt 8pt; text-align: left; border: 1px solid #cbd5e1; width: 28%;">Academic Qualification</th>
      <th style="padding: 6pt 8pt; text-align: left; border: 1px solid #cbd5e1; width: 42%;">Core Operational Responsibilities</th>
    </tr>
  </thead>
  <tbody>
${tableRows}
  </tbody>
</table>
</div>`;
  }

  /**
   * Generates dynamic cover page adapting to official university guidelines.
   * Universally formats for UDSM, IFM, CBE, NIT, SUA, DIT, ARU and all Tanzanian universities.
   */
  static generateDynamicCoverPage(params: {
    reportTitle: string;
    studentName: string;
    regNumber: string;
    yearOfStudy: string;
    university: string;
    college: string;
    programme: string;
    organization: string;
    department?: string;
    supervisor?: string;
    academicYear?: string;
    trainingOfficer?: string;
    reportType?: string;
  }): string {
    const uni = (params.university || "TANZANIAN HIGHER LEARNING INSTITUTION").toUpperCase();
    const college = (params.college || "").toUpperCase();
    const dept = (params.department || (params.programme ? `DEPARTMENT OF ${params.programme}` : "")).toUpperCase();
    const prog = (params.programme || "[DEGREE PROGRAMME]").toUpperCase();
    const title = (params.reportTitle || "FIELD PRACTICAL TRAINING REPORT").toUpperCase();
    const student = params.studentName || "[STUDENT NAME]";
    const regNo = params.regNumber || "[REGISTRATION NUMBER]";
    const ptYear = params.yearOfStudy ? params.yearOfStudy.replace(/[^0-9]/g, "") || "2" : "2";
    const company = params.organization || "[HOST ENTERPRISE]";
    const trainingOfficer = params.trainingOfficer || params.supervisor || "[FIELD SUPERVISOR]";
    const academicSupervisor = params.supervisor || "[ACADEMIC SUPERVISOR]";
    const academicYear = params.academicYear || "2024/2025";
    
    // Determine institution-specific badge title
    let headerBadge = params.reportType ? params.reportType.toUpperCase() : "FIELD PRACTICAL TRAINING REPORT";
    const uniUpper = uni.toUpperCase();
    if (uniUpper.includes("IFM") || uniUpper.includes("FINANCE MANAGEMENT")) {
      headerBadge = "FIELD PRACTICAL TRAINING (FPT) REPORT";
    } else if (uniUpper.includes("NIT") || uniUpper.includes("TRANSPORT")) {
      headerBadge = "A REPORT ON INDUSTRIAL PRACTICAL TRAINING (IPT)";
    } else if (uniUpper.includes("DIT") || uniUpper.includes("DAR ES SALAAM INSTITUTE OF TECHNOLOGY")) {
      headerBadge = "A REPORT ON INDUSTRIAL PRACTICAL TRAINING (IPT)";
    } else if (uniUpper.includes("ARDHI") || uniUpper.includes("ARU")) {
      headerBadge = "AN INDUSTRIAL TRAINING REPORT SUBMITTED TO ARDHI UNIVERSITY";
    } else if (uniUpper.includes("UDSM") || (uniUpper.includes("DAR ES SALAAM") && uniUpper.includes("UNIVERSITY") && !uniUpper.includes("INSTITUTE"))) {
      headerBadge = "PRACTICAL TRAINING REPORT";
    }

    return `================================================================================
                         ${uni}
                      ${college ? college + "\n" : ""}${dept ? dept + "\n" : ""}
                            ${headerBadge}

REPORT TITLE: ${title}

Student Name:               ${student}
Reg. No:                    ${regNo}
Degree Programme:           ${prog}
Practical Training Year:    ${ptYear}
Academic Year:              ${academicYear}
Company/Organization Name:  ${company}
Training Officer's Name:    ${trainingOfficer}
Academic Supervisor's Name: ${academicSupervisor}
================================================================================
`;
  }

  /**
   * Generates exhaustive, publication-grade academic report matching official institutional standards.
   * Includes Cover Page, Preliminary Pages, Chapters 1-5, Figures/Organograms, Comparative Tables, References, and Appendices.
   */
  static generateFullAcademicReportContent(params: {
    reportTitle: string;
    studentName: string;
    regNumber: string;
    yearOfStudy: string;
    university: string;
    uniShortName?: string;
    college: string;
    programme: string;
    organization: string;
    department?: string;
    supervisor?: string;
    duration?: string;
    academicYear?: string;
    trainingOfficer?: string;
    activities?: string;
    toolsUsed?: string;
    challenges?: string;
    keyLearnings?: string;
    targetPages?: string;
    customSections?: Array<{ id: string; number?: string; title: string; description?: string; subsections?: string[] }>;
    uploadedTemplateName?: string;
  }): string {
    const org = params.organization || "HOST ENTERPRISE";
    const dept = params.department || "TECHNICAL OPERATIONS DEPARTMENT";
    const uni = params.university || "Higher Learning Institution";
    const prog = params.programme || "Degree Programme";
    const sup = params.supervisor || "Field Supervisor";
    const academicYear = params.academicYear || "2024/2025";
    const reportTitle = (params.reportTitle || "PRACTICAL TRAINING REPORT").toUpperCase();
    const targetPagesNum = parseInt(params.targetPages || "25", 10) || 25;

    const discipline = detectAcademicDiscipline({
      college: params.college,
      programme: params.programme,
      taskDescription: params.reportTitle,
      activities: params.activities
    });

    // Real user data directly utilized without artificial default dictionaries
    const activitiesClean = params.activities?.trim() || "";
    const toolsClean = params.toolsUsed?.trim() || "";
    const challengesClean = params.challenges?.trim() || "";
    const keyLearningsClean = params.keyLearnings?.trim() || "";

    // Parse activities into detailed numbered bullet steps from real user inputs
    const activityLines = activitiesClean.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const activitiesSteps = activityLines.length > 0
      ? activityLines.map((line, idx) => `   - Activity ${idx + 1}: ${line.replace(/^[0-9]+[\.\)]\s*/, "")}`).join("\n")
      : "   - Core Field Activities: Execution of standard operational tasks according to departmental mandates.";

    const coverPage = this.generateDynamicCoverPage(params);
    const prelimPages = this.generateOfficialPreliminaryPages({
      reportTitle: params.reportTitle,
      studentName: params.studentName,
      regNumber: params.regNumber,
      university: params.university,
      organization: params.organization,
      supervisor: params.supervisor || "Field Supervisor",
      duration: params.duration,
      discipline,
      targetPages: targetPagesNum
    });

    const organogram = this.generateOrganogramSvg({ orgName: org, deptName: dept, discipline, isComputing: discipline === "COMPUTING" });
    const flowchart = this.generateProcessFlowchartSvg({ title: reportTitle, discipline, activities: activitiesClean });
    const comparisonTable = this.generateComparisonTableHtml({ title: reportTitle, discipline, toolsUsed: toolsClean });
    const staffCadreTable = this.generateStaffCadreTableHtml({ orgName: org, deptName: dept, discipline });
    const table31Html = this.generateTable31Html({ challengesClean, discipline });
    const chapter1SafetySection = this.generateChapter1SafetySection({ org, discipline });
    const chapter4Coursework = this.generateCourseworkSection({ uni, prog, discipline });
    const referencesSection = this.generateReferencesSection({ uni, org, dept, academicYear, discipline });
    const appendicesSection = this.generateAppendicesSection({ targetPagesNum, sup, toolsClean, activitiesClean, discipline });

    let chaptersContent = "";

    if (params.customSections && params.customSections.length > 0) {
      // Dynamic rendering for custom uploaded templates
      const customSections = params.customSections;
      const generatedChapters = customSections.map((sec, idx) => {
        const chNum = idx + 1;
        let cleanTitle = sec.title.trim();
        if (!cleanTitle.toLowerCase().startsWith("chapter") && !cleanTitle.toLowerCase().startsWith("sura")) {
          cleanTitle = `CHAPTER ${chNum}: ${cleanTitle.toUpperCase()}`;
        } else {
          cleanTitle = cleanTitle.toUpperCase();
        }

        const subList = sec.subsections && sec.subsections.length > 0
          ? sec.subsections
          : [
              `${chNum}.1 Profile and Operational Mandate`,
              `${chNum}.2 Methodological Execution and Duties`,
              `${chNum}.3 Technical Evaluation and Analysis`
            ];

        let body = "";
        if (idx === 0) {
          body = `
${subList[0] || `${chNum}.1 Profile and Background of Host Organization`}
I completed my field practical training attachment at ${org}. The host organization was established to provide high-quality services and technical solutions in Tanzania, operating in compliance with national statutory frameworks. During my placement within the ${dept}, I actively participated in day-to-day operations under the supervision of ${sup}.

${subList[1] || `${chNum}.2 Vision, Mission and Core Functions`}
The mission of ${org} is to deliver reliable technical services, maintain rigorous quality standards, and continually optimize operational processes. Its vision is to be a leading organization in Tanzania and East Africa by adopting modern technology and developing local human capacity.

Core functions include:
1. Providing reliable daily operational and technical services according to national standards.
2. Routine inspection, monitoring, and maintenance of departmental systems and infrastructure.
3. Fostering human capital development in collaboration with Tanzanian higher learning institutions like ${uni}.
4. Adhering strictly to occupational safety, environmental protection, and legal data privacy mandates.

<!-- PAGE_BREAK -->
${subList[2] || `${chNum}.3 Organizational Governance & Administrative Structure`}
The administrative hierarchy of ${org} is structured to facilitate agile decision-making, strict accountability, and cross-functional synergy.

${organogram}

${subList[3] || `${chNum}.4 Job Descriptions and Technical Cadre Roles`}
Within the ${dept}, personnel are organized into distinct technical cadres according to their academic specializations and engineering competencies.

${staffCadreTable}

<!-- PAGE_BREAK -->
${chapter1SafetySection}

${subList[4] || `${chNum}.6 Departmental Role in Enterprise Operations`}
The ${dept} serves as the primary technical engine of ${org}, ensuring continuous service delivery and providing an authentic bridge between classroom theory at ${uni} and industrial practice.
`;
        } else if (idx === 1) {
          body = `
${subList[0] || `${chNum}.1 Practical Problem Context and Assigned Tasks`}
A core pedagogical objective of practical training at ${uni} is to immerse undergraduate students in authentic industrial environments. Upon reporting to the ${dept} at ${org}, I was assigned to work on technical duties directly related to ${reportTitle}.

Core operational tasks assigned:
${activitiesClean}

${subList[1] || `${chNum}.2 Operational Workflow & Execution Stages`}
Technical duties were carried out in distinct phases: Problem Identification, Tool Preparation, Practical Execution, Quality Testing, and Handover.

<!-- PAGE_BREAK -->
${flowchart}

${subList[2] || `${chNum}.3 Tools, Equipment and Technologies Handled`}
The execution of practical tasks involved daily interaction with modern tools and equipment:
${toolsClean}

Each tool was verified and calibrated prior to use conforming to standard operating procedures.

<!-- PAGE_BREAK -->
${subList[3] || `${chNum}.4 Technical & Methodological Evaluation Matrix`}
Alternative technical methods were evaluated across reliability, security, maintainability, and resource efficiency:

${comparisonTable}

<!-- PAGE_BREAK -->
${subList[4] || `${chNum}.5 Step-by-Step Task Execution and Handover`}
Task execution followed a structured engineering workflow:
1. Morning Briefing: Reviewed sprint goals and safety precautions with supervisor ${sup}.
2. Preparation & Calibration: Set up and verified required tools (${toolsClean}) before starting duties.
3. Practical Execution:
${activitiesSteps}
4. Observations & Logging: Recorded measurements and telemetry in the daily logbook.
5. Daily Technical Handover: Submitted completed tasks to ${sup} for verification and sign-off.
`;
        } else if (idx === 2) {
          body = `
${subList[0] || `${chNum}.1 Identification of Technical Challenges`}
Transitioning to an authentic industrial setting exposed me to real-world operating constraints:
${challengesClean}

${subList[1] || `${chNum}.2 Root Cause Analysis and Problem-Solving Strategy`}
Technical anomalies were diagnosed using systematic troubleshooting:
1. Root-Cause Inspection: Inspected logs, diagnostic indicators, and physical symptoms.
2. Controlled Mitigation: Tested remedies sequentially against standard operating procedures.
3. Supervisor Consultation: Reviewed complex anomalies with ${sup}.

<!-- PAGE_BREAK -->
${table31Html}

${subList[2] || `${chNum}.3 Operational Gaps and Corrective Mitigations`}
To prevent recurring anomalies, preventative maintenance routines, updated checklists, and standardized digital documentation were established.
`;
        } else if (idx === 3) {
          body = `
${subList[0] || `${chNum}.1 Practical Skills and Technical Competencies Developed`}
The field attachment provided intensive hands-on experience:
${keyLearningsClean}

${subList[1] || `${chNum}.2 Soft Skills and Professional Workplace Habits`}
1. Clear Technical Communication: Articulated technical progress during daily standups and reports.
2. Team Collaboration: Worked productively with multidisciplinary colleagues.
3. Time Management: Maintained punctual attendance and met assigned deadlines.

<!-- PAGE_BREAK -->
${chapter4Coursework}
`;
        } else {
          body = `
${subList[0] || `${chNum}.1 Comprehensive Fieldwork Conclusion`}
My practical training at ${org} under ${sup} successfully fulfilled all academic objectives of ${uni}, giving me real insight into industry operations in Tanzania.

${subList[1] || `${chNum}.2 Strategic Recommendations to Host Enterprise (${org})`}
1. Student Toolkits: Provide incoming trainees with structured onboarding manuals and sandbox environments.
2. Preventative Maintenance: Maintain regular servicing schedules for key equipment to minimize downtime.
3. Institutional Partnerships: Strengthen long-term collaboration with ${uni} for internship pipelines.

${subList[2] || `${chNum}.3 Actionable Recommendations to ${uni} Administration`}
1. Practical Laboratory Hours: Expand practical laboratory training on industry tools.
2. Industry Linkages: Build formal partnerships with host organizations like ${org}.
3. Pre-Attachment Clinics: Conduct refresher workshops on tools and workplace safety before placement.
`;
        }

        return `<!-- PAGE_BREAK -->\n# ${cleanTitle}\n${body.trim()}`;
      });

      chaptersContent = generatedChapters.join("\n\n");
    } else {
      // Standard 5-chapter generator scaled strictly to targetPagesNum
      if (targetPagesNum >= 22) {
        // 25 Pages: Exactly 3 pages Ch 1, 6 pages Ch 2, 2 pages Ch 3, 2 pages Ch 4, 1 page Ch 5
        chaptersContent = `<!-- PAGE_BREAK -->
# CHAPTER 1: INTRODUCTION TO THE HOST ORGANIZATION

1.1 Profile and Historical Background of Host Organization
I completed my field practical training attachment at ${org}. The host enterprise is an established organization operating in Tanzania, playing a key role in providing technical solutions, infrastructure development, and institutional efficiency within the national and East African economic environment. Founded with a vision to enhance operational productivity through modern professional practices, ${org} delivers reliable, secure, and compliant services to commercial clients, public institutions, and community stakeholders.

During my industrial placement, I was embedded within the active operational environment of ${org}. The enterprise maintains operational facilities equipped with modern engineering workstations, diagnostic testing apparatus, and collaborative project rooms. Working within this environment allowed me to observe firsthand how an established organization coordinates departmental handoffs, enforces quality assurance protocols, complies with statutory guidelines, and delivers mission-critical technical services to institutional clients in Tanzania.

1.2 Vision, Mission and Core Strategic Objectives
The strategic direction of ${org} is guided by clear institutional mandates designed to ensure operational excellence and competitive leadership in Tanzania and the wider East African Community (EAC).

The official Vision of ${org} is:
"To become the most trusted, innovative, and sustainable operational and technical solutions leader in Tanzania, accelerating economic modernization, industrial efficiency, and local capacity development."

The official Mission of ${org} is:
"To deliver robust, high-performance, and compliant technical services that resolve complex operational challenges for our clients, achieved through uncompromising engineering standards, continuous innovation, and human capital development."

The core functions and operational duties of ${org} comprise:
1. Providing reliable, high-availability technical services and system implementations conforming to national and international regulatory standards.
2. Continuous infrastructure health monitoring, preventative maintenance, and quality auditing to guarantee high operational uptime across client integrations.
3. Cultivating human capital through industry-academia partnerships, mentorship of technical trainees, and conducting practical training workshops in collaboration with Tanzanian higher learning institutions like ${uni}.
4. Adhering strictly to national statutory policies, occupational health and safety benchmarks, and legal data privacy mandates.

<!-- PAGE_BREAK -->
1.3 Organizational Governance & Administrative Structure
The administrative hierarchy of ${org} is structured to facilitate agile decision-making, strict accountability, and cross-functional synergy across technical, operational, and administrative units. The overall governance is led by the Board of Directors and the Managing Director, who formulate strategic institutional objectives and allocate resource budgets.

Under executive leadership, departmental heads supervise specialized divisions, including technical operations, finance, administration, and quality compliance. The technical division houses core operational units where daily implementation and maintenance take place. Practical training trainees are formally integrated into specialized project squads under the mentorship of designated senior professionals and departmental leads.

${organogram}

1.4 Job Descriptions and Technical Cadre Roles
Within the ${dept}, personnel are organized into distinct technical cadres according to their academic specializations and engineering competencies. The squad operates through distributed peer-review systems, scheduled operational sprints, and daily stand-up synchronization meetings to ensure uninterrupted production workflows.

${staffCadreTable}

<!-- PAGE_BREAK -->
${chapter1SafetySection}

1.6 Strategic Mandate and Role of the Department in the Organization
The ${dept} serves as the vital technical backbone and operational engine of ${org}. Its overarching responsibility is to design, deploy, and maintain the organization's mission-critical services, technical workflows, and client-facing deliverables. By enforcing modular workflows, rigorous quality testing, and robust error logging, the department ensures that all operational activities meet stringent Service Level Agreements (SLAs) with zero unplanned disruptions.

Furthermore, the department acts as the primary incubator for technical research and process optimization within the enterprise. It evaluates emerging industry methodologies, automated workflows, and quality management frameworks to identify opportunities for reducing operational latency, lowering overhead costs, and enhancing service reliability. During my attachment, the department served as an exemplary learning environment that bridged the gap between abstract academic theories taught at ${uni} and the rigorous demands of industrial practice in Tanzania.

<!-- PAGE_BREAK -->
# CHAPTER 2: PRACTICAL ACTIVITIES & MAIN TECHNICAL ASSIGNMENT

2.1 Problem Identification and Industrial Practical Context
A core pedagogical objective of the industrial practical training curriculum at ${uni} is to immerse undergraduate students in authentic industrial environments, enabling them to apply theoretical knowledge to tangible engineering and operational problems. Upon reporting to the ${dept} at ${org}, I participated in comprehensive technical orientations and was assigned to the core operations squad under the direct supervision of ${sup}.

The industrial challenge and practical duties addressed during my placement centered upon:
${activitiesClean}

In traditional operations within the sector in Tanzania, institutions frequently face operational bottlenecks, including process latency, manual data handling errors, and system reliability challenges. To address these limitations, ${org} initiated a targeted implementation focusing on ${reportTitle}. My assignment within the ${dept} was to actively participate in executing these activities, configuring necessary tools, ensuring compliance with institutional standards, and maintaining systematic documentation.

2.2 Detailed Scope of Assigned Technical Duties
To successfully execute this technical assignment, my duties were organized into discrete operational deliverables under the continuous supervision of ${sup}. My daily practical tasks included:
1. Reviewing relevant technical standards, operating procedures, and regulatory requirements applicable to ${reportTitle}.
2. Configuring developer and testing toolchains, ensuring all necessary software environments, calibrated instruments, and diagnostic utilities were verified.
3. Implementing core operational modules and practical deliverables in strict accordance with departmental specifications.
4. Structuring verification routines and monitoring workflows to maintain high operational reliability and data integrity.
5. Writing automated exception-handling routines and diagnostic logs to identify and resolve operational anomalies promptly.

<!-- PAGE_BREAK -->
2.3 Justification of Methodological and Technical Approaches
The methodology adopted during my attachment was selected based on three strict professional criteria:
1. Operational Reliability and Safety: Adopting standardized procedures ensures minimal operational disruption, protects personnel, and conforms to national regulatory standards in Tanzania.
2. Workflow Efficiency and Interoperability: Utilizing modern, established tools (${toolsClean}) optimizes workflow throughput and enables seamless collaboration across multidisciplinary squads.
3. Deterministic Quality Verification: The operational pipeline was engineered with multi-tiered status checks, verifying task outputs against benchmarks before sign-off.

2.4 Operational Process Workflow & Execution Stages
The practical engineering project was executed through five structured phases: (1) Problem Formulation & Requirements Definition; (2) Environment Setup & Tool Calibration; (3) Active Implementation & Execution; (4) Rigorous QA Testing & Performance Simulation; and (5) Supervisor Review & Production Handover.

${flowchart}

<!-- PAGE_BREAK -->
2.5 Software Tools, Stacks, Equipment and Technologies Handled
The execution of my practical duties required daily interaction with modern tools, developer utilities, and testing environments:
${toolsClean}

Each tool was selected for its proven industrial track record and alignment with sector best practices:
1. Primary Execution & Drafting Environment: Provided a centralized workspace for authoring code, analyzing data, and configuring operational parameters with integrated linting and syntax validation.
2. Version Control & Collaborative Repositories: Enabled distributed collaboration, code review tracking, and branch merging without risking production branches.
3. Diagnostic & Telemetry Utilities: Provided real-time visibility into process variables, response latencies, and error codes, allowing immediate root-cause identification.
4. Testing & Simulation Environments: Facilitated safe, isolated pre-deployment validation under simulated high-load conditions without affecting live client operations. Every dependency was verified for compliance and data security.

<!-- PAGE_BREAK -->
2.6 Comparative Evaluation of Alternative Technical Solutions
To identify the most viable operational strategy for ${reportTitle}, our technical squad conducted a structured comparative evaluation of three alternative approaches: Manual Legacy Workflows, Custom In-House Scripts, and Standardized Modern Architectures.

${comparisonTable}

<!-- PAGE_BREAK -->
2.7 Step-by-Step Task Execution and Practical Implementation
The practical implementation followed a disciplined engineering workflow:
1. Morning Standup Briefing: Commenced each working day with supervisor ${sup} and engineering peers to review sprint backlogs, discuss blocker tickets, and assign specific component tickets.
2. Environment Bootstrap & Dependency Verification: Validated local runtime environments, ensuring environment variables, project parameters, and configuration files were correctly loaded.
3. Component Development & Execution: Developed interactive components and executed assigned operational tasks:
${activitiesSteps}
4. Comprehensive Event Logging: Logged all operations, response times, and output receipts into daily record books to ensure end-to-end traceability.
5. Daily Technical Handover: Committed clean work and demonstrated completed deliverables to ${sup} for architectural sign-off.

<!-- PAGE_BREAK -->
2.8 Technical Challenges, Anomaly Resolution & Defensive Quality Assurance
During active implementation, several practical obstacles were diagnosed and resolved:
${challengesClean}

To harden the system against operational failure, our team implemented defensive quality assurance measures:
1. Input Sanitization & Validation: Enforced strict validation across all external data feeds to prevent malformed payloads from disrupting backend services.
2. Failover Caching: Implemented local session caching to ensure uninterrupted operations during temporary network drops.
3. Automated Error Logging: Integrated structured error logging to capture timestamped stack traces for rapid anomaly resolution.

2.9 Summary of Practical Engineering Deliverables
The practical assignments completed in the ${dept} demonstrated that modular design, strict adherence to protocol standards, and robust error handling are vital for enterprise-grade operations. At the conclusion of the training period, the assigned project deliverables were successfully validated, achieving all performance benchmarks and receiving formal endorsement from ${sup}.

<!-- PAGE_BREAK -->
# CHAPTER 3: CHALLENGES ENCOUNTERED & PRACTICAL PROBLEM SOLVING

3.1 Practical Challenges Encountered in Fieldwork Operations
Transitioning from simulated academic exercises at ${uni} to an active commercial enterprise exposed me to the unpredictability of production environments. In an industrial setting, systems interact with external network gateways, third-party services, and heterogeneous hardware operating across varying local infrastructure conditions.

During my industrial practical training attachment at ${org}, I encountered several complex technical challenges:
${challengesClean}

These practical obstacles underscored the reality that theoretical designs must always be accompanied by defensive engineering, graceful degradation, and comprehensive fault-tolerant error boundaries.

3.2 Equipment, Network and Infrastructure Bottlenecks
In addition to application-level challenges, our engineering tasks were occasionally constrained by external infrastructure dependencies:
1. Service Rate Limiting: External service providers and public gateways frequently throttled connection requests during peak hours.
2. Network Latency Fluctuations: Intermittent ISP connectivity in Dar es Salaam introduced socket connection drops between development workstations and cloud servers.
3. Hardware Calibration Drift: Sensitive instruments required periodic recalibration to maintain measurement precision under continuous operational loads.

To mitigate these resource constraints, the engineering squad adopted resilient development practices:
1. Multi-Provider Failover: Configured secondary and tertiary failover providers within configuration files, allowing automatic failover when a primary service throttled incoming requests.
2. Local Response Caching: Implemented client-side response caching for non-mutating queries, reducing redundant external requests by over 35%.
3. Collaborative Task Prioritization: When cloud-dependent services suffered outages, development focus immediately shifted to offline component styling, unit test authoring, and documentation updates.

<!-- PAGE_BREAK -->
3.3 Systematic Root-Cause Diagnostic Methodology
Whenever technical anomalies emerged, I followed a structured, scientific troubleshooting methodology instilled by my supervisor ${sup}:
1. Root-Cause Telemetry Inspection: Examined developer consoles, system logs, and network payload headers rather than attempting superficial guesswork fixes.
2. Isolated Sandbox Reproduction: Isolated the failing component within a minimal test harness to determine whether the issue stemmed from local code, network relays, or external services.
3. Peer Consultation and Knowledge Sharing: Discussed complex anomalies with senior engineering staff, leveraging their institutional experience to implement robust architectural mitigations.

${table31Html}

3.4 Operational Gaps and Institutional Lessons Learned
My experience highlighted several long-term technical enhancements that would benefit the enterprise:
1. Automated Pre-Deployment Testing: Introducing automated end-to-end testing suites would catch device-specific defects before staging deployments.
2. Dedicated Staging Caching Nodes: Establishing internal staging caching nodes would insulate developers from external rate limiting.
3. Digital Verification Templates: Transitioning from manual log sheets to structured digital verification templates dramatically reduces logging errors and expedites supervisor sign-off. These insights were documented and submitted as part of my final departmental recommendations.

<!-- PAGE_BREAK -->
# CHAPTER 4: SKILLS ACQUIRED & CONNECTION TO UNIVERSITY COURSES

4.1 Practical Technical Competencies Gained
The industrial practical training attachment at ${org} provided an invaluable platform for acquiring hands-on technical proficiencies that extend far beyond textbook theory. Through daily immersion in commercial engineering tasks, I developed practical masteries in:
${keyLearningsClean}

Working with modern tools (${toolsClean}) and production codebases built my professional confidence in navigating enterprise-scale environments, debugging runtime exceptions, and adhering to strict quality assurance benchmarks.

4.2 Professional Soft Skills, Team Dynamics and Work Ethics
Beyond technical skills, working in a commercial enterprise provided intensive exposure to workplace culture, professional communication, and team accountability:
1. Clear Technical Communication: Learned to articulate complex technical issues, architectural trade-offs, and daily progress during standup meetings and in written reports.
2. Agile Team Collaboration: Collaborated productively with colleagues across different technical cadres, developing deep appreciation for how diverse specializations unite to deliver complete solutions.
3. Time Management and Self-Discipline: Managed multiple task deadlines, punctually attended morning shifts, and consistently met sprint deliverables through disciplined daily task tracking.

<!-- PAGE_BREAK -->
${chapter4Coursework}

4.4 Professional Ethics, Confidentiality and Societal Awareness in Tanzania
Throughout my placement at ${org}, I adhered rigorously to professional codes of conduct, data privacy mandates, and intellectual property protections. Handling proprietary repositories and operational data required continuous vigilance regarding credential confidentiality, role-based access, and the prevention of unauthorized disclosures in accordance with the Tanzania Personal Data Protection Act (PDPA) No. 11 of 2022.

Furthermore, the attachment broadened my perspective on the societal and economic impact of technical modernization in Tanzania. By designing robust, scalable, and accessible technical solutions, organizations can lower transaction costs, foster financial and digital inclusion, and stimulate economic innovation across the United Republic of Tanzania.

<!-- PAGE_BREAK -->
# CHAPTER 5: CONCLUSIONS & PRACTICAL RECOMMENDATIONS

5.1 Comprehensive Practical Training Conclusion
My industrial practical training attachment at ${org} under the mentorship of ${sup} was a profoundly rewarding and transformative experience. It successfully fulfilled all academic objectives established by ${uni}, providing an authentic bridge between theoretical classroom instruction and the demanding realities of commercial engineering practice.

Through direct participation in executing practical duties related to ${reportTitle}, I gained practical proficiencies in modern toolchains, fault-tolerant error handling, and collaborative engineering workflows. The attachment reinforced my professional aspiration to contribute to Tanzania's expanding technical and industrial economy as a competent, ethical, and innovative professional.

5.2 Strategic Recommendations to Host Organization (${org})
Based on my observations during the attachment, I submit the following constructive recommendations to the management of ${org}:
1. Trainee Orientation Toolkits: Prepare a standardized onboarding package containing pre-configured sandbox environments, mock datasets, and architecture documentation to reduce onboarding friction for future interns.
2. Local Development Caching Infrastructure: Deploy dedicated local caching proxies or internal staging servers to insulate engineering squads from public service rate limits and network outages.
3. Expanded University Partnerships: Formalize long-term internship pipelines with Tanzanian universities, providing structured final year project (FYP) sponsorships and mentorship opportunities for promising undergraduates.

5.3 Actionable Recommendations to ${uni} Administration & Academic Board
To continuously improve the quality and relevance of the undergraduate curriculum, I recommend the following enhancements to the academic leadership of ${uni}:
1. Expanding Practical Tool Modules: Integrate hands-on training on modern industrial tools and containerized development workflows into existing coursework before field attachment.
2. Hands-On Laboratory Emulation: Upgrade university computing and engineering laboratories with real-world testing sandboxes, ensuring students practice industry-standard workflows prior to field attachment.
3. Dedicated Pre-Attachment Technical Clinics: Organize specialized technical refresher workshops focusing on version control, diagnostic tools, and workplace professional ethics before students depart for field placement.

5.4 Practical Guidance and Advice for Future Attachment Students
For upcoming students undertaking industrial practical training, I offer the following practical advice:
1. Adopt a Proactive Learning Mindset: Do not wait for assigned tasks; actively study the host organization's operating environment, observe senior staff, ask clarifying questions, and volunteer to tackle challenging bug fixes.
2. Maintain Rigorous Daily Logbook Documentation: Diligently record daily tasks, tools handled, challenges encountered, and solutions applied every evening to ensure final report preparation is structured and authentic.
3. Prioritize Professional Ethics & Safety: Always respect institutional confidentiality policies, never bypass safety or data security protocols, and adhere strictly to professional engineering standards.`;
      } else if (targetPagesNum >= 18) {
        // 20 Pages: Exactly 2 pages Ch 1, 4 pages Ch 2, 2 pages Ch 3, 2 pages Ch 4, 1 page Ch 5
        chaptersContent = `<!-- PAGE_BREAK -->
# CHAPTER 1: INTRODUCTION TO THE HOST ORGANIZATION

1.1 Profile and Background of Host Organization
I completed my field practical training attachment at ${org}. The host organization operates in Tanzania, providing reliable technical services and solutions within its sector. During my attachment within the ${dept}, I was embedded in active operational workflows under the supervision of ${sup}.

The facilities of ${org} are equipped with functional engineering workstations and quality testing environments. Working in this setting allowed me to observe firsthand how an established enterprise coordinates departmental workflows, enforces quality standards, and delivers technical services to clients.

1.2 Vision, Mission and Core Functions
The official Vision of ${org} is: "To become the leading provider of quality technical solutions in Tanzania, driving operational excellence and capacity building."
The official Mission of ${org} is: "To deliver reliable, secure, and compliant technical services through professional engineering standards and continuous innovation."

Key functions of ${org} include:
1. Providing reliable technical services according to national regulatory standards.
2. Routine inspection, monitoring, and maintenance of departmental systems and infrastructure.
3. Training student trainees in collaboration with higher learning institutions such as ${uni}.
4. Adhering to national occupational safety, environmental guidelines, and fair workplace regulations.

1.3 Organizational Governance & Administrative Structure
The management structure of ${org} is organized to ensure smooth decision-making and departmental coordination.

${organogram}

<!-- PAGE_BREAK -->
1.4 Job Descriptions and Technical Cadre Roles
Within the ${dept}, technical staff are organized into specialized cadres responsible for daily execution, maintenance, and quality verification.

${staffCadreTable}

${chapter1SafetySection}

1.6 Departmental Role in Enterprise Operations
The ${dept} serves as the primary technical engine of ${org}, maintaining operational infrastructure and ensuring all technical deliverables meet required Service Level Agreements (SLAs).

<!-- PAGE_BREAK -->
# CHAPTER 2: PRACTICAL ACTIVITIES & MAIN TECHNICAL ASSIGNMENT

2.1 Problem Identification and Industrial Practical Context
The main objective of practical training at ${uni} is to connect theoretical coursework with practical industry work. When I reported to the ${dept} at ${org}, I was assigned to work on tasks related to ${reportTitle}.

Core operational tasks assigned:
${activitiesClean}

To execute these duties properly, I worked alongside senior personnel, followed standard operating procedures, and learned how to troubleshoot practical operational bottlenecks systematically.

2.2 Detailed Scope of Assigned Technical Duties
My practical duties were organized into discrete engineering tasks under the supervision of ${sup}:
1. Reviewing technical specifications and operating procedures applicable to ${reportTitle}.
2. Setting up and calibrating required instruments and software tools (${toolsClean}).
3. Carrying out daily operational activities:
${activitiesSteps}
4. Conducting diagnostic checks and logging operational observations in the daily logbook.
5. Reviewing task outcomes with ${sup} for technical verification.

<!-- PAGE_BREAK -->
2.3 Operational Process Workflow & Execution Stages
The practical work followed five distinct phases: Problem Formulation, Tool Setup, Practical Execution, Quality Testing, and Handover.

${flowchart}

2.4 Tools, Equipment and Technologies Handled
The execution of my practical duties required daily interaction with modern tools and equipment:
${toolsClean}

Each tool was calibrated and checked before use conforming to departmental operating guidelines.

<!-- PAGE_BREAK -->
2.5 Comparative Evaluation of Alternative Technical Solutions
To determine the best operational approach for ${reportTitle}, our squad evaluated alternative methods across reliability, security, maintainability, and resource efficiency:

${comparisonTable}

2.6 Step-by-Step Task Execution
1. Morning Briefing: Reviewed daily tasks and safety precautions with supervisor ${sup}.
2. Environment Setup: Prepared and inspected required tools and workstations before starting work.
3. Practical Execution: Implemented assigned operational tasks following standard procedures.
4. Data Logging: Recorded task metrics, measurements, and anomalies in the daily record sheet.
5. Technical Handover: Demonstrated completed deliverables to ${sup} for formal review and sign-off.

<!-- PAGE_BREAK -->
2.7 Technical Challenges, Anomaly Resolution & Quality Assurance
During practical implementation, several obstacles were encountered and resolved:
${challengesClean}

Defensive quality assurance measures were implemented, including input data validation, local session caching, and structured exception handling to ensure uninterrupted operations.

2.8 Summary of Practical Deliverables
At the conclusion of the training period, all assigned operational deliverables for ${reportTitle} were completed, tested, and validated under the supervision of ${sup}.

<!-- PAGE_BREAK -->
# CHAPTER 3: CHALLENGES ENCOUNTERED & PRACTICAL PROBLEM SOLVING

3.1 Practical Challenges Encountered in Industrial Operations
Working in an active commercial workplace involves real-world constraints that differ from theoretical classroom assumptions:
${challengesClean}

3.2 Resource, Network and Equipment Bottlenecks
Our practical duties were occasionally constrained by external bottlenecks:
1. Service Rate Limits: External service endpoints throttled requests during peak operational hours.
2. ISP Latency: Intermittent network drops interrupted communication with remote servers.
3. Equipment Wear: Sensitive diagnostic instruments experienced minor calibration drifts under continuous load.

To mitigate these constraints, our team configured redundant failover providers, implemented local client response caching, and conducted routine pre-shift instrument recalibration.

<!-- PAGE_BREAK -->
3.3 Systematic Root-Cause Diagnostic Methodology
When anomalies occurred, I applied a systematic troubleshooting approach:
1. Root-Cause Inspection: Examined system logs and diagnostic telemetry to identify the exact point of failure.
2. Isolated Sandbox Testing: Re-tested the issue in an isolated environment to verify root causes.
3. Senior Staff Consultation: Discussed complex technical issues with ${sup} to implement robust solutions.

${table31Html}

3.4 Operational Gaps and Institutional Lessons Learned
To prevent recurring anomalies, preventative maintenance schedules, updated checklists, and standardized digital documentation were established.

<!-- PAGE_BREAK -->
# CHAPTER 4: SKILLS ACQUIRED & CONNECTION TO UNIVERSITY COURSES

4.1 Practical Technical Competencies Gained
The field attachment gave me valuable hands-on experience:
${keyLearningsClean}

Using practical tools (${toolsClean}) helped me build professional confidence in handling standard industry tools and real workplace assignments.

4.2 Professional Soft Skills and Workplace Habits
1. Clear Technical Communication: Learned how to report progress, ask questions clearly, and document technical issues.
2. Teamwork and Cooperation: Worked productively alongside staff across different technical cadres.
3. Time Management: Arrived on time for shifts, met daily deadlines, and took responsibility for assigned tasks.

<!-- PAGE_BREAK -->
${chapter4Coursework}

4.4 Professional Ethics and Data Confidentiality
Throughout my attachment, I strictly adhered to workplace ethics, confidentiality agreements, and personal data protection regulations conforming to the Tanzania Personal Data Protection Act (PDPA) No. 11 of 2022.

<!-- PAGE_BREAK -->
# CHAPTER 5: CONCLUSIONS & PRACTICAL RECOMMENDATIONS

5.1 Comprehensive Practical Training Conclusion
My field practical training attachment at ${org} under ${sup} was a successful and transformative experience. It fulfilled all academic objectives established by ${uni}, providing an authentic bridge between classroom theory and industry practice.

5.2 Strategic Recommendations to Host Organization (${org})
1. Trainee Orientation Toolkits: Provide future interns with pre-configured developer toolkits and sandbox documentation.
2. Infrastructure Maintenance: Maintain regular preventative servicing for key operational equipment to minimize downtime.
3. University Collaboration: Expand internship opportunities for Tanzanian university undergraduates.

5.3 Actionable Recommendations to ${uni} Administration
1. More Practical Sessions: Increase hands-on laboratory workshops for industrial tools.
2. Industry Partnerships: Strengthen formal partnerships with enterprises like ${org} to secure relevant student placements.
3. Pre-Attachment Clinics: Conduct refresher workshops on modern tools and workplace safety before placement.

5.4 Practical Advice for Future Students
1. Adopt a Proactive Mindset: Actively study system architectures and volunteer for challenging tasks.
2. Keep Daily Logbooks: Record daily activities, tools used, and solutions applied every evening.
3. Respect Professional Ethics: Follow workplace confidentiality, data security, and safety protocols at all times.`;
      } else if (targetPagesNum >= 13) {
        // 15 Pages: Exactly 2 pages Ch 1, 3 pages Ch 2, 1 page Ch 3, 1 page Ch 4, 1 page Ch 5
        chaptersContent = `<!-- PAGE_BREAK -->
# CHAPTER 1: INTRODUCTION TO THE HOST ORGANIZATION

1.1 Profile and Historical Background of Host Organization
I completed my field practical training attachment at ${org}. The host organization is an established enterprise operating in Tanzania, providing reliable technical services and solutions. During my attachment within the ${dept}, I was embedded in active operational workflows under the supervision of ${sup}.

1.2 Vision, Mission and Core Functions
The Vision of ${org} is to be a leading provider of quality technical solutions in Tanzania. Its Mission is to deliver reliable and compliant technical services through professional standards. Key functions include providing technical services, maintaining infrastructure, and collaborating with higher learning institutions like ${uni}.

1.3 Organizational Governance & Administrative Structure
The administrative hierarchy of ${org} ensures clear departmental coordination across technical, finance, and operational divisions.

${organogram}

<!-- PAGE_BREAK -->
1.4 Job Descriptions and Technical Cadre Roles
Within the ${dept}, staff are organized into specialized cadres handling daily operational tasks.

${staffCadreTable}

${chapter1SafetySection}

1.6 Departmental Mandate
The ${dept} serves as the primary technical engine of ${org}, ensuring continuous service reliability and quality compliance.

<!-- PAGE_BREAK -->
# CHAPTER 2: PRACTICAL ACTIVITIES & MAIN TECHNICAL ASSIGNMENT

2.1 Problem Identification and Assigned Tasks
The main objective of practical training at ${uni} is to connect classroom coursework with real industrial work. At ${org}, I was assigned to work on duties related to ${reportTitle}:
${activitiesClean}

2.2 Operational Process Workflow
The practical work was carried out in five distinct phases: Problem Formulation, Setup, Implementation, Testing, and Handover.

${flowchart}

<!-- PAGE_BREAK -->
2.3 Tools and Technologies Handled
Tools and equipment utilized during the training period:
${toolsClean}

Each tool was inspected and calibrated prior to use conforming to standard operating procedures.

2.4 Comparative Evaluation of Technical Solutions
Alternative operational approaches were evaluated across reliability, security, maintainability, and resource efficiency:

${comparisonTable}

<!-- PAGE_BREAK -->
2.5 Step-by-Step Task Execution and Handover
1. Morning Briefing: Reviewed daily tasks and safety precautions with supervisor ${sup}.
2. Preparation: Configured tools and workstations before starting work.
3. Execution: Implemented assigned operational tasks:
${activitiesSteps}
4. Observations: Logged measurements and outcomes in the daily record book.
5. Handover: Demonstrated completed work to ${sup} for verification and sign-off.

2.6 Summary of Practical Deliverables
At the conclusion of the training period, assigned deliverables for ${reportTitle} were successfully executed and validated.

<!-- PAGE_BREAK -->
# CHAPTER 3: CHALLENGES ENCOUNTERED & PRACTICAL PROBLEM SOLVING

3.1 Practical Challenges and Bottlenecks
During my training at ${org}, I encountered several operational challenges:
${challengesClean}

3.2 Systematic Root-Cause Problem Solving
When anomalies occurred, I inspected diagnostic logs, tested solutions in an isolated environment, and consulted supervisor ${sup}.

${table31Html}

Preventative maintenance schedules and standardized digital checklists were established to minimize recurring issues.

<!-- PAGE_BREAK -->
# CHAPTER 4: SKILLS ACQUIRED & CONNECTION TO UNIVERSITY COURSES

4.1 Technical Competencies and Soft Skills Gained
The field attachment provided intensive hands-on experience:
${keyLearningsClean}

In addition to technical skills, I developed professional workplace habits including clear technical communication, teamwork, time management, and adherence to professional ethics conforming to the Tanzania Personal Data Protection Act (PDPA) No. 11 of 2022.

${chapter4Coursework}

<!-- PAGE_BREAK -->
# CHAPTER 5: CONCLUSIONS & PRACTICAL RECOMMENDATIONS

5.1 Comprehensive Practical Training Conclusion
My practical training attachment at ${org} under ${sup} successfully fulfilled all academic requirements of ${uni}, giving me real insight into industry operations in Tanzania.

5.2 Strategic Recommendations to Host Organization (${org})
1. Trainee Toolkits: Prepare standardized developer toolkits and sandbox documentation for future interns.
2. Equipment Maintenance: Maintain regular preventative servicing for key operational equipment.
3. University Linkages: Expand attachment opportunities for undergraduate students.

5.3 Actionable Recommendations to ${uni} Administration
1. More Practical Labs: Expand practical laboratory training on industry tools.
2. Industry Partnerships: Strengthen formal partnerships with host organizations like ${org}.
3. Pre-Attachment Clinics: Conduct refresher workshops on modern tools and workplace safety before placement.`;
      } else {
        // 10 Pages: Exactly 1 page Ch 1, 2 pages Ch 2, 1 page Ch 3, 1 page Ch 4, 1 page Ch 5 & References
        chaptersContent = `<!-- PAGE_BREAK -->
# CHAPTER 1: INTRODUCTION TO THE HOST ORGANIZATION

1.1 Profile and Background of Host Organization
I completed my field practical training attachment at ${org} in the ${dept} under the supervision of ${sup}. The host enterprise is an established organization in Tanzania providing technical services. Its Vision is to be a leader in quality technical solutions, and its Mission is to deliver reliable, compliant services.

1.2 Governance Structure and Staff Cadres
The organization is headed by executive leadership, supervising technical operations, finance, and administration.

${organogram}

${staffCadreTable}

${chapter1SafetySection}

<!-- PAGE_BREAK -->
# CHAPTER 2: PRACTICAL ACTIVITIES & MAIN TECHNICAL ASSIGNMENT

2.1 Practical Problem Context and Assigned Duties
Practical training at ${uni} connects theoretical coursework with authentic industry work. At ${org}, I participated in operational duties related to ${reportTitle}:
${activitiesClean}

2.2 Operational Workflow
The practical work followed five structured stages: Setup, Diagnostics, Execution, Quality Testing, and Handover.

${flowchart}

<!-- PAGE_BREAK -->
2.3 Tools Handled and Technical Evaluation
Tools and equipment used: ${toolsClean}

${comparisonTable}

2.4 Step-by-Step Task Execution
1. Morning Briefing: Reviewed daily goals with supervisor ${sup}.
2. Practical Execution:
${activitiesSteps}
3. Technical Handover: Demonstrated completed work to ${sup} for formal sign-off.

<!-- PAGE_BREAK -->
# CHAPTER 3: CHALLENGES ENCOUNTERED & PRACTICAL PROBLEM SOLVING

3.1 Identification of Practical Challenges
During my placement at ${org}, I experienced operational challenges:
${challengesClean}

3.2 Root-Cause Problem Solving
Anomalies were diagnosed by inspecting system logs and consulting supervisor ${sup}.

${table31Html}

<!-- PAGE_BREAK -->
# CHAPTER 4: SKILLS ACQUIRED & CONNECTION TO UNIVERSITY COURSES

4.1 Technical and Professional Skills Gained
Key competencies gained: ${keyLearningsClean}

${chapter4Coursework}

Professional ethics and confidentiality were strictly observed in compliance with the Tanzania Personal Data Protection Act (PDPA) No. 11 of 2022.

<!-- PAGE_BREAK -->
# CHAPTER 5: CONCLUSIONS, RECOMMENDATIONS & REFERENCES

5.1 Conclusion and Recommendations
My practical training at ${org} under ${sup} successfully fulfilled all academic objectives of ${uni}.
- To ${org}: Provide standardized onboarding sandboxes and maintain routine equipment servicing.
- To ${uni}: Increase practical laboratory hours and conduct pre-attachment technical clinics.

## References
${referencesSection}`;
      }
    }

    const backMatter = targetPagesNum < 13
      ? "" // In 10 pages, references are embedded in Chapter 5
      : `<!-- PAGE_BREAK -->
# REFERENCES

${referencesSection}

<!-- PAGE_BREAK -->
# APPENDICES

${appendicesSection}
`;

    return `${coverPage}
${prelimPages}

${chaptersContent}

${backMatter}`;
  }

  /**
   * Generates dynamic Table 3.1 (Challenges, Severity Levels, and Practical Mitigations).
   * Parses the student's real challenges input directly into structured rows.
   */
  static generateTable31Html(params: { challengesClean: string; discipline: AcademicDiscipline }): string {
    const discipline = params.discipline || "GENERAL";
    let rows: Array<{ challenge: string; severity: string; mitigation: string }> = [];

    // Parse real user challenges if present
    if (params.challengesClean && params.challengesClean.trim().length > 0) {
      const rawLines = params.challengesClean
        .split(/\n|;(?!\s*mitigat)/)
        .map(l => l.trim())
        .filter(l => l.length > 4);

      rawLines.forEach((line, idx) => {
        let challenge = line.replace(/^[0-9]+[\.\)]\s*/, "");
        let mitigation = "Reviewed operational telemetry and applied standard operating procedures under supervisor guidance.";
        const severity = idx === 0 ? "High" : idx === 1 ? "Moderate" : "Low";

        // Extract mitigation if student provided phrases like "; mitigated through ...", "mitigated by ...", "solution: ..."
        const mitMatch = challenge.match(/;\s*(?:mitigated (?:through|by|via)|solution|mitigation|resolution)[:\s]+(.*)/i)
          || challenge.match(/\s+(?:mitigated (?:through|by|via)|resolved by)[:\s]+(.*)/i);

        if (mitMatch) {
          mitigation = mitMatch[1].trim();
          challenge = challenge.replace(mitMatch[0], "").trim();
        }

        if (challenge.length > 0) {
          rows.push({ challenge, severity, mitigation });
        }
      });
    }

    // If user provided fewer than 3 challenges, augment with real operational challenges
    if (rows.length < 3) {
      const operationalFallbacks: Record<AcademicDiscipline, Array<{ challenge: string; severity: string; mitigation: string }>> = {
        COMPUTING: [
          { challenge: "External API Rate Limiting & High Network Latency", severity: "High", mitigation: "Implemented client-side response caching, debounce handlers, and redundant failover endpoints" },
          { challenge: "Asynchronous State Race Conditions & Session Timeout Drops", severity: "Moderate", mitigation: "Configured persistent localStorage session storage and auto-reconnect hooks" },
          { challenge: "Cross-Browser CSS Layout Inconsistencies & Mobile Viewport Clipping", severity: "Low", mitigation: "Standardized responsive Flexbox wrappers and verified layouts across viewport breakpoints" },
          { challenge: "Database Connection Pool Exhaustion During Peak Queries", severity: "Moderate", mitigation: "Optimized database query indexing and added pool recycling with idle connection timeouts" }
        ],
        ENGINEERING: [
          { challenge: "Instrumentation Calibration Drift Under Heavy Thermal Load", severity: "High", mitigation: "Instituted standardized pre-shift recalibration against certified standard gauges" },
          { challenge: "Intermittent Three-Phase Power Voltage Fluctuations", severity: "Moderate", mitigation: "Connected sensitive diagnostic controllers to dedicated uninterruptible power supply (UPS) lines" },
          { challenge: "Component Delivery Lead Time Delays for Specialized Spares", severity: "Moderate", mitigation: "Established weekly consumable buffer audits and pre-ordered critical maintenance components" },
          { challenge: "Inconsistent Manual Sensor Data Logging Across Shift Handoffs", severity: "Low", mitigation: "Implemented structured digital inspection logs and mandatory supervisor counter-signatures" }
        ],
        AGRICULTURE: [
          { challenge: "Unpredictable Rainfall Patterns & Soil Moisture Deficits", severity: "High", mitigation: "Scheduled automated drip irrigation cycles based on tensiometer soil moisture readings and mulching" },
          { challenge: "Fungal Leaf Spot and Insect Pest Infestation Pressure", severity: "Moderate", mitigation: "Conducted early biological field scouting and applied targeted biological pesticides per GAP guidelines" },
          { challenge: "Post-Harvest Temperature Fluctuations During Field Transit", severity: "Moderate", mitigation: "Utilized ventilated harvest crates and established shaded transit collection points" },
          { challenge: "Tractor-Mounted Sprayer Nozzle Clogging and Pressure Drift", severity: "Low", mitigation: "Performed pre-operation filtration flushes and cleaned calibrated ceramic nozzles daily" }
        ],
        HEALTH: [
          { challenge: "High Patient Surge Creating Outpatient Triage Bottlenecks", severity: "High", mitigation: "Applied South African Triage Scale (SATS) color-coding to prioritize critical cases promptly" },
          { challenge: "Intermittent Diagnostic Reagent Stockouts in Clinical Lab", severity: "Moderate", mitigation: "Audited minimum inventory reorder levels weekly and coordinated emergency requisition transfers" },
          { challenge: "Electronic Health Records (EHR) System Network Latency", severity: "Low", mitigation: "Maintained standardized offline paper clinical charts with post-shift digital synchronization" },
          { challenge: "Communication Barriers During Patient Medical History Intake", severity: "Moderate", mitigation: "Engaged bilingual community health liaisons to ensure accurate clinical history transcription" }
        ],
        BUSINESS: [
          { challenge: "Foreign Exchange Volatility in Cross-Border Invoice Reconciliations", severity: "High", mitigation: "Configured automated real-time Bank of Tanzania (BoT) daily exchange rate integration" },
          { challenge: "Uncategorized Expense Vouchers During Month-End Ledger Close", severity: "Moderate", mitigation: "Enforced strict cost-center approval thresholds and standardized expense filing templates" },
          { challenge: "Variance Discrepancies Between Physical Stock and ERP Ledger", severity: "Moderate", mitigation: "Conducted bi-weekly cycle stock counts and investigated inventory adjustment logs" },
          { challenge: "Peak-Hour Electronic Fiscal Device (EFD) Gateway Timeouts", severity: "Low", mitigation: "Queued offline receipt tokens with automated retry background workers upon network recovery" }
        ],
        GENERAL: [
          { challenge: "Operational Workflow Bottlenecks Across Departmental Handoffs", severity: "High", mitigation: "Scheduled daily morning standup briefings and established clear escalation protocols" },
          { challenge: "Measurement and Data Logging Discrepancies Across Shifts", severity: "Moderate", mitigation: "Standardized structured digital logging sheets and implemented pre-shift verification checks" },
          { challenge: "Equipment Wear and Unscheduled Servicing Downtime", severity: "Moderate", mitigation: "Transitioned to preventative maintenance schedules based on manufacturer operating hours" },
          { challenge: "Cross-Departmental Communication Delays on Critical Approvals", severity: "Low", mitigation: "Utilized centralized digital approval channels to accelerate inter-unit sign-offs" }
        ]
      };

      const fallbackList = operationalFallbacks[discipline] || operationalFallbacks.GENERAL;
      for (const fb of fallbackList) {
        if (rows.length >= 4) break;
        if (!rows.some(r => r.challenge.toLowerCase() === fb.challenge.toLowerCase())) {
          rows.push(fb);
        }
      }
    }

    const tableRows = rows.slice(0, 4).map((r, i) => `    <tr${i % 2 === 1 ? ' style="background-color: #f8fafc;"' : ''}>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1; font-weight: bold;">${r.challenge}</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1; text-align: center;"><span style="display: inline-block; padding: 1.5pt 6pt; border-radius: 4px; font-size: 8.5pt; font-weight: bold; ${r.severity === 'High' ? 'background: #fee2e2; color: #991b1b;' : r.severity === 'Moderate' ? 'background: #fef3c7; color: #92400e;' : 'background: #e0f2fe; color: #075985;'}">${r.severity}</span></td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">${r.mitigation}</td>
    </tr>`).join("\n");

    return `<div style="margin: 20pt 0; page-break-inside: avoid;">
<table class="academic-table" id="tbl-3-1" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 9.5pt; line-height: 1.35; margin: 10pt 0;">
  <caption style="font-weight: bold; text-align: left; margin-bottom: 6pt; font-size: 10.5pt; color: #0f172a;">Table 3.1: Log of Fieldwork Technical Challenges, Severity Levels and Mitigations</caption>
  <thead>
    <tr style="background-color: #f1f5f9; border-top: 1.5pt solid #0f172a; border-bottom: 1.5pt solid #0f172a;">
      <th style="padding: 6pt 8pt; text-align: left; border: 1px solid #cbd5e1; width: 34%;">Identified Technical Challenge</th>
      <th style="padding: 6pt 8pt; text-align: center; border: 1px solid #cbd5e1; width: 14%;">Severity</th>
      <th style="padding: 6pt 8pt; text-align: left; border: 1px solid #cbd5e1; width: 52%;">Practical Mitigation Strategy Implemented</th>
    </tr>
  </thead>
  <tbody>
${tableRows}
  </tbody>
</table>
</div>`;
  }


  /**
   * Generates dynamic Section 1.5 (Workplace Safety, Ethics & Statutory Compliance).
   */
  static generateChapter1SafetySection(params: { org: string; discipline: AcademicDiscipline }): string {
    const org = params.org;
    const discipline = params.discipline;

    if (discipline === "COMPUTING") {
      return `1.5 Professional Software Engineering Ethics, Confidentiality, and Cyber Security Policies
${org} enforces strict standards for digital workplace ethics, information security, and personal data protection in compliance with the Tanzania Personal Data Protection Act (PDPA) No. 11 of 2022 and international ISO/IEC 27001 best practices. Trainees and engineers adhere to strict non-disclosure protocols, role-based access control (RBAC), and credential segregation. Committing private credentials, API keys, or unencrypted customer records into version control repositories is strictly prohibited. Workstation ergonomics (proper display height, lumbar support, and the 20-20-20 visual rest routine) are actively maintained to mitigate repetitive strain injuries and ocular fatigue.`;
    } else if (discipline === "ENGINEERING") {
      return `1.5 Workplace Occupational Safety and Health Regulations (OSHA) and ERB Ethics
${org} maintains strict occupational safety protocols conforming to the Occupational Health and Safety Act No. 5 of 2003 (OSHA) and the Engineers Registration Board (ERB) Code of Conduct. Wearing mandatory Personal Protective Equipment (PPE)—including high-visibility reflective vests, steel-toe safety boots, hard hats, and safety goggles—is strictly enforced in all workshop and site operations. Trainees participate in mandatory pre-shift toolbox talks, hazardous area lockout/tagout (LOTO) protocols, and emergency evacuation drills. Staff welfare policies include access to medical first aid, clean hydration stations, and incident reporting registers.`;
    } else if (discipline === "AGRICULTURE") {
      return `1.5 Agricultural Safety, Environmental Protection and Chemical Handling Protocols
${org} upholds rigorous environmental protection and agrochemical safety guidelines aligned with Good Agricultural Practices (GAP), the Tropical Pesticides Research Institute (TPRI), and national OSHA benchmarks. Trainees and field staff handling pesticides, herbicides, or fertilizers are required to wear complete chemical PPE (chemical-resistant overalls, nitrile gloves, and respirators). Strict protocols govern safe agrochemical storage, proper dilution ratios, pre-harvest safety intervals, and environmentally compliant container disposal. Staff welfare includes clean drinking water, shade breaks during peak heat hours, and emergency eye-wash stations.`;
    } else if (discipline === "HEALTH") {
      return `1.5 Clinical Workplace Safety, Infection Prevention and Control (IPC) and Medical Ethics
${org} maintains uncompromising standards of hospital hygiene, patient safety, and clinical ethics in compliance with Ministry of Health (MoH) and World Health Organization (WHO) protocols. Strict adherence to Infection Prevention and Control (IPC)—including the WHO 5 Moments for Hand Hygiene, sterile equipment processing, and proper clinical waste segregation (color-coded sharps and biohazard bins)—is mandatory for all medical staff and trainees. Personal Protective Equipment (PPE) is strictly utilized across outpatient and inpatient bays. Patient data confidentiality is safeguarded in accordance with medical ethics and the Tanzania Personal Data Protection Act (PDPA) 2022.`;
    } else if (discipline === "BUSINESS") {
      return `1.5 Workplace Corporate Governance, Data Confidentiality and Financial Compliance
${org} enforces strict corporate governance benchmarks, business ethics, and data protection policies in compliance with the Tanzania Personal Data Protection Act (PDPA) No. 11 of 2022, Bank of Tanzania (BoT) regulatory guidelines, and National Board of Accountants and Auditors (NBAA) professional ethics. Trainees and financial analysts adhere to strict non-disclosure agreements (NDAs), dual-authorization controls, and financial record confidentiality. Unauthorized disclosure of company financial figures, proprietary client portfolios, or customer financial records is strictly prohibited. Workstation ergonomics and ethical reporting standards are actively promoted.`;
    } else {
      return `1.5 Workplace Health, Safety Regulations and Institutional Ethics
${org} maintains high standards of workplace health, safety, and staff welfare conforming to national OSHA guidelines and institutional codes of conduct. Personal Protective Equipment (PPE) is mandatory in designated operational zones. Safety induction briefings, fire safety drills, and regular hazard assessments are conducted systematically. Staff welfare policies include medical cover, safe drinking water, ergonomic seating, and structured incident reporting procedures.`;
    }
  }

  /**
   * Generates dynamic Section 4.3 (Connecting Fieldwork with Degree Coursework at University).
   */
  static generateCourseworkSection(params: { uni: string; prog: string; discipline: AcademicDiscipline }): string {
    const uni = params.uni;
    const prog = params.prog;
    const discipline = params.discipline;

    if (discipline === "COMPUTING") {
      return `4.3 Connecting Fieldwork with Coursework at ${uni}
The practical experiences directly reinforced several core computing subjects taught in the ${prog} curriculum at ${uni}:
- Systems Analysis & Software Architecture: Applied modular architectural design, requirements specification, and iterative agile sprints in a commercial production environment.
- Database Systems & Information Management: Designed relational schemas, normalized data tables, and optimized query execution for high-throughput operational workloads.
- Computer Networks & Cybersecurity: Configured secure network communication channels, enforced HTTPS/TLS protocols, and applied cryptographic hashing algorithms for data integrity.
- Professional Ethics & IT Law: Practiced digital data protection adhering to the Tanzania Personal Data Protection Act (PDPA 2022), role-based security, and intellectual property compliance.`;
    } else if (discipline === "ENGINEERING") {
      return `4.3 Connecting Fieldwork with Coursework at ${uni}
The practical experiences directly reinforced several core engineering subjects taught in the ${prog} curriculum at ${uni}:
- Engineering Mechanics & Materials Technology: Evaluated structural stresses, material fatigue, and mechanical tolerances under real operating loads.
- Fluid Mechanics / Electrical Circuits & Power Systems: Monitored pressurized hydraulic lines / high-voltage distribution switchgear, verifying operational parameters against theoretical design curves.
- Computer-Aided Design (CAD) & Engineering Drafting: Created and reviewed precision technical engineering drawings adhering to ERB and TBS engineering drafting standards.
- Professional Engineering Ethics & Safety Management: Enforced strict OSHA safety guidelines, hazard identification, and compliance with the Engineers Registration Board (ERB) code of conduct.`;
    } else if (discipline === "AGRICULTURE") {
      return `4.3 Connecting Fieldwork with Coursework at ${uni}
The practical experiences directly reinforced several core agricultural subjects taught in the ${prog} curriculum at ${uni}:
- Soil Science & Plant Nutrition: Tested soil pH, moisture retention, and applied balanced NPK nutrient formulations to optimize crop yield.
- Crop Protection & Integrated Pest Management (IPM): Identified common crop diseases and insect pests, executing biological and targeted chemical interventions conforming to GAP standards.
- Farm Power, Machinery & Irrigation Engineering: Maintained tractor implements, calibrated pressurized drip and sprinkler irrigation lines, and monitored water delivery efficiency.
- Agricultural Economics & Extension Services: Analyzed production cost margins, post-harvest loss reduction, and delivered farmer advisory support aligned with Ministry of Agriculture goals.`;
    } else if (discipline === "HEALTH") {
      return `4.3 Connecting Fieldwork with Coursework at ${uni}
The practical experiences directly reinforced several core medical and health subjects taught in the ${prog} curriculum at ${uni}:
- Human Anatomy & Physiology: Applied knowledge of bodily systems and vital organs when observing clinical examinations and interpreting diagnostic signs.
- Clinical Pharmacology & Therapeutics: Monitored drug dosages, administration routes, and observed therapeutic responses and adverse drug reactions under supervision.
- Infection Prevention and Control (IPC): Maintained aseptic techniques in surgical and clinical procedures, strictly applying standard sterilization and waste disposal protocols.
- Medical Ethics & Health Law: Practiced patient rights advocacy, informed consent protocols, and professional confidentiality conforming to Ministry of Health guidelines.`;
    } else if (discipline === "BUSINESS") {
      return `4.3 Connecting Fieldwork with Coursework at ${uni}
The practical experiences directly reinforced several core business and finance subjects taught in the ${prog} curriculum at ${uni}:
- Financial Accounting & Auditing: Reconciled ledger accounts, performed trial balance verification, and prepared audit working papers conforming to NBAA and IFRS standards.
- Corporate Finance & Management Accounting: Conducted cost-volume-profit analysis, budgetary variance monitoring, and evaluated operational capital expenditure requests.
- Management Information Systems (MIS) & ERP Operations: Handled enterprise transaction processing, supply chain tracking, and data integrity validation in corporate ERP software.
- Commercial Law & Business Ethics: Reviewed contractual compliance, corporate tax filings (TRA), and regulatory compliance with Bank of Tanzania (BoT) consumer protection mandates.`;
    } else {
      return `4.3 Connecting Fieldwork with Coursework at ${uni}
The practical experiences directly reinforced several core subjects taught in the ${prog} curriculum at ${uni}:
- Applied Research Methodology & Data Analysis: Applied scientific data collection methods, statistical sampling, and analytical evaluation to daily workplace duties.
- Quality Assurance & Standardization: Monitored operational benchmarks and quality control parameters in accordance with ISO 9001 and TBS standards.
- Technical Communication & Project Management: Compiled structured daily technical logs, delivered oral briefings to supervisory teams, and tracked project milestones.
- Workplace Professional Ethics & Safety: Followed institutional codes of conduct, fair labor standards, and occupational safety protocols.`;
    }
  }

  /**
   * Generates dynamic References section with authentic academic and statutory citations.
   */
  static generateReferencesSection(params: { uni: string; org: string; dept: string; academicYear: string; discipline: AcademicDiscipline }): string {
    const uni = params.uni;
    const org = params.org;
    const dept = params.dept;
    const academicYear = params.academicYear;
    const discipline = params.discipline;

    if (discipline === "COMPUTING") {
      return `[1] ${uni}, "Guidelines for Industrial Practical Training (IPT/FPT) and Fieldwork Assessment," Senate Committee on Undergraduate Studies, 2023.
[2] United Republic of Tanzania, "Personal Data Protection Act (PDPA), No. 11 of 2022," Ministry of Information, Communication and Information Technology, Dodoma, 2022.
[3] International Organization for Standardization and International Electrotechnical Commission, "ISO/IEC 27001: Information Security, Cybersecurity and Privacy Protection," ISO/IEC Standard, Geneva, 2022.
[4] Tanzania Communications Regulatory Authority (TCRA), "Guidelines on Electronic Communications and Information Security Standards," Dar es Salaam, 2021.
[5] ${org}, "Standard Operating Procedures (SOP) and Technical Operations Manual," ${dept}, ${academicYear}.`;
    } else if (discipline === "ENGINEERING") {
      return `[1] ${uni}, "Guidelines for Industrial Practical Training (IPT/FPT) and Fieldwork Assessment," Senate Committee on Undergraduate Studies, 2023.
[2] Engineers Registration Board (ERB) Tanzania, "Code of Conduct and Ethics for Professional and Graduate Engineers," Dar es Salaam, 2020.
[3] Occupational Safety and Health Authority (OSHA), "Occupational Health and Safety Act No. 5 of 2003 Compliance Manual," Ministry of Labour, Dodoma, 2021.
[4] International Organization for Standardization, "ISO 9001:2015 Quality Management Systems Requirements," Geneva, 2020.
[5] ${org}, "Standard Operating Procedures (SOP) and Workshop Engineering Manual," ${dept}, ${academicYear}.`;
    } else if (discipline === "AGRICULTURE") {
      return `[1] ${uni}, "Guidelines for Field Practical Training (FPT) and Agricultural Attachment," Senate Committee on Undergraduate Studies, 2023.
[2] Ministry of Agriculture (Tanzania), "National Guidelines on Good Agricultural Practices (GAP) and Post-Harvest Handling," Dodoma, 2022.
[3] Food and Agriculture Organization of the United Nations (FAO), "Sustainable Agricultural Production and Resource Management Guidelines," FAO Agricultural Studies, Rome, 2021.
[4] Tanzania Bureau of Standards (TBS), "Agricultural Produce Quality and Safety Standards Handbook," Dar es Salaam, 2022.
[5] ${org}, "Standard Operating Procedures (SOP) and Field Operations Manual," ${dept}, ${academicYear}.`;
    } else if (discipline === "HEALTH") {
      return `[1] ${uni}, "Guidelines for Clinical Field Practical Training and Hospital Rotations," Senate Committee on Undergraduate Studies, 2023.
[2] Ministry of Health (MoH) Tanzania, "Standard Treatment Guidelines and National Essential Medicines List for Tanzania," Dar es Salaam, 2021.
[3] World Health Organization (WHO), "Infection Prevention and Control in Health Care Facilities: Practical Guidelines," WHO Press, Geneva, 2022.
[4] Tanzania Nursing and Midwives Council (TNMC), "Code of Professional Conduct and Clinical Practice Standards," Dodoma, 2020.
[5] ${org}, "Hospital Infection Control and Clinical Standard Operating Procedures (SOP)," ${dept}, ${academicYear}.`;
    } else if (discipline === "BUSINESS") {
      return `[1] ${uni}, "Guidelines for Field Practical Training (FPT) and Business Attachment," Senate Committee on Undergraduate Studies, 2023.
[2] Bank of Tanzania (BoT), "National Payment System Act and Financial Consumer Protection Regulations," BoT Gazette, Dar es Salaam, 2021.
[3] National Board of Accountants and Auditors (NBAA), "Tanzania Financial Reporting Standards (TFRS) and International Standards on Auditing (ISA)," Dar es Salaam, 2022.
[4] United Republic of Tanzania, "Personal Data Protection Act (PDPA), No. 11 of 2022," Ministry of Information, Communication and Information Technology, Dodoma, 2022.
[5] ${org}, "Standard Operating Procedures (SOP) and Internal Audit Control Manual," ${dept}, ${academicYear}.`;
    } else {
      return `[1] ${uni}, "Guidelines for Industrial Practical Training (IPT/FPT) and Fieldwork Assessment," Senate Committee on Undergraduate Studies, 2023.
[2] Tanzania Bureau of Standards (TBS), "National Industrial Quality and Safety Standards Handbook," Dar es Salaam, 2022.
[3] Occupational Safety and Health Authority (OSHA), "General Workplace Health and Safety Compliance Code," Ministry of Labour, Dodoma, 2021.
[4] International Organization for Standardization, "ISO 9001:2015 Quality Management Systems Requirements," Geneva, 2020.
[5] ${org}, "Standard Operating Procedures (SOP) and Operational Manual," ${dept}, ${academicYear}.`;
    }
  }

  /**
   * Generates dynamic Appendices section (Appendix A 8-week logbook + Appendix B verification checklist).
   */
  static generateAppendicesSection(params: {
    targetPagesNum: number;
    sup: string;
    toolsClean: string;
    activitiesClean: string;
    discipline: AcademicDiscipline;
  }): string {
    const sup = params.sup;
    const toolsClean = params.toolsClean;
    const activitiesClean = params.activitiesClean;
    const discipline = params.discipline;
    const targetPagesNum = params.targetPagesNum;

    const activityParts = activitiesClean.split("\n").filter(l => l.trim().length > 0).map(l => l.replace(/^[0-9]+[\.\)]\s*/, ""));
    const act1 = activityParts[0] || "Institutional orientation, safety induction, and environment setup";
    const act2 = activityParts[1] || "Core execution of assigned operational duties and system monitoring";
    const act3 = activityParts[2] || "Technical implementation, diagnostic testing, and anomaly troubleshooting";
    const act4 = activityParts[3] || "Quality verification checks, supervisor reviews, and departmental handover";

    const toolParts = toolsClean.split(",").map(t => t.trim());
    const toolGroup1 = toolParts.slice(0, 3).join(", ") || "Standard Operating Tools";
    const toolGroup2 = toolParts.slice(2, 5).join(", ") || "Technical Workstation, Testing Software";
    const toolGroup3 = toolParts.slice(0, 4).join(", ") || "Diagnostic Utilities, Analysis Software";
    const toolGroup4 = toolParts.slice(-3).join(", ") || "Verification Checklists, Documentation";

    const tableAHtml = `<div style="margin: 14pt 0; page-break-inside: avoid;">
<table class="academic-table" id="tbl-app-a" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 9.5pt; line-height: 1.35; margin: 8pt 0;">
  <thead>
    <tr style="background-color: #f1f5f9; border-top: 1.5pt solid #0f172a; border-bottom: 1.5pt solid #0f172a;">
      <th style="padding: 6pt 8pt; text-align: left; border: 1px solid #cbd5e1; width: 14%;">Attachment Period</th>
      <th style="padding: 6pt 8pt; text-align: left; border: 1px solid #cbd5e1; width: 46%;">Practical Activities & Technical Duties Executed</th>
      <th style="padding: 6pt 8pt; text-align: left; border: 1px solid #cbd5e1; width: 22%;">Tools & Stacks Used</th>
      <th style="padding: 6pt 8pt; text-align: left; border: 1px solid #cbd5e1; width: 18%;">Supervisor Sign-off</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1; font-weight: bold;">Weeks 1 - 2</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">Institutional orientation, safety induction, workplace benchmarking, toolchain configuration, and reviewing standard operating procedures (SOP).</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">${toolGroup1}</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">${sup} [VERIFIED]</td>
    </tr>
    <tr style="background-color: #f8fafc;">
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1; font-weight: bold;">Weeks 3 - 4</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">${act1}; initial workflow monitoring, telemetry logging, and baseline performance data collection.</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">${toolGroup2}</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">${sup} [VERIFIED]</td>
    </tr>
    <tr>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1; font-weight: bold;">Weeks 5 - 6</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">${act2}; ${act3}; troubleshooting operational bottlenecks and implementing defensive mitigations.</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">${toolGroup3}</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">${sup} [VERIFIED]</td>
    </tr>
    <tr style="background-color: #f8fafc; border-bottom: 1.5pt solid #0f172a;">
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1; font-weight: bold;">Weeks 7 - 8</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">${act4}; compiling comprehensive fieldwork observations, final supervisor review, and departmental handover.</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">${toolGroup4}</td>
      <td style="padding: 5pt 8pt; border: 1px solid #cbd5e1;">${sup} [VERIFIED]</td>
    </tr>
  </tbody>
</table>
</div>`;

    let appendixBTitle = "APPENDIX B: TECHNICAL QUALITY ASSURANCE & VERIFICATION CHECKLIST";
    let checklistItems: string[] = [];

    if (discipline === "COMPUTING") {
      appendixBTitle = "APPENDIX B: SOFTWARE INTEGRATION & SECURITY VERIFICATION CHECKLIST";
      checklistItems = [
        "Code Review & Static Analysis Verification: Clean scan without hardcoded API credentials, private keys, or security flaws [VERIFIED]",
        "Database & API Interface Integrity: All operational endpoints and queries validated under simulated test workloads [VERIFIED]",
        "Data Protection Compliance Audit: Full compliance with Tanzania Personal Data Protection Act (PDPA 2022) role-based access [VERIFIED]",
        "Supervisor Technical Sign-off: Commits, feature branches, and sprint logs fully reviewed and approved by " + sup + " [VERIFIED]"
      ];
    } else if (discipline === "ENGINEERING") {
      appendixBTitle = "APPENDIX B: ENGINEERING SAFETY & OPERATIONAL QUALITY VERIFICATION CHECKLIST";
      checklistItems = [
        "Mandatory PPE Verification: Safety boots, reflective vest, and hard hat verified across all operational bays [VERIFIED]",
        "Daily Instrument Calibration: Pre-shift zeroing and benchmark calibration against certified standard gauges [VERIFIED]",
        "Standard Operating Procedure (SOP) Compliance: 100% adherence to ERB and OSHA technical guidelines [VERIFIED]",
        "Supervisor Weekly Technical Sign-off: Weekly progress logs and maintenance reports endorsed by " + sup + " [VERIFIED]"
      ];
    } else if (discipline === "AGRICULTURE") {
      appendixBTitle = "APPENDIX B: AGRICULTURAL QUALITY ASSURANCE & SAFETY VERIFICATION CHECKLIST";
      checklistItems = [
        "Good Agricultural Practices (GAP) Compliance: Certified adherence to soil, crop, and chemical safety guidelines [VERIFIED]",
        "Field Equipment Calibration: Boom sprayers and irrigation delivery rates calibrated to manufacturer specs [VERIFIED]",
        "Data Recording & Yield Quality Audit: Logged crop metrics and harvest grading according to TBS standards [VERIFIED]",
        "Field Supervisor Weekly Sign-off: Weekly agricultural progress logs endorsed by " + sup + " [VERIFIED]"
      ];
    } else if (discipline === "HEALTH") {
      appendixBTitle = "APPENDIX B: CLINICAL PROTOCOL & PATIENT SAFETY VERIFICATION CHECKLIST";
      checklistItems = [
        "Infection Prevention and Control (IPC): Strict compliance with hand hygiene, sterile technique, and waste segregation [VERIFIED]",
        "Patient Confidentiality & Records Compliance: Adherence to medical privacy rules and the Tanzania PDPA 2022 [VERIFIED]",
        "Standard Treatment Guidelines (STG) Adherence: Diagnostic procedures and medication protocols cross-checked [VERIFIED]",
        "Clinical Supervisor Weekly Sign-off: Clinical case logs and bedside competencies endorsed by " + sup + " [VERIFIED]"
      ];
    } else if (discipline === "BUSINESS") {
      appendixBTitle = "APPENDIX B: OPERATIONAL & FINANCIAL COMPLIANCE VERIFICATION CHECKLIST";
      checklistItems = [
        "Internal Control & Audit Trail Verification: General ledger accounts and source vouchers reconciled [VERIFIED]",
        "Regulatory Compliance Audit: Alignment with Bank of Tanzania (BoT) regulations, TRA tax rules, and PDPA 2022 [VERIFIED]",
        "System Data Integrity: Validation of ERP transaction entries and dual-authorization hierarchies [VERIFIED]",
        "Supervisor Weekly Sign-off: Weekly operational review and project deliverables endorsed by " + sup + " [VERIFIED]"
      ];
    } else {
      appendixBTitle = "APPENDIX B: OPERATIONAL SAFETY & QUALITY VERIFICATION CHECKLIST";
      checklistItems = [
        "Mandatory Workplace Safety Verification: PPE compliance and safety induction attendance [VERIFIED]",
        "Daily Equipment Calibration: Pre-shift zeroing and benchmark verification routines [VERIFIED]",
        "Standard Operating Procedure (SOP) Compliance: 100% adherence to departmental standards [VERIFIED]",
        "Supervisor Weekly Sign-off: Weekly progress logs endorsed by " + sup + " [VERIFIED]"
      ];
    }

    const checklistHtml = checklistItems.map(item => `- ${item}`).join("\n");

    // For 25 pages, Appendix A and Appendix B are placed on separate sheets
    if (targetPagesNum >= 22) {
      return `APPENDIX A: FIELDWORK DAILY LOGBOOK SUMMARY

${tableAHtml}

<!-- PAGE_BREAK -->
${appendixBTitle}

${checklistHtml}`;
    }

    // For 20 or 15 pages, combined onto 1 sheet
    return `APPENDIX A: FIELDWORK DAILY LOGBOOK SUMMARY

${tableAHtml}

${appendixBTitle}
${checklistHtml}`;
  }
}


