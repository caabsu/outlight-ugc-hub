import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuickAddCreatorForm } from "@/components/creators/quick-add-form";
import {
  bulkDeleteRejectedAction,
  toggleShortlistAction,
} from "@/server/actions/creators";
import { getCreatorRoster } from "@/server/services/dashboard";

export default async function CreatorsPage() {
  const creators = await getCreatorRoster();
  const campaignId = creators.at(0)?.campaignId ?? "";

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Creator CRM
            </h1>
            <p className="text-slate-500">
              Shortlist, brief, and pay every creator in one place.
            </p>
          </div>
        </div>
        <Card className="glass-panel border-none bg-white/90">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-400">
                <th className="pb-3">Creator</th>
                <th className="pb-3">Campaign</th>
                <th className="pb-3">Followers</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Shortlisted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {creators.map((creator) => (
                <tr key={creator.id}>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <a
                        href={creator.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-slate-900 hover:underline"
                      >
                        {creator.name}
                      </a>
                      <span className="text-xs text-slate-500">
                        {creator.platform}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">{creator.campaignName}</td>
                  <td className="py-4">
                    {creator.followers?.toLocaleString() ?? "—"}
                  </td>
                  <td className="py-4">
                    <Badge>{creator.status.replace("_", " ")}</Badge>
                  </td>
                  <td className="py-4">
                    <form action={toggleShortlistAction}>
                      <input type="hidden" name="id" value={creator.id} />
                      <input
                        type="hidden"
                        name="shortlisted"
                        value={(!creator.shortlisted).toString()}
                      />
                      <Button
                        type="submit"
                        variant={creator.shortlisted ? "primary" : "outline"}
                      >
                        {creator.shortlisted ? "Shortlisted" : "Shortlist"}
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass-panel border-none bg-white/90">
            <h3 className="text-lg font-semibold">Bulk hygiene</h3>
            <p className="text-sm text-slate-500">
              Remove non-shortlisted creators to keep the CRM focused.
            </p>
            {campaignId ? (
              <form action={bulkDeleteRejectedAction} className="mt-4">
                <input type="hidden" name="campaignId" value={campaignId} />
                <Button type="submit" variant="outline">
                  Delete non-shortlisted
                </Button>
              </form>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                Create a campaign first to enable bulk actions.
              </p>
            )}
          </Card>
          <Card className="glass-panel border-none bg-white/90">
            <h3 className="text-lg font-semibold">Manual add</h3>
            <QuickAddCreatorForm />
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
