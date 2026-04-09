# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Do not make any changes until you have 95% confidence in what you need to build. Ask follow-up questions until you reach that confidence level.

## Overview

Lifafa is a high-speed, secure digital ledger for Indian weddings. It logs cash gifts and lifafas (envelopes) via image capture, voice dictation, and manual entry. AI processing runs locally via Ollama (LLaVA for vision, Llama 3 for chat) for privacy and zero API costs.

## Commands

- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm run lint` — run ESLint

No test framework is configured yet.

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Supabase, Zustand (state), Ollama (local AI).

**Routing:** App Router with pages at `/dashboard`, `/capture`, `/guests`, `/munshi`. Root `/` redirects to `/dashboard`.

**Data flow:** Frontend uses Supabase client (`lib/supabase.ts`) with env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Ollama runs at `NEXT_PUBLIC_OLLAMA_URL` (defaults to `http://localhost:11434`), accessed via `lib/ollama.ts`.

**Database schema** (Supabase/Postgres): Two tables — `guests` (id, name, relation, phone, address) and `ledger` (id, guest_id FK, amount, extracted_name, status, entry_type, media_url). Status values: PENDING, PROCESSING, COMPLETED, FAILED. Entry types: CASH, ENVELOPE, VOICE, MANUAL. See `SQL-FORMAT.md` for full DDL.

**Types:** Defined in `types/ledger.ts` — `GiftEntry`, `Status`, `GiftType`, `CaptureMode`. Note: frontend types use camelCase (`extractedName`) while DB uses snake_case (`extracted_name`).

**Theming:** Custom dual-theme system — light ("Morning Parchment", warm amber) and dark ("Evening Slate", cool blue-grey with amber accent). Uses oklch colors in `globals.css`. Three fonts: DM Sans (body via `--font-sans`), Playfair Display (headings via `--font-heading`), IBM Plex Mono (mono via `--font-mono`).

**Key patterns:**
- Path alias: `@/*` maps to project root
- UI components from shadcn in `components/ui/`
- Forms use react-hook-form + zod validation
- CSV parsing via papaparse
- `lib/mock-data.ts` has sample data for development
- A separate `local-worker/` directory is planned for background AI processing (polls Supabase, runs LLaVA/Llama, updates DB)

## MVP Scope

### 1. Guest List Management
CSV upload with column mapping (Name, Relation/Tag). Guest directory UI with search and manual add/edit.

### 2. Capture Hub (Data Entry — must be mobile-first and fast)
- **Snap & Type:** Camera photo of lifafa, then numpad for amount, background upload, status=PENDING
- **Voice Munshi:** Hold-to-speak, dictate name+amount, upload audio, trigger extraction
- **Manual Fallback:** Standard form for Name, Amount, Type

### 3. Ledger Dashboard
Real-time data grid with status indicators (PENDING/COMPLETED/FAILED), media verification (view image/play audio), fuzzy name matching against guest list with dropdown to confirm matches.

### 4. AI Processing Engine
Local LLaVA for handwriting extraction from envelope images. Local speech-to-text for voice entries. Background worker auto-syncs results to Supabase.

### 5. Ask Munshi (Chat)
Side-panel chat powered by local Llama 3. Fetches completed ledger data and answers questions like "What's the total cash from the Groom's side?"
