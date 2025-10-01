# 🚀 Railway Deployment Guide

## การ Deploy บน Railway

### 1. เตรียม Repository
```bash
# Clone repository
git clone https://github.com/nuttapong111/api_datavisual.git
cd api_datavisual

# Install dependencies
npm install
cd client && npm install && cd ..
```

### 2. ตั้งค่า Railway

#### 2.1 สร้าง Project ใหม่
1. ไปที่ [Railway.app](https://railway.app)
2. เข้าสู่ระบบด้วย GitHub
3. คลิก "New Project"
4. เลือก "Deploy from GitHub repo"
5. เลือก repository `nuttapong111/api_datavisual`

#### 2.2 ตั้งค่า Environment Variables
ใน Railway Dashboard > Project > Variables:

```
NODE_ENV=production
PORT=3001
DB_PATH=./data/database.sqlite
CORS_ORIGIN=*
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

#### 2.3 ตั้งค่า Build Command
- **Build Command:** `npm run build:prod`
- **Start Command:** `npm run start:prod`

### 3. การ Deploy

#### 3.1 Auto Deploy
- Railway จะ auto deploy เมื่อมีการ push ไปที่ main branch
- ตรวจสอบ logs ใน Railway Dashboard

#### 3.2 Manual Deploy
```bash
# Push changes
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 4. ตรวจสอบการ Deploy

#### 4.1 Health Check
- URL: `https://your-app-name.railway.app/api/upload/status`
- ควรได้ response: `{"success":true,"data":{"hasData":true}}`

#### 4.2 API Endpoints
- **Base URL:** `https://your-app-name.railway.app`
- **API Docs:** `https://your-app-name.railway.app/api`

### 5. การใช้งาน Production

#### 5.1 อัปโหลดข้อมูล
```bash
curl -X POST -F "file=@sample_data.csv" \
  https://your-app-name.railway.app/api/upload/excel
```

#### 5.2 ดูข้อมูล
```bash
# ข้อมูลสรุป
curl https://your-app-name.railway.app/api/data/summary

# ประเทศที่มีค่าสูงสุด
curl https://your-app-name.railway.app/api/data/top-countries

# ประเทศที่มีค่าต่ำสุด
curl https://your-app-name.railway.app/api/data/bottom-countries
```

### 6. การเชื่อมต่อกับ Looker Studio

1. ไปที่ [Looker Studio](https://lookerstudio.google.com)
2. สร้าง Data Source ใหม่
3. เลือก "Community Connectors" > "Custom Connector"
4. ใส่ URL: `https://your-app-name.railway.app/api/data/all`
5. ตั้งค่า authentication (ถ้าจำเป็น)

### 7. การ Monitor และ Debug

#### 7.1 ดู Logs
- Railway Dashboard > Project > Deployments > Logs

#### 7.2 ตรวจสอบ Metrics
- Railway Dashboard > Project > Metrics

#### 7.3 Database
- ข้อมูลจะถูกเก็บใน Railway's persistent storage
- ไฟล์ `database.sqlite` จะถูกสร้างอัตโนมัติ

### 8. การอัปเดต

```bash
# แก้ไขโค้ด
# ...

# Commit และ Push
git add .
git commit -m "Update for production"
git push origin main

# Railway จะ auto deploy
```

### 9. Troubleshooting

#### 9.1 Build Failed
- ตรวจสอบ `package.json` scripts
- ตรวจสอบ dependencies
- ดู logs ใน Railway Dashboard

#### 9.2 App Crashed
- ตรวจสอบ environment variables
- ตรวจสอบ database connection
- ดู error logs

#### 9.3 API ไม่ทำงาน
- ตรวจสอบ CORS settings
- ตรวจสอบ port configuration
- ตรวจสอบ health check endpoint

### 10. Security Considerations

- ตั้งค่า CORS ให้เหมาะสม
- ใช้ HTTPS (Railway ให้มาโดยอัตโนมัติ)
- จำกัด file upload size
- ใช้ environment variables สำหรับ sensitive data

---

## 📞 Support

หากมีปัญหาการ deploy สามารถดู:
- [Railway Documentation](https://docs.railway.app)
- [GitHub Issues](https://github.com/nuttapong111/api_datavisual/issues)
