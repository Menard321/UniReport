import fs from 'fs';
import path from 'path';

const universities = [
  { shortName: "UDSM", color: "#1e3a8a", fullName: "University of Dar es Salaam" },
  { shortName: "UDOM", color: "#b91c1c", fullName: "University of Dodoma" },
  { shortName: "SUA", color: "#15803d", fullName: "Sokoine University of Agriculture" },
  { shortName: "ARU", color: "#4338ca", fullName: "Ardhi University" },
  { shortName: "DIT", color: "#0369a1", fullName: "Dar es Salaam Institute of Technology" },
  { shortName: "CBE", color: "#a21caf", fullName: "College of Business Education" },
  { shortName: "IFM", color: "#be185d", fullName: "Institute of Finance Management" },
  { shortName: "NIT", color: "#c2410c", fullName: "National Institute of Transport" },
  { shortName: "MU", color: "#0f766e", fullName: "Mzumbe University" },
  { shortName: "MUST", color: "#1d4ed8", fullName: "Mbeya University of Science and Technology" },
  { shortName: "OUT", color: "#b45309", fullName: "Open University of Tanzania" },
  { shortName: "SAUT", color: "#4d7c0f", fullName: "St. Augustine University of Tanzania" },
  { shortName: "HKMU", color: "#6d28d9", fullName: "Hubert Kairuki Memorial University" },
  { shortName: "KCMUCo", color: "#c026d3", fullName: "Kilimanjaro Christian Medical University College" },
  { shortName: "UAUT", color: "#e11d48", fullName: "United African University of Tanzania" },
  { shortName: "TUMAINI", color: "#047857", fullName: "Tumaini University Makumira" },
  { shortName: "SUZA", color: "#0ea5e9", fullName: "State University of Zanzibar" },
  { shortName: "SJUIT", color: "#8b5cf6", fullName: "St. Joseph University in Tanzania" },
  { shortName: "TIA", color: "#d946ef", fullName: "Tanzania Institute of Accountancy" },
  { shortName: "IAA", color: "#14b8a6", fullName: "Institute of Accountancy Arusha" }
];

const generateSVG = (uni) => {
  return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad_${uni.shortName}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${uni.color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="32" ry="32" fill="url(#grad_${uni.shortName})" />
  <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="8" />
  <text x="100" y="115" font-family="system-ui, -apple-system, sans-serif" font-size="${uni.shortName.length > 5 ? '32' : '48'}" font-weight="bold" fill="white" text-anchor="middle">${uni.shortName}</text>
</svg>`;
};

const outputDir = path.join(process.cwd(), 'public', 'logos');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const catalog = [];

universities.forEach(uni => {
  const fileName = uni.shortName.toLowerCase() + ".svg";
  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, generateSVG(uni));
  
  catalog.push({
    id: "inst-" + uni.shortName.toLowerCase(),
    name: uni.fullName,
    shortName: uni.shortName,
    logoUrl: "/logos/" + fileName
  });
});

fs.writeFileSync(path.join(process.cwd(), 'public', 'catalog.json'), JSON.stringify(catalog, null, 2));

console.log('Successfully generated 20 logos and catalog.json.');
