// ทดสอบการเชื่อมต่อฐานข้อมูลด้วย DATABASE_PUBLIC_URL
const { Sequelize } = require('sequelize');

// ใช้ DATABASE_PUBLIC_URL แบบเดียวกับที่ Railway ใช้
const DATABASE_PUBLIC_URL = "postgresql://postgres:uWGyYCeOFFMRlexEzJBRjvCgoUWeYtkl@ballast.proxy.rlwy.net:35894/railway";

const sequelize = new Sequelize(DATABASE_PUBLIC_URL, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function testDatabasePublicUrl() {
  try {
    console.log('🔄 กำลังทดสอบการเชื่อมต่อด้วย DATABASE_PUBLIC_URL...');
    console.log('🔗 DATABASE_PUBLIC_URL:', DATABASE_PUBLIC_URL.replace(/\/\/.*@/, '//***:***@'));
    
    // ตรวจสอบการเชื่อมต่อ
    await sequelize.authenticate();
    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ');
    
    // ตรวจสอบตาราง
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'country_data'
    `);
    
    if (tables.length === 0) {
      console.log('❌ ไม่พบตาราง country_data');
      return;
    }
    
    console.log('✅ ตาราง country_data มีอยู่');
    
    // ตรวจสอบจำนวนข้อมูล
    const [count] = await sequelize.query('SELECT COUNT(*) as count FROM country_data');
    console.log(`📊 จำนวนข้อมูลในตาราง: ${count[0].count} รายการ`);
    
    // ทดสอบการบันทึกข้อมูล
    console.log('🔄 ทดสอบการบันทึกข้อมูล...');
    
    const testData = {
      country: 'Test Public URL Country',
      year_2000: 100.0,
      year_2001: 101.0,
      year_2002: 102.0
    };
    
    // ลบข้อมูลเก่า
    await sequelize.query('DELETE FROM country_data WHERE country = :country', {
      replacements: { country: 'Test Public URL Country' }
    });
    
    // บันทึกข้อมูลใหม่
    const [result] = await sequelize.query(`
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
    
    console.log('✅ การบันทึกข้อมูลสำเร็จ:', result[0]);
    
    // ตรวจสอบข้อมูลที่บันทึก
    const [data] = await sequelize.query('SELECT country, year_2000 FROM country_data WHERE country = :country', {
      replacements: { country: 'Test Public URL Country' }
    });
    
    console.log('📋 ข้อมูลที่บันทึก:');
    console.table(data);
    
    // ลบข้อมูลทดสอบ
    await sequelize.query('DELETE FROM country_data WHERE country = :country', {
      replacements: { country: 'Test Public URL Country' }
    });
    
    console.log('✅ ลบข้อมูลทดสอบเรียบร้อย');
    console.log('🎉 ทดสอบสำเร็จ! DATABASE_PUBLIC_URL ใช้งานได้');

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

testDatabasePublicUrl();
