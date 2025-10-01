# 🐘 PostgreSQL Configuration Guide

## การเปลี่ยนจาก SQLite เป็น PostgreSQL

### 1. การติดตั้ง Dependencies

```bash
npm install pg pg-hstore
```

### 2. Environment Variables

#### สำหรับ Development:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/api_looker
NODE_ENV=development
```

#### สำหรับ Production (Railway):
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
```

### 3. การตั้งค่า PostgreSQL

#### 3.1 ติดตั้ง PostgreSQL
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# ดาวน์โหลดจาก https://www.postgresql.org/download/windows/
```

#### 3.2 สร้าง Database
```sql
-- เข้าสู่ PostgreSQL
psql -U postgres

-- สร้าง database
CREATE DATABASE api_looker;

-- สร้าง user (optional)
CREATE USER api_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE api_looker TO api_user;
```

### 4. การ Deploy บน Railway

#### 4.1 เพิ่ม PostgreSQL Service
1. ไปที่ Railway Dashboard
2. คลิก "New Service" > "Database" > "PostgreSQL"
3. Railway จะสร้าง PostgreSQL instance และให้ `DATABASE_URL`

#### 4.2 ตั้งค่า Environment Variables
```
NODE_ENV=production
PORT=3001
DATABASE_URL=${{Postgres.DATABASE_URL}}
CORS_ORIGIN=*
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### 5. การ Migration ข้อมูล

#### 5.1 Export จาก SQLite
```bash
# ใช้ sqlite3 command line
sqlite3 data/database.sqlite .dump > backup.sql
```

#### 5.2 Import ไป PostgreSQL
```bash
# แปลง SQLite dump เป็น PostgreSQL format
# (ต้องแก้ไข syntax บางส่วน)

# Import ข้อมูล
psql -U postgres -d api_looker -f converted_backup.sql
```

### 6. การทดสอบ

#### 6.1 ทดสอบการเชื่อมต่อ
```bash
# รัน script ทดสอบ
node server/scripts/init-postgres.js
```

#### 6.2 ทดสอบ API
```bash
# ตรวจสอบสถานะ
curl http://localhost:3001/api/upload/status

# ทดสอบข้อมูล
curl http://localhost:3001/api/data/summary
```

### 7. การ Monitor และ Debug

#### 7.1 ดู Logs
```bash
# Railway logs
railway logs

# Local logs
npm run server
```

#### 7.2 ตรวจสอบ Database
```sql
-- เชื่อมต่อกับ PostgreSQL
psql -U postgres -d api_looker

-- ดูตาราง
\dt

-- ดูข้อมูล
SELECT COUNT(*) FROM "CountryData";
```

### 8. Performance Optimization

#### 8.1 Connection Pooling
```javascript
// ใน database.js
pool: {
  max: 5,        // จำนวน connection สูงสุด
  min: 0,        // จำนวน connection ต่ำสุด
  acquire: 30000, // เวลารอ connection (ms)
  idle: 10000    // เวลาที่ connection ว่าง (ms)
}
```

#### 8.2 Indexing
```sql
-- สร้าง index สำหรับ performance
CREATE INDEX idx_country_data_country ON "CountryData" (country);
CREATE INDEX idx_country_data_year_2012 ON "CountryData" (year_2012);
```

### 9. Backup และ Recovery

#### 9.1 Backup
```bash
# Backup database
pg_dump -U postgres -d api_looker > backup_$(date +%Y%m%d).sql
```

#### 9.2 Restore
```bash
# Restore database
psql -U postgres -d api_looker < backup_20240101.sql
```

### 10. Troubleshooting

#### 10.1 Connection Issues
- ตรวจสอบ `DATABASE_URL`
- ตรวจสอบ network connectivity
- ตรวจสอบ SSL settings

#### 10.2 Performance Issues
- ตรวจสอบ connection pool settings
- ตรวจสอบ database indexes
- ตรวจสอบ query performance

#### 10.3 Migration Issues
- ตรวจสอบ data types compatibility
- ตรวจสอบ constraint violations
- ตรวจสอบ foreign key relationships

---

## 📊 ข้อดีของ PostgreSQL

- ✅ **Performance** - เร็วกว่า SQLite สำหรับ concurrent access
- ✅ **Scalability** - รองรับการใช้งานหลาย user
- ✅ **Features** - มี advanced features มากกว่า
- ✅ **Cloud Support** - รองรับ cloud platforms ดี
- ✅ **ACID Compliance** - รับประกัน data integrity

## 🔄 Migration Checklist

- [ ] ติดตั้ง PostgreSQL dependencies
- [ ] ตั้งค่า environment variables
- [ ] สร้าง database และ user
- [ ] ทดสอบการเชื่อมต่อ
- [ ] Migrate ข้อมูล (ถ้ามี)
- [ ] ทดสอบ API endpoints
- [ ] Deploy บน Railway
- [ ] ตั้งค่า monitoring
- [ ] สร้าง backup strategy
