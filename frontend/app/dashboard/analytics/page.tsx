"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, CheckCircle, Clock, Target, Zap, Activity, Download, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { taskApi } from "@/lib/api/tasks";
import { startupApi } from "@/lib/api/startup";
import { Task, Milestone } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const DEPARTMENTS = ["Business", "Marketing", "Development", "Sales", "Operations", "Finance", "HR", "Product"];

const DEPARTMENT_COLORS: any = {
    "Business": "from-blue-500 to-cyan-600",
    "Marketing": "from-pink-500 to-rose-600",
    "Development": "from-indigo-500 to-purple-600",
    "Sales": "from-emerald-500 to-green-600",
    "Operations": "from-amber-500 to-orange-600",
    "Finance": "from-violet-500 to-purple-600",
    "HR": "from-teal-500 to-cyan-600",
    "Product": "from-red-500 to-pink-600"
};

const DEPARTMENT_ICONS: any = {
    "Business": "💼",
    "Marketing": "📣",
    "Development": "💻",
    "Sales": "📈",
    "Operations": "⚙️",
    "Finance": "💰",
    "HR": "👥",
    "Product": "🎯"
};

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchAnalyticsData();
        }
    }, [user]);

    const fetchAnalyticsData = async () => {
        try {
            const [tasksData, milestonesData, startupData] = await Promise.all([
                taskApi.getTasks(),
                taskApi.getMilestones(),
                startupApi.getProfile()
            ]);

            let filteredTasks = tasksData;
            let filteredMilestones = milestonesData;

            if (user?.role === 'team_member' && user?.department) {
                filteredTasks = tasksData.filter((t: any) => t.department === user.department);
                filteredMilestones = milestonesData.filter((m: any) => m.department === user.department);
            }

            setTasks(filteredTasks);
            setMilestones(filteredMilestones);
            if (startupData) {
                let members = startupData.teamMembers || [];
                if (user?.role === 'team_member' && user?.department) {
                    members = members.filter((m: any) => m.department === user.department);
                }
                setTeamMembers(members);
            }
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate department stats
    const getDepartmentStats = () => {
        return DEPARTMENTS.map(dept => {
            const deptTasks = tasks.filter((t: any) => t.department === dept || t.assignedTo?.department === dept);
            const completedTasks = deptTasks.filter(t => t.status === 'completed').length;
            const inProgressTasks = deptTasks.filter(t => t.status === 'in_progress').length;
            const totalTasks = deptTasks.length;
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            return {
                name: dept,
                total: totalTasks,
                completed: completedTasks,
                inProgress: inProgressTasks,
                pending: totalTasks - completedTasks - inProgressTasks,
                completionRate,
                emoji: DEPARTMENT_ICONS[dept],
                gradient: DEPARTMENT_COLORS[dept]
            };
        }).filter(d => d.total > 0);
    };

    const departmentStats = getDepartmentStats();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const overallCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20">
                            <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">Analytics Dashboard</h1>
                            <p className="text-slate-400 mt-1">Comprehensive insights into team performance & productivity</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl transition-all">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all shadow-lg">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </motion.div>

                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Tasks"
                        value={totalTasks}
                        subtitle="Across all departments"
                        icon={Target}
                        gradient="from-blue-500 to-cyan-600"
                        delay={0.1}
                    />
                    <StatCard
                        title="Completed"
                        value={completedTasks}
                        subtitle={`${overallCompletion}% completion rate`}
                        icon={CheckCircle}
                        gradient="from-emerald-500 to-green-600"
                        delay={0.2}
                    />
                    <StatCard
                        title="In Progress"
                        value={inProgressTasks}
                        subtitle="Currently being worked on"
                        icon={Activity}
                        gradient="from-amber-500 to-orange-600"
                        delay={0.3}
                    />
                    <StatCard
                        title="Team Members"
                        value={teamMembers.length}
                        subtitle="Active contributors"
                        icon={Users}
                        gradient="from-purple-500 to-pink-600"
                        delay={0.4}
                    />
                </div>

                {/* Department Performance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Users className="w-6 h-6 text-indigo-400" />
                            Department Performance
                        </h2>
                        <span className="text-sm text-slate-400">{departmentStats.length} active departments</span>
                    </div>

                    {departmentStats.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">
                            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-medium">No department data available yet</p>
                            <p className="text-sm mt-2">Start assigning tasks to departments to see analytics</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {departmentStats.map((dept, idx) => (
                                <DepartmentCard key={dept.name} dept={dept} delay={0.1 * idx} />
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Recent Activity & Milestones Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Team Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Zap className="w-6 h-6 text-amber-400" />
                            Recent Activity
                        </h2>

                        <div className="space-y-3">
                            {tasks.slice(0, 6).map((task, idx) => (
                                <ActivityItem key={task._id} task={task} delay={0.05 * idx} />
                            ))}
                        </div>

                        {tasks.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                <Clock className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p className="text-lg">No activity yet</p>
                                <p className="text-sm mt-2">Start creating tasks to see activity</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Milestones */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Target className="w-6 h-6 text-purple-400" />
                            Milestones Overview
                        </h2>

                        <div className="space-y-4">
                            {milestones.map((milestone, idx) => {
                                const milestoneTasks = tasks.filter(t => t.milestoneId === milestone._id);
                                const completed = milestoneTasks.filter(t => t.status === 'completed').length;
                                const total = milestoneTasks.length;
                                const progress = total > 0 ? (completed / total) * 100 : 0;

                                return (
                                    <MilestoneCard
                                        key={milestone._id}
                                        milestone={milestone}
                                        progress={progress}
                                        completed={completed}
                                        total={total}
                                        delay={0.05 * idx}
                                    />
                                );
                            })}
                        </div>

                        {milestones.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                <Target className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p className="text-lg">No milestones created yet</p>
                                <p className="text-sm mt-2">Create milestones to track progress</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// Components
function StatCard({ title, value, subtitle, icon: Icon, gradient, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-slate-400 text-sm mb-1">{title}</p>
            <p className="text-4xl font-bold text-white mb-1">{value}</p>
            <p className="text-xs text-slate-500">{subtitle}</p>
        </motion.div>
    );
}

function DepartmentCard({ dept, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className="bg-slate-950/50 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all hover:scale-105"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{dept.emoji}</span>
                    <h3 className="font-semibold text-white">{dept.name}</h3>
                </div>
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${dept.gradient} text-white text-xs font-bold shadow-lg`}>
                    {dept.completionRate}%
                </div>
            </div>

            <div className="space-y-2.5 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total</span>
                    <span className="text-white font-semibold">{dept.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Completed</span>
                    <span className="text-emerald-400 font-semibold">{dept.completed}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">In Progress</span>
                    <span className="text-amber-400 font-semibold">{dept.inProgress}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Pending</span>
                    <span className="text-slate-500 font-semibold">{dept.pending}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2.5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.completionRate}%` }}
                    transition={{ duration: 1, delay: delay + 0.2 }}
                    className={`h-2.5 rounded-full bg-gradient-to-r ${dept.gradient}`}
                />
            </div>
        </motion.div>
    );
}

function ActivityItem({ task, delay }: any) {
    const statusColors: any = {
        'completed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        'in_progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'todo': 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };

    const priorityColors: any = {
        'high': 'text-red-400',
        'medium': 'text-amber-400',
        'low': 'text-green-400'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-white/10 hover:border-white/20 transition-all"
        >
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white mb-1 truncate">{task.title}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                    {task.assignedTo && (
                        <span className="truncate">👤 {task.assignedTo.name}</span>
                    )}
                    <span className={`font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                    </span>
                </div>
            </div>
            <span className={`px-3 py-1 rounded-full border text-xs font-medium capitalize whitespace-nowrap ml-3 ${statusColors[task.status]}`}>
                {task.status.replace('_', ' ')}
            </span>
        </motion.div>
    );
}

function MilestoneCard({ milestone, progress, completed, total, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-slate-950/50 rounded-xl border border-white/10 p-5 hover:border-white/20 transition-all"
        >
            <h3 className="font-semibold text-white mb-3 truncate">{milestone.title}</h3>
            <div className="mb-3">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white font-semibold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: delay + 0.1 }}
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    />
                </div>
            </div>
            <p className="text-sm text-slate-400">
                {completed} of {total} tasks completed
            </p>
        </motion.div>
    );
}
