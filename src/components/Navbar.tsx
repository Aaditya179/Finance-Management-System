"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState<any>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Initial entrance animation
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -15,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.1
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-background/70 backdrop-blur-lg border-b border-cardBorder py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-brand-gradient p-[1px]">
            <div className="absolute inset-0 rounded-lg bg-card/80 backdrop-blur-sm group-hover:bg-transparent transition-colors duration-300"></div>
            <span className="relative z-10 font-bold text-lg text-white group-hover:text-black transition-colors duration-300">N</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Nexora</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Pricing", "How it Works", "About"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-sm font-medium text-[#888888] hover:text-white transition-colors duration-200 hover:-translate-y-[1px] transform inline-block"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-6">
          <Link href={session ? "/dashboard" : "/login"} className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-gradient rounded-full shadow-[0_0_15px_rgba(252,96,118,0.2)] hover:shadow-[0_0_25px_rgba(252,96,118,0.4)] transition-all duration-300 hover:scale-[1.03] active:scale-95 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] inline-block">
            {session ? "Dashboard" : "Get Started"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
