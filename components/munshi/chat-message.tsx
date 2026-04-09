import { Bot, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${role === "user" ? "flex-row-reverse" : ""}`}>
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5 ${
        role === "assistant" ? "bg-primary/12 ring-1 ring-primary/25" : "bg-secondary ring-1 ring-border"
      }`}>
        {role === "assistant"
          ? <Bot className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
          : <User className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />}
      </div>
      <Card className={`max-w-[72%] ${role === "user" ? "bg-primary/10 ring-primary/20" : ""}`}>
        <CardContent className="px-4 py-3">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{content}</p>
          <p className="mt-1.5 text-[10px] text-muted-foreground/50 text-right tabular-nums">{timestamp}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function ThinkingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/12 ring-1 ring-primary/25 mt-0.5">
        <Bot className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
      </div>
      <Card>
        <CardContent className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            {[0, 150, 300].map((delay) => (
              <span key={delay} className="h-1.5 w-1.5 rounded-full bg-primary/60"
                    style={{ animation: `pending-pulse 1.2s ease-in-out ${delay}ms infinite` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
