"use client";

import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";
import { WorkflowNode } from "@/types/graph";
import { Node } from "reactflow";

interface FlowPreviewProps {
  onCreateFlow: () => void;
  showSteps?: boolean;
  nodes?: Node[];
  onStepClick?: (nodeId: string) => void;
}

export function FlowPreview({
  onCreateFlow,
  showSteps = true,
  nodes = [],
  onStepClick,
}: FlowPreviewProps) {
  const { messages } = useChat();
  const userMessages = messages.filter((msg) => msg.sender === "user");

  const handleClick = () => {
    console.log("FlowPreview: Button clicked");
    onCreateFlow();
  };

  const handleStepClick = (nodeId: string) => {
    onStepClick?.(nodeId);
  };

  return (
    <div
      className={`${
        showSteps ? "w-[300px]" : "w-[250px]"
      } border-l border-gray-200 p-4 flex flex-col`}
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Flow Steps</h2>
        <div className="space-y-2">
          {nodes.map((node, index) => (
            <div
              key={node.id}
              className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={() => handleStepClick(node.id)}
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm text-blue-600">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">{node.data.label}</p>
                <p className="text-xs text-gray-400">{node.data.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showSteps && (
        <div className="mt-auto">
          <Button
            className="w-full"
            onClick={handleClick}
            disabled={userMessages.length === 0}
          >
            Create Flow
          </Button>
        </div>
      )}
    </div>
  );
}
