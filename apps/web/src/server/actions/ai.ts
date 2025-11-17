"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { openai, buildBriefPrompt } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

const aiSchema = z.object({
  campaignCreatorId: z.string().optional(),
  creatorName: z.string().min(2),
  platform: z.string().min(2),
  tone: z.string().min(2),
  context: z.string().min(5),
  productDetails: z.string().min(5),
  callToAction: z.string().min(3),
});

export type GenerateBriefState = {
  ok: boolean;
  brief?: string;
  message?: string;
  error?: string;
};

export async function generateBrief(
  prevState: GenerateBriefState,
  formData: FormData,
): Promise<GenerateBriefState> {
  const parsed = aiSchema.safeParse({
    campaignCreatorId: formData.get("campaignCreatorId"),
    creatorName: formData.get("creatorName"),
    platform: formData.get("platform"),
    tone: formData.get("tone"),
    context: formData.get("context"),
    productDetails: formData.get("productDetails"),
    callToAction: formData.get("callToAction"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid prompt" };
  }

  const prompt = buildBriefPrompt(parsed.data);
  let brief = "";
  let message = "";

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
    if (raw) {
      const parsedJson = JSON.parse(raw);
      brief = parsedJson.brief ?? "";
      message = parsedJson.message ?? "";
    }
  } catch (error) {
    console.warn("OpenAI error, falling back to template", error);
    brief = `### ${parsed.data.campaignCreatorId ? "Campaign" : "Creator"} Brief

- Tone: ${parsed.data.tone}
- Product: ${parsed.data.productDetails}
- CTA: ${parsed.data.callToAction}
`;
    message = `Hi ${parsed.data.creatorName.split(" ")[0]}, we'd love for you to shoot a ${
      parsed.data.platform
    } concept featuring ${parsed.data.productDetails}.`;
  }

  if (parsed.data.campaignCreatorId) {
    await prisma.creatorBrief.create({
      data: {
        campaignCreatorId: parsed.data.campaignCreatorId,
        tonePreferences: parsed.data.tone,
        promptContext: parsed.data.context,
        briefMarkdown: brief,
        message,
      },
    });
    revalidatePath("/creators");
  }

  return { ok: true, brief, message };
}
