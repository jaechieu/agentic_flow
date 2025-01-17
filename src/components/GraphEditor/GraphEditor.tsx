"use client";

import { useState, useRef } from "react";
import ReactFlow, { Controls, Background, Node } from "reactflow";
import AddNodeDialog from "@/components/AddNodeDialog";
import EditNodeDialog from "@/components/EditNodeDialog";
import { useGraphState } from "../../hooks/useGraphState";
import { useGraphHandlers } from "../../hooks/useGraphHandlers";
import CustomNode from "@/components/CustomNode";
import CustomEdge from "@/components/CustomEdge";
import { defaultEdgeOptions } from "./constants";
import { GraphControls } from "./components/GraphControls";
import { MessageList } from "@/components/Chat/MessageList";
import { ChatInput } from "@/components/Chat/ChatInput";
import { Message } from "@/types/chat";
import "reactflow/dist/style.css";

const edgeTypes = { custom: CustomEdge };
const nodeTypes = { custom: CustomNode };

export function GraphEditor() {
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isEditNodeOpen, setIsEditNodeOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="flex w-full h-screen">
      <div className="flex-1 relative">
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

      {/* Simplified Chat Interface */}
      <div className="w-[30%] border-l border-gray-200/30 flex flex-col">
        <div className="flex-1">
          <MessageList messages={messages} />
        </div>
        <ChatInput
          inputValue={inputValue}
          inputRef={inputRef}
          onSubmit={handleSubmit}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
    </div>
  );
}
