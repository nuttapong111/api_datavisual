# Looker Studio Style Dashboard

## ภาพรวม
Dashboard นี้ได้รับการออกแบบใหม่ให้มีลักษณะเหมือน Google Looker Studio โดยใช้:

- **Google Material Design** - สี, ฟอนต์, และ spacing
- **Modern Grid Layout** - การจัดวางแบบ responsive grid
- **Interactive Charts** - กราฟที่สามารถโต้ตอบได้
- **Clean Typography** - ฟอนต์ Google Sans
- **Consistent Color Scheme** - สีแบบ Google

## คุณสมบัติหลัก

### 1. Header แบบ Looker Studio
- **Breadcrumb Navigation** - นำทางแบบ hierarchical
- **Title & Subtitle** - ชื่อและคำอธิบายชัดเจน
- **Action Buttons** - ปุ่มสำหรับการดำเนินการ

### 2. KPI Cards
- **3 Key Metrics** - ประเทศทั้งหมด, ข้อมูลทั้งหมด, ข้อมูลเฉลี่ยต่อประเทศ
- **Icons** - ไอคอนสีสันสวยงาม
- **Large Numbers** - ตัวเลขขนาดใหญ่ชัดเจน

### 3. Charts Grid
- **Main Chart** - กราฟหลักแบบ full width
- **Side Charts** - กราฟรองแบบ 2 คอลัมน์
- **Interactive Controls** - เลือกปี, filter ข้อมูล
- **Responsive Design** - ปรับขนาดตามหน้าจอ

### 4. Data Tables
- **Clean Tables** - ตารางข้อมูลเรียบร้อย
- **Hover Effects** - เอฟเฟกต์เมื่อ hover
- **Ranking Badges** - แสดงอันดับแบบสวยงาม

## สีที่ใช้

### Primary Colors
- **Blue**: `#1a73e8` - ปุ่มหลัก, ลิงก์
- **Green**: `#34a853` - ข้อมูลบวก
- **Red**: `#ea4335` - ข้อมูลลบ
- **Yellow**: `#fbbc04` - คำเตือน

### Neutral Colors
- **Dark Gray**: `#3c4043` - ข้อความหลัก
- **Medium Gray**: `#5f6368` - ข้อความรอง
- **Light Gray**: `#e8eaed` - เส้นขอบ
- **Background**: `#f8f9fa` - พื้นหลัง

## Typography

### Font Family
```css
font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Sizes
- **Title**: 24px
- **Subtitle**: 14px
- **KPI Values**: 36px
- **Labels**: 14px
- **Table Text**: 12px

## Layout Structure

### Desktop (1200px+)
```
┌─────────────────────────────────────────┐
│ Header (Breadcrumb + Title + Actions)   │
├─────────────────────────────────────────┤
│ KPI Cards (3 columns)                   │
├─────────────────────────────────────────┤
│ Main Chart (Full Width)                 │
├─────────────────┬───────────────────────┤
│ Top Countries   │ Bottom Countries      │
│ (Chart + Table) │ (Chart + Table)       │
├─────────────────┴───────────────────────┤
│ Data Table (Full Width)                 │
└─────────────────────────────────────────┘
```

### Mobile (768px-)
```
┌─────────────────┐
│ Header (Stack)  │
├─────────────────┤
│ KPI Cards (1)   │
├─────────────────┤
│ Main Chart      │
├─────────────────┤
│ Top Countries   │
├─────────────────┤
│ Bottom Countries│
├─────────────────┤
│ Data Table      │
└─────────────────┘
```

## Components

### 1. LookerHeader
- Breadcrumb navigation
- Title และ subtitle
- Action buttons

### 2. LookerKPICards
- 3 key metrics
- Icons และ colors
- Responsive layout

### 3. LookerChartCards
- Chart headers
- Interactive controls
- Chart content

### 4. LookerDataTables
- Clean table design
- Hover effects
- Responsive scrolling

## CSS Classes

### Main Layout
- `.looker-dashboard` - Container หลัก
- `.looker-header` - Header section
- `.looker-main` - Main content
- `.looker-container` - Content wrapper

### KPI Cards
- `.looker-kpi-stats` - KPI container
- `.looker-kpi-item` - Individual KPI
- `.looker-kpi-value` - KPI value
- `.looker-kpi-label` - KPI label

### Charts
- `.looker-chart-card` - Chart container
- `.looker-chart-header` - Chart header
- `.looker-chart-content` - Chart content
- `.looker-chart-container` - Chart wrapper

### Tables
- `.looker-data-table` - Table styling
- `.looker-table-wrapper` - Table container
- `.looker-rank-badge` - Ranking badges

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { ... }

/* Tablet */
@media (min-width: 768px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }
```

