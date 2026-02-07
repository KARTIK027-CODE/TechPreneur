"use client";

import { useEffect, useState, useMemo } from "react";
import { BarChart3, TrendingUp, Users, CheckCircle, Clock, Target, Zap, Activity, Download, Filter, PieChart as PieChartIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { taskApi } from "@/lib/api/tasks";
import { startupApi } from "@/lib/api/startup";
import { Task, Milestone } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "@/lib/utils";

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

// Mock Data for specific request
const MOCK_EMPLOYEES = [
    { id: '1', name: 'Sarah Jenkins', role: 'HR Manager', department: 'HR', avatar: null },
    { id: '2', name: 'Mike Ross', role: 'Legal Counsel', department: 'Legal', avatar: null },
    { id: '3', name: 'Rachel Zane', role: 'Paralegal', department: 'Legal', avatar: null },
    { id: '4', name: 'Donna Paulsen', role: 'COO', department: 'Operations', avatar: null },
    { id: '5', name: 'Louis Litt', role: 'Finance Head', department: 'Finance', avatar: null },
    { id: '6', name: 'Harvey Specter', role: 'Senior Partner', department: 'Business', avatar: null },
    { id: '7', name: 'Jessica Pearson', role: 'Managing Partner', department: 'Business', avatar: null },
    { id: '8', name: 'Katrina Bennett', role: 'Associate', department: 'Business', avatar: null },
    { id: '9', name: 'Alex Williams', role: 'Senior Developer', department: 'Development', avatar: null },
    { id: '10', name: 'Samantha Wheeler', role: 'Marketing Lead', department: 'Marketing', avatar: null },
    { id: '11', name: 'Robert Zane', role: 'Advisor', department: 'Business', avatar: null },
    { id: '12', name: 'Harold Gunderson', role: 'Junior Dev', department: 'Development', avatar: null },
    { id: '13', name: 'Travis Tanner', role: 'Sales Lead', department: 'Sales', avatar: null },
    { id: '14', name: 'Dana Scott', role: 'Product Manager', department: 'Product', avatar: null },
    { id: '15', name: 'Jeff Malone', role: 'Financial Analyst', department: 'Finance', avatar: null },
];

const MOCK_LOGS = [
    { id: 1, type: 'task_completed', text: 'Sarah Jenkins processed payroll for Oct', time: '2 hours ago', dept: 'HR' },
    { id: 2, type: 'milestone', text: 'Mike Ross finalized Series A contract', time: '4 hours ago', dept: 'Legal' },
    { id: 3, type: 'task_completed', text: 'Donna Paulsen optimized server costs', time: '5 hours ago', dept: 'Operations' },
    { id: 4, type: 'alert', text: 'Louis Litt flagged a budget variance', time: '6 hours ago', dept: 'Finance' },
    { id: 5, type: 'task_completed', text: 'Alex Williams deployed hotfix v2.1', time: '1 day ago', dept: 'Development' },
    { id: 6, type: 'task_completed', text: 'Samantha Wheeler launched Q4 campaign', time: '1 day ago', dept: 'Marketing' },
    { id: 7, type: 'task_completed', text: 'Travis Tanner closed enterprise deal', time: '2 days ago', dept: 'Sales' },
    { id: 8, type: 'milestone', text: 'Dana Scott released Product Roadmap', time: '2 days ago', dept: 'Product' },
    { id: 9, type: 'task_completed', text: 'Harold Gunderson fixed login bug', time: '3 days ago', dept: 'Development' },
    { id: 10, type: 'alert', text: 'System Alert: High CPU usage', time: '3 days ago', dept: 'Operations' }
];

// NEW: Mock Chart Data
const generateMockChartData = (dept: string) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const baseValue = dept === 'All' ? 50 : Math.floor(Math.random() * 20) + 10;

    return days.map(day => ({
        name: day,
        tasks: Math.floor(Math.random() * 15) + baseValue,
        completed: Math.floor(Math.random() * 10) + (baseValue * 0.6)
    }));
};

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [teamMembers, setTeamMembers] = useState<any[]>(MOCK_EMPLOYEES);
    const [loading, setLoading] = useState(true);
    const [selectedDept, setSelectedDept] = useState<string>('All');

    useEffect(() => {
        if (user) {
            fetchAnalyticsData();
        }
    }, [user]);

    const fetchAnalyticsData = async () => {
        try {
            const [tasksData, milestonesData, startupData] = await Promise.all([
                taskApi.getTasks().catch(() => []),
                taskApi.getMilestones().catch(() => []),
                startupApi.getProfile().catch(() => null)
            ]);

            setTasks(tasksData);
            setMilestones(milestonesData);

            if ((startupData?.teamMembers?.length ?? 0) > 0) {
                setTeamMembers([...(startupData?.teamMembers || []), ...MOCK_EMPLOYEES]);
            } else {
                setTeamMembers(MOCK_EMPLOYEES);
            }

        } catch (error) {
            console.error("Failed to fetch analytics", error);
            setTeamMembers(MOCK_EMPLOYEES);
        } finally {
            setLoading(false);
        }
    };

    const getDepartmentStats = () => {
        const deptsToShow = selectedDept === 'All' ? DEPARTMENTS : [selectedDept];

        return deptsToShow.map(dept => {
            const deptTasks = tasks.filter((t: any) => t.department === dept);
            const hasData = deptTasks.length > 0;
            const totalTasks = hasData ? deptTasks.length : Math.floor(Math.random() * 20) + 5;
            const completedTasks = hasData ? deptTasks.filter(t => t.status === 'completed').length : Math.floor(totalTasks * 0.7);
            const inProgressTasks = hasData ? deptTasks.filter(t => t.status === 'in_progress').length : Math.floor(totalTasks * 0.2);
            const pending = totalTasks - completedTasks - inProgressTasks;
            const completionRate = Math.round((completedTasks / totalTasks) * 100);

            return {
                name: dept,
                total: totalTasks,
                completed: completedTasks,
                inProgress: inProgressTasks,
                pending: pending,
                completionRate,
                emoji: DEPARTMENT_ICONS[dept] || '📊',
                gradient: DEPARTMENT_COLORS[dept] || 'from-slate-500 to-slate-600'
            };
        });
    };

    const departmentStats = getDepartmentStats();

    const recentActivity = selectedDept === 'All'
        ? MOCK_LOGS
        : MOCK_LOGS.filter(log => log.dept === selectedDept);

    const productivityData = useMemo(() => generateMockChartData(selectedDept), [selectedDept]);

    const statusDistribution = useMemo(() => {
        if (selectedDept === 'All') {
            return [
                { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length || 65, color: '#10b981' },
                { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length || 25, color: '#f59e0b' },
                { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length || 15, color: '#64748b' }
            ];
        } else {
            const deptTasks = tasks.filter((t: any) => t.department === selectedDept);
            const hasData = deptTasks.length > 0;
            return [
                { name: 'Completed', value: hasData ? deptTasks.filter(t => t.status === 'completed').length : 12, color: '#10b981' },
                { name: 'In Progress', value: hasData ? deptTasks.filter(t => t.status === 'in_progress').length : 5, color: '#f59e0b' },
                { name: 'To Do', value: hasData ? deptTasks.filter(t => t.status === 'todo').length : 3, color: '#64748b' }
            ];
        }
    }, [selectedDept, tasks]);

    const displayedStats = useMemo(() => {
        if (selectedDept === 'All') {
            return {
                total: tasks.length || 145,
                completed: tasks.filter(t => t.status === 'completed').length || 89,
                inProgress: tasks.filter(t => t.status === 'in_progress').length || 34,
                teamCount: teamMembers.length
            };
        } else {
            const deptData = departmentStats[0];
            return {
                total: deptData.total,
                completed: deptData.completed,
                inProgress: deptData.inProgress,
                teamCount: teamMembers.filter(m => m.department === selectedDept).length
            };
        }
    }, [selectedDept, tasks, teamMembers, departmentStats]);

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
                    className="flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20">
                            <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">Analytics Dashboard</h1>
                            <p className="text-slate-400 mt-1">Deep dive into {selectedDept === 'All' ? 'company-wide' : selectedDept} metrics</p>
                        </div>
                    </div>

                    <div className="flex bg-slate-900/50 backdrop-blur-md p-1 rounded-xl border border-white/10">
                        <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="bg-transparent text-white border-none focus:ring-0 cursor-pointer py-2 pl-4 pr-8 font-medium"
                        >
                            <option value="All" className="bg-slate-900">All Departments</option>
                            {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept} className="bg-slate-900">{dept}</option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title={selectedDept === 'All' ? "Total Tasks" : `${selectedDept} Tasks`}
                        value={displayedStats.total}
                        subtitle="Total assigned work"
                        icon={Target}
                        gradient="from-blue-500 to-cyan-600"
                        delay={0.1}
                    />
                    <StatCard
                        title="Completed"
                        value={displayedStats.completed}
                        subtitle={`${displayedStats.total > 0 ? Math.round((displayedStats.completed / displayedStats.total) * 100) : 0}% completion rate`}
                        icon={CheckCircle}
                        gradient="from-emerald-500 to-green-600"
                        delay={0.2}
                    />
                    <StatCard
                        title="In Progress"
                        value={displayedStats.inProgress}
                        subtitle="Currently being worked on"
                        icon={Activity}
                        gradient="from-amber-500 to-orange-600"
                        delay={0.3}
                    />
                    <StatCard
                        title={selectedDept === 'All' ? "Team Members" : `${selectedDept} Team`}
                        value={displayedStats.teamCount}
                        subtitle="Active contributors"
                        icon={Users}
                        gradient="from-purple-500 to-pink-600"
                        delay={0.4}
                    />
                </div>

                {/* Department Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-6">
                            {selectedDept === 'All' ? 'Weekly Productivity' : `${selectedDept} Activity Trend`}
                        </h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={productivityData}>
                                    <defs>
                                        <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Area type="monotone" dataKey="tasks" name="Active Tasks" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
                                    <Area type="monotone" dataKey="completed" name="Completed" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-6">Status Breakdown</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.05)" />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
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
                            {selectedDept === 'All' ? 'Department Performance' : `${selectedDept} Overview`}
                        </h2>
                        {selectedDept !== 'All' && (
                            <button
                                onClick={() => setSelectedDept('All')}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-2"
                            >
                                ← Back to Overview
                            </button>
                        )}
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
                                <DepartmentCard
                                    key={dept.name}
                                    dept={dept}
                                    delay={0.1 * idx}
                                    onClick={() => setSelectedDept(dept.name)}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Team Members Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Users className="w-6 h-6 text-purple-400" />
                        {selectedDept === 'All' ? 'Team Members' : `${selectedDept} Team`}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {teamMembers
                            .filter(m => selectedDept === 'All' || m.department === selectedDept)
                            .map((member, idx) => (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.05 * idx }}
                                    className="p-4 rounded-xl bg-slate-950/50 border border-white/10 flex items-center gap-3 group hover:border-indigo-500/50 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                        {getInitials(member.name)}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm group-hover:text-indigo-400 transition-colors">{member.name}</h4>
                                        <p className="text-xs text-slate-400">{member.role}</p>
                                    </div>
                                </motion.div>
                            ))}
                    </div>
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

                        <div className="space-y-4">
                            {recentActivity.map((log, idx) => (
                                <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/50 border border-white/5">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-indigo-500"></div>
                                    <div>
                                        <p className="text-slate-300 text-sm">{log.text}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-500">{log.time}</span>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">{log.dept}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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

function DepartmentCard({ dept, delay, onClick }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            onClick={onClick}
            className="bg-slate-950/50 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all hover:scale-105 cursor-pointer relative group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <span className="text-3xl shadow-sm">{dept.emoji}</span>
                    <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">{dept.name}</h3>
                </div>
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${dept.gradient} text-white text-xs font-bold shadow-lg`}>
                    {dept.completionRate}%
                </div>
            </div>

            <div className="space-y-2.5 mb-4 relative z-10">
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
            <div className="w-full bg-slate-800 rounded-full h-2.5 relative z-10">
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
