"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Sparkles, Loader } from "lucide-react";
import { ideaApi } from "@/lib/api/idea";

const CATEGORIES = [
    { id: 'feature', label: 'Feature' },
    { id: 'product', label: 'Product' },
    { id: 'process', label: 'Process' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'other', label: 'Other' }
];

const PRIORITIES = [
    { id: 'low', label: 'Low' },
    { id: 'medium', label: 'Medium' },
    { id: 'high', label: 'High' },
    { id: 'critical', label: 'Critical' }
];

interface SubmitIdeaModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function SubmitIdeaModal({ onClose, onSuccess }: SubmitIdeaModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'feature',
        priority: 'medium',
        tags: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [aiPreview, setAiPreview] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

            const idea = await ideaApi.createIdea({
                title: formData.title,
                description: formData.description,
                category: formData.category as any,
                priority: formData.priority as any,
                tags: tagsArray
            });

            // Trigger AI analysis asynchronously
            ideaApi.analyzeIdea(idea._id).catch(err => console.error('AI analysis failed:', err));

            onSuccess();
        } catch (error: any) {
            console.error('Failed to submit idea:', error);
            console.error('Error response:', error.response);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to submit idea. Please try again.';
            alert(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAIPreview = async () => {
        if (!formData.title || !formData.description) {
            alert('Please fill in title and description first');
            return;
        }

        try {
            setAnalyzing(true);
            // Create temporary idea to analyze
            const idea = await ideaApi.createIdea({
                title: formData.title,
                description: formData.description,
                category: formData.category as any,
                priority: formData.priority as any,
                tags: []
            });

            const analysis = await ideaApi.analyzeIdea(idea._id);
            setAiPreview(analysis.analysis);

            // Delete temporary idea
            await ideaApi.deleteIdea(idea._id);
        } catch (error) {
            console.error('AI preview failed:', error);
            alert('AI preview failed. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                    <h2 className="text-2xl font-bold text-white">Submit New Idea</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            maxLength={200}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Brief, descriptive title for your idea..."
                            className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            required
                            maxLength={2000}
                            rows={6}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your idea in detail. What problem does it solve? How would it work?"
                            className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                        />
                        <div className="text-right text-xs text-slate-400 mt-1">
                            {formData.description.length}/2000
                        </div>
                    </div>

                    {/* Category & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Priority
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            >
                                {PRIORITIES.map(pri => (
                                    <option key={pri.id} value={pri.id}>{pri.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Tags (optional)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="e.g., mobile, analytics, customer-facing (comma-separated)"
                            className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* AI Preview Section */}
                    {aiPreview && (
                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <div className="flex items-center gap-2 text-purple-400 mb-3">
                                <Sparkles className="w-5 h-5" />
                                <span className="font-bold">AI Analysis Preview</span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Feasibility:</span>
                                    <span className="text-white font-medium">{aiPreview.feasibility}/10</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Market Potential:</span>
                                    <span className="text-white font-medium">{aiPreview.marketPotential}/10</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Recommendation:</span>
                                    <span className={`font-medium capitalize ${aiPreview.recommendation === 'approve' ? 'text-green-400' :
                                        aiPreview.recommendation === 'reject' ? 'text-red-400' : 'text-yellow-400'
                                        }`}>
                                        {aiPreview.recommendation}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleAIPreview}
                            disabled={analyzing || !formData.title || !formData.description}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/20 text-purple-400 rounded-lg font-medium hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {analyzing ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Get AI Preview
                                </>
                            )}
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Submitting...' : 'Submit Idea'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
