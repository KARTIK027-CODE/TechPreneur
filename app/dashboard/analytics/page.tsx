"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

const taskData = [
    { name: "Mon", completed: 4 },
    { name: "Tue", completed: 3 },
    { name: "Wed", completed: 2 },
    { name: "Thu", completed: 6 },
    { name: "Fri", completed: 8 },
    { name: "Sat", completed: 4 },
    { name: "Sun", completed: 1 },
];

const growthData = [
    { name: "Week 1", users: 10 },
    { name: "Week 2", users: 25 },
    { name: "Week 3", users: 40 },
    { name: "Week 4", users: 80 },
];

const milestoneData = [
    { name: "Done", value: 3 },
    { name: "In Progress", value: 2 },
    { name: "To Do", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
                    <p className="text-muted-foreground">Detailed metrics to impress your investors.</p>
                </div>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
                    Export PDF
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Burn Rate" value="$2,400/mo" icon={DollarSign} trend="-5%" trendUp={true} />
                <MetricCard title="Task Velocity" value="4.2 tasks/day" icon={Activity} trend="+12%" trendUp={true} />
                <MetricCard title="User Growth" value="+24%" icon={Users} trend="+8%" trendUp={true} />
                <MetricCard title="Runway" value="8 Months" icon={TrendingUp} trend="Stable" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Task Velocity Chart */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">Task Completion</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={taskData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Bar dataKey="completed" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* User Growth Chart */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">User Acquisition</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="users" stroke="#82ca9d" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Milestone Progress */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Milestone Status</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={milestoneData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {milestoneData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0088FE]"></span> Done</div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00C49F]"></span> In Progress</div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FFBB28]"></span> To Do</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, trend, trendUp }: any) {
    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <h3 className="text-2xl font-bold mt-1">{value}</h3>
                {trend && (
                    <p className={`text-xs mt-1 ${trendUp ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {trend}
                    </p>
                )}
            </div>
            <div className="p-3 bg-secondary/50 rounded-full">
                <Icon className="w-5 h-5 text-primary" />
            </div>
        </div>
    )
}
