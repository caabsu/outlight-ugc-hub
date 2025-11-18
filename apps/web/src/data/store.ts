import crypto from "crypto";

export type Campaign = {
  id: string;
  name: string;
  brand: string;
  goal?: string | null;
  status: string;
  startDate?: string | null;
  endDate?: string | null;
  budget?: number | null;
};

export type Creator = {
  id: string;
  name: string;
  platform: string;
  profileUrl: string;
  status: string;
  followers?: number | null;
  engagementRate?: number | null;
  campaignId?: string | null;
};

export type Asset = {
  id: string;
  campaignId?: string | null;
  creatorId?: string | null;
  title: string;
  type: string;
  impressions?: number;
  spend?: number;
  revenue?: number;
};

export type Framework = {
  id: string;
  creatorId: string;
  title: string;
  latex: string;
  createdAt: string;
};

const store = {
  campaigns: [] as Campaign[],
  creators: [] as Creator[],
  assets: [] as Asset[],
  frameworks: [] as Framework[],
  baseFramework:
    String.raw`\section*{UGC Framework Template}
\textbf{Objective:} Define the campaign goal and desired outcome.

\textbf{Hook:} Strong 1-2 sentence opener that matches the brand tone.

\textbf{Body:} 3-5 bullet beats with product benefits, social proof, and CTA.

\textbf{CTA:} Clear next step with link/offer and brand-safe phrasing.
`,
};

function id() {
  return crypto.randomUUID();
}

export function addCampaign(payload: Omit<Campaign, "id">): Campaign {
  const record = { ...payload, id: id() };
  store.campaigns.unshift(record);
  return record;
}

export function addCreator(payload: Omit<Creator, "id">): Creator {
  const record = { ...payload, id: id() };
  store.creators.unshift(record);
  return record;
}

export function addAsset(payload: Omit<Asset, "id">): Asset {
  const record = { ...payload, id: id() };
  store.assets.unshift(record);
  return record;
}

export function getCampaigns() {
  return store.campaigns;
}

export function getCreators() {
  return store.creators;
}

export function getAssets() {
  return store.assets;
}

export function getFrameworks() {
  return store.frameworks;
}

export function getBaseFramework() {
  return store.baseFramework;
}

export function setBaseFramework(latex: string) {
  store.baseFramework = latex;
  return store.baseFramework;
}

export function saveFramework(payload: {
  creatorId: string;
  title: string;
  latex: string;
}) {
  const record: Framework = {
    id: id(),
    creatorId: payload.creatorId,
    title: payload.title,
    latex: payload.latex,
    createdAt: new Date().toISOString(),
  };
  store.frameworks.unshift(record);
  return record;
}

export function deleteFramework(id: string) {
  const idx = store.frameworks.findIndex((f) => f.id === id);
  if (idx !== -1) {
    store.frameworks.splice(idx, 1);
  }
}
