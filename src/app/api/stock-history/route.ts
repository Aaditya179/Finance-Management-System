import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  const dateStr = req.nextUrl.searchParams.get("date"); // YYYY-MM-DD

  if (!symbol || !dateStr) {
    return NextResponse.json({ error: "Missing symbol or date" }, { status: 400 });
  }

  try {
    // Parse the target date and create a range (target day +1 day to ensure we get data)
    const targetDate = new Date(dateStr + "T00:00:00Z");
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const period1 = Math.floor(targetDate.getTime() / 1000);
    const period2 = Math.floor(nextDay.getTime() / 1000);

    // Use Yahoo Finance chart API to get historical close price
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${period1}&period2=${period2}&interval=1d`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });

    if (!res.ok) {
      // Fallback: try a wider range and pick the closest date
      const widerFrom = new Date(targetDate);
      widerFrom.setDate(widerFrom.getDate() - 5); // 5 days back to handle weekends
      const widerTo = new Date(targetDate);
      widerTo.setDate(widerTo.getDate() + 2);

      const fallbackUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${Math.floor(widerFrom.getTime() / 1000)}&period2=${Math.floor(widerTo.getTime() / 1000)}&interval=1d`;

      const fallbackRes = await fetch(fallbackUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
      });

      if (!fallbackRes.ok) {
        return NextResponse.json({ error: "Failed to fetch historical data" }, { status: 502 });
      }

      const fallbackData = await fallbackRes.json();
      const closes = fallbackData?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;

      if (closes && closes.length > 0) {
        // Return the last available close price (closest to target)
        const price = closes[closes.length - 1];
        return NextResponse.json({ price, source: "yahoo_fallback" });
      }

      return NextResponse.json({ error: "No data available for this date" }, { status: 404 });
    }

    const data = await res.json();
    const closes = data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;

    if (closes && closes.length > 0) {
      return NextResponse.json({ price: closes[0], source: "yahoo" });
    }

    // If exact date returned no data (weekend/holiday), widen the search
    const widerFrom = new Date(targetDate);
    widerFrom.setDate(widerFrom.getDate() - 5);
    const widerTo = new Date(targetDate);
    widerTo.setDate(widerTo.getDate() + 2);

    const retryUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${Math.floor(widerFrom.getTime() / 1000)}&period2=${Math.floor(widerTo.getTime() / 1000)}&interval=1d`;

    const retryRes = await fetch(retryUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });

    if (retryRes.ok) {
      const retryData = await retryRes.json();
      const retryCloses = retryData?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
      if (retryCloses && retryCloses.length > 0) {
        return NextResponse.json({ price: retryCloses[retryCloses.length - 1], source: "yahoo_nearest" });
      }
    }

    return NextResponse.json({ error: "No historical price found" }, { status: 404 });
  } catch (e) {
    console.error("Historical price fetch error:", e);
    return NextResponse.json({ error: "Server error fetching historical price" }, { status: 500 });
  }
}
