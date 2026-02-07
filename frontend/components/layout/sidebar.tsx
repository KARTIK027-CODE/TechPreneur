"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Rocket,
    LayoutDashboard,
    Building2,
    CheckSquare,
    MessageSquare,
    BarChart3,
    FileText,
    Settings,
    LogOut,
    Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, requiresRole: null },
    { name: "Startup Profile", href: "/dashboard/startup", icon: Building2, requiresRole: null },
    { name: "Tasks & Milestones", href: "/dashboard/tasks", icon: CheckSquare, requiresRole: null },
    { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquare, requiresRole: null },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, requiresRole: null },
    { name: "Pitch Generator", href: "/dashboard/pitch", icon: FileText, requiresRole: "founder" },
    { name: "Premium", href: "/dashboard/premium", icon: Crown, requiresRole: "founder", premium: true },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    // Filter navigation based on user role
    const visibleNavigation = navigation.filter(item =>
        !item.requiresRole || user?.role === item.requiresRole
    );

    return (
        <div className="flex flex-col h-full w-64 bg-slate-950 border-r border-white/5">
            <div className="p-6 flex items-center gap-2 font-bold text-xl text-slate-100">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <Rocket className="w-5 h-5 text-white" />
                </div>
                <span>VentureX</span>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
                    Workspace
                </div>
                {visibleNavigation.map((item: any) => {
                    const isActive = pathname === item.href;
                    const isPremium = item.premium;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                                isPremium && !isActive && "bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/30",
                                isActive && !isPremium
                                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20"
                                    : isActive && isPremium
                                        ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-300 border border-indigo-500/40"
                                        : !isPremium && "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 group-hover:scale-110 transition-transform",
                                isPremium ? "text-indigo-400" : isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                            )} />
                            <span className={isPremium ? "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold" : ""}>
                                {item.name}
                            </span>
                            {isPremium && (
                                <div className="ml-auto">
                                    <span className="px-1.5 py-0.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 rounded text-white">
                                        ✨
                                    </span>
                                </div>
                            )}
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
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
