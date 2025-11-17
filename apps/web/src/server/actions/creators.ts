"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const creatorSchema = z.object({
  name: z.string().min(2),
  platform: z.string().min(2),
  profileUrl: z.string().url(),
  handle: z.string().optional(),
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
  gender: z.string().optional(),
  price: z.string().optional(),
  campaignId: z.string().optional(),
});

export async function addCreator(prevState: unknown, formData: FormData) {
  const parsed = creatorSchema.safeParse({
    name: formData.get("name"),
    platform: formData.get("platform") ?? "instagram",
    profileUrl: formData.get("profileUrl"),
    handle: formData.get("handle"),
    followers: formData.get("followers"),
    engagementRate: formData.get("engagementRate"),
    status: formData.get("status") ?? "LEAD",
    gender: formData.get("gender"),
    price: formData.get("price"),
    campaignId: formData.get("campaignId"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid creator payload" };
  }

  const workspace = await prisma.workspace.upsert({
    where: { slug: "outlight-support" },
    create: {
      slug: "outlight-support",
      name: "Outlight Support",
      gmail: "support@outlight.us",
    },
    update: {},
  });

  const campaign =
    parsed.data.campaignId
      ? await prisma.campaign.findUnique({
          where: { id: parsed.data.campaignId },
        })
      : await prisma.campaign.findFirst({
          where: { workspaceId: workspace.id },
          orderBy: { createdAt: "desc" },
        });

  const creator = await prisma.creator.upsert({
    where: { profileUrl: parsed.data.profileUrl },
    update: {
      name: parsed.data.name,
      platform: parsed.data.platform,
      handle: parsed.data.handle,
      gender: parsed.data.gender,
      followers: parsed.data.followers
        ? Number(parsed.data.followers.replace(/[, ]/g, ""))
        : null,
      engagementRate: parsed.data.engagementRate
        ? Number(parsed.data.engagementRate)
        : null,
      rate: parsed.data.price ? Number(parsed.data.price) : null,
      workspaceId: workspace.id,
    },
    create: {
      workspaceId: workspace.id,
      name: parsed.data.name,
      platform: parsed.data.platform,
      profileUrl: parsed.data.profileUrl,
      handle: parsed.data.handle,
      gender: parsed.data.gender,
      followers: parsed.data.followers
        ? Number(parsed.data.followers.replace(/[, ]/g, ""))
        : null,
      engagementRate: parsed.data.engagementRate
        ? Number(parsed.data.engagementRate)
        : null,
      rate: parsed.data.price ? Number(parsed.data.price) : null,
    },
  });

  if (campaign) {
    await prisma.campaignCreator.upsert({
      where: {
        campaignId_creatorId: {
          campaignId: campaign.id,
          creatorId: creator.id,
        },
      },
      create: {
        campaignId: campaign.id,
        creatorId: creator.id,
        status: parsed.data.status,
        shortlisted: parsed.data.status !== "NOT_INTERESTED",
        price: parsed.data.price ? Number(parsed.data.price) : null,
      },
      update: {
        status: parsed.data.status,
      },
    });
  }

  revalidatePath("/creators");
  revalidatePath("/");
  return { ok: true };
}

export async function toggleShortlist({
  id,
  shortlisted,
}: {
  id: string;
  shortlisted: boolean;
}) {
  await prisma.campaignCreator.update({
    where: { id },
    data: { shortlisted },
  });
  revalidatePath("/creators");
  revalidatePath("/");
}

export async function toggleShortlistAction(
  prevState: unknown,
  formData: FormData,
) {
  const id = formData.get("id")?.toString();
  const shortlisted = formData.get("shortlisted") === "true";
  if (!id) return { ok: false };
  await toggleShortlist({ id, shortlisted });
  return { ok: true };
}

export async function bulkDeleteRejected(campaignId: string) {
  await prisma.campaignCreator.updateMany({
    where: { campaignId, shortlisted: false },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  });
  revalidatePath("/creators");
}

export async function bulkDeleteRejectedAction(
  prevState: unknown,
  formData: FormData,
) {
  const campaignId = formData.get("campaignId")?.toString();
  if (!campaignId) return { ok: false };
  await bulkDeleteRejected(campaignId);
  return { ok: true };
}
