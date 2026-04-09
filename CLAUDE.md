# CLAUDE.md

> Akshat:

# Lifafa MVP - Project Architecture & Setup

## 📖 Overview

The Lifafa app is a high-speed, secure digital ledger for Indian weddings. It allows users to quickly log cash gifts and _lifafas_ (envelopes) using a hybrid approach of image capture, voice dictation, and manual entry. AI processing is handled locally via Ollama for maximum privacy and zero API costs.

---

## ✨ Core Functionalities (MVP Scope)

These are the strict requirements and features that need to be built for the initial launch.

### 1. Guest List Management (The Foundation)

- CSV Upload: Users can upload a .csv file containing their master guest list.
- Column Mapping: The system should expect or map at least two columns: Name and Relation/Tag (e.g., "Bride Side", "Colleague").
- Guest Directory UI: A simple tab to view, search, and manually add/edit guests.

### 2. The Capture Hub (Data Entry)

This is the most critical UI. It must be mobile-friendly and extremely fast to prevent bottlenecks during the event.

- Mode A: Snap & Type (For Envelopes):
  - A camera interface to snap a photo of the _lifafa_.
  - Immediately after snapping, a large Numpad UI appears on-screen.
  - User types the cash amount found inside and hits "Save".
  - App uploads image in the background and sets status to PENDING.
- Mode B: Voice Munshi (For Direct Cash):
  - A "Hold to Speak" microphone button.
  - User dictates (e.g., "Suresh uncle gave 2100 cash").
  - App records audio, uploads .wav`/.mp3` to bucket, and triggers the text-extraction pipeline.
- Mode C: Manual Fallback: A standard form to type Name, Amount, and Type if cameras/mics fail.

### 3. The Ledger Dashboard (The UI Hub)

- Real-time Table: A data grid displaying all logged gifts. Columns: Status, Amount, Extracted Name, Matched Guest, Type, Media.
- Status Indicators: Clear visual tags for PENDING (spinner), COMPLETED (green check), or FAILED (red warning).
- Media Verification: Small icons next to each row to "View Image" or "Play Audio" for manual verification.
- Fuzzy Matching & Reconciliation: \* If the AI extracts a name (e.g., "Mr. Chauhan"), the UI should suggest matches from the Guest List.
  - Users can click a dropdown on the row to confirm the match or manually link it to the correct guest.

### 4. The AI Processing Engine (Background Tasks)

- Vision Extraction: Local script runs LLaVA on pending images to extract handwriting into text.
- Voice Extraction: Local script (or browser API) runs speech-to-text to extract names and amounts from audio logs.
- Automated Syncing: The local worker strictly updates the Supabase cloud database automatically without user intervention.

### 5. "Ask Munshi" (The Interactive Chat)

- Contextual Chat Panel: A floating or side-panel chat UI.
- Data Injection: When the user asks a question, the frontend securely fetches the completed ledger data and feeds it to the local Llama 3 model via the tunnel.
- Real-time Streaming: The chatbot streams text back to the user instantly to answer questions like:
  - _"How many blank envelopes are there?"_
  - _"What's the total cash from the Groom's side?"_

---

## 📂 Recommended Folder Structure

```text
/lifafa-project
│
├── /app                  # Next.js App Router (Frontend & API)
│   ├── /api              # Backend API Routes
│   │   ├── /upload       # Handles image/audio to Supabase Bucket

> Akshat:
│   │   ├── /chat         # Direct tunnel to local Ollama text model
│   │   └── /webhook      # Supabase triggers
│   ├── /dashboard        # Main ledger view
│   ├── /capture          # UI for Camera/Voice input
│   └── layout.tsx        # Global layout & providers
│
├── /components           # React Components
│   ├── /ui               # Shadcn UI primitives (buttons, dialogs, etc.)
│   ├── /forms            # Reusable form components
│   └── /shared           # Headers, sidebars, loaders
│
├── /lib                  # Utilities & Configurations
│   ├── supabase.ts       # Supabase client initialization
│   ├── utils.ts          # Tailwind merge utilities (Shadcn standard)
│   └── ollama.ts         # Helper functions for AI prompts
│
├── /types                # TypeScript definitions (Ledger, Guest, etc.)
├── /store                # Zustand state stores (e.g., useLedgerStore.ts)
│
└── /local-worker         # SEPARATE SCRIPT: Runs locally next to Ollama
    ├── worker.js         # Polls Supabase -> Runs LLaVA -> Updates DB
    └── package.json
```
