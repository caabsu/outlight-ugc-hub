"use client";

import { useActionState } from "react";
import { saveCampaign } from "@/server/actions/campaigns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CAMPAIGN_STATUSES } from "@/data/constants";

const initialState = { ok: false, error: "" };

export const CampaignForm = () => {
  const [state, action, pending] = useActionState(saveCampaign, initialState);

  return (
    <form action={action} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Name</Label>
          <Input name="name" placeholder="Modern Floor Lamp - Aven" required />
        </div>
        <div>
          <Label>Brand</Label>
          <Input name="brand" placeholder="BrandOutlight" required />
        </div>
      </div>
      <div>
        <Label>Goal</Label>
        <Textarea name="goal" placeholder="Describe the objective" rows={3} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Status</Label>
          <Select name="status" defaultValue="DRAFT">
            {CAMPAIGN_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Start date</Label>
          <Input type="date" name="startDate" />
        </div>
        <div>
          <Label>Budget ($)</Label>
          <Input name="budget" placeholder="10000" />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving..." : "Create campaign"}
      </Button>
      {!state.ok && state.error && (
        <p className="text-sm text-rose-500">{state.error}</p>
      )}
    </form>
  );
};
