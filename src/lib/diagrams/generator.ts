import { DiagramSpecInput, RenderedDiagramResult, SupportedDiagramType } from "./types";

export class DiagramEngine {
  /**
   * Compiles a structured JSON input into a validated, renderable diagram definition.
   */
  public static generate(input: DiagramSpecInput): RenderedDiagramResult {
    let sourceDefinition = "";
    let format: "MERMAID" | "SVG_CHART" | "MATRIX_TABLE" = "MERMAID";

    switch (input.diagramType) {
      // 1. Software & Systems
      case "UML_USECASE":
        sourceDefinition = this.generateUmlUseCase(input.data);
        break;
      case "UML_SEQUENCE":
        sourceDefinition = this.generateUmlSequence(input.data);
        break;
      case "UML_CLASS":
        sourceDefinition = this.generateUmlClass(input.data);
        break;
      case "DATABASE_ERD":
        sourceDefinition = this.generateDatabaseErd(input.data);
        break;
      case "SYSTEM_ARCHITECTURE":
        sourceDefinition = this.generateSystemArchitecture(input.data);
        break;

      // 2. Engineering & Process
      case "PROCESS_FLOW_DIAGRAM":
        sourceDefinition = this.generateProcessFlow(input.data);
        break;
      case "ENGINEERING_SCHEMATIC":
        sourceDefinition = this.generateEngineeringSchematic(input.data);
        break;
      case "DECISION_TREE":
        sourceDefinition = this.generateDecisionTree(input.data);
        break;
      case "WBS":
        sourceDefinition = this.generateWbs(input.data);
        break;

      // 3. Business & Management
      case "SWOT_MATRIX":
        sourceDefinition = this.generateSwotMatrix(input.data);
        format = "MATRIX_TABLE";
        break;
      case "PORTERS_FIVE_FORCES":
        sourceDefinition = this.generatePortersFiveForces(input.data);
        break;
      case "GANTT":
        sourceDefinition = this.generateGantt(input.data);
        break;
      case "SVG_CHART":
        sourceDefinition = this.generateSvgChart(input.data);
        format = "SVG_CHART";
        break;

      // 4. Education
      case "LESSON_PLAN_MATRIX":
        sourceDefinition = this.generateLessonPlanMatrix(input.data);
        format = "MATRIX_TABLE";
        break;
      case "BLOOM_TAXONOMY_MATRIX":
        sourceDefinition = this.generateBloomTaxonomyMatrix(input.data);
        format = "MATRIX_TABLE";
        break;

      // 5. Agriculture & Health & Environment
      case "FIELD_LAYOUT_DIAGRAM":
        sourceDefinition = this.generateFieldLayout(input.data);
        break;
      case "ENVIRONMENTAL_IMPACT_MATRIX":
        sourceDefinition = this.generateEnvironmentalImpactMatrix(input.data);
        format = "MATRIX_TABLE";
        break;
      case "STUDY_FLOW_DIAGRAM":
        sourceDefinition = this.generateStudyFlow(input.data);
        break;

      default:
        sourceDefinition = this.generateFallbackFlowchart(input.data);
        break;
    }

    const isValid = format === "MERMAID" ? this.validateMermaidSyntax(sourceDefinition) : sourceDefinition.length > 0;

    return {
      diagramId: `diag-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      diagramType: input.diagramType,
      title: input.title,
      caption: input.caption || `Figure: ${input.title}`,
      format,
      sourceDefinition,
      isValid,
      renderingNotes: `Compiled as ${format} specification for web preview and DOCX/PDF export.`
    };
  }

  // ---------------------------------------------------------------------------
  // 1. SOFTWARE & COMPUTING DIAGRAMS
  // ---------------------------------------------------------------------------

  private static generateUmlUseCase(data: any): string {
    const systemName = data.systemName || "UniReportTZ Academic Platform";
    const actors = data.actors || ["Student Researcher", "Academic Supervisor", "System Administrator"];
    const useCases = data.useCases || [
      "Select University Template",
      "Input Project Evidence & Variables",
      "Run Deterministic Calculations",
      "Generate Chapter Draft",
      "Perform Compliance Audit",
      "Export Final PDF & DOCX"
    ];

    const lines = [
      "flowchart LR",
      `  subgraph SystemBoundary["${systemName}"]`
    ];

    useCases.forEach((uc: string, i: number) => {
      lines.push(`    UC${i + 1}(("${uc}"))`);
    });
    lines.push("  end");

    actors.forEach((act: string, i: number) => {
      const actId = `Actor${i + 1}`;
      lines.push(`  ${actId}["👤 ${act}"]`);
      if (i === 0) {
        useCases.slice(0, 4).forEach((_: string, j: number) => {
          lines.push(`  ${actId} --> UC${j + 1}`);
        });
      } else if (i === 1) {
        lines.push(`  ${actId} --> UC5`);
        lines.push(`  ${actId} --> UC6`);
      } else {
        lines.push(`  ${actId} --> UC1`);
        lines.push(`  ${actId} --> UC5`);
      }
    });

    return lines.join("\n");
  }

  private static generateUmlSequence(data: any): string {
    return [
      "sequenceDiagram",
      "  autonumber",
      "  actor Student as Student Researcher",
      "  participant WebUI as Web Browser Client",
      "  participant API as API Route Handler",
      "  participant Engine as Requirements Engine",
      "  participant Calc as Calculations Engine",
      "  participant DB as PostgreSQL Database",
      "  Student->>WebUI: Submits Project Variables & Evidence",
      "  WebUI->>API: POST /api/v1/requirements/resolve",
      "  API->>Engine: Resolve Tier 1 to 6 Precedence",
      "  Engine->>DB: Fetch Institutional Guidelines",
      "  DB-->>Engine: Official Template Rules",
      "  Engine->>Calc: Execute Deterministic Formulas",
      "  Calc-->>Engine: Verified Numerical Results",
      "  Engine-->>API: Compiled Report Specification",
      "  API-->>WebUI: Specification & Visual Artifacts",
      "  WebUI-->>Student: Displays Pre-Flight Review Modal"
    ].join("\n");
  }

  private static generateUmlClass(data: any): string {
    return [
      "classDiagram",
      "  class User {",
      "    +String id",
      "    +String email",
      "    +String university",
      "    +createPlan()",
      "  }",
      "  class ReportSpecification {",
      "    +String id",
      "    +String reportType",
      "    +FormattingRules formatting",
      "    +validate()",
      "  }",
      "  class CalculationEngine {",
      "    +calculate(formulaCode, inputs)",
      "  }",
      "  class DiagramEngine {",
      "    +generate(spec)",
      "  }",
      "  User \"1\" --> \"*\" ReportSpecification : creates",
      "  ReportSpecification --> CalculationEngine : evaluates",
      "  ReportSpecification --> DiagramEngine : renders"
    ].join("\n");
  }

  private static generateDatabaseErd(data: any): string {
    return [
      "erDiagram",
      "  STUDENT_USER ||--o{ REPORT_PLAN : creates",
      "  REPORT_PLAN ||--o{ REPORT_SECTION : contains",
      "  REPORT_PLAN ||--o{ CALCULATION_RECORD : includes",
      "  REPORT_PLAN ||--o{ DIAGRAM_RECORD : embeds",
      "  STUDENT_USER {",
      "    string id PK",
      "    string email",
      "    string universityId FK",
      "    string role",
      "    datetime createdAt",
      "  }",
      "  REPORT_PLAN {",
      "    string id PK",
      "    string userId FK",
      "    string reportTitle",
      "    string reportType",
      "    int targetPages",
      "    string citationStyle",
      "  }",
      "  REPORT_SECTION {",
      "    string id PK",
      "    string planId FK",
      "    int chapterNumber",
      "    string title",
      "    int wordBudget",
      "    string status",
      "  }",
      "  CALCULATION_RECORD {",
      "    string id PK",
      "    string planId FK",
      "    string formulaCode",
      "    float outputValue",
      "    string outputUnit",
      "  }",
      "  DIAGRAM_RECORD {",
      "    string id PK",
      "    string planId FK",
      "    string diagramType",
      "    string format",
      "  }"
    ].join("\n");
  }

  private static generateSystemArchitecture(data: any): string {
    const title = data.title || "Layered System Architecture";
    return [
      "graph TD",
      `  %% ${title}`,
      "  subgraph PresentationTier[\"Presentation Tier (Next.js 16 App Router)\"]",
      "    UI[\"Responsive Web UI (Tailwind CSS v4 & React 19)\"]",
      "    Dashboard[\"Student Academic Workspace & Pre-Flight Studio\"]",
      "  end",
      "",
      "  subgraph ApplicationTier[\"Application & Services Tier\"]",
      "    Gateway[\"Next.js API Route Handlers / REST API\"]",
      "    ReqEngine[\"Layered Requirements Resolution Engine\"]",
      "    CalcEngine[\"Deterministic Calculations Engine\"]",
      "    DiagEngine[\"Structured Visuals & Diagrams Engine\"]",
      "    AuditEngine[\"Multi-Tier Compliance Audit Pipeline\"]",
      "    AIAdapter[\"Vercel AI SDK Google Gemini 1.5 Flash\"]",
      "  end",
      "",
      "  subgraph PersistenceTier[\"Persistence & Infrastructure Tier\"]",
      "    Prisma[\"Prisma ORM 5.22\"]",
      "    Postgres[(\"PostgreSQL Database\")]",
      "    ExportEngine[\"DOCX & PDF Compilation Services\"]",
      "  end",
      "",
      "  UI --> Gateway",
      "  Dashboard --> Gateway",
      "  Gateway --> ReqEngine",
      "  Gateway --> CalcEngine",
      "  Gateway --> DiagEngine",
      "  Gateway --> AuditEngine",
      "  Gateway --> AIAdapter",
      "  ReqEngine --> Prisma",
      "  Prisma --> Postgres",
      "  Gateway --> ExportEngine"
    ].join("\n");
  }

  // ---------------------------------------------------------------------------
  // 2. ENGINEERING & PROCESS DIAGRAMS
  // ---------------------------------------------------------------------------

  private static generateProcessFlow(data: any): string {
    const steps = data.steps || [
      "Field Reconnaissance & Site Survey",
      "Soil Sampling & Core Drilling",
      "Laboratory Sieve Analysis & Atterberg Limits",
      "Proctor Compaction Testing",
      "California Bearing Ratio (CBR) Evaluation",
      "Pavement Layer Thickness Design"
    ];

    const lines = ["graph TD"];
    steps.forEach((step: string, i: number) => {
      if (i < steps.length - 1) {
        lines.push(`  S${i + 1}["${step}"] --> S${i + 2}["${steps[i + 1]}"]`);
      }
    });
    return lines.join("\n");
  }

  private static generateEngineeringSchematic(data: any): string {
    return [
      "graph LR",
      "  PowerGrid[\"230V AC Single-Phase Grid (TANESCO)\"] --> Psu[\"Switch-Mode Power Supply 12V/5V DC\"]",
      "  Psu --> Mcu[\"ESP32 Microcontroller Core Node\"]",
      "  Sensors[\"Industrial Sensor Array (Temperature, Pressure, Flow)\"] --> ADC[\"ADC Signal Conditioning\"]",
      "  ADC --> Mcu",
      "  Mcu --> Relay[\"Solid-State Relay Switching Module\"]",
      "  Relay --> Pump[\"Submersible Water Pump / Motor Load\"]",
      "  Mcu --> Comms[\"LoRa Wireless Transceiver\"]",
      "  Comms --> Gateway[\"Remote Monitoring IoT Gateway\"]"
    ].join("\n");
  }

  private static generateDecisionTree(data: any): string {
    return [
      "graph TD",
      "  Root{\"Initial Site Inspection & Test Conditions\"} -->|Soil CBR >= 5%| NormalDesign[\"Standard Flexible Pavement Design\"]",
      "  Root -->|Soil CBR < 5%| SubgradeCheck{\"Subgrade Improvement Assessment\"}",
      "  SubgradeCheck -->|Expansive Black Cotton Soil| LimeStabilization[\"Lime / Cement Chemical Stabilization\"]",
      "  SubgradeCheck -->|High Water Table| Geotextile[\"Sub-surface Drainage & Geotextile Layer\"]",
      "  NormalDesign --> FinalSpec[\"Complete Technical Specification\"]",
      "  LimeStabilization --> FinalSpec",
      "  Geotextile --> FinalSpec"
    ].join("\n");
  }

  private static generateWbs(data: any): string {
    return [
      "graph TD",
      "  Root[\"1.0 Academic Engineering Project Lifecycle\"] --> WP1[\"1.1 Preliminary Phase\"]",
      "  Root --> WP2[\"1.2 Technical Design\"]",
      "  Root --> WP3[\"1.3 Prototyping & Testing\"]",
      "  Root --> WP4[\"1.4 Project Documentation\"]",
      "  WP1 --> T1[\"1.1.1 Problem & Scope Formulation\"]",
      "  WP1 --> T2[\"1.1.2 Institutional Requirements Review\"]",
      "  WP2 --> T3[\"1.2.1 Deterministic Calculations (SI)\"]",
      "  WP2 --> T4[\"1.2.2 System Schematics & Drawings\"]",
      "  WP3 --> T5[\"1.3.1 Hardware Assembly / Lab Setup\"]",
      "  WP3 --> T6[\"1.3.2 Empirical Measurements & Errors\"]",
      "  WP4 --> T7[\"1.4.1 Multi-Tier Compliance Audit\"]",
      "  WP4 --> T8[\"1.4.2 Final Thesis DOCX & PDF Export\"]"
    ].join("\n");
  }

  // ---------------------------------------------------------------------------
  // 3. BUSINESS & STRATEGY DIAGRAMS
  // ---------------------------------------------------------------------------

  private static generateSwotMatrix(data: any): string {
    return [
      "| Strategic Dimension | Internal Organizational Factors | External Environmental Factors |",
      "|---|---|---|",
      "| **Favorable / Positive** | **Strengths (S):**<br>• Established institutional brand reputation<br>• High-calibre academic research faculty<br>• Robust computational infrastructure | **Opportunities (O):**<br>• National digital university modernization drive<br>• Industry demand for STEM & commercial graduates<br>• Collaborative donor research grants |",
      "| **Unfavorable / Negative** | **Weaknesses (W):**<br>• Constrained laboratory equipment ratios<br>• Manual logbook and paperwork tracking<br>• Limited real-world commercialization incubation | **Threats (T):**<br>• Macroeconomic inflation impacting project costs<br>• Fluctuating regulatory curriculum guidelines<br>• High competitive entry from private institutions |"
    ].join("\n");
  }

  private static generatePortersFiveForces(data: any): string {
    return [
      "flowchart TD",
      "  Core[\"Competitive Rivalry Among Existing Competitors\"]",
      "  Buyers[\"Bargaining Power of Buyers (Corporate Clients & Students)\"] --> Core",
      "  Suppliers[\"Bargaining Power of Suppliers (Tech Vendors, Specialized Talent)\"] --> Core",
      "  NewEntrants[\"Threat of New Market Entrants\"] --> Core",
      "  Substitutes[\"Threat of Substitute Solutions\"] --> Core"
    ].join("\n");
  }

  private static generateGantt(data: any): string {
    return [
      "gantt",
      "  title Academic Project Implementation Timeline",
      "  dateFormat YYYY-MM-DD",
      "  section Proposal Phase",
      "  Topic Discovery & Problem Definition   :done,    2024-10-01, 2024-10-15",
      "  Literature Review & Methodology       :done,    2024-10-16, 2024-11-05",
      "  Proposal Defense & Ethical Clearance  :done,    2024-11-06, 2024-11-20",
      "  section Implementation",
      "  Data Collection / System Development  :active,  2024-11-21, 2024-12-20",
      "  Testing & Verification               :         2024-12-21, 2025-01-15",
      "  section Final Reporting",
      "  Full Report Drafting & Compliance QA :         2025-01-16, 2025-02-05",
      "  Final Thesis Defense & Submission    :         2025-02-06, 2025-02-20"
    ].join("\n");
  }

  private static generateSvgChart(data: any): string {
    const title = data.title || "Quantitative Performance Metrics";
    const labels = data.labels || ["Baseline", "Trial 1", "Trial 2", "Trial 3", "Target"];
    const values = data.values || [25, 45, 68, 85, 100];
    const maxVal = Math.max(...values, 100);

    const barWidth = 60;
    const gap = 30;
    const chartHeight = 220;
    const svgWidth = labels.length * (barWidth + gap) + 80;

    const barsSvg = values.map((val: number, i: number) => {
      const height = (val / maxVal) * chartHeight;
      const x = 50 + i * (barWidth + gap);
      const y = 260 - height;
      return `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${height}" rx="4" fill="#0d9488" />
        <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="12" font-weight="bold" fill="#0f172a">${val}</text>
        <text x="${x + barWidth / 2}" y="285" text-anchor="middle" font-size="11" fill="#64748b">${labels[i]}</text>
      `;
    }).join("\n");

    return `
<svg viewBox="0 0 ${svgWidth} 320" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto; font-family: sans-serif;">
  <rect width="100%" height="100%" fill="#f8fafc" rx="8" />
  <text x="30" y="35" font-size="15" font-weight="bold" fill="#0f172a">${title}</text>
  <line x1="40" y1="260" x2="${svgWidth - 20}" y2="260" stroke="#cbd5e1" stroke-width="2" />
  ${barsSvg}
</svg>
    `.trim();
  }

  // ---------------------------------------------------------------------------
  // 4. EDUCATION & PEDAGOGY MATRICES
  // ---------------------------------------------------------------------------

  private static generateLessonPlanMatrix(data: any): string {
    return [
      "| Time (Min) | Stage / Step | Teaching Activities (Teacher) | Learning Activities (Students) | Teaching Aids / Media | Assessment Strategy | Core Competency | Reference |",
      "|---|---|---|---|---|---|---|---|",
      "| **00 - 05** | Introduction | Review prior knowledge using targeted diagnostic questions. | Respond to questions, review concepts, and activate schema. | Chalkboard / Flashcards | Oral questioning | Cognitive Recall | TIE Syllabus |",
      "| **05 - 20** | Development (Stage 1) | Introduce new topic, define governing formulas, demonstrate step-by-step example. | Take guided notes, ask clarifying questions, observe teacher model. | Concept Matrix Poster | Formative checks | Conceptual Grasp | Core Textbook |",
      "| **20 - 35** | Application (Stage 2) | Organize students into pairs, assign problem sets, facilitate peer activity. | Solve practice problems in pairs, verify peer workings. | Practice Task Sheets | Peer evaluation | Collaborative Problem Solving | Activity Manual |",
      "| **35 - 40** | Conclusion & Evaluation | Summarize main principles, assign independent practice homework. | Record homework questions, summarize key takeaway points. | Exercise Workbooks | Exit ticket evaluation | Mastery Reflection | Chapter Review |"
    ].join("\n");
  }

  private static generateBloomTaxonomyMatrix(data: any): string {
    return [
      "| Cognitive Domain Level | Action Verbs Employed | Target Specific Learning Objective | Assessment Strategy | Weighting (%) |",
      "|---|---|---|---|---|",
      "| **1. Remembering** | State, Define, List, Identify | Recall fundamental statutory or scientific definitions. | Objective Multiple Choice | 15% |",
      "| **2. Understanding** | Explain, Describe, Distinguish | Explain theoretical operational principles and workflows. | Structured Explanation | 20% |",
      "| **3. Applying** | Calculate, Compute, Implement | Execute deterministic numerical problem sets and sizing. | Step-by-Step Derivation | 25% |",
      "| **4. Analyzing** | Differentiate, Compare, Audit | Analyze comparative trade-offs in design and methodology. | Case Study Analysis | 20% |",
      "| **5. Evaluating** | Justify, Critique, Validate | Justify selection of parameters against safety constraints. | Design Justification | 10% |",
      "| **6. Creating** | Formulate, Design, Synthesize | Synthesize cohesive system architecture and report artifacts. | Final Project Defense | 10% |"
    ].join("\n");
  }

  // ---------------------------------------------------------------------------
  // 5. AGRICULTURE, HEALTH & ENVIRONMENT DIAGRAMS
  // ---------------------------------------------------------------------------

  private static generateFieldLayout(data: any): string {
    return [
      "graph TD",
      "  subgraph FieldLayout[\"Randomized Complete Block Design (RCBD) Layout - 4 Replications\"]",
      "    subgraph Block1[\"Replication I\"]",
      "      B1P1[\"Plot 1: Control (T0)\"] --- B1P2[\"Plot 2: NPK 40kg/ha (T1)\"] --- B1P3[\"Plot 3: NPK 80kg/ha (T2)\"]",
      "    end",
      "    subgraph Block2[\"Replication II\"]",
      "      B2P1[\"Plot 4: NPK 80kg/ha (T2)\"] --- B2P2[\"Plot 5: Control (T0)\"] --- B2P3[\"Plot 6: NPK 40kg/ha (T1)\"]",
      "    end",
      "    subgraph Block3[\"Replication III\"]",
      "      B3P1[\"Plot 7: NPK 40kg/ha (T1)\"] --- B3P2[\"Plot 8: NPK 80kg/ha (T2)\"] --- B3P3[\"Plot 9: Control (T0)\"]",
      "    end",
      "    subgraph Block4[\"Replication IV\"]",
      "      B4P1[\"Plot 10: Control (T0)\"] --- B4P2[\"Plot 11: NPK 80kg/ha (T2)\"] --- B4P3[\"Plot 12: NPK 40kg/ha (T1)\"]",
      "    end",
      "  end"
    ].join("\n");
  }

  private static generateEnvironmentalImpactMatrix(data: any): string {
    return [
      "| Project Activity / Phase | Environmental Aspect | Potential Impact | Significance (Pre-Mitigation) | Proposed Engineering Mitigation | Residual Significance |",
      "|---|---|---|---|---|---|",
      "| **Site Clearing & Earthworks** | Topsoil disturbance & vegetation removal | Accelerated soil erosion & siltation of stream runoff | Moderate (-2) | Silt fencing, progressive clearing, stockpile mulching | Low (-1) |",
      "| **Construction Equipment Operation** | Diesel exhaust & dust generation | Elevated PM10/PM2.5 particulate matter | Minor (-1) | Water spraying twice daily, equipment preventive servicing | Negligible (0) |",
      "| **Concrete Batching & Washing** | High pH alkaline wash water | Groundwater contamination & soil salinization | Significant (-3) | Lined evaporation/neutralization pit prior to discharge | Low (-1) |",
      "| **Operational Runoff Discharge** | Stormwater channel scouring | Downstream channel erosion | Moderate (-2) | Energy dissipation rip-rap basins & grassed swales | Negligible (0) |"
    ].join("\n");
  }

  private static generateStudyFlow(data: any): string {
    const totalPop = data.totalPopulation || "N = 1,250 Target Population";
    const screened = data.screened || "n = 420 Screened for Eligibility";
    const excluded = data.excluded || "n = 34 Excluded (Met exclusion criteria)";
    const sampled = data.sampled || "n = 386 Enrolled in Study Sample";
    const completed = data.completed || "n = 378 Completed Survey (97.9% response rate)";

    return [
      "graph TD",
      `  Pop["${totalPop}"] --> Screen["${screened}"]`,
      `  Screen --> Excl["${excluded}"]`,
      `  Screen --> Sample["${sampled}"]`,
      `  Sample --> Final["${completed}"]`
    ].join("\n");
  }

  private static generateFallbackFlowchart(data: any): string {
    return [
      "flowchart TD",
      "  Start([Project Inception]) --> Plan[Requirements Formulation]",
      "  Plan --> Exec[Methodological Execution]",
      "  Exec --> Analysis[Data & Findings Synthesis]",
      "  Analysis --> FinalReport([Academic Report Completion])"
    ].join("\n");
  }

  private static validateMermaidSyntax(definition: string): boolean {
    if (!definition || definition.trim().length === 0) return false;
    const header = definition.trim().split("\n")[0].toLowerCase();
    const validHeaders = ["graph", "flowchart", "erdiagram", "sequencediagram", "gantt", "classdiagram", "statediagram"];
    return validHeaders.some((h) => header.startsWith(h));
  }
}
