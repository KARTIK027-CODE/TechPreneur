"use client";

import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type TaskStatus = "todo" | "in-progress" | "done";

interface Task {
    id: string;
    title: string;
    tag: string;
    status: TaskStatus;
}

const initialTasks: Task[] = [
    { id: "1", title: "Define MVP Features", tag: "Planning", status: "done" },
    { id: "2", title: "Set up Database Schema", tag: "Engineering", status: "in-progress" },
    { id: "3", title: "Design Login Flow", tag: "Design", status: "todo" },
    { id: "4", title: "Research Competitors", tag: "Marketing", status: "todo" },
];

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const moveTask = (id: string, newStatus: TaskStatus) => {
        setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tasks & Milestones</h1>
                    <p className="text-muted-foreground">Manage your sprint and track progress.</p>
                </div>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 gap-2">
                    <Plus className="w-4 h-4" />
                    Add Task
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 h-full">
                <TaskColumn
                    title="To Do"
                    status="todo"
                    tasks={tasks.filter((t) => t.status === "todo")}
                    onMove={moveTask}
                />
                <TaskColumn
                    title="In Progress"
                    status="in-progress"
                    tasks={tasks.filter((t) => t.status === "in-progress")}
                    onMove={moveTask}
                />
                <TaskColumn
                    title="Done"
                    status="done"
                    tasks={tasks.filter((t) => t.status === "done")}
                    onMove={moveTask}
                />
            </div>
        </div>
    );
}

function TaskColumn({ title, status, tasks, onMove }: { title: string; status: TaskStatus; tasks: Task[]; onMove: (id: string, s: TaskStatus) => void }) {
    return (
        <div className="flex flex-col h-full rounded-xl border border-border bg-secondary/30 p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <span className="flex items-center justify-center bg-secondary text-secondary-foreground text-xs font-medium h-5 w-5 rounded-full border border-border">
                        {tasks.length}
                    </span>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 space-y-3">
                {tasks.map((task) => (
                    <div key={task.id} className="group flex flex-col gap-2 p-3 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                                {task.tag}
                            </span>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>
                        <p className="text-sm font-medium leading-normal">{task.title}</p>

                        <div className="pt-2 flex gap-2 mt-auto">
                            {status !== 'todo' && (
                                <button
                                    onClick={() => onMove(task.id, 'todo')}
                                    className="text-[10px] border border-border px-2 py-1 rounded bg-muted hover:bg-muted/80"
                                >
                                    ← To Do
                                </button>
                            )}
                            {status !== 'in-progress' && (
                                <button
                                    onClick={() => onMove(task.id, 'in-progress')}
                                    className="text-[10px] border border-border px-2 py-1 rounded bg-muted hover:bg-muted/80"
                                >
                                    {status === 'todo' ? 'Start →' : '← Reopen'}
                                </button>
                            )}
                            {status !== 'done' && (
                                <button
                                    onClick={() => onMove(task.id, 'done')}
                                    className="text-[10px] border border-border px-2 py-1 rounded bg-muted hover:bg-muted/80 ml-auto"
                                >
                                    Done ✓
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <button className="w-full py-2 text-sm text-muted-foreground border border-dashed border-border rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add Item
                </button>
            </div>
        </div>
    );
}
