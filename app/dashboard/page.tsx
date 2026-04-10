"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { LedgerTable } from "@/components/dashboard/ledger-table";
import { supabase } from "@/lib/supabase";
import type { LedgerEntry } from "@/types/ledger";

export default function DashboardPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEntries() {
      const { data, error: dbError } = await supabase
        .from("ledger")
        .select("*")
        .order("created_at", { ascending: false });

      if (dbError) {
        setError(dbError.message);
      } else {
        setEntries(data as LedgerEntry[]);
      }
      setLoading(false);
    }

    fetchEntries();
  }, []);

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
