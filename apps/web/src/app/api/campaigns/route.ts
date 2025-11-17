import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const campaigns = await prisma.campaign.findMany({
    include: {
      _count: { select: { campaignCreators: true } },
    },
  });

  return NextResponse.json(
    campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      creators: campaign._count.campaignCreators,
    })),
  );
}
