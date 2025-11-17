"use client";

import { LucideBell, LucideChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Topbar = () => {
  return (
    <header className="flex items-center justify-between border-b border-slate-100 bg-white/60 px-6 py-4 backdrop-blur">
      <div className="w-1/3">
        <Input placeholder="Search creators, campaigns, briefs..." />
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="text-slate-500">
          <LucideBell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1">
          <Avatar name="Alex Martin" className="h-8 w-8" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Alex Martin</p>
            <p className="text-xs text-slate-500">Creator Ops Lead</p>
          </div>
          <LucideChevronDown className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
};
