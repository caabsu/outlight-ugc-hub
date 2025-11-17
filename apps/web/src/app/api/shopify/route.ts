import { NextResponse } from "next/server";
import { fetchShopifyOrder } from "@/lib/shopify";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("order");
  if (!orderNumber) {
    return NextResponse.json({ error: "order query param required" }, { status: 400 });
  }
  const order = await fetchShopifyOrder(orderNumber);
  return NextResponse.json(order);
}
