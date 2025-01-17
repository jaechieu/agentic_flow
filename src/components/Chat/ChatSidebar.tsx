import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ChatHistory } from "@/types/chat";

interface ChatSidebarProps {
  chatHistories: ChatHistory[];
  currentChatId: number;
  onNewChat: () => void;
  onSelectChat: (chatId: number) => void;
}

export function ChatSidebar({
  chatHistories,
  currentChatId,
  onNewChat,
  onSelectChat,
}: ChatSidebarProps) {
  return (
    <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
      <Button onClick={onNewChat} className="w-full mb-4 text-sm">
        <Plus className="mr-2 h-3 w-3" /> New Workflow
      </Button>
      {chatHistories.map((chat) => (
        <div
          key={chat.id}
          className={`p-2 mb-2 rounded cursor-pointer text-xs ${
            currentChatId === chat.id ? "bg-blue-100" : "hover:bg-gray-200"
          }`}
          onClick={() => onSelectChat(chat.id)}
        >
          <div className="truncate">
            {chat.messages.length > 0 ? chat.messages[0].content : chat.title}
          </div>
        </div>
      ))}
    </div>
  );
} 