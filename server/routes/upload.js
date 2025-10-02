const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const DataCleansingService = require('../services/dataCleansing');

const router = express.Router();

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'excel-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (allowedTypes.includes(file.mimetype) || 
        file.originalname.endsWith('.xlsx') || 
        file.originalname.endsWith('.xls') || 
        file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('รองรับเฉพาะไฟล์ Excel (.xlsx, .xls) และ CSV เท่านั้น'));
    }
  }
});

/**
 * POST /api/upload/excel
 * อัปโหลดและประมวลผลไฟล์ Excel
 */
router.post('/excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาเลือกไฟล์ Excel'
      });
    }

    console.log('Processing file:', req.file.filename);
    
    // อ่านไฟล์ Excel
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // ใช้ sheet แรก
    const worksheet = workbook.Sheets[sheetName];
    
    // แปลงเป็น JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Found ${rawData.length} rows in Excel file`);
    
    // ตรวจสอบความถูกต้องของข้อมูล
    const validation = DataCleansingService.validateData(rawData);
    
    if (!validation.valid) {
      // ลบไฟล์ที่อัปโหลด
      fs.unlinkSync(req.file.path);
      
      return res.status(400).json({
        success: false,
        message: 'ข้อมูลในไฟล์ไม่ถูกต้อง',
        errors: validation.errors,
        warnings: validation.warnings
      });
    }
    
    // ทำความสะอาดข้อมูล
    console.log('Cleaning data...');
    const cleanedData = DataCleansingService.cleanData(rawData);
    
    console.log(`Cleaned data: ${cleanedData.length} countries`);
    
    // บันทึกลงฐานข้อมูล
    console.log('Saving to database...');
    const saveResult = await DataCleansingService.saveCleanedData(cleanedData, rawData);
    
    // ลบไฟล์ที่อัปโหลด
    fs.unlinkSync(req.file.path);
    
    if (saveResult.success) {
      res.json({
        success: true,
        message: saveResult.message,
        data: {
          originalRows: saveResult.originalRows,
          cleanedRows: saveResult.count,
          removedRows: saveResult.removedRows,
          warnings: validation.warnings
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        error: saveResult.message
      });
    }
    
  } catch (error) {
    console.error('Error processing Excel file:', error);
    console.error('Error stack:', error.stack);
    
    // ลบไฟล์ที่อัปโหลดในกรณีเกิดข้อผิดพลาด
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการประมวลผลไฟล์',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/upload/status
 * ตรวจสอบสถานะการอัปโหลด
 */
router.get('/status', async (req, res) => {
  try {
    const CountryData = require('../models/CountryData');
    const totalCount = await CountryData.count();
    
    res.json({
      success: true,
      data: {
        hasData: totalCount > 0,
        totalCountries: totalCount,
        lastUpdated: new Date().toISOString()
      },
      message: 'สถานะข้อมูลในระบบ'
    });
  } catch (error) {
    console.error('Error checking upload status:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบสถานะ',
      error: error.message
    });
  }
});

/**
 * DELETE /api/upload/clear
 * ล้างข้อมูลทั้งหมด
 */
router.delete('/clear', async (req, res) => {
  try {
    const CountryData = require('../models/CountryData');
    await CountryData.destroy({ where: {} });
    
    res.json({
      success: true,
      message: 'ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว'
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการล้างข้อมูล',
      error: error.message
    });
  }
});

module.exports = router;
