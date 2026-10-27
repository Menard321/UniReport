import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { RequirementsResolver } from "@/lib/requirements/resolver";
import { getCuratedSuggestions } from "@/data/placement-suggestions";

function getDomainFallbackFromTitle(title: string, organization: string = "", department: string = "") {
  const t = (title || "").toLowerCase();
  
  // 1. Solar & Renewable Energy
  if (t.includes("solar") || t.includes("photovoltaic") || t.includes("pv") || t.includes("renewable") || t.includes("electrical") || t.includes("power")) {
    return {
      activities: `1. Conducted technical site surveys and solar resource assessment to determine optimal panel tilt angle, azimuth orientation, and shadow mitigation.\n2. Assisted in mechanical mounting and electrical string wiring of mono-crystalline solar PV modules, DC combiner boxes, and surge protection devices (SPDs).\n3. Performed DC/AC inverter commissioning, grid synchronization testing, and battery bank state-of-charge (SoC) calibration under supervisor directive.\n4. Executed routine preventive maintenance, including solar pyranometer irradiance cross-checks, thermographic hotspot inspections, and grounding resistance tests.`,
      toolsUsed: `Solar Irradiance Meter (Pyranometer), Digital Multimeter (Fluke 87V), DC/AC Clamp Meter, Insulation Resistance Tester (Megger), Solar Inverter Diagnostic Suite, PVsyst Software, AutoCAD Electrical, Torque Wrench, PPE Safety Harness`,
      challenges: `1. Unexpected grid voltage fluctuation causing inverter trip-outs during peak afternoon generation; mitigated by recalibrating upper/lower AC voltage threshold parameters and optimizing reactive power injection settings.\n2. High ambient temperature resulting in panel degradation and DC power drop; resolved by enhancing underside array ventilation clearances and performing regular panel surface washing.`,
      keyLearnings: `1. Deep operational understanding of grid-tied and hybrid photovoltaic balance-of-system (BOS) architecture and Tanzanian EWURA electrical codes.\n2. Hands-on proficiency in executing electrical fault diagnosis, inverter parameter configuration, and battery storage maintenance.\n3. Mastery of occupational health and safety (OHS) protocols for rooftop working at height and high-voltage DC safety.`
    };
  }

  // 2. Networking & Telecommunications
  if (t.includes("network") || t.includes("cisco") || t.includes("telecom") || t.includes("fiber") || t.includes("fibre") || t.includes("switch") || t.includes("router") || t.includes("lan") || t.includes("wan") || t.includes("routing")) {
    return {
      activities: `1. Configured Layer 2/3 managed Cisco switches, VLAN segmentation, and inter-VLAN trunking (802.1Q) to isolate operational departmental traffic.\n2. Terminated, labelled, and tested CAT6/CAT6A UTP network cables and performed optical fiber patch cord inspections using optical power meters.\n3. Deployed and monitored network intrusion prevention rules, access control lists (ACLs), and DHCP/DNS server reservations across enterprise subnets.\n4. Monitored network uptime and bandwidth utilization using SNMP network monitoring software and resolved user connectivity helpdesk tickets.`,
      toolsUsed: `Cisco Packet Tracer, Wireshark, Fluke Network Cable Tester, Optical Power Meter, PuTTY SSH Client, SolarWinds / PRTG Network Monitor, Crimping Tool, Punch-down Tool, Linux CLI`,
      challenges: `1. Network loop broadcast storms causing temporary departmental switch outages; resolved by enabling Rapid Spanning Tree Protocol (RSTP) and configuring port-security on edge access ports.\n2. Intermittent optical fiber packet loss over inter-building links; mitigated by identifying dirty connectors using a fiber inspection probe and performing specialized optical connector cleaning.`,
      keyLearnings: `1. Mastery of practical enterprise TCP/IP subnetting, routing protocols (OSPF), and access-layer switch hardening.\n2. Hands-on experience in structured network cabling, rack patch panel management, and industry cabling standards (TIA/EIA-568).\n3. Effective diagnostic methodologies for isolating physical layer vs transport layer network connectivity faults.`
    };
  }

  // 3. Accounting, Finance & Audit
  if (t.includes("account") || t.includes("audit") || t.includes("finance") || t.includes("tax") || t.includes("bank") || t.includes("bookkeep") || t.includes("revenue") || t.includes("ledger") || t.includes("payroll")) {
    return {
      activities: `1. Prepared daily journal entries, posted transactional payment vouchers to General Ledger accounts, and performed weekly bank reconciliation statements.\n2. Verified supplier invoices, matching Purchase Orders against Good Received Notes (3-Way Matching), and prepared accounts payable aging schedules.\n3. Assisted in computing Value Added Tax (VAT) returns, Withholding Tax schedules, and processing payroll statutory deductions (PAYE, NSSF, WCF) via Tanzania Revenue Authority (TRA) portals.\n4. Audited petty cash disbursements, examined supporting physical receipts, and generated monthly trial balances for senior management review.`,
      toolsUsed: `Tally ERP 9 / Prime, SAP ERP Financials, Microsoft Excel (VLOOKUP, Pivot Tables), QuickBooks, TRA EFDMS Portal, Bank Reconciliation Software, Electronic Invoicing Machine`,
      challenges: `1. Unreconciled bank discrepancies caused by timing delays in direct electronic fund transfers; resolved by establishing a structured reconciliation clearing account.\n2. Incomplete tax compliance documentation on casual labor receipts; mitigated by enforcing strict procurement policy guidelines prior to disbursement approvals.`,
      keyLearnings: `1. Solid competence in Tanzanian statutory tax compliance regulations (TRA Tax Administration Act) and National Board of Accountants and Auditors (NBAA) standards.\n2. Advanced financial modeling and data validation skills using enterprise accounting software and Excel.\n3. Appreciation of internal control procedures, segregation of accounting duties, and fiduciary ethics.`
    };
  }

  // 4. Civil Engineering & Construction
  if (t.includes("civil") || t.includes("construction") || t.includes("building") || t.includes("structure") || t.includes("road") || t.includes("highway") || t.includes("survey") || t.includes("concrete") || t.includes("bridge") || t.includes("site engineer")) {
    return {
      activities: `1. Assisted senior site engineers in setting out structural gridlines, column axes, and foundation elevations using Total Station and auto levels.\n2. Supervised on-site concrete casting operations, verified reinforcement bar (rebar) sizing and spacing against structural drawings, and recorded slump test measurements.\n3. Prepared concrete cube test specimens, measured 7-day and 28-day compressive crushing strength in the laboratory, and compiled compliance test logs.\n4. Monitored daily site material receipts, inspected aggregate gradation, and drafted daily site clerk progress summary reports.`,
      toolsUsed: `Total Station (Topcon / Leica), Automatic Level, Concrete Slump Cone, Compressive Testing Machine, Rebar Calipers, Steel Measuring Tape, AutoCAD Civil 3D, Safety Helmet & High-Vis Vest`,
      challenges: `1. Excessive concrete slump loss during hot weather batching; mitigated by adjusting retarder chemical admixture dosages and expediting concrete placement.\n2. Discrepancies between structural drawings and architectural column dimensions; resolved by notifying the consultant engineer and issuing official Request for Information (RFI) revisions.`,
      keyLearnings: `1. Thorough understanding of Tanzanian Ministry of Works building codes, British Standards (BS), and structural quality assurance checklists.\n2. Practical skills in surveying instrument operation, rebar schedule verification, and concrete durability quality control.\n3. Awareness of occupational safety regulations on active construction sites and contractor team supervision.`
    };
  }

  // 5. Agriculture, Food Science & Agronomy
  if (t.includes("agro") || t.includes("agri") || t.includes("food") || t.includes("crop") || t.includes("farm") || t.includes("livestock") || t.includes("veterinary") || t.includes("soil") || t.includes("horticulture") || t.includes("agronomy")) {
    return {
      activities: `1. Conducted soil chemical and physical sampling, measuring soil pH, electrical conductivity, and nitrogen-phosphorus-potassium (NPK) macronutrient levels.\n2. Supervised agronomic field operations, including drip irrigation calibration, seedbed preparation, and integrated pest management (IPM) scouting.\n3. Monitored post-harvest handling, grain moisture content verification, and cold storage temperature/humidity log verification.\n4. Assessed raw agricultural produce for grading quality standards and compiled harvest yield statistical summaries.`,
      toolsUsed: `Soil pH Meter, Digital Grain Moisture Tester, Refractometer, Handheld GPS Receiver, Drip Irrigation Pressure Gauge, Laboratory Microscope, Spraying Equipment, Analytical Balance`,
      challenges: `1. Sudden infestation of fall armyworm across test crop blocks; mitigated by implementing targeted biological pest control and early morning bio-pesticide spraying.\n2. High moisture content in harvested produce risking fungal mycotoxin growth; resolved by optimizing solar drying tables and adjusting mechanical drying ventilation.`,
      keyLearnings: `1. Mastery of climate-smart agricultural techniques, precision irrigation management, and post-harvest preservation principles.\n2. Hands-on experience in agricultural laboratory diagnostics, soil fertility testing, and GAP (Good Agricultural Practices) compliance.\n3. Practical skills in agribusiness farm recordkeeping, crop yield estimation, and farmer outreach.`
    };
  }

  // 6. Mechanical & Automotive Engineering
  if (t.includes("mechanic") || t.includes("automotive") || t.includes("engine") || t.includes("hvac") || t.includes("workshop") || t.includes("fabrication") || t.includes("machin") || t.includes("pump")) {
    return {
      activities: `1. Performed scheduled diagnostic disassemblies, preventative lubrications, and tolerance checks on industrial pump assemblies and internal combustion engines.\n2. Calibrated hydraulic and pneumatic pressure relief valves, replaced worn seals, and monitored vibration harmonics across drive shafts.\n3. Operated metal turning lathes, milling apparatus, and MIG/TIG welding equipment to fabricate replacement brackets and structural mounts.\n4. Documented equipment mean time between failures (MTBF), performed root-cause failure analysis (RCFA), and maintained preventive maintenance logs.`,
      toolsUsed: `Vernier Calipers, Micrometer Screw Gauge, Dial Bore Indicator, Torque Wrench, Hydraulic Pressure Test Kit, Vibration Analyzer, Lathe Machine, Welding Rig (MIG/TIG), PPE Safety Gear`,
      challenges: `1. Excessive bearing overheating and vibration under continuous dynamic load; mitigated by executing precision shaft realignment and replacing standard grease with high-viscosity synthetic lubricant.\n2. Component wear due to particulate contamination; resolved by overhauling filtration housings and establishing strict scheduled fluid flush intervals.`,
      keyLearnings: `1. Hands-on competence in mechanical fault diagnosis, precision tolerances, and industrial rotating machinery maintenance.\n2. Deep appreciation of hydraulic/pneumatic circuit operation and industrial occupational health & safety compliance.\n3. Practical skills in metalworking fabrication, reading engineering blueprints, and preventive maintenance scheduling.`
    };
  }

  // 7. FinTech, Cryptocurrency, Blockchain & Digital Payment Gateways
  if (
    t.includes("crypto") ||
    t.includes("cypto") ||
    t.includes("blockchain") ||
    t.includes("bitcoin") ||
    t.includes("ethereum") ||
    t.includes("token") ||
    t.includes("wallet") ||
    t.includes("checkout") ||
    t.includes("payment") ||
    t.includes("fintech") ||
    t.includes("gateway") ||
    t.includes("digital asset") ||
    t.includes("multi-asset") ||
    t.includes("mpesa") ||
    t.includes("mobile money")
  ) {
    const orgLabel = organization ? `${organization} ` : "";
    return {
      activities: `1. Designed and implemented modular RESTful API endpoints and OpenAPI specifications for the ${orgLabel}digital checkout gateway, supporting multi-cryptocurrency deposits (Bitcoin, Ethereum, USDT-TRC20/ERC20) alongside national mobile money rails.\n2. Engineered dynamic cryptographic invoice generation logic with real-time exchange rate calculation, implementing slippage protection mechanisms and a 15-minute price-freeze lock window against Tanzanian Shillings (TZS).\n3. Built and deployed an event-driven webhook listener service with cryptographic HMAC-SHA256 signature verification and Redis-backed idempotency filters to monitor blockchain block confirmations and prevent double-spending attacks.\n4. Developed responsive frontend checkout components using modern web frameworks, displaying dynamic BIP-21 QR codes, real-time payment countdown timers, and WebSocket listeners for instant transaction confirmation.\n5. Structured PostgreSQL relational database schemas with strict ACID transaction boundaries to maintain immutable transaction ledgers, merchant settlement records, and audit logs compliant with Bank of Tanzania (BOT) regulations.`,
      toolsUsed: `Visual Studio Code, Node.js & TypeScript, PostgreSQL, Redis, Postman API Platform, Web3.js / Ethers.js, Git & GitHub, Docker, Linux CLI, Tailwind CSS & React, HMAC-SHA256 Encryption Suite`,
      challenges: `1. High cryptocurrency market price volatility causing discrepancies between checkout invoice totals and received on-chain funds; mitigated by implementing a 15-minute price-freeze rate lock window with automated micro-tolerance thresholds and underpayment reconciliation routines.\n2. Blockchain network confirmation latency conflicting with merchant instant checkout expectations; resolved by establishing optimistic zero-confirmation mempool monitoring for low-value transactions while enforcing 2-block confirmation thresholds for high-value orders with real-time WebSocket client notifications.\n3. Security vulnerabilities from webhook replay attacks and fraudulent transaction receipts; mitigated by enforcing cryptographic HMAC-SHA256 signature validation and caching nonce/transaction hashes in Redis with TTL expiration.`,
      keyLearnings: `1. Mastery of asynchronous, event-driven payment gateway architecture, Web3 blockchain RPC interaction, and cryptographic transaction verification.\n2. Hands-on competence in database transaction isolation (ACID), high-frequency Redis exchange rate caching, and idempotent webhook processing.\n3. Thorough understanding of digital financial compliance, PCI-DSS security standards, Bank of Tanzania (BOT) National Payment System regulations, and the Tanzania Personal Data Protection Act (PDPA 2022).`
    };
  }

  // 8. Software, Web, Database & IT
  if (t.includes("software") || t.includes("web") || t.includes("mobile") || t.includes("api") || t.includes("database") || t.includes("sql") || /\bit\b/.test(t) || t.includes("information technology") || t.includes("frontend") || t.includes("backend") || t.includes("fullstack") || t.includes("develop") || t.includes("comput") || t.includes("coding") || t.includes("programming") || t.includes("integration") || t.includes("system") || t.includes("digital") || t.includes("interface") || t.includes("data")) {
    return {
      activities: `1. Analyzed system specifications, drafted relational entity-relationship diagrams (ERDs), and implemented database schema migrations in PostgreSQL/MySQL.\n2. Developed modular RESTful API endpoints, validated request payloads, and handled business logic integration with third-party web services.\n3. Built responsive frontend user interface components adhering to clean UI/UX standards, modern CSS layouts, and mobile-friendly breakpoints.\n4. Conducted unit and integration testing, investigated software bug reports, and managed version control branching workflows using Git.`,
      toolsUsed: `Visual Studio Code, Git & GitHub, PostgreSQL / MySQL, Postman API Platform, Node.js / Python, Docker, Linux Terminal, pgAdmin, Swagger / OpenAPI, Figma`,
      challenges: `1. API latency spikes and timeout bottlenecks during concurrent database queries; mitigated by indexing foreign key columns and optimizing SQL queries with EXPLAIN ANALYZE.\n2. Cross-browser layout discrepancies and asynchronous state synchronization bugs; resolved by enforcing standardized responsive units and implementing robust state management.`,
      keyLearnings: `1. Practical mastery of the complete software development lifecycle (SDLC), from requirements gathering to production deployment.\n2. Hands-on competence in database normalization, REST API architectural principles, and defensive programming standards.\n3. Experience working within an agile software team, code review protocols, and industry version control hygiene.`
    };
  }

  // Universal Fallback based on provided title
  const cleanTitle = (title || "Industrial Practical Training").trim();
  return {
    activities: `1. Conducted technical analysis and operational workflow assessments directly aligned with "${cleanTitle}".\n2. Implemented standardized operating procedures (SOPs), prepared test benchmarks, and assisted senior technical officers in routine maintenance.\n3. Executed diagnostic evaluations, collected empirical operational datasets, and analyzed performance metrics for ${organization || "the host organization"}.\n4. Compiled detailed daily technical log records, verified quality assurance criteria, and participated in departmental progress briefings.`,
    toolsUsed: `Industry Standard Diagnostic Instruments, Analytical Software Suite, Microsoft Excel & Word, Calibration Equipment, Measurement Gauges, Safety Gear (PPE), Specialized Department Toolsets`,
    challenges: `1. Technical parameter deviations and equipment calibration variances during operational load; mitigated by executing systematic recalibration protocols under supervisor guidance.\n2. Limited historical documentation for legacy equipment; resolved by cross-referencing technical operational manuals and compiling structured maintenance logs.`,
    keyLearnings: `1. Comprehensive understanding of theoretical curriculum application within authentic Tanzanian industrial and institutional settings.\n2. Practical development of diagnostic technical competencies, equipment safety standards, and operational troubleshooting.\n3. Professional enhancement in workplace ethics, time management, technical reporting, and cross-functional collaboration.`
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      programmeId = "",
      reportTitle = "",
      organization = "",
      department = "",
      duration = "",
      field = "activities",
      roughNotes = "",
      mode = "suggest" // "suggest" | "rewrite" | "all_from_title"
    } = body;

    // 1. COMPREHENSIVE SUGGESTIONS FOR ALL 4 FIELDS BASED STRICTLY ON REPORT TITLE
    if (mode === "all_from_title" || body.allFields === true) {
      const targetTitle = (reportTitle || "").trim();

      if (!targetTitle) {
        return NextResponse.json(
          { error: "Report Title is required to generate tailored suggestions." },
          { status: 400 }
        );
      }

      try {
        const prompt = `You are an expert Tanzanian university industrial practical training (IPT) supervisor and academic coordinator.
The student has provided the official title of their Field Practical Training / Attachment Report:
REPORT TITLE: "${targetTitle}"

Context:
Host Organization: ${organization || "Host Organization"}
Department: ${department || "Technical Department"}
Discipline Programme: ${programmeId || "University Degree"}

TASK:
Based SOLELY and SPECIFICALLY on the REPORT TITLE provided, generate a defense-ready, professional draft covering ALL 4 essential attachment sections:
1. Activities & Tasks Performed
2. Tools, Equipment & Software Used
3. Challenges Encountered (with real-world engineering/operational mitigations)
4. Key Learnings & Competencies Acquired

The output must directly reflect the technical domain, operations, standards, and challenges implied by the report title. Do NOT give generic or irrelevant suggestions.

Return strictly a valid JSON object with exactly these 4 keys (do NOT include markdown code blocks or conversational text, just valid JSON):
{
  "activities": "A numbered list (1 to 4) of specific, detailed operational duties and technical tasks performed by the student that directly relate to '${targetTitle}'. Each task must describe real procedures, maintenance, testing, configurations, or analyses with academic precision.",
  "toolsUsed": "A comma-separated list of 6 to 10 specific industry tools, measurement instruments, software packages, frameworks, hardware devices, or standards utilized for '${targetTitle}'.",
  "challenges": "A numbered list (1 to 2) of realistic operational or technical challenges encountered while working on '${targetTitle}', each paired with a professional, practical mitigation/solution implemented.",
  "keyLearnings": "A numbered list (1 to 3) of concrete technical competencies, curriculum synthesis, and industrial best practices acquired from '${targetTitle}'."
}`;

        const { text } = await generateText({
          model: google("gemini-1.5-flash"),
          system: "You are an expert Tanzanian university internship coordinator and engineering supervisor. Generate realistic, professional placement duties strictly tailored to the student's report title. Output valid JSON only.",
          prompt,
          temperature: 0.35,
        });

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.activities && parsed.toolsUsed && parsed.challenges && parsed.keyLearnings) {
            return NextResponse.json({
              success: true,
              mode: "all_from_title",
              reportTitle: targetTitle,
              data: {
                activities: parsed.activities.trim(),
                toolsUsed: parsed.toolsUsed.trim(),
                challenges: parsed.challenges.trim(),
                keyLearnings: parsed.keyLearnings.trim()
              }
            });
          }
        }
      } catch (aiErr) {
        console.warn("[PLACEMENT_SUGGESTION_AI_FAIL_ALL_FROM_TITLE]", aiErr);
      }

      // Domain-tailored fallback matching the title keywords
      const fallbackData = getDomainFallbackFromTitle(targetTitle, organization, department);
      return NextResponse.json({
        success: true,
        mode: "all_from_title",
        reportTitle: targetTitle,
        data: fallbackData,
        isFallback: true
      });
    }

    // 2. Resolve discipline directives for single-field operations
    const discipline = RequirementsResolver.resolveDisciplineDirectives(programmeId);
    const validField = ["activities", "toolsUsed", "challenges", "keyLearnings"].includes(field)
      ? (field as "activities" | "toolsUsed" | "challenges" | "keyLearnings")
      : "activities";

    // MODE A: REWRITE ROUGH NOTES
    if (mode === "rewrite" && roughNotes && roughNotes.trim().length > 3) {
      try {
        const rewritePrompt = `You are a university academic supervisor evaluating an Industrial Practical Training / Field Attachment report in Tanzania.
Student Discipline: ${discipline.disciplineId}
Host Enterprise: ${organization || "Host Organization"}
Department: ${department || "Technical Department"}
Field Type: ${validField}

The student wrote these rough informal notes:
"""${roughNotes}"""

Rewrite these rough notes into professional, defense-ready academic prose adhering to official TCU / institutional standards.
Rules:
- Preserve the authentic facts, duties, and tools mentioned by the student.
- Elevate vocabulary to rigorous engineering, clinical, business, or academic nomenclature.
- Return ONLY the rewritten text without conversational commentary or greetings.`;

        const { text } = await generateText({
          model: google("gemini-1.5-flash"),
          system: "You are an expert Tanzanian academic supervisor. Elevate student placement notes into formal academic prose.",
          prompt: rewritePrompt,
          temperature: 0.25,
        });

        return NextResponse.json({
          success: true,
          mode: "rewrite",
          discipline: discipline.disciplineId,
          rewrittenText: text.trim(),
        });
      } catch (aiErr) {
        console.warn("[PLACEMENT_SUGGESTION_AI_FAIL_REWRITE]", aiErr);
        return NextResponse.json({
          success: true,
          mode: "rewrite",
          discipline: discipline.disciplineId,
          rewrittenText: roughNotes.trim(),
        });
      }
    }

    // MODE B: SUGGEST DRAFTS FOR SINGLE FIELD
    const curatedItems = getCuratedSuggestions(discipline.disciplineId, validField);
    let aiItems: Array<{ id: string; title: string; detail: string; source: "ai" }> = [];

    if (reportTitle || organization || department) {
      try {
        const suggestionPrompt = `Generate 3 distinct, authentic academic suggestions for a student's Field Attachment / Practical Training report in Tanzania.
Report Title: ${reportTitle || "Field Practical Training Report"}
Discipline: ${discipline.disciplineId}
Host Firm: ${organization || "Industrial Placement Firm"}
Department: ${department || "Operational Department"}
Duration: ${duration || "8 Weeks"}
Section to populate: ${validField}

Output strictly valid JSON array of 3 objects with keys "title" and "detail".
Example format:
[
  { "title": "Short descriptive title", "detail": "Detailed 1-2 sentence description of duty, instrument, challenge, or learning." }
]`;

        const { text } = await generateText({
          model: google("gemini-1.5-flash"),
          system: "You are an expert Tanzanian university internship coordinator. Generate realistic placement duties strictly matching the report title.",
          prompt: suggestionPrompt,
          temperature: 0.3,
        });

        const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) {
            aiItems = parsed.map((item, idx) => ({
              id: `ai-${validField}-${idx + 1}`,
              title: item.title || `Suggestion ${idx + 1}`,
              detail: item.detail || "",
              source: "ai" as const,
            }));
          }
        }
      } catch (aiErr) {
        console.warn("[PLACEMENT_SUGGESTION_AI_OPTIONAL_FAIL]", aiErr);
      }
    }

    const suggestions = [
      ...aiItems,
      ...curatedItems.map((c) => ({
        id: c.id,
        title: c.title,
        detail: c.detail,
        source: "curated" as const,
      })),
    ];

    return NextResponse.json({
      success: true,
      discipline: discipline.disciplineId,
      field: validField,
      suggestions,
    });
  } catch (error) {
    console.error("[PLACEMENT_SUGGESTION_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
