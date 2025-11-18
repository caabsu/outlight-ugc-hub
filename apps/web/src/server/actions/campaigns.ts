"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addCampaign } from "@/data/store";

const campaignSchema = z.object({
  name: z.string().min(2),
  brand: z.string().min(1),
  goal: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.string().optional(),
});

export async function saveCampaign(prevState: unknown, formData: FormData) {
  const parsed = campaignSchema.safeParse({
    name: formData.get("name"),
    brand: formData.get("brand") ?? "Outlight",
    goal: formData.get("goal"),
    status: formData.get("status") ?? "DRAFT",
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    budget: formData.get("budget"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid campaign payload" };
  }

  addCampaign({
    name: parsed.data.name,
    brand: parsed.data.brand,
    goal: parsed.data.goal,
    status: parsed.data.status,
    startDate: parsed.data.startDate || null,
    endDate: parsed.data.endDate || null,
    budget: parsed.data.budget ? Number(parsed.data.budget) : null,
  });

  revalidatePath("/");
  revalidatePath("/campaigns");
  return { ok: true };
}
