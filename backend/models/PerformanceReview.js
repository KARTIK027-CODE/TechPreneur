const mongoose = require('mongoose');

const performanceReviewSchema = new mongoose.Schema(
    {
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        reviewee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        startup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Startup',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        feedback: {
            type: String,
            trim: true
        },
        metrics: {
            communication: { type: Number, min: 1, max: 5 },
            technical: { type: Number, min: 1, max: 5 },
            leadership: { type: Number, min: 1, max: 5 },
            initiative: { type: Number, min: 1, max: 5 }
        }
    },
    {
        timestamps: true
    }
);

// Indexes for quick lookups
performanceReviewSchema.index({ reviewee: 1, createdAt: -1 });
performanceReviewSchema.index({ startup: 1 });
performanceReviewSchema.index({ reviewer: 1 });

module.exports = mongoose.model('PerformanceReview', performanceReviewSchema);
