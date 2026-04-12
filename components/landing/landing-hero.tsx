"use client";

import Link from "next/link";
import { Camera, Mic, PenLine, ShieldCheck, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const features = [
  {
    icon: Camera,
    title: "Snap & Type",
    copy: "Photograph every lifafa. Local AI extracts the name. You log the amount in seconds.",
  },
  {
    icon: Mic,
    title: "Voice Munshi",
    copy: "Hold to speak. Dictate guest and amount on the fly — no typing, no slowdowns.",
  },
  {
    icon: PenLine,
    title: "Manual Fallback",
    copy: "A fast numeric form when cash is handed over without an envelope.",
  },
  {
    icon: ShieldCheck,
    title: "Private by Default",
    copy: "All AI runs locally via Ollama. Your guest list never leaves your machine.",
  },
];

export function LandingHero() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 right-0 h-[360px] w-[360px] rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10 sm:px-8">
        {/* Header / brand */}
        <header className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30 overflow-hidden">
            <Image src="/munshi.png" alt="Lifafa logo" width={40} height={40} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col gap-2 leading-none">
            <span
              className="text-[22px] font-semibold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Lifafa
            </span>
            <span className="text-[12px] text-muted-foreground">
              Your Digital Munshi
            </span>
          </div>
        </header>

        {/* Hero */}
        <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[12px] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Private, local-first wedding ledger
          </span>

          <h1
            className="max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Every lifafa.
            <br />
            <span className="italic text-primary">Counted, credited, calm.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Lifafa is a high-speed, secure digital ledger for Indian weddings.
            Capture cash gifts through photo, voice, or a quick form —
            while the AI quietly sorts it all in the background.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3">
            <Button asChild size="lg" className="group h-12 px-8 text-[15px]">
              <Link href="/weddings">
                Continue
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70">
              Pick or create your wedding to get started
            </span>
          </div>
        </section>

        {/* Feature grid */}
        <section className="grid grid-cols-1 gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, copy }) => (
            <div
              key={title}
              className="rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur transition-colors hover:bg-card"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20">
                <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
              </div>
              <h3 className="text-[14px] font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                {copy}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
