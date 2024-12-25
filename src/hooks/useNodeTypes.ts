import { useState, useEffect } from 'react';

export interface NodeType {
  id: string;
  name: string;
  description?: string;
}

// TODO: Remove mock data
const MOCK_NODE_TYPES: NodeType[] = [
  { id: 'Prompt', name: 'Prompt Node' },
  { id: 'LLM', name: 'LLM Node' },
  { id: 'Tool', name: 'Tool Node' },
  { id: 'Chain', name: 'Chain Node' },
];

export function useNodeTypes() {
  const [nodeTypes, setNodeTypes] = useState<NodeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNodeTypes = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/node-types`);
        // if (!response.ok) throw new Error('Failed to fetch node types');
        // const data = await response.json();
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        setNodeTypes(MOCK_NODE_TYPES);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch node types');
      } finally {
        setLoading(false);
      }
    };

    fetchNodeTypes();
  }, []);

  return { nodeTypes, loading, error };
} 