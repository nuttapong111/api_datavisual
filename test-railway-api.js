const { Sequelize } = require('sequelize');

// ใช้ DATABASE_URL เดียวกันกับที่ Railway ใช้
const DATABASE_URL = "postgresql://postgres:uWGyYCeOFFMRlexEzJBRjvCgoUWeYtkl@ballast.proxy.rlwy.net:35894/railway";

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // ปิด logging เพื่อความชัดเจน
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function testRailwayAPI() {
  try {
    console.log('🔄 กำลังทดสอบ Railway API...');
    
    // ตรวจสอบการเชื่อมต่อ
    await sequelize.authenticate();
    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ');
    
    // ตรวจสอบข้อมูลในตาราง
    const [count] = await sequelize.query('SELECT COUNT(*) as count FROM country_data');
    console.log(`📊 จำนวนข้อมูลในตาราง: ${count[0].count} รายการ`);
    
    // ทดสอบการบันทึกข้อมูลแบบเดียวกับที่ API ทำ
    console.log('🔄 ทดสอบการบันทึกข้อมูล...');
    
    const testData = [
      {
        country: 'Test Country 1',
        year_2000: 100.0,
        year_2001: 101.0,
        year_2002: 102.0
      },
      {
        country: 'Test Country 2',
        year_2000: 200.0,
        year_2001: 201.0,
        year_2002: 202.0
      }
    ];
    
    // ลบข้อมูลเก่า
    await sequelize.query('DELETE FROM country_data WHERE country LIKE :pattern', {
      replacements: { pattern: 'Test Country%' }
    });
    
    // บันทึกข้อมูลใหม่
    for (const row of testData) {
      await sequelize.query(`
        INSERT INTO country_data (country, year_2000, year_2001, year_2002) 
        VALUES (:country, :year_2000, :year_2001, :year_2002)
        ON CONFLICT (country) DO UPDATE SET
          year_2000 = EXCLUDED.year_2000,
          year_2001 = EXCLUDED.year_2001,
          year_2002 = EXCLUDED.year_2002
      `, {
        replacements: row
      });
    }
    
    console.log('✅ การบันทึกข้อมูลสำเร็จ');
    
    // ตรวจสอบข้อมูลที่บันทึก
    const [results] = await sequelize.query('SELECT country, year_2000 FROM country_data WHERE country LIKE :pattern', {
      replacements: { pattern: 'Test Country%' }
    });
    
    console.log('📋 ข้อมูลที่บันทึก:');
    console.table(results);
    
    // ลบข้อมูลทดสอบ
    await sequelize.query('DELETE FROM country_data WHERE country LIKE :pattern', {
      replacements: { pattern: 'Test Country%' }
    });
    
    console.log('✅ ลบข้อมูลทดสอบเรียบร้อย');
    console.log('🎉 ทดสอบสำเร็จ! ฐานข้อมูลพร้อมใช้งาน');

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

testRailwayAPI();
