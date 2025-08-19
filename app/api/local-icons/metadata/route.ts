import { NextRequest, NextResponse } from "next/server";
import { lucideMetadata } from "../../../../data/local-icons/lucide";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pack = searchParams.get("pack") || "lucide";
  if (pack !== "lucide") {
    return NextResponse.json({ icons: [] });
  }
  return NextResponse.json({ icons: lucideMetadata });
}
