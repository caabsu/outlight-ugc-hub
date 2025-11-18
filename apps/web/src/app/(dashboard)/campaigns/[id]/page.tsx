import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCampaignDetail } from "@/server/services/dashboard";

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const campaign = await getCampaignDetail(params.id);
  if (!campaign) {
    notFound();
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase text-[var(--text-muted)]">
              {campaign.brand}
            </p>
            <h1 className="text-3xl font-semibold text-[var(--text-primary)]">
              {campaign.name}
            </h1>
            <p className="text-[var(--text-muted)]">{campaign.goal ?? "No goal set yet."}</p>
          </div>
          <Badge>{campaign.status}</Badge>
        </div>

        <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
          <h3 className="text-lg font-semibold">Timeline</h3>
          <p className="text-sm text-[var(--text-muted)]">
            Start: {campaign.startDate || "TBD"} • End: {campaign.endDate || "TBD"}
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Budget: {campaign.budget ? `$${campaign.budget.toLocaleString()}` : "Not set"}
          </p>
        </Card>

        <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
          <h3 className="text-lg font-semibold">Creators</h3>
          <p className="text-sm text-[var(--text-muted)]">
            Creator assignments are not tracked in this MVP. Add creators from the Creators page.
          </p>
        </Card>

        <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
          <h3 className="text-lg font-semibold">Assets</h3>
          <p className="text-sm text-[var(--text-muted)]">
            Assets for this campaign are not tracked in this MVP. Add assets from the Assets page.
          </p>
        </Card>
      </div>
    </DashboardShell>
  );
}
