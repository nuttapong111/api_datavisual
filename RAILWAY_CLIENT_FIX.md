# Railway Client Directory Fix

## ปัญหาที่พบ
Railway deployment ล้มเหลวเนื่องจากไม่สามารถหาไดเรกทอรี `client` ได้:
```
/bin/sh: cd: line 0: can't cd to client: No such file or directory
```

## สาเหตุ
ไดเรกทอรี `client` ถูก track เป็น Git submodule แทนที่จะเป็นไฟล์ปกติ ทำให้ Railway ไม่สามารถเข้าถึงได้

## การแก้ไข

### 1. ลบ client directory จาก Git index
```bash
git rm --cached client
```

### 2. เพิ่มไฟล์ client ทั้งหมดเป็นไฟล์ปกติ
```bash
git add client/
```

### 3. ลบไฟล์ macOS resource forks
```bash
find client/ -name "._*" -delete
```

### 4. อัปเดต .gitignore
เพิ่มกฎสำหรับ macOS resource forks:
```
# macOS resource forks
._*
```

### 5. Commit และ Push
```bash
git add .
git commit -m "Fix client directory structure for Railway deployment"
git push origin main
```

## ผลลัพธ์
- ไฟล์ client ทั้งหมดถูก track เป็นไฟล์ปกติ
- ไม่มีไฟล์ resource forks ที่ไม่จำเป็น
- Railway สามารถเข้าถึงไดเรกทอรี client ได้

## ไฟล์ที่แก้ไข
- `.gitignore` - เพิ่มกฎสำหรับ macOS resource forks
- Git repository structure - เปลี่ยนจาก submodule เป็นไฟล์ปกติ

## การทดสอบ
หลังจาก push ไปยัง GitHub แล้ว Railway จะทำการ deploy ใหม่โดยอัตโนมัติ และควรจะสามารถเข้าถึงไดเรกทอรี client ได้แล้ว
