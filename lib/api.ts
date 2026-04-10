import type { LedgerEntry, EntryType } from "@/types/ledger";
import type { Guest } from "@/types/guest";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers ?? {}),
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
  return res.json() as Promise<T>;
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

export const api = {
  // ledger
  listLedger: () => request<LedgerEntry[]>("/ledger"),

  createManual: (body: ManualEntryPayload) =>
    request<LedgerEntry>("/ledger/manual", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  createSnap: (amount: number, file: File) => {
    const form = new FormData();
    form.append("amount", String(amount));
    form.append("file", file);
    return request<LedgerEntry>("/ledger/snap", {
      method: "POST",
      body: form,
    });
  },

  createVoice: (file: Blob, filename = "voice.webm") => {
    const form = new FormData();
    form.append("file", file, filename);
    return request<LedgerEntry>("/ledger/voice", {
      method: "POST",
      body: form,
    });
  },

  // guests
  listGuests: () => request<Guest[]>("/guests"),

  createGuest: (body: GuestCreatePayload) =>
    request<Guest>("/guests", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  bulkUpsertGuests: (rows: GuestBulkRow[]) =>
    request<{ inserted: number }>("/guests/bulk", {
      method: "POST",
      body: JSON.stringify({ rows }),
    }),

  // chat
  chat: (question: string) =>
    request<{ answer: string }>("/chat", {
      method: "POST",
      body: JSON.stringify({ question }),
    }),
};
