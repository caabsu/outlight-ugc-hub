import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuickAddCreatorForm } from "@/components/creators/quick-add-form";
import { getCreatorRoster } from "@/server/services/dashboard";
import { getFrameworks, getBaseFramework } from "@/data/store";
import type { CreatorRow } from "@/components/dashboard/creator-table";
import {
  createFrameworkAction,
  deleteFrameworkAction,
  setBaseFrameworkAction,
} from "@/server/actions/frameworks";

export default async function CreatorsPage() {
  const creators = await getCreatorRoster();
  const frameworks = getFrameworks();
  const baseFramework = getBaseFramework();

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              Creator CRM
            </h1>
            <p className="text-[var(--text-muted)]">
              Quick roster plus per-creator frameworks you can edit and export.
            </p>
          </div>
        </div>
        <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-[var(--text-muted)]">
                <th className="pb-3">Creator</th>
                <th className="pb-3">Campaign</th>
                <th className="pb-3">Followers</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Framework</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {creators.map((creator: CreatorRow) => (
                <tr key={creator.id}>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <a
                        href={creator.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-[var(--text-primary)] hover:underline"
                      >
                        {creator.name}
                      </a>
                      <span className="text-xs text-[var(--text-muted)]">
                        {creator.platform}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-[var(--text-muted)]">
                    {creator.campaignName ?? "—"}
                  </td>
                  <td className="py-4">
                    {creator.followers?.toLocaleString() ?? "—"}
                  </td>
                  <td className="py-4">
                    <Badge>{creator.status.replace("_", " ")}</Badge>
                  </td>
                  <td className="py-4">
                    <form action={createFrameworkAction} className="space-y-2">
                      <input type="hidden" name="creatorId" value={creator.id} />
                      <textarea
                        name="direction"
                        rows={3}
                        className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--card)] p-2 text-sm text-[var(--text-primary)]"
                        placeholder="Direction for this creator (tone, hook, CTA)"
                        required
                      />
                      <Button type="submit" variant="outline" className="w-full">
                        Create framework
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
            <h3 className="text-lg font-semibold">Base knowledge framework</h3>
            <p className="text-sm text-[var(--text-muted)]">
              Edit the shared LaTeX structure all creator frameworks inherit.
            </p>
            <form action={setBaseFrameworkAction} className="mt-4 space-y-3">
              <textarea
                name="latex"
                defaultValue={baseFramework}
                rows={8}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-3 font-mono text-xs text-[var(--text-primary)]"
                required
              />
              <Button type="submit" variant="outline">
                Save base framework
              </Button>
            </form>
          </Card>
          <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
            <h3 className="text-lg font-semibold">Manual add</h3>
            <QuickAddCreatorForm />
          </Card>
        </div>
        <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
          <h3 className="text-lg font-semibold">Creator frameworks</h3>
          {frameworks.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              No frameworks yet. Add direction for a creator above to generate one.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {frameworks.map((fw) => {
                const creator = creators.find((c) => c.id === fw.creatorId);
                return (
                  <div
                    key={fw.id}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {fw.title}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {creator?.name ?? "Creator"} • {new Date(fw.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/api/frameworks/${fw.id}/pdf`}
                          className="text-sm font-semibold text-[var(--accent-strong)] underline-offset-4 hover:underline"
                        >
                          Download PDF
                        </a>
                        <details className="text-sm">
                          <summary className="cursor-pointer text-[var(--text-muted)]">
                            View LaTeX
                          </summary>
                          <pre className="mt-2 max-h-60 overflow-auto rounded-lg bg-[var(--card)] p-3 text-xs text-[var(--text-primary)]">
{fw.latex}
                          </pre>
                        </details>
                        <form action={deleteFrameworkAction}>
                          <input type="hidden" name="id" value={fw.id} />
                          <Button variant="outline" type="submit">
                            Delete
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
