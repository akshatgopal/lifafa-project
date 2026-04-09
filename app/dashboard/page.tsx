import { Search, SlidersHorizontal, ChevronDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { LedgerTable } from "@/components/dashboard/ledger-table";
import { MOCK_LEDGER_ENTRIES } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between border-b border-border px-8 py-4">
        <div>
          <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-foreground">
            Gift Ledger
          </h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Sharma–Verma Wedding · 9 April 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload strokeWidth={1.5} />
            Export CSV
          </Button>
          <Button size="sm" asChild>
            <a href="/capture">+ New Entry</a>
          </Button>
        </div>
      </header>

      <div className="flex-1 px-8 py-6 space-y-6">
        <StatsCards entries={MOCK_LEDGER_ENTRIES} />

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" strokeWidth={2} />
            <Input placeholder="Search guests..." className="pl-8 h-8" />
          </div>
          <Button variant="outline" size="sm">Status <ChevronDown className="h-3.5 w-3.5 opacity-50" /></Button>
          <Button variant="outline" size="sm">Type <ChevronDown className="h-3.5 w-3.5 opacity-50" /></Button>
          <Button variant="outline" size="sm" className="ml-auto">
            <SlidersHorizontal strokeWidth={1.75} /> Filters
          </Button>
        </div>

        <LedgerTable entries={MOCK_LEDGER_ENTRIES} />
      </div>
    </div>
  );
}