import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getFrameworks } from "@/data/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const framework = getFrameworks().find((f) => f.id === params.id);
  if (!framework) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk as Buffer));
  doc.on("end", () => {});

  doc.fontSize(16).text(framework.title, { underline: true });
  doc.moveDown();
  doc.fontSize(10).text("LaTeX source", { oblique: true });
  doc.moveDown();
  doc
    .font("Courier")
    .fontSize(9)
    .text(framework.latex, {
      lineGap: 2,
    });

  doc.end();

  const buffer = await new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${framework.title
        .replace(/\s+/g, "-")
        .toLowerCase()}.pdf"`,
    },
  });
}
