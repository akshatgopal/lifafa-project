"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { LedgerTable } from "@/components/dashboard/ledger-table";
import { api } from "@/lib/api";
import type { LedgerEntry } from "@/types/ledger";
import { useWeddingStore } from "@/store/wedding-store";

function formatEventDate(date: string | null): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DashboardPage() {
  // Under WeddingGuard this is guaranteed non-null.
  const wedding = useWeddingStore((s) => s.wedding)!;

  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchEntries() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.listLedger(wedding.id);
        if (!cancelled) setEntries(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load ledger"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchEntries();
    return () => {
      cancelled = true;
    };
  }, [wedding.id]);

  const dateLabel = formatEventDate(wedding.event_date);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between border-b border-border px-8 py-4">
        <div>
          <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-foreground">
            Gift Ledger
          </h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {wedding.event_name}
            {dateLabel ? ` · ${dateLabel}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload strokeWidth={1.5} />
            Export CSV
          </Button>
          <Button size="sm" asChild>
            <Link href="/capture">+ New Entry</Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 px-8 py-6 space-y-6">
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[100px] rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-10 max-w-xs" />
            <Skeleton className="h-[300px] rounded-xl" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : (
          <>
            <StatsCards entries={entries} />

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

            <LedgerTable entries={entries} />
          </>
        )}
      </div>
    </div>
  );
}