## การใช้งาน

### 1. เปิด Dashboard
```
http://localhost:3000/dashboard
```

### 2. ดู KPI Cards
- จำนวนประเทศทั้งหมด
- ข้อมูลทั้งหมด
- ข้อมูลเฉลี่ยต่อประเทศ

### 3. ใช้ Interactive Charts
- เลือกปีใน dropdown
- Hover ที่กราฟเพื่อดูรายละเอียด
- ดูตารางข้อมูลด้านล่าง

### 4. ดู Data Tables
- ข้อมูลรายละเอียดแต่ละปี
- ประเทศที่มีค่าสูงสุด/ต่ำสุด
- อันดับและค่า

## การปรับแต่ง

### เปลี่ยนสี
แก้ไขใน CSS variables:
```css
:root {
  --looker-blue: #1a73e8;
  --looker-green: #34a853;
  --looker-red: #ea4335;
  --looker-yellow: #fbbc04;
}
```

### เปลี่ยน Layout
แก้ไขใน `.looker-charts-grid`:
```css
.looker-charts-grid {
  grid-template-columns: 1fr 1fr; /* 2 columns */
  /* หรือ */
  grid-template-columns: 1fr; /* 1 column */
}
```

### เพิ่ม Charts
เพิ่มใน `DashboardPage.tsx`:
```jsx
<div className="looker-chart-card">
  <div className="looker-chart-header">
    <h3>Chart Title</h3>
  </div>
  <div className="looker-chart-content">
    <YourChartComponent />
  </div>
</div>
```

## ข้อดีของ Looker Studio Style

1. **Familiar Interface** - ผู้ใช้คุ้นเคยกับ Google products
2. **Clean Design** - ดูเรียบร้อยและเป็นระเบียบ
3. **Responsive** - ใช้งานได้ทุกขนาดหน้าจอ
4. **Accessible** - เข้าถึงได้ง่าย
5. **Consistent** - สไตล์สม่ำเสมอทั้งระบบ
6. **Professional** - ดูเป็นมืออาชีพ

## การพัฒนาต่อ

### Features ที่สามารถเพิ่มได้
1. **Filters** - ตัวกรองข้อมูล
2. **Date Range Picker** - เลือกช่วงวันที่
3. **Export Functions** - ส่งออกข้อมูล
4. **Real-time Updates** - อัปเดตแบบ real-time
5. **Drill-down** - ดูรายละเอียดลึก
6. **Custom Themes** - ธีมที่ปรับแต่งได้

### Performance Optimizations
1. **Lazy Loading** - โหลดข้อมูลตามต้องการ
2. **Virtual Scrolling** - สำหรับตารางใหญ่
3. **Chart Caching** - เก็บ cache กราฟ
4. **Data Pagination** - แบ่งหน้าข้อมูล

---

**สรุป**: Dashboard นี้ได้รับการออกแบบใหม่ให้มีลักษณะเหมือน Google Looker Studio โดยใช้ Material Design principles และ responsive layout ที่ใช้งานได้ดีในทุกขนาดหน้าจอ
