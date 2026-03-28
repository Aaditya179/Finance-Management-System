"use client";

import { useState } from "react";
import { ChevronDown, Bot, Target } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export default function PortfolioGenerator() {
  const [budget, setBudget] = useState("");
  const [riskLevel, setRiskLevel] = useState("Moderate");
  const [allocation, setAllocation] = useState<any[] | null>(null);
  const [aiExplanation, setAiExplanation] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePortfolio = () => {
    if (!budget || isNaN(Number(budget))) return;
    setIsGenerating(true);
    
    setTimeout(() => {
      let result;
      let explanation = "";
      
      if (riskLevel === "Conservative") {
        result = [
          { name: "S&P 500 ETF (VOO)", value: 60, color: "#3b82f6" }, 
          { name: "Bonds (BND)", value: 30, color: "#10b981" },
          { name: "Gold (GLD)", value: 10, color: "#f59e0b" },
        ];
        explanation = "A conservative portfolio prioritizes capital preservation. 60% is allocated to broad market index funds for steady growth, while 30% in bonds minimizes volatility. The 10% in gold acts as an inflation hedge.";
      } else if (riskLevel === "Moderate") {
        result = [
          { name: "S&P 500 ETF (VOO)", value: 50, color: "#b91c1c" }, 
          { name: "Tech Stocks (QQQ)", value: 20, color: "#3b82f6" },
          { name: "International (VXUS)", value: 15, color: "#10b981" },
          { name: "Crypto (BTC/ETH)", value: 15, color: "#8b5cf6" },
        ];
        explanation = "A moderate allocation balances growth and risk. 50% in equities (US and International) drives steady growth. The 20% in tech and 15% in crypto provides high upside potential without destroying the portfolio if they underperform.";
      } else {
        result = [
          { name: "Tech Stocks (QQQ)", value: 40, color: "#3b82f6" }, 
          { name: "Crypto (BTC/ETH)", value: 30, color: "#8b5cf6" },
          { name: "Emerging Markets", value: 20, color: "#f59e0b" },
          { name: "Small Cap (VB)", value: 10, color: "#10b981" },
        ];
        explanation = "Aggressive portfolios aim for maximum returns. We combined heavy weightings in high-beta assets like Tech and Crypto (70%), supplementing with emerging markets and small caps to capture early-stage growth across global sectors.";
      }
      
      setAllocation(result);
      setAiExplanation(explanation);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Portfolio Generator</h1>
          <p className="text-[#888888] text-[15px]">Build an AI-optimized investment strategy based on your risk tolerance.</p>
        </div>
      </div>

      <div className="bg-[#141414] rounded-2xl p-6 border border-white/5 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[18px] font-semibold text-white">Smart Portfolio Builder</h3>
            <p className="text-[14px] text-[#888888]">AI-powered asset allocation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div>
              <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#666] mb-2">Investment Budget ($)</label>
              <input 
                type="number" 
                placeholder="e.g. 10000" 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-dark transition-colors"
                style={{colorScheme: 'dark'}}
              />
            </div>
            
            <div>
              <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#666] mb-2">Risk Tolerance</label>
              <div className="relative">
                <select 
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value)}
                  className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-brand-dark transition-colors cursor-pointer"
                >
                  <option value="Conservative">Conservative</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Aggressive">Aggressive</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888] pointer-events-none" />
              </div>
            </div>

            <button 
              onClick={generatePortfolio}
              disabled={isGenerating || !budget}
              className="mt-2 w-full py-3.5 rounded-xl bg-brand-gradient shadow-[0_4px_14px_0_rgba(252,96,118,0.3)] text-white font-semibold flex justify-center items-center gap-2 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 text-[15px]"
            >
              {isGenerating ? "Analyzing Markets..." : <><Target className="w-5 h-5" /> Generate Portfolio</>}
            </button>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-8 bg-[#0c0c0e] rounded-xl p-5 border border-white/5 flex flex-col md:flex-row gap-6 items-center min-h-[250px] justify-center text-center">
            {!allocation ? (
              <div className="text-[#555] flex flex-col items-center gap-3">
                <Bot className="w-12 h-12 opacity-50" />
                <p>Enter your budget and risk level to generate an AI-optimized portfolio allocation.</p>
              </div>
            ) : (
              <>
                <div className="w-full md:w-[45%] h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {allocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#141414', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-[55%] flex flex-col text-left justify-center pb-4 md:pb-0">
                  <h4 className="text-[15px] font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-light"></span> AI Explanation
                  </h4>
                  <p className="text-[13px] text-[#888888] leading-relaxed mb-5">
                    {aiExplanation}
                  </p>
                  <div className="space-y-2.5">
                    {allocation.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[13px]">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                          <span className="text-[#bbb]">{item.name}</span>
                        </div>
                        <span className="text-white font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
