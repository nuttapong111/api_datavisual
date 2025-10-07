// สคริปต์สำหรับตั้งค่า PostgreSQL ใน local environment
const { Sequelize } = require('sequelize');

// เชื่อมต่อกับ PostgreSQL server (ไม่ระบุ database)
const sequelize = new Sequelize('postgresql://postgres:password@localhost:5432/postgres', {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: false
  }
});

async function setupLocalPostgres() {
  try {
    console.log('🔄 กำลังเชื่อมต่อกับ PostgreSQL server...');
    await sequelize.authenticate();
    console.log('✅ เชื่อมต่อกับ PostgreSQL server สำเร็จ');

    // สร้างฐานข้อมูล api_looker
    console.log('🔄 กำลังสร้างฐานข้อมูล api_looker...');
    await sequelize.query('CREATE DATABASE api_looker;');
    console.log('✅ สร้างฐานข้อมูล api_looker สำเร็จ');

    // ปิดการเชื่อมต่อกับ postgres database
    await sequelize.close();

    // เชื่อมต่อกับฐานข้อมูล api_looker ที่สร้างใหม่
    console.log('🔄 กำลังเชื่อมต่อกับฐานข้อมูล api_looker...');
    const apiLookerDB = new Sequelize('postgresql://postgres:password@localhost:5432/api_looker', {
      dialect: 'postgres',
      logging: console.log,
      dialectOptions: {
        ssl: false
      }
    });

    await apiLookerDB.authenticate();
    console.log('✅ เชื่อมต่อกับฐานข้อมูล api_looker สำเร็จ');

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
    
    await apiLookerDB.query(createTableSQL);
    console.log('✅ สร้างตาราง country_data สำเร็จ');

    // สร้าง index
    console.log('🔄 กำลังสร้าง index...');
    await apiLookerDB.query('CREATE INDEX IF NOT EXISTS idx_country_data_country ON country_data(country);');
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
    
    await apiLookerDB.query(insertSQL);
    console.log('✅ แทรกข้อมูลตัวอย่างสำเร็จ');

    // ตรวจสอบผลลัพธ์
    const [results] = await apiLookerDB.query('SELECT COUNT(*) as count FROM country_data');
    console.log(`📊 จำนวนข้อมูลในตาราง: ${results[0].count} รายการ`);

    // แสดงข้อมูลที่สร้าง
    const [data] = await apiLookerDB.query('SELECT country, year_2000, year_2010, year_2012 FROM country_data LIMIT 3');
    console.log('📋 ข้อมูลตัวอย่าง:');
    console.table(data);

    await apiLookerDB.close();
    console.log('🎉 ตั้งค่า PostgreSQL ใน local environment สำเร็จ!');

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    if (error.message.includes('database "api_looker" already exists')) {
      console.log('ℹ️  ฐานข้อมูล api_looker มีอยู่แล้ว');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('❌ ไม่สามารถเชื่อมต่อกับ PostgreSQL server');
      console.log('💡 กรุณาติดตั้งและเริ่มต้น PostgreSQL server ก่อน');
      console.log('   - macOS: brew install postgresql && brew services start postgresql');
      console.log('   - Ubuntu: sudo apt install postgresql postgresql-contrib');
      console.log('   - Windows: ดาวน์โหลดจาก https://www.postgresql.org/download/');
    }
  } finally {
    try {
      await sequelize.close();
    } catch (e) {
      // ignore
    }
  }
}

setupLocalPostgres();

