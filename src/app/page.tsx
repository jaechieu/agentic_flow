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
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import AddNodeDialog from "../components/AddNodeDialog";
import EditNodeDialog from "../components/EditNodeDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Play } from "lucide-react";
import CustomEdge from "../components/CustomEdge";
import CustomNode from "../components/CustomNode";
import { NodeInfo } from "@/types/NodeInfo";

const edgeTypes = {
  custom: CustomEdge,
};

const nodeTypes = {
  custom: CustomNode,
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
    (nodeInfo: NodeInfo) => {
      const newNode = nodeInfo.toReactFlowNode();
      setNodes((nds) => nds.concat(newNode));

      if (nodeInfo.parentId && nodeInfo.parentId !== "none") {
        const newEdge: Edge = {
          id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          source: nodeInfo.parentId,
          target: nodeInfo.id,
          type: "custom",
          data: { conditions: nodeInfo.conditions },
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
    [setNodes, setEdges]
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
          const newEdge: Edge = {
            id: `e${filteredEdges.length + 1}`,
            source: nodeInfo.parentId,
            target: nodeInfo.id,
            type: "custom",
            data: { conditions: nodeInfo.conditions },
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
    (nodeInfo: NodeInfo) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeInfo.id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeInfo.id && edge.target !== nodeInfo.id)
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

  const handleRunAgent = useCallback(() => {
    console.log("Running agent with current graph configuration...");
    // Add your agent running logic here
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
        nodeTypes={nodeTypes}
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
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <Button onClick={() => setIsAddNodeOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Node
        </Button>
        <Button onClick={handleRunAgent}>
          <Play className="mr-2 h-4 w-4" /> Run Agent
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
