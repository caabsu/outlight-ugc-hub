"use client";

import { useActionState } from "react";
import { generateBrief, type GenerateBriefState } from "@/server/actions/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const initialState: GenerateBriefState = { ok: false };

export const AIBriefCard = () => {
  const [state, formAction, pending] = useActionState(generateBrief, initialState);

  return (
    <Card className="glass-panel border-none bg-slate-900 text-white">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">AI brief assistant</h3>
        <p className="text-sm text-slate-300">
          Feed context, tone, and deliverables—get a ready-to-send outreach email
          plus shot list in seconds.
        </p>
        <form action={formAction} className="space-y-3">
          <Input name="creatorName" placeholder="Creator name" required />
          <div className="grid grid-cols-2 gap-3">
            <Input name="platform" placeholder="Platform" defaultValue="instagram" />
            <Input name="tone" placeholder="Tone (e.g. friendly, high-energy)" required />
          </div>
          <Textarea
            name="context"
            placeholder="Campaign context"
            rows={3}
            required
          />
          <Textarea
            name="productDetails"
            placeholder="Product details & must-have talking points"
            rows={3}
            required
          />
          <Input
            name="callToAction"
            placeholder="Call to action"
            required
          />
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Generating..." : "Generate brief"}
          </Button>
        </form>
        {state.ok && (
          <div className="rounded-xl border border-white/20 bg-white/10 p-4">
            <Label className="text-xs uppercase text-white/80">
              AI Brief
            </Label>
            <p className="mt-2 whitespace-pre-line text-sm">{state.brief}</p>
            <Label className="mt-4 block text-xs uppercase text-white/80">
              Outreach message
            </Label>
            <p className="mt-2 text-sm text-slate-100 whitespace-pre-line">
              {state.message}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
