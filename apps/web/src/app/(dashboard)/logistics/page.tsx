import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLogisticsBoard } from "@/server/services/metrics";

export default async function LogisticsPage() {
  const rows = await getLogisticsBoard();

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Logistics & fulfilment
          </h1>
          <p className="text-slate-500">
            Shopify, tracking, and payment readiness—synced to every creator.
          </p>
        </div>
        <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-400">
                <th className="pb-3">Creator</th>
                <th className="pb-3">Campaign</th>
                <th className="pb-3">Order</th>
                <th className="pb-3">Fulfilment</th>
                <th className="pb-3">Tracking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="py-4">{row.creatorName}</td>
                  <td className="py-4">{row.campaignName}</td>
                  <td className="py-4">{row.orderNumber ?? "—"}</td>
                  <td className="py-4">
                    <Badge variant="neutral">
                      {row.fulfillmentStatus ?? "Pending"}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <p className="font-semibold text-slate-900">
                      {row.trackingStatus ?? "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {row.trackingNote ?? ""}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </DashboardShell>
  );
}

