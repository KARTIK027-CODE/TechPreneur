const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ideaController = require('../controllers/ideaController');
const feedbackController = require('../controllers/ideaFeedbackController');

// Ideas routes
router.route('/')
    .get(protect, ideaController.getIdeas)
    .post(protect, ideaController.createIdea);

router.route('/:id')
    .get(protect, ideaController.getIdeaById)
    .put(protect, ideaController.updateIdea)
    .delete(protect, ideaController.deleteIdea);

router.post('/:id/vote', protect, ideaController.voteOnIdea);
router.post('/:id/analyze', protect, ideaController.analyzeIdea);

// Feedback routes
router.route('/:ideaId/feedback')
    .get(protect, feedbackController.getIdeaFeedback)
    .post(protect, feedbackController.submitFeedback);

module.exports = router;
