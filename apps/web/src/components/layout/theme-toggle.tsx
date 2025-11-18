"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";
import { LucideMoon, LucideSun } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      aria-label="Toggle color theme"
      onClick={toggleTheme}
      className="rounded-full px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {isDark ? (
        <div className="flex items-center gap-2">
          <LucideSun className="h-4 w-4" />
          <span className="hidden text-sm font-medium sm:inline-block">
            Light
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <LucideMoon className="h-4 w-4" />
          <span className="hidden text-sm font-medium sm:inline-block">
            Dark
          </span>
        </div>
      )}
    </Button>
  );
};
