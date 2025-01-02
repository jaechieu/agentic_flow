"use client";

import { useState } from "react";
import ReactFlow, { Controls, Background, Node } from "reactflow";
import AddNodeDialog from "@/components/AddNodeDialog";
import EditNodeDialog from "@/components/EditNodeDialog";
import { useGraphState } from "./hooks/useGraphState";
import { useGraphHandlers } from "./hooks/useGraphHandlers";
import CustomNode from "@/components/CustomNode";
import CustomEdge from "@/components/CustomEdge";
import { defaultEdgeOptions } from "./constants";
import { GraphControls } from "./components/GraphControls";
import "reactflow/dist/style.css";

const edgeTypes = { custom: CustomEdge };
const nodeTypes = { custom: CustomNode };

export function GraphEditor() {
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isEditNodeOpen, setIsEditNodeOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useGraphState();
  const { handleAddNode, handleEditNode, handleDeleteNode, handleRunAgent } =
    useGraphHandlers({
      setNodes,
      setEdges,
      setIsAddNodeOpen,
      setIsEditNodeOpen,
      setSelectedNode,
    });

  return (
    <div className="w-full h-screen relative">
      <ReactFlow
        className="bg-background"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => {
          setSelectedNode(node);
          setIsEditNodeOpen(true);
        }}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <GraphControls
        onAddNode={() => setIsAddNodeOpen(true)}
        onRunAgent={handleRunAgent}
      />
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
