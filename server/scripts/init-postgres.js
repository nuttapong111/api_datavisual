const { Sequelize } = require('sequelize');
const CountryData = require('../models/CountryData');

// ฟังก์ชันสำหรับสร้างตารางใน PostgreSQL
async function initializePostgreSQL() {
  try {
    console.log('🔄 กำลังเชื่อมต่อกับ PostgreSQL...');
    
    // Test connection
    await CountryData.sequelize.authenticate();
    console.log('✅ เชื่อมต่อกับ PostgreSQL สำเร็จ');
    
    // Sync database (สร้างตารางถ้ายังไม่มี)
    console.log('🔄 กำลังสร้างตาราง...');
    await CountryData.sequelize.sync({ force: false });
    console.log('✅ สร้างตารางสำเร็จ');
    
    // ตรวจสอบจำนวนข้อมูล
    const count = await CountryData.count();
    console.log(`📊 จำนวนข้อมูลในฐานข้อมูล: ${count} รายการ`);
    
    return true;
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการเชื่อมต่อกับ PostgreSQL:', error);
    return false;
  }
}

// ฟังก์ชันสำหรับปิดการเชื่อมต่อ
async function closeConnection() {
  try {
    await CountryData.sequelize.close();
    console.log('✅ ปิดการเชื่อมต่อกับ PostgreSQL เรียบร้อย');
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการปิดการเชื่อมต่อ:', error);
  }
}

module.exports = {
  initializePostgreSQL,
  closeConnection
};

// ถ้าเรียกใช้ไฟล์นี้โดยตรง
if (require.main === module) {
  initializePostgreSQL()
    .then((success) => {
      if (success) {
        console.log('🎉 เริ่มต้น PostgreSQL สำเร็จ');
      } else {
        console.log('💥 เริ่มต้น PostgreSQL ล้มเหลว');
        process.exit(1);
      }
    })
    .then(() => closeConnection())
    .catch((error) => {
      console.error('💥 เกิดข้อผิดพลาด:', error);
      process.exit(1);
    });
}
