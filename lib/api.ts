import type { LedgerEntry, EntryType } from "@/types/ledger";
import type { Guest } from "@/types/guest";
import type { Wedding } from "@/types/wedding";
import { useUIStore } from "@/store/ui-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface RequestOptions extends RequestInit {
  /** If true, this call will not contribute to the global top progress bar. */
  silent?: boolean;
}

async function request<T>(path: string, init?: RequestOptions): Promise<T> {
  const { silent, ...fetchInit } = init ?? {};
  const isFormData = fetchInit.body instanceof FormData;

  if (!silent && typeof window !== "undefined") {
    useUIStore.getState().start();
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...fetchInit,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(fetchInit.headers ?? {}),
      },
    });

    if (!res.ok) {
      let message = `Request failed: ${res.status}`;
      try {
        const data = await res.json();
        if (data?.detail) {
          message =
            typeof data.detail === "string"
              ? data.detail
              : JSON.stringify(data.detail);
        }
      } catch {
        // body wasn't JSON; keep the generic message
      }
      throw new Error(message);
    }

    // 204 No Content guard, though we don't currently return any
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } finally {
    if (!silent && typeof window !== "undefined") {
      useUIStore.getState().end();
    }
  }
}

function requireWeddingId(weddingId: string): string {
  if (!weddingId) {
    throw new Error("wedding_id is required for this request");
  }
  return weddingId;
}

export interface ManualEntryPayload {
  amount: number;
  extracted_name: string;
  entry_type: Extract<EntryType, "CASH" | "ENVELOPE">;
}

export interface GuestCreatePayload {
  name: string;
  relation?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface GuestBulkRow {
  name: string;
  relation?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface WeddingCreatePayload {
  event_name: string;
  event_date?: string | null;
}

export const api = {
  // weddings
  listWeddings: () => request<Wedding[]>("/weddings"),

  createWedding: (body: WeddingCreatePayload) =>
    request<Wedding>("/weddings", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // ledger
  listLedger: (weddingId: string) =>
    request<LedgerEntry[]>(
      `/ledger?wedding_id=${encodeURIComponent(requireWeddingId(weddingId))}`
    ),

  createManual: (weddingId: string, body: ManualEntryPayload) =>
    request<LedgerEntry>("/ledger/manual", {
      method: "POST",
      body: JSON.stringify({ ...body, wedding_id: requireWeddingId(weddingId) }),
    }),

  createSnap: (weddingId: string, amount: number, file: File) => {
    const form = new FormData();
    form.append("wedding_id", requireWeddingId(weddingId));
    form.append("amount", String(amount));
    form.append("file", file);
    return request<LedgerEntry>("/ledger/snap", {
      method: "POST",
      body: form,
    });
  },

  createVoice: (weddingId: string, file: Blob, filename = "voice.webm") => {
    const form = new FormData();
    form.append("wedding_id", requireWeddingId(weddingId));
    form.append("file", file, filename);
    return request<LedgerEntry>("/ledger/voice", {
      method: "POST",
      body: form,
    });
  },

  // guests
  listGuests: (weddingId: string) =>
    request<Guest[]>(
      `/guests?wedding_id=${encodeURIComponent(requireWeddingId(weddingId))}`
    ),

  createGuest: (weddingId: string, body: GuestCreatePayload) =>
    request<Guest>("/guests", {
      method: "POST",
      body: JSON.stringify({ ...body, wedding_id: requireWeddingId(weddingId) }),
    }),

  bulkUpsertGuests: (weddingId: string, rows: GuestBulkRow[]) =>
    request<{ inserted: number }>("/guests/bulk", {
      method: "POST",
      body: JSON.stringify({ wedding_id: requireWeddingId(weddingId), rows }),
    }),

  // chat
  chat: (weddingId: string, question: string) =>
    request<{ answer: string }>("/chat", {
      method: "POST",
      body: JSON.stringify({
        wedding_id: requireWeddingId(weddingId),
        question,
      }),
    }),
};
