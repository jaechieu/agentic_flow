import { Message } from "@/types/chat";
import { Avatar } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { LoadingDots } from "@/components/Chat/LoadingDots";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`flex items-end space-x-2 max-w-[80%] ${
              message.sender === "user"
                ? "flex-row-reverse space-x-reverse"
                : ""
            }`}
          >
            <Avatar
              className={`${message.sender === "user" ? "-mb-1" : "mb-1"}`}
            >
              {message.sender === "user" ? (
                <User className="w-6 h-6 text-gray-400" />
              ) : (
                <Bot className="w-6 h-6 text-blue-500" />
              )}
            </Avatar>
            <div
              className={`p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 rounded-lg">
            <LoadingDots />
          </div>
        </div>
      )}
    </div>
  );
}
