import { useCallback, Dispatch, SetStateAction } from "react";
import { Node, Edge } from 'reactflow';
import { NodeInfo, createEdge } from "@/types/graph";

interface GraphHandlerProps {
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  setIsAddNodeOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditNodeOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedNode: Dispatch<SetStateAction<Node | null>>;
}

export function useGraphHandlers({ 
  setNodes, 
  setEdges, 
  setIsAddNodeOpen, 
  setIsEditNodeOpen, 
  setSelectedNode 
}: GraphHandlerProps) {
  const handleAddNode = useCallback(
    (nodeInfo: NodeInfo) => {
      const newNode = nodeInfo.toReactFlowNode();
      setNodes((nds) => nds.concat(newNode));

      if (nodeInfo.parentId && nodeInfo.parentId !== "none") {
        const newEdge = createEdge(nodeInfo.parentId, nodeInfo.id, nodeInfo.conditions);
        setEdges((eds) => eds.concat(newEdge));
      }

      setIsAddNodeOpen(false);
    },
    [setNodes, setEdges, setIsAddNodeOpen]
  );

  const handleEditNode = useCallback(
    (nodeInfo: NodeInfo) => {
      setNodes((nds) =>
        nds.map((node) => 
          node.id === nodeInfo.id ? nodeInfo.toReactFlowNode() : node
        )
      );

      setEdges((eds) => {
        const filteredEdges = eds.filter((edge) => edge.target !== nodeInfo.id);
        if (nodeInfo.parentId && nodeInfo.parentId !== "none") {
          const newEdge = createEdge(nodeInfo.parentId, nodeInfo.id, nodeInfo.conditions);
          return [...filteredEdges, newEdge];
        }
        return filteredEdges;
      });

      setIsEditNodeOpen(false);
      setSelectedNode(null);
    },
    [setNodes, setEdges, setIsEditNodeOpen, setSelectedNode]
  );

  const handleDeleteNode = useCallback(
    (nodeInfo: NodeInfo) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeInfo.id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeInfo.id && edge.target !== nodeInfo.id)
      );
      setIsEditNodeOpen(false);
      setSelectedNode(null);
    },
    [setNodes, setEdges, setIsEditNodeOpen, setSelectedNode]
  );

  const handleRunAgent = useCallback(() => {
    console.log("Running agent with current graph configuration...");
  }, []);

  return { handleAddNode, handleEditNode, handleDeleteNode, handleRunAgent };
} 