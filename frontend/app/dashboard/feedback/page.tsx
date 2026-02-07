"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, Loader2, ThumbsUp, DollarSign, CreditCard, Banknote, Wallet, Check, CheckCircle, X } from "lucide-react";
import { feedbackApi } from "@/lib/api/feedback";
import { AnimatePresence, motion } from "framer-motion";

// Mock Data for Team Members (Fallback)
const MOCK_TEAM_DATA = [
    { _id: '1', name: 'Sarah Jenkins', role: 'HR Manager', department: 'HR', avatar: null, stats: { rating: 4.8, completedTasks: 124, pendingTasks: 5 }, salaryPaid: false, salary: 5500 },
    { _id: '2', name: 'Mike Ross', role: 'Legal Counsel', department: 'Legal', avatar: null, stats: { rating: 4.9, completedTasks: 89, pendingTasks: 12 }, salaryPaid: true, salary: 8000 },
    { _id: '3', name: 'Rachel Zane', role: 'Paralegal', department: 'Legal', avatar: null, stats: { rating: 4.7, completedTasks: 156, pendingTasks: 8 }, salaryPaid: false, salary: 4500 },
    { _id: '4', name: 'Donna Paulsen', role: 'COO', department: 'Operations', avatar: null, stats: { rating: 5.0, completedTasks: 342, pendingTasks: 2 }, salaryPaid: true, salary: 12000 },
    { _id: '5', name: 'Louis Litt', role: 'Finance Head', department: 'Finance', avatar: null, stats: { rating: 4.2, completedTasks: 210, pendingTasks: 15 }, salaryPaid: false, salary: 9500 },
    { _id: '6', name: 'Harvey Specter', role: 'Senior Partner', department: 'Business', avatar: null, stats: { rating: 4.9, completedTasks: 180, pendingTasks: 4 }, salaryPaid: true, salary: 15000 },
    { _id: '7', name: 'Jessica Pearson', role: 'Managing Partner', department: 'Business', avatar: null, stats: { rating: 5.0, completedTasks: 420, pendingTasks: 1 }, salaryPaid: true, salary: 18000 },
    { _id: '8', name: 'Katrina Bennett', role: 'Associate', department: 'Business', avatar: null, stats: { rating: 4.5, completedTasks: 78, pendingTasks: 9 }, salaryPaid: false, salary: 6000 },
    { _id: '9', name: 'Alex Williams', role: 'Senior Developer', department: 'Development', avatar: null, stats: { rating: 4.6, completedTasks: 95, pendingTasks: 23 }, salaryPaid: false, salary: 7500 },
    { _id: '10', name: 'Samantha Wheeler', role: 'Marketing Lead', department: 'Marketing', avatar: null, stats: { rating: 4.8, completedTasks: 112, pendingTasks: 7 }, salaryPaid: true, salary: 7000 },
    { _id: '13', name: 'Travis Tanner', role: 'Sales Lead', department: 'Sales', avatar: null, stats: { rating: 4.4, completedTasks: 88, pendingTasks: 14 }, salaryPaid: false, salary: 6500 },
    { _id: '14', name: 'Dana Scott', role: 'Product Manager', department: 'Product', avatar: null, stats: { rating: 4.7, completedTasks: 145, pendingTasks: 6 }, salaryPaid: false, salary: 7200 },
];

interface FeedbackItem {
    _id: string;
    feedbackText: string;
    category?: 'idea' | 'execution' | 'product' | 'market';
    rating?: number;
    submittedByName?: string;
    createdAt: string;
}

