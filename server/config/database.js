const { Sequelize } = require('sequelize');

// ตั้งค่า database connection สำหรับ PostgreSQL
const sequelize = new Sequelize(
  process.env.DATABASE_URL || process.env.DB_URL || 'postgresql://localhost:5432/api_looker',
  {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: false, // ไม่ใช้ createdAt และ updatedAt
      freezeTableName: true, // ใช้ชื่อตารางตามที่กำหนด
    },
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
