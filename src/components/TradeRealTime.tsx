"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function TradeRealTime() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".trade-text", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
      });

      gsap.fromTo(".watchlist-card", 
        { x: -50, y: 20, opacity: 0, rotationZ: -5 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
          x: 0,
          y: 0,
          opacity: 1,
          rotationZ: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.1,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const stocks = [
    { symbol: "MSFT", name: "Microsoft Corp.", price: "$213.10", change: "-2.5%", isUp: false },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: "$213.10", change: "+1.1%", isUp: true },
    { symbol: "SPOT", name: "Spotify Tech.", price: "$213.10", change: "-2.5%", isUp: false },
  ];

  return (
    <section ref={containerRef} className="py-24 relative z-10 overflow-hidden mb-20">
      <div className="max-w-5xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-16 md:gap-24">
        
        {/* Mock Watchlist Component */}
        <div className="md:w-1/2 relative w-full aspect-video md:aspect-[4/3] flex items-center justify-center">
          {/* Pink decorative background */}
          <div className="watchlist-card absolute w-[85%] h-[80%] bg-brand-light rounded-[2rem] -rotate-3 translate-x-4 translate-y-4 shadow-[0_0_40px_rgba(252,96,118,0.2)]"></div>
          
          {/* Main Card */}
          <div className="watchlist-card relative w-[90%] bg-[#1c1c1e] rounded-[2rem] p-6 shadow-2xl border border-white/5">
            <div className="flex justify-between items-center mb-6 px-2 text-white">
              <h3 className="font-semibold text-lg text-white">Watchlist</h3>
              <ChevronRight className="w-5 h-5 cursor-pointer hover:text-brand-light transition-colors" />
            </div>
            
            <div className="flex flex-col gap-5">
              {stocks.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-background border border-white/5 flex items-center justify-center font-bold text-xs text-white shadow-xl">
                      {stock.symbol[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-white tracking-wide text-sm">{stock.symbol}</div>
                      <div className="text-[11px] text-[#888888]">{stock.name}</div>
                    </div>
                  </div>

                  {/* Mock sparkline */}
                  <div className="w-16 h-8 relative opacity-80 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                      <path 
                        d={stock.isUp ? "M0,25 Q20,15 40,20 T80,10 T100,5" : "M0,5 Q20,15 40,10 T80,20 T100,25"} 
                        fill="none" stroke={stock.isUp ? "#22c55e" : "#fc6076"} strokeWidth="2.5" 
                      />
                      <path 
                        d={stock.isUp ? "M0,25 Q20,15 40,20 T80,10 T100,5 L100,30 L0,30 Z" : "M0,5 Q20,15 40,10 T80,20 T100,25 L100,30 L0,30 Z"} 
                        fill={`url(#${stock.isUp ? 'up' : 'down'}Grad)`} 
                      />
                      <defs>
                        <linearGradient id="upGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                        </linearGradient>
                        <linearGradient id="downGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fc6076" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#fc6076" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-sm text-white">{stock.price}</div>
                    <div className={`text-[10px] font-bold tracking-wider ${stock.isUp ? 'text-green-500' : 'text-[#fc6076]'}`}>
                      {stock.isUp ? '↑' : '↓'} {stock.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="md:w-1/2 flex flex-col gap-6 trade-text px-4 md:px-0 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">
            <span className="text-[#888888]">Trade in </span>
            <span className="text-white">Real Time</span>
          </h2>
          <p className="text-[#888888] text-base md:text-lg leading-relaxed md:w-[85%] mx-auto md:mx-0">
            No more waiting. Orders are immediately executed and the price of your securities is updated every 3 seconds.
          </p>
        </div>
        
      </div>
    </section>
  );
}
