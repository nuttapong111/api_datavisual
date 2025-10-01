const sequelize = require('./config/database');
const CountryData = require('./models/CountryData');

async function initializeDatabase() {
  try {
    // ทดสอบการเชื่อมต่อฐานข้อมูล
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // สร้างตาราง (ถ้ายังไม่มี)
    await sequelize.sync({ force: false });
    console.log('✅ Database tables synchronized.');
    
    // ตรวจสอบว่ามีข้อมูลหรือไม่
    const count = await CountryData.count();
    console.log(`📊 Current data count: ${count} countries`);
    
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
}

module.exports = initializeDatabase;
