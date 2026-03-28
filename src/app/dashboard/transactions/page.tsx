"use client";

import { useState } from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { useToast } from "@/lib/contexts/ToastContext";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  ShoppingCart,
  Coffee,
  Zap,
  Briefcase,
  Heart,
  Car,
  Film,
  Gift,
  Home,
  Wifi,
} from "lucide-react";

type FilterType = "all" | "income" | "expense";

const CATEGORY_ICONS: Record<string, { icon: typeof ShoppingCart; color: string }> = {
  Shopping: { icon: ShoppingCart, color: "bg-blue-500/15 text-blue-400" },
  "Food & Dining": { icon: Coffee, color: "bg-amber-500/15 text-amber-400" },
  Utilities: { icon: Zap, color: "bg-cyan-500/15 text-cyan-400" },
  Salary: { icon: Briefcase, color: "bg-green-500/15 text-green-400" },
  Health: { icon: Heart, color: "bg-red-500/15 text-red-400" },
  Transport: { icon: Car, color: "bg-emerald-500/15 text-emerald-400" },
  Entertainment: { icon: Film, color: "bg-purple-500/15 text-purple-400" },
  Gift: { icon: Gift, color: "bg-pink-500/15 text-pink-400" },
  Rent: { icon: Home, color: "bg-orange-500/15 text-orange-400" },
  Freelance: { icon: Wifi, color: "bg-violet-500/15 text-violet-400" },
};

const TRANSACTIONS = [
  { id: 1, name: "Amazon Purchase", category: "Shopping", date: "2026-03-28", amount: -129.99, status: "completed" },
  { id: 2, name: "Monthly Salary", category: "Salary", date: "2026-03-25", amount: 5400.00, status: "completed" },
  { id: 3, name: "Starbucks Coffee", category: "Food & Dining", date: "2026-03-24", amount: -6.50, status: "completed" },
  { id: 4, name: "Electricity Bill", category: "Utilities", date: "2026-03-23", amount: -134.20, status: "completed" },
  { id: 5, name: "Freelance Payment", category: "Freelance", date: "2026-03-22", amount: 1200.00, status: "completed" },
  { id: 6, name: "Gym Membership", category: "Health", date: "2026-03-21", amount: -49.99, status: "pending" },
  { id: 7, name: "Uber Ride", category: "Transport", date: "2026-03-20", amount: -18.75, status: "completed" },
  { id: 8, name: "Netflix", category: "Entertainment", date: "2026-03-19", amount: -15.99, status: "completed" },
  { id: 9, name: "Birthday Gift", category: "Gift", date: "2026-03-18", amount: -85.00, status: "completed" },
  { id: 10, name: "Apartment Rent", category: "Rent", date: "2026-03-15", amount: -1800.00, status: "completed" },
  { id: 11, name: "Dividend Income", category: "Salary", date: "2026-03-14", amount: 340.00, status: "completed" },
  { id: 12, name: "Grocery Store", category: "Food & Dining", date: "2026-03-13", amount: -67.30, status: "completed" },
];

