"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "bg-[var(--accent)] text-white shadow-[0_14px_45px_rgba(37,99,235,0.25)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] active:translate-y-0 dark:shadow-[0_16px_50px_rgba(37,99,235,0.35)]",
  secondary:
    "border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-primary)] hover:border-[var(--accent-strong)]/60 hover:text-[var(--text-primary)] dark:bg-slate-900/60",
  outline:
    "border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)] dark:border-slate-700 dark:text-white",
  ghost:
    "text-[var(--text-muted)] hover:bg-[var(--bg-muted)] dark:text-slate-200 dark:hover:bg-slate-800",
};

export type ButtonVariant = keyof typeof buttonVariants;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50 disabled:pointer-events-none disabled:opacity-60",
        buttonVariants[variant],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
