import { notFound } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImportRosterForm } from "@/components/dashboard/import-roster-form";
import { AIBriefCard } from "@/components/dashboard/ai-brief-card";
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
            <p className="text-xs uppercase text-slate-500">
              {campaign.brand}
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              {campaign.name}
            </h1>
            <p className="text-slate-500">{campaign.goal}</p>
          </div>
          <Badge>{campaign.status}</Badge>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="glass-panel border-none bg-white/90 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Creators</h2>
                <p className="text-sm text-slate-500">
                  {campaign.campaignCreators.length} total,{" "}
                  {
                    campaign.campaignCreators.filter((creator) => creator.shortlisted)
                      .length
                  }{" "}
                  shortlisted
                </p>
              </div>
              <Link
                href="/creators"
                className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline"
              >
                Manage roster
              </Link>
            </div>
            <div className="mt-4 space-y-4">
              {campaign.campaignCreators.map((row) => (
                <div
                  key={row.id}
                  className="rounded-2xl border border-slate-100 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {row.creator.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {row.creator.platform} • {row.creator.followers?.toLocaleString()} followers
                      </p>
                    </div>
                    <Badge variant={row.shortlisted ? "success" : "neutral"}>
                      {row.shortlisted ? "Shortlisted" : row.status}
                    </Badge>
                  </div>
                  {row.briefs.length > 0 && (
                    <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                      {row.briefs[0].briefMarkdown}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
          <div className="space-y-6">
            <ImportRosterForm />
            <Card className="glass-panel border-none bg-white/90">
              <h3 className="text-lg font-semibold">Bulk actions</h3>
              <p className="text-sm text-slate-500">
                Clean non-shortlisted creators or trigger payment batches.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Button variant="outline">Delete non-shortlisted</Button>
                <Button variant="outline">Send status survey</Button>
              </div>
            </Card>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <AIBriefCard />
          <Card className="glass-panel border-none bg-white/90">
            <h3 className="text-lg font-semibold">Assets</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {campaign.campaignCreators.flatMap((row) =>
                row.assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="rounded-2xl border border-slate-100 p-4"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {row.creator.name}
                    </p>
                    <p className="text-xs text-slate-500">{asset.type}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      Uploaded {asset.uploadedAt.toDateString()}
                    </p>
                  </div>
                )),
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
