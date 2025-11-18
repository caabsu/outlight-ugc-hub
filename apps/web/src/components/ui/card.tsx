"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-[0_22px_60px_rgba(0,0,0,0.35)]",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";
