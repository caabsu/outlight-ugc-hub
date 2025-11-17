"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  imageUrl?: string | null;
}

export const Avatar = ({ name, imageUrl, className, ...props }: AvatarProps) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600",
        className,
      )}
      {...props}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
};
