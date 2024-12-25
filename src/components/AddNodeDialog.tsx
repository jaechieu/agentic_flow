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
import { PlusCircle } from "lucide-react";

interface AddNodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    label: string,
    parentNodeId: string | null,
    conditions: string[]
  ) => void;
  nodes: Node[];
}

export default function AddNodeDialog({
  isOpen,
  onClose,
  onAdd,
  nodes,
}: AddNodeDialogProps) {
  const [label, setLabel] = useState("");
  const [parentNodeId, setParentNodeId] = useState<string | null>(null);
  const [conditions, setConditions] = useState<string[]>([""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label.trim()) {
      onAdd(
        label.trim(),
        parentNodeId,
        conditions.filter((c) => c.trim() !== "")
      );
      setLabel("");
      setParentNodeId(null);
      setConditions([""]);
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
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parent-node" className="text-right">
                Parent Node
              </Label>
              <Select
                onValueChange={setParentNodeId}
                value={parentNodeId || undefined}
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
            {parentNodeId && parentNodeId !== "none" && (
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
            <Button type="submit">Add Node</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
