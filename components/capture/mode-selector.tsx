"use client";

import { Camera, Mic, PenLine, ChevronRight, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CaptureMode } from "@/types/ledger";

interface ModeSelectorProps {
  onSelect: (mode: CaptureMode) => void;
}

const modes = [
  {
    id: "snap" as CaptureMode,
    icon: Camera,
    title: "Snap & Type",
    description: "Capture or upload a photo of the lifafa, then enter the cash amount found inside.",
    badge: "Most used",
    badgeClass: "border-primary/30 bg-primary/10 text-primary"
  },
  {
    id: "voice" as CaptureMode,
    icon: Mic,
    title: "Voice Munshi",
    description: 'Hold the mic and say "Ramesh uncle gave 2100 cash". AI extracts name and amount automatically.',
    badge: "AI powered",
    badgeClass: "border-blue-400/30 bg-blue-400/10 text-blue-500 dark:text-blue-400"
  },
  {
    id: "manual" as CaptureMode,
    icon: PenLine,
    title: "Manual Entry",
    description: "Fallback option. Fill in name, amount, type, and relation directly. No camera or mic required.",
    badge: "Fallback",
    badgeClass: ""
  },
];

export function ModeSelector({ onSelect }: ModeSelectorProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      <p className="text-[13px] font-medium text-muted-foreground mb-4">Select capture method</p>

      {modes.map(({ id, icon: Icon, title, description, badge, badgeClass }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className="group w-full flex items-center gap-5 rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary/30 hover:bg-card/80"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary ring-1 ring-border group-hover:bg-primary/10 group-hover:ring-primary/25 transition-all">
            <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground text-sm">{title}</span>
              <Badge variant="outline" className={`text-[10px] h-4 ${badgeClass}`}>{badge}</Badge>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
        </button>
      ))}

      <div className="mt-2 flex items-start gap-3 rounded-xl border border-dashed border-border p-4">
        <Hash className="h-4 w-4 text-muted-foreground/50 mt-0.5 shrink-0" strokeWidth={1.75} />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Tip:</span> Use Snap &amp; Type for envelopes and Voice Munshi for direct cash — fastest combo during the event.
        </p>
      </div>
    </div>
  );
}
