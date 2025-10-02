const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
  try {
    console.log('🔄 กำลังทดสอบการอัปโหลดไฟล์...');
    
    // สร้างไฟล์ทดสอบ
    const testData = [
      { Country: 'Thailand', '2000': 100.5, '2001': 102.3, '2002': 105.1 },
      { Country: 'Singapore', '2000': 200.1, '2001': 205.3, '2002': 210.7 },
      { Country: 'Malaysia', '2000': 150.2, '2001': 153.7, '2002': 157.3 }
    ];
    
    // สร้างไฟล์ CSV
    const csvContent = 'Country,2000,2001,2002\n' + 
      testData.map(row => `${row.Country},${row['2000']},${row['2001']},${row['2002']}`).join('\n');
    
    fs.writeFileSync('test-data.csv', csvContent);
    console.log('✅ สร้างไฟล์ทดสอบเรียบร้อย');
    
    // ทดสอบการอัปโหลด
    const form = new FormData();
    form.append('file', fs.createReadStream('test-data.csv'));
    
    const response = await fetch('https://web-production-c1c01.up.railway.app/api/upload/excel', {
      method: 'POST',
      body: form
    });
    
    const result = await response.json();
    
    console.log('📊 ผลลัพธ์การอัปโหลด:');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    // ลบไฟล์ทดสอบ
    fs.unlinkSync('test-data.csv');
    console.log('✅ ลบไฟล์ทดสอบเรียบร้อย');
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
  }
}

testUpload();
