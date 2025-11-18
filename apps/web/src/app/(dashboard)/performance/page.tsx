import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { PerformanceChart } from "@/components/performance/performance-chart";
import { getAssetPerformance } from "@/server/services/metrics";

type AssetPerformance = Awaited<
  ReturnType<typeof getAssetPerformance>
>[number];

export default async function PerformancePage() {
  const assets: AssetPerformance[] = await getAssetPerformance();

  const chart = assets.map((asset: AssetPerformance, index: number) => ({
    label: `Asset ${index + 1}`,
    spend: asset.spend,
    revenue: asset.revenue,
  }));

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Performance intelligence
          </h1>
          <p className="text-[var(--text-muted)]">
            Combine Meta Ads data with Shopify orders to understand creator ROI.
          </p>
        </div>
        <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
          <h3 className="text-lg font-semibold">Spend vs revenue</h3>
          {chart.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--text-muted)]">
              No asset performance yet. Upload assets and sync metrics to see charts.
            </p>
          ) : (
            <PerformanceChart data={chart} />
          )}
        </Card>
        <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
          <h3 className="text-lg font-semibold">Leaderboard</h3>
          {assets.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--text-muted)]">
              No leaderboard to show yet. Metrics will appear as soon as assets have spend and revenue.
            </p>
          ) : (
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-[var(--text-muted)]">
                  <th className="pb-3">Creator</th>
                  <th className="pb-3">Spend</th>
                  <th className="pb-3">Revenue</th>
                  <th className="pb-3">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {assets.map((asset: AssetPerformance) => (
                  <tr key={asset.id}>
                    <td className="py-3">{asset.creatorName}</td>
                    <td className="py-3">
                      ${asset.spend.toLocaleString()}
                    </td>
                    <td className="py-3">
                      ${asset.revenue.toLocaleString()}
                    </td>
                    <td className="py-3">{asset.roas?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
