const mongoose = require('mongoose');

const ideaFeedbackSchema = new mongoose.Schema({
    ideaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Idea',
        required: true
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    submittedByName: {
        type: String,
        trim: true
    },
    isAI: {
        type: Boolean,
        default: false
    },
    feedbackType: {
        type: String,
        enum: ['comment', 'vote', 'approval', 'ai-analysis'],
        required: true
    },
    content: {
        type: String,
        trim: true
    },
    vote: {
        type: String,
        enum: ['upvote', 'downvote', 'neutral']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    isBoardMember: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes
ideaFeedbackSchema.index({ ideaId: 1, createdAt: -1 });
ideaFeedbackSchema.index({ submittedBy: 1 });

module.exports = mongoose.model('IdeaFeedback', ideaFeedbackSchema);
