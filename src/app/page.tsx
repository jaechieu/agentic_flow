"use client";

import { useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeChange,
  EdgeChange,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import AddNodeDialog from "../components/AddNodeDialog";
import EditNodeDialog from "../components/EditNodeDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CustomEdge from "../components/CustomEdge";

const edgeTypes = {
  custom: CustomEdge,
};

export default function GraphEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isEditNodeOpen, setIsEditNodeOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleAddNode = useCallback(
    (label: string, parentNodeId: string | null, conditions: string[]) => {
      const newNode: Node = {
        id: `${nodes.length + 1}`,
        data: { label },
        position: { x: Math.random() * 500, y: Math.random() * 500 },
      };
      setNodes((nds) => nds.concat(newNode));

      if (parentNodeId && parentNodeId !== "none") {
        const newEdge: Edge = {
          id: `e${edges.length + 1}`,
          source: parentNodeId,
          target: newNode.id,
          type: "custom",
          data: { conditions },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "#888",
          },
        };
        setEdges((eds) => eds.concat(newEdge));
      }

      setIsAddNodeOpen(false);
    },
    [nodes, edges, setNodes, setEdges]
  );

  const handleEditNode = useCallback(
    (
      id: string,
      newLabel: string,
      newParentId: string | null,
      newConditions: string[]
    ) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );

      setEdges((eds) => {
        // Remove existing parent edge
        const filteredEdges = eds.filter((edge) => edge.target !== id);

        // Add new parent edge if a parent is selected
        if (newParentId && newParentId !== "none") {
          const newEdge: Edge = {
            id: `e${filteredEdges.length + 1}`,
            source: newParentId,
            target: id,
            type: "custom",
            data: { conditions: newConditions },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#888",
            },
          };
          return [...filteredEdges, newEdge];
        }

        return filteredEdges;
      });

      setIsEditNodeOpen(false);
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  const handleDeleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== id && edge.target !== id)
      );
      setIsEditNodeOpen(false);
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsEditNodeOpen(true);
  }, []);

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: "custom",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "#888",
          },
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <div className="absolute top-4 left-4">
        <Button onClick={() => setIsAddNodeOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Node
        </Button>
      </div>
      <AddNodeDialog
        isOpen={isAddNodeOpen}
        onClose={() => setIsAddNodeOpen(false)}
        onAdd={handleAddNode}
        nodes={nodes}
      />
      <EditNodeDialog
        isOpen={isEditNodeOpen}
        onClose={() => setIsEditNodeOpen(false)}
        onEdit={handleEditNode}
        onDelete={handleDeleteNode}
        node={selectedNode}
        nodes={nodes}
        edges={edges}
      />
    </div>
  );
}
