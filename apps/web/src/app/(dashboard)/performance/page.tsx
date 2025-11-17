import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { PerformanceChart } from "@/components/performance/performance-chart";
import { getAssetPerformance } from "@/server/services/metrics";

type AssetPerformance = Awaited<
  ReturnType<typeof getAssetPerformance>
>[number];

export default async function PerformancePage() {
  const assets = await getAssetPerformance();

  const chart = assets.map((asset: AssetPerformance, index) => ({
    label: `Asset ${index + 1}`,
    spend: asset.spend,
    revenue: asset.revenue,
  }));

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Performance intelligence
          </h1>
          <p className="text-slate-500">
            Combine Meta Ads data with Shopify orders to understand creator ROI.
          </p>
        </div>
        <Card className="glass-panel border-none bg-white/90">
          <h3 className="text-lg font-semibold">Spend vs revenue</h3>
          <PerformanceChart data={chart} />
        </Card>
        <Card className="glass-panel border-none bg-white/90">
          <h3 className="text-lg font-semibold">Leaderboard</h3>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-400">
                <th className="pb-3">Creator</th>
                <th className="pb-3">Spend</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
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
        </Card>
      </div>
    </DashboardShell>
  );
}
