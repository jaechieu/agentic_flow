import { NODE_TYPES, isValidNodeType } from '@/constants/nodeTypes';

interface Step {
  id: string;
  label: string;
  type: string;
  dependencies: string[];
}

export async function extractWorkflowSteps(message: string): Promise<Step[]> {
  const response = await fetch('/api/workflow', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error('Failed to process workflow');
  }

  const data = await response.json();
  const steps = data.steps;

  // Validate node types
  if (!steps.every((step: Step) => isValidNodeType(step.type))) {
    throw new Error('Invalid node type received from API');
  }

  return steps;
} 