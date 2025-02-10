export interface NodeType {
  id: string;
  name: string;
  description: string;
  category: 'trigger' | 'action' | 'logic';
}

export const NODE_TYPES: NodeType[] = [
  {
    id: 'trigger',
    name: 'Trigger',
    description: 'Start a workflow when something happens',
    category: 'trigger'
  },
  {
    id: 'scraper',
    name: 'Web Scraper',
    description: 'Extract data from websites',
    category: 'action'
  },
  {
    id: 'filter',
    name: 'Filter',
    description: 'Filter or transform data',
    category: 'logic'
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    description: 'Send data to Google Sheets',
    category: 'action'
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Send or process emails',
    category: 'action'
  },
  {
    id: 'ai',
    name: 'AI Processing',
    description: 'Process data with AI',
    category: 'action'
  }
];

export function isValidNodeType(type: string): boolean {
  return NODE_TYPES.some(nodeType => nodeType.id === type);
}