export default function TransactionsPage() {
  const { formatCurrency, formatDate } = useSettings();
  const { toast } = useToast();
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const filtered = TRANSACTIONS.filter((tx) => {
    if (filter === "income" && tx.amount < 0) return false;
    if (filter === "expense" && tx.amount > 0) return false;
    if (searchQuery && !tx.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalIncome = TRANSACTIONS.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = TRANSACTIONS.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const netBalance = totalIncome - totalExpense;

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleExportCSV = () => {
    const header = ["Name", "Category", "Date", "Amount", "Status"];
    const rows = filtered.map(tx => [
      tx.name,
      tx.category,
      tx.date,
      tx.amount.toFixed(2),
      tx.status,
    ]);
    const csvContent = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexora-transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`Exported ${filtered.length} transactions as CSV`);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Transactions</h1>
          <p className="text-[#888888] text-[14px] mt-1">Track all your financial activity</p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all text-[14px]">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#141414] rounded-2xl p-5 border border-white/5 relative overflow-hidden group cursor-pointer" onClick={() => { setFilter("income"); setCurrentPage(1); }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-3xl -mr-8 -mt-8 group-hover:bg-green-500/20 transition-all duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-[13px] text-[#888]">Total Income</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{formatCurrency(totalIncome)}</h3>
          </div>
        </div>

        <div className="bg-[#141414] rounded-2xl p-5 border border-white/5 relative overflow-hidden group cursor-pointer" onClick={() => { setFilter("expense"); setCurrentPage(1); }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-3xl -mr-8 -mt-8 group-hover:bg-red-500/20 transition-all duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-[13px] text-[#888]">Total Expense</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{formatCurrency(totalExpense)}</h3>
          </div>
        </div>

        <div className="bg-[#141414] rounded-2xl p-5 border border-white/5 relative overflow-hidden group cursor-pointer" onClick={() => { setFilter("all"); setCurrentPage(1); }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl -mr-8 -mt-8 group-hover:bg-blue-500/20 transition-all duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[13px] text-[#888]">Net Balance</span>
            </div>
            <h3 className={`text-2xl font-bold ${netBalance >= 0 ? "text-green-400" : "text-red-400"}`}>{netBalance >= 0 ? "+" : ""}{formatCurrency(Math.abs(netBalance))}</h3>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#141414] rounded-2xl p-6 border border-white/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex p-1 bg-[#0c0c0e] rounded-xl border border-white/5">
            {(["all", "income", "expense"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setCurrentPage(1); }}
                className={`px-5 py-2 rounded-lg text-[13px] font-medium capitalize transition-all ${
                  filter === f
                    ? "bg-brand-gradient text-white shadow-lg"
                    : "text-[#555] hover:text-[#888] hover:bg-white/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c0c0e] border border-white/5 text-[13px] text-white placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors"
            />
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.6fr] text-[12px] text-[#555] uppercase tracking-wider font-medium mb-3 px-4">
          <span>Transaction</span>
          <span>Category</span>
          <span>Date</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Status</span>
        </div>

        {/* Table Rows */}
        <div className="space-y-1">
          {paged.map((tx) => {
            const catInfo = CATEGORY_ICONS[tx.category] || { icon: ShoppingCart, color: "bg-white/10 text-white" };
            const CatIcon = catInfo.icon;
            return (
              <div key={tx.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_0.6fr] items-center p-3 px-4 rounded-xl hover:bg-white/[0.03] transition-colors group cursor-pointer" onClick={() => toast(`${tx.name} — ${tx.amount > 0 ? "+" : ""}${formatCurrency(Math.abs(tx.amount))} on ${formatDate(tx.date)}`, "info")}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${catInfo.color}`}>
                    <CatIcon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[14px] font-medium text-white group-hover:text-brand-light transition-colors">{tx.name}</span>
                </div>
                <span className="text-[13px] text-[#888]">{tx.category}</span>
                <span className="text-[13px] text-[#888]">{formatDate(tx.date)}</span>
                <span className={`text-right text-[14px] font-semibold ${tx.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                  {tx.amount > 0 ? "+" : ""}{formatCurrency(Math.abs(tx.amount))}
                </span>
                <div className="flex justify-end">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                    tx.status === "completed"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {tx.status === "completed" ? "Done" : "Pending"}
                  </span>
                </div>
              </div>
            );
          })}
          {paged.length === 0 && (
            <div className="text-center py-12 text-[#555] text-[14px]">No transactions found.</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
            <span className="text-[13px] text-[#888]">Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-[13px] border border-white/10 text-[#888] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-all ${
                    currentPage === i + 1
                      ? "bg-brand-gradient text-white shadow-lg"
                      : "text-[#555] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-[13px] border border-white/10 text-[#888] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
