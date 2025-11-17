"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "bg-gradient-to-r from-slate-900 to-slate-700 text-white hover:from-slate-800 hover:to-slate-600 shadow-sm",
  secondary:
    "bg-white/5 text-white border border-white/10 hover:bg-white/10",
  outline:
    "border border-slate-300 text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:text-white",
  ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-200",
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
