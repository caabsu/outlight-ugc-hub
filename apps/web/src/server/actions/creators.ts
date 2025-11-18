"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addCreator, getCampaigns } from "@/data/store";

const creatorSchema = z.object({
  name: z.string().min(2),
  platform: z.string().min(2),
  profileUrl: z.string().url(),
  followers: z.string().optional(),
  engagementRate: z.string().optional(),
  status: z.enum([
    "LEAD",
    "OUTREACH",
    "ONBOARDING",
    "PRODUCING",
    "DELIVERED",
    "NOT_INTERESTED",
    "ARCHIVED",
  ]),
  campaignId: z.string().optional(),
});

export async function addCreatorAction(prevState: unknown, formData: FormData) {
  const parsed = creatorSchema.safeParse({
    name: formData.get("name"),
    platform: formData.get("platform") ?? "instagram",
    profileUrl: formData.get("profileUrl"),
    followers: formData.get("followers"),
    engagementRate: formData.get("engagementRate"),
    status: formData.get("status") ?? "LEAD",
    campaignId: formData.get("campaignId"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid creator payload" };
  }

  const campaigns = getCampaigns();
  const campaignMatch = campaigns.find(
    (c) => c.id === parsed.data.campaignId,
  );

  addCreator({
    name: parsed.data.name,
    platform: parsed.data.platform,
    profileUrl: parsed.data.profileUrl,
    status: parsed.data.status,
    followers: parsed.data.followers
      ? Number(parsed.data.followers.replace(/[, ]/g, ""))
      : null,
    engagementRate: parsed.data.engagementRate
      ? Number(parsed.data.engagementRate)
      : null,
    campaignId: campaignMatch?.id ?? null,
  });

  revalidatePath("/creators");
  revalidatePath("/");
  return { ok: true };
}
