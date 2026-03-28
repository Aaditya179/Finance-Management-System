"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Search, Bell, ChevronDown, DownloadCloud, Plus, ArrowUpRight, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { useToast } from "@/lib/contexts/ToastContext";
import StatCard from "@/components/dashboard/StatCard";
import TransactionList from "@/components/dashboard/TransactionList";
import Modal from "@/components/ui/Modal";

const CONTACTS = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Robert Fox" },
  { id: 3, name: "Emma Wilson" },
  { id: 4, name: "James Lee" },
  { id: 5, name: "Sophia Chen" },
];

export default function DashboardOverview() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const { formatCurrency, formatDate, currency } = useSettings();
  const { toast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [transferPeriod, setTransferPeriod] = useState("This Week");
  const [transferDropdownOpen, setTransferDropdownOpen] = useState(false);
  const [cashflowPeriod, setCashflowPeriod] = useState("This Month");
  const [cashflowDropdownOpen, setCashflowDropdownOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<number | null>(2);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const handleExport = () => {
    const csvContent = [
      ["Type", "Amount", "Date"],
      ["Balance", "24847.84", formatDate(new Date())],
      ["Monthly Spent", "45623.48", formatDate(new Date())],
      ["Monthly Income", "84884.80", formatDate(new Date())],
    ].map(r => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexora-overview-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Overview data exported successfully");
  };

  const handleTransfer = () => {
    if (!selectedContact || !transferAmount) return;
    const contact = CONTACTS.find(c => c.id === selectedContact);
    toast(`Sent ${currency === "USD" ? "$" : "₹"}${transferAmount} to ${contact?.name}`);
    setTransferModalOpen(false);
    setTransferAmount("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <div className="w-8 h-8 rounded-full border-2 border-brand-light border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;


  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto pb-10">
      
      {/* Top Navbar Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
           <h1 className="text-2xl font-semibold text-white tracking-tight">Overview</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
             <button onClick={() => { setSearchOpen(!searchOpen); toast("Search panel toggled", "info"); }} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-[#888888] hover:text-white bg-[#141414]">
               <Search className="w-4 h-4" />
             </button>
             <button onClick={() => toast("No new notifications", "info")} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-[#888888] hover:text-white bg-[#141414] relative">
               <Bell className="w-4 h-4" />
               <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-brand-light rounded-full"></span>
             </button>
          </div>
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 pl-4 border-l border-white/10 hover:opacity-80 transition-opacity"
            >
               {user?.user_metadata?.avatar_url ? (
                 <img src={user.user_metadata.avatar_url} alt="Profile" className="w-10 h-10 rounded-full border border-white/10 object-cover" />
               ) : (
                 <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-lg border border-white/10">
                   {userInitial}
                 </div>
               )}
               <div className="hidden sm:block text-left">
                  <p className="text-[14px] font-medium text-white leading-tight truncate max-w-[120px]">{userName}</p>
                  <p className="text-[12px] text-[#888888] truncate max-w-[120px]">{user?.email}</p>
               </div>
               <ChevronDown className={`w-4 h-4 text-[#888888] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#141414] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-4 py-2 border-b border-white/5 mb-2 sm:hidden">
                  <p className="text-[13px] font-medium text-white truncate">{userName}</p>
                  <p className="text-[11px] text-[#888888] truncate">{user?.email}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 w-full text-left flex items-center gap-2 text-[14px] text-red-400 hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Welcome & Global Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-medium text-white mb-1 flex items-center gap-2">Welcome, {userName.split(' ')[0]} <span>🔥</span></h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-[#141414] text-[13px] text-white font-medium">
            <Calendar className="w-4 h-4 text-[#888888]" />
            {formatDate(new Date())}
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gradient shadow-[0_4px_14px_0_rgba(252,96,118,0.2)] text-white font-medium hover:-translate-y-0.5 transition-all text-[14px]">
            <DownloadCloud className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 h-full">
           <StatCard 
             type="balance"
             title="My Balance"
             amount={formatCurrency(24847.84)}
             trend="16.8%"
             trendUp={true}
             dateStr={formatDate(new Date())}
             cardNumber="7484 7475 8383 9384"
           />
        </div>
        <div className="lg:col-span-3 h-full">
           <StatCard 
             title="Monthly Spent"
             amount={formatCurrency(45623.48)}
             trend="16.5%"
             trendUp={false}
             subtitle="Compared to last month"
             dateStr={formatDate(new Date())}
           />
        </div>
        <div className="lg:col-span-3 h-full">
           <StatCard 
             title="Monthly Income"
             amount={formatCurrency(84884.80)}
             trend="12.8%"
             trendUp={false}
             subtitle="Compared to last month"
             dateStr={formatDate(new Date())}
           />
        </div>
      </div>

      {/* Middle Grid: Quick Transfer & Cashflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quick transfer */}
        <div className="lg:col-span-4 bg-[#141414] rounded-2xl p-6 border border-white/5">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-[16px] font-semibold text-white">Quick transfer</h3>
             <div className="relative">
               <button onClick={() => setTransferDropdownOpen(!transferDropdownOpen)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0c0c0e] text-[12px] text-[#888888] hover:text-white transition-colors">
                 <span>{transferPeriod}</span>
                 <ChevronDown className={`w-3 h-3 transition-transform ${transferDropdownOpen ? "rotate-180" : ""}`} />
               </button>
               {transferDropdownOpen && (
                 <div className="absolute right-0 mt-1 w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl py-1 z-50">
                   {["This Week", "This Month", "This Year"].map(p => (
                     <button key={p} onClick={() => { setTransferPeriod(p); setTransferDropdownOpen(false); }} className={`w-full px-3 py-2 text-left text-[12px] hover:bg-white/5 transition-colors ${transferPeriod === p ? "text-brand-light" : "text-[#888]"}`}>
                       {p}
                     </button>
                   ))}
                 </div>
               )}
             </div>
           </div>
           
           <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
              <button onClick={() => toast("Add a new contact from your contacts list", "info")} className="w-12 h-12 shrink-0 rounded-full border border-dashed border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors">
                <Plus className="w-5 h-5 text-[#888888]" />
              </button>
              
              <div className="flex items-center gap-2">
                 {CONTACTS.map((c) => (
                   <div key={c.id} className="relative group cursor-pointer shrink-0" onClick={() => { setSelectedContact(c.id); setTransferModalOpen(true); }}>
                     <img 
                       src={`https://i.pravatar.cc/150?u=${c.id+10}`} 
                       className={`w-12 h-12 rounded-full border-2 ${selectedContact === c.id ? 'border-brand-dark' : 'border-transparent'} object-cover group-hover:-translate-y-1 transition-transform`} 
                       alt={c.name}
                     />
                     {selectedContact === c.id && (
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded w-max">
                         {c.name}
                         <div className="absolute top-full left-1/2 -translate-x-1/2 border-solid border-t-blue-500 border-t-4 border-x-transparent border-x-4 border-b-0"></div>
                       </div>
                     )}
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Cashflow Chart */}
        <div className="lg:col-span-8 bg-[#141414] rounded-2xl p-6 border border-white/5 relative overflow-hidden flex flex-col">
           <div className="flex items-center justify-between mb-2">
             <h3 className="text-[16px] font-semibold text-white">Cashflow</h3>
             <div className="relative">
               <button onClick={() => setCashflowDropdownOpen(!cashflowDropdownOpen)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0c0c0e] text-[12px] text-[#888888] hover:text-white transition-colors">
                 <span>{cashflowPeriod}</span>
                 <ChevronDown className={`w-3 h-3 transition-transform ${cashflowDropdownOpen ? "rotate-180" : ""}`} />
               </button>
               {cashflowDropdownOpen && (
                 <div className="absolute right-0 mt-1 w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl py-1 z-50">
                   {["This Week", "This Month", "This Quarter", "This Year"].map(p => (
                     <button key={p} onClick={() => { setCashflowPeriod(p); setCashflowDropdownOpen(false); toast(`Cashflow: ${p}`, "info"); }} className={`w-full px-3 py-2 text-left text-[12px] hover:bg-white/5 transition-colors ${cashflowPeriod === p ? "text-brand-light" : "text-[#888]"}`}>
                       {p}
                     </button>
                   ))}
                 </div>
               )}
             </div>
           </div>
           
           <div className="flex justify-between items-end mb-6">
             <div>
               <p className="text-[13px] text-[#888888] mb-1">Total Balance</p>
               <div className="flex items-center gap-3">
                 <h2 className="text-2xl font-bold text-white">{formatCurrency(83074.00)}</h2>
                 <span className="flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded text-green-400 bg-green-400/10">
                   <ArrowUpRight className="w-3 h-3" />
                   16.8%
                 </span>
               </div>
             </div>
             <div className="flex items-center gap-4 text-[13px] font-medium">
               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-[#888888]">Expense</span></div>
               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span><span className="text-[#888888]">Income</span></div>
             </div>
           </div>

           {/* Chart Mockup */}
           <div className="flex-1 mt-4 relative w-full h-full min-h-[160px]">
              <div className="absolute inset-0 flex flex-col justify-between text-[11px] text-[#555]">
                <div className="flex justify-between w-full border-b border-white/5 pb-1"><span>20K</span></div>
                <div className="flex justify-between w-full border-b border-white/5 pb-1"><span>15K</span></div>
                <div className="flex justify-between w-full border-b border-white/5 pb-1"><span>10K</span></div>
                <div className="flex justify-between w-full border-b border-white/5 pb-1"><span>5K</span></div>
                <div className="flex justify-between w-full pb-1"><span>1K</span></div>
              </div>
              
              <div className="absolute -bottom-1 left-8 right-0 flex justify-between text-[11px] text-[#555] font-medium pr-4 mt-2">
                 <span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span className="text-blue-400">May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span>
              </div>
              
              <div className="absolute inset-0 left-8 right-4 px-2 bottom-5 pointer-events-none">
                 <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,40 Q10,30 20,40 T40,30 T60,50 T80,40 T100,50" fill="none" stroke="#eab308" strokeWidth="2" />
                    <path d="M0,20 Q10,10 20,20 T40,10 T60,30 T80,20 T100,30" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    <circle cx="60" cy="30" r="4" fill="#3b82f6" stroke="#141414" strokeWidth="2" />
                    <circle cx="60" cy="50" r="4" fill="#eab308" stroke="#141414" strokeWidth="2" />
                 </svg>
                 <div className="absolute top-[20%] left-[60%] ml-2 px-2 py-1 bg-[#0c0c0e] rounded text-white text-[11px] font-bold border border-white/10 z-10">{formatCurrency(84848.05)}</div>
                 <div className="absolute top-[40%] left-[60%] ml-2 px-2 py-1 bg-[#0c0c0e] rounded text-white text-[11px] font-bold border border-white/10 z-10">{formatCurrency(84848.05)}</div>
                 <div className="absolute top-0 bottom-0 left-[60%] border-l border-dashed border-white/10 z-0"></div>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity & Savings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
           <TransactionList />
        </div>

        <div className="lg:col-span-6 bg-[#141414] rounded-2xl p-6 border border-white/5">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-[16px] font-semibold text-white">Savings</h3>
             <button onClick={() => toast("Savings data refreshed", "info")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0c0c0e] text-[12px] text-[#888888] hover:text-white transition-colors">
               <span>This Week</span>
               <ChevronDown className="w-3 h-3" />
             </button>
           </div>

           <div className="mb-8">
             <div className="flex items-center gap-3">
               <h2 className="text-3xl font-bold text-white">{formatCurrency(93845.00)}</h2>
               <span className="flex items-center gap-1 text-[13px] font-medium px-2 py-1 rounded-md text-green-400 bg-green-400/10">
                 <ArrowUpRight className="w-3 h-3" />
                 16.8%
               </span>
             </div>
           </div>

           <div className="space-y-6">
             <div className="relative pl-4">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-light rounded-full"></div>
               <div className="flex justify-between items-end mb-3">
                 <div>
                   <h4 className="text-[15px] font-semibold text-white mb-1">Dream House</h4>
                   <p className="text-[12px] text-[#888888]">Target: {formatCurrency(75849.00)}</p>
                 </div>
                 <span className="text-[14px] font-bold text-white">{formatCurrency(84857.00)}</span>
               </div>
               <div className="w-full h-8 bg-white/5 rounded-full overflow-hidden flex items-center p-1">
                 <div className="h-full bg-brand-gradient rounded-full flex items-center px-3 justify-end text-[11px] font-bold text-white shrink-0" style={{ width: '72%' }}>
                   72%
                 </div>
               </div>
             </div>

             <div className="relative pl-4">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 rounded-full"></div>
               <div className="flex justify-between items-end mb-3">
                 <div>
                   <h4 className="text-[15px] font-semibold text-white mb-1">Education</h4>
                   <p className="text-[12px] text-[#888888]">Target: {formatCurrency(65445.00)}</p>
                 </div>
                 <span className="text-[14px] font-bold text-white">{formatCurrency(53949.00)}</span>
               </div>
               <div className="w-full h-8 bg-white/5 rounded-full overflow-hidden flex items-center p-1">
                 <div className="h-full bg-yellow-500 rounded-full flex items-center px-3 justify-end text-[11px] font-bold text-[#141414] shrink-0" style={{ width: '84%' }}>
                   84%
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Transfer Modal */}
      <Modal open={transferModalOpen} onClose={() => setTransferModalOpen(false)} title="Quick Transfer">
        <div className="space-y-5">
          <div>
            <label className="text-[14px] font-medium text-white mb-2 block">Sending to</label>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0c0c0e] border border-white/5">
              <img src={`https://i.pravatar.cc/150?u=${(selectedContact || 1)+10}`} className="w-10 h-10 rounded-full" alt="Contact" />
              <span className="text-[14px] text-white font-medium">{CONTACTS.find(c => c.id === selectedContact)?.name}</span>
            </div>
          </div>
          <div>
            <label className="text-[14px] font-medium text-white mb-2 block">Amount</label>
            <input type="number" value={transferAmount} onChange={e => setTransferAmount(e.target.value)} placeholder="0.00" className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[18px] text-white font-bold placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors" />
          </div>
          <button onClick={handleTransfer} disabled={!transferAmount} className={`w-full py-3 rounded-xl font-medium text-[14px] transition-all ${transferAmount ? "bg-brand-gradient text-white shadow-[0_4px_14px_0_rgba(252,96,118,0.2)] hover:-translate-y-0.5" : "bg-white/5 text-[#555] cursor-not-allowed"}`}>
            Send Money
          </button>
        </div>
      </Modal>
      
    </div>
  );
}
