"use client";

import { useState } from "react";
import {
    Users,
    Search,
    MoreVertical,
    Mail,
    Clock,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for Employees
const employees = [
    {
        id: 1,
        name: "Sarah Chen",
        role: "Marketing Lead",
        department: "Marketing",
        email: "sarah@hippo.com",
        status: "online",
        tasksCompleted: 92,
        tasksPending: 3,
        avgResponseTime: "12m",
        avatar: "SC"
    },
    {
        id: 2,
        name: "Mike Ross",
        role: "Senior Developer",
        department: "Tech",
        email: "mike@hippo.com",
        status: "busy",
        tasksCompleted: 45,
        tasksPending: 8,
        avgResponseTime: "45m",
        avatar: "MR"
    },
    {
        id: 3,
        name: "Jessica Pearson",
        role: "CFO",
        department: "Finance",
        email: "jessica@hippo.com",
        status: "offline",
        tasksCompleted: 128,
        tasksPending: 0,
        avgResponseTime: "2h",
        avatar: "JP"
    },
    {
        id: 4,
        name: "Rachel Zane",
        role: "HR Manager",
        department: "HR",
        email: "rachel@hippo.com",
        status: "online",
        tasksCompleted: 64,
        tasksPending: 2,
        avgResponseTime: "5m",
        avatar: "RZ"
    },
    {
        id: 5,
        name: "Harvey Specter",
        role: "Legal Advisor",
        department: "Legal",
        email: "harvey@hippo.com",
        status: "busy",
        tasksCompleted: 88,
        tasksPending: 1,
        avgResponseTime: "10m",
        avatar: "HS"
    }
];

export default function TeamPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">Total Team</span>
                    </div>
                    <div className="text-2xl font-bold text-white">12 Members</div>
                </div>
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">Tasks Done</span>
                    </div>
                    <div className="text-2xl font-bold text-white">84%</div>
                </div>
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                            <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">On Track</span>
                    </div>
                    <div className="text-2xl font-bold text-white">9/12 Projects</div>
                </div>
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">Productivity</span>
                    </div>
                    <div className="text-2xl font-bold text-white">+12% <span className="text-xs font-normal text-slate-500">vs last week</span></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">Team Performance</h2>
                        <p className="text-sm text-slate-400">Monitor activity, task status, and workload.</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search member..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-950 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors w-64"
                        />
                    </div>
                </div>

                <table className="w-full">
                    <thead className="bg-slate-950/50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Role & Dept</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Task Completion</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredEmployees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-sm font-bold text-white border border-white/10">
                                            {emp.avatar}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white">{emp.name}</div>
                                            <div className="text-xs text-slate-500">{emp.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-200">{emp.role}</div>
                                    <div className="text-xs text-slate-500">{emp.department}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-2 h-2 rounded-full animate-pulse",
                                            emp.status === 'online' ? "bg-emerald-500" :
                                                emp.status === 'busy' ? "bg-amber-500" : "bg-slate-500"
                                        )}></div>
                                        <span className={cn("text-sm capitalization",
                                            emp.status === 'online' ? "text-emerald-400" :
                                                emp.status === 'busy' ? "text-amber-400" : "text-slate-500"
                                        )}>{emp.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full"
                                                style={{ width: `${(emp.tasksCompleted / (emp.tasksCompleted + emp.tasksPending)) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-slate-400">{emp.tasksCompleted} / {emp.tasksCompleted + emp.tasksPending}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button className="text-slate-400 hover:text-white p-2">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
