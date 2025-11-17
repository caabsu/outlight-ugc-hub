import { createClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "./env";

export const supabaseServer = () =>
  createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY ||
      publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
      },
    },
  );

export const supabaseBrowser = () =>
  createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
