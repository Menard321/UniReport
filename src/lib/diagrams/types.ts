/**
 * Types for the Structured Diagrams and Visuals Engine in UniReportTZ.
 */

export type DiagramFormat = "MERMAID" | "SVG_CHART" | "MATRIX_TABLE";

export type SupportedDiagramType =
  | "UML_USECASE"
  | "UML_SEQUENCE"
  | "UML_CLASS"
  | "DATABASE_ERD"
  | "SYSTEM_ARCHITECTURE"
  | "PROCESS_FLOW_DIAGRAM"
  | "ENGINEERING_SCHEMATIC"
  | "DECISION_TREE"
  | "WBS"
  | "SWOT_MATRIX"
  | "PORTERS_FIVE_FORCES"
  | "GANTT"
  | "LESSON_PLAN_MATRIX"
  | "BLOOM_TAXONOMY_MATRIX"
  | "FIELD_LAYOUT_DIAGRAM"
  | "ENVIRONMENTAL_IMPACT_MATRIX"
  | "STUDY_FLOW_DIAGRAM"
  | "SVG_CHART";

export interface DiagramSpecInput {
  diagramType: SupportedDiagramType;
  title: string;
  caption: string;
  figureNumber?: number;
  data: Record<string, any>;
}

export interface RenderedDiagramResult {
  diagramId: string;
  diagramType: SupportedDiagramType;
  title: string;
  caption: string;
  format: DiagramFormat;
  sourceDefinition: string; // Raw Mermaid, SVG string, or Markdown matrix table
  isValid: boolean;
  warnings?: string[];
  renderingNotes?: string;
}
