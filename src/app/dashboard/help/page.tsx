"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/contexts/ToastContext";
import {
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Shield,
  CreditCard,
  TrendingUp,
  Mail,
  MessageCircle,
  Phone,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  Zap,
  FileText,
} from "lucide-react";

const QUICK_LINKS = [
  { title: "Getting Started", desc: "Learn the basics of using Nexora", icon: BookOpen, color: "from-blue-500 to-indigo-600", iconBg: "bg-blue-500/15 text-blue-400", href: "/dashboard" },
  { title: "Account Security", desc: "Protect your account & enable 2FA", icon: Shield, color: "from-green-500 to-emerald-600", iconBg: "bg-green-500/15 text-green-400", href: "/dashboard/settings" },
  { title: "Payments & Cards", desc: "Manage cards, transfers and bills", icon: CreditCard, color: "from-purple-500 to-violet-600", iconBg: "bg-purple-500/15 text-purple-400", href: "/dashboard/wallet" },
  { title: "Investments", desc: "Stock trading, crypto & portfolios", icon: TrendingUp, color: "from-amber-500 to-orange-600", iconBg: "bg-amber-500/15 text-amber-400", href: "/dashboard/investment" },
];

const FAQ_DATA = [
  {
    question: "How do I add a new investment to my portfolio?",
    answer: "Navigate to the Investment page from the sidebar. Use the 'Add Asset' form at the top — simply type a stock symbol (e.g., AAPL) and the live price will auto-fill. Enter the quantity and the total amount is calculated automatically. Click 'Add Investment' to save it to your portfolio.",
    category: "Investments",
  },
  {
    question: "Can I change my display currency?",
    answer: "Yes! Go to Settings from the sidebar. Under 'Localization', you can toggle between USD ($) and INR (₹). All values across the platform — including investments, budgets, and transaction — will instantly convert using the current exchange rate.",
    category: "General",
  },
  {
    question: "How does live price tracking work?",
    answer: "Nexora fetches real-time quotes from Finnhub (for stocks) and CoinGecko (for crypto) every 15 seconds. Your portfolio value, profit/loss percentages, and statistics charts all update automatically without needing to refresh the page.",
    category: "Investments",
  },
  {
    question: "What date formats are supported?",
    answer: "Nexora supports two date formats: MM/DD/YYYY (US standard) and DD-MM-YYYY (International). You can change this anytime in Settings — the change applies immediately across all pages.",
    category: "General",
  },
  {
    question: "How do I set a monthly budget?",
    answer: "Visit the Budgeting page from the sidebar. You'll see pre-defined categories like Groceries, Shopping, Entertainment, etc. Each has a budget limit and tracks your spending automatically. Categories that exceed their budget will be flagged with alerts.",
    category: "Budgeting",
  },
  {
    question: "Is my financial data secure?",
    answer: "All data is stored in Supabase's PostgreSQL database with Row-Level Security (RLS) enabled. Each user can only access their own data. Authentication is handled via Supabase Auth with support for email/password and Google OAuth. Sessions use secure JWT tokens.",
    category: "Security",
  },
  {
    question: "How is the statistics chart data sourced?",
    answer: "The Statistics page pulls historical price data using Finnhub's candle API for stocks and CoinGecko's market_chart/range API for crypto. The chart resolution adapts automatically based on the date range — from 5-minute candles for same-day purchases to daily candles for longer periods.",
    category: "Investments",
  },
];

export default function HelpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleContact = (label: string, detail: string) => {
    if (label === "Email Us") {
      navigator.clipboard.writeText(detail);
      toast("Email address copied to clipboard");
    } else if (label === "Live Chat") {
      toast("Live chat session started — a support agent will be with you shortly", "info");
    } else if (label === "Call Us") {
      navigator.clipboard.writeText(detail);
      toast("Phone number copied to clipboard");
    }
  };

  const filteredFaqs = FAQ_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1000px] mx-auto pb-10">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-4 shadow-[0_4px_20px_0_rgba(252,96,118,0.3)]">
          <HelpCircle className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Help & Support</h1>
        <p className="text-[#888888] text-[15px] max-w-md mx-auto">Find answers, explore guides, and get in touch with our team</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555]" />
        <input
          type="text"
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#141414] border border-white/5 text-[15px] text-white placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 focus:shadow-[0_0_20px_rgba(252,96,118,0.1)] transition-all"
        />
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_LINKS.map((link) => (
          <div
            key={link.title}
            onClick={() => router.push(link.href)}
            className="bg-[#141414] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300 group cursor-pointer hover:-translate-y-1"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              <link.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-[14px] font-semibold text-white mb-1 group-hover:text-brand-light transition-colors">{link.title}</h3>
            <p className="text-[12px] text-[#666] leading-relaxed">{link.desc}</p>
            <div className="flex items-center gap-1 mt-3 text-[12px] text-[#555] group-hover:text-brand-light transition-colors">
              <span>Learn more</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-[#141414] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-white">Frequently Asked Questions</h3>
            <p className="text-[13px] text-[#666]">{filteredFaqs.length} {filteredFaqs.length === 1 ? "result" : "results"} found</p>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="group">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5 text-[#888]" />
                  </div>
                  <span className="text-[14px] font-medium text-white group-hover:text-brand-light transition-colors pr-4">{faq.question}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-[#888] border border-white/5">{faq.category}</span>
                  <ChevronDown className={`w-4 h-4 text-[#555] transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                </div>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pl-16">
                  <p className="text-[13px] text-[#888] leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
          {filteredFaqs.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-[#555] text-[14px]">No matching questions found. Try a different search term.</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-[#141414] rounded-2xl p-6 border border-white/5">
        <h3 className="text-[16px] font-semibold text-white mb-2">Still need help?</h3>
        <p className="text-[13px] text-[#888] mb-6">Our support team is available 24/7 to assist you</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Mail, label: "Email Us", detail: "support@nexora.app", color: "bg-blue-500/15 text-blue-400", hoverBorder: "hover:border-blue-500/20" },
            { icon: MessageCircle, label: "Live Chat", detail: "Average wait: 2 min", color: "bg-green-500/15 text-green-400", hoverBorder: "hover:border-green-500/20" },
            { icon: Phone, label: "Call Us", detail: "+1 (800) 123-4567", color: "bg-purple-500/15 text-purple-400", hoverBorder: "hover:border-purple-500/20" },
          ].map((contact) => (
            <button
              key={contact.label}
              onClick={() => handleContact(contact.label, contact.detail)}
              className={`flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 ${contact.hoverBorder} hover:bg-white/[0.04] transition-all group cursor-pointer`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${contact.color} group-hover:scale-110 transition-transform`}>
                <contact.icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[14px] font-medium text-white">{contact.label}</p>
                <p className="text-[12px] text-[#666]">{contact.detail}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
