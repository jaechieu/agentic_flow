import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { RefObject } from "react";

interface ChatInputProps {
  inputValue: string;
  inputRef: RefObject<HTMLInputElement>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ChatInput({
  inputValue,
  inputRef,
  onSubmit,
  onChange,
}: ChatInputProps) {
  return (
    <div className="p-4 border-t border-gray-200/30">
      <form onSubmit={onSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={onChange}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
} 