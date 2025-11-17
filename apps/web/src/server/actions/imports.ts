"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseCreatorWorkbook, normalizeBoolean } from "@/lib/importers";

const importSchema = z.object({
  campaignId: z.string().optional(),
});

export async function importCreators(prevState: unknown, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "Missing file" };
  }

  const parsed = importSchema.safeParse({
    campaignId: formData.get("campaignId"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid campaign reference" };
  }

  const bytes = await file.arrayBuffer();
  const rows = parseCreatorWorkbook(bytes);

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

  const job = await prisma.importJob.create({
    data: {
      campaignId: campaign?.id ?? "",
      filename: file.name,
      status: "PROCESSING",
    },
  });

  let imported = 0;
  let shortlisted = 0;

  for (const row of rows) {
    if (!row.Creator || !row["Profile URL"]) continue;

    const creator = await prisma.creator.upsert({
      where: { profileUrl: row["Profile URL"] },
      update: {
        name: row.Creator,
        platform: row.Platform ?? "instagram",
        followers: row["Number of followers"]
          ? Number(row["Number of followers"].replace(/[, ]/g, ""))
          : null,
        engagementRate: row["Average ER, %"]
          ? Number(row["Average ER, %"])
          : null,
        gender: row.Gender,
        rate: row.Price ? Number(row.Price) : null,
        workspaceId: workspace.id,
      },
      create: {
        workspaceId: workspace.id,
        name: row.Creator,
        platform: row.Platform ?? "instagram",
        profileUrl: row["Profile URL"],
        followers: row["Number of followers"]
          ? Number(row["Number of followers"].replace(/[, ]/g, ""))
          : null,
        engagementRate: row["Average ER, %"]
          ? Number(row["Average ER, %"])
          : null,
        gender: row.Gender,
        rate: row.Price ? Number(row.Price) : null,
      },
    });

    if (campaign) {
      const creatorRecord = await prisma.campaignCreator.upsert({
        where: {
          campaignId_creatorId: {
            campaignId: campaign.id,
            creatorId: creator.id,
          },
        },
        create: {
          campaignId: campaign.id,
          creatorId: creator.id,
          status:
            row.Status === "Not interested"
              ? "NOT_INTERESTED"
              : "ONBOARDING",
          shortlisted: normalizeBoolean(row.Shortlisted),
          price: row.Price ? Number(row.Price) : null,
          dateAdded: row["Date added"] ? new Date(row["Date added"]) : new Date(),
          source: "import",
        },
        update: {
          status:
            row.Status === "Not interested"
              ? "NOT_INTERESTED"
              : "ONBOARDING",
          shortlisted: normalizeBoolean(row.Shortlisted),
        },
      });

      imported += 1;
      if (creatorRecord.shortlisted) shortlisted += 1;
    }
  }

  await prisma.importJob.update({
    where: { id: job.id },
    data: {
      status: "COMPLETED",
      summaryJson: {
        imported,
        shortlisted,
      },
      completedAt: new Date(),
    },
  });

  revalidatePath("/creators");
  revalidatePath("/");

  return { ok: true, imported, shortlisted };
}
