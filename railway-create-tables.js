// สคริปต์สำหรับสร้างตารางใน Railway PostgreSQL
// ใช้ DATABASE_URL ที่ Railway ให้มา

const { Sequelize } = require('sequelize');

// ใช้ DATABASE_URL จาก environment variable ของ Railway
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ไม่พบ DATABASE_URL environment variable');
  console.log('กรุณาตั้งค่า DATABASE_URL ใน Railway dashboard');
  process.exit(1);
}

console.log('🔗 DATABASE_URL:', DATABASE_URL.replace(/\/\/.*@/, '//***:***@')); // ซ่อน credentials

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function createTablesInRailway() {
  try {
    console.log('🔄 กำลังเชื่อมต่อกับฐานข้อมูล Railway...');
    await sequelize.authenticate();
    console.log('✅ เชื่อมต่อกับฐานข้อมูลสำเร็จ');

    // ตรวจสอบว่ามีตารางอยู่แล้วหรือไม่
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'country_data'
    `);
    
    if (tables.length > 0) {
      console.log('⚠️  ตาราง country_data มีอยู่แล้ว');
      
      // ตรวจสอบจำนวนข้อมูล
      const [count] = await sequelize.query('SELECT COUNT(*) as count FROM country_data');
      console.log(`📊 จำนวนข้อมูลในตาราง: ${count[0].count} รายการ`);
      
      if (count[0].count > 0) {
        console.log('✅ ฐานข้อมูลพร้อมใช้งานแล้ว');
        return;
      }
    }

    // สร้างตาราง country_data
    console.log('🔄 กำลังสร้างตาราง country_data...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS country_data (
        id SERIAL PRIMARY KEY,
        country VARCHAR(255) NOT NULL UNIQUE,
        year_2000 FLOAT,
        year_2001 FLOAT,
        year_2002 FLOAT,
        year_2003 FLOAT,
        year_2004 FLOAT,
        year_2005 FLOAT,
        year_2006 FLOAT,
        year_2007 FLOAT,
        year_2008 FLOAT,
        year_2009 FLOAT,
        year_2010 FLOAT,
        year_2011 FLOAT,
        year_2012 FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await sequelize.query(createTableSQL);
    console.log('✅ สร้างตาราง country_data สำเร็จ');

    // สร้าง index
    console.log('🔄 กำลังสร้าง index...');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_country_data_country ON country_data(country);');
    console.log('✅ สร้าง index สำเร็จ');

    // แทรกข้อมูลตัวอย่าง
    console.log('🔄 กำลังแทรกข้อมูลตัวอย่าง...');
    const insertSQL = `
      INSERT INTO country_data (country, year_2000, year_2001, year_2002, year_2003, year_2004, year_2005, year_2006, year_2007, year_2008, year_2009, year_2010, year_2011, year_2012) 
      VALUES 
      ('Thailand', 100.5, 102.3, 105.1, 108.7, 112.4, 115.8, 119.2, 123.6, 127.9, 131.4, 135.7, 139.2, 142.8),
      ('Singapore', 200.1, 205.3, 210.7, 216.2, 221.8, 227.5, 233.1, 238.9, 244.6, 250.3, 256.1, 261.8, 267.5),
      ('Malaysia', 150.2, 153.7, 157.3, 161.1, 164.8, 168.5, 172.2, 175.9, 179.6, 183.3, 187.0, 190.7, 194.4)
      ON CONFLICT (country) DO NOTHING;
    `;
    
    await sequelize.query(insertSQL);
    console.log('✅ แทรกข้อมูลตัวอย่างสำเร็จ');

    // ตรวจสอบผลลัพธ์
    const [results] = await sequelize.query('SELECT COUNT(*) as count FROM country_data');
    console.log(`📊 จำนวนข้อมูลในตาราง: ${results[0].count} รายการ`);

    // แสดงข้อมูลที่สร้าง
    const [data] = await sequelize.query('SELECT country, year_2000, year_2010, year_2012 FROM country_data LIMIT 5');
    console.log('📋 ข้อมูลตัวอย่าง:');
    console.table(data);

    console.log('🎉 สร้างตารางและข้อมูลสำเร็จ!');

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
  } finally {
    await sequelize.close();
    console.log('✅ ปิดการเชื่อมต่อกับฐานข้อมูล');
  }
}

// รันสคริปต์
if (require.main === module) {
  createTablesInRailway();
}

module.exports = { createTablesInRailway };
