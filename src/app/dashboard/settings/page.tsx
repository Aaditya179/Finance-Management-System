"use client";

import React from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { 
  Globe, 
  Calendar, 
  DollarSign, 
  Check, 
  Info,
  ArrowRight
} from "lucide-react";

export default function SettingsPage() {
  const { currency, setCurrency, dateFormat, setDateFormat, exchangeRate } = useSettings();

  return (
    <div className="flex flex-col gap-8 w-full max-w-[800px] mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Settings</h1>
        <p className="text-[#888888] text-[15px]">Manage your account preferences and application settings.</p>
      </div>

      <div className="space-y-6">
        {/* Localization Section */}
        <section className="bg-[#141414] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-brand-dark/10 flex items-center justify-center text-brand-light">
               <Globe className="w-5 h-5" />
             </div>
             <div>
               <h3 className="text-[16px] font-semibold text-white">Localization</h3>
               <p className="text-[13px] text-[#666]">Choose how numbers and dates are displayed.</p>
             </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Currency Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-medium text-white">Base Currency</span>
                <span className="text-[13px] text-[#888888]">All asset prices will be converted to this currency using a rate of 1 USD = {exchangeRate} INR.</span>
              </div>
              
              <div className="flex p-1 bg-[#0c0c0e] rounded-xl border border-white/5 w-fit">
                <button 
                  onClick={() => setCurrency("USD")}
                  className={`px-6 py-2 rounded-lg text-[13px] font-bold transition-all ${
                    currency === "USD" 
                    ? "bg-brand-gradient text-white shadow-lg" 
                    : "text-[#555] hover:text-[#888] hover:bg-white/5"
                  }`}
                >
                  USD ($)
                </button>
                <button 
                  onClick={() => setCurrency("INR")}
                  className={`px-6 py-2 rounded-lg text-[13px] font-bold transition-all ${
                    currency === "INR" 
                    ? "bg-brand-gradient text-white shadow-lg" 
                    : "text-[#555] hover:text-[#888] hover:bg-white/5"
                  }`}
                >
                  INR (₹)
                </button>
              </div>
            </div>

            {/* Date Format Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-medium text-white">Date Format</span>
                <span className="text-[13px] text-[#888888]">Choose your preferred display format for dates.</span>
              </div>
              
              <div className="flex p-1 bg-[#0c0c0e] rounded-xl border border-white/5 w-fit">
                <button 
                  onClick={() => setDateFormat("MM/DD/YYYY")}
                  className={`px-5 py-2 rounded-lg text-[13px] font-bold transition-all ${
                    dateFormat === "MM/DD/YYYY" 
                    ? "bg-brand-gradient text-white shadow-lg" 
                    : "text-[#555] hover:text-[#888] hover:bg-white/5"
                  }`}
                >
                  MM/DD/YYYY
                </button>
                <button 
                  onClick={() => setDateFormat("DD-MM-YYYY")}
                  className={`px-5 py-2 rounded-lg text-[13px] font-bold transition-all ${
                    dateFormat === "DD-MM-YYYY" 
                    ? "bg-brand-gradient text-white shadow-lg" 
                    : "text-[#555] hover:text-[#888] hover:bg-white/5"
                  }`}
                >
                  DD MM YYYY
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Info Card */}
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 flex gap-4">
           <Info className="w-6 h-6 text-blue-400 shrink-0" />
           <div className="space-y-1">
             <p className="text-[14px] font-medium text-white">Multi-currency Support</p>
             <p className="text-[13px] text-[#888888] leading-relaxed">Nexora currently stores all financial data in USD and converts to your local currency in real-time. Changing settings here will reflect immediately across all dashboards including your Investment and Statistics view.</p>
           </div>
        </div>

        {/* Back to Dashboard Link */}
        <button 
          onClick={() => window.location.href = "/dashboard"}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-white font-medium hover:bg-white/10 transition-all group"
        >
          Back to Dashboard
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
