"use client";

import { useActionState } from "react";
import { addCreatorAction } from "@/server/actions/creators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const initialState = { ok: false, error: "" };

export const QuickAddCreatorForm = () => {
  const [state, action, pending] = useActionState(addCreatorAction, initialState);

  return (
    <form action={action} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Name</Label>
          <Input name="name" placeholder="Creator full name" required />
        </div>
        <div>
          <Label>Platform</Label>
          <Input name="platform" placeholder="instagram" defaultValue="instagram" />
        </div>
      </div>
      <div>
        <Label>Profile URL</Label>
        <Input name="profileUrl" placeholder="https://instagram.com/..." required />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Followers</Label>
          <Input name="followers" placeholder="20000" />
        </div>
        <div>
          <Label>Avg ER %</Label>
          <Input name="engagementRate" placeholder="3.5" />
        </div>
        <div>
          <Label>Rate ($)</Label>
          <Input name="price" placeholder="500" />
        </div>
      </div>
      <div>
        <Label>Status</Label>
        <Select name="status" defaultValue="LEAD">
          <option value="LEAD">Lead</option>
          <option value="OUTREACH">Outreach</option>
          <option value="ONBOARDING">Onboarding</option>
          <option value="PRODUCING">Producing</option>
          <option value="DELIVERED">Delivered</option>
          <option value="NOT_INTERESTED">Not interested</option>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving..." : "Add creator"}
      </Button>
      {!state.ok && state.error && (
        <p className="text-sm text-rose-500">{state.error}</p>
      )}
    </form>
  );
};
