import { Node } from 'reactflow';

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