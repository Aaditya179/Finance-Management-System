export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050505] py-12 relative z-10 mt-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-gradient p-[1px]">
            <div className="w-full h-full bg-card/80 rounded-md"></div>
          </div>
          <span className="text-white font-bold tracking-tight">Nexora</span>
        </div>
        
        <p className="text-[#555] text-sm">
          © {new Date().getFullYear()} Nexora. All rights reserved.
        </p>

        <div className="flex gap-4">
          <a href="#" className="text-[#888888] hover:text-white transition-colors text-sm font-medium hover:-translate-y-[1px] transform inline-block">Privacy Policy</a>
          <a href="#" className="text-[#888888] hover:text-white transition-colors text-sm font-medium hover:-translate-y-[1px] transform inline-block">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
