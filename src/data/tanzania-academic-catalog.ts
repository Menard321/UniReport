export interface CourseItem {
  id: string;
  name: string;
  code?: string;
  level?: "BACHELOR" | "DIPLOMA" | "MASTER" | "CERTIFICATE";
}

export interface CollegeItem {
  id: string;
  name: string;
  shortName: string;
  courses: CourseItem[];
}

export type InstitutionType = "UNIVERSITY" | "INSTITUTE" | "COLLEGE";

export interface UniversityCatalogItem {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  logoUrl: string;
  /** True only when an official institutional template has been verified and is bundled. */
  hasOfficialTemplate: boolean;
  templateFileName?: string;
  type: InstitutionType;
  /** Display location, e.g. "Dar es Salaam, Tanzania". */
  location: string;
  /** Region used for search and filtering. */
  region: string;
  domain: string;
  campuses: number;
  /** Report formats this institution commonly requires. */
  reportTypes: string[];
  colleges: CollegeItem[];
}

export const TANZANIA_ACADEMIC_CATALOG: UniversityCatalogItem[] = [
  {
    id: "udsm",
    name: "University of Dar es Salaam",
    shortName: "UDSM",
    slug: "udsm",
    logoUrl: "/logos/UDSM.jpeg",
    type: "UNIVERSITY",
    location: "Dar es Salaam, Tanzania",
    region: "Dar es Salaam",
    domain: "udsm.ac.tz",
    campuses: 4,
    reportTypes: ["Final Year Project (FYP)", "Field Training (IPT)", "Postgraduate Dissertation"],
    hasOfficialTemplate: true,
    templateFileName: "UDSM.docx",
    colleges: [
      {
        id: "coaf",
        name: "College of Agricultural Sciences and Fisheries Technology",
        shortName: "CoAF",
        courses: [
          { id: "coaf-aquatic", name: "BSc in Aquatic Sciences and Fisheries" },
          { id: "coaf-agric-econ", name: "BSc in Agricultural and Natural Resources Economics" },
          { id: "coaf-food-sci", name: "BSc in Food Science and Technology" },
          { id: "coaf-beekeeping", name: "BSc in Beekeeping Science and Technology" },
          { id: "coaf-agric-eng", name: "BSc in Agricultural Engineering" },
          { id: "coaf-fisheries", name: "BSc in Fisheries and Aquaculture" }
        ]
      },
      {
        id: "coict",
        name: "College of Information and Communication Technologies",
        shortName: "CoICT",
        courses: [
          { id: "coict-cs", name: "BSc in Computer Science" },
          { id: "coict-bit", name: "BSc in Business Information Technology" },
          { id: "coict-ceit", name: "BSc in Computer Engineering and Information Technology" },
          { id: "coict-telecom", name: "BSc in Telecommunications Engineering" },
          { id: "coict-elec", name: "BSc in Electronic Science and Communication" }
        ]
      },
      {
        id: "coet",
        name: "College of Engineering and Technology",
        shortName: "CoET",
        courses: [
          { id: "coet-civil", name: "BSc in Civil Engineering" },
          { id: "coet-mech", name: "BSc in Mechanical Engineering" },
          { id: "coet-elec", name: "BSc in Electrical Engineering" },
          { id: "coet-chem", name: "BSc in Chemical and Process Engineering" },
          { id: "coet-mining", name: "BSc in Mining Engineering" },
          { id: "coet-textile", name: "BSc in Textile Engineering" },
          { id: "coet-arch", name: "BSc in Architecture" },
          { id: "coet-geomatics", name: "BSc in Geomatics" }
        ]
      },
      {
        id: "conas",
        name: "College of Natural and Applied Sciences",
        shortName: "CoNAS",
        courses: [
          { id: "conas-chem", name: "BSc in Chemistry" },
          { id: "conas-phys", name: "BSc in Physics" },
          { id: "conas-math", name: "BSc in Mathematics" },
          { id: "conas-biochem", name: "BSc in Molecular Biology and Biotechnology" },
          { id: "conas-microbio", name: "BSc in Microbiology" },
          { id: "conas-actuarial", name: "BSc in Actuarial Sciences" },
          { id: "conas-geology", name: "BSc in Applied Geology" }
        ]
      },
      {
        id: "udbs",
        name: "University of Dar es Salaam Business School",
        shortName: "UDBS",
        courses: [
          { id: "udbs-bcom-acc", name: "Bachelor of Commerce in Accounting" },
          { id: "udbs-bcom-fin", name: "Bachelor of Commerce in Finance" },
          { id: "udbs-bcom-mkt", name: "Bachelor of Commerce in Marketing" },
          { id: "udbs-bcom-hrm", name: "Bachelor of Commerce in Human Resource Management" },
          { id: "udbs-bba", name: "Bachelor of Business Administration" }
        ]
      },
      {
        id: "udsl",
        name: "University of Dar es Salaam School of Law",
        shortName: "UDSL",
        courses: [
          { id: "udsl-llb", name: "Bachelor of Laws (LL.B)" }
        ]
      },
      {
        id: "soed",
        name: "School of Education",
        shortName: "SoED",
        courses: [
          { id: "soed-bed-arts", name: "Bachelor of Education in Arts" },
          { id: "soed-bed-sci", name: "Bachelor of Education in Science" },
          { id: "soed-bed-comm", name: "Bachelor of Education in Commerce" },
          { id: "soed-bed-psy", name: "Bachelor of Education in Psychology" }
        ]
      },
      {
        id: "coss",
        name: "College of Social Sciences",
        shortName: "CoSS",
        courses: [
          { id: "coss-econ", name: "Bachelor of Arts in Economics" },
          { id: "coss-pspa", name: "Bachelor of Arts in Political Science and Public Administration" },
          { id: "coss-sociology", name: "Bachelor of Arts in Sociology" },
          { id: "coss-stats", name: "Bachelor of Arts in Statistics" }
        ]
      },
      {
        id: "cohu",
        name: "College of Humanities",
        shortName: "CoHU",
        courses: [
          { id: "cohu-history", name: "Bachelor of Arts in History" },
          { id: "cohu-lit", name: "Bachelor of Arts in Literature" },
          { id: "cohu-kiswahili", name: "Bachelor of Arts in Kiswahili" },
          { id: "cohu-archaeology", name: "Bachelor of Arts in Archaeology and Heritage Management" }
        ]
      },
      {
        id: "sjmc",
        name: "School of Journalism and Mass Communication",
        shortName: "SJMC",
        courses: [
          { id: "sjmc-journalism", name: "Bachelor of Arts in Journalism" },
          { id: "sjmc-masscomm", name: "Bachelor of Arts in Mass Communication" },
          { id: "sjmc-pr", name: "Bachelor of Arts in Public Relations and Advertising" }
        ]
      },
      {
        id: "somg",
        name: "School of Mines and Geosciences",
        shortName: "SoMG",
        courses: [
          { id: "somg-geology", name: "BSc in Geology" },
          { id: "somg-petroleum", name: "BSc in Petroleum Geosciences" },
          { id: "somg-mining-eng", name: "BSc in Mining Engineering" }
        ]
      }
    ]
  },
  {
    id: "ifm",
    name: "Institute of Finance Management",
    shortName: "IFM",
    slug: "ifm",
    logoUrl: "/logos/IFM.jpeg",
    type: "INSTITUTE",
    location: "Dar es Salaam, Tanzania",
    region: "Dar es Salaam",
    domain: "ifm.ac.tz",
    campuses: 2,
    reportTypes: ["Applied Research Project", "Field Practical Report"],
    hasOfficialTemplate: true,
    templateFileName: "IFM FIELD REPORT SAMPLE.pdf",
    colleges: [
      {
        id: "ifm-fcim",
        name: "Faculty of Computing, Information Systems and Mathematics",
        shortName: "FCIM",
        courses: [
          { id: "ifm-cs", name: "BSc in Computer Science" },
          { id: "ifm-it", name: "BSc in Information Technology" },
          { id: "ifm-bis", name: "BSc in Business Information Systems" }
        ]
      },
      {
        id: "ifm-bfi",
        name: "Faculty of Banking, Finance and Insurance",
        shortName: "FBFI",
        courses: [
          { id: "ifm-banking", name: "BSc in Banking and Finance" },
          { id: "ifm-insurance", name: "BSc in Insurance and Risk Management" },
          { id: "ifm-social-protection", name: "BSc in Social Protection" }
        ]
      },
      {
        id: "ifm-accounting",
        name: "Faculty of Accounting and Auditing",
        shortName: "FAA",
        courses: [
          { id: "ifm-acc", name: "BSc in Accounting" },
          { id: "ifm-acc-fin", name: "BSc in Accounting and Finance" },
          { id: "ifm-taxation", name: "BSc in Tax Management" }
        ]
      },
      {
        id: "ifm-economics",
        name: "Faculty of Economics and Management Studies",
        shortName: "FEMS",
        courses: [
          { id: "ifm-econ-fin", name: "BSc in Economics and Finance" },
          { id: "ifm-actuarial", name: "BSc in Actuarial Science" }
        ]
      }
    ]
  },
  {
    id: "cbe",
    name: "College of Business Education",
    shortName: "CBE",
    slug: "cbe",
    logoUrl: "/logos/CBE.png",
    type: "COLLEGE",
    location: "Dar es Salaam & Dodoma",
    region: "Dar es Salaam",
    domain: "cbe.ac.tz",
    campuses: 4,
    reportTypes: ["Business Research Project", "Field Attachment"],
    hasOfficialTemplate: true,
    templateFileName: "CBE FIELD REPORT FORMAT .pdf",
    colleges: [
      {
        id: "cbe-business",
        name: "Department of Business Administration",
        shortName: "DBA",
        courses: [
          { id: "cbe-bba", name: "Bachelor Degree in Business Administration" },
          { id: "cbe-hrm", name: "Bachelor Degree in Human Resource Management" }
        ]
      },
      {
        id: "cbe-ict",
        name: "Department of Information and Communication Technology",
        shortName: "DICT",
        courses: [
          { id: "cbe-ict-biz", name: "Bachelor Degree in Information Technology" },
          { id: "cbe-bis", name: "Bachelor Degree in Business Information Technology" }
        ]
      },
      {
        id: "cbe-accounting",
        name: "Department of Accountancy and Finance",
        shortName: "DAF",
        courses: [
          { id: "cbe-acc", name: "Bachelor Degree in Accountancy" },
          { id: "cbe-fin-bank", name: "Bachelor Degree in Banking and Finance" }
        ]
      },
      {
        id: "cbe-marketing",
        name: "Department of Marketing and Procurement",
        shortName: "DMP",
        courses: [
          { id: "cbe-mkt", name: "Bachelor Degree in Marketing" },
          { id: "cbe-psm", name: "Bachelor Degree in Procurement and Supplies Management" }
        ]
      },
      {
        id: "cbe-metrology",
        name: "Department of Metrology and Standards",
        shortName: "DMS",
        courses: [
          { id: "cbe-metro", name: "Bachelor Degree in Metrology and Quality Assurance" }
        ]
      }
    ]
  },
  {
    id: "nit",
    name: "National Institute of Transport",
    shortName: "NIT",
    slug: "nit",
    logoUrl: "/logos/NIT.jpeg",
    type: "INSTITUTE",
    location: "Dar es Salaam, Tanzania",
    region: "Dar es Salaam",
    domain: "nit.ac.tz",
    campuses: 1,
    reportTypes: ["Logistics & Engineering Project", "Industrial Training"],
    hasOfficialTemplate: true,
    templateFileName: "NIT FIELD REPORT.pdf",
    colleges: [
      {
        id: "nit-transport-eng",
        name: "School of Transport Engineering",
        shortName: "STE",
        courses: [
          { id: "nit-auto-eng", name: "BSc in Automobile Engineering" },
          { id: "nit-mech-eng", name: "BSc in Mechanical Engineering" },
          { id: "nit-elec-telecom", name: "BSc in Electrical and Telecoms Engineering" }
        ]
      },
      {
        id: "nit-aviation",
        name: "School of Aviation and Aeronautical Studies",
        shortName: "SAAS",
        courses: [
          { id: "nit-aviation-mgmt", name: "Bachelor Degree in Aviation Management" },
          { id: "nit-aircraft-maint", name: "BSc in Aircraft Maintenance Engineering" }
        ]
      },
      {
        id: "nit-logistics",
        name: "School of Business and Transport Logistics",
        shortName: "SBTL",
        courses: [
          { id: "nit-logistics-mgmt", name: "Bachelor Degree in Logistics and Transport Management" },
          { id: "nit-procurement", name: "Bachelor Degree in Procurement and Logistics Management" },
          { id: "nit-freight", name: "Bachelor Degree in Freight Clearing and Forwarding" }
        ]
      },
      {
        id: "nit-computing",
        name: "Department of Computing and Communication Technology",
        shortName: "DCCT",
        courses: [
          { id: "nit-it", name: "BSc in Information Technology" },
          { id: "nit-cs", name: "BSc in Computer Science" }
        ]
      }
    ]
  },
  {
    id: "aru",
    name: "Ardhi University",
    shortName: "ARU",
    slug: "aru",
    logoUrl: "/logos/ARDHI.jpeg",
    type: "UNIVERSITY",
    location: "Dar es Salaam, Tanzania",
    region: "Dar es Salaam",
    domain: "aru.ac.tz",
    campuses: 1,
    reportTypes: ["Final Year Dissertation", "Industrial Training (IT)"],
    hasOfficialTemplate: true,
    templateFileName: "ARTHI IT REPORT 2_110443.pdf",
    colleges: [
      {
        id: "aru-ses",
        name: "School of Earth Sciences, Real Estate, Business and Informatics",
        shortName: "SERBI",
        courses: [
          { id: "aru-it", name: "BSc in Information Systems Management" },
          { id: "aru-cs", name: "BSc in Computer Systems and Networks" },
          { id: "aru-geomatics", name: "BSc in Geomatics" },
          { id: "aru-land-mgmt", name: "BSc in Land Management and Valuation" },
          { id: "aru-real-estate", name: "BSc in Real Estate (Finance and Investment)" }
        ]
      },
      {
        id: "aru-architecture",
        name: "School of Spatial Planning and Social Sciences",
        shortName: "SSPSS",
        courses: [
          { id: "aru-urban-plan", name: "BSc in Urban and Regional Planning" },
          { id: "aru-housing", name: "BSc in Housing and Infrastructure Planning" }
        ]
      },
      {
        id: "aru-environmental",
        name: "School of Environmental Science and Technology",
        shortName: "SEST",
        courses: [
          { id: "aru-env-eng", name: "BSc in Environmental Engineering" },
          { id: "aru-env-sci", name: "BSc in Environmental Science and Management" },
          { id: "aru-municipal", name: "BSc in Municipal and Industrial Services Engineering" }
        ]
      },
      {
        id: "aru-construction",
        name: "School of Architecture, Construction Economics and Management",
        shortName: "SACEM",
        courses: [
          { id: "aru-arch", name: "Bachelor of Architecture" },
          { id: "aru-quantity-survey", name: "BSc in Building Surveying" },
          { id: "aru-construction-mgmt", name: "BSc in Construction Management" }
        ]
      }
    ]
  },
  {
    id: "sua",
    name: "Sokoine University of Agriculture",
    shortName: "SUA",
    slug: "sua",
    logoUrl: "/logos/SUA.jpeg",
    type: "UNIVERSITY",
    location: "Morogoro, Tanzania",
    region: "Morogoro",
    domain: "sua.ac.tz",
    campuses: 3,
    reportTypes: ["Special Project", "Practical Training (PT)", "Dissertation"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "sua-coa",
        name: "College of Agriculture",
        shortName: "CoA",
        courses: [
          { id: "sua-agric-gen", name: "BSc in Agriculture General" },
          { id: "sua-agronomy", name: "BSc in Agronomy" },
          { id: "sua-horticulture", name: "BSc in Horticulture" },
          { id: "sua-animal-sci", name: "BSc in Animal Science" },
          { id: "sua-food-sci", name: "BSc in Food Science and Technology" }
        ]
      },
      {
        id: "sua-conas",
        name: "College of Natural and Applied Sciences",
        shortName: "CoNAS",
        courses: [
          { id: "sua-biotech", name: "BSc in Biotechnology and Laboratory Sciences" },
          { id: "sua-infotech", name: "BSc in Information Technology" },
          { id: "sua-environ-sci", name: "BSc in Environmental Sciences and Management" }
        ]
      },
      {
        id: "sua-forestry",
        name: "College of Forestry, Wildlife and Tourism",
        shortName: "CFWT",
        courses: [
          { id: "sua-forestry-bsc", name: "BSc in Forestry" },
          { id: "sua-wildlife", name: "BSc in Wildlife Management" },
          { id: "sua-tourism", name: "Bachelor of Tourism Management" }
        ]
      },
      {
        id: "sua-vet",
        name: "College of Veterinary Medicine and Biomedical Sciences",
        shortName: "CVMBS",
        courses: [
          { id: "sua-bvm", name: "Bachelor of Veterinary Medicine (BVM)" },
          { id: "sua-biomed", name: "BSc in Biotechnology and Laboratory Sciences" }
        ]
      },
      {
        id: "sua-economics",
        name: "School of Agricultural Economics and Business Studies",
        shortName: "SAEBS",
        courses: [
          { id: "sua-agribiz", name: "BSc in Agricultural Economics and Agribusiness" }
        ]
      }
    ]
  },
  {
    id: "udom",
    name: "University of Dodoma",
    shortName: "UDOM",
    slug: "udom",
    logoUrl: "/logos/UDOM.png",
    type: "UNIVERSITY",
    location: "Dodoma, Tanzania",
    region: "Dodoma",
    domain: "udom.ac.tz",
    campuses: 6,
    reportTypes: ["Final Year Project", "Industrial Attachment", "Masters Thesis"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "udom-cive",
        name: "College of Informatics and Virtual Education",
        shortName: "CIVE",
        courses: [
          { id: "udom-cs", name: "BSc in Computer Science" },
          { id: "udom-se", name: "BSc in Software Engineering" },
          { id: "udom-cns", name: "BSc in Computer Networks and Information Security" },
          { id: "udom-his", name: "BSc in Health Information Systems" },
          { id: "udom-telecom", name: "BSc in Telecommunications Engineering" }
        ]
      },
      {
        id: "udom-coet",
        name: "College of Earth Sciences and Engineering",
        shortName: "CoES",
        courses: [
          { id: "udom-mining", name: "BSc in Mining Engineering" },
          { id: "udom-geology", name: "BSc in Applied Geology" },
          { id: "udom-petroleum", name: "BSc in Petroleum Engineering" },
          { id: "udom-metallurgy", name: "BSc in Metallurgy and Mineral Processing" }
        ]
      },
      {
        id: "udom-cobs",
        name: "College of Business and Economics",
        shortName: "CoBE",
        courses: [
          { id: "udom-bba", name: "Bachelor of Business Administration" },
          { id: "udom-bcom", name: "Bachelor of Commerce in Accounting and Finance" },
          { id: "udom-econ", name: "Bachelor of Arts in Economics" },
          { id: "udom-procurement", name: "Bachelor Degree in Procurement and Logistics Management" }
        ]
      },
      {
        id: "udom-cohas",
        name: "College of Health and Allied Sciences",
        shortName: "CoHAS",
        courses: [
          { id: "udom-md", name: "Doctor of Medicine (MD)" },
          { id: "udom-nursing", name: "BSc in Nursing" },
          { id: "udom-pharmacy", name: "Bachelor of Pharmacy" }
        ]
      },
      {
        id: "udom-coed",
        name: "College of Education",
        shortName: "CoED",
        courses: [
          { id: "udom-bed-arts", name: "Bachelor of Education in Arts" },
          { id: "udom-bed-sci", name: "Bachelor of Education in Sciences" }
        ]
      }
    ]
  },
  {
    id: "dit",
    name: "Dar es Salaam Institute of Technology",
    shortName: "DIT",
    slug: "dit",
    logoUrl: "/logos/DIT.jpeg",
    type: "INSTITUTE",
    location: "Dar es Salaam, Tanzania",
    region: "Dar es Salaam",
    domain: "dit.ac.tz",
    campuses: 2,
    reportTypes: ["Final Year Engineering Project", "Industrial Practical Training"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "dit-engineering",
        name: "School of Engineering Technology",
        shortName: "SET",
        courses: [
          { id: "dit-civil", name: "Bachelor of Engineering in Civil Engineering" },
          { id: "dit-elec", name: "Bachelor of Engineering in Electrical Engineering" },
          { id: "dit-mech", name: "Bachelor of Engineering in Mechanical Engineering" },
          { id: "dit-telecom", name: "Bachelor of Engineering in Telecommunications" }
        ]
      },
      {
        id: "dit-ict",
        name: "School of Information and Communication Technology",
        shortName: "SICT",
        courses: [
          { id: "dit-cs", name: "Bachelor of Computer Science" },
          { id: "dit-it", name: "Bachelor of Information Technology" },
          { id: "dit-multimedia", name: "Bachelor in Multimedia Technology" }
        ]
      }
    ]
  },
  {
    id: "must",
    name: "Mbeya University of Science and Technology",
    shortName: "MUST",
    slug: "must",
    logoUrl: "/logos/MUST.jpeg",
    type: "UNIVERSITY",
    location: "Mbeya, Tanzania",
    region: "Mbeya",
    domain: "must.ac.tz",
    campuses: 2,
    reportTypes: ["Final Year Engineering Project", "IPT Report"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "must-cet",
        name: "College of Engineering and Technology",
        shortName: "CET",
        courses: [
          { id: "must-civil", name: "Bachelor of Civil Engineering" },
          { id: "must-elec", name: "Bachelor of Electrical and Electronics Engineering" },
          { id: "must-mech", name: "Bachelor of Mechanical Engineering" }
        ]
      },
      {
        id: "must-cist",
        name: "College of Information and Communication Technology",
        shortName: "CoICT",
        courses: [
          { id: "must-cs", name: "BSc in Computer Science" },
          { id: "must-it", name: "BSc in Information Technology" },
          { id: "must-data", name: "BSc in Data Science" }
        ]
      },
      {
        id: "must-cbst",
        name: "College of Business Studies and Technology",
        shortName: "CBST",
        courses: [
          { id: "must-bba", name: "Bachelor of Business Administration" },
          { id: "must-procurement", name: "Bachelor in Procurement and Supply Chain Management" }
        ]
      }
    ]
  },
  {
    id: "muhas",
    name: "Muhimbili University of Health and Allied Sciences",
    shortName: "MUHAS",
    slug: "muhas",
    logoUrl: "/logos/MUHAS.jpeg",
    type: "UNIVERSITY",
    location: "Dar es Salaam, Tanzania",
    region: "Dar es Salaam",
    domain: "muhas.ac.tz",
    campuses: 2,
    reportTypes: ["Clinical Research Dissertation", "Public Health Field Report"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "muhas-med",
        name: "School of Medicine",
        shortName: "SoM",
        courses: [
          { id: "muhas-md", name: "Doctor of Medicine (MD)" },
          { id: "muhas-dentistry", name: "Doctor of Dental Surgery (DDS)" }
        ]
      },
      {
        id: "muhas-pharmacy",
        name: "School of Pharmacy",
        shortName: "SoP",
        courses: [
          { id: "muhas-bpharm", name: "Bachelor of Pharmacy (BPharm)" }
        ]
      },
      {
        id: "muhas-nursing",
        name: "School of Nursing",
        shortName: "SoN",
        courses: [
          { id: "muhas-bnurs", name: "Bachelor of Science in Nursing" }
        ]
      },
      {
        id: "muhas-public-health",
        name: "School of Public Health and Social Sciences",
        shortName: "SPHSS",
        courses: [
          { id: "muhas-environ-health", name: "BSc in Environmental Health Sciences" }
        ]
      }
    ]
  },
  {
    id: "mzumbe",
    name: "Mzumbe University",
    shortName: "MU",
    slug: "mzumbe",
    logoUrl: "/logos/MU.jpeg",
    type: "UNIVERSITY",
    location: "Morogoro, Tanzania",
    region: "Morogoro",
    domain: "mzumbe.ac.tz",
    campuses: 3,
    reportTypes: ["Business Research Project", "Field Attachment", "Postgraduate Dissertation"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "mu-sob",
        name: "School of Business",
        shortName: "SoB",
        courses: [
          { id: "mu-bba", name: "Bachelor of Business Administration" },
          { id: "mu-bcom", name: "Bachelor of Accounting and Finance" },
          { id: "mu-procurement", name: "Bachelor of Procurement and Logistics Management" }
        ]
      },
      {
        id: "mu-sopam",
        name: "School of Public Administration and Management",
        shortName: "SOPAM",
        courses: [
          { id: "mu-bpa", name: "Bachelor of Public Administration" },
          { id: "mu-hrm", name: "Bachelor of Human Resource Management" },
          { id: "mu-health-admin", name: "Bachelor of Health Systems Management" }
        ]
      },
      {
        id: "mu-sol",
        name: "Faculty of Law",
        shortName: "FoL",
        courses: [
          { id: "mu-llb", name: "Bachelor of Laws (LL.B)" }
        ]
      },
      {
        id: "mu-scst",
        name: "Faculty of Science and Technology",
        shortName: "FST",
        courses: [
          { id: "mu-it-biz", name: "BSc in Information Technology and Systems" },
          { id: "mu-ict-mgmt", name: "BSc in Applied Statistics" }
        ]
      }
    ]
  },
  {
    id: "iaa",
    name: "Institute of Accountancy Arusha",
    shortName: "IAA",
    slug: "iaa",
    logoUrl: "/logos/IAA.jpeg",
    type: "INSTITUTE",
    location: "Arusha, Tanzania",
    region: "Arusha",
    domain: "iaa.ac.tz",
    campuses: 2,
    reportTypes: ["Accounting Research Project", "Field Work Report"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "iaa-computing",
        name: "Faculty of Computing, Information Systems and Mathematics",
        shortName: "FCISM",
        courses: [
          { id: "iaa-cs", name: "Bachelor of Computer Science" },
          { id: "iaa-cyber", name: "Bachelor of Cyber Security" },
          { id: "iaa-it", name: "Bachelor of Information Technology" }
        ]
      },
      {
        id: "iaa-business",
        name: "Faculty of Business and Economics",
        shortName: "FBE",
        courses: [
          { id: "iaa-accounting", name: "Bachelor of Accountancy" },
          { id: "iaa-finance", name: "Bachelor of Banking and Finance" },
          { id: "iaa-procurement", name: "Bachelor of Procurement and Logistics Management" }
        ]
      }
    ]
  },
  {
    id: "out",
    name: "Open University of Tanzania",
    shortName: "OUT",
    slug: "out",
    logoUrl: "/logos/OUT.jpeg",
    type: "UNIVERSITY",
    location: "Dar es Salaam & Nationwide Centers",
    region: "Dar es Salaam",
    domain: "out.ac.tz",
    campuses: 30,
    reportTypes: ["Dissertation Proposal", "Fieldwork Report", "Final Year Research"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "out-fstes",
        name: "Faculty of Science, Technology and Environmental Studies",
        shortName: "FSTES",
        courses: [
          { id: "out-cs-ict", name: "BSc in Information Communication Technology" },
          { id: "out-data-sci", name: "BSc in Data Management and Analytics" },
          { id: "out-env-sci", name: "BSc in Environmental Studies" },
          { id: "out-sc-bio", name: "BSc General (Biological Sciences)" }
        ]
      },
      {
        id: "out-fbm",
        name: "Faculty of Business Management",
        shortName: "FBM",
        courses: [
          { id: "out-bba-acc", name: "Bachelor of Business Administration (Accounting)" },
          { id: "out-bba-fin", name: "Bachelor of Business Administration (Finance)" },
          { id: "out-bba-hrm", name: "Bachelor of Human Resource Management" },
          { id: "out-proc-log", name: "Bachelor of Procurement and Supply Logistics" }
        ]
      },
      {
        id: "out-fed",
        name: "Faculty of Education",
        shortName: "FED",
        courses: [
          { id: "out-bed-arts", name: "Bachelor of Education (Arts)" },
          { id: "out-bed-sc", name: "Bachelor of Education (Science)" },
          { id: "out-bed-elem", name: "Bachelor of Education in Teacher Leadership" }
        ]
      },
      {
        id: "out-flw",
        name: "Faculty of Law",
        shortName: "FLW",
        courses: [
          { id: "out-law-llb", name: "Bachelor of Laws (LL.B)" }
        ]
      }
    ]
  },
  {
    id: "suza",
    name: "State University of Zanzibar",
    shortName: "SUZA",
    slug: "suza",
    logoUrl: "/logos/SUZA.jpeg",
    type: "UNIVERSITY",
    location: "Tunguu, Zanzibar, Tanzania",
    region: "Zanzibar",
    domain: "suza.ac.tz",
    campuses: 4,
    reportTypes: ["Field Attachment Report", "Undergraduate Research Project", "Postgraduate Dissertation"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "suza-scit",
        name: "School of Computing, Communication and Media Studies",
        shortName: "SCCMS",
        courses: [
          { id: "suza-cs-it", name: "BSc in Computer Science" },
          { id: "suza-it-sys", name: "BSc in Information Technology Application & Systems" },
          { id: "suza-mass-comm", name: "Bachelor of Arts in Mass Communication" }
        ]
      },
      {
        id: "suza-shms",
        name: "School of Health and Medical Sciences",
        shortName: "SHMS",
        courses: [
          { id: "suza-med-doc", name: "Doctor of Medicine (MD)" },
          { id: "suza-nurs-sci", name: "Bachelor of Science in Nursing" },
          { id: "suza-pharm-tech", name: "Bachelor of Pharmacy (BPharm)" },
          { id: "suza-env-health", name: "BSc in Environmental Health" }
        ]
      },
      {
        id: "suza-snss",
        name: "School of Natural and Social Sciences",
        shortName: "SNSS",
        courses: [
          { id: "suza-marine-sci", name: "BSc in Marine and Coastal Resources Management" },
          { id: "suza-agric-hort", name: "BSc in Agriculture and Natural Resource Management" },
          { id: "suza-tour-mgmt", name: "Bachelor in Tourism and Heritage Management" }
        ]
      },
      {
        id: "suza-soed",
        name: "School of Education",
        shortName: "SOE",
        courses: [
          { id: "suza-bed-sci", name: "Bachelor of Science with Education" },
          { id: "suza-bed-arts", name: "Bachelor of Arts with Education" }
        ]
      }
    ]
  },
  {
    id: "tia",
    name: "Tanzania Institute of Accountancy",
    shortName: "TIA",
    slug: "tia",
    logoUrl: "/logos/TIA.png",
    type: "INSTITUTE",
    location: "Dar es Salaam, Mbeya, Mwanza, Singida",
    region: "Dar es Salaam",
    domain: "tia.ac.tz",
    campuses: 6,
    reportTypes: ["Field Practical Training Report (IPT)", "Applied Research Project"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "tia-acc-fin",
        name: "Department of Accounting and Finance",
        shortName: "DAF",
        courses: [
          { id: "tia-acc-prof", name: "Bachelor of Accountancy" },
          { id: "tia-fin-bank", name: "Bachelor of Banking and Finance" },
          { id: "tia-tax-admin", name: "Bachelor of Public Sector Accounting and Finance" }
        ]
      },
      {
        id: "tia-bms",
        name: "Department of Business and Management Studies",
        shortName: "DBMS",
        courses: [
          { id: "tia-proc-log", name: "Bachelor of Procurement and Logistics Management" },
          { id: "tia-mkt-pr", name: "Bachelor of Marketing and Public Relations" },
          { id: "tia-hrm-mgmt", name: "Bachelor of Human Resource Management" },
          { id: "tia-biz-admin", name: "Bachelor of Business Administration" }
        ]
      }
    ]
  },
  {
    id: "saut",
    name: "St. Augustine University of Tanzania",
    shortName: "SAUT",
    slug: "saut",
    logoUrl: "/logos/SAUT.png",
    type: "UNIVERSITY",
    location: "Mwanza, Tanzania",
    region: "Mwanza",
    domain: "saut.ac.tz",
    campuses: 3,
    reportTypes: ["Fieldwork Attachment", "Research Project", "Dissertation"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "saut-eng-tech",
        name: "Faculty of Engineering and Technology",
        shortName: "FET",
        courses: [
          { id: "saut-eng-civil", name: "Bachelor of Science in Civil Engineering" },
          { id: "saut-eng-elec", name: "Bachelor of Science in Electrical Engineering" },
          { id: "saut-eng-cs", name: "Bachelor of Science in Computer Science" }
        ]
      },
      {
        id: "saut-fba",
        name: "Faculty of Business Administration",
        shortName: "FBA",
        courses: [
          { id: "saut-biz-acc", name: "Bachelor of Business Administration (Accounting)" },
          { id: "saut-biz-proc", name: "Bachelor of Procurement and Supply Chain Management" },
          { id: "saut-biz-fin", name: "Bachelor of Business Administration (Banking & Finance)" }
        ]
      },
      {
        id: "saut-fssc",
        name: "Faculty of Social Sciences and Communications",
        shortName: "FSSC",
        courses: [
          { id: "saut-mass-comm", name: "Bachelor of Arts in Mass Communication" },
          { id: "saut-pub-admin", name: "Bachelor of Public Administration" },
          { id: "saut-sociology", name: "Bachelor of Arts in Sociology" }
        ]
      },
      {
        id: "saut-fol",
        name: "Faculty of Law",
        shortName: "FoL",
        courses: [
          { id: "saut-law-llb", name: "Bachelor of Laws (LL.B)" }
        ]
      }
    ]
  },
  {
    id: "sjuit",
    name: "St. Joseph University in Tanzania",
    shortName: "SJUIT",
    slug: "sjuit",
    logoUrl: "/logos/SJUIT.jpeg",
    type: "UNIVERSITY",
    location: "Dar es Salaam, Tanzania",
    region: "Dar es Salaam",
    domain: "sjuit.ac.tz",
    campuses: 2,
    reportTypes: ["Industrial Practical Training (IPT)", "Capstone Engineering Design", "FYP"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "sjuit-sjcet",
        name: "St. Joseph College of Engineering and Technology",
        shortName: "SJCET",
        courses: [
          { id: "sjuit-eng-cs", name: "Bachelor of Engineering in Computer Science and Engineering" },
          { id: "sjuit-eng-civil", name: "Bachelor of Engineering in Civil Engineering" },
          { id: "sjuit-eng-mech", name: "Bachelor of Engineering in Mechanical Engineering" },
          { id: "sjuit-eng-elec", name: "Bachelor of Engineering in Electrical and Electronics Engineering" },
          { id: "sjuit-eng-telecom", name: "Bachelor of Engineering in Information and Communication Technology" }
        ]
      },
      {
        id: "sjuit-sjchas",
        name: "St. Joseph College of Health and Allied Sciences",
        shortName: "SJCHAS",
        courses: [
          { id: "sjuit-med-md", name: "Doctor of Medicine (MD)" },
          { id: "sjuit-pharm-bpharm", name: "Bachelor of Pharmacy (BPharm)" },
          { id: "sjuit-nurs-sci", name: "Bachelor of Science in Nursing" }
        ]
      },
      {
        id: "sjuit-mgmt",
        name: "St. Joseph College of Management and Finance",
        shortName: "SJCMF",
        courses: [
          { id: "sjuit-biz-bba", name: "Bachelor of Business Administration" },
          { id: "sjuit-biz-commerce", name: "Bachelor of Commerce in Accounting & Finance" }
        ]
      }
    ]
  },
  {
    id: "tumaini",
    name: "Tumaini University Makumira",
    shortName: "TUMAINI",
    slug: "tumaini",
    logoUrl: "/logos/TUMAINI.jpeg",
    type: "UNIVERSITY",
    location: "Usa River, Arusha, Tanzania",
    region: "Arusha",
    domain: "makumira.ac.tz",
    campuses: 2,
    reportTypes: ["Field Attachment Report", "Legal Research Paper", "Postgraduate Dissertation"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "tuma-fol",
        name: "Faculty of Law",
        shortName: "FoL",
        courses: [
          { id: "tuma-law-llb", name: "Bachelor of Laws (LL.B)" },
          { id: "tuma-law-llm", name: "Master of Laws in International Human Rights (LL.M)" }
        ]
      },
      {
        id: "tuma-fhss",
        name: "Faculty of Humanities and Social Sciences",
        shortName: "FHSS",
        courses: [
          { id: "tuma-edu-arts", name: "Bachelor of Arts with Education" },
          { id: "tuma-counsel-psy", name: "Bachelor of Arts in Counselling Psychology" },
          { id: "tuma-comm-dev", name: "Bachelor of Arts in Community Development" }
        ]
      },
      {
        id: "tuma-fbcs",
        name: "Faculty of Business and Computer Studies",
        shortName: "FBCS",
        courses: [
          { id: "tuma-biz-bba", name: "Bachelor of Business Administration" },
          { id: "tuma-biz-acc", name: "Bachelor of Accounting and Finance" },
          { id: "tuma-it-sys", name: "Bachelor of Science in Information Technology" }
        ]
      }
    ]
  },
  {
    id: "uaut",
    name: "United African University of Tanzania",
    shortName: "UAUT",
    slug: "uaut",
    logoUrl: "/logos/UAUT.png",
    type: "UNIVERSITY",
    location: "Kigamboni, Dar es Salaam, Tanzania",
    region: "Dar es Salaam",
    domain: "uaut.ac.tz",
    campuses: 1,
    reportTypes: ["Practical Training Report (IPT)", "Engineering Capstone Project", "Business Dissertation"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "uaut-fet",
        name: "Faculty of Engineering and Technology",
        shortName: "FET",
        courses: [
          { id: "uaut-eng-cs", name: "Bachelor of Science in Computer Science" },
          { id: "uaut-eng-civil", name: "Bachelor of Science in Civil Engineering" },
          { id: "uaut-eng-elec", name: "Bachelor of Science in Electrical and Computer Engineering" }
        ]
      },
      {
        id: "uaut-fba",
        name: "Faculty of Business Administration",
        shortName: "FBA",
        courses: [
          { id: "uaut-biz-bba", name: "Bachelor of Business Administration (Accounting & Finance)" },
          { id: "uaut-biz-intl", name: "Bachelor of International Business Management" },
          { id: "uaut-biz-proc", name: "Bachelor of Procurement and Supply Management" }
        ]
      }
    ]
  },
  {
    id: "hkmu",
    name: "Hubert Kairuki Memorial University",
    shortName: "HKMU",
    slug: "hkmu",
    logoUrl: "/logos/HKMU.jpeg",
    type: "UNIVERSITY",
    location: "Mikocheni, Dar es Salaam, Tanzania",
    region: "Dar es Salaam",
    domain: "hkmu.ac.tz",
    campuses: 1,
    reportTypes: ["Clinical Elective Report", "Medical Dissertation", "Public Health Research"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "hkmu-fom",
        name: "Faculty of Medicine",
        shortName: "FoM",
        courses: [
          { id: "hkmu-med-md", name: "Doctor of Medicine (MD)" },
          { id: "hkmu-med-biomed", name: "BSc in Health Systems and Biomedical Research" }
        ]
      },
      {
        id: "hkmu-fon",
        name: "Faculty of Nursing",
        shortName: "FoN",
        courses: [
          { id: "hkmu-nurs-bnurs", name: "Bachelor of Science in Nursing (Pre-service & In-service)" },
          { id: "hkmu-nurs-midwife", name: "Bachelor of Science in Midwifery" }
        ]
      }
    ]
  },
  {
    id: "kcmuco",
    name: "Kilimanjaro Christian Medical University College",
    shortName: "KCMUCo",
    slug: "kcmuco",
    logoUrl: "/logos/KCMC.jpeg",
    type: "COLLEGE",
    location: "Moshi, Kilimanjaro, Tanzania",
    region: "Kilimanjaro",
    domain: "kcmuco.ac.tz",
    campuses: 1,
    reportTypes: ["Elective Clinical Report", "Medical Dissertation", "Biomedical Research"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "kcmuco-fom",
        name: "Faculty of Medicine",
        shortName: "FoM",
        courses: [
          { id: "kcmuco-med-md", name: "Doctor of Medicine (MD)" },
          { id: "kcmuco-med-lab", name: "Bachelor of Science in Health Laboratory Sciences" }
        ]
      },
      {
        id: "kcmuco-frah",
        name: "Faculty of Rehabilitation and Allied Health Sciences",
        shortName: "FRAHS",
        courses: [
          { id: "kcmuco-physio", name: "Bachelor of Science in Physiotherapy" },
          { id: "kcmuco-occup-ther", name: "Bachelor of Science in Occupational Therapy" },
          { id: "kcmuco-optom", name: "Bachelor of Science in Optometry" }
        ]
      },
      {
        id: "kcmuco-fon",
        name: "Faculty of Nursing",
        shortName: "FoN",
        courses: [
          { id: "kcmuco-nurs-bnurs", name: "Bachelor of Science in Nursing" }
        ]
      }
    ]
  },
  {
    id: "mocu",
    name: "Moshi Co-operative University",
    shortName: "MoCU",
    slug: "mocu",
    logoUrl: "/logos/MoCU.jpeg",
    type: "UNIVERSITY",
    location: "Moshi, Kilimanjaro, Tanzania",
    region: "Kilimanjaro",
    domain: "mocu.ac.tz",
    campuses: 2,
    reportTypes: ["Field Practical Attachment", "Co-operative Research Project", "Postgraduate Dissertation"],
    hasOfficialTemplate: false,
    colleges: [
      {
        id: "mocu-fccd",
        name: "Faculty of Co-operative and Community Development",
        shortName: "FCCD",
        courses: [
          { id: "mocu-coop-mgmt", name: "Bachelor of Co-operative Management and Accounting" },
          { id: "mocu-comm-dev", name: "Bachelor of Arts in Community Development" },
          { id: "mocu-microfin", name: "Bachelor of Science in Microfinance Management" }
        ]
      },
      {
        id: "mocu-fbis",
        name: "Faculty of Business and Information Sciences",
        shortName: "FBIS",
        courses: [
          { id: "mocu-acc-fin", name: "Bachelor of Accounting and Finance" },
          { id: "mocu-proc-supply", name: "Bachelor of Procurement and Supply Management" },
          { id: "mocu-biz-it", name: "Bachelor of Science in Business Information Technology" },
          { id: "mocu-mkt-ent", name: "Bachelor of Marketing and Entrepreneurship" }
        ]
      },
      {
        id: "mocu-fol",
        name: "Faculty of Law",
        shortName: "FoL",
        courses: [
          { id: "mocu-law-llb", name: "Bachelor of Laws (LL.B)" }
        ]
      }
    ]
  }
];

export function getUniversitiesCatalog(): UniversityCatalogItem[] {
  return TANZANIA_ACADEMIC_CATALOG;
}

export function getUniversityByShortName(shortName: string): UniversityCatalogItem | undefined {
  return TANZANIA_ACADEMIC_CATALOG.find(
    (u) => u.shortName.toUpperCase() === shortName.toUpperCase() || u.id === shortName.toLowerCase()
  );
}

export function getCollegesForUniversity(uniShortName: string): CollegeItem[] {
  const uni = getUniversityByShortName(uniShortName);
  return uni ? uni.colleges : [];
}

export function getCoursesForCollege(uniShortName: string, collegeIdOrShortName: string): CourseItem[] {
  const colleges = getCollegesForUniversity(uniShortName);
  const foundCollege = colleges.find(
    (c) => c.id === collegeIdOrShortName || c.shortName.toLowerCase() === collegeIdOrShortName.toLowerCase()
  );
  return foundCollege ? foundCollege.courses : [];
}
