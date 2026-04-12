"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CalendarDays, Plus, Mail, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeddingStore } from "@/store/wedding-store";
import { api } from "@/lib/api";
import type { Wedding } from "@/types/wedding";

import { CreateWeddingForm } from "./create-wedding-form";

function formatDate(date: string | null): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function WeddingSelector() {
  const router = useRouter();
  const setWedding = useWeddingStore((s) => s.setWedding);

  const [weddings, setWeddings] = useState<Wedding[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await api.listWeddings();
        if (!cancelled) setWeddings(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load weddings"
          );
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelect = (wedding: Wedding) => {
    setWedding(wedding);
    router.push("/dashboard");
  };

  const handleCreated = (wedding: Wedding) => {
    setWedding(wedding);
    router.push("/dashboard");
  };

  const loading = weddings === null && !error;
  const isEmpty = weddings !== null && weddings.length === 0;

  return (
    <div className="relative min-h-screen bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-6 py-12 sm:px-8">
        {/* Brand */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30 overflow-hidden">
            <Image src="/munshi.png" alt="Lifafa logo" width={36} height={36} className="h-full w-full object-cover" />
          </div>
          <span
            className="text-[20px] font-semibold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Lifafa
          </span>
        </div>

        {/* Heading */}
        <header className="mb-8">
          <h1
            className="text-4xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {isEmpty ? "Add your first wedding" : "Choose a wedding"}
          </h1>
          <p className="mt-2 text-[14px] text-muted-foreground">
            {isEmpty
              ? "You'll need at least one wedding before you can start logging lifafas."
              : "Select a wedding to open its ledger, or create a new one."}
          </p>
        </header>

        {/* Content */}
        {loading && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-[13px] text-destructive">
            {error}
          </div>
        )}

        {isEmpty && (
          <div className="rounded-xl border border-border/60 bg-card/60 p-6 backdrop-blur">
            <CreateWeddingForm onCreated={handleCreated} />
          </div>
        )}

        {weddings && weddings.length > 0 && (
          <>
            <ul className="flex flex-col gap-3">
              {weddings.map((w) => {
                const dateLabel = formatDate(w.event_date);
                return (
                  <li key={w.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(w)}
                      className="group flex w-full items-center gap-4 rounded-xl border border-border/60 bg-card/60 p-5 text-left backdrop-blur transition-colors hover:border-primary/40 hover:bg-card"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20">
                        <Mail className="h-4 w-4 text-primary" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className="truncate text-[15px] font-semibold text-foreground"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {w.event_name}
                        </div>
                        {dateLabel && (
                          <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                            <CalendarDays className="h-3 w-3" strokeWidth={1.75} />
                            {dateLabel}
                          </div>
                        )}
                      </div>
                      <ChevronRight
                        className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                        strokeWidth={1.75}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6">
              {showCreate ? (
                <div className="rounded-xl border border-border/60 bg-card/60 p-6 backdrop-blur">
                  <CreateWeddingForm onCreated={handleCreated} />
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreate(true)}
                  className="w-full"
                >
                  <Plus className="mr-1 h-4 w-4" strokeWidth={1.75} />
                  Add another wedding
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
