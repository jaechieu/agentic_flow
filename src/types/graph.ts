import { Node, Edge } from 'reactflow';
import { DEFAULT_MARKER_END } from '@/constants/graph';

export interface NodeData {
  label: string;
  type: string;
  parentId?: string | null;
  conditions?: string[];
}

export interface EdgeData {
  conditions: string[];
}

export interface WorkflowNode {
  id: string;
  type: "custom";
  position: { x: number; y: number };
  data: NodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type: "custom";
  data: EdgeData;
  markerEnd: typeof DEFAULT_MARKER_END;
}

export class NodeInfo {
  id: string;
  label: string;
  parentId: string | null;
  type: string;
  conditions: string[];
  position: { x: number; y: number };

  constructor(
    label: string,
    type: string,
    parentId: string | null = null,
    conditions: string[] = [],
    position?: { x: number; y: number }
  ) {
    this.id = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.label = label;
    this.type = type;
    this.parentId = parentId;
    this.conditions = conditions;
    this.position = position || {
      x: 250 + Math.random() * 50,
      y: 250 + Math.random() * 50,
    };
  }

  toReactFlowNode(): Node {
    return {
      id: this.id,
      type: 'custom',
      data: { 
        label: this.label, 
        type: this.type,
        parentId: this.parentId,
        conditions: this.conditions
      },
      position: this.position
    };
  }

  static fromReactFlowNode(node: Node, parentId: string | null = null): NodeInfo {
    return new NodeInfo(
      node.data.label,
      node.data.type,
      parentId,
      node.data.conditions || [],
      node.position
    );
  }
}

export function createEdge(source: string, target: string, conditions: string[]): WorkflowEdge {
  return {
    id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    source,
    target,
    type: "custom",
    data: { conditions },
    markerEnd: DEFAULT_MARKER_END,
  };
} 