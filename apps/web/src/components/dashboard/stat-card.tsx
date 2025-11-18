"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Trend = {
  label: string;
  value: string;
  up?: boolean;
};

export interface StatCardProps {
  title: string;
  value: string;
  trend?: Trend;
  icon?: ReactNode;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  trend,
  icon,
  className,
}: StatCardProps) => (
  <Card
    className={cn(
      "flex flex-col gap-3 border-none bg-[var(--card)] shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:bg-slate-900",
      className,
    )}
  >
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-[var(--text-muted)]">{title}</p>
      {icon && (
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg-muted)] text-[var(--text-primary)] shadow-inner dark:bg-slate-800">
          {icon}
        </div>
      )}
    </div>
    <p className="text-3xl font-semibold text-[var(--text-primary)]">{value}</p>
    {trend && (
      <p
        className={cn(
          "text-sm font-medium",
          trend.up
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-rose-600 dark:text-rose-400",
        )}
      >
        {trend.value} - {trend.label}
      </p>
    )}
  </Card>
);

