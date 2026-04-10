"use client";

import { useState } from "react";
import { Sparkles, Database, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatMessage, ThinkingIndicator } from "@/components/munshi/chat-message";
import { ChatInput } from "@/components/munshi/chat-input";
import { api } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const EXAMPLE_PROMPTS = [
  "What's the total amount collected so far?",
  "How many blank envelopes need review?",
  "Total from Groom's side?",
  "Who gave the most?",
];

const INITIAL_MESSAGES: Message[] = [
  { id: "1", role: "assistant", content: "Salaam! I'm Munshi, your AI ledger assistant. I have access to your complete gift ledger and can answer questions about totals, guests, pending items, and more.\n\nWhat would you like to know?", timestamp: "11:30 AM" },
];

function nowTimestamp(): string {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function MunshiPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isThinking, setIsThinking] = useState(false);

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: nowTimestamp(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const { answer } = await api.chat(text);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: answer,
          timestamp: nowTimestamp(),
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Sorry, I couldn't reach the ledger right now. (${message})`,
          timestamp: nowTimestamp(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-8 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/25">
            <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-foreground">Ask Munshi</h1>
            <p className="text-[13px] text-muted-foreground">Powered by local Llama 3 · Private &amp; offline</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Database className="h-3 w-3" strokeWidth={1.75} /> Ledger synced
          </Badge>
          <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/10 text-primary">
            <Zap className="h-3 w-3" strokeWidth={2} /> Ollama running
          </Badge>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {EXAMPLE_PROMPTS.map((p) => (
              <Button key={p} variant="outline" size="sm" className="rounded-full text-xs h-7" onClick={() => sendMessage(p)}>
                {p}
              </Button>
            ))}
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
        ))}

        {isThinking && <ThinkingIndicator />}
      </div>

      <ChatInput onSend={sendMessage} disabled={isThinking} />
    </div>
  );
}
