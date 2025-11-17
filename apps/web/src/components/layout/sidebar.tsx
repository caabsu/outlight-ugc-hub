"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/data/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucidePlus, LucideSparkles } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col justify-between border-r border-slate-100 bg-white/70 px-4 py-6">
      <div className="space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Outlight
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">UGC Hub</h1>
        </div>
        <nav className="space-y-1 text-sm font-medium">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100",
                pathname === item.href &&
                  "bg-slate-900 text-white hover:bg-slate-900",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="space-y-3 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white shadow-lg">
        <p className="text-sm font-medium">
          Need an onboarding checklist for a new creator?
        </p>
        <Button
          variant="secondary"
          className="w-full justify-center bg-white/20 text-white hover:bg-white/30"
        >
          <LucideSparkles className="h-4 w-4" />
          Launch Ops Copilot
        </Button>
        <Button variant="primary" className="w-full justify-center bg-white text-slate-900 hover:bg-slate-100">
          <LucidePlus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>
    </aside>
  );
};
