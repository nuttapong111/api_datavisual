# 🚀 Quick Start Guide

## การเริ่มต้นใช้งานอย่างรวดเร็ว

### 1. รันระบบทั้งหมด
```bash
./start.sh
```
หรือ
```bash
npm run start:all
```

### 2. เข้าถึงระบบ
- **Web Interface**: http://localhost:3000
- **API Endpoints**: http://localhost:3001/api

### 3. ทดสอบ API
```bash
# ตรวจสอบสถานะ
npm run test:api

# อัปโหลดไฟล์ตัวอย่าง
npm run upload:sample
```

## 📊 ข้อมูลที่ทดสอบแล้ว

ระบบได้ทดสอบกับข้อมูลตัวอย่าง 42 ประเทศ (2000-2012) แล้ว

### ผลลัพธ์การทดสอบ:
- ✅ อัปโหลดไฟล์ Excel สำเร็จ
- ✅ Data cleansing ทำงานได้
- ✅ API endpoints ทำงานได้ทั้งหมด
- ✅ React frontend แสดงผลได้

## 🔗 API Endpoints สำหรับ Looker Studio

### ข้อมูลสรุป
```
GET http://localhost:3001/api/data/summary
```

### ข้อมูลทั้งหมด
```
GET http://localhost:3001/api/data/all?page=1&limit=1000
```

### ประเทศที่มีค่ามากสุด
```
GET http://localhost:3001/api/data/top-countries?year=2012&limit=20
```

### ประเทศที่มีค่าต่ำสุด
```
GET http://localhost:3001/api/data/bottom-countries?year=2012&limit=20
```

### จำนวนข้อมูลทั้งหมด
```
GET http://localhost:3001/api/data/total-count
```

## 📁 ไฟล์สำคัญ

- `sample_data.csv` - ไฟล์ข้อมูลตัวอย่าง
- `start.sh` - สคริปต์เริ่มต้นระบบ
- `README.md` - คู่มือการใช้งานแบบละเอียด

## 🛠️ การแก้ไขปัญหา

### Port ถูกใช้งาน
```bash
# หยุด process ที่ใช้ port
pkill -f "node.*server/index.js"
pkill -f "react-scripts start"
```

### ข้อมูลไม่แสดง
```bash
# ล้างข้อมูลและอัปโหลดใหม่
curl -X DELETE http://localhost:3001/api/upload/clear
npm run upload:sample
```

## 📞 การสนับสนุน

หากมีปัญหา กรุณาตรวจสอบ:
1. Node.js และ npm ติดตั้งแล้ว
2. Port 3000 และ 3001 ว่าง
3. ไฟล์ sample_data.csv อยู่ในโฟลเดอร์หลัก

