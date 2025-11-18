"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export const DashboardShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-transparent text-[var(--text-primary)]">
      <div className="hidden w-64 md:block">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
