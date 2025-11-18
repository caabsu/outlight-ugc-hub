import { getCampaigns, getCreators } from "@/data/store";

export async function getCampaignOverview() {
  try {
    const campaigns = getCampaigns();
    const creators = getCreators();

    return campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      startDate: campaign.startDate ?? "",
      endDate: campaign.endDate ?? "",
      brand: campaign.brand,
      goal: campaign.goal,
      metrics: {
        creators: creators.filter((c) => c.campaignId === campaign.id).length,
        shortlisted: 0,
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
    const creators = getCreators();
    const campaignsById = new Map(getCampaigns().map((c) => [c.id, c]));

    return creators.map((creator) => ({
      id: creator.id,
      name: creator.name,
      platform: creator.platform,
      gender: undefined,
      profileUrl: creator.profileUrl,
      followers: creator.followers ?? undefined,
      engagementRate: creator.engagementRate ?? undefined,
      status: creator.status,
      shortlisted: false,
      dateAdded: undefined,
      price: undefined,
      campaignName: creator.campaignId
        ? campaignsById.get(creator.campaignId)?.name
        : undefined,
      campaignId: creator.campaignId ?? undefined,
      lastBrief: undefined,
    }));
  } catch (error) {
    console.error("getCreatorRoster fallback", error);
    return [];
  }
}

export async function getCampaignDetail(id: string) {
  return getCampaigns().find((c) => c.id === id) ?? null;
}
