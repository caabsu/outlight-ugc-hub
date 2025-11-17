import { serverEnv } from "./env";

const baseUrl = `https://${serverEnv.SHOPIFY_STORE_DOMAIN}/admin/api/${serverEnv.SHOPIFY_API_VERSION}`;

type ShopifyOrder = {
  id: number;
  name: string;
  order_number: number;
  fulfillment_status: string | null;
  line_items: { sku: string; title: string }[];
  fulfillment_orders?: { tracking_info?: { number?: string }[] }[];
  created_at: string;
};

export async function fetchShopifyOrder(orderNumber: string) {
  if (!serverEnv.SHOPIFY_ADMIN_ACCESS_TOKEN || !serverEnv.SHOPIFY_STORE_DOMAIN)
  {
    return null;
  }

  const res = await fetch(
    `${baseUrl}/orders.json?name=${encodeURIComponent(orderNumber)}`,
    {
      headers: {
        "X-Shopify-Access-Token": serverEnv.SHOPIFY_ADMIN_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    console.error("Shopify error", await res.text());
    return null;
  }

  const data = (await res.json()) as { orders: ShopifyOrder[] };
  return data.orders.at(0) ?? null;
}
