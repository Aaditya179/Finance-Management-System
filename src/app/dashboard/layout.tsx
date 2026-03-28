import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070707] text-[#ededed] font-sans selection:bg-brand-dark/30 selection:text-white flex overflow-hidden">
      {/* Sidebar - fixed on left */}
      <Sidebar />
      
      {/* Main Content Area - scrollable */}
      <main className="flex-1 h-screen overflow-y-auto w-full relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(252,96,118,0.05)_0%,_transparent_50%)] pointer-events-none z-0"></div>
        <div className="relative z-10 w-full h-full p-4 sm:p-6 lg:p-8 xl:p-10 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
