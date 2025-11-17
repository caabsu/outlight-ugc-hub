import { NextResponse } from "next/server";
import { buildBriefPrompt, openai } from "@/lib/openai";

export async function POST(request: Request) {
  const body = await request.json();
  const prompt = buildBriefPrompt(body);

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });
    const raw = (response.output as Array<
      { content?: Array<{ text?: string }> }
    > | undefined)
      ?.[0]
      ?.content?.[0]?.text;
    const payload = raw ? JSON.parse(raw) : {};
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to generate brief", details: String(error) },
      { status: 500 },
    );
  }
}
