import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { CampaignList } from "@/components/dashboard/campaign-list";
import { CreatorTable } from "@/components/dashboard/creator-table";
import { Card } from "@/components/ui/card";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { QuickAddCreatorForm } from "@/components/creators/quick-add-form";
import { getCampaignOverview, getCreatorRoster } from "@/server/services/dashboard";
import { getAssetPerformance } from "@/server/services/metrics";

export default async function DashboardPage() {
  const [campaigns, creators, assets] = await Promise.all([
    getCampaignOverview(),
    getCreatorRoster(),
    getAssetPerformance(),
  ]);

  const stats = [
    {
      title: "Campaigns",
      value: String(campaigns.length),
      trend: undefined,
    },
    {
      title: "Creators",
      value: String(creators.length),
      trend: undefined,
    },
    {
      title: "Assets",
      value: String(assets.length),
      trend: undefined,
    },
  ];

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </DashboardShell>
  );
}
