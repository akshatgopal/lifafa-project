"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface ManualEntryFormProps {
  onCancel: () => void;
  onSave: () => void;
}

export function ManualEntryForm({ onCancel, onSave }: ManualEntryFormProps) {
  return (
    <div className="space-y-4">
      {[
        { label: "Guest Name", placeholder: "e.g. Ramesh Chauhan", type: "text" },
        { label: "Amount (₹)", placeholder: "e.g. 2100", type: "number" }
      ].map(({ label, placeholder, type }) => (
        <div key={label} className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
          <Input type={type} placeholder={placeholder} className="h-10" />
        </div>
      ))}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</label>
        <div className="grid grid-cols-2 gap-2">
          {["Cash", "Envelope"].map((t, i) => (
            <Button key={t} variant={i === 0 ? "default" : "outline"} className="w-full">{t}</Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Relation / Tag</label>
        <Input placeholder="e.g. Bride's Uncle" className="h-10" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes (optional)</label>
        <textarea
          rows={2}
          placeholder="Any additional notes..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
        />
      </div>
      <Separator />
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button className="flex-1" onClick={onSave}><CheckCircle2 strokeWidth={2.5} /> Save Entry</Button>
      </div>
    </div>
  );
}
