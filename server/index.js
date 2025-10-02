const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
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

// Import database initialization
const { initializePostgreSQL } = require('./scripts/init-postgres');

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Alternative health check endpoint for Railway
app.get('/api/upload/status', async (req, res) => {
  try {
    // ตรวจสอบสถานะฐานข้อมูล
    const CountryData = require('./models/CountryData');
    const hasData = await CountryData.count() > 0;
    
    res.status(200).json({ 
      success: true,
      status: 'OK', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      data: {
        hasData: hasData
      }
    });
  } catch (error) {
    res.status(200).json({ 
      success: true,
      status: 'OK', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      data: {
        hasData: false
      }
    });
  }
});

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
  try {
    // เริ่มต้นฐานข้อมูลก่อน
    console.log('🔄 กำลังเริ่มต้นฐานข้อมูล...');
    const dbInitialized = await initializePostgreSQL();
    
    if (dbInitialized) {
      console.log('✅ ฐานข้อมูลพร้อมใช้งาน');
    } else {
      console.log('⚠️  ฐานข้อมูลไม่พร้อมใช้งาน แต่เซิร์ฟเวอร์จะยังทำงานได้');
    }
    
    // เริ่มต้นเซิร์ฟเวอร์
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
      console.log(`📊 API status available at: http://localhost:${PORT}/api/upload/status`);
      console.log(`🌐 Web interface available at http://localhost:${PORT}`);
      console.log(`🗄️  Database: ${dbInitialized ? 'Connected' : 'Not connected'}`);
    });
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการเริ่มต้นเซิร์ฟเวอร์:', error);
    process.exit(1);
  }
}

startServer();
