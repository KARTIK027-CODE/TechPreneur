"use client";

import { ThumbsUp, ThumbsDown, MessageSquare, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const feedbacks = [
    {
        id: 1,
        user: "Mentor - Sarah",
        content: "The onboarding flow is a bit confusing. Maybe simplify the role selection?",
        sentiment: "neutral",
        status: "new",
        date: "2h ago",
    },
    {
        id: 2,
        user: "Beta User - Mike",
        content: "Love the dark mode! It looks very premium.",
        sentiment: "positive",
        status: "validated",
        date: "5h ago",
    },
    {
        id: 3,
        user: "Investor - Risky Ventures",
        content: "Need to see more traction on the user retention side before we commit.",
        sentiment: "negative",
        status: "new",
        date: "1d ago",
    },
];

export default function FeedbackPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Feedback & Validation</h1>
                    <p className="text-muted-foreground">Gather insights from users, mentors, and investors.</p>
                </div>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
                    Create Survey
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {feedbacks.map((item) => (
                    <div key={item.id} className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4 relative">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center",
                                    item.sentiment === 'positive' ? "bg-green-100 text-green-600" :
                                        item.sentiment === 'negative' ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
                                )}>
                                    {item.sentiment === 'positive' ? <ThumbsUp className="w-4 h-4" /> :
                                        item.sentiment === 'negative' ? <ThumbsDown className="w-4 h-4" /> :
                                            <MessageSquare className="w-4 h-4" />}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">{item.user}</h4>
                                    <p className="text-xs text-muted-foreground">{item.date}</p>
                                </div>
                            </div>
                            <button className="text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-sm text-foreground/80 leading-relaxed">
                            "{item.content}"
                        </p>

                        <div className="mt-auto pt-4 flex gap-2">
                            <button className="flex-1 text-xs border border-border rounded py-1.5 hover:bg-secondary transition-colors">
                                Reply
                            </button>
                            <button className="flex-1 text-xs bg-primary text-primary-foreground rounded py-1.5 hover:bg-primary/90 transition-colors">
                                Validate
                            </button>
                        </div>
                    </div>
                ))}

                {/* Placeholder for 'Add New' visual */}
                <div className="rounded-xl border-2 border-dashed border-border p-6 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 hover:bg-secondary/50 transition-all cursor-pointer min-h-[200px]">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
                        <MessageSquare className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">Connect Source</h3>
                    <p className="text-sm text-muted-foreground">Integrate Typeform, Google Forms, or manual entry.</p>
                </div>
            </div>
        </div>
    );
}
