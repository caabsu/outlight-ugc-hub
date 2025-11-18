import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { AssetUploadForm } from "@/components/assets/asset-upload-form";
import { getAssetPerformance } from "@/server/services/metrics";
import { getCreatorRoster } from "@/server/services/dashboard";

type AssetPerformance = Awaited<
  ReturnType<typeof getAssetPerformance>
>[number];

export default async function AssetsPage() {
  const [assets, creators] = await Promise.all([
    getAssetPerformance(),
    getCreatorRoster(),
  ]);
  const defaultCreatorId = creators.at(0)?.id ?? "";

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Asset Library
          </h1>
          <p className="text-[var(--text-muted)]">
            Every deliverable synced to Supabase storage and Meta Ads.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80 lg:col-span-2">
            {assets.length === 0 ? (
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] px-4 py-6 text-sm text-[var(--text-muted)]">
                No assets yet. Upload your first asset to start tracking performance.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {assets.map((asset: AssetPerformance) => (
                  <div
                    key={asset.id}
                    className="rounded-2xl border border-[var(--border-subtle)] p-4"
                  >
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {asset.creatorName}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {asset.campaignName} • {asset.type}
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-[var(--text-muted)]">Impr.</p>
                        <p className="font-semibold text-[var(--text-primary)]">
                          {asset.impressions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--text-muted)]">Spend</p>
                        <p className="font-semibold text-[var(--text-primary)]">
                          ${asset.spend.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--text-muted)]">ROAS</p>
                        <p className="font-semibold text-[var(--text-primary)]">
                          {asset.roas?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
            <h3 className="text-lg font-semibold">Upload asset</h3>
            {defaultCreatorId ? (
              <AssetUploadForm campaignCreatorId={defaultCreatorId} />
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                Add a creator before uploading assets.
              </p>
            )}
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
