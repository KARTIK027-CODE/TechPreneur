"use client";

import { useEffect, useState } from "react";
import { X, Calendar, CheckCircle, Clock, Star, Target, TrendingUp, Award, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { analyticsApi, MemberAnalytics } from "@/lib/api/analytics";
import { getInitials } from "@/lib/utils";
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
    Line
} from "recharts";

interface MemberDetailModalProps {
    memberId: string;
    onClose: () => void;
    initialData?: MemberAnalytics;
}

const COLORS = ['#8b5cf6', '#ef4444', '#f59e0b', '#10b981'];

export default function MemberDetailModal({ memberId, onClose, initialData }: MemberDetailModalProps) {
    const [data, setData] = useState<MemberAnalytics | null>(null);
    const [loading, setLoading] = useState(!initialData);
    const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'performance'>('overview');

    useEffect(() => {
        if (initialData) {
            setData(initialData);
            setLoading(false);
        } else {
            loadData();
        }
    }, [memberId, initialData]);

    const loadData = async () => {
        try {
            setLoading(true);
            const analytics = await analyticsApi.getMemberAnalytics(memberId);
            setData(analytics);
        } catch (error) {
            console.error("Failed to load member analytics", error);
        } finally {
            setLoading(false);
        }
    };

    if (!memberId) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-start bg-slate-900/50">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                            {getInitials(data?.profile?.name || "") || "?"}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{data?.profile?.name || "Loading..."}</h2>
                            <div className="flex items-center gap-3 text-slate-400 mt-1">
                                <span className="flex items-center gap-1 text-sm bg-white/5 px-2 py-0.5 rounded-full">
                                    <Target className="w-3 h-3" /> {data?.profile?.role || "Team Member"}
                                </span>
                                <span className="flex items-center gap-1 text-sm bg-white/5 px-2 py-0.5 rounded-full">
                                    <Award className="w-3 h-3" /> {data?.profile?.department || "General"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 px-6 bg-slate-900/50">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview'
                            ? 'border-indigo-500 text-indigo-400'
                            : 'border-transparent text-slate-400 hover:text-white'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tasks'
                            ? 'border-indigo-500 text-indigo-400'
                            : 'border-transparent text-slate-400 hover:text-white'
                            }`}
                    >
                        Task Analytics
                    </button>
                    <button
                        onClick={() => setActiveTab('performance')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'performance'
                            ? 'border-indigo-500 text-indigo-400'
                            : 'border-transparent text-slate-400 hover:text-white'
                            }`}
                    >
                        Performance
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : data ? (
                        <div className="space-y-6">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
                                        <h3 className="text-slate-400 text-sm font-medium mb-4 flex items-center gap-2">
                                            <Star className="w-4 h-4 text-amber-400" /> Average Rating
                                        </h3>
                                        <div className="flex items-end gap-2">
                                            <span className="text-4xl font-bold text-white">{data.analytics.avgRating}</span>
                                            <span className="text-slate-500 mb-1">/ 5.0</span>
                                        </div>
                                        <div className="mt-4 flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-5 h-5 ${star <= Math.round(data.analytics.avgRating)
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'fill-slate-800 text-slate-800'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
                                        <h3 className="text-slate-400 text-sm font-medium mb-4 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-400" /> Task Completion
                                        </h3>
                                        <div className="flex items-end gap-2">
                                            <span className="text-4xl font-bold text-white">
                                                {data.analytics.taskDistribution['completed'] || 0}
                                            </span>
                                            <span className="text-slate-500 mb-1">completed</span>
                                        </div>
                                        <div className="mt-4 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-green-500 h-full rounded-full"
                                                style={{
                                                    width: `${((data.analytics.taskDistribution['completed'] || 0) /
                                                        (Object.values(data.analytics.taskDistribution).reduce((a, b) => a + b, 0) || 1)) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
                                        <h3 className="text-slate-400 text-sm font-medium mb-4 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-blue-400" /> Recent Activity
                                        </h3>
                                        <div className="h-24">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={data.analytics.weeklyActivity} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                                    <Line type="monotone" dataKey="count" stroke="#60a5fa" strokeWidth={2} dot={false} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                                        itemStyle={{ color: '#f8fafc' }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tasks Tab */}
                            {activeTab === 'tasks' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-900 border border-white/10 rounded-xl p-6 h-80">
                                        <h3 className="text-white font-medium mb-6">Task Status Distribution</h3>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={Object.entries(data.analytics.taskDistribution).map(([name, value]) => ({ name, value }))}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {Object.entries(data.analytics.taskDistribution).map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                                />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="bg-slate-900 border border-white/10 rounded-xl p-6 h-80">
                                        <h3 className="text-white font-medium mb-6">Weekly Completion Trend</h3>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={data.analytics.weeklyActivity}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                                <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `Week ${val}`} />
                                                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                                                <Tooltip
                                                    cursor={{ fill: '#334155', opacity: 0.2 }}
                                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                                />
                                                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}

                            {/* Performance Tab */}
                            {activeTab === 'performance' && (
                                <div className="space-y-6">
                                    <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
                                        <h3 className="text-white font-medium mb-6">Performance Reviews</h3>
                                        {data.reviews.length === 0 ? (
                                            <div className="text-center py-12 text-slate-500">
                                                No reviews submitted yet.
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {data.reviews.map((review: any) => (
                                                    <div key={review._id} className="bg-slate-950/50 border border-white/5 rounded-lg p-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-white font-medium">{review.reviewer.name}</span>
                                                                <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full">
                                                                    {review.reviewer.role}
                                                                </span>
                                                            </div>
                                                            <div className="flex text-amber-400">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-700'}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-slate-300 text-sm leading-relaxed mb-3">
                                                            {review.feedback}
                                                        </p>

                                                        {review.metrics && (
                                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5">
                                                                {Object.entries(review.metrics).map(([key, value]: [string, any]) => (
                                                                    <div key={key}>
                                                                        <span className="text-xs text-slate-500 capitalize">{key}</span>
                                                                        <div className="flex items-center gap-1 mt-1">
                                                                            <span className="text-sm font-bold text-white">{value}</span>
                                                                            <Star className="w-3 h-3 text-amber-500/50 fill-amber-500/50" />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="mt-3 text-xs text-slate-500 text-right">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            Failed to load data
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
