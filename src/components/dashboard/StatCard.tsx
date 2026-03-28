import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Calendar, ArrowRight, ArrowDownLeft, Copy, Plus } from "lucide-react";

interface StatCardProps {
  title: string;
  amount: string;
  trend?: string;
  trendUp?: boolean;
  dateStr?: string;
  type?: "balance" | "stat";
  subtitle?: string;
  cardNumber?: string;
}

export default function StatCard({
  title,
  amount,
  trend,
  trendUp,
  dateStr,
  type = "stat",
  subtitle,
  cardNumber
}: StatCardProps) {
  
  if (type === "balance") {
    return (
      <div className="bg-[#141414] rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-dark/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-brand-dark/20 transition-all duration-500"></div>
        
        <div className="flex justify-between items-start mb-6 align-middle relative z-10">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] text-white font-medium">{title}</h3>
            <div className="w-4 h-4 rounded-full border border-[#555] flex items-center justify-center text-[10px] text-[#555]">i</div>
          </div>
          {dateStr && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0c0c0e] text-[12px] text-[#888888]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateStr}</span>
            </div>
          )}
        </div>

        <div className="flex items-end gap-4 mb-2 relative z-10">
          <h2 className="text-4xl font-semibold text-white tracking-tight">{amount}</h2>
          {trend && (
            <span className={`flex items-center gap-1 text-[13px] font-medium px-2 py-1 rounded-md mb-1.5 ${trendUp ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
              {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </span>
          )}
        </div>

        {cardNumber && (
          <div className="flex items-center gap-3 text-[14px] text-[#888888] font-medium mb-8 relative z-10">
             <span>{cardNumber}</span>
             <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-white/5 rounded-md transition-colors border border-white/5 text-[12px]">
               <Copy className="w-3 h-3" />
               Copy
             </button>
          </div>
        )}

        <div className="flex items-center gap-3 relative z-10 mt-auto pt-2">
          <button className="flex-1 bg-brand-gradient hover:-translate-y-0.5 shadow-[0_4px_14px_0_rgba(252,96,118,0.2)] transition-all duration-300 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-[14px]">
            <ArrowUpRight className="w-4 h-4" />
            Transfer
          </button>
          <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-[14px]">
            <ArrowDownLeft className="w-4 h-4" />
            Received
          </button>
          <button className="w-12 h-12 shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors rounded-xl flex items-center justify-center">
             <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] rounded-2xl p-6 border border-white/5 relative overflow-hidden group h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] text-white font-medium">{title}</h3>
          <div className="w-4 h-4 rounded-full border border-[#555] flex items-center justify-center text-[10px] text-[#555]">i</div>
        </div>
        {dateStr && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0c0c0e] text-[12px] text-[#888888]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateStr}</span>
          </div>
        )}
      </div>

      <div className="mt-auto">
        <h2 className="text-3xl font-semibold text-white tracking-tight mb-4">{amount}</h2>
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
           {trend && (
             <span className={`flex items-center gap-1 font-medium px-2 py-1 rounded-md ${trendUp ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
               {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
               {trend}
             </span>
           )}
           {subtitle && <span className="text-[#888888]">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}
