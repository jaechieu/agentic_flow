import { NODE_TYPES, NodeType } from '@/constants/nodeTypes';

export function useNodeTypes() {
  return {
    nodeTypes: NODE_TYPES,
    loading: false,
    error: null
  };
}
