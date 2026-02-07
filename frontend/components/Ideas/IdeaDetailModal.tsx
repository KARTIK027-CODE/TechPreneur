"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    X,
    Bot,
    MessageCircle,
    ThumbsUp,
    ThumbsDown,
    Send,
    Crown,
    Target,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Sparkles,
    Loader
} from "lucide-react";
import { ideaApi } from "@/lib/api/idea";
import { useAuth } from "@/contexts/AuthContext";

interface IdeaDetailModalProps {
    idea: any;
    onClose: () => void;
    onUpdate: () => void;
}

export default function IdeaDetailModal({ idea: initialIdea, onClose, onUpdate }: IdeaDetailModalProps) {
    const { user } = useAuth();
    const [idea, setIdea] = useState(initialIdea);
    const [feedback, setFeedback] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [analyzingAI, setAnalyzingAI] = useState(false);
    const [loadingFeedback, setLoadingFeedback] = useState(true);

    useEffect(() => {
        fetchFeedback();
        fetchLatestIdea();
    }, []);

    const fetchLatestIdea = async () => {
        try {
            const latest = await ideaApi.getIdeaById(idea._id);
            setIdea(latest);
        } catch (error) {
            console.error('Failed to fetch idea:', error);
        }
    };

    const fetchFeedback = async () => {
        try {
            const data = await ideaApi.getFeedback(idea._id);
            setFeedback(data);
        } catch (error) {
            console.error('Failed to fetch feedback:', error);
        } finally {
            setLoadingFeedback(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        try {
            setSubmittingComment(true);
            await ideaApi.submitFeedback(idea._id, { content: newComment });
            setNewComment('');
            fetchFeedback();
        } catch (error) {
            console.error('Failed to submit comment:', error);
            alert('Failed to submit comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleRequestAIAnalysis = async () => {
        try {
            setAnalyzingAI(true);
            await ideaApi.analyzeIdea(idea._id);
            fetchLatestIdea();
            fetchFeedback();
        } catch (error) {
            console.error('AI analysis failed:', error);
            alert('AI analysis failed. Please try again.');
        } finally {
            setAnalyzingAI(false);
        }
    };

    const handleVote = async (vote: 'upvote' | 'downvote') => {
        try {
            await ideaApi.voteOnIdea(idea._id, vote);
            fetchLatestIdea();
            onUpdate();
        } catch (error) {
            console.error('Vote failed:', error);
        }
    };

    const getUserVote = (): 'upvote' | 'downvote' | null => {
        if (!user) return null;
        const userVote = idea.votingStats.voters.find((v: any) => v.user === user._id);
        return userVote ? userVote.vote : null;
    };

    const userVote = getUserVote();

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
                className="bg-slate-900 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded text-sm font-medium">
                                    {idea.category}
                                </span>
                                <span className={`px-3 py-1 rounded text-sm font-medium ${idea.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                    idea.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                        idea.status === 'under-review' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {idea.status}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">{idea.title}</h2>
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <span className="flex items-center gap-1">
                                    By {idea.submittedBy.name}
                                    {idea.submittedBy.role === 'founder' && (
                                        <Crown className="w-3 h-3 text-amber-400 ml-1" />
                                    )}
                                </span>
                                <span>•</span>
                                <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Voting */}
                    <div className="flex items-center gap-4 mt-4">
                        <button
                            onClick={() => handleVote('upvote')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${userVote === 'upvote'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            <ThumbsUp className="w-5 h-5" />
                            <span className="font-medium">{idea.votingStats.upvotes}</span>
                        </button>
                        <button
                            onClick={() => handleVote('downvote')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${userVote === 'downvote'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            <ThumbsDown className="w-5 h-5" />
                            <span className="font-medium">{idea.votingStats.downvotes}</span>
                        </button>
                        {idea.votingStats.boardApprovals > 0 && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg">
                                <Crown className="w-5 h-5" />
                                <span className="font-medium">{idea.votingStats.boardApprovals} Board Approval{idea.votingStats.boardApprovals > 1 ? 's' : ''}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3">Description</h3>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {idea.description}
                        </p>
                    </div>

                    {/* Tags */}
                    {idea.tags && idea.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {idea.tags.map((tag: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* AI Analysis */}
                    {idea.aiAnalysis ? (
                        <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl p-6">
                            <div className="flex items-center gap-2 text-purple-400 mb-4">
                                <Bot className="w-6 h-6" />
                                <h3 className="text-lg font-bold">AI Analysis</h3>
                                <span className="ml-auto px-3 py-1 bg-purple-500/20 rounded text-sm font-medium">
                                    Score: {idea.aiScore || 0}/10
                                </span>
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {idea.aiAnalysis?.feasibility || 0}/10
                                    </div>
                                    <div className="text-sm text-slate-400">Feasibility</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {idea.aiAnalysis?.marketPotential || 0}/10
                                    </div>
                                    <div className="text-sm text-slate-400">Market Potential</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {idea.aiAnalysis?.technicalComplexity || 0}/10
                                    </div>
                                    <div className="text-sm text-slate-400">Complexity</div>
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${idea.aiAnalysis.recommendation === 'approve' ? 'bg-green-500/20 text-green-400' :
                                idea.aiAnalysis.recommendation === 'reject' ? 'bg-red-500/20 text-red-400' :
                                    'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {idea.aiAnalysis.recommendation === 'approve' ? <CheckCircle className="w-5 h-5" /> :
                                    idea.aiAnalysis.recommendation === 'reject' ? <X className="w-5 h-5" /> :
                                        <AlertCircle className="w-5 h-5" />}
                                <span className="font-medium capitalize">
                                    AI Recommendation: {(idea.aiAnalysis?.recommendation || 'needs-work').replace(/-/g, ' ')}
                                </span>
                            </div>

                            {/* Details */}
                            {idea.aiAnalysis.pros && idea.aiAnalysis.pros.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-bold text-green-400 mb-2">✓ Pros</h4>
                                    <ul className="space-y-1 text-sm text-slate-300">
                                        {idea.aiAnalysis.pros.map((pro: string, i: number) => (
                                            <li key={i}>• {pro}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {idea.aiAnalysis.cons && idea.aiAnalysis.cons.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-bold text-red-400 mb-2">✗ Cons</h4>
                                    <ul className="space-y-1 text-sm text-slate-300">
                                        {idea.aiAnalysis.cons.map((con: string, i: number) => (
                                            <li key={i}>• {con}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {idea.aiAnalysis.suggestions && idea.aiAnalysis.suggestions.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-indigo-400 mb-2">💡 Suggestions</h4>
                                    <ul className="space-y-1 text-sm text-slate-300">
                                        {idea.aiAnalysis.suggestions.map((suggestion: string, i: number) => (
                                            <li key={i}>• {suggestion}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleRequestAIAnalysis}
                            disabled={analyzingAI}
                            className="w-full flex items-center justify-center gap-2 p-4 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-500/30 transition-colors disabled:opacity-50"
                        >
                            {analyzingAI ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    AI is analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Get AI Analysis
                                </>
                            )}
                        </button>
                    )}

                    {/* Feedback Section */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            Feedback & Discussion ({feedback.length})
                        </h3>

                        {/* Comment Input */}
                        <div className="mb-6">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts on this idea..."
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none mb-2"
                            />
                            <button
                                onClick={handleSubmitComment}
                                disabled={!newComment.trim() || submittingComment}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                                {submittingComment ? 'Sending...' : 'Send Feedback'}
                            </button>
                        </div>

                        {/* Feedback List */}
                        {loadingFeedback ? (
                            <div className="text-center py-8 text-slate-400">Loading feedback...</div>
                        ) : feedback.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                No feedback yet. Be the first to share your thoughts!
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {feedback.map((fb: any) => (
                                    <div key={fb._id} className={`p-4 rounded-lg ${fb.isAI ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-slate-800/50'
                                        }`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-full ${fb.isAI ? 'bg-purple-500/20' : 'bg-indigo-500/20'
                                                }`}>
                                                {fb.isAI ? (
                                                    <Bot className="w-5 h-5 text-purple-400" />
                                                ) : (
                                                    <MessageCircle className="w-5 h-5 text-indigo-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-white">
                                                        {fb.submittedByName}
                                                    </span>
                                                    {fb.isAI && (
                                                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                                                            AI
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-slate-400">
                                                        • {new Date(fb.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-slate-300 text-sm">{fb.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
