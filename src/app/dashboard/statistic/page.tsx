"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { ChevronDown, TrendingUp, TrendingDown, Activity, DollarSign, Calendar, Info, AlertCircle } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

interface Investment {
  id: string;
  name: string;
  symbol: string;
  purchase_price: number;
  amount: number;
  category: "Stocks" | "Crypto";
  date: string;
}

interface ChartDataPoint {
  dateStr: string;
  timestamp: number;
  price: number;
}

const symbolToId: Record<string, string> = {
  "BTC": "bitcoin",
  "ETH": "ethereum",
  "USDT": "tether",
  "SOL": "solana",
  "BNB": "binancecoin",
  "XRP": "ripple",
  "ADA": "cardano",
  "DOGE": "dogecoin",
  "MATIC": "matic-network",
  "DOT": "polkadot",
};

export default function StatisticDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { formatCurrency, formatDate, currencySymbol } = useSettings();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<string>("");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isFetchingChart, setIsFetchingChart] = useState(false);
  const [chartError, setChartError] = useState("");
  const [livePrice, setLivePrice] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchInvestments(user.id);
      } else {
        router.push("/login");
      }
    }
  }, [user, authLoading, router]);

  const fetchInvestments = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("investments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setInvestments(data);
      if (data.length > 0) {
        setSelectedInvestmentId(data[0].id);
      }
    }
    setLoading(false);
  };

  const selectedInvestment = useMemo(() => {
    return investments.find(inv => inv.id === selectedInvestmentId) || null;
  }, [investments, selectedInvestmentId]);

  useEffect(() => {
    if (selectedInvestment) {
      fetchChartData(selectedInvestment);
      fetchLivePrice(selectedInvestment);

      const intervalId = setInterval(() => {
        fetchLivePrice(selectedInvestment);
      }, 15000);

      return () => clearInterval(intervalId);
    }
  }, [selectedInvestment]);

  const fetchLivePrice = async (inv: Investment) => {
    try {
      const symbol = inv.symbol.toUpperCase();
      const coinId = symbolToId[symbol];
      if (coinId) {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`).catch(() => null);
        if (!res || !res.ok) return;
        const data = await res.json();
        if (data[coinId]?.usd) setLivePrice(data[coinId].usd);
      } else {
        const res = await fetch(`/api/stock-quote?symbol=${symbol}`).catch(() => null);
        if (!res || !res.ok) return;
        const data = await res.json();
        if (data && data.c) setLivePrice(data.c);
      }
    } catch (e) {
      console.error("Failed to fetch live price", e);
    }
  };

  const fetchChartData = async (inv: Investment) => {
    setIsFetchingChart(true);
    setChartError("");
    setChartData([]);

    try {
      const symbol = inv.symbol.toUpperCase();
      const coinId = symbolToId[symbol];

      const toUnix = Math.floor(Date.now() / 1000);
      let fromUnix = Math.floor(new Date(inv.date).getTime() / 1000);
      
      if (isNaN(fromUnix)) {
        fromUnix = toUnix - (30 * 24 * 60 * 60);
      }

      // Ensure we have at least 24 hours of data
      if (toUnix - fromUnix < 3600) {
        fromUnix = toUnix - 86400;
      }

      const formattedData: ChartDataPoint[] = [];
      const rangeDays = (toUnix - fromUnix) / 86400;

      if (coinId) {
        // Crypto: CoinGecko market_chart/range
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${fromUnix}&to=${toUnix}`).catch(() => null);
        if (!res || !res.ok) throw new Error("CoinGecko API limit reached or data unavailable.");
        const data = await res.json();
        
        if (data && data.prices) {
          data.prices.forEach(([ts_ms, price]: [number, number]) => {
            const d = new Date(ts_ms);
            formattedData.push({
              timestamp: ts_ms,
              dateStr: rangeDays <= 7 
                ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              price: price
            });
          });
        }
      } else {
        // Stocks: Yahoo Finance via our API proxy
        const res = await fetch(`/api/stock-chart?symbol=${symbol}&from=${fromUnix}&to=${toUnix}`).catch(() => null);
        
        if (!res || !res.ok) {
          throw new Error("Unable to fetch stock chart data.");
        }

        const data = await res.json();

        if (data.points && data.points.length > 0) {
          data.points.forEach((point: { t: number; c: number }) => {
            const d = new Date(point.t);
            formattedData.push({
              timestamp: point.t,
              dateStr: rangeDays <= 7
                ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                : rangeDays <= 90
                  ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }),
              price: point.c
            });
          });
        } else {
          setChartError("No historical data found for this period.");
        }
      }

      setChartData(formattedData);
    } catch (err: any) {
      console.error(err);
      setChartError(err.message || "Unable to load historical chart data.");
    } finally {
      setIsFetchingChart(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <div className="w-8 h-8 rounded-full border-2 border-brand-light border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Calculate stats based on live price
  const currentPrice = livePrice !== null ? livePrice : (chartData.length > 0 ? chartData[chartData.length - 1].price : (selectedInvestment?.purchase_price || 0));
  const purchasePrice = selectedInvestment?.purchase_price || 0;
  const isProfit = currentPrice >= purchasePrice;
  const profitAmt = currentPrice - purchasePrice;
  const profitPct = purchasePrice > 0 ? (profitAmt / purchasePrice) * 100 : 0;
  
  const maxPrice = chartData.length > 0 ? Math.max(...chartData.map(d => d.price)) : currentPrice;
  const minPrice = chartData.length > 0 ? Math.min(...chartData.map(d => d.price)) : purchasePrice;

  // Custom Tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const price = payload[0].value;
      const pctFromBuy = purchasePrice > 0 ? ((price - purchasePrice) / purchasePrice) * 100 : 0;
      return (
        <div className="bg-[#0c0c0e] border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-[#888888] text-[12px] mb-1">{label}</p>
          <p className="text-white font-bold text-[16px]">{formatCurrency(price)}</p>
          <p className={`text-[12px] font-medium mt-1 ${pctFromBuy >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {pctFromBuy >= 0 ? '+' : ''}{pctFromBuy.toFixed(2)}% from buy price
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Asset Statistics</h1>
           <p className="text-[#888888] text-[15px]">Analyze the performance of your investments over time.</p>
        </div>
      </div>

      {investments.length === 0 ? (
        <div className="bg-[#141414] rounded-2xl border border-white/5 p-12 text-center flex flex-col items-center">
           <Activity className="w-12 h-12 text-[#555] mb-4" />
           <h3 className="text-xl font-medium text-white mb-2">No Investments Yet</h3>
           <p className="text-[#888888] max-w-md mx-auto mb-6">You haven't added any assets to your portfolio. Add an asset in the Investment tab to see its performance graph here.</p>
           <button onClick={() => router.push("/dashboard/investment")} className="px-6 py-2.5 rounded-full bg-brand-gradient shadow-[0_4px_14px_0_rgba(252,96,118,0.3)] text-white font-semibold">
             Go to Investments
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-8 bg-[#141414] rounded-2xl border border-white/5 p-6 flex flex-col relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="relative">
                <select 
                  value={selectedInvestmentId} 
                  onChange={(e) => setSelectedInvestmentId(e.target.value)}
                  className="bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-white text-[15px] focus:outline-none focus:border-brand-dark transition-colors appearance-none cursor-pointer w-full sm:w-[280px]"
                >
                  {investments.map(inv => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name || inv.symbol} ({inv.symbol})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888] pointer-events-none" />
              </div>

              {selectedInvestment && (
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium ${isProfit ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
                    {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {isProfit ? '+' : ''}{profitPct.toFixed(2)}% All Time
                  </div>
                </div>
              )}
            </div>

            {isFetchingChart ? (
              <div className="flex-1 min-h-[400px] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-brand-light border-t-transparent animate-spin"></div>
              </div>
            ) : chartError ? (
              <div className="flex-1 min-h-[400px] flex items-center justify-center flex-col text-[#888888]">
                <AlertCircle className="w-8 h-8 mb-3 opacity-50 text-red-400" />
                <p className="text-white/70">{chartError}</p>
              </div>
            ) : chartData.length > 0 ? (
              <div className="flex-1 w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isProfit ? "#4ade80" : "#f87171"} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={isProfit ? "#4ade80" : "#f87171"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                    <XAxis 
                      dataKey="dateStr" 
                      stroke="#555" 
                      tick={{ fill: '#888', fontSize: 11 }} 
                      tickLine={false} 
                      axisLine={false}
                      minTickGap={40}
                    />
                    <YAxis 
                      stroke="#555" 
                      tick={{ fill: '#888', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${currencySymbol}${value < 1000 ? value : (value / 1000).toFixed(1) + 'k'}`}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Reference Line for Purchase Price */}
                    <ReferenceLine 
                      y={purchasePrice} 
                      stroke="#888888" 
                      strokeDasharray="4 4" 
                      strokeOpacity={0.5}
                      label={{ value: `Buy: ${formatCurrency(purchasePrice)}`, position: 'insideTopLeft', fill: '#888888', fontSize: 11 }}
                    />

                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={isProfit ? "#4ade80" : "#f87171"} 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                      animationDuration={800}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 min-h-[400px] flex items-center justify-center flex-col text-[#888888]">
                <Activity className="w-8 h-8 mb-3 opacity-50" />
                <p>Select an investment to view its chart.</p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          {selectedInvestment && (
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Investment Details Card */}
              <div className="bg-[#141414] rounded-2xl border border-white/5 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <DollarSign className="w-24 h-24" />
                </div>
                
                <h3 className="text-[14px] text-[#888888] font-medium uppercase tracking-wider mb-6">Investment Details</h3>
                
                <div className="space-y-5">
                  <div>
                    <p className="text-[#888888] text-[13px] mb-1">Asset Name</p>
                    <p className="text-white font-semibold text-[16px]">{selectedInvestment.name || selectedInvestment.symbol}</p>
                  </div>
                  <div>
                    <p className="text-[#888888] text-[13px] mb-1">Current Value</p>
                    <p className="text-white font-semibold text-[20px]">{formatCurrency((selectedInvestment.amount || 0) * currentPrice)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[#888888] text-[13px] mb-1">Buy Price</p>
                      <p className="text-white font-medium">{formatCurrency(purchasePrice)}</p>
                    </div>
                    <div>
                      <p className="text-[#888888] text-[13px] mb-1">Current Price</p>
                      <p className={`font-medium ${isProfit ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(currentPrice)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[#888888] text-[13px] mb-1">Quantity</p>
                      <p className="text-white font-medium">{(selectedInvestment.amount || 0).toFixed(4)} units</p>
                    </div>
                    <div>
                      <p className="text-[#888888] text-[13px] mb-1">Total Cost</p>
                      <p className="text-white font-medium">{formatCurrency((selectedInvestment.amount || 0) * purchasePrice)}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[#888888] text-[13px] mb-1">Profit / Loss</p>
                    <p className={`font-bold text-[18px] ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                      {isProfit ? '+' : ''}{formatCurrency((selectedInvestment.amount || 0) * profitAmt)}
                      <span className="text-[13px] ml-2 opacity-80">({isProfit ? '+' : ''}{profitPct.toFixed(2)}%)</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Historical Highs & Lows */}
              <div className="bg-[#141414] rounded-2xl border border-white/5 p-6">
                <h3 className="text-[14px] text-[#888888] font-medium uppercase tracking-wider mb-6">Period Highs & Lows</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center text-green-400">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <span className="text-[14px] text-[#888888]">Period High</span>
                    </div>
                    <span className="text-white font-semibold">{formatCurrency(maxPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-400/10 flex items-center justify-center text-red-400">
                        <TrendingDown className="w-4 h-4" />
                      </div>
                      <span className="text-[14px] text-[#888888]">Period Low</span>
                    </div>
                    <span className="text-white font-semibold">{formatCurrency(minPrice)}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-[12px] text-[#555]">
                    <Calendar className="w-3 h-3" />
                    <span>Tracking since {(!selectedInvestment.date || isNaN(new Date(selectedInvestment.date).getTime())) ? 'Genesis' : formatDate(selectedInvestment.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
