import Link from "next/link";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type CreatorRow = {
  id: string;
  name: string;
  platform: string;
  profileUrl: string;
  followers?: number;
  engagementRate?: number;
  status: string;
  shortlisted: boolean;
  campaignName?: string;
};

const statusToBadge: Record<string, BadgeProps["variant"]> = {
  ONBOARDING: "primary",
  OUTREACH: "warning",
  PRODUCING: "primary",
  DELIVERED: "success",
  NOT_INTERESTED: "danger",
  LEAD: "neutral",
  ARCHIVED: "neutral",
};

export const CreatorTable = ({ creators }: { creators: CreatorRow[] }) => (
  <Card className="glass-panel border-none bg-[var(--card)] dark:bg-slate-900/80">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">Hired creators</h3>
        <p className="text-sm text-slate-500">Across all active campaigns</p>
      </div>
      <Link
        href="/creators"
        className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline"
      >
        Manage creators
      </Link>
    </div>
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase text-slate-400">
            <th className="pb-2">Creator</th>
            <th className="pb-2">Followers</th>
            <th className="pb-2">ER</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Campaign</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {creators.map((creator) => (
            <tr key={creator.id}>
              <td className="py-3">
                <div className="flex flex-col">
                  <Link
                    href={creator.profileUrl}
                    target="_blank"
                    className="font-semibold text-slate-900 hover:underline"
                  >
                    {creator.name}
                  </Link>
                  <span className="text-xs text-slate-500">
                    {creator.platform}
                  </span>
                </div>
              </td>
              <td className="py-3 font-semibold text-slate-900">
                {creator.followers?.toLocaleString() ?? "—"}
              </td>
              <td className="py-3">{creator.engagementRate ?? "—"}%</td>
              <td className="py-3">
                <Badge variant={statusToBadge[creator.status] ?? "neutral"}>
                  {creator.status.replace("_", " ")}
                </Badge>
              </td>
              <td className="py-3 text-slate-500">{creator.campaignName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

