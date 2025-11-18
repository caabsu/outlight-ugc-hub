import { getAssets, getCampaigns, getCreators } from "@/data/store";

export async function getAssetPerformance(campaignId?: string) {
  const assets = getAssets().filter(
    (asset) => !campaignId || asset.campaignId === campaignId,
  );
  const campaignsById = new Map(getCampaigns().map((c) => [c.id, c]));
  const creatorsById = new Map(getCreators().map((c) => [c.id, c]));

  return assets.map((asset) => ({
    id: asset.id,
    campaignCreatorId: asset.creatorId ?? "",
    creatorName: asset.creatorId
      ? creatorsById.get(asset.creatorId)?.name ?? "Creator"
      : "Creator",
    campaignName: asset.campaignId
      ? campaignsById.get(asset.campaignId)?.name ?? "Campaign"
      : "Campaign",
    storagePath: asset.title,
    type: asset.type,
    impressions: asset.impressions ?? 0,
    spend: asset.spend ?? 0,
    revenue: asset.revenue ?? 0,
    roas:
      asset.spend && asset.spend > 0
        ? (asset.revenue ?? 0) / asset.spend
        : 0,
  }));
}

export async function getLogisticsBoard() {
  return [];
}
