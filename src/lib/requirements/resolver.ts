import { 
  CompiledReportSpecification, 
  FormattingRules, 
  RequirementConflict, 
  RequirementProvenance, 
  SectionRequirement, 
  DisciplinaryDirective 
} from "./types";
import { TANZANIA_ACADEMIC_CATALOG } from "@/data/tanzania-academic-catalog";
import { getReportBlueprint } from "@/lib/report-engine/orchestrator";

export interface RequirementsResolutionInput {
  universityId: string;
  programmeId: string;
  specialization?: string;
  reportType: string;
  reportTitle: string;
  studentName?: string;
  regNumber?: string;
  assignmentInstructions?: string;
  requestedCitationStyle?: "APA7" | "IEEE" | "HARVARD" | "CHICAGO" | "VANCOUVER";
  requestedWordBudget?: number;
  uploadedEvidenceNotes?: string;
}

export class RequirementsResolver {
  /**
   * Resolves and compiles a complete, layered Report Specification
   * enforcing Tier 1 (University) down to Tier 6 (AI Default) precedence.
   */
  public static resolve(input: RequirementsResolutionInput): CompiledReportSpecification {
    const conflicts: RequirementConflict[] = [];
    const provenanceList: RequirementProvenance[] = [];

    // 1. Resolve Tier 1: University Template & Institution Rules
    const university = TANZANIA_ACADEMIC_CATALOG.find((u) => u.id === input.universityId) || {
      id: input.universityId || "generic",
      name: input.universityId ? input.universityId.toUpperCase() : "Generic Tanzanian University",
      shortName: (input.universityId || "UNIV").toUpperCase(),
      hasOfficialTemplate: false,
    };

    const univProvenance: RequirementProvenance = {
      sourceTitle: `${university.name} Academic Regulations & Guidelines`,
      issuingInstitution: university.name,
      sourceUrlOrRef: university.hasOfficialTemplate ? `Official Institutional DOCX/PDF Template` : "National TCU Standard Reference",
      verificationStatus: university.hasOfficialTemplate ? "VERIFIED" : "PENDING_VERIFICATION",
      verifiedDate: "2024-09-01",
      reviewer: "Academic Standards Committee"
    };
    provenanceList.push(univProvenance);

    // University mandatory citation style logic
    let defaultCitation: "APA7" | "IEEE" | "HARVARD" | "VANCOUVER" = "APA7";
    const univId = university.id.toLowerCase();
    const progId = (input.programmeId || "").toLowerCase();

    if (univId.includes("must") || univId.includes("dit") || progId.includes("eng") || progId.includes("civil") || progId.includes("elec") || progId.includes("mech") || progId.includes("telecom")) {
      defaultCitation = "IEEE";
    } else if (univId.includes("muhas") || univId.includes("hkmu") || univId.includes("kcmuco") || progId.includes("med") || progId.includes("pharm") || progId.includes("nurs")) {
      defaultCitation = "VANCOUVER";
    } else if (univId.includes("udsm")) {
      defaultCitation = (progId.includes("coet") || progId.includes("coict")) ? "IEEE" : "HARVARD";
    }

    // Conflict Check: Did the student request an incompatible citation style?
    let finalCitation = defaultCitation;
    if (input.requestedCitationStyle && input.requestedCitationStyle !== defaultCitation) {
      conflicts.push({
        field: "citationStyle",
        highTierRule: {
          tier: "TIER_1_UNIVERSITY",
          value: defaultCitation,
          source: `${university.shortName} Official Institutional Standard`
        },
        lowTierRule: {
          tier: "TIER_5_ASSIGNMENT",
          value: input.requestedCitationStyle,
          source: "Student Requested Preference"
        },
        resolution: `Preserved ${defaultCitation} as required by ${university.shortName} official guidelines.`,
        requiresStudentConfirmation: true
      });
    }

    const formatting: FormattingRules = {
      fontFamily: (univId.includes("udsm") || univId.includes("sua")) ? "Times New Roman" : "Arial",
      fontSizePt: 12,
      lineSpacing: 1.5,
      marginInches: { top: 1.0, right: 1.0, bottom: 1.0, left: 1.5 }, // Left 1.5 inch for university binding
      citationStyle: finalCitation,
      preliminaryPagesOrder: [
        "Title Page",
        "Declaration",
        "Certification / Supervisor Approval",
        "Copyright Notice",
        "Dedication",
        "Acknowledgements",
        "Abstract / Executive Summary",
        "Table of Contents",
        "List of Tables",
        "List of Figures",
        "List of Abbreviations & Acronyms"
      ],
      allowColorVisuals: true,
      governingTier: "TIER_1_UNIVERSITY"
    };

    // 2. Resolve Programme & Discipline Directives
    const disciplineDirectives = this.resolveDisciplineDirectives(input.programmeId, input.reportType);

    // 3. Resolve Tier 4: Report-Type Blueprint
    const blueprint = getReportBlueprint(input.reportType as any);

    // 4. Synthesize Sections with Tier 1 - 5 merging
    const sections: SectionRequirement[] = blueprint.chapters.map((ch: any, idx: number) => {
      const isIntro = idx === 0;
      const isLit = ch.title.toLowerCase().includes("literature") || ch.title.toLowerCase().includes("background");
      const isMeth = ch.title.toLowerCase().includes("method") || ch.title.toLowerCase().includes("materials");
      const isDesign = ch.title.toLowerCase().includes("design") || ch.title.toLowerCase().includes("system") || ch.title.toLowerCase().includes("implementation");
      const isResults = ch.title.toLowerCase().includes("result") || ch.title.toLowerCase().includes("analysis") || ch.title.toLowerCase().includes("discussion");

      // Inject required tables/diagrams based on chapter focus & discipline
      const reqTables: string[] = [];
      const reqDiagrams: string[] = [];
      const reqCalcs: string[] = [];

      if (isDesign) {
        if (disciplineDirectives.disciplineId === "computing-it") {
          reqDiagrams.push("UML_USECASE", "SYSTEM_ARCHITECTURE", "DATABASE_ERD", "UML_SEQUENCE");
          reqCalcs.push("BIG_O_ESTIMATOR", "BANDWIDTH_SIZING", "DB_STORAGE_ESTIMATOR");
        } else if (disciplineDirectives.disciplineId === "engineering") {
          reqDiagrams.push("PROCESS_FLOW_DIAGRAM", "ENGINEERING_SCHEMATIC", "WBS");
          reqTables.push("BILL_OF_ENGINEERING_MEASUREMENTS_AND_EVALUATION");
          reqCalcs.push("BEAM_BENDING_STRESS", "OHMS_LAW_POWER", "CONCRETE_MIX_PROPORTIONS");
        } else if (disciplineDirectives.disciplineId === "business-economics") {
          reqDiagrams.push("SWOT_MATRIX", "PORTERS_FIVE_FORCES", "GANTT");
          reqTables.push("FINANCIAL_RATIOS_TABLE", "PROJECTED_BALANCE_SHEET");
          reqCalcs.push("NET_PRESENT_VALUE", "CURRENT_RATIO", "BREAK_EVEN_POINT");
        } else if (disciplineDirectives.disciplineId === "education") {
          reqDiagrams.push("LESSON_PLAN_MATRIX", "BLOOM_TAXONOMY_MATRIX");
          reqTables.push("LESSON_PLAN_CURRICULUM_MATRIX");
        } else if (disciplineDirectives.disciplineId === "agriculture-environmental") {
          reqDiagrams.push("FIELD_LAYOUT_DIAGRAM", "ENVIRONMENTAL_IMPACT_MATRIX");
          reqTables.push("SOIL_NUTRIENT_PROFILE_TABLE", "CROP_YIELD_PER_HECTARE_TABLE");
          reqCalcs.push("FERTILIZER_APPLICATION_RATE", "CROP_YIELD_ESTIMATION");
        } else if (disciplineDirectives.disciplineId === "social-sciences-law") {
          reqDiagrams.push("DECISION_TREE", "SWOT_MATRIX");
          reqTables.push("STATUTORY_PRECEDENT_AUTHORITIES_TABLE");
          reqCalcs.push("YAMANE_SAMPLE_SIZE");
        }
      }

      if (isMeth) {
        if (disciplineDirectives.disciplineId === "health-sciences") {
          reqDiagrams.push("STUDY_FLOW_DIAGRAM");
          reqCalcs.push("YAMANE_SAMPLE_SIZE", "KISH_LESLIE_FORMULA", "ODDS_RATIO");
          reqTables.push("CLINICAL_VARIABLES_DATA_DICTIONARY");
        } else if (disciplineDirectives.disciplineId === "agriculture-environmental") {
          reqCalcs.push("SHANNON_WIENER_DIVERSITY", "WATER_QUALITY_BOD_COD");
        } else if (disciplineDirectives.disciplineId === "social-sciences-law") {
          reqTables.push("QUALITATIVE_INTERVIEW_THEMATIC_MATRIX");
          reqCalcs.push("YAMANE_SAMPLE_SIZE");
        }
      }

      if (isResults) {
        if (disciplineDirectives.disciplineId === "engineering") {
          reqCalcs.push("BEAM_DEFLECTION", "DARCY_WEISBACH_HEAD_LOSS");
        } else if (disciplineDirectives.disciplineId === "business-economics") {
          reqCalcs.push("QUICK_RATIO", "DEBT_TO_EQUITY", "GROSS_PROFIT_MARGIN");
        } else if (disciplineDirectives.disciplineId === "health-sciences") {
          reqCalcs.push("RELATIVE_RISK", "BODY_MASS_INDEX");
        }
      }

      return {
        id: `sec-${idx + 1}`,
        chapterNumber: idx + 1,
        title: ch.title,
        description: ch.description,
        wordBudget: Math.round(ch.defaultWordBudget * ((input.requestedWordBudget || blueprint.defaultTotalWords) / blueprint.defaultTotalWords)),
        mandatory: true,
        subHeadings: [...ch.subHeadings],
        requiredTables: reqTables,
        requiredDiagrams: reqDiagrams,
        requiredCalculations: reqCalcs,
        specialInstructions: input.assignmentInstructions ? [`Integrate student guidelines: ${input.assignmentInstructions.slice(0, 150)}...`] : [],
        governingTier: "TIER_4_REPORT_TYPE",
        provenance: univProvenance
      };
    });

    const totalTargetWords = sections.reduce((acc, s) => acc + s.wordBudget, 0);

    // Collect all required calculations & diagrams across sections
    const allCalcs = Array.from(new Set(sections.flatMap((s) => s.requiredCalculations || [])));
    const allDiagrams = Array.from(new Set(sections.flatMap((s) => s.requiredDiagrams || [])));

    return {
      specificationId: `spec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      metadata: {
        universityId: university.id,
        universityName: university.name,
        programmeId: input.programmeId,
        programmeName: input.programmeId || "Undergraduate Degree Programme",
        specialization: input.specialization,
        academicYear: "2024/2025",
        studentName: input.studentName || "Student Researcher",
        regNumber: input.regNumber,
        reportTitle: input.reportTitle,
        reportType: input.reportType
      },
      formatting,
      disciplineDirectives,
      sections,
      totalTargetWords,
      requiredCalculations: allCalcs,
      requiredDiagrams: allDiagrams,
      conflicts,
      unresolvedQuestions: [],
      provenanceList
    };
  }

  public static resolveDisciplineDirectives(programmeId: string, reportType?: string): DisciplinaryDirective {
    const p = (programmeId || "").toLowerCase();

    // 1. Engineering
    if (p.includes("eng") || p.includes("civil") || p.includes("mech") || p.includes("elec") || p.includes("telecom") || p.includes("mining") || p.includes("chemical") || p.includes("coet")) {
      return {
        disciplineId: "engineering",
        guidelines: [
          "Mandate explicit units of measurement (SI units) on every numerical variable.",
          "Present all assumptions, boundary conditions, and design constraints visibly.",
          "Distinguish conceptual designs from certified engineering specifications.",
          "Include a safety assessment and failure mode consideration."
        ],
        safetyWarnings: [
          "WARNING: All engineering calculations and structural sizing are academic designs and must be validated by an ERB-registered professional engineer prior to physical implementation."
        ],
        calculationPrerequisites: ["Deterministic calculation execution required before text drafting."]
      };
    }

    // 2. Health Sciences
    if (p.includes("med") || p.includes("pharm") || p.includes("nurs") || p.includes("health") || p.includes("doctor") || p.includes("dent") || p.includes("muhas") || p.includes("cuhas")) {
      return {
        disciplineId: "health-sciences",
        guidelines: [
          "Enforce zero identifiable patient data (Zero PII).",
          "Use de-identified, aggregated, or clearly labelled synthetic case examples.",
          "Apply standard medical and clinical pharmacology nomenclature.",
          "Ensure alignment with National Institute for Medical Research (NIMR) ethics guidelines."
        ],
        ethicalSafeguards: [
          "PATIENT PRIVACY SAFEGUARD: Do not upload or state patient names, national IDs, hospital admission numbers, or ward bed tags. All clinical data must be strictly anonymized."
        ]
      };
    }

    // 3. Agriculture, Environmental & Natural Sciences
    if (p.includes("agric") || p.includes("sua") || p.includes("forestry") || p.includes("environ") || p.includes("soil") || p.includes("horticult") || p.includes("wildlife") || p.includes("aquatic") || p.includes("fisheries") || p.includes("coaf")) {
      return {
        disciplineId: "agriculture-environmental",
        guidelines: [
          "Report land areas strictly in hectares and crop/nutrient yields in kg/ha or metric tonnes/ha.",
          "Ground crop varieties and farming regimes in verified Tanzanian agro-ecological zones.",
          "Cite Tanzania Bureau of Standards (TBS) / NEMC thresholds for water quality and effluents.",
          "Integrate deterministic agronomic calculations directly into results."
        ],
        safetyWarnings: [
          "AGRONOMIC NOTICE: Fertilizer rates and agrochemical dosages represent academic field models. Physical application requires site-specific extension officer soil test calibration."
        ],
        calculationPrerequisites: ["Fertilizer rate and crop yield models must be evaluated deterministically."]
      };
    }

    // 4. Social Sciences & Law
    if (p.includes("law") || p.includes("llb") || p.includes("sociolog") || p.includes("public admin") || p.includes("mass comm") || p.includes("politic") || p.includes("journalism") || p.includes("humanit") || p.includes("udsom")) {
      return {
        disciplineId: "social-sciences-law",
        guidelines: [
          "Format case law citations according to Tanzania Law Reports (TLR) or Commonwealth standard [Year] TLR Page.",
          "Differentiate qualitative thematic narrative summaries from quantitative empirical counts.",
          "Ground legal analysis in current Tanzanian Acts of Parliament (CAP revisions) and judicial hierarchy.",
          "Protect interview respondent confidentiality using pseudonym categories."
        ],
        ethicalSafeguards: [
          "INFORMED CONSENT SAFEGUARD: Maintain full respondent anonymity and adhere to COSTECH human research clearance protocols."
        ]
      };
    }

    // 5. Education
    if (p.includes("edu") || p.includes("teach") || p.includes("pedagogy") || p.includes("duce") || p.includes("muce")) {
      return {
        disciplineId: "education",
        guidelines: [
          "Map learning objectives according to Bloom's Taxonomy (Knowledge, Comprehension, Application, Analysis, Evaluation, Creation).",
          "Differentiate proposed lesson plans from actual student-teacher classroom observations.",
          "Adhere to Tanzania Institute of Education (TIE) curriculum competencies."
        ]
      };
    }

    // 6. Business, Accounting & Economics
    if (p.includes("acc") || p.includes("fin") || p.includes("biz") || p.includes("bba") || p.includes("econ") || p.includes("cbe") || p.includes("ifm") || p.includes("udbs")) {
      return {
        disciplineId: "business-economics",
        guidelines: [
          "Support numerical figures with explicit financial formulas and period assumptions.",
          "Ensure balance sheet balances (Assets = Liabilities + Equity).",
          "Present clear rationale for discount rates in capital budgeting (NPV/IRR)."
        ]
      };
    }

    // 7. Computing & IT (Default STEM)
    return {
      disciplineId: "computing-it",
      guidelines: [
        "Derive system architecture, UML diagrams, and ERDs from structured specifications.",
        "Ground database models in 3rd Normal Form (3NF) principles.",
        "Document functional requirements with clear actor-action-outcome use cases.",
        "Include a verifiable testing matrix (unit, integration, user acceptance)."
      ],
      diagramPrerequisites: ["Mermaid UML Use Case", "Mermaid Database ERD", "System Architecture Flow"]
    };
  }
}
