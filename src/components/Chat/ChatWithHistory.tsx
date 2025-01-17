"use client";

import { useState, useEffect, useRef } from "react";
import { ChatHistory, Message } from "@/types/chat";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

const SUGGESTED_MESSAGES = [
  "What else can I do with Gumloop?",
  "Automate data extraction to Google Sheets",
  "Send automatic follow-up emails to leads",
  "Get Slack alerts for new customer sign-ups",
  "Create and email weekly reports from analytics",
];

interface ChatWithHistoryProps {
  onFlowGenerated: () => void;
}

export function ChatWithHistory({ onFlowGenerated }: ChatWithHistoryProps) {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([
    { id: 1, title: "New Workflow", messages: [] },
  ]);
  const [currentChatId, setCurrentChatId] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = SUGGESTED_MESSAGES.filter((msg) =>
        msg.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions(SUGGESTED_MESSAGES);
    }
  }, [inputValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
  };

  const sendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setSuggestions(SUGGESTED_MESSAGES);

    // Update chat history with new title if it's the first message
    setChatHistories((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              title: chat.messages.length === 0 ? content : chat.title,
              messages: [...chat.messages, newMessage],
            }
          : chat
      )
    );

    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now().toString(),
        content: "Let me help you create an AI workflow for that.",
        sender: "assistant",
      };

      setMessages((prev) => [...prev, botResponse]);

      // Update chat history with bot response
      setChatHistories((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, botResponse] }
            : chat
        )
      );
    }, 1000);
    onFlowGenerated();
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
    };
    setChatHistories((prev) => [...prev, newChat]);
    setCurrentChatId(newChatId);
    setMessages([]);
  };

  const selectChat = (chatId: number) => {
    setCurrentChatId(chatId);
    const selectedChat = chatHistories.find((ch) => ch.id === chatId);
    setMessages(selectedChat?.messages || []);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        chatHistories={chatHistories}
        currentChatId={currentChatId}
        onNewChat={startNewChat}
        onSelectChat={selectChat}
      />

      <div className="flex-1" />

      <div className="w-[30%] flex flex-col border-x border-gray-200/30">
        {messages.length === 0 && (
          <div className="text-center mt-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">What can I help with?</h1>
            <p className="text-gray-600 text-sm">
              Describe what you'd like to automate and I'll help create an AI
              workflow
            </p>
          </div>
        )}

        <MessageList messages={messages} />

        {suggestions.length > 0 && (
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

      <div className="flex-1" />
    </div>
  );
}
