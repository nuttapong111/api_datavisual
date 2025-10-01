# 📊 API Looker Dashboard

ระบบ API service สำหรับวิเคราะห์ข้อมูลประเทศและสร้าง dashboard ใน Looker Studio

## 🚀 คุณสมบัติ

- **อัปโหลดไฟล์ Excel**: รองรับไฟล์ .xlsx, .xls, .csv
- **Data Cleansing**: แทนที่ค่า N/A ด้วยค่าเฉลี่ย, ลบแถวที่ไม่มีข้อมูล
- **ข้อมูลสรุป**: min, max, average ของแต่ละปี
- **20 ประเทศที่มีค่ามากสุด/ต่ำสุด**: แสดงตามปีที่เลือก
- **จำนวนข้อมูลทั้งหมด**: สถิติข้อมูลในระบบ
- **API สำหรับ Looker Studio**: endpoints สำหรับเชื่อมต่อ dashboard

## 🛠️ เทคโนโลยีที่ใช้

### Backend
- **Node.js** + **Express.js**
- **SQLite** + **Sequelize ORM**
- **Multer** สำหรับอัปโหลดไฟล์
- **XLSX** สำหรับอ่านไฟล์ Excel

### Frontend
- **React.js** + **TypeScript**
- **Recharts** สำหรับกราฟ
- **React Dropzone** สำหรับอัปโหลดไฟล์
- **Axios** สำหรับ API calls

## 📁 โครงสร้างโปรเจค

```
api_looker/
├── server/                 # Backend API
│   ├── config/            # Database configuration
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── index.js           # Server entry point
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── App.tsx        # Main app component
│   └── public/
├── data/                  # SQLite database
└── uploads/               # Temporary file uploads
```

## 🚀 การติดตั้งและรัน

### 1. ติดตั้ง Dependencies

```bash
# ติดตั้ง backend dependencies
npm install

# ติดตั้ง frontend dependencies
cd client
npm install
cd ..
```

### 2. รันแอปพลิเคชัน

```bash
# รันทั้ง backend และ frontend
npm run dev

# หรือรันแยกกัน
npm run server    # Backend only
npm run client    # Frontend only
```

### 3. เข้าถึงแอปพลิเคชัน

- **Web Interface**: http://localhost:3000
- **API Endpoints**: http://localhost:5000/api

## 📡 API Endpoints

### ข้อมูลสรุป
- `GET /api/data/summary` - ข้อมูล min, max, average ของแต่ละปี
- `GET /api/data/total-count` - จำนวนข้อมูลทั้งหมด

### ข้อมูลประเทศ
- `GET /api/data/top-countries?year=2012&limit=20` - 20 ประเทศที่มีค่ามากสุด
- `GET /api/data/bottom-countries?year=2012&limit=20` - 20 ประเทศที่มีค่าต่ำสุด
- `GET /api/data/countries` - รายชื่อประเทศทั้งหมด
- `GET /api/data/all?page=1&limit=1000` - ข้อมูลทั้งหมด (สำหรับ Looker Studio)

### อัปโหลดไฟล์
- `POST /api/upload/excel` - อัปโหลดไฟล์ Excel
- `GET /api/upload/status` - ตรวจสอบสถานะข้อมูล
- `DELETE /api/upload/clear` - ล้างข้อมูลทั้งหมด

## 📊 ข้อมูลที่ต้องการในไฟล์ Excel

### โครงสร้างไฟล์
- **คอลัมน์แรก**: ชื่อประเทศ (Country)
- **คอลัมน์ถัดไป**: ข้อมูลปี 2000-2012
- **รองรับ**: ค่า N/A, เซลล์ว่าง (ระบบจะแทนที่ด้วยค่าเฉลี่ย)

### ตัวอย่างข้อมูล
```
Country    | 2000 | 2001 | 2002 | ... | 2012
-----------|------|------|------|-----|-----
Afghanistan| 8.6  | 14.73| 32.54| ... | 45.2
Albania    | 12.3 | 15.8 | 18.9 | ... | 22.1
```

## 🔧 Data Cleansing

ระบบจะทำการทำความสะอาดข้อมูลอัตโนมัติ:

1. **แทนที่ค่า N/A**: ใช้ค่าเฉลี่ยของปีนั้น
2. **ลบแถวว่าง**: แถวที่ไม่มีข้อมูลเลยจะถูกลบ
3. **ตรวจสอบความถูกต้อง**: ตรวจสอบโครงสร้างไฟล์
4. **แปลงข้อมูล**: แปลงเป็นรูปแบบที่เหมาะสมสำหรับฐานข้อมูล

## 📈 การใช้งานกับ Looker Studio

### 1. เชื่อมต่อ Data Source
- ใช้ URL: `http://your-domain.com/api/data/all`
- Method: GET
- Response Format: JSON

### 2. ข้อมูลที่ได้รับ
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "country": "Afghanistan",
      "year_2000": 8.6,
      "year_2001": 14.73,
      "year_2012": 45.2
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 1000,
    "total": 150,
    "pages": 1
  }
}
```

### 3. สร้าง Dashboard
- ใช้ข้อมูลจาก API endpoints ต่างๆ
- สร้างกราฟและตารางตามต้องการ
- อัปเดตข้อมูลแบบ real-time

## 🛡️ Security Features

- **CORS** enabled สำหรับ cross-origin requests
- **Helmet** สำหรับ security headers
- **File validation** สำหรับอัปโหลดไฟล์
- **Error handling** ที่ครอบคลุม

## 📝 การพัฒนาต่อ

### เพิ่มฟีเจอร์ใหม่
1. เพิ่ม API endpoint ใน `server/routes/`
2. เพิ่ม business logic ใน `server/services/`
3. เพิ่ม React component ใน `client/src/components/`

### เปลี่ยนฐานข้อมูล
1. แก้ไข configuration ใน `server/config/database.js`
2. อัปเดต models ใน `server/models/`
3. รัน migration: `sequelize db:migrate`

## 🐛 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **ไม่สามารถอัปโหลดไฟล์**
   - ตรวจสอบขนาดไฟล์ (ไม่เกิน 10MB)
   - ตรวจสอบประเภทไฟล์ (.xlsx, .xls, .csv)

2. **API ไม่ตอบสนอง**
   - ตรวจสอบว่า server รันอยู่ที่ port 5000
   - ตรวจสอบ CORS settings

3. **ข้อมูลไม่แสดง**
   - ตรวจสอบการเชื่อมต่อฐานข้อมูล
   - ตรวจสอบ console logs

## 📞 การสนับสนุน

หากมีปัญหาหรือข้อสงสัย กรุณาติดต่อทีมพัฒนา

---

**สร้างด้วย ❤️ โดยทีมพัฒนา**

