"use client";

import { useEffect, useState } from "react";
import { CheckSquare, Plus, Loader2, Calendar, Flag, X, Users2 } from "lucide-react";
import { taskApi } from "@/lib/api/tasks";
import { startupApi } from "@/lib/api/startup";
import { useAuth } from "@/contexts/AuthContext";
import { Milestone, Task } from "@/types";

const DEPARTMENTS = [
    "Business",
    "Marketing",
    "Development",
    "Sales",
    "Operations",
    "Finance",
    "HR",
    "Product"
];

export default function TasksPage() {
    const { user } = useAuth();
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Modal states
    const [showMilestoneForm, setShowMilestoneForm] = useState(false);
    const [showTaskForm, setShowTaskForm] = useState(false);

    // Form fields - Milestone
    const [milestoneTitle, setMilestoneTitle] = useState("");
    const [milestoneDesc, setMilestoneDesc] = useState("");
    const [milestoneDate, setMilestoneDate] = useState("");

    // Form fields - Task
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [taskMilestone, setTaskMilestone] = useState("");
    const [taskDepartment, setTaskDepartment] = useState("");
    const [taskAssignedTo, setTaskAssignedTo] = useState("");
    const [taskDeadline, setTaskDeadline] = useState("");

    const isFounder = user?.role === "founder";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [milestonesData, tasksData, startupData] = await Promise.all([
                taskApi.getMilestones(),
                taskApi.getTasks(),
                startupApi.getProfile()
            ]);
            // Filter data based on user role and department
            let filteredTasksData = tasksData;
            let filteredMilestonesData = milestonesData;

            if (user?.role === 'team_member' && user?.department) {
                filteredTasksData = tasksData.filter((t: any) => t.department === user.department);
                filteredMilestonesData = milestonesData.filter((m: any) => m.department === user.department);
            }

            setMilestones(filteredMilestonesData);
            setTasks(filteredTasksData);
            if (startupData) {
                setTeamMembers(startupData.teamMembers || []);
            }
        } catch (err: any) {
            setError("Failed to load tasks and milestones");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMilestone = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await taskApi.createMilestone({
                title: milestoneTitle,
                description: milestoneDesc,
                targetDate: milestoneDate
            });
            setShowMilestoneForm(false);
            resetMilestoneForm();
            fetchData();
            setSuccess("Milestone created successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create milestone");
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        // Milestone is now optional - allow task creation without milestone

        try {
            const taskData: any = {
                title: taskTitle,
                description: taskDesc,
                priority: taskPriority,
                assignedTo: taskAssignedTo || undefined,
                department: taskDepartment || (user?.role === 'team_member' && user.department ? user.department : undefined)
            };

            // Only include milestoneId if one is selected
            if (taskMilestone) {
                taskData.milestoneId = taskMilestone;
            }

            await taskApi.createTask(taskData);
            setShowTaskForm(false);
            resetTaskForm();
            fetchData();
            setSuccess("Task created successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create task");
        }
    };

    const handleUpdateTaskStatus = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'completed') => {
        try {
            await taskApi.updateTask(taskId, { status: newStatus });
            fetchData();
        } catch (err: any) {
            setError("Failed to update task status");
        }
    };

    const resetMilestoneForm = () => {
        setMilestoneTitle("");
        setMilestoneDesc("");
        setMilestoneDate("");
    };

    const resetTaskForm = () => {
        setTaskTitle("");
        setTaskDesc("");
        setTaskPriority('medium');
        setTaskMilestone("");
        setTaskDepartment("");
        setTaskAssignedTo("");
        setTaskDeadline("");
    };

    const filteredTasks = selectedMilestone
        ? tasks.filter(task => task.milestoneId === selectedMilestone)
        : tasks;

    const todoTasks = filteredTasks.filter(t => t.status === 'todo');
    const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
    const completedTasks = filteredTasks.filter(t => t.status === 'completed');

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Tasks & Milestones</h1>
                    <p className="text-slate-400 mt-2">Organize and track your startup execution</p>
                </div>
                <div className="flex gap-3">
                    {user?.role === 'founder' && (
                        <>
                            <button
                                onClick={() => setShowMilestoneForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                New Milestone
                            </button>
                            <button
                                onClick={() => setShowTaskForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                New Task
                            </button>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                </div>
            )}

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Milestones Sidebar */}
                <div className="w-80 flex flex-col bg-slate-900/50 rounded-xl border border-white/10 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-white">Milestones</h3>
                        <button
                            onClick={() => setSelectedMilestone(null)}
                            className={`text-sm px-3 py-1 rounded ${!selectedMilestone ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            All
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3">
                        {milestones.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-8">No milestones yet</p>
                        ) : (
                            milestones.map((milestone) => {
                                const milestoneTasks = tasks.filter(t => t.milestoneId === milestone._id);
                                const completed = milestoneTasks.filter(t => t.status === 'completed').length;
                                const total = milestoneTasks.length;
                                const progress = total > 0 ? (completed / total) * 100 : 0;

                                return (
                                    <button
                                        key={milestone._id}
                                        onClick={() => setSelectedMilestone(milestone._id)}
                                        className={`w-full text-left p-4 rounded-lg border transition-all ${selectedMilestone === milestone._id
                                            ? 'bg-indigo-600/20 border-indigo-500/50'
                                            : 'bg-slate-950 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-medium text-white text-sm">{milestone.title}</h4>
                                            <span className={`text-xs px-2 py-0.5 rounded capitalize ${milestone.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                milestone.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-slate-500/20 text-slate-400'
                                                }`}>
                                                {milestone.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                                            <div
                                                className="bg-indigo-500 h-1.5 rounded-full transition-all"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400">{completed}/{total} tasks completed</p>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="flex-1 grid grid-cols-3 gap-4">
                    {/* To-Do Column */}
                    <TaskColumn
                        title="To-Do"
                        tasks={todoTasks}
                        color="slate"
                        onStatusChange={handleUpdateTaskStatus}
                        getPriorityColor={getPriorityColor}
                    />

                    {/* In Progress Column */}
                    <TaskColumn
                        title="In Progress"
                        tasks={inProgressTasks}
                        color="blue"
                        onStatusChange={handleUpdateTaskStatus}
                        getPriorityColor={getPriorityColor}
                    />

                    {/* Completed Column */}
                    <TaskColumn
                        title="Completed"
                        tasks={completedTasks}
                        color="green"
                        onStatusChange={handleUpdateTaskStatus}
                        getPriorityColor={getPriorityColor}
                    />
                </div>
            </div>

            {/* Milestone Form Modal */}
            {showMilestoneForm && (
                <FormModal title="Create Milestone" onClose={() => setShowMilestoneForm(false)}>
                    <form onSubmit={handleCreateMilestone} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300">Title</label>
                            <input
                                value={milestoneTitle}
                                onChange={(e) => setMilestoneTitle(e.target.value)}
                                required
                                className="mt-1 flex h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300">Description</label>
                            <textarea
                                value={milestoneDesc}
                                onChange={(e) => setMilestoneDesc(e.target.value)}
                                rows={3}
                                className="mt-1 flex w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300">Target Date</label>
                            <input
                                type="date"
                                value={milestoneDate}
                                onChange={(e) => setMilestoneDate(e.target.value)}
                                className="mt-1 flex h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowMilestoneForm(false)}
                                className="flex-1 px-4 py-2 border border-white/10 bg-transparent hover:bg-white/5 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </FormModal>
            )}

            {/* Task Form Modal - Enhanced */}
            {showTaskForm && (
                <FormModal title="Create New Task" onClose={() => setShowTaskForm(false)}>
                    <form onSubmit={handleCreateTask} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300">Task Title</label>
                            <input
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                required
                                placeholder="e.g., Design landing page"
                                className="mt-1 flex h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300">Description</label>
                            <textarea
                                value={taskDesc}
                                onChange={(e) => setTaskDesc(e.target.value)}
                                rows={3}
                                placeholder="Describe the task details..."
                                className="mt-1 flex w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-300">Milestone (Optional)</label>
                                <select
                                    value={taskMilestone}
                                    onChange={(e) => setTaskMilestone(e.target.value)}
                                    className="mt-1 flex h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                                >
                                    <option value="">No milestone</option>
                                    {milestones.map(m => (
                                        <option key={m._id} value={m._id}>{m.title}</option>
                                    ))}
                                </select>
                                {milestones.length === 0 && (
                                    <p className="text-xs text-amber-500 mt-1">Create a milestone first for better organization</p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300">Priority</label>
                                <select
                                    value={taskPriority}
                                    onChange={(e) => setTaskPriority(e.target.value as any)}
                                    className="mt-1 flex h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Users2 className="w-4 h-4" />
                                Department (Optional)
                            </label>
                            <select
                                value={taskDepartment}
                                onChange={(e) => setTaskDepartment(e.target.value)}
                                className="mt-1 flex h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                            >
                                <option value="">Select department</option>
                                {DEPARTMENTS.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-500 mt-1">Assign to a department head</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300">Assign To (Optional)</label>
                            <select
                                value={taskAssignedTo}
                                onChange={(e) => setTaskAssignedTo(e.target.value)}
                                className="mt-1 flex h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                            >
                                <option value="">Unassigned</option>
                                {teamMembers.map((member: any) => (
                                    <option key={member._id} value={member._id}>
                                        {member.name} ({member.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowTaskForm(false)}
                                className="flex-1 px-4 py-2 border border-white/10 bg-transparent hover:bg-white/5 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
                            >
                                Create Task
                            </button>
                        </div>
                    </form>
                </FormModal>
            )}
        </div>
    );
}

// Task Column Component
function TaskColumn({ title, tasks, color, onStatusChange, getPriorityColor }: any) {
    const dotColor = color === 'green' ? 'bg-green-400' : color === 'blue' ? 'bg-blue-400' : 'bg-slate-400';

    return (
        <div className="flex flex-col bg-slate-900/30 rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
                <h3 className="font-semibold text-white">{title}</h3>
                <span className="ml-auto text-sm text-slate-400">{tasks.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
                {tasks.map((task: Task) => (
                    <TaskCard
                        key={task._id}
                        task={task}
                        onStatusChange={onStatusChange}
                        getPriorityColor={getPriorityColor}
                    />
                ))}
            </div>
        </div>
    );
}

// TaskCard Component
function TaskCard({ task, onStatusChange, getPriorityColor }: {
    task: Task;
    onStatusChange: (id: string, status: 'todo' | 'in_progress' | 'completed') => void;
    getPriorityColor: (priority: string) => string;
}) {
    return (
        <div className="bg-slate-950 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-white text-sm flex-1">{task.title}</h4>
                <span className={`text-xs px-2 py-0.5 rounded border capitalize ml-2 ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
            </div>
            {task.description && (
                <p className="text-sm text-slate-400 mb-3">{task.description}</p>
            )}
            {task.assignedTo && (
                <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
                    <Users2 className="w-3 h-3" />
                    {task.assignedTo.name}
                </div>
            )}
            <select
                value={task.status}
                onChange={(e) => onStatusChange(task._id, e.target.value as any)}
                className="w-full text-xs px-2 py-1.5 rounded border border-white/10 bg-slate-900 text-white"
            >
                <option value="todo">To-Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>
        </div>
    );
}

// Form Modal Component
function FormModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-slate-900 p-6 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
