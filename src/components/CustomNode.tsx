import { memo } from "react";
import { Handle, Position } from "reactflow";
import { NodeData } from "@/types/graph";

interface CustomNodeProps {
  data: NodeData;
}

function CustomNode({ data }: CustomNodeProps) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-teal-500"
      />
      <div className="flex flex-col">
        <div className="font-bold">{data.label}</div>
        <div className="text-xs text-gray-500">{data.type}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
      />
    </div>
  );
}

export default memo(CustomNode);
