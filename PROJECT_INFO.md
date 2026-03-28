# Nexora Financial Dashboard - Core System Context

This document contains critical architectural decisions, database schemas, and API idiosyncrasies established during the development of Nexora. **Any LLM working on this repository MUST read this file to understand the hidden schemas and existing workflows.**

## Tech Stack
- **Framework**: Next.js 15 (App Router / React 19)
- **Styling**: Tailwind CSS & Glassmorphism
- **Animations**: GSAP (ScrollTrigger) & Framer Motion
- **Icons**: Lucide-React & Simple Icons (custom SVGs)
- **Database / Auth**: Supabase (PostgreSQL)
- **State Management**: Centralized `AuthContext`
- **Charting**: Recharts
- **External Market APIs**:
  - Finnhub (Stock Quotes & Candles) `process.env.NEXT_PUBLIC_FINNHUB_KEY`
  - CoinGecko (Crypto Quotes & Historical Ranges) *No API Key required for simple endpoints*

## Database: Supabase Structure

**Table**: `investments`
There is a strict discrepancy between standard financial terminology and the **actual schema** of this table.
> ⚠️ **CRITICAL SCHEMA MAP**:
> - `amount`: Numeric (This represents **Quantity/Units**, NOT the fiat cost)
> - `purchase_price`: Numeric (This represents the **Unit Buy Price**)
> - `name`: Text (Asset Name e.g. "Apple")
> - `symbol`: Text (Asset Ticker e.g. "AAPL")
> - `category`: Text ("Stocks" | "Crypto")
> - `date`: Text/Date (The purchase date)
> - `user_id`: UUID (Foreign key to Auth)

*Note: The table does NOT contain a `total_amount`, `cost`, or `value` column. Total cost must be calculated locally as `amount * purchase_price`.*

## Key Features & Custom Logic

### 1. Live Portfolio Dashboard (`src/app/dashboard/investment/page.tsx`)
- **Real-Time Auto-Fetching**: The 'Add Asset' form uses a 600ms debounded `useEffect` to fetch the live unit price while typing in the symbol input. There is no manual 'Refresh' button.
- **Bi-directional Math**: Modifying 'Quantity' auto-calculates 'Total Amount' based on the unit price, and modifying 'Total Amount' auto-calculates 'Quantity'.
- **Live Polling**: The dashboard incorporates a `15000ms` (15-second) `setInterval` to persistently fetch real-time market quotes from Finnhub/CoinGecko. This makes profit margins and portfolio values constantly tick in real-time.

### 2. Analytics & Charting (`src/app/dashboard/statistic/page.tsx`)
- **Independent Live Pinger**: The statistics page tracks a `livePrice` completely independently from the historical chart so that the 'Current Value' metric updates correctly even when the market is closed or chart data is sparse. It also runs a 15-second poll.
- **Dynamic Intraday Resolutions (THE FINNHUB PROBLEM)**: Finnhub's `/stock/candle` API breaks if asked for `resolution=D` (Daily) when the start/end date delta is under 24 hours. To make charts render flawlessly for "investments made today", the system calculates `deltaDays = toUnix - fromUnix`.
  - `< 1 day` = `5`m candles
  - `< 5 days` = `15`m candles
  - `< 14 days` = `60`m candles
  - `> 14 days` = `D`aily candles
  - If a user buys an asset 10 minutes ago, the chart intelligently swaps to 5m candles to successfully draw the UI.
- **Strict Dates**: Chart queries must start exactly at the time of purchase (`inv.date`) unless invalid. They are deliberately NOT defaulted to 30 days unless `isNaN`.

### 3. Smart Portfolio Generator (`src/app/dashboard/portfolio-generator/page.tsx`)
- **Dedicated Tooling**: Formerly part of the Investment page, this is now a standalone route for generating AI-driven or rule-based portfolio allocations.
- **Modular Data**: It pulls current asset context but remains decoupled from the immediate 'Add Asset' flow to prevent state clutter.

### 4. Cinematic Landing Page (`src/components/Advantages.tsx`)
- **Brand Fidelity**: Replaced text placeholders with real, high-resolution SVG logos (NYSE, Citi, Visa, etc.).
- **Interactive Visuals**: Uses GSAP ScrollTrigger for landing reveal animations and CSS filter-based hover effects (Frosted -> High Visibility) to maintain a premium financial aesthetic.

## Architecture: Authentication & State
- **AuthProvider (`src/lib/contexts/AuthContext.tsx`)**: Use the `useAuth()` hook as the single source of truth for session state and user metadata. 
- **Session Locking**: Custom logic ensures only one active session 'heartbeat' is maintained to avoid the "lock stolen" Supabase edge cases during concurrent tab usage.

## Development Workflows
- **Row-Level Security (RLS)**: Always bypass RLS gracefully by ensuring all `.insert()` and `.delete()` calls chain `.eq("user_id", user.id)`. 
- **User Context**: Always prefer `useAuth()` over raw `supabase.auth.getSession()` to maintain reactive UI state and prevent token mismatches.
- **Visual Design**: Adhere to the `bg-[#141414]` base theme with strict dark-mode glassmorphism. Components in `src/components/ui` should follow the established `border-white/5` and `shadow-[0_0_20px_rgba(0,0,0,0.5)]` patterns.
- **GSAP Implementation**: When adding new sections, use the `ScrollTrigger` patterns established in `Advantages.tsx` for consistent entrance animations.
