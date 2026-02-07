"use client";

import { useState } from "react";
import { Lightbulb, X, Sparkles, Zap, DollarSign, Target, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


export default function IdeaAnalyzer() {
    const [isOpen, setIsOpen] = useState(false);
    const [idea, setIdea] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!idea.trim()) return;

        setLoading(true);
        try {
            const response = await fetch('/api/analyze-idea', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea })
            });

            const data = await response.json();
            if (data.analysis) {
                setAnalysis(data.analysis);
            } else if (data.error) {
                console.error("API Error:", data.error);
                // Optionally show error to user in UI
                alert(data.error);
            }
        } catch (error) {
            console.error("Failed to analyze idea:", error);
            alert("Failed to connect to the server. Please check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Trigger Button/Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-1 md:col-span-2 lg:col-span-4 p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900/40 border border-indigo-500/30 cursor-pointer hover:border-indigo-400 group relative overflow-hidden"
                onClick={() => setIsOpen(true)}
            >
                <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors"></div>
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors"></div>

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">NEW FEATURE</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-amber-400" />
                            Validate Your Startup Idea
                        </h2>
                        <p className="text-slate-300 max-w-2xl">
                            Unsure if your idea is scalable? Use our AI-powered analyzer to get instant feedback on market fit, scalability, and minimal-cost launch strategies.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/50 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6" />
                    </div>
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-500/20">
                                        <Lightbulb className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Idea Strength Analyzer</h2>
                                        <p className="text-sm text-slate-400">Get AI feedback on scalability & cost</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {!analysis ? (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Describe your startup idea in detail
                                            </label>
                                            <textarea
                                                value={idea}
                                                onChange={(e) => setIdea(e.target.value)}
                                                placeholder="e.g. A marketplace for renting high-end camera gear directly from other photographers with built-in insurance..."
                                                className="w-full h-40 bg-slate-950 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                            />
                                        </div>

                                        <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4">
                                            <h4 className="text-indigo-300 font-medium mb-2 flex items-center gap-2">
                                                <Target className="w-4 h-4" /> What you'll get:
                                            </h4>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-400">
                                                <li className="flex items-center gap-2">• Scalability Rating (1-10)</li>
                                                <li className="flex items-center gap-2">• Target Audience Persona</li>
                                                <li className="flex items-center gap-2">• Future "Unicorn" Additions</li>
                                                <li className="flex items-center gap-2">• $0 Cost MVP Strategy</li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="prose prose-invert prose-indigo max-w-none whitespace-pre-wrap">
                                        {analysis}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {!analysis ? (
                                <div className="p-6 border-t border-white/10 bg-slate-900/50 flex justify-end">
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={loading || !idea.trim()}
                                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4" /> Analyze Idea
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="p-6 border-t border-white/10 bg-slate-900/50 flex justify-between items-center">
                                    <button
                                        onClick={() => setAnalysis(null)}
                                        className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                                    >
                                        Analyze Another
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="px-6 py-2.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
