"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Rocket,
    LayoutDashboard,
    DollarSign,
    Users,
    Briefcase,
    Code,
    Settings,
    LogOut,
    LineChart,
    Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Finance", href: "/dashboard/finance", icon: DollarSign },
    { name: "Marketing", href: "/dashboard/marketing", icon: LineChart },
    { name: "HR & Team", href: "/dashboard/hr", icon: Users },
    { name: "Team (CEO View)", href: "/dashboard/team", icon: Users },
    { name: "Tech & Product", href: "/dashboard/tech", icon: Code },
    { name: "Fundraising", href: "/dashboard/investor", icon: Briefcase },
    { name: "Govt & Compliance", href: "/dashboard/government", icon: Building2 },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full w-64 bg-slate-950 border-r border-white/5">
            <div className="p-6 flex items-center gap-2 font-bold text-xl text-slate-100">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <Rocket className="w-5 h-5 text-white" />
                </div>
                <span>FounderJourney</span>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
                    Workbench
                </div>
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 group-hover:scale-110 transition-transform", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-1">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all"
                >
                    <Settings className="w-5 h-5 text-slate-500" />
                    Settings
                </Link>
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </Link>
            </div>
        </div>
    );
}
