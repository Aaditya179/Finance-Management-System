"use client";

import { useState } from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { useToast } from "@/lib/contexts/ToastContext";
import Modal from "@/components/ui/Modal";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Receipt,
  Eye,
  EyeOff,
  CreditCard,
  Building2,
  Smartphone,
  MoreHorizontal,
  Copy,
  ChevronDown,
  ShoppingCart,
  Car,
  Utensils,
  Film,
  Heart,
  Zap,
} from "lucide-react";

const LINKED_ACCOUNTS = [
  { name: "Chase Bank", type: "Savings", balance: 12450.00, icon: Building2, color: "from-blue-500 to-blue-600", iconBg: "bg-blue-500/15 text-blue-400" },
  { name: "Bank of America", type: "Checking", balance: 8320.50, icon: CreditCard, color: "from-red-500 to-pink-600", iconBg: "bg-red-500/15 text-red-400" },
  { name: "Apple Pay", type: "Digital Wallet", balance: 2150.75, icon: Smartphone, color: "from-violet-500 to-purple-600", iconBg: "bg-violet-500/15 text-violet-400" },
];

const SPENDING_CATEGORIES = [
  { name: "Shopping", amount: 1240, percentage: 32, color: "#3b82f6", icon: ShoppingCart },
  { name: "Food & Dining", amount: 890, percentage: 23, color: "#f59e0b", icon: Utensils },
  { name: "Transport", amount: 560, percentage: 14, color: "#10b981", icon: Car },
  { name: "Entertainment", amount: 430, percentage: 11, color: "#8b5cf6", icon: Film },
  { name: "Health", amount: 380, percentage: 10, color: "#ef4444", icon: Heart },
  { name: "Utilities", amount: 390, percentage: 10, color: "#06b6d4", icon: Zap },
];

const RECENT_PAYMENTS = [
  { name: "Netflix Subscription", amount: -15.99, date: "Mar 28", category: "Entertainment", color: "bg-red-500/15 text-red-400" },
  { name: "Uber Ride", amount: -24.50, date: "Mar 27", category: "Transport", color: "bg-green-500/15 text-green-400" },
  { name: "Salary Deposit", amount: 5400.00, date: "Mar 25", category: "Income", color: "bg-blue-500/15 text-blue-400" },
  { name: "Grocery Store", amount: -67.30, date: "Mar 24", category: "Food", color: "bg-amber-500/15 text-amber-400" },
];

