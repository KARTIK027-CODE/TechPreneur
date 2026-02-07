"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Lightbulb,
    Plus,
    Search,
    Filter,
    TrendingUp,
    ThumbsUp,
    ThumbsDown,
    MessageCircle,
    Sparkles,
    Target,
    Package,
    Settings as SettingsIcon,
    Zap,
    Eye,
    Bot,
    Crown,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react";
import { ideaApi } from "@/lib/api/idea";
import { useAuth } from "@/contexts/AuthContext";
import SubmitIdeaModal from "@/components/Ideas/SubmitIdeaModal";
import IdeaDetailModal from "@/components/Ideas/IdeaDetailModal";

type Category = 'feature' | 'product' | 'process' | 'strategy' | 'other';
type Status = 'pending' | 'under-review' | 'approved' | 'rejected' | 'implemented';
type Priority = 'low' | 'medium' | 'high' | 'critical';

interface Idea {
    _id: string;
    title: string;
    description: string;
    category: Category;
    status: Status;
    priority: Priority;
    submittedBy: {
        _id: string;
        name: string;
        role: string;
    };
    tags: string[];
    votingStats: {
        upvotes: number;
        downvotes: number;
        boardApprovals: number;
        voters: Array<{ user: string; vote: string }>;
    };
    aiAnalysis?: {
        feasibility: number;
        marketPotential: number;
        recommendation: string;
        analyzedAt: Date;
    };
    aiScore?: number;
    totalVotes?: number;
    createdAt: string;
}

const CATEGORIES = [
    { id: 'feature', label: 'Feature', icon: Zap, color: 'text-blue-400' },
    { id: 'product', label: 'Product', icon: Package, color: 'text-purple-400' },
    { id: 'process', label: 'Process', icon: SettingsIcon, color: 'text-green-400' },
    { id: 'strategy', label: 'Strategy', icon: Target, color: 'text-orange-400' },
    { id: 'other', label: 'Other', icon: Lightbulb, color: 'text-slate-400' }
];

const STATUS_CONFIG = {
    'pending': { label: 'Pending', icon: Clock, color: 'text-yellow-400 bg-yellow-400/10' },
    'under-review': { label: 'Under Review', icon: Eye, color: 'text-blue-400 bg-blue-400/10' },
    'approved': { label: 'Approved', icon: CheckCircle, color: 'text-green-400 bg-green-400/10' },
    'rejected': { label: 'Rejected', icon: XCircle, color: 'text-red-400 bg-red-400/10' },
    'implemented': { label: 'Implemented', icon: CheckCircle, color: 'text-purple-400 bg-purple-400/10' }
};

export default function IdeasPage() {
    const { user } = useAuth();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
    const [selectedStatus, setSelectedStatus] = useState<Status | ''>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

    useEffect(() => {
        fetchIdeas();
    }, [selectedCategory, selectedStatus, searchQuery]);

    const fetchIdeas = async () => {
        try {
            setLoading(true);
            const data = await ideaApi.getIdeas({
                category: selectedCategory || undefined,
                status: selectedStatus || undefined,
                search: searchQuery || undefined
            });
            setIdeas(data);
        } catch (error) {
            console.error('Failed to fetch ideas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (ideaId: string, vote: 'upvote' | 'downvote') => {
        try {
            await ideaApi.voteOnIdea(ideaId, vote);
            fetchIdeas(); // Refresh ideas
        } catch (error) {
            console.error('Vote failed:', error);
        }
    };

    const getCategoryIcon = (category: Category) => {
        const cat = CATEGORIES.find(c => c.id === category);
        return cat ? <cat.icon className={`w-5 h-5 ${cat.color}`} /> : <Lightbulb className="w-5 h-5" />;
    };

    const getUserVote = (idea: Idea): 'upvote' | 'downvote' | null => {
        if (!user) return null;
        const userVote = idea.votingStats.voters.find(v => v.user === user._id);
        return userVote ? (userVote.vote as 'upvote' | 'downvote') : null;
    };

    return (
        <div className="max-w-7xl mx-auto p-8 min-h-screen">
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Ideas & Validation
                        </h1>
                        <p className="text-slate-400">
                            Submit ideas and get AI-powered feedback from the team
                        </p>
                    </div>
                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Submit Idea
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center">
                    {/* Search */}
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search ideas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as Category | '')}
                        className="px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as Status | '')}
                        className="px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                        <option value="">All Status</option>
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                        ))}
                    </select>
                </div>
            </header>

            {/* Ideas Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
            ) : ideas.length === 0 ? (
                <div className="text-center py-16">
                    <Lightbulb className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No ideas found. Be the first to submit one!</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ideas.map((idea, index) => {
                        const statusConfig = STATUS_CONFIG[idea.status];
                        const userVote = getUserVote(idea);

                        return (
                            <motion.div
                                key={idea._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedIdea(idea)}
                                className="group p-6 bg-slate-900/50 border border-white/10 rounded-xl hover:border-indigo-500/50 transition-all cursor-pointer"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        {getCategoryIcon(idea.category)}
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusConfig.color}`}>
                                            {statusConfig.label}
                                        </span>
                                    </div>
                                    {idea.aiAnalysis && (
                                        <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 rounded text-purple-400 text-xs">
                                            <Bot className="w-3 h-3" />
                                            {idea.aiScore}/10
                                        </div>
                                    )}
                                </div>

                                {/* Title & Description */}
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                                    {idea.title}
                                </h3>
                                <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                                    {idea.description}
                                </p>

                                {/* Tags */}
                                {idea.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {idea.tags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span>{idea.submittedBy.name}</span>
                                        {idea.submittedBy.role === 'founder' && (
                                            <Crown className="w-3 h-3 text-amber-400" />
                                        )}
                                    </div>

                                    {/* Voting */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleVote(idea._id, 'upvote');
                                            }}
                                            className={`flex items-center gap-1 ${userVote === 'upvote' ? 'text-green-400' : 'text-slate-400 hover:text-green-400'
                                                } transition-colors`}
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                            <span className="text-xs">{idea.votingStats.upvotes}</span>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleVote(idea._id, 'downvote');
                                            }}
                                            className={`flex items-center gap-1 ${userVote === 'downvote' ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
                                                } transition-colors`}
                                        >
                                            <ThumbsDown className="w-4 h-4" />
                                            <span className="text-xs">{idea.votingStats.downvotes}</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Submit Idea Modal - Will implement next */}
            {showSubmitModal && (
                <SubmitIdeaModal
                    onClose={() => setShowSubmitModal(false)}
                    onSuccess={() => {
                        setShowSubmitModal(false);
                        fetchIdeas();
                    }}
                />
            )}

            {/* Idea Detail Modal - Will implement next */}
            {selectedIdea && (
                <IdeaDetailModal
                    idea={selectedIdea}
                    onClose={() => setSelectedIdea(null)}
                    onUpdate={fetchIdeas}
                />
            )}
        </div>
    );
}
