"use client";

import { useState } from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { useToast } from "@/lib/contexts/ToastContext";
import Modal from "@/components/ui/Modal";
import {
  ShoppingCart,
  Film,
  Zap,
  Car,
  Heart,
  Utensils,
  Shirt,
  BookOpen,
  Plus,
  ArrowUpRight,
  AlertTriangle,
  ChevronDown,
  Target,
  PieChart,
  Pencil,
} from "lucide-react";

const DEFAULT_CATEGORIES = [
  { name: "Groceries", icon: ShoppingCart, budget: 600, spent: 420, color: "#10b981", gradientFrom: "from-emerald-500", gradientTo: "to-green-600" },
  { name: "Shopping", icon: Shirt, budget: 400, spent: 385, color: "#3b82f6", gradientFrom: "from-blue-500", gradientTo: "to-indigo-600" },
  { name: "Entertainment", icon: Film, budget: 200, spent: 230, color: "#8b5cf6", gradientFrom: "from-violet-500", gradientTo: "to-purple-600" },
  { name: "Utilities", icon: Zap, budget: 250, spent: 180, color: "#06b6d4", gradientFrom: "from-cyan-500", gradientTo: "to-blue-600" },
  { name: "Transport", icon: Car, budget: 300, spent: 210, color: "#f59e0b", gradientFrom: "from-amber-500", gradientTo: "to-orange-600" },
  { name: "Health", icon: Heart, budget: 200, spent: 95, color: "#ef4444", gradientFrom: "from-red-500", gradientTo: "to-pink-600" },
  { name: "Food & Dining", icon: Utensils, budget: 350, spent: 290, color: "#f97316", gradientFrom: "from-orange-500", gradientTo: "to-amber-600" },
  { name: "Education", icon: BookOpen, budget: 150, spent: 75, color: "#a855f7", gradientFrom: "from-purple-500", gradientTo: "to-fuchsia-600" },
];