export default function WalletPage() {
  const { formatCurrency } = useSettings();
  const { toast } = useToast();
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const [spendingPeriod, setSpendingPeriod] = useState("This Month");
  const [spendingDdOpen, setSpendingDdOpen] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionAmount, setActionAmount] = useState("");
  const [cardForm, setCardForm] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [accountForm, setAccountForm] = useState({ bank: "", type: "Savings", number: "" });

  const totalBalance = LINKED_ACCOUNTS.reduce((sum, acc) => sum + acc.balance, 0);
  const cardNumber = "4748  7475  8383  9384";

  const handleCopy = () => {
    navigator.clipboard.writeText(cardNumber.replace(/\s+/g, ""));
    setCopied(true);
    toast("Card number copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickAction = (label: string) => {
    setActionType(label);
    setActionAmount("");
    setActionModalOpen(true);
  };

  const handleActionSubmit = () => {
    if (!actionAmount) return;
    toast(`${actionType} of ${formatCurrency(parseFloat(actionAmount))} initiated`);
    setActionModalOpen(false);
    setActionAmount("");
  };

  const handleAddCard = () => {
    if (!cardForm.number || !cardForm.name || !cardForm.expiry || !cardForm.cvv) {
      toast("Please fill all card fields", "error");
      return;
    }
    toast("New card added successfully");
    setAddCardOpen(false);
    setCardForm({ number: "", name: "", expiry: "", cvv: "" });
  };

  const handleAddAccount = () => {
    if (!accountForm.bank || !accountForm.number) {
      toast("Please fill all account fields", "error");
      return;
    }
    toast(`${accountForm.bank} account linked successfully`);
    setAddAccountOpen(false);
    setAccountForm({ bank: "", type: "Savings", number: "" });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">My Wallet</h1>
          <p className="text-[#888888] text-[14px] mt-1">Manage your cards, accounts and spending</p>
        </div>
        <button onClick={() => setAddCardOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gradient shadow-[0_4px_14px_0_rgba(252,96,118,0.2)] text-white font-medium hover:-translate-y-0.5 transition-all text-[14px]">
          <Plus className="w-4 h-4" />
          Add Card
        </button>
      </div>

      {/* Main Card + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Virtual Card */}
        <div className="lg:col-span-7">
          <div className="relative rounded-2xl overflow-hidden p-6 md:p-8 h-full min-h-[260px] bg-gradient-to-br from-[#1a1035] via-[#1e1145] to-[#0f0a2e] border border-white/5 group">
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/15 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-purple-500/25 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] -ml-10 -mb-10"></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-pink-500/8 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2"></div>

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[13px] text-purple-300/60 font-medium mb-1">Total Balance</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    {showBalance ? formatCurrency(totalBalance) : "••••••••"}
                  </h2>
                </div>
                <button onClick={() => setShowBalance(!showBalance)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  {showBalance ? <Eye className="w-4 h-4 text-purple-300" /> : <EyeOff className="w-4 h-4 text-purple-300" />}
                </button>
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[16px] text-white/70 tracking-[0.2em] font-mono">{cardNumber}</span>
                  <button onClick={handleCopy} className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-purple-300 hover:bg-white/10 transition-colors">
                    <Copy className="w-3 h-3" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-white/30 uppercase tracking-wider">Card Holder</p>
                    <p className="text-[14px] text-white/70 font-medium">Aaditya Surve</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-white/30 uppercase tracking-wider">Expires</p>
                    <p className="text-[14px] text-white/70 font-medium">09/28</p>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-8 h-8 rounded-full bg-red-500/60"></div>
                    <div className="w-8 h-8 rounded-full bg-yellow-500/60 -ml-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-5">
          <div className="bg-[#141414] rounded-2xl p-6 border border-white/5 h-full">
            <h3 className="text-[16px] font-semibold text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: ArrowUpRight, label: "Send", color: "from-blue-500 to-cyan-500", shadow: "rgba(59,130,246,0.2)" },
                { icon: ArrowDownLeft, label: "Receive", color: "from-green-500 to-emerald-500", shadow: "rgba(16,185,129,0.2)" },
                { icon: Send, label: "Transfer", color: "from-violet-500 to-purple-500", shadow: "rgba(139,92,246,0.2)" },
                { icon: Receipt, label: "Pay Bills", color: "from-amber-500 to-orange-500", shadow: "rgba(245,158,11,0.2)" },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.label)}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[13px] font-medium text-[#888888] group-hover:text-white transition-colors">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Linked Accounts + Spending Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-[#141414] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-semibold text-white">Linked Accounts</h3>
            <button onClick={() => setAddAccountOpen(true)} className="flex items-center gap-1.5 text-[13px] text-brand-light hover:text-white transition-colors">
              <Plus className="w-4 h-4" /> Add Account
            </button>
          </div>
          <div className="space-y-3">
            {LINKED_ACCOUNTS.map((account) => (
              <div key={account.name} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group cursor-pointer" onClick={() => toast(`Viewing ${account.name} details`, "info")}>
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${account.iconBg}`}>
                    <account.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-white group-hover:text-brand-light transition-colors">{account.name}</p>
                    <p className="text-[12px] text-[#666]">{account.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-semibold text-white">{formatCurrency(account.balance)}</span>
                  <MoreHorizontal className="w-4 h-4 text-[#555] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#141414] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-semibold text-white">Spending Breakdown</h3>
            <div className="relative">
              <button onClick={() => setSpendingDdOpen(!spendingDdOpen)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0c0c0e] text-[12px] text-[#888888] hover:text-white transition-colors">
                <span>{spendingPeriod}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${spendingDdOpen ? "rotate-180" : ""}`} />
              </button>
              {spendingDdOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl py-1 z-50">
                  {["This Week", "This Month", "This Quarter"].map(p => (
                    <button key={p} onClick={() => { setSpendingPeriod(p); setSpendingDdOpen(false); }} className={`w-full px-3 py-2 text-left text-[12px] hover:bg-white/5 transition-colors ${spendingPeriod === p ? "text-brand-light" : "text-[#888]"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {(() => {
                  let offset = 0;
                  return SPENDING_CATEGORIES.map((cat) => {
                    const dash = cat.percentage;
                    const gap = 100 - dash;
                    const currentOffset = offset;
                    offset += dash;
                    return (
                      <circle key={cat.name} cx="18" cy="18" r="15.915" fill="none" stroke={cat.color} strokeWidth="2.5" strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-currentOffset} strokeLinecap="round" className="transition-all duration-500" />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[20px] font-bold text-white">{formatCurrency(3890)}</span>
                <span className="text-[11px] text-[#888]">Total Spent</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {SPENDING_CATEGORIES.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-[13px] text-[#888]">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-medium text-white">{formatCurrency(cat.amount)}</span>
                  <span className="text-[11px] text-[#555] w-8 text-right">{cat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-[#141414] rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[16px] font-semibold text-white">Recent Payments</h3>
          <button onClick={() => { window.location.href = "/dashboard/transactions"; }} className="text-[13px] text-brand-light hover:text-white transition-colors">View All →</button>
        </div>
        <div className="space-y-3">
          {RECENT_PAYMENTS.map((payment, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors group cursor-pointer" onClick={() => toast(`${payment.name}: ${formatCurrency(Math.abs(payment.amount))}`, "info")}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold ${payment.color}`}>
                  {payment.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[14px] font-medium text-white">{payment.name}</p>
                  <p className="text-[12px] text-[#555]">{payment.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-[#888] border border-white/5">{payment.category}</span>
                <span className={`text-[14px] font-semibold ${payment.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                  {payment.amount > 0 ? "+" : ""}{formatCurrency(Math.abs(payment.amount))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Card Modal */}
      <Modal open={addCardOpen} onClose={() => setAddCardOpen(false)} title="Add New Card">
        <div className="space-y-4">
          <div>
            <label className="text-[14px] font-medium text-white mb-2 block">Card Number</label>
            <input type="text" value={cardForm.number} onChange={e => setCardForm({...cardForm, number: e.target.value})} placeholder="1234 5678 9012 3456" maxLength={19} className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors font-mono tracking-wider" />
          </div>
          <div>
            <label className="text-[14px] font-medium text-white mb-2 block">Cardholder Name</label>
            <input type="text" value={cardForm.name} onChange={e => setCardForm({...cardForm, name: e.target.value})} placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[14px] font-medium text-white mb-2 block">Expiry</label>
              <input type="text" value={cardForm.expiry} onChange={e => setCardForm({...cardForm, expiry: e.target.value})} placeholder="MM/YY" maxLength={5} className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors" />
            </div>
            <div>
              <label className="text-[14px] font-medium text-white mb-2 block">CVV</label>
              <input type="password" value={cardForm.cvv} onChange={e => setCardForm({...cardForm, cvv: e.target.value})} placeholder="•••" maxLength={3} className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors" />
            </div>
          </div>
          <button onClick={handleAddCard} className="w-full py-3 rounded-xl bg-brand-gradient text-white font-medium text-[14px] shadow-[0_4px_14px_0_rgba(252,96,118,0.2)] hover:-translate-y-0.5 transition-all mt-2">
            Add Card
          </button>
        </div>
      </Modal>

      {/* Add Account Modal */}
      <Modal open={addAccountOpen} onClose={() => setAddAccountOpen(false)} title="Link Bank Account">
        <div className="space-y-4">
          <div>
            <label className="text-[14px] font-medium text-white mb-2 block">Bank Name</label>
            <input type="text" value={accountForm.bank} onChange={e => setAccountForm({...accountForm, bank: e.target.value})} placeholder="e.g. Chase Bank" className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors" />
          </div>
          <div>
            <label className="text-[14px] font-medium text-white mb-2 block">Account Type</label>
            <select value={accountForm.type} onChange={e => setAccountForm({...accountForm, type: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-light/30 transition-colors">
              <option>Savings</option>
              <option>Checking</option>
              <option>Digital Wallet</option>
            </select>
          </div>
          <div>
            <label className="text-[14px] font-medium text-white mb-2 block">Account Number</label>
            <input type="text" value={accountForm.number} onChange={e => setAccountForm({...accountForm, number: e.target.value})} placeholder="••••••••1234" className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors" />
          </div>
          <button onClick={handleAddAccount} className="w-full py-3 rounded-xl bg-brand-gradient text-white font-medium text-[14px] shadow-[0_4px_14px_0_rgba(252,96,118,0.2)] hover:-translate-y-0.5 transition-all mt-2">
            Link Account
          </button>
        </div>
      </Modal>

      {/* Quick Action Modal */}
      <Modal open={actionModalOpen} onClose={() => setActionModalOpen(false)} title={actionType}>
        <div className="space-y-5">
          <div>
            <label className="text-[14px] font-medium text-white mb-2 block">Amount</label>
            <input type="number" value={actionAmount} onChange={e => setActionAmount(e.target.value)} placeholder="0.00" className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[18px] text-white font-bold placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors" />
          </div>
          {actionType === "Pay Bills" && (
            <div>
              <label className="text-[14px] font-medium text-white mb-2 block">Biller</label>
              <select className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-light/30 transition-colors">
                <option>Electricity</option>
                <option>Internet</option>
                <option>Phone</option>
                <option>Water</option>
                <option>Gas</option>
              </select>
            </div>
          )}
          {actionType === "Transfer" && (
            <div>
              <label className="text-[14px] font-medium text-white mb-2 block">To Account</label>
              <select className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-light/30 transition-colors">
                {LINKED_ACCOUNTS.map(a => <option key={a.name}>{a.name}</option>)}
              </select>
            </div>
          )}
          <button onClick={handleActionSubmit} disabled={!actionAmount} className={`w-full py-3 rounded-xl font-medium text-[14px] transition-all ${actionAmount ? "bg-brand-gradient text-white shadow-[0_4px_14px_0_rgba(252,96,118,0.2)] hover:-translate-y-0.5" : "bg-white/5 text-[#555] cursor-not-allowed"}`}>
            Confirm {actionType}
          </button>
        </div>
      </Modal>
    </div>
  );
}
