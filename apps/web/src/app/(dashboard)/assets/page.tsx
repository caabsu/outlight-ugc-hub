import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { AssetUploadForm } from "@/components/assets/asset-upload-form";
import { getAssetPerformance } from "@/server/services/metrics";
import { getCreatorRoster } from "@/server/services/dashboard";

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
          <h1 className="text-2xl font-semibold text-slate-900">
            Asset Library
          </h1>
          <p className="text-slate-500">
            Every deliverable synced to Supabase storage and Meta Ads.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="glass-panel border-none bg-white/90 lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-2xl border border-slate-100 p-4"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {asset.creatorName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {asset.campaignName} • {asset.type}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-slate-400">Impr.</p>
                      <p className="font-semibold text-slate-900">
                        {asset.impressions.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Spend</p>${" "}
                      <p className="font-semibold text-slate-900">
                        {asset.spend.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">ROAS</p>
                      <p className="font-semibold text-slate-900">
                        {asset.roas?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="glass-panel border-none bg-white/90">
            <h3 className="text-lg font-semibold">Upload asset</h3>
            {defaultCreatorId ? (
              <AssetUploadForm campaignCreatorId={defaultCreatorId} />
            ) : (
              <p className="text-sm text-slate-500">
                Add a creator before uploading assets.
              </p>
            )}
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
