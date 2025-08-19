import { NextRequest, NextResponse } from "next/server";

// Cache by URL key with TTL
type CacheEntry = { body: string; expiry: number; contentType: string };
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour
const cache = new Map<string, CacheEntry>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "materialicons"; // e.g., materialicons, materialiconsoutlined
  const name = searchParams.get("name");
  const version = searchParams.get("version") || "1";
  const size = searchParams.get("size") || "24px";

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const targetUrl = `https://fonts.gstatic.com/s/i/${type}/${name}/v${version}/${size}.svg`;
  const now = Date.now();

  const hit = cache.get(targetUrl);
  if (hit && hit.expiry > now) {
    return new NextResponse(hit.body, { status: 200, headers: { "Content-Type": hit.contentType, "x-cache": "HIT" } });
  }

  try {
    const resp = await fetch(targetUrl, { cache: "no-store" });
    if (!resp.ok) return NextResponse.json({ error: "fetch failed" }, { status: 502 });
    const body = await resp.text();
    const contentType = resp.headers.get("content-type") || "image/svg+xml";
    cache.set(targetUrl, { body, contentType, expiry: now + CACHE_TTL_MS });
    return new NextResponse(body, { status: 200, headers: { "Content-Type": contentType, "x-cache": "MISS" } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "failed" }, { status: 500 });
  }
}

