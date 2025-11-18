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
      <input type="hidden" name="creatorId" value={campaignCreatorId} />
      <div>
        <Label>Title</Label>
        <Input name="title" placeholder="Unboxing clip" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Type</Label>
          <Input name="type" placeholder="VIDEO" defaultValue="VIDEO" />
        </div>
        <div>
          <Label>Impressions</Label>
          <Input name="impressions" placeholder="0" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Spend ($)</Label>
          <Input name="spend" placeholder="0" />
        </div>
        <div>
          <Label>Revenue ($)</Label>
          <Input name="revenue" placeholder="0" />
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Add asset"}
      </Button>
      {state.ok && (
        <p className="text-xs text-emerald-600">
          Asset saved
        </p>
      )}
    </form>
  );
};
