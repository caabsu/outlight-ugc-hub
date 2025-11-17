import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const creators = await prisma.campaignCreator.findMany({
    include: {
      creator: true,
      campaign: true,
    },
    orderBy: { dateAdded: "desc" },
  });

  return NextResponse.json(
    creators.map((row) => ({
      id: row.id,
      name: row.creator.name,
      platform: row.creator.platform,
      profileUrl: row.creator.profileUrl,
      followers: row.creator.followers,
      engagementRate: row.creator.engagementRate,
      status: row.status,
      shortlisted: row.shortlisted,
      campaign: row.campaign.name,
    })),
  );
}
