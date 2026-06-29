"use client";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAppState } from "@/lib/store";

export default function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const { sidebarOpen } = useAppState();
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}>
        <Navbar title={title} subtitle={subtitle} />
        <main className="p-4 sm:p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
