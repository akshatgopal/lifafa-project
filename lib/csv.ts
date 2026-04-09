import { CSVRow } from "@/types/guest";

export function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].toLowerCase().split(",").map((h) => h.trim());

  const rows: CSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length < 2 || !values[0]) continue;

    const row: CSVRow = {
      name: values[headers.indexOf("name")] || values[0],
      relation: values[headers.indexOf("relation")] || values[1] || "",
      phone: values[headers.indexOf("phone")] || values[2] || undefined,
      address: values[headers.indexOf("address")] || values[3] || undefined,
    };
    rows.push(row);
  }
  return rows;
}
