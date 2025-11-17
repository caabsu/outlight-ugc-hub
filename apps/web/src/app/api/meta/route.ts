import { NextResponse } from "next/server";
import { fetchMetaInsights } from "@/lib/meta";

export async function POST(request: Request) {
  const { creativeIds } = await request.json();
  const data = await fetchMetaInsights(creativeIds ?? []);
  return NextResponse.json(data);
}
