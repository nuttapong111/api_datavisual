const { Sequelize } = require('sequelize');

// ใช้ DATABASE_URL เดียวกันกับที่สร้างตาราง
const DATABASE_URL = "postgresql://postgres:uWGyYCeOFFMRlexEzJBRjvCgoUWeYtkl@ballast.proxy.rlwy.net:35894/railway";

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

async function testDatabaseConnection() {
  try {
    console.log('🔄 กำลังทดสอบการเชื่อมต่อฐานข้อมูล...');
    await sequelize.authenticate();
    console.log('✅ เชื่อมต่อกับฐานข้อมูลสำเร็จ');

    // ตรวจสอบตาราง
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'country_data'
    `);
    
    if (tables.length > 0) {
      console.log('✅ ตาราง country_data มีอยู่');
      
      // ตรวจสอบจำนวนข้อมูล
      const [count] = await sequelize.query('SELECT COUNT(*) as count FROM country_data');
      console.log(`📊 จำนวนข้อมูลในตาราง: ${count[0].count} รายการ`);
      
      // แสดงข้อมูลตัวอย่าง
      const [data] = await sequelize.query('SELECT country, year_2000, year_2010 FROM country_data LIMIT 3');
      console.log('📋 ข้อมูลตัวอย่าง:');
      console.table(data);
      
    } else {
      console.log('❌ ไม่พบตาราง country_data');
    }

    // ทดสอบการบันทึกข้อมูล
    console.log('🔄 ทดสอบการบันทึกข้อมูล...');
    const testData = {
      country: 'Test Country',
      year_2000: 100.0,
      year_2001: 101.0,
      year_2002: 102.0
    };
    
    const [insertResult] = await sequelize.query(`
      INSERT INTO country_data (country, year_2000, year_2001, year_2002) 
      VALUES (:country, :year_2000, :year_2001, :year_2002)
      ON CONFLICT (country) DO UPDATE SET
        year_2000 = EXCLUDED.year_2000,
        year_2001 = EXCLUDED.year_2001,
        year_2002 = EXCLUDED.year_2002
      RETURNING id
    `, {
      replacements: testData
    });
    
    console.log('✅ การบันทึกข้อมูลสำเร็จ:', insertResult[0]);
    
    // ลบข้อมูลทดสอบ
    await sequelize.query('DELETE FROM country_data WHERE country = :country', {
      replacements: { country: 'Test Country' }
    });
    console.log('✅ ลบข้อมูลทดสอบเรียบร้อย');

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

testDatabaseConnection();
