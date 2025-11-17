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
      "flex flex-col gap-3 border-none bg-white shadow-lg shadow-slate-200/70",
      className,
    )}
  >
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {icon}
    </div>
    <p className="text-3xl font-semibold">{value}</p>
    {trend && (
      <p
        className={cn(
          "text-sm font-medium",
          trend.up ? "text-emerald-600" : "text-rose-600",
        )}
      >
        {trend.value} • {trend.label}
      </p>
    )}
  </Card>
);