export default function BudgetingPage() {
  const { formatCurrency } = useSettings();
  const { toast } = useToast();
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [monthDdOpen, setMonthDdOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("March 2026");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newBudget, setNewBudget] = useState({ name: "", amount: "" });
  const [editAmount, setEditAmount] = useState("");

  const totalBudget = categories.reduce((s, c) => s + c.budget, 0);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercentage = Math.round((totalSpent / totalBudget) * 100);
  const overBudgetCount = categories.filter((c) => c.spent > c.budget).length;

  const handleAddBudget = () => {
    if (!newBudget.name || !newBudget.amount) {
      toast("Please fill all fields", "error");
      return;
    }
    setCategories(prev => [...prev, {
      name: newBudget.name,
      icon: ShoppingCart,
      budget: parseFloat(newBudget.amount),
      spent: 0,
      color: "#6366f1",
      gradientFrom: "from-indigo-500",
      gradientTo: "to-violet-600",
    }]);
    toast(`Budget "${newBudget.name}" added with ${formatCurrency(parseFloat(newBudget.amount))} limit`);
    setAddModalOpen(false);
    setNewBudget({ name: "", amount: "" });
  };

  const handleEditBudget = () => {
    if (editIndex === null || !editAmount) return;
    setCategories(prev => prev.map((c, i) => i === editIndex ? { ...c, budget: parseFloat(editAmount) } : c));
    toast(`${categories[editIndex].name} budget updated to ${formatCurrency(parseFloat(editAmount))}`);
    setEditModalOpen(false);
    setEditIndex(null);
    setEditAmount("");
  };

  const openEdit = (idx: number) => {
    setEditIndex(idx);
    setEditAmount(categories[idx].budget.toString());
    setEditModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Budgeting</h1>
          <p className="text-[#888888] text-[14px] mt-1">Set limits and track your spending by category</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setMonthDdOpen(!monthDdOpen)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 bg-[#141414] text-[13px] text-[#888] hover:text-white transition-colors">
              <span>{selectedMonth}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${monthDdOpen ? "rotate-180" : ""}`} />
            </button>
            {monthDdOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl py-1 z-50">
                {["January 2026", "February 2026", "March 2026"].map(m => (
                  <button key={m} onClick={() => { setSelectedMonth(m); setMonthDdOpen(false); toast(`Viewing ${m} budgets`, "info"); }} className={`w-full px-3 py-2 text-left text-[12px] hover:bg-white/5 transition-colors ${selectedMonth === m ? "text-brand-light" : "text-[#888]"}`}>
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gradient shadow-[0_4px_14px_0_rgba(252,96,118,0.2)] text-white font-medium hover:-translate-y-0.5 transition-all text-[14px]">
            <Plus className="w-4 h-4" />
            Add Budget
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-[#141414] rounded-2xl p-6 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-dark/10 rounded-full blur-[80px] -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-dark/15 flex items-center justify-center text-brand-light"><PieChart className="w-4 h-4" /></div>
              <h3 className="text-[16px] font-semibold text-white">Monthly Overview</h3>
            </div>
            <div className="flex items-center gap-8">
              <div className="relative w-32 h-32 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke={overallPercentage > 100 ? "#ef4444" : "url(#budgetGradient)"} strokeWidth="3" strokeDasharray={`${Math.min(overallPercentage, 100)} ${100 - Math.min(overallPercentage, 100)}`} strokeLinecap="round" className="transition-all duration-700" />
                  <defs><linearGradient id="budgetGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#fc6076" /><stop offset="100%" stopColor="#ff9a44" /></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[22px] font-bold text-white">{overallPercentage}%</span>
                  <span className="text-[10px] text-[#888]">Used</span>
                </div>
              </div>
              <div className="space-y-4 flex-1">
                <div><p className="text-[12px] text-[#666] mb-1">Total Budget</p><p className="text-[18px] font-bold text-white">{formatCurrency(totalBudget)}</p></div>
                <div><p className="text-[12px] text-[#666] mb-1">Spent</p><p className="text-[18px] font-bold text-brand-light">{formatCurrency(totalSpent)}</p></div>
                <div><p className="text-[12px] text-[#666] mb-1">Remaining</p><p className={`text-[18px] font-bold ${totalRemaining >= 0 ? "text-green-400" : "text-red-400"}`}>{formatCurrency(Math.abs(totalRemaining))}</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#141414] rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-3xl -mr-6 -mt-6 group-hover:bg-green-500/20 transition-all duration-500"></div>
            <div className="relative z-10"><div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center mb-4"><Target className="w-5 h-5 text-green-400" /></div><p className="text-[12px] text-[#888] mb-1">On Track</p><h3 className="text-2xl font-bold text-green-400">{categories.filter((c) => c.spent <= c.budget * 0.8).length}</h3><p className="text-[11px] text-[#555] mt-1">categories</p></div>
          </div>
          <div className="bg-[#141414] rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-3xl -mr-6 -mt-6 group-hover:bg-amber-500/20 transition-all duration-500"></div>
            <div className="relative z-10"><div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center mb-4"><AlertTriangle className="w-5 h-5 text-amber-400" /></div><p className="text-[12px] text-[#888] mb-1">Near Limit</p><h3 className="text-2xl font-bold text-amber-400">{categories.filter((c) => c.spent > c.budget * 0.8 && c.spent <= c.budget).length}</h3><p className="text-[11px] text-[#555] mt-1">categories</p></div>
          </div>
          <div className="bg-[#141414] rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-3xl -mr-6 -mt-6 group-hover:bg-red-500/20 transition-all duration-500"></div>
            <div className="relative z-10"><div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center mb-4"><ArrowUpRight className="w-5 h-5 text-red-400" /></div><p className="text-[12px] text-[#888] mb-1">Over Budget</p><h3 className="text-2xl font-bold text-red-400">{overBudgetCount}</h3><p className="text-[11px] text-[#555] mt-1">categories</p></div>
          </div>
        </div>
      </div>

      {/* Budget Category Cards */}
      <div>
        <h3 className="text-[16px] font-semibold text-white mb-4">Category Budgets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => {
            const percentage = Math.round((cat.spent / cat.budget) * 100);
            const isOver = cat.spent > cat.budget;
            const isNear = percentage >= 80 && !isOver;
            return (
              <div key={cat.name} className="bg-[#141414] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300 group cursor-pointer hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradientFrom} ${cat.gradientTo} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <cat.icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-white">{cat.name}</p>
                      <p className="text-[11px] text-[#666]">{isOver ? <span className="text-red-400">Over by {formatCurrency(cat.spent - cat.budget)}</span> : <span>{formatCurrency(cat.budget - cat.spent)} left</span>}</p>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); openEdit(idx); }} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10">
                    <Pencil className="w-3 h-3 text-[#888]" />
                  </button>
                </div>
                <div className="mb-3">
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: isOver ? "#ef4444" : isNear ? "#f59e0b" : cat.color }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-white">{formatCurrency(cat.spent)}</span>
                  <span className="text-[12px] text-[#666]">/ {formatCurrency(cat.budget)}</span>
                </div>
                <div className="flex justify-end mt-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${isOver ? "bg-red-500/10 text-red-400 border border-red-500/20" : isNear ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget Alerts */}
      {overBudgetCount > 0 && (
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-400" /></div>
            <div><h3 className="text-[15px] font-semibold text-white">Budget Alert</h3><p className="text-[13px] text-[#888]">{overBudgetCount} {overBudgetCount === 1 ? "category has" : "categories have"} exceeded the monthly limit</p></div>
          </div>
          <div className="space-y-2">
            {categories.filter((c) => c.spent > c.budget).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <div className="flex items-center gap-3"><cat.icon className="w-4 h-4 text-red-400" /><span className="text-[14px] font-medium text-white">{cat.name}</span></div>
                <span className="text-[14px] font-semibold text-red-400">+{formatCurrency(cat.spent - cat.budget)} over</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Budget Modal */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add New Budget">
        <div className="space-y-4">
          <div>
            <label className="text-[14px] font-medium text-white mb-2 block">Category Name</label>
            <input type="text" value={newBudget.name} onChange={e => setNewBudget({...newBudget, name: e.target.value})} placeholder="e.g. Subscriptions" className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors" />
          </div>
          <div>
            <label className="text-[14px] font-medium text-white mb-2 block">Monthly Limit</label>
            <input type="number" value={newBudget.amount} onChange={e => setNewBudget({...newBudget, amount: e.target.value})} placeholder="500" className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors" />
          </div>
          <button onClick={handleAddBudget} className="w-full py-3 rounded-xl bg-brand-gradient text-white font-medium text-[14px] shadow-[0_4px_14px_0_rgba(252,96,118,0.2)] hover:-translate-y-0.5 transition-all mt-2">
            Create Budget
          </button>
        </div>
      </Modal>

      {/* Edit Budget Modal */}
      <Modal open={editModalOpen} onClose={() => { setEditModalOpen(false); setEditIndex(null); }} title={editIndex !== null ? `Edit ${categories[editIndex]?.name} Budget` : "Edit Budget"}>
        <div className="space-y-4">
          <div>
            <label className="text-[14px] font-medium text-white mb-2 block">New Monthly Limit</label>
            <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)} placeholder="500" className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[18px] text-white font-bold placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors" />
          </div>
          <button onClick={handleEditBudget} className="w-full py-3 rounded-xl bg-brand-gradient text-white font-medium text-[14px] shadow-[0_4px_14px_0_rgba(252,96,118,0.2)] hover:-translate-y-0.5 transition-all">
            Update Budget
          </button>
        </div>
      </Modal>
    </div>
  );
}
