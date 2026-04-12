"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/lib/api";
import type { EntryType } from "@/types/ledger";
import { useWeddingStore } from "@/store/wedding-store";

interface ManualEntryFormProps {
  onCancel: () => void;
}

export function ManualEntryForm({ onCancel }: ManualEntryFormProps) {
  const router = useRouter();
  // Under WeddingGuard this is guaranteed non-null.
  const wedding = useWeddingStore((s) => s.wedding)!;
  const [extractedName, setExtractedName] = useState("");
  const [amount, setAmount] = useState("");
  const [entryType, setEntryType] = useState<EntryType>("CASH");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    setSaving(true);

    try {
      await api.createManual(wedding.id, {
        amount: parseInt(amount, 10),
        extracted_name: extractedName.trim(),
        entry_type: entryType as "CASH" | "ENVELOPE",
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save entry");
      setSaving(false);
    }
  }

  const parsedAmount = parseInt(amount, 10);
  const saveDisabled = !extractedName.trim() || !amount || isNaN(parsedAmount) || parsedAmount <= 0;
  const saveDisabledReason = !extractedName.trim() && (!amount || isNaN(parsedAmount) || parsedAmount <= 0)
    ? "Enter a name and amount to save"
    : !extractedName.trim()
    ? "Enter a guest name to save"
    : "Enter an amount greater than ₹0 to save";

  const entryTypes: { label: string; value: EntryType }[] = [
    { label: "Cash", value: "CASH" },
    { label: "Envelope", value: "ENVELOPE" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Guest Name
        </Label>
        <Input
          type="text"
          placeholder="e.g. Ramesh Chauhan"
          className="h-10"
          value={extractedName}
          onChange={(e) => setExtractedName(e.target.value)}
          disabled={saving}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Amount (₹)
        </Label>
        <Input
          type="number"
          placeholder="e.g. 2100"
          className="h-10"
          min={0}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={saving}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Type
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {entryTypes.map(({ label, value }) => (
            <Button
              key={value}
              type="button"
              variant={entryType === value ? "default" : "outline"}
              className="w-full"
              onClick={() => setEntryType(value)}
              disabled={saving}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Separator />

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={(saveDisabled || saving) ? "flex-1 cursor-not-allowed" : "flex-1"}>
                <Button className="w-full" onClick={handleSave} disabled={saveDisabled || saving}>
                  {saving ? <Loader2 className="animate-spin" /> : <CheckCircle2 strokeWidth={2.5} />}
                  {saving ? "Saving…" : "Save Entry"}
                </Button>
              </span>
            </TooltipTrigger>
            {saveDisabled && (
              <TooltipContent side="top">{saveDisabledReason}</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
