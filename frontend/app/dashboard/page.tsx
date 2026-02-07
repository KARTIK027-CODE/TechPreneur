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
    Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { startupApi } from "@/lib/api/startup";
import { taskApi } from "@/lib/api/tasks";
import { feedbackApi } from "@/lib/api/feedback";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

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
    const [recentTasks, setRecentTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [startupData, tasks, milestones, feedback] = await Promise.all([
                startupApi.getProfile(),
                taskApi.getTasks(),
                taskApi.getMilestones(),
                feedbackApi.getAll().catch(() => [])
            ]);

            if (startupData) {
                setStartup(startupData);

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

                setRecentTasks(filteredTasks.slice(0, 5));
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const taskCompletionRate = metrics.totalTasks > 0
        ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100)
        : 0;

    const milestoneProgress = metrics.totalMilestones > 0
        ? Math.round((metrics.completedMilestones / metrics.totalMilestones) * 100)
        : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // Show onboarding CTA if no startup profile
    if (!startup) {
        return (
            <div className="space-y-8 p-8">
                {/* Premium Onboarding Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 p-12"
                >
                    {/* Animated Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                    {/* Content */}
                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl shadow-indigo-500/20">
                            <Rocket className="w-10 h-10 text-white" />
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-4">
                            Welcome to VentureX
                        </h1>

                        <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl mx-auto">
                            Transform your startup journey with powerful tools for task management, team collaboration, and progress tracking.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/dashboard/settings?tab=company"
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
                            >
                                <span>Setup Your Startup</span>
                                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>

                            <button className="inline-flex items-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium border border-white/10 hover:border-white/20 transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Watch Tutorial
                            </button>
                        </div>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                            {['Task Management', 'Team Collaboration', 'Progress Tracking', 'AI Insights'].map((feature) => (
                                <span
                                    key={feature}
                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 backdrop-blur-sm"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-8">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {startup.name}
                    </h1>
                    <div className="flex items-center gap-3 text-slate-400">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/30">
                            {startup.domain}
                        </span>
                        <span>•</span>
                        <span className="text-sm capitalize">{startup.stage.replace('_', ' ')}</span>
                        {user?.department && (
                            <>
                                <span>•</span>
                                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30 flex items-center gap-2">
                                    <Users className="w-3 h-3" />
                                    {user.department} Department
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/tasks"
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors text-white"
                    >
                        View All Tasks
                    </Link>
                    {user?.role === 'founder' && (
                        <Link
                            href="/dashboard/tasks"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors flex items-center gap-2"
                        >
                            <Rocket className="w-4 h-4" />
                            New Milestone
                        </Link>
                    )}
                </div>
            </motion.div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Task Completion"
                    value={`${taskCompletionRate}%`}
                    subtitle={`${metrics.completedTasks} of ${metrics.totalTasks} tasks`}
                    icon={CheckCircle2}
                    color="from-emerald-500 to-green-600"
                    iconBg="bg-emerald-500/20"
                    iconColor="text-emerald-400"
                />
                <MetricCard
                    title="Milestones"
                    value={`${milestoneProgress}%`}
                    subtitle={`${metrics.completedMilestones} of ${metrics.totalMilestones} completed`}
                    icon={Target}
                    color="from-blue-500 to-indigo-600"
                    iconBg="bg-blue-500/20"
                    iconColor="text-blue-400"
                />
                <MetricCard
                    title="Team Members"
                    value={metrics.teamMembers}
                    subtitle="Active collaborators"
                    icon={Users}
                    color="from-purple-500 to-pink-600"
                    iconBg="bg-purple-500/20"
                    iconColor="text-purple-400"
                />
                <MetricCard
                    title="Feedback Score"
                    value={metrics.feedbackScore > 0 ? `${metrics.feedbackScore}/5` : 'N/A'}
                    subtitle="Average rating"
                    icon={BarChart3}
                    color="from-amber-500 to-orange-600"
                    iconBg="bg-amber-500/20"
                    iconColor="text-amber-400"
                />
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Task Progress */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl bg-slate-900/50 border border-white/10"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-400" />
                            Recent Tasks
                        </h3>
                        <Link href="/dashboard/tasks" className="text-sm text-indigo-400 hover:text-indigo-300">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentTasks.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>No tasks yet. Create your first task!</p>
                            </div>
                        ) : (
                            recentTasks.map((task: any, i: number) => (
                                <div
                                    key={task._id}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-white/5 hover:border-white/10 transition-all"
                                >
                                    <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-emerald-400' :
                                        task.status === 'in_progress' ? 'bg-blue-400' :
                                            'bg-slate-600'
                                        }`}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{task.title}</p>
                                        <p className="text-xs text-slate-400 capitalize">{task.status.replace('_', ' ')}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded capitalize ${task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                        task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                            'bg-green-500/20 text-green-400'
                                        }`}>
                                        {task.priority}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl bg-slate-900/50 border border-white/10"
                >
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400" />
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {user?.role === 'founder' && (
                            <>
                                <QuickActionCard
                                    title="New Task"
                                    icon={CheckCircle2}
                                    href="/dashboard/tasks"
                                    color="bg-emerald-600 hover:bg-emerald-500"
                                />
                                <QuickActionCard
                                    title="Add Milestone"
                                    icon={Target}
                                    href="/dashboard/tasks"
                                    color="bg-blue-600 hover:bg-blue-500"
                                />
                            </>
                        )}
                        <QuickActionCard
                            title="Team"
                            icon={Users}
                            href="/dashboard/startup"
                            color="bg-purple-600 hover:bg-purple-500"
                        />
                        <QuickActionCard
                            title="Analytics"
                            icon={BarChart3}
                            href="/dashboard/analytics"
                            color="bg-indigo-600 hover:bg-indigo-500"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Startup Vision */}
            {startup.vision && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-8 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20"
                >
                    <h3 className="text-sm font-semibold text-indigo-300 mb-3 uppercase tracking-wider">Our Vision</h3>
                    <p className="text-lg text-white leading-relaxed">{startup.vision}</p>
                </motion.div>
            )}
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

function QuickActionCard({ title, icon: Icon, href, color }: any) {
    return (
        <Link
            href={href}
            className={`flex flex-col items-center justify-center p-6 rounded-xl ${color} text-white transition-all hover:scale-105 active:scale-95`}
        >
            <Icon className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">{title}</span>
        </Link>
    );
}
