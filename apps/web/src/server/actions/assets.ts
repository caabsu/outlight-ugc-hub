"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addAsset, getCampaigns, getCreators } from "@/data/store";

const assetSchema = z.object({
  title: z.string().min(1),
  type: z.string().default("VIDEO"),
  campaignId: z.string().optional(),
  creatorId: z.string().optional(),
  impressions: z.string().optional(),
  spend: z.string().optional(),
  revenue: z.string().optional(),
});

export type UploadAssetState = { ok: boolean; error?: string };

export async function uploadAsset(
  prevState: UploadAssetState,
  formData: FormData,
): Promise<UploadAssetState> {
  const parsed = assetSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    campaignId: formData.get("campaignId"),
    creatorId: formData.get("creatorId"),
    impressions: formData.get("impressions"),
    spend: formData.get("spend"),
    revenue: formData.get("revenue"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid payload" };
  }

  const campaigns = getCampaigns();
  const creators = getCreators();

  const campaignId = campaigns.find((c) => c.id === parsed.data.campaignId)?.id;
  const creatorId = creators.find((c) => c.id === parsed.data.creatorId)?.id;

  addAsset({
    title: parsed.data.title,
    type: parsed.data.type,
    campaignId: campaignId ?? null,
    creatorId: creatorId ?? null,
    impressions: parsed.data.impressions
      ? Number(parsed.data.impressions)
      : undefined,
    spend: parsed.data.spend ? Number(parsed.data.spend) : undefined,
    revenue: parsed.data.revenue ? Number(parsed.data.revenue) : undefined,
  });

  revalidatePath("/assets");
  revalidatePath("/");

  return { ok: true };
}
