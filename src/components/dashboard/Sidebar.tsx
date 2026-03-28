"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Wallet, 
  ReceiptText, 
  CreditCard, 
  PiggyBank, 
  BarChart3, 
  Calculator, 
  FileText, 
  MessageSquare,
  Settings,
  MessageCircleQuestion,
  HelpCircle,
  Moon
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Wallet", href: "/dashboard/wallet", icon: Wallet },
  { name: "Transaction", href: "/dashboard/transactions", icon: ReceiptText },
  { name: "Loans", href: "/dashboard/loans", icon: CreditCard },
  { name: "Investment", href: "/dashboard/investment", icon: PiggyBank },
  { name: "Statistic", href: "/dashboard/statistic", icon: BarChart3 },
  { name: "Budgeting", href: "/dashboard/budgeting", icon: Calculator },
  { name: "Report", href: "/dashboard/report", icon: FileText },
  { name: "Message", href: "/dashboard/messages", icon: MessageSquare, badge: 4 },
];

const SETTINGS_ITEMS = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Feedback", href: "/dashboard/feedback", icon: MessageCircleQuestion },
  { name: "Help & Center", href: "/dashboard/help", icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex flex-col bg-[#0c0c0e] border-r border-white/5 h-screen relative z-20 shrink-0">
      {/* Logo */}
      <div className="p-6 md:p-8 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-brand-gradient p-[1px]">
            <div className="absolute inset-0 rounded-lg bg-card/80 backdrop-blur-sm"></div>
            <span className="relative z-10 font-bold text-lg text-white">N</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">Nexora</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-6 px-4 pb-6">
        {/* Main Menu */}
        <div>
          <p className="text-[11px] uppercase tracking-wider font-medium text-[#666] mb-3 px-4">Menu</p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                    ? "bg-[#141414] text-white font-medium border border-white/5" 
                    : "text-[#888888] hover:text-white hover:bg-[#141414]/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-brand-light" : "text-[#555] group-hover:text-white"}`} />
                    <span className="text-[14px]">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-brand-dark/20 text-brand-light text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-dark/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Help & Settings Menu */}
        <div>
          <p className="text-[11px] uppercase tracking-wider font-medium text-[#666] mb-3 px-4">Help & Settings</p>
          <nav className="space-y-1">
            {SETTINGS_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                    ? "bg-[#141414] text-white font-medium border border-white/5" 
                    : "text-[#888888] hover:text-white hover:bg-[#141414]/50 border border-transparent"
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-brand-light" : "text-[#555] group-hover:text-white"}`} />
                  <span className="text-[14px]">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Dark Mode Toggle */}
      <div className="shrink-0 p-4 border-t border-white/5">
        <div className="flex items-center justify-between px-4 py-3 text-[#888888]">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-[#555]" />
            <span className="text-[14px]">Dark Mode</span>
          </div>
          {/* Mock toggle for dark mode (since it's a dark theme by default) */}
          <div className="w-9 h-5 bg-brand-light/20 rounded-full relative cursor-pointer border border-brand-light/30">
            <div className="absolute right-1 top-0.5 w-4 h-4 bg-brand-light rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
