"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const campaignSchema = z.object({
  id: z.string().optional(),
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
    id: formData.get("id")?.toString(),
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

  const payload = parsed.data;

  const workspace = await prisma.workspace.upsert({
    where: { slug: "outlight-support" },
    create: {
      slug: "outlight-support",
      name: "Outlight Support",
      gmail: "support@outlight.us",
    },
    update: {},
  });

  await prisma.campaign.upsert({
    where: { id: payload.id ?? "" },
    update: {
      name: payload.name,
      brand: payload.brand,
      goal: payload.goal,
      status: payload.status,
      startDate: payload.startDate ? new Date(payload.startDate) : null,
      endDate: payload.endDate ? new Date(payload.endDate) : null,
      budget: payload.budget ? Number(payload.budget) : null,
      workspaceId: workspace.id,
    },
    create: {
      name: payload.name,
      brand: payload.brand,
      goal: payload.goal,
      status: payload.status,
      startDate: payload.startDate ? new Date(payload.startDate) : null,
      endDate: payload.endDate ? new Date(payload.endDate) : null,
      budget: payload.budget ? Number(payload.budget) : null,
      workspaceId: workspace.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/campaigns");
  return { ok: true };
}
