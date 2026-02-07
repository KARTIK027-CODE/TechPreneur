"use client";

import { useEffect, useState } from "react";
import {
    Rocket,
    TrendingUp,
    Users,
    Clock,
    ArrowUpRight,
    GitPullRequest,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
    const [companyName, setCompanyName] = useState("My Startup");
    const [sector, setSector] = useState("Technology");

    useEffect(() => {
        const storedName = localStorage.getItem("companyName");
        const storedSector = localStorage.getItem("companySector");
        if (storedName) setCompanyName(storedName);
        if (storedSector) setSector(storedSector);
    }, []);

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                        Welcome back to {companyName}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-400">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                            {sector}
                        </span>
                        <span>•</span>
                        <span className="text-sm">Series A Preparation</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                        Invite Team
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors flex items-center gap-2">
                        <Rocket className="w-4 h-4" />
                        New Milestone
                    </button>
                </div>
            </motion.div>

            {/* GitHub Style Contribution Graph (Mock) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl bg-slate-900/50 border border-white/5"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                        <GitPullRequest className="w-4 h-4 text-emerald-400" />
                        Startup Velocit - "The GitHub for Business"
                    </h3>
                    <select className="bg-slate-950 border border-white/10 rounded-md text-xs px-2 py-1 text-slate-400">
                        <option>Last 30 Days</option>
                        <option>This Quarter</option>
                    </select>
                </div>
                <div className="grid grid-cols-52 gap-1 h-32 overflow-hidden opacity-50">
                    {Array.from({ length: 364 }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-full h-full rounded-sm ${Math.random() > 0.8 ? 'bg-emerald-500/80' :
                                    Math.random() > 0.6 ? 'bg-emerald-500/40' :
                                        Math.random() > 0.4 ? 'bg-emerald-900/30' :
                                            'bg-slate-800'
                                }`}
                        ></div>
                    ))}
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                    <span>Do less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 bg-slate-800 rounded-sm"></div>
                        <div className="w-3 h-3 bg-emerald-900/30 rounded-sm"></div>
                        <div className="w-3 h-3 bg-emerald-500/40 rounded-sm"></div>
                        <div className="w-3 h-3 bg-emerald-500/80 rounded-sm"></div>
                    </div>
                    <span>Do more</span>
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Burn Rate"
                    value="$42,000"
                    change="+12%"
                    trend="up"
                    icon={TrendingUp}
                    color="text-red-400"
                />
                <MetricCard
                    title="Runway"
                    value="14 Months"
                    change="-1 Month"
                    trend="down"
                    icon={Clock}
                    color="text-amber-400"
                />
                <MetricCard
                    title="Active Users"
                    value="1,240"
                    change="+24%"
                    trend="up"
                    icon={Users}
                    color="text-emerald-400"
                />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
                    <h3 className="font-bold text-slate-200 mb-4">Recent Milestones</h3>
                    <div className="space-y-4">
                        {[
                            { title: "MVP Launched", date: "2 days ago", status: "completed" },
                            { title: "First 100 Users", date: "1 week ago", status: "completed" },
                            { title: "Seed Round Deck", date: "In Progress", status: "pending" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        {item.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-200">{item.title}</div>
                                        <div className="text-xs text-slate-500">{item.date}</div>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <ArrowUpRight className="w-4 h-4 text-slate-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
                    <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                        AI Insights
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] border border-purple-500/20">BETA</span>
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                            <div className="flex gap-3 mb-2">
                                <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-purple-200">Burn Rate Alert</h4>
                                    <p className="text-xs text-purple-300/70 mt-1">
                                        Your marketing spend has increased by 40% this month. Consider optimizing your ad spend on LinkedIn.
                                    </p>
                                </div>
                            </div>
                            <button className="w-full mt-2 py-2 text-xs font-medium bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors">
                                View Financial Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, change, trend, icon: Icon, color }: any) {
    return (
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 transition-colors group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-white/5 ${color} bg-opacity-10`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {change}
                </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-slate-400">{title}</div>
        </div>
    )
}
