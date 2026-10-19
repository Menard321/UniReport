import { db } from "@/lib/db";
import catalogUniversities from "@/data/catalog.json";

export interface UniversityItem {
  id: string;
  name: string;
  shortName: string;
  slug?: string;
  logoUrl?: string;
  hasVerifiedTemplate?: boolean;
  templateCount?: number;
}

export interface ReportTypeItem {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface TemplateSectionItem {
  id: string;
  title: string;
  description?: string;
  order: number;
  is_required: boolean;
}

export interface ResolvedTemplateData {
  template_id: string;
  template_name: string;
  template_code: string;
  status: string;
  version: {
    id: string;
    version_number: string;
    file_format: string;
    file_size?: number;
    checksum?: string;
  };
  university: {
    id: string;
    name: string;
    short_name: string;
  };
  report_type: {
    id: string;
    name: string;
    code: string;
  };
  sections: TemplateSectionItem[];
  formatting_rules: Record<string, any>;
}

export class UniversityTemplateService {
  /**
   * Fetch all universities registered in the platform, enriched with template status
   */
  static async getUniversities(): Promise<UniversityItem[]> {
    try {
      // Query PostgreSQL unireporttz database
      const rows: any[] = await db.$queryRaw`
        SELECT 
          u.id, 
          u.name, 
          u.short_name as "shortName", 
          u.slug, 
          u.logo_path as "logoUrl",
          COUNT(t.id)::int as "templateCount",
          COUNT(CASE WHEN t.status IN ('published', 'verified') THEN 1 END)::int as "verifiedCount"
        FROM universities u
        LEFT JOIN templates t ON t.university_id = u.id
        WHERE u.is_active = true
        GROUP BY u.id, u.name, u.short_name, u.slug, u.logo_path
        ORDER BY u.name ASC
      `;

      if (rows && rows.length > 0) {
        return rows.map((r) => {
          // Cross-reference logo from catalog if logoUrl is empty or local
          const catalogMatch = catalogUniversities.find(
            (c) => c.shortName.toLowerCase() === (r.shortName || "").toLowerCase()
          );
          return {
            id: r.id,
            name: r.name,
            shortName: r.shortName,
            slug: r.slug,
            logoUrl: catalogMatch?.logoUrl || r.logoUrl || `/logos/${r.shortName}.jpeg`,
            hasVerifiedTemplate: (r.verifiedCount || 0) > 0,
            templateCount: r.templateCount || 0,
          };
        });
      }
    } catch (err) {
      console.warn("[UniversityTemplateService] Database query fallback:", err);
    }

    // Fallback to static catalog if DB is momentarily unreachable
    return catalogUniversities.map((c) => ({
      id: c.id,
      name: c.name,
      shortName: c.shortName,
      logoUrl: c.logoUrl,
      hasVerifiedTemplate: ["UDSM", "IFM", "CBE", "ARU", "NIT", "OUT"].includes(c.shortName),
      templateCount: ["UDSM", "IFM", "CBE", "ARU", "NIT", "OUT"].includes(c.shortName) ? 1 : 0,
    }));
  }

  /**
   * Fetch available report types
   */
  static async getReportTypes(): Promise<ReportTypeItem[]> {
    try {
      const rows: any[] = await db.$queryRaw`
        SELECT id, name, code, description
        FROM report_types
        WHERE is_active = true
        ORDER BY name ASC
      `;
      if (rows && rows.length > 0) {
        return rows;
      }
    } catch (err) {
      console.warn("[UniversityTemplateService] Report types fallback:", err);
    }

    return [
      {
        id: "fieldwork",
        name: "Field Practical Training Report (IPT)",
        code: "FIELDWORK",
        description: "Industrial training, internship, and field attachment report.",
      },
      {
        id: "fyp",
        name: "Final Year Project (FYP)",
        code: "FYP",
        description: "Undergraduate capstone design or research project report.",
      },
      {
        id: "dissertation",
        name: "Postgraduate Dissertation Proposal",
        code: "DISSERTATION",
        description: "Master or PhD research dissertation proposal and thesis.",
      },
    ];
  }

