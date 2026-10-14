import { DisciplineProfile } from "./types";

export class DisciplineRegistry {
  private static profiles: Map<string, DisciplineProfile> = new Map();

  static {
    // 1. Computing & Information Technology Profile
    this.register({
      id: "computing-it",
      name: "Computing and Information Technology",
      slug: "computing-it",
      category: "STEM",
      status: "VERIFIED_PRODUCTION",
      statusNotes: "Full support for UML diagrams, database schemas, system architecture, and software testing matrices.",
      supportedReportTypes: ["FYP", "COURSEWORK", "LAB_REPORT", "FIELDWORK"],
      requiredInputs: [
        {
          id: "systemRequirements",
          label: "Core Functional Requirements",
          type: "textarea",
          placeholder: "e.g., 1. User Authentication, 2. File Upload with virus scan, 3. Real-time notifications...",
          description: "List key functional requirements to generate UML Use Cases and system architecture.",
          required: true
        },
        {
          id: "techStack",
          label: "Primary Technology Stack",
          type: "text",
          placeholder: "e.g., Next.js 16, React 19, PostgreSQL, Prisma, Python FastAPI",
          description: "Used to ground system design and API specifications.",
          required: true
        },
        {
          id: "databaseEntities",
          label: "Key Database Entities",
          type: "text",
          placeholder: "e.g., Users, Projects, Documents, Subscriptions, AuditLogs",
          description: "Entities to include in the Entity-Relationship Diagram (ERD).",
          required: false
        }
      ],
      calculationModules: [
        {
          id: "computing-metrics",
          name: "Computational & Algorithmic Metrics",
          description: "Big-O algorithmic complexity, throughput, and database index storage sizing.",
          supportedFormulas: ["BIG_O_ESTIMATOR", "BANDWIDTH_SIZING", "DB_STORAGE_ESTIMATOR"],
          unitStandard: "METRIC"
        }
      ],
      diagramTypes: [
        { type: "UML_USECASE", label: "UML Use Case Diagram", syntax: "MERMAID", description: "Actor-system boundary interactions" },
        { type: "UML_SEQUENCE", label: "UML Sequence Diagram", syntax: "MERMAID", description: "Synchronous API and database call lifecycles" },
        { type: "UML_CLASS", label: "UML Class Diagram", syntax: "MERMAID", description: "Object-oriented class relationships and members" },
        { type: "DATABASE_ERD", label: "Entity-Relationship Diagram", syntax: "MERMAID", description: "3NF relational database schema" },
        { type: "SYSTEM_ARCHITECTURE", label: "System Architecture Flow", syntax: "MERMAID", description: "Client-Server-Database tiered components" }
      ],
      validationRules: [
        { code: "COMP_REQ_TRACE", name: "Requirements Traceability", severity: "ERROR", description: "All design components must map to functional requirements." },
        { code: "COMP_TEST_MATRIX", name: "Test Matrix Verification", severity: "WARNING", description: "Report must include explicit test cases with expected vs actual results." }
      ],
      aiDirectives: [
        "Generate concrete, syntactically valid Mermaid diagrams from structured specifications.",
        "Ground database models in 3rd Normal Form (3NF) principles.",
        "Never state that source code was executed in production unless student upload confirms it."
      ],
      provenance: {
        sourceStandard: "TCU / UDSM CoICT & DIT Computing Benchmark 2024",
        verifiedBy: "Lead Systems Architect",
        lastAuditDate: "2024-10-10"
      }
    });

    // 2. Engineering Profile
    this.register({
      id: "engineering",
      name: "Engineering & Applied Technology",
      slug: "engineering",
      category: "STEM",
      status: "VERIFIED_PRODUCTION",
      statusNotes: "Verified for Civil, Electrical, Mechanical, Chemical, Mining, and Telecom engineering with deterministic SI formulas and BEME tables.",
      supportedReportTypes: ["FYP", "LAB_REPORT", "FIELDWORK", "COURSEWORK"],
      requiredInputs: [
        {
          id: "designConstraints",
          label: "Design Constraints & Boundary Conditions",
          type: "textarea",
          placeholder: "e.g., Max load 50kN, operating temp 25-45C, soil bearing capacity 150 kPa...",
          description: "Mandatory physical constraints used in calculation validation.",
          required: true
        },
        {
          id: "materialSpecs",
          label: "Materials & Equipment Specifications",
          type: "text",
          placeholder: "e.g., Concrete Grade C25/30, High-Yield Steel fy=460 N/mm2, Arduino Mega 2560...",
          description: "Materials to populate the BEME / equipment tables.",
          required: true
        }
      ],
      calculationModules: [
        {
          id: "engineering-si",
          name: "Deterministic SI Engineering Calculations",
          description: "Structural bending, beam deflection, Ohm's law, 3-phase power, concrete mix ratio, fluid flow, head loss.",
          supportedFormulas: [
            "BEAM_BENDING_STRESS", 
            "BEAM_DEFLECTION", 
            "OHMS_LAW_POWER", 
            "THREE_PHASE_POWER", 
            "CONCRETE_MIX_PROPORTIONS", 
            "REYNOLDS_NUMBER", 
            "DARCY_WEISBACH_HEAD_LOSS"
          ],
          unitStandard: "SI"
        }
      ],
      diagramTypes: [
        { type: "PROCESS_FLOW_DIAGRAM", label: "Process Flow Diagram", syntax: "MERMAID", description: "Engineering unit operations & material balance" },
        { type: "ENGINEERING_SCHEMATIC", label: "Schematic / Block Diagram", syntax: "MERMAID", description: "Subsystem interfaces and sensor routing" },
        { type: "DECISION_TREE", label: "Engineering Fault / Decision Tree", syntax: "MERMAID", description: "Failure mode and effect branch logic" },
        { type: "WBS", label: "Work Breakdown Structure", syntax: "MERMAID", description: "Hierarchical project engineering decomposition" },
        { type: "GANTT", label: "Engineering Project Gantt Chart", syntax: "MERMAID", description: "Construction and fabrication schedule with milestones" }
      ],
      validationRules: [
        { code: "ENG_UNITS_CHECK", name: "SI Units Enforcement", severity: "ERROR", description: "All engineering values must specify valid SI units (kN, MPa, mm, kW, etc.)." },
        { code: "ENG_SAFETY_FACTOR", name: "Factor of Safety Declaration", severity: "WARNING", description: "Structural or electrical designs must explicitly state Factor of Safety (FoS)." }
      ],
      aiDirectives: [
        "Include visible formulas, variable definitions, and declared assumptions on all numerical work.",
        "Distinguish conceptual academic sizing from ERB-certified designs.",
        "Emphasize Tanzanian environmental, power grid, or geological operating conditions where relevant."
      ],
      safetyDisclaimers: [
        "PROFESSIONAL REVIEW NOTICE: Conceptual academic design; requires certified Professional Engineer (PE/ERB) review before physical fabrication or construction."
      ],
      provenance: {
        sourceStandard: "UDSM CoET / MUST Engineering Project Guidelines 2024",
        verifiedBy: "Senior Engineering Reviewer",
        lastAuditDate: "2024-10-12"
      }
    });

    // 3. Health Sciences Profile
    this.register({
      id: "health-sciences",
      name: "Health Sciences & Medicine",
      slug: "health-sciences",
      category: "HEALTH",
      status: "VERIFIED_PRODUCTION",
      statusNotes: "Verified for clinical placement logs, epidemiology study design, sample size calculations, and biostatistics. Zero PII strictly enforced.",
      supportedReportTypes: ["CLINICAL_LOG", "FYP", "LAB_REPORT", "FIELDWORK"],
      requiredInputs: [
        {
          id: "clinicalSetting",
          label: "Clinical Department / Ward Setting",
          type: "text",
          placeholder: "e.g., Internal Medicine Ward, Pediatric Outpatient, Clinical Pharmacy...",
          description: "Setting of clinical observations or academic research.",
          required: true
        },
        {
          id: "learningObjectives",
          label: "Core Clinical Learning Objectives",
          type: "textarea",
          placeholder: "e.g., 1. Management of diabetic ketoacidosis, 2. Interpretation of full blood count...",
          description: "Key competencies practised under supervision.",
          required: true
        }
      ],
      calculationModules: [
        {
          id: "health-epidemiology",
          name: "Epidemiological & Health Statistical Formulas",
          description: "Yamane and Kish-Leslie sample size estimation, Odds Ratio, Relative Risk, Body Mass Index.",
          supportedFormulas: ["YAMANE_SAMPLE_SIZE", "KISH_LESLIE_FORMULA", "ODDS_RATIO", "RELATIVE_RISK", "BODY_MASS_INDEX"],
          unitStandard: "METRIC"
        }
      ],
      diagramTypes: [
        { type: "STUDY_FLOW_DIAGRAM", label: "Study Cohort Flowchart", syntax: "MERMAID", description: "Enrollment, allocation, follow-up, and analysis flow" },
        { type: "CLINICAL_DATA_DICT", label: "Variable Data Dictionary", syntax: "MATRIX_TABLE", description: "Operational definition of clinical study variables" }
      ],
      validationRules: [
        { code: "HEALTH_ZERO_PII", name: "Zero Patient PII Check", severity: "ERROR", description: "Rejects patient names, national IDs, medical record numbers, or bed numbers." },
        { code: "HEALTH_ETHICS_CHECK", name: "Ethical Clearance Verification", severity: "WARNING", description: "Reports involving human participants must cite NIMR / IRB ethical approval status." }
      ],
      aiDirectives: [
        "Zero PII Policy: Automated sanitizer strips all identifiable patient tokens.",
        "Do not invent patients, clinical outcomes, or therapeutic regimens.",
        "Provide educational and academic structure; never issue clinical medical advice or autonomously approve patient treatment.",
        "Encourage de-identified, synthetic case examples where real patients are concerned."
      ],
      safetyDisclaimers: [
        "CLINICAL ACADEMIC NOTICE: This document is for medical/health education, coursework assessment, and research training. It does not constitute authorized medical advice, clinical guidelines, or approved diagnostic decisions."
      ],
      provenance: {
        sourceStandard: "MUHAS / CUHAS Medical & Health Sciences Curriculum Guidelines 2024",
        verifiedBy: "Health Informatics Reviewer",
        lastAuditDate: "2024-10-11"
      }
    });

    // 4. Business, Accounting & Economics Profile
    this.register({
      id: "business-economics",
      name: "Business, Accounting & Economics",
      slug: "business-economics",
      category: "COMMERCE",
      status: "VERIFIED_PRODUCTION",
      statusNotes: "Verified for financial statement tables, NPV/IRR capital budgeting, break-even analysis, and balance sheet ratio audits.",
      supportedReportTypes: ["FYP", "FIELDWORK", "COURSEWORK"],
      requiredInputs: [
        {
          id: "businessDomain",
          label: "Industry / Sector Context",
          type: "text",
          placeholder: "e.g., Commercial Banking, Agri-business, Mobile Telecommunications...",
          description: "Context for financial and market analysis.",
          required: true
        }
      ],
      calculationModules: [
        {
          id: "finance-accounting",
          name: "Financial & Investment Formulas",
          description: "Liquidity ratios, quick ratio, debt-to-equity, gross profit margin, NPV, break-even units.",
          supportedFormulas: [
            "CURRENT_RATIO", 
            "QUICK_RATIO", 
            "DEBT_TO_EQUITY", 
            "GROSS_PROFIT_MARGIN", 
            "NET_PRESENT_VALUE", 
            "BREAK_EVEN_POINT"
          ],
          unitStandard: "CURRENCY_TZS"
        }
      ],
      diagramTypes: [
        { type: "SWOT_MATRIX", label: "SWOT Analysis Matrix", syntax: "MATRIX_TABLE", description: "Strengths, Weaknesses, Opportunities, Threats" },
        { type: "PORTERS_FIVE_FORCES", label: "Porter's 5 Forces Diagram", syntax: "MERMAID", description: "Industry competitive dynamics" },
        { type: "GANTT", label: "Business Implementation Timeline", syntax: "MERMAID", description: "Rollout phases and operational milestones" }
      ],
      validationRules: [
        { code: "BIZ_BALANCE_SHEET", name: "Balance Sheet Equality", severity: "ERROR", description: "Assets must strictly equal Liabilities plus Equity." },
        { code: "BIZ_CURRENCY_CHECK", name: "Currency Declaration", severity: "INFO", description: "All accounting figures must explicitly declare currency (TZS / USD)." }
      ],
      aiDirectives: [
        "Explicitly display reporting currency (TZS / USD) and accounting periods.",
        "Never fabricate financial audit statements or survey respondent numbers.",
        "Ensure balance sheet balances: Assets = Liabilities + Equity."
      ],
      provenance: {
        sourceStandard: "IFM / CBE / UDSM UDBS Academic Research Standards 2024",
        verifiedBy: "Commerce Curriculum Coordinator",
        lastAuditDate: "2024-09-20"
      }
    });

    // 5. Education & Pedagogy Profile
    this.register({
      id: "education",
      name: "Education & Teaching Practice",
      slug: "education",
      category: "EDUCATION",
      status: "VERIFIED_PRODUCTION",
      statusNotes: "Standard Tanzanian 8-column lesson plan matrix, Bloom's taxonomy objectives, and school observation logs.",
      supportedReportTypes: ["FIELDWORK", "FYP", "COURSEWORK"],
      requiredInputs: [
        {
          id: "teachingSubject",
          label: "Teaching Subject & Form Level",
          type: "text",
          placeholder: "e.g., Mathematics - Form III, Physics - Form IV, Geography - Form II...",
          description: "Target classroom grade and curriculum subject.",
          required: true
        }
      ],
      calculationModules: [],
      diagramTypes: [
        { type: "LESSON_PLAN_MATRIX", label: "8-Column Lesson Plan Layout", syntax: "MATRIX_TABLE", description: "Standard Ministry of Education lesson structure" },
        { type: "BLOOM_TAXONOMY_MATRIX", label: "Bloom's Cognitive Taxonomy Matrix", syntax: "MATRIX_TABLE", description: "Cognitive domain distribution of lesson objectives" }
      ],
      validationRules: [
        { code: "EDU_BLOOM_VERBS", name: "Measurable Behavioral Objectives", severity: "WARNING", description: "Objectives should use measurable action verbs (Identify, Calculate, Analyze)." }
      ],
      aiDirectives: [
        "Differentiate between proposed lesson plans and actual classroom observations.",
        "Follow Tanzania Institute of Education (TIE) competency syllabus.",
        "Map learning objectives across all levels of Bloom's Taxonomy."
      ],
      provenance: {
        sourceStandard: "DUCE / UDOM College of Education Guidelines 2024",
        verifiedBy: "Teacher Education Consultant",
        lastAuditDate: "2024-09-15"
      }
    });

    // 6. Agriculture, Environmental & Natural Sciences Profile
    this.register({
      id: "agriculture-environmental",
      name: "Agriculture, Environmental & Natural Sciences",
      slug: "agriculture-environmental",
      category: "STEM",
      status: "VERIFIED_PRODUCTION",
      statusNotes: "Verified for Agronomy, Forestry, Environmental Engineering, and Natural Resources with deterministic nutrient, yield, biodiversity, and BOD/COD calculators.",
      supportedReportTypes: ["FYP", "FIELDWORK", "LAB_REPORT", "COURSEWORK"],
      requiredInputs: [
        {
          id: "fieldAreaHa",
          label: "Field Cultivated Area (Hectares)",
          type: "number",
          placeholder: "e.g., 2.5",
          description: "Land area for crop yield and nutrient application calculations.",
          required: true
        },
        {
          id: "soilType",
          label: "Soil Physical & Chemical Characteristics",
          type: "text",
          placeholder: "e.g., Sandy-loam, pH 6.2, low organic carbon, well-drained...",
          description: "Soil profile for agronomic recommendations.",
          required: false
        },
        {
          id: "cropVariety",
          label: "Target Crop Variety or Natural Resource",
          type: "text",
          placeholder: "e.g., Maize (UH615 / SC627), Rice (SARO 5 / TXD 306), Miombo Forestry...",
          description: "Species or variety being investigated.",
          required: true
        }
      ],
      calculationModules: [
        {
          id: "agronomy-environmental",
          name: "Agronomic & Environmental Calculations",
          description: "Fertilizer rate estimation, cereal crop yield, Shannon-Wiener biodiversity index, BOD/COD water quality ratio.",
          supportedFormulas: [
            "FERTILIZER_APPLICATION_RATE", 
            "CROP_YIELD_ESTIMATION", 
            "SHANNON_WIENER_DIVERSITY", 
            "WATER_QUALITY_BOD_COD"
          ],
          unitStandard: "METRIC"
        }
      ],
      diagramTypes: [
        { type: "FIELD_LAYOUT_DIAGRAM", label: "Field Experimental Layout Diagram", syntax: "MERMAID", description: "Randomized Complete Block Design (RCBD) quadrant layout" },
        { type: "ENVIRONMENTAL_IMPACT_MATRIX", label: "Environmental Impact Assessment Matrix", syntax: "MATRIX_TABLE", description: "EIA Leopold matrix of environmental mitigation factors" },
        { type: "PROCESS_FLOW_DIAGRAM", label: "Agro-Processing & Soil Treatment Flow", syntax: "MERMAID", description: "Post-harvest or wastewater filtration flow" }
      ],
      validationRules: [
        { code: "AGRI_METRIC_CHECK", name: "Agricultural Metric Units", severity: "ERROR", description: "Yields must be reported in metric tonnes/ha or kg/ha, land in hectares." },
        { code: "ENV_STANDARDS_CHECK", name: "TBS / NEMC Standards Reference", severity: "WARNING", description: "Environmental effluents must cite Tanzania Bureau of Standards (TBS) limits." }
      ],
      aiDirectives: [
        "Ground agricultural assessments in authentic Tanzanian agro-ecological zones (Southern Highlands, Miombo woodland, Coastal plain, etc.).",
        "Weave exact computed fertilizer amounts and crop yield outputs into discussion.",
        "Reference National Environment Management Council (NEMC) guidelines for environmental reports."
      ],
      safetyDisclaimers: [
        "AGRONOMIC & ENVIRONMENTAL ADVISORY: Calculations represent academic field models. Commercial fertilizer application or agrochemical use requires site-specific extension officer soil test recommendations."
      ],
      provenance: {
        sourceStandard: "Sokoine University of Agriculture (SUA) Guidelines 2024",
        verifiedBy: "Senior Agronomy & Environmental Reviewer",
        lastAuditDate: "2024-10-12"
      }
    });

    // 7. Social Sciences & Law Profile
    this.register({
      id: "social-sciences-law",
      name: "Social Sciences & Law",
      slug: "social-sciences-law",
      category: "HUMANITIES",
      status: "VERIFIED_PRODUCTION",
      statusNotes: "Verified for Sociology, Law, Public Administration, and Mass Communication with statutory citations, TLR jurisprudence, and thematic qualitative matrices.",
      supportedReportTypes: ["FYP", "FIELDWORK", "COURSEWORK"],
      requiredInputs: [
        {
          id: "targetPopulation",
          label: "Research Target Population & Sampling Frame",
          type: "text",
          placeholder: "e.g., Smallholder farmers in Morogoro, Court of Appeal registry staff, Secondary school teachers...",
          description: "Target cohort for social science survey or legal empirical analysis.",
          required: true
        },
        {
          id: "statutoryProvisions",
          label: "Key Statutes, Regulations & Case Precedents",
          type: "textarea",
          placeholder: "e.g., The Constitution of Tanzania 1977 Art. 13, Law of Marriage Act CAP 29, Bi Hawa Mohamed v Ally Seif [1983] TLR 32...",
          description: "Statutes or precedents governing the legal analysis.",
          required: false
        }
      ],
      calculationModules: [
        {
          id: "social-sampling",
          name: "Social Science Survey Sampling",
          description: "Finite population sample size formula (Yamane).",
          supportedFormulas: ["YAMANE_SAMPLE_SIZE"],
          unitStandard: "METRIC"
        }
      ],
      diagramTypes: [
        { type: "DECISION_TREE", label: "Legal Jurisdictional Decision Flow", syntax: "MERMAID", description: "Statutory decision logic and procedural appeal paths" },
        { type: "SWOT_MATRIX", label: "Policy Institutional SWOT Matrix", syntax: "MATRIX_TABLE", description: "Governance strengths, weaknesses, and reform opportunities" }
      ],
      validationRules: [
        { code: "LAW_TLR_CITATION", name: "Tanzania Law Reports Citation Standard", severity: "WARNING", description: "Legal cases must follow standard TLR citation format [Year] TLR Page." },
        { code: "SOC_QUAL_DELINEATION", name: "Qualitative Evidence Grounding", severity: "INFO", description: "Differentiate qualitative narrative interview summaries from quantitative survey counts." }
      ],
      aiDirectives: [
        "Adhere strictly to Tanzanian legal citation conventions (Tanzania Law Reports - TLR, Commonwealth cases).",
        "Delineate qualitative thematic narratives from quantitative empirical data.",
        "Ensure alignment with statutory provisions (CAP revisions) and Tanzanian judicial hierarchy."
      ],
      provenance: {
        sourceStandard: "UDSM School of Law / Mzumbe University Faculty of Law Guidelines 2024",
        verifiedBy: "Legal & Social Sciences Editorial Board",
        lastAuditDate: "2024-10-10"
      }
    });
  }

