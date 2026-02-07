"use client";

import { Bell, Search, Command } from "lucide-react";

export function Header() {
    return (
        <header className="h-16 border-b border-white/5 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
            <div className="flex items-center gap-4 flex-1">
                {/* Tagline Badge */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-medium text-slate-400">GitHub for Startups</span>
                </div>

                <div className="relative max-w-md w-full ml-4 hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search tasks, documents, or people..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Command className="w-3 h-3 text-slate-600" />
                        <span className="text-[10px] text-slate-600">K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950"></span>
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/10 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:scale-105 transition-transform">
                    KC
                </div>
            </div>
        </header>
    );
}
