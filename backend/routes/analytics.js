const express = require('express');
const {
    getDashboardMetrics,
    getTaskTrend,
    getFeedbackTrend,
    getInsights,
    getTeamAnalytics,
    getMemberAnalytics,
    submitPerformanceReview,
    getFinancialMetrics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

const router = express.Router();

router.get('/dashboard', protect, checkRole('founder'), getDashboardMetrics);
router.get('/tasks-trend', protect, checkRole('founder'), getTaskTrend);
router.get('/feedback-trend', protect, checkRole('founder'), getFeedbackTrend);
router.get('/insights', protect, checkRole('founder'), getInsights);
router.get('/team', protect, getTeamAnalytics);
router.get('/member/:id', protect, getMemberAnalytics);
router.post('/review', protect, submitPerformanceReview);
router.get('/financials', protect, getFinancialMetrics);

module.exports = router;
