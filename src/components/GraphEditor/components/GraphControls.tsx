import { Button } from "@/components/ui/button";
import { PlusCircle, Play } from "lucide-react";

interface GraphControlsProps {
  onAddNode: () => void;
  onRunAgent: () => void;
}

export function GraphControls({ onAddNode, onRunAgent }: GraphControlsProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
      <Button onClick={onAddNode}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Node
      </Button>
      <Button onClick={onRunAgent}>
        <Play className="mr-2 h-4 w-4" /> Run Agent
      </Button>
    </div>
  );
} 