"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  ReactFlowInstance,
} from "reactflow";
import AddNodeDialog from "@/components/AddNodeDialog";
import EditNodeDialog from "@/components/EditNodeDialog";
import { useGraphState } from "../../hooks/useGraphState";
import { useGraphHandlers } from "../../hooks/useGraphHandlers";
import CustomNode from "@/components/CustomNode";
import CustomEdge from "@/components/CustomEdge";
import { defaultEdgeOptions } from "@/constants/graph";
import { GraphControls } from "./components/GraphControls";
import { Message } from "@/types/chat";
import "reactflow/dist/style.css";
import { ChatWithHistory } from "@/components/Chat/ChatWithHistory";
import { WorkflowNode, WorkflowEdge } from "@/types/graph";
import { useChat } from "@/contexts/ChatContext";
import { FlowPreview } from "@/components/Chat/FlowPreview";

const edgeTypes = { custom: CustomEdge };
const nodeTypes = { custom: CustomNode };

export function GraphEditor() {
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isEditNodeOpen, setIsEditNodeOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

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

  const { messages: chatMessages, setMessages: setChatMessages } = useChat();

  useEffect(() => {
    // Load saved messages and workflow
    const savedMessages = localStorage.getItem("chatMessages");
    const savedWorkflow = localStorage.getItem("currentWorkflow");

    if (savedMessages) {
      setChatMessages(JSON.parse(savedMessages));
    }

    if (savedWorkflow) {
      const workflow = JSON.parse(savedWorkflow);
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
      // Clean up
      localStorage.removeItem("currentWorkflow");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "I'll help you modify the workflow.",
          sender: "assistant",
        },
      ]);
    }, 1000);
  };

  const handleChatFlowGenerated = (
    nodes: WorkflowNode[],
    edges: WorkflowEdge[]
  ) => {
    setNodes(nodes);
    setEdges(edges);
  };

  const handleStepClick = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node && reactFlowInstance) {
      setSelectedNode(node);
      reactFlowInstance.setCenter(node.position.x, node.position.y, {
        zoom: 1.5,
        duration: 800,
      });
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="flex-1 relative">
        <ReactFlow
          onInit={setReactFlowInstance}
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

      {/* Chat Interface */}
      <div className="w-[30%] border-l border-gray-200 flex flex-col bg-white shadow-xl">
        <ChatWithHistory
          onFlowGenerated={handleChatFlowGenerated}
          showHistory={false}
        />
      </div>

      {/* Steps Preview */}
      <FlowPreview
        onCreateFlow={() => {}}
        showSteps={false}
        nodes={nodes}
        onStepClick={handleStepClick}
      />
    </div>
  );
}
