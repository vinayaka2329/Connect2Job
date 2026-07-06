// backend/src/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/database');
connectDB();

// Import routes
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const subscriberRoutes = require('./routes/subscribers');
const contactRoutes = require('./routes/contacts');
const authRoutes = require('./routes/auth');

console.log("jobRoutes:", typeof jobRoutes);
console.log("applicationRoutes:", typeof applicationRoutes);
console.log("subscriberRoutes:", typeof subscriberRoutes);
console.log("contactRoutes:", typeof contactRoutes);
console.log("authRoutes:", typeof authRoutes);

const app = express();

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(
  '/uploads',
  express.static(
    path.join(__dirname, '../uploads')
  )
);
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Connect2Job API is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});