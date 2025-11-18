import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { getFrameworks } from "@/data/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const framework = getFrameworks().find((f) => f.id === params.id);
  if (!framework) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const mono = await pdf.embedFont(StandardFonts.Courier);
  const page = pdf.addPage([612, 792]); // Letter

  const { width, height } = page.getSize();
  const margin = 50;
  let y = height - margin;

  const addText = (
    text: string,
    opts: { size?: number; font?: typeof font; lineGap?: number } = {},
  ) => {
    const size = opts.size ?? 12;
    const usedFont = opts.font ?? font;
    const lineGap = opts.lineGap ?? 4;
    const lines = text.split("\n");
    for (const line of lines) {
      page.drawText(line, { x: margin, y, size, font: usedFont });
      y -= size + lineGap;
      if (y < margin) break;
    }
  };

  addText(framework.title, { size: 18 });
  addText("");
  addText(`Created: ${new Date(framework.createdAt).toLocaleString()}`, {
    size: 10,
    font,
  });
  addText("");
  addText("LaTeX Source", { size: 12, font });
  addText(framework.latex, { size: 9, font: mono, lineGap: 2 });

  const pdfBytes = await pdf.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${framework.title
        .replace(/\s+/g, "-")
        .toLowerCase()}.pdf"`,
    },
  });
}
