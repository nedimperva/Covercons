import { NextResponse } from "next/server";

export async function GET() {
  try {
    const resp = await fetch("https://fonts.google.com/metadata/icons", {
      cache: "no-store",
    });
    const text = await resp.text();
    return new NextResponse(text, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "failed" }, { status: 500 });
  }
}

