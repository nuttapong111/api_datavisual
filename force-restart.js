// สคริปต์สำหรับบังคับให้ Railway restart และใช้ environment variables ใหม่
const fs = require('fs');

// สร้างไฟล์ที่เปลี่ยนแปลงเพื่อบังคับให้ Railway redeploy
const timestamp = new Date().toISOString();
const restartFile = `// Force restart at ${timestamp}
// This file forces Railway to redeploy with new environment variables
console.log('Force restart triggered at:', '${timestamp}');
`;

fs.writeFileSync('FORCE_RESTART.js', restartFile);

// อัปเดต package.json เพื่อบังคับให้ restart
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
packageJson.scripts['force-restart'] = 'node FORCE_RESTART.js';
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

console.log('✅ สร้างไฟล์ force restart เรียบร้อย');
console.log('📝 อัปเดต package.json เรียบร้อย');
console.log('🚀 Railway จะ redeploy โดยอัตโนมัติ');
