export type LedgerStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
export type Status = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type EntryType = "CASH" | "ENVELOPE" | "VOICE" | "MANUAL";
export type GiftType = "CASH" | "ENVELOPE" | "VOICE" | "MANUAL";

export interface LedgerEntry {
  id: string;
  guest_id: string | null;
  amount: number;
  extracted_name: string | null;
  status: LedgerStatus;
  entry_type: EntryType;
  media_url: string | null;
  created_at: string;
}

export type CaptureMode = "snap" | "voice" | "manual";