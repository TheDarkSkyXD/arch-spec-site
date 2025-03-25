import React, { useState } from "react";
import { Textarea } from "./textarea";
import Button from "./Button";
import { Label } from "./label";
import { Lightbulb } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog";

interface AIInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (instructions: string) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  defaultInstructions?: string;
  additionalOptions?: React.ReactNode; // Add this prop
}

const AIInstructionsModal: React.FC<AIInstructionsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Enhance",
  cancelText = "Cancel",
  defaultInstructions = "",
  additionalOptions,
}) => {
  const [instructions, setInstructions] = useState(defaultInstructions);

  const handleConfirm = () => {
    onConfirm(instructions);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="py-4">
          {/* Render additional options if provided */}
          {additionalOptions}
          
          <div className="space-y-2">
            <Label htmlFor="ai-instructions">
              Custom AI Instructions (Optional)
            </Label>
            <Textarea
              id="ai-instructions"
              rows={5}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter any specific instructions for the AI enhancement..."
              className="w-full"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Leave blank to use default AI behavior, or provide specific
              guidance like "Focus on scalability" or "Target enterprise
              customers"
            </p>
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} type="button">
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} type="button">
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIInstructionsModal;
