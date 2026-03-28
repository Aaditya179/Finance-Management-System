import { ChevronDown } from "lucide-react";

interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
  type: 'incoming' | 'outgoing';
  cardNumber: string;
  logoUrl?: string;
  color?: string;
  initial?: string;
}

export default function TransactionList() {
  const transactions: Transaction[] = [
    { id: '1', name: "PayPal", date: "16 Jul 2024", amount: 848.84, type: 'incoming', cardNumber: "****9484", initial: "P", color: "bg-blue-500/20 text-blue-400" },
    { id: '2', name: "Wise", date: "15 Jul 2024", amount: -665.56, type: 'outgoing', cardNumber: "****9485", initial: "W", color: "bg-cyan-500/20 text-cyan-400" },
    { id: '3', name: "Atlassian", date: "14 Jul 2024", amount: 546.84, type: 'incoming', cardNumber: "****9485", initial: "A", color: "bg-blue-600/20 text-blue-500" },
    { id: '4', name: "Dropbox", date: "13 Jul 2024", amount: -738.59, type: 'outgoing', cardNumber: "****9486", initial: "D", color: "bg-sky-500/20 text-sky-400" },
  ];

  return (
    <div className="bg-[#141414] rounded-2xl p-6 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-semibold text-white">Recently Activity</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0c0c0e] text-[12px] text-[#888888] hover:text-white transition-colors">
          <span>This Week</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-[2fr_1.5fr_1fr] text-[13px] text-[#666] font-medium mb-4 px-2">
        <div className="flex items-center gap-1">Name <ChevronDown className="w-3 h-3" /></div>
        <div className="flex items-center gap-1">Date <ChevronDown className="w-3 h-3" /></div>
        <div className="text-right">Amount</div>
      </div>

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="grid grid-cols-[2fr_1.5fr_1fr] items-center p-2 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[16px] ${tx.color}`}>
                {tx.initial}
              </div>
              <div>
                <p className="text-[14px] font-medium text-white group-hover:text-brand-light transition-colors">{tx.name}</p>
                <p className="text-[12px] text-[#555]">{tx.cardNumber}</p>
              </div>
            </div>
            
            <div className="text-[13px] font-medium text-[#888888]">
              {tx.date}
            </div>
            
            <div className={`text-right font-semibold text-[14px] ${tx.type === 'incoming' ? 'text-blue-400' : 'text-red-400'}`}>
              {tx.type === 'incoming' ? '+' : ''}{tx.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
