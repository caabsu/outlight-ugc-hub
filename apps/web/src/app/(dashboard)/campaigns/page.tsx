import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { getCampaignOverview } from "@/server/services/dashboard";

type CampaignOverview = Awaited<ReturnType<typeof getCampaignOverview>>[number];

export default async function CampaignsPage() {
  const campaigns = await getCampaignOverview();

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Campaigns</h1>
            <p className="text-slate-500">
              Every brief, deliverable, and budget in a single source of truth.
            </p>
          </div>
          <Button>Launch new campaign</Button>
        </div>
        <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-400">
                <th className="pb-3">Campaign</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Creators</th>
                <th className="pb-3">Shortlisted</th>
                <th className="pb-3">Spend</th>
                <th className="pb-3">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((campaign: CampaignOverview) => (
                <tr key={campaign.id}>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="font-semibold text-slate-900 hover:underline"
                      >
                        {campaign.name}
                      </Link>
                      <span className="text-xs text-slate-500">
                        {campaign.goal}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <Badge>
                      {campaign.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="py-4">{campaign.metrics.creators}</td>
                  <td className="py-4">{campaign.metrics.shortlisted}</td>
                  <td className="py-4">
                    ${campaign.metrics.spend.toLocaleString()}
                  </td>
                  <td className="py-4">
                    ${campaign.metrics.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
          <h2 className="text-xl font-semibold">Create campaign</h2>
          <CampaignForm />
        </Card>
      </div>
    </DashboardShell>
  );
}

