"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Search, ChevronDown, ArrowUpRight, TrendingUp, TrendingDown, RefreshCcw, Briefcase, DollarSign, Activity, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useSettings } from "@/lib/contexts/SettingsContext";


interface Investment {
  id: string;
  name: string;
  symbol: string;
  purchase_price: number;
  amount: number;
  category: "Stocks" | "Crypto";
  date: string;
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

export default function InvestmentDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { currency, formatCurrency, formatDate, convertAmount, exchangeRate, currencySymbol } = useSettings();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [assetName, setAssetName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [category, setCategory] = useState<"Stocks" | "Crypto">("Stocks");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    (window as any).supabase = supabase;
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

    if (error) {
      console.error("Error fetching investments:", error);
    } else {
      setInvestments(data || []);
    }
    setLoading(false);
  };

  // Real-time API Poller for market prices
  useEffect(() => {
    if (investments.length > 0) {
      fetchMarketPrices(investments);
      
      const intervalId = setInterval(() => {
        fetchMarketPrices(investments);
      }, 15000);

      return () => clearInterval(intervalId);
    }
  }, [investments]);

  // Auto-sync historical prices once on load
  const hasSynced = useState(false);
  useEffect(() => {
    if (investments.length > 0 && !hasSynced[0] && !isSyncing) {
      hasSynced[1](true);
      syncHistoricalPrices();
    }
  }, [investments]);

  const fetchMarketPrices = async (portfolio: Investment[]) => {
    const symbols = Array.from(new Set(portfolio.map(inv => inv.symbol.toUpperCase())));
    const newPrices: Record<string, number> = {};

    for (const sym of symbols) {
      const coinId = symbolToId[sym];
      if (coinId) {
        try {
          const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`).catch(() => null);
          if (!res || !res.ok) continue;
          const data = await res.json().catch(() => null);
          if (data?.[coinId]?.usd) {
            newPrices[sym] = data[coinId].usd;
          }
        } catch {
          // Silently skip
        }
      } else {
        try {
          const res = await fetch(`/api/stock-quote?symbol=${sym}`).catch(() => null);
          if (!res || !res.ok) continue;
          const data = await res.json().catch(() => null);
          if (data?.c) {
            newPrices[sym] = data.c;
          }
        } catch {
          // Silently skip
        }
      }
    }

    setMarketPrices(prev => ({ ...prev, ...newPrices }));
  };

  // Sync historical purchase prices from Yahoo Finance / CoinGecko
  const syncHistoricalPrices = async () => {
    if (!user) return;
    setIsSyncing(true);
    let updated = false;

    for (const inv of investments) {
      const isToday = inv.date === new Date().toISOString().split('T')[0];
      if (isToday) continue; // Skip if purchased today - current price is correct

      const upperSym = inv.symbol.toUpperCase();
      const coinId = symbolToId[upperSym];

      try {
        let historicalPrice: number | null = null;

        if (coinId) {
          // Crypto: CoinGecko history
          const dateObj = new Date(inv.date);
          const dd = String(dateObj.getDate()).padStart(2, '0');
          const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
          const yyyy = dateObj.getFullYear();
          const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${dd}-${mm}-${yyyy}`).catch(() => null);
          if (res && res.ok) {
            const data = await res.json();
            if (data?.market_data?.current_price?.usd) {
              historicalPrice = data.market_data.current_price.usd;
            }
          }
        } else {
          // Stock: Yahoo Finance history via proxy
          const res = await fetch(`/api/stock-history?symbol=${upperSym}&date=${inv.date}`).catch(() => null);
          if (res && res.ok) {
            const data = await res.json();
            if (data?.price) {
              historicalPrice = Math.round(data.price * 100) / 100;
            }
          }
        }

        if (historicalPrice && Math.abs(historicalPrice - inv.purchase_price) > 0.01) {
          // Recalculate quantity: total_cost stays the same, quantity adjusts
          const totalCost = inv.amount * inv.purchase_price;
          const newQuantity = totalCost / historicalPrice;

          const { error } = await supabase
            .from('investments')
            .update({ purchase_price: historicalPrice, amount: newQuantity })
            .eq('id', inv.id)
            .eq('user_id', user.id);

          if (!error) updated = true;
        }
      } catch (e) {
        console.error(`Failed to sync price for ${inv.symbol}:`, e);
      }
    }

