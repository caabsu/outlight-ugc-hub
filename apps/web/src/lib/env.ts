import "server-only";

import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SEVENTEENTRACK_API_KEY: z.string().optional(),
  SHOPIFY_STORE_DOMAIN: z.string().optional(),
  SHOPIFY_ADMIN_ACCESS_TOKEN: z.string().optional(),
  SHOPIFY_API_KEY: z.string().optional(),
  SHOPIFY_API_SECRET: z.string().optional(),
  SHOPIFY_API_VERSION: z.string().default("2025-10"),
  META_SYSTEM_USER_TOKEN: z.string().optional(),
  META_AD_ACCOUNT_ID: z.string().optional(),
});

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export const serverEnv = serverSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SEVENTEENTRACK_API_KEY: process.env.SEVENTEENTRACK_API_KEY,
  SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
  SHOPIFY_ADMIN_ACCESS_TOKEN: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET,
  SHOPIFY_API_VERSION: process.env.SHOPIFY_API_VERSION,
  META_SYSTEM_USER_TOKEN: process.env.META_SYSTEM_USER_TOKEN,
  META_AD_ACCOUNT_ID: process.env.META_AD_ACCOUNT_ID,
});

export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
