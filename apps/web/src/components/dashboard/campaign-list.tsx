import Link from "next/link";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type CampaignSummary = {
  id: string;
  name: string;
  status: string;
  startDate?: string | null;
  endDate?: string | null;
  brand: string;
  goal?: string | null;
  metrics: {
    creators: number;
    shortlisted: number;
    assetsLive: number;
    spend: number;
    revenue: number;
  };
};

const statusMap: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
  ACTIVE: { label: "Active", variant: "success" },
  DRAFT: { label: "Draft", variant: "neutral" },
  COMPLETED: { label: "Completed", variant: "primary" },
  ON_HOLD: { label: "On Hold", variant: "warning" },
  ARCHIVED: { label: "Archived", variant: "danger" },
};

export const CampaignList = ({ campaigns }: { campaigns: CampaignSummary[] }) => (
  <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">Active campaigns</h3>
        <p className="text-sm text-[var(--text-muted)]">
          Track recruiting progress, briefs, and live assets.
        </p>
      </div>
      <Link
        href="/campaigns"
        className="text-sm font-semibold text-[var(--text-primary)] underline-offset-4 hover:underline"
      >
        View all
      </Link>
    </div>
    <div className="mt-6 space-y-4">
      {campaigns.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] px-4 py-3 text-sm text-[var(--text-muted)]">
          No campaigns yet. Start your first launch to see metrics here.
        </div>
      ) : (
        campaigns.map((campaign) => {
          const status = statusMap[campaign.status] ?? statusMap.DRAFT;
          return (
            <div
              key={campaign.id}
              className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] px-4 py-3"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-semibold text-[var(--text-primary)]">
                    {campaign.name}
                  </h4>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <p className="text-sm text-[var(--text-muted)]">
                  {campaign.goal || "No goal added yet"}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-8 text-sm font-semibold text-[var(--text-primary)]">
                <div>
                  <p className="text-xs uppercase text-[var(--text-muted)]">
                    Creators
                  </p>
                  {campaign.metrics.creators}
                </div>
                <div>
                  <p className="text-xs uppercase text-[var(--text-muted)]">
                    Shortlisted
                  </p>
                  {campaign.metrics.shortlisted}
                </div>
                <div>
                  <p className="text-xs uppercase text-[var(--text-muted)]">
                    Spend
                  </p>
                  ${campaign.metrics.spend.toLocaleString()}
                </div>
                <div>
                  <p className="text-xs uppercase text-[var(--text-muted)]">
                    Revenue
                  </p>
                  ${campaign.metrics.revenue.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  </Card>
);

