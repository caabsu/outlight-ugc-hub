"use client";

import { LucideBell, LucideChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./theme-toggle";

export const Topbar = () => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--panel)] px-6 py-4 backdrop-blur">
      <div className="w-1/3">
        <Input
          placeholder="Search creators, campaigns, briefs..."
          className="border-[var(--border-subtle)] bg-[var(--card)] text-[var(--text-primary)] shadow-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          className="rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-muted)] dark:hover:bg-slate-800"
        >
          <LucideBell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3 rounded-full border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-1.5 shadow-sm">
          <Avatar name="Alex Martin" className="h-9 w-9" />
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Alex Martin
            </p>
            <p className="text-xs text-[var(--text-muted)]">Creator Ops Lead</p>
          </div>
          <LucideChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
        </div>
      </div>
    </header>
  );
};
