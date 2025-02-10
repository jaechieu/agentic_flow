"use client";

import { useState, useEffect, useRef } from "react";
import { ChatHistory, Message } from "@/types/chat";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { WorkflowNode, WorkflowEdge } from "@/types/graph";
import { createWorkflow } from "@/lib/workflowTemplates";
import { useWorkflowBuilder } from "@/hooks/useWorkflowBuilder";
import { useChat } from "@/contexts/ChatContext";
import { FlowPreview } from "./FlowPreview";
import { useRouter } from "next/navigation";
import { extractWorkflowSteps } from "@/lib/openai";
import { MarkerType } from "reactflow";

const SUGGESTED_MESSAGES = [
  "What else can I do with Gumloop?",
  "Automate data extraction to Google Sheets",
  "Send automatic follow-up emails to leads",
  "Get Slack alerts for new customer sign-ups",
  "Scrape nearby properties for data and send to Google Sheets",
];

interface ChatWithHistoryProps {
  onFlowGenerated: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
  showHistory?: boolean;
}

interface WorkflowChatHistory {
  id: number;
  title: string;
  messages: Message[];
  workflow: {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
  } | null;
}

export function ChatWithHistory({
  onFlowGenerated,
  showHistory = true,
}: ChatWithHistoryProps) {
  const { messages, setMessages, inputValue, setInputValue } = useChat();
  const [chatHistories, setChatHistories] = useState<WorkflowChatHistory[]>([
    { id: 1, title: "New Workflow", messages: [], workflow: null },
  ]);
  const [currentChatId, setCurrentChatId] = useState<number>(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (messages.length === 0) {
      if (inputValue.trim()) {
        const filtered = SUGGESTED_MESSAGES.filter((msg) =>
          msg.toLowerCase().includes(inputValue.toLowerCase())
        );
        setSuggestions(filtered);
      } else {
        setSuggestions(SUGGESTED_MESSAGES);
      }
    } else {
      setSuggestions([]);
    }
  }, [inputValue, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
  };

  const createExampleWorkflow = (type: string) => {
    const workflow = createWorkflow(type);
    if (workflow) {
      onFlowGenerated(workflow.nodes, workflow.edges);
    }
  };

  const sendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setSuggestions(SUGGESTED_MESSAGES);
    setIsLoading(true);

    try {
      const steps = await extractWorkflowSteps(content);
      const nodes: WorkflowNode[] = steps.map((step, index) => ({
        id: step.id,
        type: "custom" as const,
        position: { x: 100, y: 100 + index * 150 },
        data: {
          label: step.label,
          type: step.type,
        },
      }));
      const edges: WorkflowEdge[] = steps.flatMap((step) =>
        step.dependencies.map((depId) => ({
          id: `${depId}-${step.id}`,
          source: depId,
          target: step.id,
          type: "custom" as const,
          data: { conditions: ["Success"] },
          markerEnd: {
            type: MarkerType.Arrow,
            width: 20,
            height: 20,
            color: "#000000",
          },
        }))
      );

      const newWorkflow = { nodes, edges };

      // Add bot response
      const botResponse: Message = {
        id: Date.now().toString(),
        content:
          "I've created a workflow based on your request. Click 'Create Flow' to view and edit it.",
        sender: "assistant",
      };

      // Update both messages and chat history
      setMessages((prev) => [...prev, botResponse]);
      setChatHistories((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                title: chat.messages.length === 0 ? content : chat.title,
                messages: [...chat.messages, newMessage, botResponse],
                workflow: newWorkflow,
              }
            : chat
        )
      );
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I couldn't process that request. Please try again.",
        sender: "assistant",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const startNewChat = () => {
    const newChatId = Math.max(...chatHistories.map((ch) => ch.id)) + 1;
    const newChat = {
      id: newChatId,
      title: `New Workflow ${newChatId}`,
      messages: [],
      workflow: null,
    };
    setChatHistories((prev) => [...prev, newChat]);
    setCurrentChatId(newChatId);
    setMessages([]);
  };

  const selectChat = (chatId: number) => {
    setCurrentChatId(chatId);
    const selectedChat = chatHistories.find((ch) => ch.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setChatHistories((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: messages,
              }
            : chat
        )
      );
    }
  };

  const handleCreateFlow = () => {
    const currentWorkflow = chatHistories.find(
      (ch) => ch.id === currentChatId
    )?.workflow;
    if (currentWorkflow && currentWorkflow.nodes.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
      localStorage.setItem("currentWorkflow", JSON.stringify(currentWorkflow));
      router.push("/graph");
    } else {
      console.log("No workflow steps available");
    }
  };

  const currentWorkflow = chatHistories.find(
    (ch) => ch.id === currentChatId
  )?.workflow;

  return (
    <div className="flex h-screen bg-gray-50">
      {showHistory && (
        <ChatSidebar
          chatHistories={chatHistories}
          currentChatId={currentChatId}
          onNewChat={startNewChat}
          onSelectChat={selectChat}
        />
      )}

      {showHistory && <div className="flex-1" />}

      <div
        className={`${
          showHistory ? "w-[30%]" : "w-full"
        } flex flex-col border-x border-gray-200/30`}
      >
        {messages.length === 0 && (
          <div className="text-center mt-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">What can I help with?</h1>
            <p className="text-gray-600 text-sm">
              Describe what you'd like to automate and I'll help create an AI
              workflow
            </p>
          </div>
        )}

        <MessageList messages={messages} isLoading={isLoading} />

        {suggestions.length > 0 && messages.length === 0 && (
          <div className="flex flex-wrap gap-2 p-4">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <ChatInput
          inputValue={inputValue}
          inputRef={inputRef}
          onSubmit={handleSubmit}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>

      {showHistory && <div className="flex-1" />}

      {showHistory && (
        <FlowPreview
          onCreateFlow={handleCreateFlow}
          nodes={currentWorkflow?.nodes || []}
        />
      )}
    </div>
  );
}
