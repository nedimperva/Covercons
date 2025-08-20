import { NextResponse } from "next/server";

// Simple in-memory cache with TTL
type CacheEntry = { body: string; expiry: number };
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour
let cache: CacheEntry | null = null;

export async function GET() {
  try {
    const now = Date.now();
    if (cache && cache.expiry > now) {
      return new NextResponse(cache.body, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8", "x-cache": "HIT" },
      });
    }

    const resp = await fetch("https://fonts.google.com/metadata/icons", { cache: "no-store" });
    const text = await resp.text();

    cache = { body: text, expiry: now + CACHE_TTL_MS };

    return new NextResponse(text, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8", "x-cache": "MISS" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "failed" }, { status: 500 });
  }
}
