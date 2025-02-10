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
import { NodeInfo } from "@/types/graph";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (nodeInfo) {
      onDelete(nodeInfo);
      setShowDeleteConfirm(false);
    }
  };

  const handleAddCondition = () => {
    setNodeInfo((prev) => {
      if (!prev) return null;
      return updateNodeInfo(prev, {
        conditions: [...prev.conditions, ""],
      });
    });
  };

  const handleConditionChange = (index: number, value: string) => {
    setNodeInfo((prev) => {
      if (!prev) return null;
      return updateNodeInfo(prev, {
        conditions: prev.conditions.map((c, i) => (i === index ? value : c)),
      });
    });
  };

  const updateNodeInfo = (
    prev: NodeInfo | null,
    updates: Partial<NodeInfo>
  ) => {
    if (!prev) return null;
    const newNodeInfo = new NodeInfo(
      updates.label ?? prev.label,
      updates.type ?? prev.type,
      updates.parentId ?? prev.parentId,
      updates.conditions ?? prev.conditions,
      updates.position ?? prev.position
    );
    newNodeInfo.id = prev.id;
    return newNodeInfo;
  };

  return (
    <>
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
                    setNodeInfo((prev) =>
                      updateNodeInfo(prev, { label: e.target.value })
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parent-node" className="text-right">
                  Parent Node
                </Label>
                <Select
                  onValueChange={(value) =>
                    setNodeInfo((prev) =>
                      updateNodeInfo(prev, { parentId: value })
                    )
                  }
                  value={nodeInfo?.parentId || undefined}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a parent node" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {nodes &&
                      nodes
                        .filter((n) => n.id !== nodeInfo?.id)
                        .map((node) => (
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
                  onValueChange={(value) =>
                    setNodeInfo((prev) => updateNodeInfo(prev, { type: value }))
                  }
                  value={nodeInfo?.type || undefined}
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
              {nodeInfo?.parentId && nodeInfo.parentId !== "none" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Conditions</Label>
                  <div className="col-span-3 space-y-2">
                    {nodeInfo.conditions.map((condition, index) => (
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
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Node</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this node? This action cannot be
            undone.
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
