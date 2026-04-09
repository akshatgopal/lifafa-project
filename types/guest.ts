export interface Guest {
  id: string;
  name: string;
  relation: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export interface CSVRow {
  name: string;
  relation: string;
  phone?: string;
  address?: string;
}
