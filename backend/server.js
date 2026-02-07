require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const startupRoutes = require('./routes/startup');
const taskRoutes = require('./routes/tasks');
const feedbackRoutes = require('./routes/feedback');
const analyticsRoutes = require('./routes/analytics');
const pitchRoutes = require('./routes/pitch');
const ideaRoutes = require('./routes/ideas');
const ideaFeedbackRoutes = require('./routes/ideaFeedback');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5001', 'http://localhost:5002'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/startup', startupRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/pitch', pitchRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/idea-feedback', ideaFeedbackRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'VentureX API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
