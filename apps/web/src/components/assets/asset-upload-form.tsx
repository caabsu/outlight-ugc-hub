"use client";

import { useActionState } from "react";
import { uploadAsset, type UploadAssetState } from "@/server/actions/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: UploadAssetState = { ok: false };

export const AssetUploadForm = ({ campaignCreatorId }: { campaignCreatorId: string }) => {
  const [state, action, pending] = useActionState(uploadAsset, initialState);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="campaignCreatorId" value={campaignCreatorId} />
      <div>
        <Label>Asset file</Label>
        <Input name="file" type="file" accept="video/*" required />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Uploading..." : "Upload asset"}
      </Button>
      {state.ok && (
        <p className="text-xs text-emerald-600">
          Uploaded to {state.path}
        </p>
      )}
    </form>
  );
};
