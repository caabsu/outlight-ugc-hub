"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  deleteFramework,
  getBaseFramework,
  getCreators,
  saveFramework,
  setBaseFramework,
} from "@/data/store";

const baseSchema = z.object({
  latex: z.string().min(10),
});

const frameworkSchema = z.object({
  creatorId: z.string().min(1),
  direction: z.string().min(5),
});

export async function setBaseFrameworkAction(formData: FormData): Promise<void> {
  const parsed = baseSchema.safeParse({
    latex: formData.get("latex"),
  });
  if (!parsed.success) return;

  setBaseFramework(parsed.data.latex);
  revalidatePath("/creators");
}

export async function createFrameworkAction(formData: FormData): Promise<void> {
  const parsed = frameworkSchema.safeParse({
    creatorId: formData.get("creatorId"),
    direction: formData.get("direction"),
  });

  if (!parsed.success) return;

  const creator = getCreators().find((c) => c.id === parsed.data.creatorId);
  if (!creator) return;

  const base = getBaseFramework();
  const latex = String.raw`\documentclass{article}
\usepackage[margin=1in]{geometry}
\usepackage{amsmath}
\usepackage{enumitem}
\begin{document}

\section*{Creator Framework: ${creator.name}}

\textbf{Platform:} ${creator.platform} \\
\textbf{Profile:} ${creator.profileUrl} \\
\textbf{Direction:} ${parsed.data.direction}

\vspace{8pt}
${base}

\section*{Tailored Notes}
\begin{itemize}[leftmargin=*]
  \item Match creator tone and cadence.
  \item Keep runtime under 60 seconds for short-form.
  \item Align CTA with campaign offer; avoid hard sells.
\end{itemize}

\end{document}
`;

  saveFramework({
    creatorId: creator.id,
    title: `Framework for ${creator.name}`,
    latex,
  });

  revalidatePath("/creators");
}

export async function deleteFrameworkAction(formData: FormData): Promise<void> {
  const id = formData.get("id")?.toString();
  if (!id) return;
  deleteFramework(id);
  revalidatePath("/creators");
}
