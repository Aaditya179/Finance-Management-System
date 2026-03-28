"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade up children of container with stagger
      gsap.from(".hero-element", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.2
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative pt-40 pb-20 md:pt-52 md:pb-32 flex flex-col items-center justify-center text-center overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-hero-gradient pointer-events-none rounded-full blur-[80px]" />
      
      {/* Decorative Grid or Waves could go here, using a pure CSS or simple SVG approach for the wireframe wave shown in image */}
      
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <h1 className="hero-element text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-[#888888] mb-2 leading-tight">
          Master the Market. <br/>
          <span className="text-gradient">Maximize Growth.</span>
        </h1>
        
        <p className="hero-element mt-6 text-lg md:text-xl text-[#888888] max-w-2xl mx-auto leading-relaxed">
          Aggregation of fragmented financial data. Trust + verification. 
          Decision-making intelligence for institutions.
        </p>

        <div className="hero-element mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-3.5 rounded-full text-white font-medium border border-cardBorder bg-card/50 hover:bg-card transition-all duration-300 hover:scale-[1.03] active:scale-95 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
            Open an Account
          </button>
          <button className="w-full sm:w-auto px-8 py-3.5 rounded-full text-white font-medium bg-brand-gradient shadow-[0_0_20px_rgba(252,96,118,0.3)] hover:shadow-[0_0_30px_rgba(252,96,118,0.5)] transition-all duration-300 hover:scale-[1.03] active:scale-95 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
