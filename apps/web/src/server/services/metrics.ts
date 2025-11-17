import { prisma } from "@/lib/prisma";
import { fetchMetaInsights } from "@/lib/meta";
import { fetchShopifyOrder } from "@/lib/shopify";
import { fetchTrackingStatus } from "@/lib/seventeentrack";
import { sampleAssets, sampleLogistics } from "@/data/sample-creators";

export async function getAssetPerformance(campaignId?: string) {
  try {
    const assets = await prisma.asset.findMany({
      where: {
        campaignCreator: {
          ...(campaignId ? { campaignId } : {}),
        },
      },
      include: {
        campaignCreator: {
          include: {
            creator: true,
            campaign: true,
          },
        },
        metrics: true,
      },
    });

    const metaIds = assets
      .map((asset) => asset.metaAdCreativeId)
      .filter(Boolean) as string[];

    const insights = metaIds.length
      ? await fetchMetaInsights(metaIds)
      : [];

    if (!assets.length) {
      return sampleAssets;
    }

    return assets.map((asset) => {
      const insight = insights.find(
        (metric) => metric.creativeId === asset.metaAdCreativeId,
      );
      const latestMetric = asset.metrics.at(0);

      return {
        id: asset.id,
        campaignCreatorId: asset.campaignCreatorId,
        creatorName: asset.campaignCreator.creator.name,
        campaignName: asset.campaignCreator.campaign.name,
        storagePath: asset.storagePath,
        type: asset.type,
        impressions: insight?.impressions ?? latestMetric?.impressions ?? 0,
        spend: insight?.spend ?? latestMetric?.spend ?? 0,
        revenue: insight?.revenue ?? latestMetric?.revenue ?? 0,
        roas:
          insight && insight.spend
            ? insight.revenue / insight.spend
            : latestMetric?.roas ?? 0,
      };
    });
  } catch (error) {
    console.error("getAssetPerformance fallback", error);
    return sampleAssets;
  }
}

export async function getLogisticsBoard(campaignId?: string) {
  try {
    const rows = await prisma.campaignCreator.findMany({
      where: {
        ...(campaignId ? { campaignId } : {}),
      },
      include: {
        creator: true,
        campaign: true,
        shopifyOrders: true,
      },
    });

    if (!rows.length) {
      return sampleLogistics;
    }

    return Promise.all(
      rows.map(async (row) => {
        const order = row.shopifyOrders.at(0);
        let shopifyDetails = null;
        let tracking = null;

        if (order?.orderNumber) {
          shopifyDetails = await fetchShopifyOrder(order.orderNumber);
        }
        if (order?.trackingNumber) {
          tracking = await fetchTrackingStatus(order.trackingNumber);
        }

        return {
          id: row.id,
          creatorName: row.creator.name,
          campaignName: row.campaign.name,
          status: row.status,
          orderNumber: order?.orderNumber,
          fulfillmentStatus:
            shopifyDetails?.fulfillment_status ?? order?.fulfillmentStatus,
          trackingNumber: order?.trackingNumber,
          trackingStatus: tracking?.status ?? order?.seventeenTrackStatus,
          trackingNote: tracking?.lastCheckpoint,
        };
      }),
    );
  } catch (error) {
    console.error("getLogisticsBoard fallback", error);
    return sampleLogistics;
  }
}
