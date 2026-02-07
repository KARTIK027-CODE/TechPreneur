const IdeaFeedback = require('../models/IdeaFeedback');
const Idea = require('../models/Idea');

// @desc    Get all feedback for an idea
// @route   GET /api/ideas/:ideaId/feedback
// @access  Private
exports.getIdeaFeedback = async (req, res) => {
    try {
        const feedback = await IdeaFeedback.find({
            ideaId: req.params.ideaId,
            feedbackType: { $in: ['comment', 'ai-analysis'] }
        })
            .populate('submittedBy', 'name email role')
            .sort({ createdAt: -1 });

        res.json(feedback);
    } catch (error) {
        console.error('Get feedback error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Submit feedback/comment on idea
// @route   POST /api/ideas/:ideaId/feedback
// @access  Private
exports.submitFeedback = async (req, res) => {
    try {
        const { content, rating } = req.body;

        // Verify idea exists
        const idea = await Idea.findById(req.params.ideaId);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Create feedback
        const feedback = await IdeaFeedback.create({
            ideaId: req.params.ideaId,
            submittedBy: req.user._id,
            submittedByName: req.user.name,
            feedbackType: 'comment',
            content,
            rating,
            isBoardMember: req.user.role === 'founder'
        });

        await feedback.populate('submittedBy', 'name email role');

        res.status(201).json(feedback);
    } catch (error) {
        console.error('Submit feedback error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private (own feedback only)
exports.updateFeedback = async (req, res) => {
    try {
        const feedback = await IdeaFeedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Only owner can update (and not AI feedback)
        if (feedback.isAI || feedback.submittedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { content, rating } = req.body;
        if (content) feedback.content = content;
        if (rating) feedback.rating = rating;

        await feedback.save();
        await feedback.populate('submittedBy', 'name email role');

        res.json(feedback);
    } catch (error) {
        console.error('Update feedback error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private (own feedback only or founder)
exports.deleteFeedback = async (req, res) => {
    try {
        const feedback = await IdeaFeedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Only owner or founder can delete (and not AI feedback)
        if (feedback.isAI ||
            (feedback.submittedBy.toString() !== req.user._id.toString() && req.user.role !== 'founder')) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await feedback.deleteOne();

        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Delete feedback error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = exports;
