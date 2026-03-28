import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  const from = req.nextUrl.searchParams.get("from"); // UNIX timestamp (seconds)
  const to = req.nextUrl.searchParams.get("to");     // UNIX timestamp (seconds)

  if (!symbol || !from || !to) {
    return NextResponse.json({ error: "Missing symbol, from, or to" }, { status: 400 });
  }

  try {
    // Determine appropriate interval based on date range
    const rangeDays = (Number(to) - Number(from)) / 86400;
    let interval = "1d";
    if (rangeDays <= 5) interval = "15m";
    else if (rangeDays <= 30) interval = "1h";
    else if (rangeDays <= 365) interval = "1d";
    else interval = "1wk";

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${from}&period2=${to}&interval=${interval}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Yahoo Finance returned ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    const result = data?.chart?.result?.[0];

    if (!result) {
      return NextResponse.json({ error: "No chart data returned" }, { status: 404 });
    }

    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];

    // Build array of { t: unix_ms, c: close_price }
    const points: { t: number; c: number }[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (closes[i] != null) {
        points.push({
          t: timestamps[i] * 1000, // convert to ms
          c: Math.round(closes[i] * 100) / 100,
        });
      }
    }

    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      interval,
      points,
    });
  } catch (e) {
    console.error("Stock chart fetch error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
