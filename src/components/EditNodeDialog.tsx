import { useState, useEffect } from "react";
import { Node, Edge } from "reactflow";
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

interface EditNodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (nodeInfo: NodeInfo) => void;
  onDelete: (nodeInfo: NodeInfo) => void;
  node: Node | null;
  nodes: Node[];
  edges: Edge[];
}

export default function EditNodeDialog({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  node,
  nodes,
  edges,
}: EditNodeDialogProps) {
  const [nodeInfo, setNodeInfo] = useState<NodeInfo | null>(null);
  const { nodeTypes, loading, error } = useNodeTypes();

  useEffect(() => {
    if (node) {
      const parentEdge = edges.find((edge) => edge.target === node.id);
      const currentNodeInfo = new NodeInfo(
        node.data.label,
        node.data.type,
        parentEdge?.source || null,
        node.data.conditions || [],
        node.position
      );
      currentNodeInfo.id = node.id;
      setNodeInfo(currentNodeInfo);
    }
  }, [node, edges]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nodeInfo) {
      onEdit(nodeInfo);
    }
  };

  const handleDelete = () => {
    if (nodeInfo) {
      onDelete(nodeInfo);
    }
  };

  const handleAddCondition = () => {
    setNodeInfo((prev) => {
      if (!prev) return null;
      return new NodeInfo(
        prev.label,
        prev.type,
        prev.parentId,
        [...prev.conditions, ""],
        prev.position
      );
    });
  };

  const handleConditionChange = (index: number, value: string) => {
    setNodeInfo((prev) => {
      if (!prev) return null;
      return new NodeInfo(
        prev.label,
        prev.type,
        prev.parentId,
        prev.conditions.map((c, i) => (i === index ? value : c)),
        prev.position
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Node</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Label
              </Label>
              <Input
                id="name"
                value={nodeInfo?.label || ""}
                onChange={(e) =>
                  setNodeInfo((prev) => {
                    if (!prev) return null;
                    return new NodeInfo(
                      e.target.value,
                      prev.type,
                      prev.parentId,
                      prev.conditions,
                      prev.position
                    );
                  })
                }
                className="col-span-3"
              />
            </div>
            {/* Rest of your form fields similarly updated */}
          </div>
          <DialogFooter>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
