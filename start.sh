#!/bin/bash

echo "🚀 กำลังเริ่มต้นระบบ API Looker Dashboard..."

# ตรวจสอบว่า Node.js ติดตั้งแล้วหรือไม่
if ! command -v node &> /dev/null; then
    echo "❌ ไม่พบ Node.js กรุณาติดตั้ง Node.js ก่อน"
    exit 1
fi

# ตรวจสอบว่า npm ติดตั้งแล้วหรือไม่
if ! command -v npm &> /dev/null; then
    echo "❌ ไม่พบ npm กรุณาติดตั้ง npm ก่อน"
    exit 1
fi

# สร้างโฟลเดอร์ที่จำเป็น
mkdir -p data uploads

echo "📦 กำลังติดตั้ง dependencies..."

# ติดตั้ง backend dependencies
if [ ! -d "node_modules" ]; then
    echo "ติดตั้ง backend dependencies..."
    npm install
fi

# ติดตั้ง frontend dependencies
if [ ! -d "client/node_modules" ]; then
    echo "ติดตั้ง frontend dependencies..."
    cd client
    npm install
    cd ..
fi

echo "✅ Dependencies ติดตั้งเสร็จสิ้น"

# ตรวจสอบว่า port 3001 ว่างหรือไม่
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3001 ถูกใช้งานอยู่ กำลังหยุด process..."
    pkill -f "node.*server/index.js"
    sleep 2
fi

# ตรวจสอบว่า port 3000 ว่างหรือไม่
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 ถูกใช้งานอยู่ กำลังหยุด process..."
    pkill -f "react-scripts start"
    sleep 2
fi

echo "🌐 กำลังเริ่มต้นเซิร์ฟเวอร์..."

# เริ่มต้น backend server
echo "เริ่มต้น Backend Server (Port 3001)..."
npm run server &
BACKEND_PID=$!

# รอให้ backend เริ่มต้น
sleep 5

# ตรวจสอบว่า backend ทำงานหรือไม่
if ! curl -s http://localhost:3001/api/upload/status > /dev/null; then
    echo "❌ Backend Server ไม่สามารถเริ่มต้นได้"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Backend Server ทำงานที่ http://localhost:3001"

# เริ่มต้น frontend server
echo "เริ่มต้น Frontend Server (Port 3000)..."
cd client
npm start &
FRONTEND_PID=$!
cd ..

# รอให้ frontend เริ่มต้น
sleep 10

echo ""
echo "🎉 ระบบเริ่มต้นเสร็จสิ้น!"
echo ""
echo "📊 Web Interface: http://localhost:3000"
echo "📡 API Endpoints: http://localhost:3001/api"
echo ""
echo "🔗 API Endpoints สำหรับ Looker Studio:"
echo "   - ข้อมูลสรุป: http://localhost:3001/api/data/summary"
echo "   - ข้อมูลทั้งหมด: http://localhost:3001/api/data/all"
echo "   - ประเทศที่มีค่ามากสุด: http://localhost:3001/api/data/top-countries"
echo "   - ประเทศที่มีค่าต่ำสุด: http://localhost:3001/api/data/bottom-countries"
echo "   - จำนวนข้อมูลทั้งหมด: http://localhost:3001/api/data/total-count"
echo ""
echo "📁 ไฟล์ตัวอย่าง: sample_data.csv"
echo ""
echo "🛑 กด Ctrl+C เพื่อหยุดระบบ"

# รอให้ผู้ใช้กด Ctrl+C
trap 'echo ""; echo "🛑 กำลังหยุดระบบ..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "✅ ระบบหยุดทำงานแล้ว"; exit 0' INT

# รอให้ process ทำงาน
wait

