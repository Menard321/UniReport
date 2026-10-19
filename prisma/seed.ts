import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const universitiesData = [
  {
    id: "u_udsm",
    name: "University of Dar es Salaam",
    shortName: "UDSM",
    location: "Dar es Salaam, Tanzania",
    domain: "udsm.ac.tz",
    campuses: 4,
    programmesCount: 42,
    status: "VERIFIED" as const,
    reportTypes: ["Final Year Project (FYP)", "Field Training (IPT)", "Postgraduate Dissertation"]
  },
  {
    id: "u_udom",
    name: "University of Dodoma",
    shortName: "UDOM",
    location: "Dodoma, Tanzania",
    domain: "udom.ac.tz",
    campuses: 6,
    programmesCount: 38,
    status: "VERIFIED" as const,
    reportTypes: ["Final Year Project", "Industrial Attachment", "Masters Thesis"]
  },
  {
    id: "u_sua",
    name: "Sokoine University of Agriculture",
    shortName: "SUA",
    location: "Morogoro, Tanzania",
    domain: "sua.ac.tz",
    campuses: 3,
    programmesCount: 29,
    status: "VERIFIED" as const,
    reportTypes: ["Special Project", "Practical Training (PT)", "Dissertation"]
  },
  {
    id: "u_ardhi",
    name: "Ardhi University",
    shortName: "ARDHI",
    location: "Dar es Salaam, Tanzania",
    domain: "aru.ac.tz",
    campuses: 1,
    programmesCount: 18,
    status: "VERIFIED" as const,
    reportTypes: ["Final Year Dissertation", "Industrial Training (IT)"]
  },
  {
    id: "u_dit",
    name: "Dar es Salaam Institute of Technology",
    shortName: "DIT",
    location: "Dar es Salaam, Tanzania",
    domain: "dit.ac.tz",
    campuses: 2,
    programmesCount: 16,
    status: "VERIFIED" as const,
    reportTypes: ["Final Year Engineering Project", "Industrial Practical Training"]
  },
  {
    id: "u_cbe",
    name: "College of Business Education",
    shortName: "CBE",
    location: "Dar es Salaam & Dodoma",
    domain: "cbe.ac.tz",
    campuses: 4,
    programmesCount: 14,
    status: "VERIFIED" as const,
    reportTypes: ["Business Research Project", "Field Attachment"]
  },
  {
    id: "u_ifm",
    name: "Institute of Finance Management",
    shortName: "IFM",
    location: "Dar es Salaam, Tanzania",
    domain: "ifm.ac.tz",
    campuses: 2,
    programmesCount: 15,
    status: "VERIFIED" as const,
    reportTypes: ["Applied Research Project", "Field Practical Report"]
  },
  {
    id: "u_must",
    name: "Mbeya University of Science and Technology",
    shortName: "MUST",
    location: "Mbeya, Tanzania",
    domain: "must.ac.tz",
    campuses: 2,
    programmesCount: 22,
    status: "VERIFIED" as const,
    reportTypes: ["Final Year Engineering Project", "IPT Report"]
  },
  {
    id: "u_muhas",
    name: "Muhimbili University of Health and Allied Sciences",
    shortName: "MUHAS",
    location: "Dar es Salaam, Tanzania",
    domain: "muhas.ac.tz",
    campuses: 2,
    programmesCount: 24,
    status: "VERIFIED" as const,
    reportTypes: ["Clinical Research Dissertation", "Public Health Field Report"]
  },
  {
    id: "u_nit",
    name: "National Institute of Transport",
    shortName: "NIT",
    location: "Dar es Salaam, Tanzania",
    domain: "nit.ac.tz",
    campuses: 1,
    programmesCount: 12,
    status: "VERIFIED" as const,
    reportTypes: ["Logistics & Engineering Project", "Industrial Training"]
  },
  {
    id: "u_iaa",
    name: "Institute of Accountancy Arusha",
    shortName: "IAA",
    location: "Arusha, Tanzania",
    domain: "iaa.ac.tz",
    campuses: 2,
    programmesCount: 14,
    status: "VERIFIED" as const,
    reportTypes: ["Accounting Research Project", "Field Work Report"]
  },
  {
    id: "u_mzumbe",
    name: "Mzumbe University",
    shortName: "MU",
    location: "Morogoro, Tanzania",
    domain: "mzumbe.ac.tz",
    campuses: 3,
    programmesCount: 28,
    status: "VERIFIED" as const,
    reportTypes: ["Business Research Project", "Field Attachment", "Postgraduate Dissertation"]
  },
  {
    id: "u_out",
    name: "Open University of Tanzania",
    shortName: "OUT",
    location: "Dar es Salaam & Nationwide Centers",
    domain: "out.ac.tz",
    campuses: 30,
    programmesCount: 45,
    status: "VERIFIED" as const,
    reportTypes: ["Dissertation Proposal", "Fieldwork Report", "Final Year Research"]
  },
  {
    id: "u_suza",
    name: "State University of Zanzibar",
    shortName: "SUZA",
    location: "Tunguu, Zanzibar, Tanzania",
    domain: "suza.ac.tz",
    campuses: 4,
    programmesCount: 32,
    status: "VERIFIED" as const,
    reportTypes: ["Field Attachment Report", "Undergraduate Research Project", "Postgraduate Dissertation"]
  },
  {
    id: "u_tia",
    name: "Tanzania Institute of Accountancy",
    shortName: "TIA",
    location: "Dar es Salaam, Mbeya, Mwanza, Singida",
    domain: "tia.ac.tz",
    campuses: 6,
    programmesCount: 18,
    status: "VERIFIED" as const,
    reportTypes: ["Field Practical Training Report (IPT)", "Applied Research Project"]
  },
  {
    id: "u_saut",
    name: "St. Augustine University of Tanzania",
    shortName: "SAUT",
    location: "Mwanza, Tanzania",
    domain: "saut.ac.tz",
    campuses: 3,
    programmesCount: 30,
    status: "VERIFIED" as const,
    reportTypes: ["Fieldwork Attachment", "Research Project", "Dissertation"]
  },
  {
    id: "u_sjuit",
    name: "St. Joseph University in Tanzania",
    shortName: "SJUIT",
    location: "Dar es Salaam, Tanzania",
    domain: "sjuit.ac.tz",
    campuses: 2,
    programmesCount: 26,
    status: "VERIFIED" as const,
    reportTypes: ["Industrial Practical Training (IPT)", "Capstone Engineering Design", "FYP"]
  },
  {
    id: "u_tumaini",
    name: "Tumaini University Makumira",
    shortName: "TUMAINI",
    location: "Usa River, Arusha, Tanzania",
    domain: "makumira.ac.tz",
    campuses: 2,
    programmesCount: 20,
    status: "VERIFIED" as const,
    reportTypes: ["Field Attachment Report", "Legal Research Paper", "Postgraduate Dissertation"]
  },
  {
    id: "u_uaut",
    name: "United African University of Tanzania",
    shortName: "UAUT",
    location: "Kigamboni, Dar es Salaam, Tanzania",
    domain: "uaut.ac.tz",
    campuses: 1,
    programmesCount: 15,
    status: "VERIFIED" as const,
    reportTypes: ["Practical Training Report (IPT)", "Engineering Capstone Project", "Business Dissertation"]
  },
  {
    id: "u_hkmu",
    name: "Hubert Kairuki Memorial University",
    shortName: "HKMU",
    location: "Mikocheni, Dar es Salaam, Tanzania",
    domain: "hkmu.ac.tz",
    campuses: 1,
    programmesCount: 12,
    status: "VERIFIED" as const,
    reportTypes: ["Clinical Elective Report", "Medical Dissertation", "Public Health Research"]
  },
  {
    id: "u_kcmuco",
    name: "Kilimanjaro Christian Medical University College",
    shortName: "KCMUCo",
    location: "Moshi, Kilimanjaro, Tanzania",
    domain: "kcmuco.ac.tz",
    campuses: 1,
    programmesCount: 16,
    status: "VERIFIED" as const,
    reportTypes: ["Elective Clinical Report", "Medical Dissertation", "Biomedical Research"]
  },
  {
    id: "u_mocu",
    name: "Moshi Co-operative University",
    shortName: "MoCU",
    location: "Moshi, Kilimanjaro, Tanzania",
    domain: "mocu.ac.tz",
    campuses: 2,
    programmesCount: 24,
    status: "VERIFIED" as const,
    reportTypes: ["Field Practical Attachment", "Co-operative Research Project", "Postgraduate Dissertation"]
  }
];

async function main() {
  console.log("Seeding verified Tanzanian Universities into PostgreSQL...");

  for (const uni of universitiesData) {
    await prisma.university.upsert({
      where: { name: uni.name },
      update: {
        shortName: uni.shortName,
        location: uni.location,
        domain: uni.domain,
        campuses: uni.campuses,
        programmesCount: uni.programmesCount,
        status: uni.status,
        reportTypes: uni.reportTypes
      },
      create: {
        id: uni.id,
        name: uni.name,
        shortName: uni.shortName,
        location: uni.location,
        domain: uni.domain,
        campuses: uni.campuses,
        programmesCount: uni.programmesCount,
        status: uni.status,
        reportTypes: uni.reportTypes
      }
    });
  }

  // Ensure Admin User
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@unireport.tz" }
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("admin123", salt);
    await prisma.user.create({
      data: {
        email: "admin@unireport.tz",
        name: "System Administrator",
        passwordHash,
        role: "UNIREPORT_ADMIN",
        subscription: {
          create: {
            tier: "INSTITUTIONAL",
            projectsUsed: 0,
            aiTokensUsed: 0,
            storageUsedMb: 0
          }
        }
      }
    });
    console.log("Admin account created: admin@unireport.tz");
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
