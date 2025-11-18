import { prisma } from "@/lib/prisma";

export async function getCampaignOverview() {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        campaignCreators: {
          select: { shortlisted: true },
        },
        _count: {
          select: { campaignCreators: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      startDate: campaign.startDate?.toISOString() ?? "",
      endDate: campaign.endDate?.toISOString() ?? "",
      brand: campaign.brand,
      goal: campaign.goal,
      metrics: {
        creators: campaign._count.campaignCreators,
        shortlisted: campaign.campaignCreators.filter((c) => c.shortlisted)
          .length,
        assetsLive: 0,
        spend: campaign.budget ?? 0,
        revenue: 0,
      },
    }));
  } catch (error) {
    console.error("getCampaignOverview fallback", error);
    return [];
  }
}

export async function getCreatorRoster() {
  try {
    const creators = await prisma.campaignCreator.findMany({
      include: {
        creator: true,
        campaign: true,
        briefs: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { dateAdded: "desc" },
    });

    return creators.map((row) => ({
      id: row.id,
      name: row.creator.name,
      platform: row.creator.platform,
      gender: row.creator.gender,
      profileUrl: row.creator.profileUrl,
      followers: row.creator.followers ?? undefined,
      engagementRate: row.creator.engagementRate ?? undefined,
      status: row.status,
      shortlisted: row.shortlisted,
      dateAdded: row.dateAdded?.toISOString(),
      price: row.price ?? undefined,
      campaignName: row.campaign.name,
      campaignId: row.campaignId,
      lastBrief: row.briefs.at(0)?.briefMarkdown,
    }));
  } catch (error) {
    console.error("getCreatorRoster fallback", error);
    return [];
  }
}

export async function getCampaignDetail(id: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      campaignCreators: {
        include: {
          creator: true,
          briefs: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          assets: {
            take: 4,
            orderBy: { uploadedAt: "desc" },
          },
        },
      },
    },
  });

  if (!campaign) {
    return null;
  }

  return campaign;
}
