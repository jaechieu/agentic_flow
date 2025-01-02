import { useState, useEffect } from 'react';

export interface NodeType {
  id: string;
  name: string;
  description?: string;
}

const API_URL = 'https://9fd9pdgp1l.execute-api.us-east-1.amazonaws.com/prod/node-types';

export function useNodeTypes() {
  const [nodeTypes, setNodeTypes] = useState<NodeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNodeTypes = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch node types');
        const data = await response.json();
        setNodeTypes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch node types');
        // Fallback to default node types if API fails
        setNodeTypes([
          { id: 'Prompt', name: 'Prompt Node' },
          { id: 'LLM', name: 'LLM Node' },
          { id: 'Tool', name: 'Tool Node' },
          { id: 'Chain', name: 'Chain Node' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNodeTypes();
  }, []);

  return { nodeTypes, loading, error };
}
