import { LucideSparkles, LucideUsers, LucidePlay, LucideTrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { CampaignList } from "@/components/dashboard/campaign-list";
import { CreatorTable } from "@/components/dashboard/creator-table";
import { ImportRosterForm } from "@/components/dashboard/import-roster-form";
import { AIBriefCard } from "@/components/dashboard/ai-brief-card";
import { QuickAddCreatorForm } from "@/components/creators/quick-add-form";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { Card } from "@/components/ui/card";
import { getCampaignOverview, getCreatorRoster } from "@/server/services/dashboard";
import type { CreatorRow } from "@/components/dashboard/creator-table";

export default async function DashboardPage() {
  const [campaigns, creators] = await Promise.all([
    getCampaignOverview(),
    getCreatorRoster(),
  ]);

  const stats = [
    {
      title: "Creators in production",
      value: String(
        creators.filter(
          (c: CreatorRow) => c.status === "PRODUCING" || c.status === "ONBOARDING",
        ).length,
      ),
      trend: { value: "+18%", label: "vs last sprint", up: true },
      icon: <LucideUsers className="h-5 w-5 text-slate-400" />,
    },
    {
      title: "Assets awaiting QA",
      value: "12",
      trend: { value: "-4 tasks", label: "week-over-week", up: true },
      icon: <LucidePlay className="h-5 w-5 text-slate-400" />,
    },
    {
      title: "Spend vs target",
      value: "$5.6k / $8k",
      trend: { value: "72% to goal", label: "Aven campaign", up: true },
      icon: <LucideTrendingUp className="h-5 w-5 text-slate-400" />,
    },
    {
      title: "AI briefs approved",
      value: "9",
      trend: { value: "3 pending", label: "Need review", up: false },
      icon: <LucideSparkles className="h-5 w-5 text-slate-400" />,
    },
  ];

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <CampaignList campaigns={campaigns} />
            <CreatorTable creators={creators.slice(0, 5)} />
          </div>
          <div className="space-y-6">
            <ImportRosterForm />
            <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
              <h3 className="text-lg font-semibold">Quick add creator</h3>
              <QuickAddCreatorForm />
            </Card>
            <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
              <h3 className="text-lg font-semibold">New campaign</h3>
              <CampaignForm />
            </Card>
          </div>
        </section>
        <section className="grid gap-6 lg:grid-cols-2">
          <AIBriefCard />
          <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
            <h3 className="text-lg font-semibold">Ops snapshot</h3>
            <p className="text-sm text-slate-500">
              Shopify fulfilment, content deadlines, and pending payments.
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">Samples shipped</p>
                  <span className="text-xs text-slate-500">
                    6 creators awaiting tracking confirmation
                  </span>
                </div>
                <span className="text-slate-900">6 / 8</span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">Draft reviews</p>
                  <span className="text-xs text-slate-500">
                    Feedback needed before Meta upload
                  </span>
                </div>
                <span className="text-slate-900">4</span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">Payments ready</p>
                  <span className="text-xs text-slate-500">
                    Invoices verified this week
                  </span>
                </div>
                <span className="text-slate-900">$3,250</span>
              </li>
            </ul>
          </Card>
        </section>
      </div>
    </DashboardShell>
  );
}