export default function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [activeTab, setActiveTab] = useState<'feedback' | 'team'>('feedback');
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showForm, setShowForm] = useState(false);

    // Rating form states
    const [showRateModal, setShowRateModal] = useState(false);
    const [ratingMemberId, setRatingMemberId] = useState("");
    const [performanceRating, setPerformanceRating] = useState(3);
    const [performanceFeedback, setPerformanceFeedback] = useState("");
    const [metrics, setMetrics] = useState({
        communication: 3,
        technical: 3,
        leadership: 3,
        initiative: 3
    });

    // Payment Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success'>('select');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [payingMember, setPayingMember] = useState<any>(null);
    const [salaryFilter, setSalaryFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

    useEffect(() => {
        fetchTeamMetrics();
    }, []);

    const fetchTeamMetrics = async () => {
        try {
            // Dynamically import to resolve potential circular deps or server/client issues
            const { analyticsApi } = await import("@/lib/api/analytics");
            const data = await analyticsApi.getTeamAnalytics();

            if (data && data.length > 0) {
                // Ensure salaryPaid and salary property exists
                const enhancedData = data.map((m: any) => ({
                    ...m,
                    salaryPaid: m.salaryPaid !== undefined ? m.salaryPaid : Math.random() > 0.5,
                    salary: m.salary || Math.floor(Math.random() * 5000) + 4000
                }));
                setTeamMembers(enhancedData);
            } else {
                setTeamMembers(MOCK_TEAM_DATA);
            }
        } catch (err) {
            console.error("Failed to load team metrics", err);
            setTeamMembers(MOCK_TEAM_DATA);
        } finally {
            setLoading(false);
        }
    };

    const handleRateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { analyticsApi } = await import("@/lib/api/analytics");
            await analyticsApi.submitPerformanceReview({
                revieweeId: ratingMemberId,
                rating: performanceRating,
                feedback: performanceFeedback,
                metrics
            });
            setShowRateModal(false);
            setSuccess("Performance review submitted!");
            setTimeout(() => setSuccess(""), 3000);
            fetchTeamMetrics(); // Refresh stats

            // Reset rating form
            setPerformanceRating(3);
            setPerformanceFeedback("");
            setMetrics({ communication: 3, technical: 3, leadership: 3, initiative: 3 });
        } catch (err: any) {
            setError("Failed to submit review");
        }
    };

    const generateMockAnalytics = (member: any) => {
        return {
            profile: {
                name: member.name,
                role: member.role,
                department: member.department,
                avatar: member.avatar
            },
            analytics: {
                taskDistribution: {
                    completed: member.stats.completedTasks,
                    in_progress: member.stats.pendingTasks,
                    todo: Math.floor(Math.random() * 10),
                    review: Math.floor(Math.random() * 5)
                },
                weeklyActivity: Array.from({ length: 12 }, (_, i) => ({
                    week: i + 1,
                    count: Math.floor(Math.random() * 20) + 5
                })),
                avgRating: member.stats.rating,
                totalReviews: Math.floor(Math.random() * 50) + 10
            },
            reviews: [
                {
                    _id: 'r1',
                    reviewer: { name: 'Harvey Specter', role: 'Senior Partner' },
                    rating: 5,
                    feedback: 'Exceptional performance on the last case.',
                    createdAt: new Date().toISOString(),
                    metrics: { technical: 5, communication: 5, leadership: 4, initiative: 5 }
                },
                {
                    _id: 'r2',
                    reviewer: { name: 'Louis Litt', role: 'Finance Head' },
                    rating: 4,
                    feedback: 'Good work but needs to be more detail-oriented.',
                    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
                    metrics: { technical: 4, communication: 4, leadership: 3, initiative: 4 }
                }
            ]
        };
    };

    const handlePaySalary = (memberId: string) => {
        const member = teamMembers.find(m => m._id === memberId);
        if (member) {
            setPayingMember(member);
            setPaymentStep('select');
            setSelectedPaymentMethod(null);
            setShowPaymentModal(true);
        }
    };

    const processPayment = () => {
        if (!selectedPaymentMethod) return;
        setPaymentStep('processing');

        // Simulate API call delay
        setTimeout(() => {
            setPaymentStep('success');

            // Update local state to reflect payment
            if (payingMember) {
                setTeamMembers(prev => prev.map(m =>
                    m._id === payingMember._id ? { ...m, salaryPaid: true } : m
                ));

                // Deduct from "Cash in Hands" (Simulated via localStorage)
                const currentCashStr = localStorage.getItem('simulated_cash_on_hand');
                let currentCash = currentCashStr ? parseInt(currentCashStr) : 145000;

                // Deduct salary
                const salaryAmount = payingMember.salary || 5000;
                currentCash -= salaryAmount;

                // Save back to localStorage
                localStorage.setItem('simulated_cash_on_hand', currentCash.toString());
            }
        }, 2000);
    };

    const closePaymentModal = () => {
        setShowPaymentModal(false);
        setPayingMember(null);
        setPaymentStep('select');
    };

    const getCategoryColor = (cat?: string) => {
        switch (cat) {
            case 'product': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'idea': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'execution': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'market': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    // Filter team members based on salary status
    const filteredTeamMembers = teamMembers.filter(member => {
        if (salaryFilter === 'all') return true;
        if (salaryFilter === 'paid') return member.salaryPaid;
        if (salaryFilter === 'unpaid') return !member.salaryPaid;
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Feedback & Team</h1>
                    <p className="text-slate-400 mt-2">Manage feedback and team performance</p>
                </div>
                {activeTab === 'feedback' ? (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Give Feedback
                    </button>
                ) : (
                    // Salary Filter Dropdown
                    <div className="flex bg-slate-800 rounded-lg p-1 border border-white/10">
                        <button
                            onClick={() => setSalaryFilter('all')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${salaryFilter === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setSalaryFilter('paid')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${salaryFilter === 'paid' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Paid
                        </button>
                        <button
                            onClick={() => setSalaryFilter('unpaid')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${salaryFilter === 'unpaid' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Unpaid
                        </button>
                    </div>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-6 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('feedback')}
                    className={`pb-4 text-sm font-medium transition-colors ${activeTab === 'feedback'
                            ? 'text-indigo-400 border-b-2 border-indigo-400'
                            : 'text-slate-400 hover:text-white'
                        }`}
                >
                    App Feedback
                </button>
                <button
                    onClick={() => setActiveTab('team')}
                    className={`pb-4 text-sm font-medium transition-colors ${activeTab === 'team'
                            ? 'text-indigo-400 border-b-2 border-indigo-400'
                            : 'text-slate-400 hover:text-white'
                        }`}
                >
                    Team Management
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                </div>
            )}

            {/* Content Area */}
            {activeTab === 'feedback' ? (
                <div className="grid gap-4">
                    {feedbacks.length === 0 ? (
                        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-12 text-center">
                            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">No feedback yet. Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        feedbacks.map((feedback) => (
                            <div key={feedback._id} className="bg-slate-900/50 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            {feedback.category && (
                                                <span className={`text-xs px-2 py-1 rounded capitalize ${getCategoryColor(feedback.category)}`}>
                                                    {feedback.category}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-300 leading-relaxed">{feedback.feedbackText}</p>
                                    </div>
                                    <div className="flex items-center gap-1 ml-4">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < (feedback.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <span>By {feedback.submittedByName || 'Anonymous'}</span>
                                    <span>•</span>
                                    <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                /* Team Management Tab */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeamMembers.map((member) => (
                        <div key={member._id} className="bg-slate-900/50 border border-white/10 rounded-xl p-6 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium group-hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => setSelectedMember(member._id)}>
                                            {member.name}
                                        </h3>
                                        <div className="flex flex-col">
                                            <p className="text-xs text-slate-400">{member.role}</p>
                                            <p className="text-xs text-indigo-300 mt-0.5">Salary: ${member.salary?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded text-amber-400 text-sm">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>{member.stats?.rating || 0}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-950/50 rounded p-2 text-center">
                                    <div className="text-xs text-slate-500 mb-1">Tasks Done</div>
                                    <div className="text-lg font-bold text-green-400">{member.stats?.completedTasks || 0}</div>
                                </div>
                                <div className="bg-slate-950/50 rounded p-2 text-center">
                                    <div className="text-xs text-slate-500 mb-1">Pending</div>
                                    <div className="text-lg font-bold text-amber-400">{member.stats?.pendingTasks || 0}</div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedMember(member._id)}
                                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors border border-white/5"
                                >
                                    View Analytics
                                </button>
                                {member.salaryPaid ? (
                                    <div className="flex-1 py-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-lg flex items-center justify-center gap-2 font-medium">
                                        <CheckCircle className="w-4 h-4" />
                                        Salary Paid
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handlePaySalary(member._id)}
                                        className="flex-1 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-sm rounded-lg transition-colors border border-emerald-500/20 flex items-center justify-center gap-2"
                                    >
                                        <DollarSign className="w-4 h-4" />
                                        Pay Salary
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Rate Member Modal */}
            {showRateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-slate-900 rounded-xl border border-white/10 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-4">Rate Team Member</h2>
                        <form onSubmit={handleRateSubmit} className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">
                                    Overall Performance
                                </label>
                                <div className="flex gap-2 justify-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setPerformanceRating(i + 1)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${i < performanceRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(metrics).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="text-xs text-slate-400 capitalize mb-1 block">{key}</label>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <div
                                                    key={s}
                                                    onClick={() => setMetrics(prev => ({ ...prev, [key]: s }))}
                                                    className={`w-4 h-4 rounded-full cursor-pointer ${s <= value ? 'bg-indigo-500' : 'bg-slate-800'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-300">Detailed Feedback</label>
                                <textarea
                                    value={performanceFeedback}
                                    onChange={(e) => setPerformanceFeedback(e.target.value)}
                                    required
                                    rows={4}
                                    placeholder="Strengths, areas for improvement..."
                                    className="mt-1 flex w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowRateModal(false)}
                                    className="flex-1 px-4 py-2 border border-white/10 bg-transparent hover:bg-white/5 text-white rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            <AnimatePresence>
                {showPaymentModal && payingMember && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden relative"
                        >
                            <button
                                onClick={closePaymentModal}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>

                            <div className="p-6">
                                {paymentStep === 'select' && (
                                    <>
                                        <div className="text-center mb-8">
                                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <DollarSign className="w-8 h-8 text-emerald-400" />
                                            </div>
                                            <h2 className="text-xl font-bold text-white mb-2">Process Salary Payment</h2>
                                            <p className="text-slate-400 text-sm">
                                                Select a payment method to pay <span className="text-white font-medium">{payingMember.name}</span>
                                            </p>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            {[
                                                { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, detail: '**** **** **** 4242' },
                                                { id: 'bank', name: 'Bank Transfer', icon: Banknote, detail: 'Chase Bank ••• 8829' },
                                                { id: 'wallet', name: 'Company Wallet', icon: Wallet, detail: 'Balance: $450,200.00' }
                                            ].map((method) => (
                                                <div
                                                    key={method.id}
                                                    onClick={() => setSelectedPaymentMethod(method.id)}
                                                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${selectedPaymentMethod === method.id
                                                            ? 'bg-emerald-500/10 border-emerald-500'
                                                            : 'bg-slate-950/50 border-white/10 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className={`p-2 rounded-lg ${selectedPaymentMethod === method.id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                                                        }`}>
                                                        <method.icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className={`font-medium ${selectedPaymentMethod === method.id ? 'text-emerald-400' : 'text-white'}`}>
                                                            {method.name}
                                                        </h3>
                                                        <p className="text-xs text-slate-500">{method.detail}</p>
                                                    </div>
                                                    {selectedPaymentMethod === method.id && (
                                                        <div className="ml-auto">
                                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={processPayment}
                                            disabled={!selectedPaymentMethod}
                                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20"
                                        >
                                            Process Payment
                                        </button>
                                    </>
                                )}

                                {paymentStep === 'processing' && (
                                    <div className="text-center py-8">
                                        <div className="relative w-20 h-20 mx-auto mb-6">
                                            <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin"></div>
                                            <DollarSign className="absolute inset-0 m-auto w-8 h-8 text-emerald-500 animate-pulse" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">Processing Transfer...</h3>
                                        <p className="text-slate-400 text-sm">Securely transferring funds to {payingMember.name}</p>
                                    </div>
                                )}

                                {paymentStep === 'success' && (
                                    <div className="text-center py-4">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                            className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30"
                                        >
                                            <Check className="w-12 h-12 text-white stroke-[3]" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                                        <p className="text-slate-400 mb-8">
                                            Salary has been credited to <span className="text-white font-medium">{payingMember.name}</span>
                                        </p>

                                        <div className="bg-slate-950 rounded-xl p-4 border border-white/10 mb-8 max-w-xs mx-auto text-left">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-500">Transaction ID</span>
                                                <span className="text-slate-300 font-mono">TXN-{Math.floor(Math.random() * 1000000)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Amount</span>
                                                <span className="text-emerald-400 font-bold">${payingMember.salary?.toLocaleString() || '4,500.00'}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={closePaymentModal}
                                            className="px-8 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold transition-colors shadow-lg"
                                        >
                                            Done
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Analytics Modal */}
            <AnimatePresence>
                {selectedMember && (
                    <>
                        {(() => {
                            // Dynamically import to avoid server-side issues
                            const MemberDetailModal = require('@/components/Team/MemberDetailModal').default;
                            const member = teamMembers.find(m => m._id === selectedMember);
                            const mockAnalyticsData = member ? generateMockAnalytics(member) : undefined;

                            return (
                                <MemberDetailModal
                                    memberId={selectedMember}
                                    initialData={mockAnalyticsData}
                                    onClose={() => setSelectedMember(null)}
                                />
                            );
                        })()}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
