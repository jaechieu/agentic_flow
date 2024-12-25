import { useState } from "react";
import { Node } from "reactflow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNodeTypes } from "@/hooks/useNodeTypes";
import { NodeInfo } from "@/types/NodeInfo";

interface AddNodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (nodeInfo: NodeInfo) => void;
  nodes: Node[];
}

export default function AddNodeDialog({
  isOpen,
  onClose,
  onAdd,
  nodes,
}: AddNodeDialogProps) {
  const [nodeInfo, setNodeInfo] = useState<Partial<NodeInfo>>({
    label: "",
    parentId: null,
    type: "",
    conditions: [""],
  });
  const { nodeTypes, loading, error } = useNodeTypes();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nodeInfo.label?.trim() && nodeInfo.type) {
      const newNode = new NodeInfo(
        nodeInfo.label,
        nodeInfo.type,
        nodeInfo.parentId,
        nodeInfo.conditions?.filter(c => c.trim() !== ""),
        undefined,
      );
      onAdd(newNode);
      setNodeInfo({
        label: "",
        parentId: null,
        type: "",
        conditions: [""],
      });
    }
  };

  const handleAddCondition = () => {
    setNodeInfo(prev => ({
      ...prev,
      conditions: [...(prev.conditions || []), ""]
    }));
  };

  const handleConditionChange = (index: number, value: string) => {
    setNodeInfo(prev => ({
      ...prev,
      conditions: prev.conditions?.map((c, i) => i === index ? value : c) || []
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Node</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Label
              </Label>
              <Input
                id="name"
                value={nodeInfo.label || ""}
                onChange={(e) => setNodeInfo(prev => ({ ...prev, label: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parent-node" className="text-right">
                Parent Node
              </Label>
              <Select
                onValueChange={(value) => setNodeInfo(prev => ({ ...prev, parentId: value }))}
                value={nodeInfo.parentId || undefined}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a parent node" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {nodes &&
                    nodes.map((node) => (
                      <SelectItem key={node.id} value={node.id}>
                        {node.data.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="node-type" className="text-right">
                Type of Node
              </Label>
              <Select
                onValueChange={(value) => setNodeInfo(prev => ({ ...prev, type: value }))}
                value={nodeInfo.type || undefined}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue
                    placeholder={loading ? "Loading..." : "Select node type"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {error && (
                    <SelectItem value="error" disabled>
                      Error loading node types
                    </SelectItem>
                  )}
                  {nodeTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {nodeInfo.parentId && nodeInfo.parentId !== "none" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Conditions</Label>
                <div className="col-span-3 space-y-2">
                  {nodeInfo.conditions?.map((condition, index) => (
                    <Input
                      key={index}
                      value={condition}
                      onChange={(e) =>
                        handleConditionChange(index, e.target.value)
                      }
                      placeholder={`Condition ${index + 1}`}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCondition}
                  >
                    Add Condition
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Add Node</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
