const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const initializeDatabase = require('./init');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Import routes
const dataRoutes = require('./routes/data');
const uploadRoutes = require('./routes/upload');

// Use routes
app.use('/api/data', dataRoutes);
app.use('/api/upload', uploadRoutes);

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// เริ่มต้นเซิร์ฟเวอร์
async function startServer() {
  // เริ่มต้นฐานข้อมูล
  const dbInitialized = await initializeDatabase();
  if (!dbInitialized) {
    console.error('❌ Failed to initialize database. Server will not start.');
    process.exit(1);
  }
  
  // เริ่มต้นเซิร์ฟเวอร์
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🌐 Web interface available at http://localhost:${PORT}`);
  });
}

startServer();
