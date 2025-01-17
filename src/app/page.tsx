"use client";

import { useState } from "react";
import { ChatWithHistory } from "@/components/Chat/ChatWithHistory";
import { GraphEditor } from "@/components/GraphEditor/GraphEditor";

export default function Home() {
  const [showGraph, setShowGraph] = useState(false);

  if (showGraph) {
    return <GraphEditor />;
  }

  return <ChatWithHistory onFlowGenerated={() => setShowGraph(true)} />;
}
