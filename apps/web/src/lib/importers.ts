import * as XLSX from "xlsx";
import { z } from "zod";

const creatorRowSchema = z.object({
  Platform: z.string(),
  Gender: z.string().optional(),
  "Profile URL": z.string(),
  Creator: z.string(),
  "Number of followers": z.string().optional(),
  "Average ER, %": z.string().optional(),
  "Average video views": z.string().optional(),
  "Median video views": z.string().optional(),
  Status: z.string().optional(),
  "Date added": z.string().optional(),
  Price: z.string().optional(),
  Shortlisted: z.string().optional(),
});

export type ParsedCreator = z.infer<typeof creatorRowSchema>;

export const normalizeBoolean = (value?: string | boolean | null) => {
  if (typeof value === "boolean") return value;
  if (!value) return false;
  return ["true", "yes", "1"].includes(value.toString().toLowerCase());
};

export function parseCreatorWorkbook(file: ArrayBuffer): ParsedCreator[] {
  const workbook = XLSX.read(file, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    raw: false,
    defval: "",
  });

  return rows
    .map((row) => {
      try {
        return creatorRowSchema.parse({
          Platform: row.Platform ?? row.platform ?? "",
          Gender: row.Gender ?? row.gender,
          "Profile URL": row["Profile URL"] ?? row.profile ?? row["Creator URL"],
          Creator: row.Creator ?? row["Creator "] ?? row["Creator handle"],
          "Number of followers":
            row["Number of followers"] ?? row.followers ?? "",
          "Average ER, %": row["Average ER, %"] ?? row.er ?? "",
          "Average video views":
            row["Average video views"] ?? row["Avg views"] ?? "",
          "Median video views":
            row["Median video views"] ?? row["Median views"] ?? "",
          Status: row.Status ?? row.status,
          "Date added": row["Date added"] ?? row.added,
          Price: row.Price ?? row.rate,
          Shortlisted: row.Shortlisted ?? row.shortlisted,
        });
      } catch (error) {
        console.warn("Row skipped", error);
        return null;
      }
    })
    .filter(Boolean) as ParsedCreator[];
}
