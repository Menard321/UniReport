export interface PlacementSuggestionItem {
  id: string;
  disciplineId: string;
  field: "activities" | "toolsUsed" | "challenges" | "keyLearnings";
  title: string;
  detail: string;
  category?: string;
}

export const CURATED_PLACEMENT_SUGGESTIONS: PlacementSuggestionItem[] = [
  // ==========================================
  // COMPUTING & IT
  // ==========================================
  {
    id: "comp-act-1",
    disciplineId: "computing-it",
    field: "activities",
    title: "Database Administration & Schema Migration",
    detail: "Performed routine database maintenance, executed relational schema migrations in PostgreSQL/MySQL, and assisted in query optimization for production database systems."
  },
  {
    id: "comp-act-2",
    disciplineId: "computing-it",
    field: "activities",
    title: "Software Development & API Integration",
    detail: "Developed modular RESTful API endpoints, resolved application-layer bugs, and implemented frontend user interface components using modern frameworks."
  },
  {
    id: "comp-act-3",
    disciplineId: "computing-it",
    field: "activities",
    title: "Network Infrastructure Configuration & Monitoring",
    detail: "Configured local area network (LAN) switches, managed VLAN routing, deployed firewall access control rules, and monitored link bandwidth utilization."
  },
  {
    id: "comp-act-4",
    disciplineId: "computing-it",
    field: "activities",
    title: "IT Helpdesk & System Troubleshooting",
    detail: "Diagnosed hardware, operating system, and domain credential issues across organization workstations, maintaining service SLA compliance."
  },
  {
    id: "comp-tools-1",
    disciplineId: "computing-it",
    field: "toolsUsed",
    title: "Dev & Ops Toolchain",
    detail: "Git, GitHub/GitLab, Docker, VS Code, Postman, Linux Terminal (Ubuntu/Debian), Bash scripting."
  },
  {
    id: "comp-tools-2",
    disciplineId: "computing-it",
    field: "toolsUsed",
    title: "Databases & Networking",
    detail: "PostgreSQL, MySQL, Wireshark, Cisco Packet Tracer, PuTTY, Nmap, pfSense."
  },
  {
    id: "comp-chal-1",
    disciplineId: "computing-it",
    field: "challenges",
    title: "Legacy Software Interoperability",
    detail: "Encountered incompatible dependencies when migrating legacy data into contemporary relational databases; mitigated by crafting automated sanitization scripts."
  },
  {
    id: "comp-chal-2",
    disciplineId: "computing-it",
    field: "challenges",
    title: "Intermittent WAN Bandwidth Fluctuations",
    detail: "Experienced occasional link dropouts during remote server backups; addressed by configuring retry backoff queues and asynchronous off-peak batch sync."
  },
  {
    id: "comp-learn-1",
    disciplineId: "computing-it",
    field: "keyLearnings",
    title: "Production Incident Response Protocols",
    detail: "Gained firsthand proficiency in enterprise incident escalation procedures, zero-downtime maintenance windows, and root-cause analysis documentation."
  },
  {
    id: "comp-learn-2",
    disciplineId: "computing-it",
    field: "keyLearnings",
    title: "Team Collaborative Version Control",
    detail: "Mastered collaborative branch workflows, peer code reviews, and Git rebasing in multi-engineer development environments."
  },

  // ==========================================
  // ENGINEERING (Civil, Electrical, Mechanical, Telecom)
  // ==========================================
  {
    id: "eng-act-1",
    disciplineId: "engineering",
    field: "activities",
    title: "Structural Quality Inspections & Material Testing",
    detail: "Conducted concrete slump testing, verified compressive cube strength tests at 7/14/28 days, and inspected reinforcement rebar placement against architectural drawings."
  },
  {
    id: "eng-act-2",
    disciplineId: "engineering",
    field: "activities",
    title: "Electrical Substation & Switchgear Maintenance",
    detail: "Participated in thermal imaging scans of distribution transformers, calibrated protection relays, and conducted insulation resistance (Megger) checks."
  },
  {
    id: "eng-act-3",
    disciplineId: "engineering",
    field: "activities",
    title: "Preventive Mechanical Overhauls & Diagnostics",
    detail: "Serviced industrial pumping assemblies, aligned drive shafts, monitored vibration thresholds, and replaced hydraulic filtration cartridges."
  },
  {
    id: "eng-act-4",
    disciplineId: "engineering",
    field: "activities",
    title: "Topographical Surveying & Leveling",
    detail: "Established site baseline benchmarks using electronic total stations and digital optical levels to generate contour cross-sections for earthworks."
  },
  {
    id: "eng-tools-1",
    disciplineId: "engineering",
    field: "toolsUsed",
    title: "Design & CAD Software",
    detail: "AutoCAD 2024, Civil 3D, SolidWorks, MATLAB/Simulink, ETAP, Proteus Design Suite."
  },
  {
    id: "eng-tools-2",
    disciplineId: "engineering",
    field: "toolsUsed",
    title: "Field Instrumentation & Measurement Gear",
    detail: "Total Station (Leica/Topcon), Digital Multimeter, Insulation Resistance Tester (Megger), Concrete Test Hammer, Vernier Caliper, Tachometer."
  },
  {
    id: "eng-chal-1",
    disciplineId: "engineering",
    field: "challenges",
    title: "Adverse Weather Impact on Site Operations",
    detail: "Heavy rains hindered open foundation trench excavation; managed by implementing sump pumping ditches and covering exposed aggregate stockpiles."
  },
  {
    id: "eng-chal-2",
    disciplineId: "engineering",
    field: "challenges",
    title: "Sensor Calibration Drift in Industrial Operating Environments",
    detail: "Sensors exhibited drift under high ambient heat; corrected by scheduling daily pre-shift recalibration against certified calibration references."
  },
  {
    id: "eng-learn-1",
    disciplineId: "engineering",
    field: "keyLearnings",
    title: "ERB Professional Standards & Industrial Safety Compliance",
    detail: "Gained operational mastery of Tanzanian Engineers Registration Board (ERB) code of ethics, OSHA site safety protocols, and PPE enforcement."
  },
  {
    id: "eng-learn-2",
    disciplineId: "engineering",
    field: "keyLearnings",
    title: "Translating Theoretical Engineering Sizing to Physical Assembly",
    detail: "Bridged theoretical beam deflection equations and cable ampacity tables to tangible industrial installation practices."
  },

  // ==========================================
  // BUSINESS, COMMERCE & ECONOMICS
  // ==========================================
  {
    id: "biz-act-1",
    disciplineId: "business-economics",
    field: "activities",
    title: "Financial Auditing & Bank Ledger Reconciliation",
    detail: "Reconciled monthly commercial bank statements against the internal general ledger, tracked outstanding vendor receivables, and flagged discrepancy variances."
  },
  {
    id: "biz-act-2",
    disciplineId: "business-economics",
    field: "activities",
    title: "Procurement Tender Evaluation & Supplier Vetting",
    detail: "Prepared Local Purchase Orders (LPOs), vetted supplier bidding documents under the Public Procurement Regulatory Authority (PPRA) guidelines, and monitored goods delivery notes."
  },
  {
    id: "biz-act-3",
    disciplineId: "business-economics",
    field: "activities",
    title: "Statutory Tax Compliance (TRA Electronic Filing)",
    detail: "Assisted in computing Value Added Tax (VAT), Withholding Tax, and PAYE monthly schedules for submission via the Tanzania Revenue Authority (TRA) electronic portal."
  },
  {
    id: "biz-tools-1",
    disciplineId: "business-economics",
    field: "toolsUsed",
    title: "ERP & Accounting Systems",
    detail: "Tally Prime, QuickBooks Enterprise, SAP Business One, Microsoft Excel (Power Query, VLOOKUP, Pivot Tables), TRA e-Filing Gateway."
  },
  {
    id: "biz-chal-1",
    disciplineId: "business-economics",
    field: "challenges",
    title: "Unmatched Delivery Notes & Incomplete Invoicing",
    detail: "Suppliers occasionally submitted invoices without attached signed delivery notes; mitigated by enforcing a strict three-way matching procedure prior to payment authorization."
  },
  {
    id: "biz-learn-1",
    disciplineId: "business-economics",
    field: "keyLearnings",
    title: "Internal Control Frameworks & Segregation of Duties",
    detail: "Understood the practical imperativeness of dual authorization controls in safeguarding institutional liquidity against fiscal fraud."
  },

  // ==========================================
  // HEALTH & MEDICAL SCIENCES
  // ==========================================
  {
    id: "health-act-1",
    disciplineId: "health-sciences",
    field: "activities",
    title: "Clinical Ward Rounds & Patient Case Documentation",
    detail: "Accompanied attending consultant physicians on daily inpatient ward rounds, noted clinical progression parameters, and reviewed pharmacological treatment sheets."
  },
  {
    id: "health-act-2",
    disciplineId: "health-sciences",
    field: "activities",
    title: "Diagnostic Clinical Laboratory Testing",
    detail: "Conducted automated hematological Full Blood Picture (FBP) analyses, cross-matched donor units, and performed microscopic identification of bloodborne pathogens."
  },
  {
    id: "health-tools-1",
    disciplineId: "health-sciences",
    field: "toolsUsed",
    title: "Clinical & Laboratory Equipment",
    detail: "Centrifuge, Automated Hematology Analyzer (Sysmex), Binocular Optical Microscope, Sphygmomanometer, Glucometer, Autoclave Sterilizer."
  },
  {
    id: "health-chal-1",
    disciplineId: "health-sciences",
    field: "challenges",
    title: "Occasional Diagnostic Reagent Stockouts",
    detail: "Encountered brief delays in specific biochemical testing reagents; mitigated by coordinating backup batch allocations through the zonal Medical Stores Department (MSD)."
  },
  {
    id: "health-learn-1",
    disciplineId: "health-sciences",
    field: "keyLearnings",
    title: "Strict Patient Confidentiality & Infection Prevention Control",
    detail: "Internalized the biomedical imperative of Universal Precautions, sterile sharps disposal, and strict anonymity in clinical record-keeping."
  },

  // ==========================================
  // AGRICULTURE & ENVIRONMENTAL SCIENCES
  // ==========================================
  {
    id: "agric-act-1",
    disciplineId: "agriculture-environmental",
    field: "activities",
    title: "Soil Fertility Profiling & pH Sampling",
    detail: "Collected composite core soil samples across agronomic research parcels, measured electrical conductivity and pH, and calculated NPK deficiency correction rates."
  },
  {
    id: "agric-act-2",
    disciplineId: "agriculture-environmental",
    field: "activities",
    title: "Pest & Crop Pathology Surveillance",
    detail: "Conducted field scouting for Fall Armyworm (Spodoptera frugiperda) and foliar rust incidence, recording disease severity indices per hectare."
  },
  {
    id: "agric-tools-1",
    disciplineId: "agriculture-environmental",
    field: "toolsUsed",
    title: "Agronomic & Soil Testing Instruments",
    detail: "Handheld Soil pH Meter, Refractometer, Knapsack Sprayer, GPS Georeferencing Unit (Garmin), Soil Core Augers, Munsell Soil Color Chart."
  },
  {
    id: "agric-chal-1",
    disciplineId: "agriculture-environmental",
    field: "challenges",
    title: "Unpredictable Rain Onset & Moisture Stress",
    detail: "Variable rainfall delayed primary germination in test plots; addressed by implementing localized drip irrigation and organic mulching."
  },
  {
    id: "agric-learn-1",
    disciplineId: "agriculture-environmental",
    field: "keyLearnings",
    title: "Climate-Smart Agronomic Interventions",
    detail: "Appreciated the economic difference made by conservation agriculture, drought-tolerant seed cultivars, and integrated pest management (IPM)."
  },

  // ==========================================
  // SOCIAL SCIENCES, LAW & HUMANITIES
  // ==========================================
  {
    id: "soc-act-1",
    disciplineId: "social-sciences-law",
    field: "activities",
    title: "Legal Research & Case Precedent Indexing",
    detail: "Indexed Tanzanian High Court and Court of Appeal rulings from the Tanzania Law Reports (TLR), drafting legal briefs and analyzing statutory provisions."
  },
  {
    id: "soc-act-2",
    disciplineId: "social-sciences-law",
    field: "activities",
    title: "Community Social Field Surveys & Stakeholder Interviews",
    detail: "Conducted structured interviews with community beneficiaries, transcribed qualitative feedback, and coded emergent thematic categories."
  },
  {
    id: "soc-tools-1",
    disciplineId: "social-sciences-law",
    field: "toolsUsed",
    title: "Qualitative & Research Software",
    detail: "SPSS Statistics, NVivo Qualitative Analysis, Tanzanian Laws Online Portal, Microsoft Word, Google Forms / KoboToolbox."
  },
  {
    id: "soc-chal-1",
    disciplineId: "social-sciences-law",
    field: "challenges",
    title: "Respondent Hesitancy Regarding Sensitive Data",
    detail: "Community participants initially feared disclosure of personal details; resolved by thoroughly explaining the informed consent protocol and anonymization guarantees."
  },
  {
    id: "soc-learn-1",
    disciplineId: "social-sciences-law",
    field: "keyLearnings",
    title: "Human Rights Clearance Protocols (COSTECH)",
    detail: "Mastered ethical research protocols, the principle of non-maleficence, and formal citation hierarchy in Tanzanian legal jurisprudence."
  },

  // ==========================================
  // EDUCATION & PEDAGOGY
  // ==========================================
  {
    id: "edu-act-1",
    disciplineId: "education",
    field: "activities",
    title: "Lesson Plan Design & Competency-Based Instruction",
    detail: "Prepared weekly lesson plans aligned with Tanzania Institute of Education (TIE) competency-based syllabi and conducted secondary school classroom teaching sessions."
  },
  {
    id: "edu-act-2",
    disciplineId: "education",
    field: "activities",
    title: "Student Formative Assessment & Item Analysis",
    detail: "Drafted mid-term examination papers, developed criterion-referenced marking schemes, and analyzed pupil test scores according to Bloom's cognitive taxonomy levels."
  },
  {
    id: "edu-tools-1",
    disciplineId: "education",
    field: "toolsUsed",
    title: "Instructional Tools & Evaluation Media",
    detail: "TIE Curriculum Handbooks, Visual Aids & Science Kits, Microsoft Excel Grading Sheets, Google Classroom."
  },
  {
    id: "edu-chal-1",
    disciplineId: "education",
    field: "challenges",
    title: "Managing Large Classroom Ratios",
    detail: "High pupil-to-teacher ratio initially constrained individualized feedback; mitigated by organizing peer-led study circles and collaborative group tasks."
  },
  {
    id: "edu-learn-1",
    disciplineId: "education",
    field: "keyLearnings",
    title: "Classroom Psychology & Differentiated Learning",
    detail: "Developed actionable strategies for handling varied student learning paces and fostering constructive academic engagement."
  }
];

export function getCuratedSuggestions(
  disciplineId: string,
  field: "activities" | "toolsUsed" | "challenges" | "keyLearnings"
): PlacementSuggestionItem[] {
  const directMatches = CURATED_PLACEMENT_SUGGESTIONS.filter(
    (s) => s.disciplineId === disciplineId && s.field === field
  );
  if (directMatches.length > 0) return directMatches;

  // Fallback to computing-it if not found
  return CURATED_PLACEMENT_SUGGESTIONS.filter(
    (s) => s.disciplineId === "computing-it" && s.field === field
  );
}
