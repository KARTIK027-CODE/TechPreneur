const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    category: {
        type: String,
        required: true,
        enum: ['feature', 'product', 'process', 'strategy', 'other']
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Startup',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'under-review', 'approved', 'rejected', 'implemented'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    tags: [{
        type: String,
        trim: true
    }],
    aiAnalysis: {
        feasibility: {
            type: Number,
            min: 1,
            max: 10
        },
        marketPotential: {
            type: Number,
            min: 1,
            max: 10
        },
        technicalComplexity: {
            type: Number,
            min: 1,
            max: 10
        },
        pros: [String],
        cons: [String],
        risks: [String],
        recommendation: {
            type: String,
            enum: ['approve', 'needs-work', 'reject']
        },
        suggestions: [String],
        fullAnalysis: String,
        analyzedAt: Date
    },
    votingStats: {
        upvotes: {
            type: Number,
            default: 0
        },
        downvotes: {
            type: Number,
            default: 0
        },
        boardApprovals: {
            type: Number,
            default: 0
        },
        voters: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            vote: { type: String, enum: ['upvote', 'downvote'] }
        }]
    }
}, {
    timestamps: true
});

// Indexes for better query performance
ideaSchema.index({ startup: 1, status: 1 });
ideaSchema.index({ category: 1 });
ideaSchema.index({ submittedBy: 1 });
ideaSchema.index({ createdAt: -1 });

// Virtual for total votes
ideaSchema.virtual('totalVotes').get(function () {
    return this.votingStats.upvotes - this.votingStats.downvotes;
});

// Virtual for AI score (average of all AI metrics)
ideaSchema.virtual('aiScore').get(function () {
    if (!this.aiAnalysis || !this.aiAnalysis.feasibility) return null;
    return Math.round(
        (this.aiAnalysis.feasibility +
            this.aiAnalysis.marketPotential +
            (10 - this.aiAnalysis.technicalComplexity)) / 3
    );
});

ideaSchema.set('toJSON', { virtuals: true });
ideaSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Idea', ideaSchema);