    if (updated && user) {
      await fetchInvestments(user.id);
    }
    setIsSyncing(false);
  };

  const fetchPriceForForm = async (sym: string, selectedDate: string) => {
    if (!sym || sym.length < 2) return;
    setIsFetchingPrice(true);
    setPriceError("");
    setUnitPrice("");

    const upperSym = sym.toUpperCase();
    const coinId = symbolToId[upperSym];
    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    try {
      if (coinId) {
        if (isToday) {
          // Crypto: current price from CoinGecko
          const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
          if (!res.ok) throw new Error("API Limit reached");
          const data = await res.json();
          if (data[coinId]?.usd) {
            const currentPriceUSD = data[coinId].usd;
            const displayPrice = currency === "INR" ? (currentPriceUSD * exchangeRate).toFixed(2) : currentPriceUSD.toString();
            setUnitPrice(displayPrice);
            setCategory("Crypto");
            recalculatePrices(quantity, totalAmount, displayPrice);
          } else {
            setPriceError("Price not found.");
          }
        } else {
          // Crypto: historical price from CoinGecko
          const dateObj = new Date(selectedDate);
          const dd = String(dateObj.getDate()).padStart(2, '0');
          const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
          const yyyy = dateObj.getFullYear();
          const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${dd}-${mm}-${yyyy}`);
          if (!res.ok) throw new Error("API Limit reached");
          const data = await res.json();
          if (data?.market_data?.current_price?.usd) {
            const histPriceUSD = data.market_data.current_price.usd;
            const displayPrice = currency === "INR" ? (histPriceUSD * exchangeRate).toFixed(2) : histPriceUSD.toString();
            setUnitPrice(displayPrice);
            setCategory("Crypto");
            recalculatePrices(quantity, totalAmount, displayPrice);
          } else {
            setPriceError("Historical price not available.");
          }
        }
      } else {
        if (isToday) {
          // Stock: current price via proxy
          const res = await fetch(`/api/stock-quote?symbol=${upperSym}`);
          if (!res.ok) throw new Error("API Limit reached");
          const data = await res.json();
          if (data && data.c && data.c > 0) {
            const currentPriceUSD = data.c;
            const displayPrice = currency === "INR" ? (currentPriceUSD * exchangeRate).toFixed(2) : currentPriceUSD.toString();
            setUnitPrice(displayPrice);
            setCategory("Stocks");
            recalculatePrices(quantity, totalAmount, displayPrice);
          } else {
            setPriceError("Invalid stock symbol");
          }
        } else {
          // Stock: historical price via Yahoo Finance proxy
          const res = await fetch(`/api/stock-history?symbol=${upperSym}&date=${selectedDate}`);
          if (!res.ok) throw new Error("Historical data unavailable");
          const data = await res.json();
          if (data && data.price) {
            const histPriceUSD = Number(data.price);
            const displayPrice = currency === "INR" ? (histPriceUSD * exchangeRate).toFixed(2) : histPriceUSD.toString();
            setUnitPrice(displayPrice);
            setCategory("Stocks");
            recalculatePrices(quantity, totalAmount, displayPrice);
          } else {
            setPriceError("No price data for this date.");
          }
        }
      }
    } catch (err: any) {
      setPriceError("Unable to fetch price.");
    } finally {
      setIsFetchingPrice(false);
    }
  };

  const calculateTotalCost = () => investments.reduce((sum, item) => sum + ((item.amount || 0) * (item.purchase_price || 0)), 0);
  
  const calculateCurrentValue = () => investments.reduce((sum, item) => {
    const currentPrice = marketPrices[item.symbol.toUpperCase()] || item.purchase_price || 0;
    return sum + ((item.amount || 0) * currentPrice);
  }, 0);

  const calculateTotalProfit = () => {
    const cost = calculateTotalCost();
    const value = calculateCurrentValue();
    return value - cost;
  };

  const totalCost = calculateTotalCost();
  const currentValue = calculateCurrentValue();
  const totalProfit = calculateTotalProfit();
  const profitMargin = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value.toUpperCase());
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    // Re-fetch price for the new date if symbol is already entered
    if (symbol && symbol.length >= 2) {
      fetchPriceForForm(symbol, e.target.value);
    }
  };

  // Auto-fetch price when symbol changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (symbol && symbol.length >= 2) {
        fetchPriceForForm(symbol, date);
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(timer);
  }, [symbol]);

  const recalculatePrices = (q: string, t: string, p: string) => {
    if (p && !isNaN(Number(p))) {
      // if quantity changed recently, update amount
      if (q && !isNaN(Number(q))) {
        setTotalAmount((Number(q) * Number(p)).toString());
      } else if (t && !isNaN(Number(t))) {
        setQuantity((Number(t) / Number(p)).toString());
      }
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuantity(val);
    if (val && unitPrice) {
      const amt = Number(val) * Number(unitPrice);
      setTotalAmount(amt.toString());
    } else {
      setTotalAmount("");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTotalAmount(val);
    if (val && unitPrice && Number(unitPrice) > 0) {
      const q = Number(val) / Number(unitPrice);
      setQuantity(q.toString());
    } else {
      setQuantity("");
    }
  };

  const handleAddInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName || !symbol || !unitPrice || !totalAmount || !quantity) return;

    setIsAdding(true);
    if (!user) return;
    const { data, error } = await supabase.from("investments").insert([
      {
        user_id: user.id,
        name: assetName,
        symbol: symbol.toUpperCase(),
        purchase_price: currency === "INR" ? parseFloat(unitPrice) / exchangeRate : parseFloat(unitPrice),
        amount: parseFloat(quantity),
        category,
        date,
      }
    ]);

    setIsAdding(false);
    if (!error) {
      setIsAddModalOpen(false);
      fetchInvestments(user.id);
      // Reset form
      setAssetName("");
      setSymbol("");
      setUnitPrice("");
      setQuantity("");
      setTotalAmount("");
    } else {
      alert("Error adding investment.");
    }
  };

  const handleDeleteInvestment = async (id: string) => {
    if (!user) return;
    
    // Optimistic UI updates
    setInvestments(prev => prev.filter(inv => inv.id !== id));
    
    if (!user) return;
    const { error } = await supabase
      .from("investments")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting investment:", error);
      alert("Failed to delete investment.");
      fetchInvestments(user.id); // Reset table
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <div className="w-8 h-8 rounded-full border-2 border-brand-light border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;


  const filteredInvestments = investments.filter(inv => 
    (inv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) || 
    (inv.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto pb-10">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Investment Dashboard</h1>
          <p className="text-[#888888] text-[15px]">Monitor your assets with real-time market data and profit tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={syncHistoricalPrices}
            disabled={isSyncing}
            className="h-11 px-4 rounded-full border border-white/10 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-[#888888] hover:text-white bg-[#141414] text-[13px] font-medium disabled:opacity-50"
            title="Sync purchase prices to historical values"
          >
            {isSyncing ? (
              <RefreshCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Activity className="w-4 h-4" />
            )}
            {isSyncing ? "Syncing..." : "Sync Prices"}
          </button>
          <button 
            onClick={() => user && fetchInvestments(user.id)}
            className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-[#888888] hover:text-white bg-[#141414] group"
          >
            <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-gradient shadow-[0_4px_14px_0_rgba(252,96,118,0.3)] text-white font-semibold hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Asset
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Value */}
        <div className="bg-[#141414] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-dark/20 flex items-center justify-center text-brand-light">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[#888888] font-medium">Current Value</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">
            {formatCurrency(currentValue)}
          </h2>
          <div className={`flex items-center gap-2 text-[14px] font-medium ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <ArrowUpRight className={`w-4 h-4 ${totalProfit < 0 ? 'rotate-90' : ''}`} />
            {totalProfit >= 0 ? '+' : '-'}{formatCurrency(Math.abs(totalProfit))} Profit
          </div>
        </div>

        {/* Total Cost */}
        <div className="bg-[#141414] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[#888888] font-medium">Total Cost</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">
            {formatCurrency(totalCost)}
          </h2>
          <div className="flex items-center gap-2 text-[14px] text-[#888888]">
            <Activity className="w-4 h-4" />
            Across {investments.length} Assets
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-[#141414] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[#888888] font-medium">Profit Margin</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">
            {profitMargin.toFixed(2)}%
          </h2>
          <div className="flex items-center gap-2 text-[14px] text-green-400">
            Market performance live
          </div>
        </div>
      </div>

      {/* Portfolio Table Area */}
      <div className="bg-[#141414] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-[18px] font-semibold text-white">Live Portfolio</h3>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
             <input 
               type="text" 
               placeholder="Search assets..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-[#0c0c0e] border border-white/10 text-white text-[14px] rounded-lg pl-10 pr-4 py-2 w-full md:w-[250px] focus:outline-none focus:border-brand-dark transition-colors"
             />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#666] text-[13px] uppercase tracking-wider font-medium border-b border-white/5 bg-[#1a1a1a]">
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Total Cost</th>
                <th className="px-6 py-4">Current Value</th>
                <th className="px-6 py-4">Profit / Loss</th>
                <th className="px-6 py-4 w-[60px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInvestments.map((inv) => {
                const safeSymbol = inv.symbol || "";
                const currentPrice = marketPrices[safeSymbol.toUpperCase()] || inv.purchase_price || 0;
                const value = (inv.amount || 0) * currentPrice;
                const cost = (inv.amount || 0) * (inv.purchase_price || 0);
                const profit = value - cost;
                const profitPct = cost > 0 ? (profit / cost) * 100 : 0;
                const isProfit = profit >= 0;
                const safeDate = formatDate(inv.date);

                return (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[15px] font-medium text-white">{inv.name || inv.symbol}</span>
                        <span className="text-[11px] text-[#555] uppercase tracking-wider">{inv.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center justify-center px-2 py-1 rounded bg-[#2a2a2a] border border-[#333] text-[12px] font-bold text-white">
                        {inv.symbol}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[14px] text-white">{(inv.amount || 0).toFixed(6)} units</span>
                        <span className="text-[12px] text-[#555]">{safeDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-medium text-white">{formatCurrency(cost)}</span>
                        <span className="text-[12px] text-[#555]">at {formatCurrency(inv.purchase_price)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-medium text-white">{formatCurrency(value)}</span>
                        <span className="text-[12px] text-[#555]">Price: {formatCurrency(currentPrice)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 text-[14px] font-medium ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                        {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {isProfit ? '+' : '-'}{formatCurrency(Math.abs(profit))}
                        <span className="text-[12px] opacity-70 ml-1">({profitPct.toFixed(1)}%)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteInvestment(inv.id)}
                        className="w-8 h-8 rounded-lg outline-none bg-transparent hover:bg-white/5 flex items-center justify-center text-[#555] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredInvestments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#555]">
                    No investments found. Add an asset to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Add New Asset</h2>
                  <p className="text-[14px] text-[#888888]">Connect your investment to real-time market data.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#888888] hover:text-white hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddInvestment} className="space-y-5 text-left">
                {/* Asset Name */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#666] mb-2">Asset Name</label>
                  <input type="text" placeholder="e.g. Nvidia" required value={assetName} onChange={(e) => setAssetName(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] focus:outline-none focus:border-brand-dark transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Symbol */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#666] mb-2">Symbol</label>
                    <div className="relative">
                      <input type="text" placeholder="NVDA" required value={symbol} onChange={handleSymbolChange}
                        className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-[15px] focus:outline-none focus:border-brand-dark transition-colors uppercase"
                      />
                      {isFetchingPrice && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <RefreshCcw className="w-4 h-4 text-[#888888] animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Unit Price */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#666] mb-2">Unit Price ({currencySymbol})</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="any"
                        required 
                        value={unitPrice} 
                        onChange={(e) => {
                          setUnitPrice(e.target.value);
                          recalculatePrices(quantity, "", e.target.value);
                        }}
                        placeholder={`0.00 ${currency}`}
                        className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] focus:outline-none focus:border-brand-dark transition-colors"
                      />
                      {isFetchingPrice && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <RefreshCcw className="w-4 h-4 text-[#888888] animate-spin" />
                        </div>
                      )}
                    </div>
                    {priceError && <p className="text-red-400 text-[11px] mt-1">{priceError}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Quantity */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#666] mb-2">Quantity (Units)</label>
                    <input type="number" step="any" placeholder="1" required value={quantity} onChange={handleQuantityChange}
                      className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] focus:outline-none focus:border-brand-dark transition-colors"
                    />
                  </div>
                  
                  {/* Total Amount */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#666] mb-2">Total Amount ({currencySymbol})</label>
                    <input type="number" step="any" placeholder={`0.00 ${currency}`} required value={totalAmount} onChange={handleAmountChange}
                      className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] focus:outline-none focus:border-brand-dark transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#666] mb-2">Category</label>
                    <div className="relative">
                      <select value={category} onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] focus:outline-none focus:border-brand-dark transition-colors appearance-none cursor-pointer"
                      >
                        <option>Stocks</option>
                        <option>Crypto</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888] pointer-events-none" />
                    </div>
                  </div>
                  
                  {/* Date Purchased */}
                  <div>
                     <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#666] mb-2">Date Purchased</label>
                     <input type="date" required value={date} onChange={handleDateChange}
                       className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] focus:outline-none focus:border-brand-dark transition-colors"
                       style={{colorScheme: 'dark'}}
                     />
                  </div>
                </div>

                <button type="submit" disabled={isAdding}
                  className="w-full py-3.5 rounded-xl mt-4 bg-brand-gradient shadow-[0_4px_14px_0_rgba(252,96,118,0.3)] text-white font-semibold text-[15px] hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isAdding ? "Adding..." : <><TrendingUp className="w-5 h-5"/> Start Tracking Asset</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
