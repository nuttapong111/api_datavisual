const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// ตั้งค่า database connection
const sequelize = new Sequelize(
  process.env.DATABASE_URL || process.env.DB_URL || 'postgresql://localhost:5432/api_looker',
  {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
);

async function runSQLFile() {
  try {
    console.log('🔄 กำลังเชื่อมต่อกับฐานข้อมูล...');
    await sequelize.authenticate();
    console.log('✅ เชื่อมต่อกับฐานข้อมูลสำเร็จ');

    // อ่านไฟล์ SQL
    const sqlPath = path.join(__dirname, 'create-tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('🔄 กำลังรัน SQL script...');
    
    // แยกคำสั่ง SQL และรันทีละคำสั่ง
    const sqlCommands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    for (const command of sqlCommands) {
      if (command.trim()) {
        console.log(`🔄 รันคำสั่ง: ${command.substring(0, 50)}...`);
        await sequelize.query(command);
      }
    }

    console.log('✅ รัน SQL script สำเร็จ');
    
    // ตรวจสอบผลลัพธ์
    const [results] = await sequelize.query('SELECT COUNT(*) as count FROM country_data');
    console.log(`📊 จำนวนข้อมูลในตาราง: ${results[0].count} รายการ`);

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('✅ ปิดการเชื่อมต่อกับฐานข้อมูล');
  }
}

// รันสคริปต์
if (require.main === module) {
  runSQLFile();
}

module.exports = { runSQLFile };
