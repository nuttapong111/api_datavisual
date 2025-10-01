const express = require('express');
const router = express.Router();
const CountryData = require('../models/CountryData');
const { Op } = require('sequelize');

/**
 * GET /api/data/summary
 * ข้อมูลสรุป: min, max, average ของแต่ละปี
 */
router.get('/summary', async (req, res) => {
  try {
    const years = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    const summary = {};
    
    for (const year of years) {
      const yearField = `year_${year}`;
      
      // คำนวณ min, max, average
      const stats = await CountryData.findAll({
        attributes: [
          [CountryData.sequelize.fn('MIN', CountryData.sequelize.col(yearField)), 'min'],
          [CountryData.sequelize.fn('MAX', CountryData.sequelize.col(yearField)), 'max'],
          [CountryData.sequelize.fn('AVG', CountryData.sequelize.col(yearField)), 'avg'],
          [CountryData.sequelize.fn('COUNT', CountryData.sequelize.col(yearField)), 'count']
        ],
        where: {
          [yearField]: {
            [Op.not]: null
          }
        },
        raw: true
      });
      
      if (stats[0]) {
        summary[year] = {
          min: parseFloat(stats[0].min) || 0,
          max: parseFloat(stats[0].max) || 0,
          average: parseFloat(stats[0].avg) || 0,
          count: parseInt(stats[0].count) || 0
        };
      } else {
        summary[year] = {
          min: 0,
          max: 0,
          average: 0,
          count: 0
        };
      }
    }
    
    res.json({
      success: true,
      data: summary,
      message: 'ข้อมูลสรุปแต่ละปี'
    });
  } catch (error) {
    console.error('Error getting summary data:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสรุป',
      error: error.message
    });
  }
});

/**
 * GET /api/data/top-countries
 * 20 ประเทศที่มีค่ามากสุด
 */
router.get('/top-countries', async (req, res) => {
  try {
    const { year = '2012', limit = 20 } = req.query;
    const yearField = `year_${year}`;
    
    const topCountries = await CountryData.findAll({
      attributes: ['country', yearField],
      where: {
        [yearField]: {
          [Op.not]: null
        }
      },
      order: [[yearField, 'DESC']],
      limit: parseInt(limit),
      raw: true
    });
    
    res.json({
      success: true,
      data: topCountries.map(item => ({
        country: item.country,
        value: parseFloat(item[yearField]),
        year: year
      })),
      message: `20 ประเทศที่มีค่ามากสุดในปี ${year}`
    });
  } catch (error) {
    console.error('Error getting top countries:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประเทศที่มีค่ามากสุด',
      error: error.message
    });
  }
});

/**
 * GET /api/data/bottom-countries
 * 20 ประเทศที่มีค่าต่ำสุด
 */
router.get('/bottom-countries', async (req, res) => {
  try {
    const { year = '2012', limit = 20 } = req.query;
    const yearField = `year_${year}`;
    
    const bottomCountries = await CountryData.findAll({
      attributes: ['country', yearField],
      where: {
        [yearField]: {
          [Op.not]: null
        }
      },
      order: [[yearField, 'ASC']],
      limit: parseInt(limit),
      raw: true
    });
    
    res.json({
      success: true,
      data: bottomCountries.map(item => ({
        country: item.country,
        value: parseFloat(item[yearField]),
        year: year
      })),
      message: `20 ประเทศที่มีค่าต่ำสุดในปี ${year}`
    });
  } catch (error) {
    console.error('Error getting bottom countries:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประเทศที่มีค่าต่ำสุด',
      error: error.message
    });
  }
});

/**
 * GET /api/data/total-count
 * จำนวนข้อมูลทั้งหมด
 */
router.get('/total-count', async (req, res) => {
  try {
    const totalCountries = await CountryData.count();
    
    // นับจำนวนข้อมูลทั้งหมด (รวมทุกปี)
    const years = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    let totalDataPoints = 0;
    
    for (const year of years) {
      const yearField = `year_${year}`;
      const count = await CountryData.count({
        where: {
          [yearField]: {
            [Op.not]: null
          }
        }
      });
      totalDataPoints += count;
    }
    
    res.json({
      success: true,
      data: {
        totalCountries,
        totalDataPoints,
        averageDataPerCountry: totalCountries > 0 ? (totalDataPoints / totalCountries).toFixed(2) : 0
      },
      message: 'จำนวนข้อมูลทั้งหมด'
    });
  } catch (error) {
    console.error('Error getting total count:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลจำนวนทั้งหมด',
      error: error.message
    });
  }
});

/**
 * GET /api/data/all
 * ข้อมูลทั้งหมด (สำหรับ Looker Studio)
 */
router.get('/all', async (req, res) => {
  try {
    const { page = 1, limit = 1000 } = req.query;
    const offset = (page - 1) * limit;
    
    const allData = await CountryData.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['country', 'ASC']],
      raw: true
    });
    
    const totalCount = await CountryData.count();
    
    res.json({
      success: true,
      data: allData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      message: 'ข้อมูลทั้งหมด'
    });
  } catch (error) {
    console.error('Error getting all data:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลทั้งหมด',
      error: error.message
    });
  }
});

/**
 * GET /api/data/countries
 * รายชื่อประเทศทั้งหมด
 */
router.get('/countries', async (req, res) => {
  try {
    const countries = await CountryData.findAll({
      attributes: ['country'],
      order: [['country', 'ASC']],
      raw: true
    });
    
    res.json({
      success: true,
      data: countries.map(item => item.country),
      message: 'รายชื่อประเทศทั้งหมด'
    });
  } catch (error) {
    console.error('Error getting countries:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงรายชื่อประเทศ',
      error: error.message
    });
  }
});

module.exports = router;
