import { useState, useCallback } from 'react';
import { WorkflowNode, WorkflowEdge, createEdge } from '@/types/graph';
import { extractWorkflowSteps } from '@/lib/openai';

export function useWorkflowBuilder() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);

  const processMessage = useCallback(async (message: string) => {
    const steps = await extractWorkflowSteps(message);

    // Create nodes
    const newNodes: WorkflowNode[] = steps.map((step, index) => ({
      id: step.id,
      type: "custom",
      position: { x: 100, y: 100 + index * 150 },
      data: {
        label: step.label,
        type: step.type,
      }
    }));

    // Create edges from dependencies
    const newEdges: WorkflowEdge[] = steps.flatMap(step =>
      step.dependencies.map(depId =>
        createEdge(depId, step.id, ["Success"])
      )
    );

    setNodes(prev => [...prev, ...newNodes]);
    setEdges(prev => [...prev, ...newEdges]);

    return { nodes: newNodes, edges: newEdges };
  }, []);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    processMessage
  };
} 