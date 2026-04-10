"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { X, CheckCircle2, Loader2 } from "lucide-react";

interface NumpadProps {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saveDisabled?: boolean;
  saveDisabledReason?: string;
  saving?: boolean;
}

export function Numpad({ value, onChange, onSave, onCancel, saveDisabled, saveDisabledReason, saving }: NumpadProps) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

  function handleKey(k: string) {
    if (k === "⌫") onChange(value.slice(0, -1));
    else if (k === "." && value.includes(".")) return;
    else onChange(value + k);
  }

  const isDisabled = saveDisabled || saving;

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0">
      {/* Amount display */}
      <div className="flex items-end gap-1 justify-center py-3 border-b border-border shrink-0">
        <span className="text-xl font-medium text-muted-foreground pb-0.5">₹</span>
        <span className="text-4xl font-semibold text-foreground tracking-tight min-w-[100px] text-center"
              style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
          {value || "0"}
        </span>
      </div>

      {/* Keys */}
      <div className="grid grid-cols-3 gap-2 flex-1 min-h-0">
        {keys.map((k) => (
          <Button
            key={k}
            variant={k === "⌫" ? "ghost" : "secondary"}
            className={`h-full text-lg ${k === "⌫" ? "hover:bg-destructive/15 hover:text-destructive text-sm" : ""}`}
            style={k !== "⌫" ? { fontFamily: "var(--font-ibm-plex-mono)" } : undefined}
            onClick={() => handleKey(k)}
          >
            {k}
          </Button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" className="flex-1" onClick={onCancel} disabled={saving}>
          <X strokeWidth={2} /> Cancel
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* span wrapper needed so tooltip fires even when button is disabled */}
              <span className={isDisabled ? "flex-1 cursor-not-allowed" : "flex-1"}>
                <Button className="w-full" onClick={onSave} disabled={isDisabled}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 strokeWidth={2.5} />}
                  {saving ? "Saving…" : "Save"}
                </Button>
              </span>
            </TooltipTrigger>
            {isDisabled && saveDisabledReason && (
              <TooltipContent side="top">{saveDisabledReason}</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
