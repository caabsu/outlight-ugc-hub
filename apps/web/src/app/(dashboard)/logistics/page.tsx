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
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Logistics & fulfilment
          </h1>
          <p className="text-[var(--text-muted)]">
            Shopify, tracking, and payment readiness - synced to every creator.
          </p>
        </div>
        <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
          {rows.length === 0 ? (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] px-4 py-6 text-sm text-[var(--text-muted)]">
              No logistics to show yet. Link Shopify orders to creators to monitor fulfilment.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-[var(--text-muted)]">
                  <th className="pb-3">Creator</th>
                  <th className="pb-3">Campaign</th>
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Fulfilment</th>
                  <th className="pb-3">Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="py-4">{row.creatorName}</td>
                    <td className="py-4 text-[var(--text-muted)]">{row.campaignName}</td>
                    <td className="py-4">{row.orderNumber ?? "--"}</td>
                    <td className="py-4">
                      <Badge variant="neutral">
                        {row.fulfillmentStatus ?? "Pending"}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <p className="font-semibold text-[var(--text-primary)]">
                        {row.trackingStatus ?? "--"}
                      </p>
                      {row.trackingNote && (
                        <p className="text-xs text-[var(--text-muted)]">
                          {row.trackingNote}
                        </p>
                      )}
                    </td>
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
