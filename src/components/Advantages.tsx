"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Advantages() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".adv-element", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
      });
      
      gsap.from(".partner-logo", {
        scrollTrigger: {
          trigger: ".partners-container",
          start: "top 85%",
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.05,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const advantages = [
    { title: "Smooth Start", desc: "We will help you set up your brokerage account in 5 minutes or less." },
    { title: "24/7 Support", desc: "Our support team is always available to answer questions or resolve any issues." },
    { title: "Low Commissions", desc: "We give you the best rate we can for any kind of transactions. No extra fees." },
    { title: "Invest Any Amount", desc: "Start investing with as little as $1." }
  ];

  return (
    <section ref={containerRef} className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Advantages top part */}
        <div className="flex flex-col md:flex-row gap-16 mb-40">
          <div className="md:w-1/3 adv-element">
            <h2 className="text-4xl md:text-5xl font-medium text-[#888888] mb-6 tracking-tight">
              Advantages
            </h2>
            <p className="text-white text-lg leading-relaxed">
              We listen to our customers and work with them to improve the user experience of our platform.
            </p>
          </div>
          
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16 adv-element border-l border-t border-cardBorder p-8 rounded-tl-[3rem]">
            {advantages.map((adv, idx) => (
              <div key={idx} className="adv-item transition-transform hover:-translate-y-1 duration-300">
                <h3 className="text-brand-light font-medium text-lg mb-3">{adv.title}</h3>
                <p className="text-[#888888] leading-relaxed text-sm md:text-base">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div className="partners-container text-center max-w-4xl mx-auto adv-element">
          <h2 className="text-4xl md:text-5xl font-medium text-[#888888] mb-6 tracking-tight">
            Our <span className="text-white">Partners</span>
          </h2>
          <p className="text-white text-base md:text-lg mb-16 max-w-xl mx-auto">
            The largest banks, funds and exchanges from all over the world cooperate with us.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 items-center">
            {["NYSE", "Citi", "CapitalOne", "BOA", "VISA", "Mastercard"].map((partner) => (
              <div key={partner} className="partner-logo w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#111] border border-white/5 shadow-2xl flex items-center justify-center text-[#ff9a44] font-bold text-xs md:text-sm hover:scale-110 transition-transform duration-300 hover:shadow-[0_0_20px_rgba(255,154,68,0.2)] cursor-pointer">
                {partner}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
