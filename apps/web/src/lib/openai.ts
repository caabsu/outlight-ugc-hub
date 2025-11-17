import OpenAI from "openai";
import { serverEnv } from "./env";

export const openai = new OpenAI({
  apiKey: serverEnv.OPENAI_API_KEY,
});

export type AiBriefRequest = {
  creatorName: string;
  platform: string;
  tone: string;
  context: string;
  productDetails: string;
  callToAction: string;
};

export const buildBriefPrompt = (payload: AiBriefRequest) => `
You are Outlight's creator success AI.
Create a creator brief and outreach message using the following inputs:

Creator: ${payload.creatorName} (${payload.platform})
Tone: ${payload.tone}
Campaign context:
${payload.context}

Product details:
${payload.productDetails}

Call to action:
${payload.callToAction}

Reply in JSON with:
{
  "brief": "short markdown brief",
  "message": "personalized outreach copy"
}
`;
