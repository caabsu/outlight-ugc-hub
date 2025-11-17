import { serverEnv } from "./env";

type Insight = {
  creativeId: string;
  impressions: number;
  spend: number;
  clicks: number;
  purchases: number;
  revenue: number;
};

export async function fetchMetaInsights(
  creativeIds: string[],
): Promise<Insight[]> {
  if (!serverEnv.SHOPIFY_API_KEY) {
    // Placeholder behavior so UI can render without Meta credentials.
    return creativeIds.map((id, index) => ({
      creativeId: id,
      impressions: 5000 + index * 250,
      spend: 120 + index * 10,
      clicks: 300 + index * 5,
      purchases: 40 + index,
      revenue: 400 + index * 20,
    }));
  }

  const token = process.env.META_SYSTEM_USER_TOKEN;
  const adAccount = process.env.META_AD_ACCOUNT_ID;

  if (!token || !adAccount) {
    return [];
  }

  const params = new URLSearchParams({
    level: "ad",
    filtering: JSON.stringify([
      { field: "ad.creative.id", operator: "IN", value: creativeIds },
    ]),
    fields: "ad_id,ad_name,impressions,spend,clicks,actions",
  });

  const response = await fetch(
    `https://graph.facebook.com/v20.0/${adAccount}/insights?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    },
  );

  if (!response.ok) {
    console.error("Meta API error", await response.text());
    return [];
  }

  const payload = (await response.json()) as {
    data: {
      ad_id: string;
      impressions: string;
      spend: string;
      clicks: string;
      actions?: { action_type: string; value: string }[];
    }[];
  };

  return payload.data.map((entry) => {
    const purchases =
      entry.actions?.find((a) => a.action_type === "purchase")?.value ?? "0";
    const revenue =
      entry.actions?.find((a) => a.action_type === "omni_purchase")?.value ??
      "0";

    return {
      creativeId: entry.ad_id,
      impressions: Number(entry.impressions ?? 0),
      spend: Number(entry.spend ?? 0),
      clicks: Number(entry.clicks ?? 0),
      purchases: Number(purchases),
      revenue: Number(revenue),
    };
  });
}