  /**
   * Dynamically resolve university template structure, sections, and formatting rules
   */
  static async resolveTemplate(
    universityIdOrShortName: string,
    reportTypeCode: string = "FIELDWORK"
  ): Promise<ResolvedTemplateData | null> {
    try {
      // 1. Resolve university ID
      const uniRows: any[] = await db.$queryRaw`
        SELECT id, name, short_name
        FROM universities
        WHERE id::text = ${universityIdOrShortName}
           OR UPPER(short_name) = UPPER(${universityIdOrShortName})
           OR LOWER(name) LIKE ${`%${universityIdOrShortName.toLowerCase()}%`}
        LIMIT 1
      `;

      let targetUni = uniRows[0];
      if (!targetUni) {
        // Fallback: look for National / Open University
        const fallbackUni: any[] = await db.$queryRaw`
          SELECT id, name, short_name
          FROM universities
          WHERE UPPER(short_name) = 'OUT' OR LOWER(name) LIKE '%national%'
          LIMIT 1
        `;
        targetUni = fallbackUni[0];
      }

      if (!targetUni) return null;

      // 2. Resolve report type
      const rtRows: any[] = await db.$queryRaw`
        SELECT id, name, code
        FROM report_types
        WHERE UPPER(code) = UPPER(${reportTypeCode})
           OR id::text = ${reportTypeCode}
        LIMIT 1
      `;
      const targetRt = rtRows[0];

      // 3. Find template for this university & report type
      let templateRows: any[] = [];
      if (targetRt) {
        templateRows = await db.$queryRaw`
          SELECT id, name, code, status
          FROM templates
          WHERE university_id = ${targetUni.id}::uuid
            AND report_type_id = ${targetRt.id}::uuid
          ORDER BY CASE WHEN status = 'published' THEN 1 WHEN status = 'verified' THEN 2 ELSE 3 END
          LIMIT 1
        `;
      }

      // If no institution-specific template, fallback to OUT / General
      if (templateRows.length === 0) {
        templateRows = await db.$queryRaw`
          SELECT t.id, t.name, t.code, t.status, u.id as uni_id, u.name as uni_name, u.short_name as uni_short_name
          FROM templates t
          JOIN universities u ON u.id = t.university_id
          WHERE (u.short_name = 'OUT' OR u.name LIKE '%National%')
          LIMIT 1
        `;
      }

      const template = templateRows[0];
      if (!template) return null;

      // 4. Find latest published/verified template version
      const versionRows: any[] = await db.$queryRaw`
        SELECT id, version_number, file_format, file_size, checksum
        FROM template_versions
        WHERE template_id = ${template.id}::uuid
        ORDER BY CASE WHEN status = 'published' THEN 1 ELSE 2 END, created_at DESC
        LIMIT 1
      `;
      const version = versionRows[0];
      if (!version) return null;

      // 5. Retrieve template sections
      const sections: any[] = await db.$queryRaw`
        SELECT id, title, description, "order", is_required
        FROM template_sections
        WHERE template_version_id = ${version.id}::uuid
        ORDER BY "order" ASC
      `;

      // 6. Retrieve formatting rules
      const rulesRows: any[] = await db.$queryRaw`
        SELECT rules
        FROM formatting_rules
        WHERE template_version_id = ${version.id}::uuid
        LIMIT 1
      `;

      let formattingRules = {};
      if (rulesRows[0] && rulesRows[0].rules) {
        formattingRules = typeof rulesRows[0].rules === "string" 
          ? JSON.parse(rulesRows[0].rules) 
          : rulesRows[0].rules;
      }

      return {
        template_id: template.id,
        template_name: template.name,
        template_code: template.code,
        status: template.status,
        version: {
          id: version.id,
          version_number: version.version_number,
          file_format: version.file_format,
          file_size: version.file_size,
          checksum: version.checksum,
        },
        university: {
          id: targetUni.id,
          name: targetUni.name,
          short_name: targetUni.short_name,
        },
        report_type: {
          id: targetRt ? targetRt.id : "fieldwork",
          name: targetRt ? targetRt.name : "Field Practical Training Report (IPT)",
          code: targetRt ? targetRt.code : "FIELDWORK",
        },
        sections: sections.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          order: s.order,
          is_required: s.is_required,
        })),
        formatting_rules: formattingRules,
      };
    } catch (err) {
      console.error("[UniversityTemplateService] Error resolving template:", err);
      return null;
    }
  }
}
