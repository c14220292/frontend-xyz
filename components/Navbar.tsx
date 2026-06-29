"use client";
import { useAppState } from "@/lib/store";

export default function Navbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { role, setRole, sidebarOpen, setSidebarOpen } = useAppState();

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-4 sm:px-6 gap-4">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-base sm:text-lg font-semibold text-slate-900 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 truncate hidden sm:block">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setRole("admin")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              role === "admin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setRole("kasir")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              role === "kasir" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Kasir
          </button>
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-semibold">
            {role === "admin" ? "AD" : "KS"}
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-xs font-medium text-slate-900">
              {role === "admin" ? "Admin Gudang" : "Kasir"}
            </div>
            <div className="text-[10px] text-slate-500">Demo Mode</div>
          </div>
        </div>
      </div>
    </header>
  );
}
