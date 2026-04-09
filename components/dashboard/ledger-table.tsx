import { Image as ImageIcon, Mic, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LedgerEntry, LedgerStatus } from "@/types/ledger";

interface LedgerTableProps {
  entries: LedgerEntry[];
}

const statusConfig: Record<LedgerStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  PROCESSING: { label: "Processing", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  COMPLETED: { label: "Completed", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  FAILED: { label: "Failed", className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

const entryTypeConfig: Record<string, { label: string; icon: React.ElementType }> = {
  CASH: { label: "Cash", icon: DollarSign },
  ENVELOPE: { label: "Envelope", icon: ImageIcon },
  VOICE: { label: "Voice", icon: Mic },
  MANUAL: { label: "Manual", icon: DollarSign },
};

function StatusBadge({ status }: { status: LedgerStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={`text-[11px] ${config.className}`}>
      {config.label}
    </Badge>
  );
}

function EntryTypeBadge({ type }: { type: string }) {
  const config = entryTypeConfig[type];
  if (!config) return <Badge variant="secondary" className="text-[11px]">{type}</Badge>;
  const Icon = config.icon;
  return (
    <Badge variant="secondary" className="text-[11px] gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export function LedgerTable({ entries }: LedgerTableProps) {
  const totalAmount = entries.reduce((s, e) => s + e.amount, 0);

  return (
    <Card className="p-0 gap-0">
      <Table>
        <TableHeader>
          <TableRow>
            {["Status", "Amount", "Extracted Name", "Type", "Media", "Created At"].map((col) => (
              <TableHead key={col} className="text-[11px] uppercase tracking-wider">{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell><StatusBadge status={entry.status} /></TableCell>
              <TableCell>
                <span className="text-sm font-semibold text-foreground"
                      style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
                  ₹{entry.amount.toLocaleString("en-IN")}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {entry.extracted_name || <span className="text-muted-foreground/40">—</span>}
              </TableCell>
              <TableCell>
                <EntryTypeBadge type={entry.entry_type} />
              </TableCell>
              <TableCell>
                {entry.media_url ? (
                  <Button variant="ghost" size="icon-xs" title="View Media">
                    {entry.entry_type === "VOICE" ? (
                      <Mic strokeWidth={1.75} />
                    ) : (
                      <ImageIcon strokeWidth={1.75} />
                    )}
                  </Button>
                ) : (
                  <span className="text-muted-foreground/30">—</span>
                )}
              </TableCell>
              <TableCell className="text-[12px] text-muted-foreground/60 tabular-nums">
                {new Date(entry.created_at).toLocaleString("en-IN", { 
                  day: "numeric", 
                  month: "short", 
                  hour: "numeric", 
                  minute: "2-digit"
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Separator />
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-xs text-muted-foreground">Showing {entries.length} entries</p>
        <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
          Total: <span className="text-primary">₹{totalAmount.toLocaleString("en-IN")}</span>
        </p>
      </div>
    </Card>
  );
}