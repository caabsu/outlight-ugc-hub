"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "neutral" | "success" | "warning" | "danger";

const variants: Record<BadgeVariant, string> = {
  primary: "bg-slate-900/90 text-white",
  neutral: "bg-slate-100 text-slate-600",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = ({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variants[variant],
      className,
    )}
    {...props}
  />
);
