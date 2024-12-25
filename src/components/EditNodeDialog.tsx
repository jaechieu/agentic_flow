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

interface EditNodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (
    id: string,
    newLabel: string,
    newParentId: string | null,
    newConditions: string[]
  ) => void;
  onDelete: (id: string) => void;
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
  const [label, setLabel] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [conditions, setConditions] = useState<string[]>([""]);

  useEffect(() => {
    if (node) {
      setLabel(node.data.label);
      const parentEdge = edges.find((edge) => edge.target === node.id);
      setParentId(parentEdge ? parentEdge.source : null);
      setConditions(
        parentEdge && parentEdge.data.conditions
          ? parentEdge.data.conditions
          : [""]
      );
    }
  }, [node, edges]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (node && label.trim()) {
      onEdit(
        node.id,
        label.trim(),
        parentId,
        conditions.filter((c) => c.trim() !== "")
      );
    }
  };

  const handleDelete = () => {
    if (node) {
      onDelete(node.id);
    }
  };

  const handleAddCondition = () => {
    setConditions([...conditions, ""]);
  };

  const handleConditionChange = (index: number, value: string) => {
    const newConditions = [...conditions];
    newConditions[index] = value;
    setConditions(newConditions);
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
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parent-node" className="text-right">
                Parent Node
              </Label>
              <Select onValueChange={setParentId} value={parentId || undefined}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a parent node" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {nodes
                    .filter((n) => n.id !== node?.id)
                    .map((n) => (
                      <SelectItem key={n.id} value={n.id}>
                        {n.data.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {parentId && parentId !== "none" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Conditions</Label>
                <div className="col-span-3 space-y-2">
                  {conditions.map((condition, index) => (
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
