const CountryData = require('../models/CountryData');

class DataCleansingService {
  /**
   * ทำความสะอาดข้อมูลและลบแถวที่มีค่า N/A ทั้งแถวหรือค่าว่างทั้งแถว
   * @param {Array} rawData - ข้อมูลดิบจาก Excel
   * @returns {Array} ข้อมูลที่ทำความสะอาดแล้ว
   */
  static cleanData(rawData) {
    const cleanedData = [];
    const years = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    
    for (const row of rawData) {
      const country = row.Country;
      if (!country || country.trim() === '') {
        continue; // ข้ามแถวที่ไม่มีชื่อประเทศ
      }
      
      // ตรวจสอบว่ามีข้อมูลที่ถูกต้องอย่างน้อย 1 ปีหรือไม่
      let hasValidData = false;
      const cleanedRow = {
        country: country.trim()
      };
      
      // ตรวจสอบและทำความสะอาดข้อมูลแต่ละปี
      for (const year of years) {
        const value = row[year];
        let cleanedValue = null;
        
        if (value !== null && value !== undefined && value !== '' && value !== 'N/A' && !isNaN(value)) {
          cleanedValue = parseFloat(value);
          hasValidData = true;
        } else {
          // ใช้ null สำหรับค่า N/A หรือค่าว่าง
          cleanedValue = null;
        }
        
        cleanedRow[`year_${year}`] = cleanedValue;
      }
      
      // เก็บเฉพาะแถวที่มีข้อมูลที่ถูกต้องอย่างน้อย 1 ปี
      if (hasValidData) {
        cleanedData.push(cleanedRow);
      } else {
        console.log(`ลบแถว: ${country} - ไม่มีข้อมูลที่ถูกต้อง`);
      }
    }
    
    return cleanedData;
  }
  
  
  /**
   * บันทึกข้อมูลที่ทำความสะอาดแล้วลงฐานข้อมูล
   * @param {Array} cleanedData - ข้อมูลที่ทำความสะอาดแล้ว
   * @param {Array} originalData - ข้อมูลต้นฉบับ
   * @returns {Promise<Object>} ผลลัพธ์การบันทึก
   */
  static async saveCleanedData(cleanedData, originalData = []) {
    try {
      console.log('Starting to save cleaned data...');
      console.log('Cleaned data length:', cleanedData.length);
      
      // ตรวจสอบการเชื่อมต่อฐานข้อมูล
      await CountryData.sequelize.authenticate();
      console.log('Database connection verified');
      
      // ลบข้อมูลเก่าทั้งหมด
      console.log('Clearing old data...');
      await CountryData.destroy({ where: {} });
      console.log('Old data cleared');
      
      // บันทึกข้อมูลใหม่
      console.log('Creating new records...');
      const result = await CountryData.bulkCreate(cleanedData);
      console.log('Records created:', result.length);
      
      const removedRows = originalData.length - cleanedData.length;
      
      return {
        success: true,
        message: `บันทึกข้อมูลสำเร็จ ${result.length} ประเทศ (ลบ ${removedRows} แถวที่ไม่มีข้อมูล)`,
        count: result.length,
        removedRows: removedRows,
        originalRows: originalData.length
      };
    } catch (error) {
      console.error('Error saving cleaned data:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return {
        success: false,
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        error: error.message,
        details: error.name
      };
    }
  }
  
  /**
   * ตรวจสอบความถูกต้องของข้อมูล
   * @param {Array} data - ข้อมูลที่ต้องการตรวจสอบ
   * @returns {Object} ผลการตรวจสอบ
   */
  static validateData(data) {
    const errors = [];
    const warnings = [];
    
    if (!Array.isArray(data) || data.length === 0) {
      errors.push('ข้อมูลต้องเป็น array และไม่ว่างเปล่า');
      return { valid: false, errors, warnings };
    }
    
    // ตรวจสอบโครงสร้างข้อมูล
    const requiredFields = ['Country'];
    const years = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // ตรวจสอบฟิลด์ที่จำเป็น
      for (const field of requiredFields) {
        if (!row[field] || row[field].toString().trim() === '') {
          errors.push(`แถวที่ ${i + 1}: 缺少 ${field} 字段`);
        }
      }
      
      // ตรวจสอบข้อมูลปี
      let hasValidData = false;
      for (const year of years) {
        if (row[year] !== null && row[year] !== undefined && row[year] !== '' && row[year] !== 'N/A' && !isNaN(row[year])) {
          hasValidData = true;
          break;
        }
      }
      
      if (!hasValidData) {
        warnings.push(`แถวที่ ${i + 1}: ประเทศ ${row.Country} จะถูกลบออกเนื่องจากไม่มีข้อมูลปีใดเลย`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      totalRows: data.length
    };
  }
}

module.exports = DataCleansingService;
