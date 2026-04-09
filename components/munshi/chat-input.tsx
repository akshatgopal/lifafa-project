"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  function handleSend() {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  }

  return (
    <div className="border-t border-border px-8 py-4 shrink-0 space-y-2">
      <div className="flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask about totals, guests, pending items..."
          className="flex-1 h-10"
        />
        <Button size="icon" onClick={handleSend} disabled={!input.trim() || disabled}>
          <Send className="h-4 w-4" strokeWidth={2} />
        </Button>
      </div>
      <p className="text-center text-[10px] text-muted-foreground/40">
        Running locally via Ollama · No data leaves your device
      </p>
    </div>
  );
}
