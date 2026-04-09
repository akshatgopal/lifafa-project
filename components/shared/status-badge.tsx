"use client";

import { CheckCircle2, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Status } from "@/types/ledger";

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "COMPLETED")
    return (
      <Badge variant="outline" className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} /> Done
      </Badge>
    );
  if (status === "PENDING")
    return (
      <Badge variant="outline" className="status-pending gap-1.5 border-primary/30 bg-primary/10 text-primary">
        <Clock className="h-3 w-3" strokeWidth={2.5} /> Pending
      </Badge>
    );
  if (status === "PROCESSING")
    return (
      <Badge variant="outline" className="gap-1.5 border-blue-500/30 bg-blue-500/10 text-blue-600">
        <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2.5} /> Processing
      </Badge>
    );
  return (
    <Badge variant="destructive" className="gap-1.5">
      <AlertTriangle className="h-3 w-3" strokeWidth={2.5} /> Failed
    </Badge>
  );
}