  public static register(profile: DisciplineProfile) {
    this.profiles.set(profile.id, profile);
  }

  public static getProfile(disciplineId: string): DisciplineProfile | undefined {
    return this.profiles.get(disciplineId);
  }

  public static getAllProfiles(): DisciplineProfile[] {
    return Array.from(this.profiles.values());
  }

  public static resolveProfileForProgramme(programmeId: string): DisciplineProfile {
    const p = (programmeId || "").toLowerCase();

    // 1. Engineering
    if (p.includes("eng") || p.includes("civil") || p.includes("mech") || p.includes("elec") || p.includes("telecom") || p.includes("mining") || p.includes("chemical") || p.includes("coet")) {
      return this.profiles.get("engineering")!;
    }
    // 2. Health Sciences
    if (p.includes("med") || p.includes("pharm") || p.includes("nurs") || p.includes("health") || p.includes("doctor") || p.includes("dent") || p.includes("muhas") || p.includes("cuhas")) {
      return this.profiles.get("health-sciences")!;
    }
    // 3. Agriculture & Environmental
    if (p.includes("agric") || p.includes("sua") || p.includes("forestry") || p.includes("environ") || p.includes("soil") || p.includes("horticult") || p.includes("wildlife") || p.includes("aquatic") || p.includes("fisheries") || p.includes("coaf")) {
      return this.profiles.get("agriculture-environmental")!;
    }
    // 4. Social Sciences & Law
    if (p.includes("law") || p.includes("llb") || p.includes("sociolog") || p.includes("public admin") || p.includes("mass comm") || p.includes("politic") || p.includes("journalism") || p.includes("humanit") || p.includes("udsom")) {
      return this.profiles.get("social-sciences-law")!;
    }
    // 5. Education
    if (p.includes("edu") || p.includes("teach") || p.includes("pedagogy") || p.includes("duce") || p.includes("muce")) {
      return this.profiles.get("education")!;
    }
    // 6. Business & Economics
    if (p.includes("acc") || p.includes("fin") || p.includes("biz") || p.includes("bba") || p.includes("econ") || p.includes("cbe") || p.includes("ifm") || p.includes("udbs")) {
      return this.profiles.get("business-economics")!;
    }
    // 7. Computing & IT (Default STEM)
    if (p.includes("cs") || p.includes("it") || p.includes("software") || p.includes("cyber") || p.includes("data") || p.includes("coict") || p.includes("dit")) {
      return this.profiles.get("computing-it")!;
    }

    return this.profiles.get("computing-it")!;
  }
}
