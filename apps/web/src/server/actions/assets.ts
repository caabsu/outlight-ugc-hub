"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase";

const assetSchema = z.object({
  campaignCreatorId: z.string(),
  type: z.string().default("VIDEO"),
});

export async function uploadAsset(prevState: unknown, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "Missing asset file" };
  }

  const parsed = assetSchema.safeParse({
    campaignCreatorId: formData.get("campaignCreatorId"),
    type: formData.get("type") ?? "VIDEO",
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid payload" };
  }

  const supabase = supabaseServer();
  const fileName = `${parsed.data.campaignCreatorId}/${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await supabase.storage.from("ugc-assets").upload(fileName, buffer, {
    contentType: file.type,
    upsert: true,
  });

  await prisma.asset.create({
    data: {
      campaignCreatorId: parsed.data.campaignCreatorId,
      type: parsed.data.type,
      storagePath: fileName,
    },
  });

  revalidatePath("/assets");
  revalidatePath("/creators");

  return { ok: true, path: fileName };
}
