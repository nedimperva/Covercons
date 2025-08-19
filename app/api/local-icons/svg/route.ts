import { NextRequest, NextResponse } from "next/server";
import { lucideIcons } from "../../../../data/local-icons/lucide";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pack = searchParams.get("pack") || "lucide";
  const name = searchParams.get("name");
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });
  if (pack !== "lucide") return NextResponse.json({ error: "unknown pack" }, { status: 400 });
  const svg = lucideIcons[name];
  if (!svg) return NextResponse.json({ error: "not found" }, { status: 404 });
  return new NextResponse(svg, { status: 200, headers: { "Content-Type": "image/svg+xml" } });
}
