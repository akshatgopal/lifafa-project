# Lifafa — Your Digital Munshi

A high-speed, secure digital ledger for Indian weddings. Lifafa helps users quickly log cash gifts and *lifafas* (envelopes) using image capture, voice dictation, and manual entry. AI processing runs entirely locally via [Ollama](https://ollama.com/) for maximum privacy and zero API costs.

## Features

- **Capture Hub** — Three modes for logging gifts at speed during the event:
  - *Snap & Type* — photograph the envelope, punch in the amount on a numpad
  - *Voice Munshi* — hold-to-speak dictation ("Suresh uncle gave 2100 cash"), AI extracts name + amount
  - *Manual Entry* — fallback form when cameras/mics aren't available
- **Gift Ledger Dashboard** — Real-time table of all entries with status tracking (Pending / Processing / Completed / Failed), amount totals, and media verification
- **Guest Directory** — Upload a CSV guest list or add guests manually; used for fuzzy-matching extracted names to known guests
- **Ask Munshi** — Chat interface powered by local Llama 3 to answer questions about your ledger ("Total from Groom's side?", "How many blank envelopes?")
- **AI Processing** — Local LLaVA extracts handwriting from envelope photos; speech-to-text handles voice entries; a background worker syncs results to Supabase automatically

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui, Radix primitives |
| State | Zustand |
| Backend | Supabase (Postgres DB + Storage buckets) |
| AI | Ollama (LLaVA for vision, Llama 3 for chat) — runs locally |
| Forms | react-hook-form + Zod |
| CSV | PapaParse |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project with the schema from `SQL-FORMAT.md`
- [Ollama](https://ollama.com/) running locally (for AI features)

### Setup

```bash
# Install dependencies
npm install

# Create .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434  # optional, this is the default

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the dashboard.

### Database Setup

Create the two tables in your Supabase SQL editor using the schema in `SQL-FORMAT.md`:

- **guests** — id, name, relation, phone, address
- **ledger** — id, guest_id (FK), amount, extracted_name, status, entry_type, media_url

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/
  dashboard/    — Gift ledger view with stats + data table
  capture/      — Camera, voice, and manual entry modes
  guests/       — Guest directory with CSV upload
  munshi/       — AI chat assistant

components/
  ui/           — shadcn/ui primitives
  dashboard/    — Stats cards, ledger table
  capture/      — Mode selector, snap mode, voice mode
  munshi/       — Chat message, chat input
  forms/        — Manual entry, add guest dialog, CSV upload dialog
  shared/       — App layout, sidebar, numpad, status badge

lib/
  supabase.ts   — Supabase client
  ollama.ts     — Ollama API helpers + prompt templates
  csv.ts        — CSV parsing utility
  mock-data.ts  — Sample ledger data for development

types/
  ledger.ts     — LedgerEntry, LedgerStatus, EntryType, CaptureMode
  guest.ts      — Guest, CSVRow
```

## License

Private project.
