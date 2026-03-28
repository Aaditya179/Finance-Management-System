"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <div className="feature-card glass-effect rounded-3xl p-6 transition-transform duration-500 hover:scale-[1.02]">
            <h3 className="text-[#888888] text-sm font-medium mb-2">Price Alerts</h3>
            <p className="text-white text-lg font-medium leading-snug mb-8">
              Be notified on SPY, AAPL, MSFT, and more.
            </p>
            <div className="flex justify-end mt-4">
              <button className="text-sm text-white flex items-center gap-1 hover:text-brand-light transition-colors group">
                Get notified now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          <div className="feature-card glass-effect rounded-3xl p-6 h-full transition-transform duration-500 hover:scale-[1.02] flex flex-col border border-[#222]">
            <h3 className="text-white font-medium mb-1">Amazon, inc (AMZN)</h3>
            <div className="text-2xl font-semibold text-white mb-1">$112,85.00</div>
            <div className="text-green-500 text-sm font-medium mb-6">0.35% (+1.50%) past 24 hours</div>
            
            {/* Mock Chart SVG */}
            <div className="h-32 w-full mt-auto relative">
              <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,25 Q10,20 20,30 T40,20 T60,25 T80,10 T100,15" fill="none" stroke="#22c55e" strokeWidth="1.5" />
              </svg>
              <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-green-500/10 to-transparent pointer-events-none" style={{ clipPath: "polygon(0 25%, 20% 30%, 40% 20%, 60% 25%, 80% 10%, 100% 15%, 100% 100%, 0 100%)" }}></div>
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div className="flex flex-col gap-6">
          <div className="feature-card glass-effect rounded-3xl p-8 h-80 flex flex-col items-center justify-center text-center transition-transform duration-500 hover:scale-[1.02] border border-[#222]">
            <h2 className="text-4xl lg:text-5xl font-medium text-[#888888] leading-tight mb-2">
              Buy, <br/> Sell, <br/> Trade.
            </h2>
            <h2 className="text-4xl lg:text-5xl font-medium text-gradient">
              Efficiently.
            </h2>
          </div>
          
          <div className="feature-card glass-effect rounded-3xl p-6 relative overflow-hidden transition-transform duration-500 hover:scale-[1.02] border border-[#222]">
            <h3 className="text-[#888888] text-sm font-medium mb-2">Buy Stocks</h3>
            <p className="text-white text-sm font-medium leading-snug w-2/3">
              Buy PFE, AMZN, and other stocks easily via bank transfer.
            </p>
            {/* Mock Phone/Coin element */}
            <div className="absolute right-[-20px] bottom-[-20px] w-28 h-32 bg-gradient-to-tr from-brand-dark to-[#ff9a44] rounded-2xl rotate-[-15deg] opacity-70 blur-[1px] shadow-[0_0_30px_rgba(252,96,118,0.3)] border border-white/20 flex items-center justify-center">
              <div className="w-16 h-28 bg-[#0a0a0a] rounded-xl border border-white/10 relative overflow-hidden">
                <div className="absolute inset-x-2 top-2 h-1 bg-white/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <div className="feature-card glass-effect rounded-3xl p-6 flex-1 transition-transform duration-500 hover:scale-[1.02] border border-[#222]">
            <h3 className="text-[#888888] text-sm font-medium mb-1">Current Balance</h3>
            <div className="text-3xl font-semibold text-white mb-6">$72,579.66</div>
            
            {/* Mock Area Chart */}
            <div className="h-40 w-full relative mb-8 border-l border-b border-[#333]">
              <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,45 Q15,40 30,35 T50,40 T75,20 T100,5" fill="none" stroke="#fc6076" strokeWidth="1.5" />
                <path d="M0,45 Q15,40 30,35 T50,40 T75,20 T100,5 L100,50 L0,50 Z" fill="url(#chartGradient)" />
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fc6076" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#fc6076" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <button className="w-full py-3 rounded-full text-white font-medium bg-[#333] hover:bg-brand-gradient hover:shadow-[0_0_20px_rgba(252,96,118,0.4)] transition-all duration-300">
              Deposit
            </button>
          </div>
          
          <div className="feature-card glass-effect rounded-3xl p-6 transition-transform duration-500 hover:scale-[1.02] border border-[#222]">
            <h3 className="text-white font-medium mb-4">Quick Buy</h3>
            <div className="flex justify-between items-center bg-[#1a1a1a] rounded-2xl p-4 mb-5 border border-[#333]">
              <div>
                <div className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">Buy</div>
                <div className="font-semibold text-white">$403</div>
              </div>
              <div className="text-xs text-[#555] text-center px-2">1.96 Shares</div>
              <div className="text-right">
                <div className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">ETF</div>
                <div className="font-semibold text-white">$IWM</div>
              </div>
            </div>
            <button className="w-full py-3 rounded-full text-white font-medium bg-brand-gradient shadow-[0_0_15px_rgba(252,96,118,0.2)] hover:shadow-[0_0_25px_rgba(252,96,118,0.4)] transition-all duration-300">
              Buy
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
