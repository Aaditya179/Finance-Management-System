"use client";

import { useState } from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { useToast } from "@/lib/contexts/ToastContext";
import Modal from "@/components/ui/Modal";
import {
  Home,
  Car,
  GraduationCap,
  Wallet,
  TrendingUp,
  Plus,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  ChevronDown,
} from "lucide-react";

const LOANS = [
  { id: 1, name: "Home Mortgage", icon: Home, type: "Home Loan", principal: 250000, remaining: 187500, monthlyEmi: 1850, interestRate: 6.5, startDate: "2022-01-15", endDate: "2052-01-15", paidPercentage: 25, status: "active", color: "from-purple-500 to-violet-600", iconBg: "bg-purple-500/15 text-purple-400", barColor: "bg-gradient-to-r from-purple-500 to-violet-500", nextPayment: "2026-04-01" },
  { id: 2, name: "Car Loan", icon: Car, type: "Auto Finance", principal: 35000, remaining: 14000, monthlyEmi: 680, interestRate: 4.2, startDate: "2023-06-01", endDate: "2028-06-01", paidPercentage: 60, status: "active", color: "from-cyan-500 to-blue-600", iconBg: "bg-cyan-500/15 text-cyan-400", barColor: "bg-gradient-to-r from-cyan-500 to-blue-500", nextPayment: "2026-04-05" },
  { id: 3, name: "Education Loan", icon: GraduationCap, type: "Student Finance", principal: 60000, remaining: 22000, monthlyEmi: 950, interestRate: 5.0, startDate: "2021-09-01", endDate: "2027-09-01", paidPercentage: 63, status: "active", color: "from-amber-500 to-orange-600", iconBg: "bg-amber-500/15 text-amber-400", barColor: "bg-gradient-to-r from-amber-500 to-orange-500", nextPayment: "2026-04-10" },
  { id: 4, name: "Personal Loan", icon: Wallet, type: "Unsecured", principal: 10000, remaining: 1200, monthlyEmi: 450, interestRate: 8.5, startDate: "2024-03-01", endDate: "2026-03-01", paidPercentage: 88, status: "almost-done", color: "from-emerald-500 to-green-600", iconBg: "bg-emerald-500/15 text-emerald-400", barColor: "bg-gradient-to-r from-emerald-500 to-green-500", nextPayment: "2026-04-01" },
];

const PAYMENT_HISTORY = [
  { loan: "Home Mortgage", amount: 1850, date: "2026-03-01", status: "paid" },
  { loan: "Car Loan", amount: 680, date: "2026-03-05", status: "paid" },
  { loan: "Education Loan", amount: 950, date: "2026-03-10", status: "paid" },
  { loan: "Personal Loan", amount: 450, date: "2026-03-01", status: "paid" },
  { loan: "Home Mortgage", amount: 1850, date: "2026-02-01", status: "paid" },
  { loan: "Car Loan", amount: 680, date: "2026-02-05", status: "paid" },
];

type HistoryFilter = "3" | "6" | "12";

