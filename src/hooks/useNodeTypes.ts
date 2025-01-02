import { useState, useEffect } from 'react';

export interface NodeType {
  id: string;
  name: string;
  description?: string;
}

export function useNodeTypes() {
  const [nodeTypes, setNodeTypes] = useState<NodeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNodeTypes = async () => {
      try {
        // Fetching data from local server running on localhost:3001
        const response = await fetch('http://localhost:3001/node-types');
        if (!response.ok) throw new Error('Failed to fetch node types');
        
        const data = await response.json();
        setNodeTypes(data);
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
