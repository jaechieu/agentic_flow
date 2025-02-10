import { MarkerType } from 'reactflow';

export const INITIAL_NODE_POSITION = {
  x: Math.random() * 500,
  y: Math.random() * 500
};

export const DEFAULT_MARKER_END = {
  type: MarkerType.ArrowClosed,
  width: 20,
  height: 20,
  color: '#888'
};

export const defaultEdgeOptions = {
  type: "custom",
  markerEnd: DEFAULT_MARKER_END,
}; 