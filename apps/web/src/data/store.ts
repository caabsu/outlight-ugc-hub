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

const store = {
  campaigns: [] as Campaign[],
  creators: [] as Creator[],
  assets: [] as Asset[],
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
