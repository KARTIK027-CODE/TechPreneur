const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const feedbackController = require('../controllers/ideaFeedbackController');

router.route('/:id')
    .put(protect, feedbackController.updateFeedback)
    .delete(protect, feedbackController.deleteFeedback);

module.exports = router;
