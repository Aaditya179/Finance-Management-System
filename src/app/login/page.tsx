"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
  
  // Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".login-element", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.1
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    if (result.error) {
      setMessage({ text: result.error.message, type: 'error' });
      setLoading(false);
    } else {
      if (isSignUp) {
        setMessage({ text: "Check your email for the confirmation link!", type: 'success' });
        setLoading(false);
      } else {
        // Redirect home on success using Next.js router
        router.push("/dashboard");
      }
    }
  };

  const handleGoogleAuth = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      }
    });
  };

  return (
    <main className="min-h-[100dvh] relative flex items-center justify-center pt-20 pb-12 px-6 sm:px-8 selection:bg-brand-dark/30 selection:text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(252,96,118,0.1)_0%,_transparent_60%)] pointer-events-none z-0" />

      <div ref={containerRef} className="relative z-10 w-full max-w-md isolate">
        
        <Link href="/" className="login-element inline-flex items-center gap-2 text-[#888888] hover:text-white transition-colors mb-8 group text-sm font-medium">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <div className="login-element bg-[#0c0c0e] rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-white/5 relative overflow-hidden">
          
          <div className="mb-8 text-center">
            <div className="relative mx-auto flex items-center justify-center w-12 h-12 rounded-xl bg-brand-gradient p-[1px] mb-5">
              <div className="absolute inset-0 rounded-xl bg-card/80 backdrop-blur-sm"></div>
              <span className="relative z-10 font-bold text-2xl text-white">N</span>
            </div>
            <h1 className="text-2xl font-medium text-white mb-2 tracking-tight">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h1>
            <p className="text-[#888888] text-sm leading-relaxed">
              {isSignUp ? "Enter your details to get started." : "Enter your details to access your account."}
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-3 rounded-xl text-sm font-medium text-center ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'} border`}>
              {message.text}
            </div>
          )}

          <div className="space-y-4 mb-7">
            <button 
              type="button"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 hover:border-white/10 text-[#ededed] text-sm font-medium transition-all duration-300 active:scale-[0.98]">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative mb-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cardBorder"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-medium">
              <span className="bg-[#0c0c0e] px-4 text-[#666]">Or email</span>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-[13px] text-[#888888] font-medium ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] group-focus-within:text-brand-light transition-colors" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#141414] border border-white/5 focus:border-brand-light/40 text-white rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(252,96,118,0.1)] text-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[13px] text-[#888888] font-medium ml-1">Email address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] group-focus-within:text-brand-light transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#141414] border border-white/5 focus:border-brand-light/40 text-white rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(252,96,118,0.1)] text-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[13px] text-[#888888] font-medium ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] group-focus-within:text-brand-light transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#141414] border border-white/5 focus:border-brand-light/40 text-white rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(252,96,118,0.1)] text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 mb-8 text-xs">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-[18px] h-[18px] rounded-md border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                  <input type="checkbox" className="opacity-0 absolute" />
                </div>
                <span className="text-[#888888] group-hover:text-white transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-brand-light hover:text-brand-dark transition-colors font-medium">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-semibold text-sm bg-brand-gradient shadow-[0_0_15px_rgba(252,96,118,0.2)] hover:shadow-[0_0_30px_rgba(252,96,118,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Sign In")}
            </button>
          </form>

          <p className="mt-8 text-center text-[13px] text-[#888888]">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button 
              type="button" 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage(null);
              }} 
              className="text-white hover:text-brand-light transition-colors font-semibold cursor-pointer"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>

        </div>
      </div>
    </main>
  );
}
