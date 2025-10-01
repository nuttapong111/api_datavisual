const { initializePostgreSQL } = require('./scripts/init-postgres');

// ฟังก์ชันสำหรับเริ่มต้นฐานข้อมูล PostgreSQL
async function initializeDatabase() {
  try {
    console.log('🔄 กำลังเริ่มต้นฐานข้อมูล PostgreSQL...');
    
    const success = await initializePostgreSQL();
    
    if (success) {
      console.log('✅ เริ่มต้นฐานข้อมูลสำเร็จ');
      return true;
    } else {
      console.log('❌ เริ่มต้นฐานข้อมูลล้มเหลว');
      return false;
    }
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการเริ่มต้นฐานข้อมูล:', error);
    return false;
  }
}

module.exports = initializeDatabase;
