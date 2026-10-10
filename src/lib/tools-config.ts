import { Lightbulb, Library, GitPullRequest, PenTool, Search, Presentation, BarChart, Briefcase, CalendarClock, FileCheck, GraduationCap, LucideIcon } from "lucide-react";

export interface ToolConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  systemPrompt: string;
  placeholders: {
    context: string;
    input: string;
  };
}

export const TOOLS: ToolConfig[] = [
  {
    id: "field-report",
    title: "Fieldwork & Attachment Assistant",
    description: "Structure practical field observations, industrial attachments, and site inspection reports.",
    icon: FileCheck,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    systemPrompt: "You are a professional industrial supervisor and academic evaluator. Help the user structure, organize, and write comprehensive field report chapters, practical attachment summaries, site observations, key learnings, and institutional recommendations adhering to standard university field report formats.",
    placeholders: {
      context: "Organization/Site: Tanzania Port Authority (TPA) - Industrial Training.",
      input: "Generate a field report outline covering objectives, activities conducted, challenges faced, and recommendations."
    }
  },
  {
    id: "fyp-generator",
    title: "Final Year Project (FYP) Draft Assistant",
    description: "Generate comprehensive multi-chapter outlines and drafts for undergraduate and postgraduate final year projects.",
    icon: GraduationCap,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    systemPrompt: "You are a senior academic supervisor guiding a student on their Final Year Project (FYP) or dissertation. Help the student draft structured project chapters (Introduction, Literature Review, Methodology, Results & Discussion, Conclusion) based on their research title, objectives, and findings.",
    placeholders: {
      context: "FYP Title: Smart Agriculture Monitoring System Using IoT in Morogoro.",
      input: "Draft Chapter 1: Background, Problem Statement, Main Objective, Specific Objectives, and Significance."
    }
  },
  {
    id: "topic-assistant",
    title: "Research Topic Assistant",
    description: "Generate, refine, and scope academic research topics tailored to your field of study.",
    icon: Lightbulb,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    systemPrompt: "You are an expert academic advisor. Help the user brainstorm and refine impactful research topics within their discipline. Ensure topics are novel, feasible, and clearly scoped. Format output with headers for Topic, Rationale, and Potential Research Questions.",
    placeholders: {
      context: "E.g., I am studying Computer Science and I'm interested in AI ethics.",
      input: "Generate 3 potential topic ideas focusing on LLM biases."
    }
  },
  {
    id: "lit-review",
    title: "Literature Review Assistant",
    description: "Analyze uploaded papers, extract themes, and structure your literature review chapter.",
    icon: Library,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    systemPrompt: "You are a literature review assistant. Synthesize the provided academic concepts and papers into coherent narrative structures. Group findings by theme rather than just chronological summary.",
    placeholders: {
      context: "Topic: The impact of microfinance on rural women in East Africa.",
      input: "Synthesize these key arguments: Mushi (2020) argues X, while Kato (2022) found Y."
    }
  },
  {
    id: "methodology",
    title: "Methodology Assistant",
    description: "Design rigorous research methodologies, qualitative or quantitative, with justification.",
    icon: GitPullRequest,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    systemPrompt: "You are a research methodologist. Help the user define their research design, data collection methods, sampling techniques, and data analysis plan. Justify each choice academically.",
    placeholders: {
      context: "Research Question: How does mobile banking adoption affect SME growth?",
      input: "Suggest a mixed-methods approach for researching this question in Dar es Salaam."
    }
  },
  {
    id: "language-tone",
    title: "Language & Tone Assistant",
    description: "Elevate your writing to match strict academic standards, fixing tone and vocabulary.",
    icon: PenTool,
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    systemPrompt: "You are an academic copy editor. Rewrite the provided text to ensure formal academic tone, remove colloquialisms, improve flow, and ensure precise vocabulary. Do not alter the underlying meaning.",
    placeholders: {
      context: "Target audience: Academic examiners reviewing a Master's thesis.",
      input: "Paste your draft paragraph here to be rewritten into academic language."
    }
  },
  {
    id: "research-gap",
    title: "Research Gap Assistant",
    description: "Identify novel theoretical or empirical gaps in existing literature landscapes.",
    icon: Search,
    color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    systemPrompt: "You are a research strategist. Analyze a brief summary of current literature provided by the user and identify potential theoretical, methodological, or empirical gaps that warrant future research.",
    placeholders: {
      context: "Discipline: Civil Engineering (Concrete Materials)",
      input: "Most studies cover recycled plastic in concrete, but what are the gaps regarding long-term durability in tropical climates?"
    }
  },
  {
    id: "slide-generator",
    title: "Slide Outline Generator",
    description: "Convert your completed chapters into compelling bullet points for defense presentations.",
    icon: Presentation,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    systemPrompt: "You are a presentation coach for thesis defenses. Convert the user's dense academic text into presentation-friendly slide outlines with a title, 3-4 bullet points, and speaker notes.",
    placeholders: {
      context: "Target duration: 15 minute defense.",
      input: "Paste Chapter 4 (Findings) to convert into slide bullet points."
    }
  },
  {
    id: "diagram-chart",
    title: "Diagram & Chart Assistant",
    description: "Generate structured descriptions for frameworks or Mermaid.js charts for your methodology.",
    icon: BarChart,
    color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
    systemPrompt: "You are a data visualization architect. Create structural descriptions or Mermaid.js code to represent conceptual frameworks, flowcharts, or methodology structures based on user descriptions. Only output Mermaid code blocks when asked.",
    placeholders: {
      context: "Context: A conceptual framework linking Training, Motivation, and Performance.",
      input: "Generate a Mermaid flowchart showing how these three variables interact."
    }
  },
  {
    id: "reference-manager",
    title: "Reference Manager",
    description: "Format citations strictly according to APA, MLA, or Harvard styles automatically.",
    icon: Briefcase,
    color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    systemPrompt: "You are a precise citation formatting tool. Convert the provided messy references into perfect APA (7th Ed), MLA, or Harvard style citations as requested by the user.",
    placeholders: {
      context: "Required Style: APA 7th Edition",
      input: "Format this: D. Smith 2021 The impact of AI. Journal of Tech vol 10 issue 2 pages 45-60."
    }
  },
  {
    id: "planner",
    title: "Research Planner",
    description: "Break down your thesis into actionable milestones and track your weekly progress.",
    icon: CalendarClock,
    color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
    systemPrompt: "You are an academic project manager. Help the user create a realistic, phased timeline for their research project (e.g., Proposal, Data Collection, Analysis, Writing). Output clear, bulleted milestones with estimated durations.",
    placeholders: {
      context: "Project Scale: Final Year Bachelor's Project (6 months total time).",
      input: "Create a week-by-week timeline starting from topic approval to final submission."
    }
  }
];
