export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
}

export interface ChatHistory {
  id: number;
  title: string;
  messages: Message[];
}