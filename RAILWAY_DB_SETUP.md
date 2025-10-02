# การตั้งค่าฐานข้อมูล PostgreSQL บน Railway

## ขั้นตอนการสร้างตารางในฐานข้อมูล Railway

### 1. วิธีที่ 1: ใช้ Railway Dashboard (แนะนำ)

1. ไปที่ Railway Dashboard
2. เลือกโปรเจกต์ `discerning-transformation`
3. คลิกที่บริการ `Postgres`
4. ไปที่แท็บ `Database` > `Data`
5. คลิกปุ่ม `Create table`
6. ใช้ SQL ต่อไปนี้:

```sql
CREATE TABLE country_data (
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

CREATE INDEX idx_country_data_country ON country_data(country);

INSERT INTO country_data (country, year_2000, year_2001, year_2002, year_2003, year_2004, year_2005, year_2006, year_2007, year_2008, year_2009, year_2010, year_2011, year_2012) 
VALUES 
('Thailand', 100.5, 102.3, 105.1, 108.7, 112.4, 115.8, 119.2, 123.6, 127.9, 131.4, 135.7, 139.2, 142.8),
('Singapore', 200.1, 205.3, 210.7, 216.2, 221.8, 227.5, 233.1, 238.9, 244.6, 250.3, 256.1, 261.8, 267.5),
('Malaysia', 150.2, 153.7, 157.3, 161.1, 164.8, 168.5, 172.2, 175.9, 179.6, 183.3, 187.0, 190.7, 194.4);
```

### 2. วิธีที่ 2: ใช้ Command Line

1. ตั้งค่า DATABASE_URL ใน Railway:
   - ไปที่ Railway Dashboard
   - เลือกบริการ `Postgres`
   - ไปที่แท็บ `Variables`
   - คัดลอกค่า `DATABASE_URL`

2. รันคำสั่ง:
```bash
# ตั้งค่า DATABASE_URL
export DATABASE_URL="postgresql://..."

# รันสคริปต์สร้างตาราง
npm run db:create-railway
```

### 3. วิธีที่ 3: ใช้ Railway CLI

```bash
# ติดตั้ง Railway CLI
npm install -g @railway/cli

# Login
railway login

# เชื่อมต่อกับโปรเจกต์
railway link

# รัน SQL
railway run node railway-create-tables.js
```

## ตรวจสอบผลลัพธ์

หลังจากสร้างตารางแล้ว ให้ทดสอบ:

1. ตรวจสอบสถานะ API:
```bash
curl -s "https://web-production-c1c01.up.railway.app/api/upload/status" | jq .
```

2. ทดสอบการอัปโหลดไฟล์:
```bash
curl -X POST -F "file=@test-data.csv" "https://web-production-c1c01.up.railway.app/api/upload/excel"
```

## โครงสร้างตาราง

ตาราง `country_data` มีโครงสร้างดังนี้:

- `id`: Primary Key (Auto Increment)
- `country`: ชื่อประเทศ (Unique)
- `year_2000` ถึง `year_2012`: ข้อมูลแต่ละปี (Float)
- `created_at`, `updated_at`: Timestamps
- `idx_country_data_country`: Index สำหรับการค้นหาตามชื่อประเทศ
