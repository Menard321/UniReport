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

export interface UniversityCatalogItem {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  logoUrl: string;
  hasOfficialTemplate: boolean;
  templateFileName?: string;
  colleges: CollegeItem[];
}

export const TANZANIA_ACADEMIC_CATALOG: UniversityCatalogItem[] = [
  {
    id: "udsm",
    name: "University of Dar es Salaam",
    shortName: "UDSM",
    slug: "udsm",
    logoUrl: "/logos/UDSM.jpeg",
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
    logoUrl: "/logos/UDSM.jpeg",
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
    logoUrl: "/logos/CBE.png",
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
