import { NextRequest, NextResponse } from "next/server";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const { svg, width, height, format }: { svg: string; width?: number; height?: number; format?: "png" | "webp" | "jpeg" } = await req.json();
    if (!svg) return NextResponse.json({ error: "Missing svg" }, { status: 400 });

    const resvg = new Resvg(svg, {
      fitTo: width && height ? { mode: "width", value: width } : undefined,
    });
    const pngData = resvg.render().asPng();

    let buf: any = Buffer.from(pngData);
    let contentType = "image/png";
    if (format && format !== "png") {
      if (format === "webp") {
        buf = await (sharp as any)(buf).webp({ quality: 95 }).toBuffer();
        contentType = "image/webp";
      } else if (format === "jpeg") {
        buf = await (sharp as any)(buf).jpeg({ quality: 95 }).toBuffer();
        contentType = "image/jpeg";
      }
    }

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename=cover.${format ?? "png"}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "failed" }, { status: 500 });
  }
}
