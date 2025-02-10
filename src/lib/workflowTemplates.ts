import { WorkflowNode, WorkflowEdge } from "@/types/graph";
import { DEFAULT_MARKER_END } from '@/constants/graph';

interface WorkflowTemplate {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export function createWorkflow(type: string): WorkflowTemplate | null {
  switch (type) {
    case "scraping": {
      const nodes: WorkflowNode[] = [
        {
          id: "1",
          type: "custom",
          position: { x: 100, y: 100 },
          data: { label: "Scrape Properties", type: "scraper" },
        },
        {
          id: "2",
          type: "custom",
          position: { x: 100, y: 250 },
          data: { label: "Filter Results", type: "filter" },
        },
        {
          id: "3",
          type: "custom",
          position: { x: 100, y: 400 },
          data: { label: "Send to Google Sheets", type: "sheets" },
        },
      ];

      const edges: WorkflowEdge[] = [
        {
          id: "e1-2",
          source: "1",
          target: "2",
          type: "custom",
          data: { conditions: ["Success"] },
          markerEnd: DEFAULT_MARKER_END,
        },
        {
          id: "e2-3", 
          source: "2",
          target: "3",
          type: "custom",
          data: { conditions: ["Has Results"] },
          markerEnd: DEFAULT_MARKER_END,
        },
      ];

      return { nodes, edges };
    }

    case "email": {
      const nodes: WorkflowNode[] = [
        {
          id: "1",
          type: "custom",
          position: { x: 100, y: 100 },
          data: { label: "Monitor Inbox", type: "email-trigger" },
        },
        {
          id: "2",
          type: "custom",
          position: { x: 100, y: 250 },
          data: { label: "Generate Response", type: "ai" },
        },
        {
          id: "3",
          type: "custom",
          position: { x: 100, y: 400 },
          data: { label: "Send Email", type: "email" },
        },
      ];

      const edges: WorkflowEdge[] = [
        {
          id: "e1-2",
          source: "1",
          target: "2",
          type: "custom",
          data: { conditions: ["New Email"] },
          markerEnd: DEFAULT_MARKER_END,
        },
        {
          id: "e2-3",
          source: "2",
          target: "3",
          type: "custom",
          data: { conditions: ["Response Ready"] },
          markerEnd: DEFAULT_MARKER_END,
        },
      ];

      return { nodes, edges };
    }

    default:
      return null;
  }
} 