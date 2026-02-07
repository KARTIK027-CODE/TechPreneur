const mongoose = require('mongoose');

const financialsSchema = new mongoose.Schema(
    {
        startup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Startup',
            required: true
        },
        month: {
            type: String, // e.g., "Oct 2025"
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        revenue: {
            type: Number,
            default: 0
        },
        expenses: {
            type: Number,
            default: 0
        },
        profit: {
            type: Number,
            default: 0
        },
        burnRate: {
            type: Number,
            default: 0
        },
        cashOnHand: {
            type: Number,
            default: 0
        },
        breakdown: {
            marketing: Number,
            payroll: Number,
            operations: Number,
            software: Number
        }
    },
    {
        timestamps: true
    }
);

// Compound index to ensure unique entry per month per startup
financialsSchema.index({ startup: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Financials', financialsSchema);
