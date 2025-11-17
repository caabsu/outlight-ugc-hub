"use client";

import { useFormStatus } from "react-dom";
import { importCreators } from "@/server/actions/imports";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Importing..." : "Import Excel roster"}
    </Button>
  );
};

export const ImportRosterForm = () => {
  return (
    <Card className="glass-panel border-none bg-white/90">
      <form action={importCreators} className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Excel roster</h3>
          <p className="text-sm text-slate-500">
            Drop in the BrandOutlight export and we&apos;ll shortlist automatically.
          </p>
        </div>
        <Input name="file" type="file" accept=".xlsx,.xls" required />
        <SubmitButton />
      </form>
    </Card>
  );
};
