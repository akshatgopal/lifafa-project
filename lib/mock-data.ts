import { LedgerEntry } from "@/types/ledger";

const MOCK_WEDDING_ID = "00000000-0000-0000-0000-000000000001";

export const MOCK_LEDGER_ENTRIES: LedgerEntry[] = [
  { id: "001", wedding_id: MOCK_WEDDING_ID, guest_id: "g-001", amount: 5100, extracted_name: "Ramesh Chauhan", status: "COMPLETED", entry_type: "CASH", media_url: null, created_at: "2026-04-09T11:32:00Z" },
  { id: "002", wedding_id: MOCK_WEDDING_ID, guest_id: null, amount: 2100, extracted_name: null, status: "PENDING", entry_type: "ENVELOPE", media_url: "https://bucket.supabase.co/media/envelope-002.jpg", created_at: "2026-04-09T11:38:00Z" },
  { id: "003", wedding_id: MOCK_WEDDING_ID, guest_id: "g-002", amount: 11000, extracted_name: "Sunita Verma", status: "COMPLETED", entry_type: "CASH", media_url: null, created_at: "2026-04-09T11:44:00Z" },
  { id: "004", wedding_id: MOCK_WEDDING_ID, guest_id: "g-003", amount: 3100, extracted_name: "Mr. Gupta", status: "COMPLETED", entry_type: "ENVELOPE", media_url: "https://bucket.supabase.co/media/envelope-004.jpg", created_at: "2026-04-09T11:51:00Z" },
  { id: "005", wedding_id: MOCK_WEDDING_ID, guest_id: null, amount: 500, extracted_name: null, status: "FAILED", entry_type: "ENVELOPE", media_url: "https://bucket.supabase.co/media/envelope-005.jpg", created_at: "2026-04-09T12:02:00Z" },
  { id: "006", wedding_id: MOCK_WEDDING_ID, guest_id: "g-004", amount: 21000, extracted_name: "Vikram Mehta", status: "COMPLETED", entry_type: "CASH", media_url: null, created_at: "2026-04-09T12:08:00Z" },
  { id: "007", wedding_id: MOCK_WEDDING_ID, guest_id: null, amount: 1500, extracted_name: null, status: "PENDING", entry_type: "ENVELOPE", media_url: "https://bucket.supabase.co/media/envelope-007.jpg", created_at: "2026-04-09T12:15:00Z" },
  { id: "008", wedding_id: MOCK_WEDDING_ID, guest_id: "g-005", amount: 7500, extracted_name: "Priya Sharma", status: "COMPLETED", entry_type: "CASH", media_url: null, created_at: "2026-04-09T12:21:00Z" },
];