export default function LoansPage() {
  const { formatCurrency, formatDate } = useSettings();
  const { toast } = useToast();
  const [selectedLoan, setSelectedLoan] = useState<number | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("3");
  const [historyDdOpen, setHistoryDdOpen] = useState(false);
  const [loanForm, setLoanForm] = useState({ type: "Home Loan", amount: "", term: "", rate: "" });
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payLoanId, setPayLoanId] = useState<number | null>(null);

  const totalBorrowed = LOANS.reduce((s, l) => s + l.principal, 0);
  const totalRemaining = LOANS.reduce((s, l) => s + l.remaining, 0);
  const totalRepaid = totalBorrowed - totalRemaining;
  const monthlyTotal = LOANS.reduce((s, l) => s + l.monthlyEmi, 0);

  const filterLabels: Record<HistoryFilter, string> = { "3": "Last 3 Months", "6": "Last 6 Months", "12": "Last Year" };

  const handleApply = () => {
    if (!loanForm.amount || !loanForm.term) {
      toast("Please fill all required fields", "error");
      return;
    }
    toast(`Loan application for ${formatCurrency(parseFloat(loanForm.amount))} submitted for review`);
    setApplyModalOpen(false);
    setLoanForm({ type: "Home Loan", amount: "", term: "", rate: "" });
  };

  const handlePayEmi = (loanId: number) => {
    const loan = LOANS.find(l => l.id === loanId);
    if (!loan) return;
    toast(`EMI payment of ${formatCurrency(loan.monthlyEmi)} for ${loan.name} processed`);
    setPayModalOpen(false);
    setPayLoanId(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Loans</h1>
          <p className="text-[#888888] text-[14px] mt-1">Manage and track all your active loans</p>
        </div>
        <button onClick={() => setApplyModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gradient shadow-[0_4px_14px_0_rgba(252,96,118,0.2)] text-white font-medium hover:-translate-y-0.5 transition-all text-[14px]">
          <Plus className="w-4 h-4" />
          Apply for Loan
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Borrowed", value: totalBorrowed, icon: TrendingUp, iconBg: "bg-blue-500/15 text-blue-400", glow: "bg-blue-500/10" },
          { label: "Total Repaid", value: totalRepaid, icon: CheckCircle2, iconBg: "bg-green-500/15 text-green-400", glow: "bg-green-500/10" },
          { label: "Outstanding", value: totalRemaining, icon: AlertCircle, iconBg: "bg-amber-500/15 text-amber-400", glow: "bg-amber-500/10" },
          { label: "Monthly EMI", value: monthlyTotal, icon: Calendar, iconBg: "bg-purple-500/15 text-purple-400", glow: "bg-purple-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#141414] rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.glow} rounded-full blur-3xl -mr-8 -mt-8 group-hover:scale-150 transition-all duration-500`}></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <span className="text-[13px] text-[#888]">{stat.label}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{formatCurrency(stat.value)}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Loan Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {LOANS.map((loan) => (
          <div
            key={loan.id}
            className={`bg-[#141414] rounded-2xl p-6 border transition-all duration-300 group ${
              selectedLoan === loan.id ? "border-white/15 shadow-[0_0_30px_rgba(255,255,255,0.03)]" : "border-white/5 hover:border-white/10"
            }`}
          >
            {/* Loan Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedLoan(selectedLoan === loan.id ? null : loan.id)}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${loan.color} flex items-center justify-center shadow-lg`}>
                  <loan.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white">{loan.name}</h3>
                  <p className="text-[12px] text-[#666]">{loan.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setPayLoanId(loan.id); setPayModalOpen(true); }}
                  className="text-[11px] px-3 py-1.5 rounded-lg bg-brand-gradient text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Pay EMI
                </button>
                <div className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                  loan.paidPercentage >= 80
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  {loan.paidPercentage >= 80 ? "Almost Done" : "Active"}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4 cursor-pointer" onClick={() => setSelectedLoan(selectedLoan === loan.id ? null : loan.id)}>
              <div className="flex justify-between text-[12px] mb-2">
                <span className="text-[#888]">Repaid: {formatCurrency(loan.principal - loan.remaining)}</span>
                <span className="text-white font-medium">{loan.paidPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${loan.barColor} rounded-full transition-all duration-700`} style={{ width: `${loan.paidPercentage}%` }}></div>
              </div>
            </div>

            {/* Loan Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">Principal</p>
                <p className="text-[14px] font-semibold text-white">{formatCurrency(loan.principal)}</p>
              </div>
              <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">Monthly EMI</p>
                <p className="text-[14px] font-semibold text-white">{formatCurrency(loan.monthlyEmi)}</p>
              </div>
              <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">APR</p>
                <p className="text-[14px] font-semibold text-white">{loan.interestRate}%</p>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedLoan === loan.id && (
              <div className="mt-5 pt-5 border-t border-white/5 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2 text-[#888]"><Calendar className="w-3.5 h-3.5" /><span>Start Date</span></div>
                  <span className="text-white font-medium">{formatDate(loan.startDate)}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2 text-[#888]"><Clock className="w-3.5 h-3.5" /><span>End Date</span></div>
                  <span className="text-white font-medium">{formatDate(loan.endDate)}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2 text-[#888]"><AlertCircle className="w-3.5 h-3.5" /><span>Remaining</span></div>
                  <span className="text-amber-400 font-medium">{formatCurrency(loan.remaining)}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2 text-[#888]"><Calendar className="w-3.5 h-3.5" /><span>Next Payment</span></div>
                  <span className="text-brand-light font-medium">{formatDate(loan.nextPayment)}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Payment History */}
      <div className="bg-[#141414] rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[16px] font-semibold text-white">Payment History</h3>
          <div className="relative">
            <button onClick={() => setHistoryDdOpen(!historyDdOpen)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0c0c0e] text-[12px] text-[#888888] hover:text-white transition-colors">
              <span>{filterLabels[historyFilter]}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${historyDdOpen ? "rotate-180" : ""}`} />
            </button>
            {historyDdOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl py-1 z-50">
                {(Object.entries(filterLabels) as [HistoryFilter, string][]).map(([k, v]) => (
                  <button key={k} onClick={() => { setHistoryFilter(k); setHistoryDdOpen(false); }} className={`w-full px-3 py-2 text-left text-[12px] hover:bg-white/5 transition-colors ${historyFilter === k ? "text-brand-light" : "text-[#888]"}`}>
                    {v}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {PAYMENT_HISTORY.map((payment, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer" onClick={() => toast(`${payment.loan} EMI of ${formatCurrency(payment.amount)} paid on ${formatDate(payment.date)}`, "info")}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-white">{payment.loan}</p>
                  <p className="text-[12px] text-[#555]">{formatDate(payment.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">Paid</span>
                <span className="text-[14px] font-semibold text-white">{formatCurrency(payment.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Loan Modal */}
      <Modal open={applyModalOpen} onClose={() => setApplyModalOpen(false)} title="Apply for Loan">
        <div className="space-y-4">
          <div>
            <label className="text-[14px] font-medium text-white mb-2 block">Loan Type</label>
            <select value={loanForm.type} onChange={e => setLoanForm({...loanForm, type: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-light/30 transition-colors">
              <option>Home Loan</option>
              <option>Auto Finance</option>
              <option>Student Finance</option>
              <option>Personal Loan</option>
              <option>Business Loan</option>
            </select>
          </div>
          <div>
            <label className="text-[14px] font-medium text-white mb-2 block">Loan Amount</label>
            <input type="number" value={loanForm.amount} onChange={e => setLoanForm({...loanForm, amount: e.target.value})} placeholder="50000" className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[14px] font-medium text-white mb-2 block">Term (years)</label>
              <input type="number" value={loanForm.term} onChange={e => setLoanForm({...loanForm, term: e.target.value})} placeholder="10" className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors" />
            </div>
            <div>
              <label className="text-[14px] font-medium text-white mb-2 block">Expected APR</label>
              <input type="number" value={loanForm.rate} onChange={e => setLoanForm({...loanForm, rate: e.target.value})} placeholder="6.5" step="0.1" className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors" />
            </div>
          </div>
          <button onClick={handleApply} className="w-full py-3 rounded-xl bg-brand-gradient text-white font-medium text-[14px] shadow-[0_4px_14px_0_rgba(252,96,118,0.2)] hover:-translate-y-0.5 transition-all mt-2">
            Submit Application
          </button>
        </div>
      </Modal>

      {/* Pay EMI Modal */}
      <Modal open={payModalOpen} onClose={() => { setPayModalOpen(false); setPayLoanId(null); }} title="Confirm EMI Payment">
        {payLoanId && (() => {
          const loan = LOANS.find(l => l.id === payLoanId)!;
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0c0c0e] border border-white/5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${loan.color} flex items-center justify-center`}>
                  <loan.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-white">{loan.name}</p>
                  <p className="text-[12px] text-[#666]">{loan.type}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0c0c0e] border border-white/5">
                <span className="text-[14px] text-[#888]">EMI Amount</span>
                <span className="text-[20px] font-bold text-white">{formatCurrency(loan.monthlyEmi)}</span>
              </div>
              <button onClick={() => handlePayEmi(payLoanId)} className="w-full py-3 rounded-xl bg-brand-gradient text-white font-medium text-[14px] shadow-[0_4px_14px_0_rgba(252,96,118,0.2)] hover:-translate-y-0.5 transition-all">
                Confirm Payment
              </button>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
