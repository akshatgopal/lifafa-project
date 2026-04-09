"use client";

import { useState } from "react";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface VoiceModeProps {
  onCancel: () => void;
}

export function VoiceMode({ onCancel }: VoiceModeProps) {
  const [voiceActive, setVoiceActive] = useState(false);

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">Hold the button and dictate</p>
        <p className="text-xs text-muted-foreground/60 italic">&ldquo;Ramesh uncle gave 2100 cash&rdquo;</p>
      </div>
      <button
        onMouseDown={() => setVoiceActive(true)} onMouseUp={() => setVoiceActive(false)}
        onTouchStart={() => setVoiceActive(true)} onTouchEnd={() => setVoiceActive(false)}
        className={`relative flex h-28 w-28 items-center justify-center rounded-full transition-all select-none ${
          voiceActive ? "bg-primary scale-110 shadow-[0_0_40px_hsl(var(--primary)/0.35)]" : "bg-secondary hover:bg-accent border border-border"
        }`}
      >
        {voiceActive && <>
          <span className="absolute h-full w-full rounded-full bg-primary/20 animate-ping" />
          <span className="absolute h-[120%] w-[120%] rounded-full bg-primary/10 animate-ping" />
        </>}
        <Mic className={`relative h-9 w-9 ${voiceActive ? "text-primary-foreground" : "text-muted-foreground"}`} strokeWidth={1.75} />
      </button>
      <p className="text-sm text-muted-foreground">
        {voiceActive ? <span className="text-primary font-medium status-pending">Recording...</span> : "Hold to record"}
      </p>
      <Card className="w-full min-h-[80px] flex items-center justify-center">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground/50 italic text-center">Transcript will appear here after recording</p>
        </CardContent>
      </Card>
      <Button variant="outline" className="w-full" onClick={onCancel}>Cancel</Button>
    </div>
  );
}
