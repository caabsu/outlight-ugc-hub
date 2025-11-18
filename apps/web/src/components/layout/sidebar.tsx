"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/data/constants";
import { cn } from "@/lib/utils";
import { LucidePlus, LucideSparkles } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col gap-8 border-r border-[var(--border-subtle)] bg-[var(--panel)] px-5 py-6 backdrop-blur">
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-full bg-[var(--bg-muted)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)] dark:bg-slate-800">
            <LucideSparkles className="h-4 w-4" />
            Outlight
          </div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            UGC Hub
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Campaigns, creators, and delivery in one calmer workspace.
          </p>
        </div>
        <nav className="space-y-1 text-sm font-medium">
          {NAV_LINKS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] dark:hover:bg-slate-800",
                  active &&
                    "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] text-white shadow-lg shadow-indigo-500/15 hover:text-white",
                )}
              >
                <span>{item.label}</span>
                {active && <LucidePlus className="h-4 w-4 rotate-45 opacity-60" />}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] px-4 py-3">
        <p className="text-xs font-medium text-[var(--text-muted)]">
          Residency: Brand Ops
        </p>
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          Quarter: Q4 \u2022 Collaborative
        </p>
      </div>
    </aside>
  );
};
