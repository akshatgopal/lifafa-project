"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModeSelector } from "@/components/capture/mode-selector";
import { SnapMode } from "@/components/capture/snap-mode";
import { VoiceMode } from "@/components/capture/voice-mode";
import { ManualEntryForm } from "@/components/forms/manual-entry-form";
import { CaptureMode } from "@/types/ledger";

export default function CapturePage() {
  const [activeMode, setActiveMode] = useState<CaptureMode | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between border-b border-border px-8 py-4">
        <div>
          <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-foreground">Capture Hub</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">Log a new gift — choose your capture method</p>
        </div>
        <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1.5">
          <Zap className="h-3.5 w-3.5 text-primary" strokeWidth={2} /> Fast Mode
        </Badge>
      </header>

      <div className="flex-1 px-8 py-8">
        {!activeMode ? (
          <ModeSelector onSelect={setActiveMode} />
        ) : (
          <div className={activeMode === "snap" ? "max-w-4xl mx-auto" : "max-w-md mx-auto"}>
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 -ml-2 text-muted-foreground"
              onClick={() => setActiveMode(null)}
            >
              ← Back to modes
            </Button>

            {activeMode === "snap" && <SnapMode onDone={() => setActiveMode(null)} />}
            {activeMode === "voice" && <VoiceMode onCancel={() => setActiveMode(null)} />}
            {activeMode === "manual" && <ManualEntryForm onCancel={() => setActiveMode(null)} onSave={() => setActiveMode(null)} />}
          </div>
        )}
      </div>
    </div>
  );
}
