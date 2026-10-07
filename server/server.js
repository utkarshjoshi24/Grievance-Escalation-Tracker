require('dotenv').config();
console.log('MONGO_URI loaded:', !!process.env.MONGO_URI);
console.log('MONGO_URI starts with:', process.env.MONGO_URI?.substring(0, 20));
console.log('MONGO_URI contains localhost:', process.env.MONGO_URI?.includes('127.0.0.1'));
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { initEscalationJob } = require('./jobs/escalationJob');

// Route imports
const authRoutes = require('./routes/authRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');
const hierarchyRoutes = require('./routes/hierarchyRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Connect to Database
connectDB();

// Core Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    system: 'Grievance Escalation Tracker (GET) Core API',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api', grievanceRoutes);
app.use('/api', hierarchyRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', notificationRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 GET Backend API running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);

  // Start Background Escalation Cron Engine
  initEscalationJob();
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Server Exception]:', err.message);
});

module.exports = app;
