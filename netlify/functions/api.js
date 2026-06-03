const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const connectDB = require('../../backend/config/db');

// Connect to database
connectDB().catch(err => {
  console.error('Failed to pre-connect to MongoDB:', err);
});

const app = express();

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Add middleware to rewrite Netlify Functions path
// Netlify requests will go to /.netlify/functions/api/*
// We want Express to see them as /api/*
app.use((req, res, next) => {
  req.url = req.url.replace(/^\/\.netlify\/functions\/api/, '/api');
  next();
});

// Mount routers
app.use('/api/documents', require('../../backend/routes/documents'));
app.use('/api/chatbot', require('../../backend/routes/chatbot'));

module.exports.handler = serverless(app);
