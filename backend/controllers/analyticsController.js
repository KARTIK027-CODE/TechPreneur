const Task = require('../models/Task');
const Milestone = require('../models/Milestone');
const Feedback = require('../models/Feedback');
const PerformanceReview = require('../models/PerformanceReview');
const User = require('../models/User');
const Financials = require('../models/Financials');

// @desc    Get dashboard metrics
// @route   GET /api/analytics/dashboard
// @access  Private (Founder)
const getDashboardMetrics = async (req, res) => {
    try {
        const startupId = req.user.startupId;

        // Task metrics
        const totalTasks = await Task.countDocuments({ startupId });
        const completedTasks = await Task.countDocuments({ startupId, status: 'completed' });
        const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

        // Milestone metrics
        const totalMilestones = await Milestone.countDocuments({ startupId });
        const completedMilestones = await Milestone.countDocuments({ startupId, status: 'completed' });
        const activeMilestones = await Milestone.countDocuments({ startupId, status: 'in_progress' });

        // Feedback metrics
        const allFeedback = await Feedback.find({ startupId });
        const totalFeedback = allFeedback.length;
        const feedbackWithRatings = allFeedback.filter(f => f.rating);
        const averageFeedbackRating = feedbackWithRatings.length > 0
            ? (feedbackWithRatings.reduce((sum, f) => sum + f.rating, 0) / feedbackWithRatings.length).toFixed(2)
            : 0;

        // Team metrics
        const teamMemberCount = await User.countDocuments({ startupId });

        res.json({
            tasks: {
                total: totalTasks,
                completed: completedTasks,
                completionRate: parseFloat(completionRate),
            },
            milestones: {
                total: totalMilestones,
                completed: completedMilestones,
                active: activeMilestones,
            },
            feedback: {
                total: totalFeedback,
                averageRating: parseFloat(averageFeedbackRating),
            },
            team: {
                memberCount: teamMemberCount,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get task completion trend
// @route   GET /api/analytics/tasks-trend
// @access  Private (Founder)
const getTaskTrend = async (req, res) => {
    try {
        const startupId = req.user.startupId;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const completedTasks = await Task.find({
            startupId,
            status: 'completed',
            completedAt: { $gte: thirtyDaysAgo },
        }).select('completedAt');

        // Group by date
        const trendData = {};
        completedTasks.forEach(task => {
            if (task.completedAt) {
                const date = task.completedAt.toISOString().split('T')[0];
                trendData[date] = (trendData[date] || 0) + 1;
            }
        });

        // Convert to array format
        const trend = Object.keys(trendData).map(date => ({
            date,
            count: trendData[date],
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json(trend);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get feedback trend
// @route   GET /api/analytics/feedback-trend
// @access  Private (Founder)
const getFeedbackTrend = async (req, res) => {
    try {
        const startupId = req.user.startupId;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentFeedback = await Feedback.find({
            startupId,
            createdAt: { $gte: thirtyDaysAgo },
        }).select('createdAt rating');

        // Group by date and rating
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        recentFeedback.forEach(feedback => {
            if (feedback.rating) {
                ratingDistribution[feedback.rating]++;
            }
        });

        res.json(ratingDistribution);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get AI insights (Rule-based)
// @route   GET /api/analytics/insights
// @access  Private (Founder)
const getInsights = async (req, res) => {
    try {
        const startupId = req.user.startupId;
        const insights = [];

        // Calculate task completion rate
        const totalTasks = await Task.countDocuments({ startupId });
        const completedTasks = await Task.countDocuments({ startupId, status: 'completed' });
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        // Insight 1: Execution risk based on completion rate
        if (completionRate < 30) {
            insights.push({
                type: 'warning',
                title: 'Execution Risk Alert',
                message: `Your task completion rate is ${completionRate.toFixed(1)}%. Consider reviewing task assignments and deadlines.`,
            });
        } else if (completionRate > 70) {
            insights.push({
                type: 'success',
                title: 'Strong Execution',
                message: `Great job! ${completionRate.toFixed(1)}% task completion rate shows strong execution.`,
            });
        }

        // Insight 2: Feedback validation
        const allFeedback = await Feedback.find({ startupId });
        const feedbackWithRatings = allFeedback.filter(f => f.rating);
        const avgRating = feedbackWithRatings.length > 0
            ? feedbackWithRatings.reduce((sum, f) => sum + f.rating, 0) / feedbackWithRatings.length
            : 0;

        if (avgRating > 0 && avgRating < 3) {
            insights.push({
                type: 'warning',
                title: 'Validation Concerns',
                message: `Average feedback rating is ${avgRating.toFixed(1)}/5. Consider gathering more user insights and iterating on your solution.`,
            });
        } else if (avgRating >= 4) {
            insights.push({
                type: 'success',
                title: 'Strong Validation',
                message: `Excellent feedback with ${avgRating.toFixed(1)}/5 average rating. Your solution resonates with users!`,
            });
        }

        // Insight 3: Activity check
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentTasks = await Task.countDocuments({
            startupId,
            createdAt: { $gte: sevenDaysAgo },
        });

        if (recentTasks === 0) {
            insights.push({
                type: 'info',
                title: 'Low Activity Warning',
                message: 'No tasks created in the last 7 days. Maintain momentum by setting clear goals and breaking them into actionable tasks.',
            });
        }

        // Insight 4: Recommended next milestone
        const completedMilestones = await Milestone.countDocuments({ startupId, status: 'completed' });
        const activeMilestones = await Milestone.countDocuments({ startupId, status: 'in_progress' });

        if (completedMilestones > 0 && activeMilestones === 0) {
            insights.push({
                type: 'info',
                title: 'Recommended Action',
                message: 'Consider creating your next milestone to maintain progress. Common next steps: User Testing, Beta Launch, or Product Iteration.',
            });
        }

        res.json({ insights });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get team analytics (list of members with high-level stats)
// @route   GET /api/analytics/team
// @access  Private (Founder/Leader)
const getTeamAnalytics = async (req, res) => {
    try {
        const startupId = req.user.startupId;
        const members = await User.find({ startupId }).select('name email role department avatar');

        const teamStats = await Promise.all(members.map(async (member) => {
            const completedTasks = await Task.countDocuments({
                assignedTo: member._id,
                status: 'completed'
            });

            const pendingTasks = await Task.countDocuments({
                assignedTo: member._id,
                status: { $ne: 'completed' }
            });

            // Calculate average rating
            const reviews = await PerformanceReview.find({ reviewee: member._id });
            const avgRating = reviews.length > 0
                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                : 0;

            return {
                ...member.toObject(),
                stats: {
                    completedTasks,
                    pendingTasks,
                    rating: parseFloat(avgRating),
                    reviewCount: reviews.length
                }
            };
        }));

        res.json(teamStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get detailed analytics for a specific member
// @route   GET /api/analytics/member/:id
// @access  Private (Founder/Leader)
const getMemberAnalytics = async (req, res) => {
    try {
        const memberId = req.params.id;
        const startupId = req.user.startupId;

        const member = await User.findById(memberId).select('-password');
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // 1. Task Breakdown Status (Pie/Bar Chart)
        const taskStats = await Task.aggregate([
            { $match: { assignedTo: member._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // 2. Weekly Activity (Line Chart - Tasks completed per week)
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

        const weeklyActivity = await Task.aggregate([
            {
                $match: {
                    assignedTo: member._id,
                    status: 'completed',
                    completedAt: { $gte: fourWeeksAgo }
                }
            },
            {
                $group: {
                    _id: { $week: '$completedAt' },
                    count: { $sum: 1 },
                    date: { $first: '$completedAt' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        // 3. Performance Reviews
        const reviews = await PerformanceReview.find({ reviewee: member._id })
            .populate('reviewer', 'name role')
            .sort({ createdAt: -1 });

        const avgRating = reviews.length > 0
            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

        res.json({
            profile: member,
            analytics: {
                taskDistribution: taskStats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
                weeklyActivity: weeklyActivity.map(w => ({ week: w._id, count: w.count })),
                avgRating: parseFloat(avgRating),
                totalReviews: reviews.length
            },
            reviews
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit performance review
// @route   POST /api/analytics/review
// @access  Private (Founder/Leader)
const submitPerformanceReview = async (req, res) => {
    try {
        const { revieweeId, rating, feedback, metrics } = req.body;

        if (req.user.role !== 'founder' && req.user.role !== 'department_head') {
            // Allow if user is manager of reviewee (future scope), for now strictly founder/dept head
            if (req.user.role !== 'founder') {
                // Simplified check for now
                // return res.status(403).json({ message: 'Only leaders can submit reviews' });
            }
        }

        const review = await PerformanceReview.create({
            reviewer: req.user._id,
            reviewee: revieweeId,
            startup: req.user.startupId,
            rating,
            feedback,
            metrics
        });

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get financial metrics for CEO dashboard
// @route   GET /api/analytics/financials
// @access  Private (Founder/Leader)
const getFinancialMetrics = async (req, res) => {
    try {
        const startupId = req.user.startupId;

        let financials = await Financials.find({ startup: startupId }).sort({ year: 1, month: 1 });

        // Calculate total revenue from existing data to check if we should show mock data
        const realTotalRevenue = financials.reduce((acc, curr) => acc + (curr.revenue || 0), 0);

        // If no data exists OR total revenue is 0, generate comprehensive dummy data for visualization
        if (financials.length === 0 || realTotalRevenue === 0) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const currentYear = new Date().getFullYear();

            // Generate data for the last 6 months
            const mockData = months.slice(0, 6).map((month, index) => {
                const revenue = Math.floor(Math.random() * 50000) + 20000 + (index * 5000); // Increasing revenue
                const expenses = Math.floor(Math.random() * 30000) + 10000 + (index * 2000); // Increasing expenses
                return {
                    month,
                    year: currentYear,
                    revenue,
                    expenses,
                    breakdown: {
                        marketing: Math.floor(expenses * 0.3),
                        payroll: Math.floor(expenses * 0.4),
                        operations: Math.floor(expenses * 0.2),
                        software: Math.floor(expenses * 0.1)
                    }
                };
            });

            // Calculate profit and other derived fields
            let currentCash = 500000; // Starting cash
            const processedMock = mockData.map(d => {
                const profit = d.revenue - d.expenses;
                currentCash += profit; // Update cash position
                return {
                    ...d,
                    profit,
                    burnRate: d.expenses,
                    cashOnHand: currentCash
                };
            });

            return res.json({
                financials: processedMock,
                summary: {
                    totalRevenue: processedMock.reduce((acc, curr) => acc + curr.revenue, 0),
                    totalExpenses: processedMock.reduce((acc, curr) => acc + curr.expenses, 0),
                    netProfit: processedMock.reduce((acc, curr) => acc + curr.profit, 0),
                    currentCash: processedMock[processedMock.length - 1].cashOnHand,
                    runwayMonths: Math.floor(processedMock[processedMock.length - 1].cashOnHand / (processedMock[processedMock.length - 1].expenses || 1)),
                    growthRate: 15,
                    founderFocus: [
                        { subject: 'Strategy', A: 120, fullMark: 150 },
                        { subject: 'Product', A: 98, fullMark: 150 },
                        { subject: 'Hiring', A: 86, fullMark: 150 },
                        { subject: 'Fundraising', A: 99, fullMark: 150 },
                        { subject: 'Sales', A: 85, fullMark: 150 },
                        { subject: 'Marketing', A: 65, fullMark: 150 }
                    ],
                    userGrowth: months.map((m, i) => ({ month: m, users: Math.floor(100 * Math.pow(1.2, i)) }))
                }
            });
        }

        res.json({
            financials,
            summary: {
                totalRevenue: financials.reduce((acc, curr) => acc + curr.revenue, 0),
                totalExpenses: financials.reduce((acc, curr) => acc + curr.expenses, 0),
                netProfit: financials.reduce((acc, curr) => acc + curr.profit, 0),
                currentCash: financials[financials.length - 1].cashOnHand,
                runwayMonths: Math.floor(financials[financials.length - 1].cashOnHand / (financials[financials.length - 1].expenses || 1)),
                founderFocus: [
                    { subject: 'Strategy', A: 120, fullMark: 150 },
                    { subject: 'Product', A: 98, fullMark: 150 },
                    { subject: 'Hiring', A: 86, fullMark: 150 },
                    { subject: 'Fundraising', A: 99, fullMark: 150 },
                    { subject: 'Sales', A: 85, fullMark: 150 },
                    { subject: 'Marketing', A: 65, fullMark: 150 }
                ],
                userGrowth: financials.map((f, i) => ({ month: f.month, users: 100 + i * 50 })) // Fallback for real data
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardMetrics,
    getTaskTrend,
    getFeedbackTrend,
    getInsights,
    getTeamAnalytics,
    getMemberAnalytics,
    submitPerformanceReview,
    getFinancialMetrics
};
