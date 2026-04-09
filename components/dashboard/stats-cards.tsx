import { CheckCircle2, Clock, AlertTriangle, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { LedgerEntry, LedgerStatus } from "@/types/ledger";

interface StatsCardsProps {
  entries: LedgerEntry[];
}

export function StatsCards({ entries }: StatsCardsProps) {
  const totalAmount = entries.reduce((s, e) => s + e.amount, 0);
  const completedCount = entries.filter((e) => e.status === "COMPLETED").length;
  const pendingCount = entries.filter((e) => e.status === "PENDING").length;
  const processingCount = entries.filter((e) => e.status === "PROCESSING").length;
  const failedCount = entries.filter((e) => e.status === "FAILED").length;

  const stats = [
    { label: "Total Collected", value: `₹${totalAmount.toLocaleString("en-IN")}`, sub: `${entries.length} entries`, icon: IndianRupee, color: "text-primary" },
    { label: "Completed", value: completedCount, sub: "Fully processed", icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Pending", value: pendingCount + processingCount, sub: "AI processing", icon: Clock, color: "text-yellow-600" },
    { label: "Failed", value: failedCount, sub: "Need attention", icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map(({ label, value, sub, icon: Icon, color }) => (
        <Card key={label} size="sm">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <CardDescription>{label}</CardDescription>
              <Icon className={`h-4 w-4 ${color}`} strokeWidth={1.75} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold tracking-tight text-foreground"
               style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
              {value}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}