"use client";

import { useEffect, useState } from "react";
import {
    Rocket,
    TrendingUp,
    Users,
    CheckCircle2,
    Target,
    Calendar,
    BarChart3,
    ArrowUpRight,
    Activity,
    Zap,
    PieChart as PieChartIcon,
    Wallet
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from "recharts";
import { motion } from "framer-motion";
import { startupApi } from "@/lib/api/startup";
import { taskApi } from "@/lib/api/tasks";
import { feedbackApi } from "@/lib/api/feedback";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import IdeaAnalyzer from "@/components/dashboard/IdeaAnalyzer";

const MOCK_FINANCIALS = {
    financials: [
        { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000, breakdown: { marketing: 8000, payroll: 15000, operations: 5000, software: 4000 } },
        { month: 'Feb', revenue: 52000, expenses: 34000, profit: 18000, breakdown: { marketing: 9000, payroll: 16000, operations: 5000, software: 4000 } },
        { month: 'Mar', revenue: 48000, expenses: 31000, profit: 17000, breakdown: { marketing: 7000, payroll: 15000, operations: 5000, software: 4000 } },
        { month: 'Apr', revenue: 61000, expenses: 42000, profit: 19000, breakdown: { marketing: 12000, payroll: 18000, operations: 8000, software: 4000 } },
        { month: 'May', revenue: 58000, expenses: 38000, profit: 20000, breakdown: { marketing: 10000, payroll: 17000, operations: 7000, software: 4000 } },
        { month: 'Jun', revenue: 75000, expenses: 45000, profit: 30000, breakdown: { marketing: 15000, payroll: 19000, operations: 7000, software: 4000 } },
    ],
    summary: {
        totalRevenue: 339000,
        netProfit: 117000,
        currentCash: 145000,
        runwayMonths: 18,
        founderFocus: [
            { subject: 'Strategy', A: 120, fullMark: 150 },
            { subject: 'Product', A: 98, fullMark: 150 },
            { subject: 'Hiring', A: 86, fullMark: 150 },
            { subject: 'Fundraising', A: 99, fullMark: 150 },
            { subject: 'Sales', A: 85, fullMark: 150 },
            { subject: 'Marketing', A: 65, fullMark: 150 }
        ],
        userGrowth: [
            { month: 'Jan', users: 120 },
            { month: 'Feb', users: 180 },
            { month: 'Mar', users: 250 },
            { month: 'Apr', users: 400 },
            { month: 'May', users: 600 },
            { month: 'Jun', users: 850 }
        ]
    }
};

export default function DashboardPage() {
    const { user } = useAuth();
    const [startup, setStartup] = useState<any>(null);
    const [metrics, setMetrics] = useState({
        totalTasks: 0,
        completedTasks: 0,
        totalMilestones: 0,
        completedMilestones: 0,
        teamMembers: 0,
        feedbackScore: 0
    });
    const [financials, setFinancials] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Import analyticsApi dynamically
            const { analyticsApi } = await import("@/lib/api/analytics");

            // Fetch startup profile first
            const startupData = await startupApi.getProfile();

            // Parallel fetch for other data
            const [tasks, milestones, feedback, financialData] = await Promise.all([
                taskApi.getTasks(),
                taskApi.getMilestones(),
                feedbackApi.getAll().catch(() => []),
                analyticsApi.getFinancialMetrics().catch(() => null)
            ]);

            if (startupData) {
                setStartup(startupData);

                // Use fetched financial data if valid, otherwise use MOCK_FINANCIALS
                const hasValidFinancials = financialData && (financialData.financials?.length > 0 || financialData.summary?.totalRevenue > 0);
                const baseFinancials = hasValidFinancials ? financialData : MOCK_FINANCIALS;

                // Check if there is a simulated cash value from salary payments
                const simulatedCash = localStorage.getItem('simulated_cash_on_hand');

                const finalFinancials = {
                    ...baseFinancials,
                    summary: {
                        ...baseFinancials.summary,
                        currentCash: simulatedCash ? parseInt(simulatedCash) : baseFinancials.summary.currentCash
                    }
                };

                setFinancials(finalFinancials);

                // Filter tasks based on user role and department
                let filteredTasks = tasks;
                let filteredMilestones = milestones;

                if (user?.role === 'team_member' && user?.department) {
                    filteredTasks = tasks.filter((t: any) => t.department === user.department);
                    filteredMilestones = milestones.filter((m: any) => m.department === user.department);
                }

                const completedTasksCount = filteredTasks.filter((t: any) => t.status === 'completed').length;
                const completedMilestonesCount = filteredMilestones.filter((m: any) => m.status === 'completed').length;
                const avgRating = feedback.length > 0
                    ? feedback.reduce((sum: number, f: any) => sum + (f.rating || 0), 0) / feedback.length
                    : 0;

                setMetrics({
                    totalTasks: filteredTasks.length,
                    completedTasks: completedTasksCount,
                    totalMilestones: filteredMilestones.length,
                    completedMilestones: completedMilestonesCount,
                    teamMembers: startupData.teamMembers?.length || 0,
                    feedbackScore: Math.round(avgRating * 10) / 10
                });
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    // If loading, show spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // Create a fallback startup object if null, so the dashboard can still render for new users
    const displayStartup = startup || {
        name: 'New Workspace',
        domain: 'Setup Pending',
        stage: 'early_stage'
    };

    return (
        <div className="space-y-8 p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {displayStartup.name} Dashboard
                    </h1>
                    <div className="flex items-center gap-3 text-slate-400">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/30">
                            {displayStartup.domain}
                        </span>
                        <span>•</span>
                        <span className="text-sm capitalize">{displayStartup.stage.replace('_', ' ')}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="text-right">
                        <div className="text-sm text-slate-400">Runway</div>
                        <div className="text-xl font-bold text-white">{financials?.summary?.runwayMonths || 0} Months</div>
                    </div>
                </div>
            </motion.div>

            {/* Financial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.totalTasks === 0 && <IdeaAnalyzer />}
                <MetricCard
                    title="Total Revenue"
                    value={`$${(financials?.summary?.totalRevenue || 0).toLocaleString()}`}
                    subtitle="Year to Date"
                    icon={TrendingUp}
                    color="from-emerald-500 to-green-600"
                    iconBg="bg-emerald-500/20"
                    iconColor="text-emerald-400"
                />
                <MetricCard
                    title="Net Profit"
                    value={`$${(financials?.summary?.netProfit || 0).toLocaleString()}`}
                    subtitle="Year to Date"
                    icon={PieChartIcon}
                    color="from-blue-500 to-indigo-600"
                    iconBg="bg-blue-500/20"
                    iconColor="text-blue-400"
                />
                <MetricCard
                    title="Cash on Hand"
                    value={`$${(financials?.summary?.currentCash || 0).toLocaleString()}`}
                    subtitle="Current Balance"
                    icon={Wallet}
                    color="from-purple-500 to-pink-600"
                    iconBg="bg-purple-500/20"
                    iconColor="text-purple-400"
                />
                <MetricCard
                    title="Team Size"
                    value={metrics.teamMembers}
                    subtitle="Active Members"
                    icon={Users}
                    color="from-amber-500 to-orange-600"
                    iconBg="bg-amber-500/20"
                    iconColor="text-amber-400"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. Revenue Analysis (Bar Chart) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-indigo-500/30 transition-all duration-300 relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div>
                            <h3 className="text-lg font-bold text-white">Revenue Analysis</h3>
                            <p className="text-xs text-slate-400">Monthly revenue vs expenses</p>
                        </div>
                        <div className="p-2 bg-white/5 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-indigo-400" />
                        </div>
                    </div>
                    <div className="h-80 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financials?.financials || []} barSize={20}>
                                <defs>
                                    <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.6} />
                                    </linearGradient>
                                    <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f472b6" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#db2777" stopOpacity={0.6} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="revenue" fill="url(#barGradient1)" name="Revenue" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expenses" fill="url(#barGradient2)" name="Expenses" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* 2. User Growth (Line Chart) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-300 relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div>
                            <h3 className="text-lg font-bold text-white">User Growth</h3>
                            <p className="text-xs text-slate-400">Total active users over time</p>
                        </div>
                        <div className="p-2 bg-white/5 rounded-lg">
                            <Activity className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>
                    <div className="h-80 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={financials?.summary?.userGrowth || []}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* 3. Founder Focus (Radar Chart) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-amber-500/30 transition-all duration-300 relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div>
                            <h3 className="text-lg font-bold text-white">Founder Focus</h3>
                            <p className="text-xs text-slate-400">Allocation of time & resources</p>
                        </div>
                        <div className="p-2 bg-white/5 rounded-lg">
                            <Target className="w-5 h-5 text-amber-400" />
                        </div>
                    </div>
                    <div className="h-80 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={financials?.summary?.founderFocus || []}>
                                <PolarGrid stroke="#334155" strokeOpacity={0.5} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar
                                    name="Focus"
                                    dataKey="A"
                                    stroke="#f59e0b"
                                    strokeWidth={3}
                                    fill="#f59e0b"
                                    fillOpacity={0.3}
                                />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* 4. Expense Breakdown (Pie Chart) - Styled */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-blue-500/30 transition-all duration-300 relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div>
                            <h3 className="text-lg font-bold text-white">Expense Distribution</h3>
                            <p className="text-xs text-slate-400">Where the money goes</p>
                        </div>
                        <div className="p-2 bg-white/5 rounded-lg">
                            <PieChartIcon className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>
                    <div className="h-80 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={Object.entries(financials?.financials?.[financials.financials.length - 1]?.breakdown || {}).map(([name, value]) => ({ name, value }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    dataKey="value"
                                    paddingAngle={5}
                                >
                                    {[0, 1, 2, 3].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#8b5cf6', '#f59e0b', '#ef4444', '#10b981'][index % 4]} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Company Health Flow - Premium Style */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-900/20 border border-white/10"
            >
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Company Health</h3>
                        <p className="text-slate-400">Holistic view of startup performance</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-emerald-400">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        System Optimal
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative px-4">
                    {/* Connection Lines with Pulse */}
                    <div className="hidden md:block absolute top-[50%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent -z-10 transform -translate-y-1/2"></div>

                    <HealthNode
                        title="Product"
                        status={metrics.completedMilestones > 0 ? "Healthy" : "In Progress"}
                        color="from-purple-500 to-indigo-600"
                        icon={Rocket}
                    />
                    <HealthNode
                        title="Team"
                        status={metrics.feedbackScore > 4 ? "Excellent" : "Good"}
                        color="from-blue-500 to-cyan-600"
                        icon={Users}
                    />
                    <HealthNode
                        title="Finance"
                        status={financials?.summary?.runwayMonths > 6 ? "Stable" : "Caution"}
                        color={financials?.summary?.runwayMonths > 6 ? "from-emerald-500 to-teal-600" : "from-amber-500 to-orange-600"}
                        icon={Wallet}
                    />
                    <HealthNode
                        title="Growth"
                        status="Trending Up"
                        color="from-indigo-500 to-violet-600"
                        icon={TrendingUp}
                    />
                </div>
            </motion.div>
        </div>
    );
}

function HealthNode({ title, status, color, icon: Icon }: any) {
    return (
        <div className={`relative p-[1px] rounded-2xl bg-gradient-to-br ${color} w-full md:w-56 group`}>
            <div className="absolute inset-0 bg-white/20 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative h-full bg-slate-950/90 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center text-center overflow-hidden">
                <div className={`mb-4 p-3 rounded-full bg-gradient-to-br ${color} bg-opacity-10`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-white font-bold text-lg mb-1">{title}</div>
                <div className="text-slate-400 text-sm font-medium">{status}</div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, subtitle, icon: Icon, color, iconBg, iconColor }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="relative p-6 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all overflow-hidden group"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${iconBg}`}>
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-sm text-slate-400">{title}</div>
                {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
            </div>
        </motion.div>
    );
}
