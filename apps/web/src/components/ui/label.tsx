"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ className, ...props }: LabelProps) => (
  <label
    className={cn(
      "text-sm font-medium text-slate-600 dark:text-slate-200",
      className,
    )}
    {...props}
  />
);
