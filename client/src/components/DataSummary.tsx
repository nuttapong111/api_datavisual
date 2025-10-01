import React, { useState, useEffect } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DataService } from '../services/DataService';
import './DataSummary.css';

interface YearlyStats {
  min: number;
  max: number;
  average: number;
  count: number;
}

interface SummaryData {
  [year: string]: YearlyStats;
}

// Custom Candlestick Component
const CandlestickBar = (props: any) => {
  const { payload, x, y, width, height } = props;
  
  if (!payload) return null;
  
  const { high, low, open, close, isPositive } = payload;
  
  // คำนวณตำแหน่งในกราฟ
  const chartHeight = height;
  const valueRange = high - low;
  const lowY = y + chartHeight - ((low - low) / valueRange) * chartHeight;
  const highY = y + chartHeight - ((high - low) / valueRange) * chartHeight;
  const openY = y + chartHeight - ((open - low) / valueRange) * chartHeight;
  const closeY = y + chartHeight - ((close - low) / valueRange) * chartHeight;
  
  const bodyTop = Math.min(openY, closeY);
  const bodyBottom = Math.max(openY, closeY);
  const bodyHeight = Math.abs(bodyBottom - bodyTop);
  
  return (
    <g>
      {/* Wick (เส้นแนวตั้ง) - จาก low ถึง high */}
      <line
        x1={x + width / 2}
        y1={highY}
        x2={x + width / 2}
        y2={lowY}
        stroke={isPositive ? "#10b981" : "#ef4444"}
        strokeWidth={1}
      />
      
      {/* Body (ตัวแท่ง) - จาก open ถึง close */}
      <rect
        x={x + width * 0.2}
        y={bodyTop}
        width={width * 0.6}
        height={Math.max(bodyHeight, 2)}
        fill={isPositive ? "#10b981" : "#ef4444"}
        stroke={isPositive ? "#059669" : "#dc2626"}
        strokeWidth={1}
      />
    </g>
  );
};

const DataSummary: React.FC = () => {
  const [data, setData] = useState<SummaryData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await DataService.getSummary();
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถดึงข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  // แปลงข้อมูลสำหรับกราฟแท่งเทียน
  const chartData = Object.entries(data).map(([year, stats]) => ({
    year: year,
    min: stats.min,
    max: stats.max,
    average: parseFloat(stats.average.toFixed(2)),
    count: stats.count,
    // สำหรับ Candlestick Chart - ใช้ค่าเฉลี่ยเป็น open/close
    open: stats.average,
    close: stats.average,
    high: stats.max,
    low: stats.min,
    // สำหรับ Bar Chart
    range: stats.max - stats.min,
    midPoint: (stats.max + stats.min) / 2,
    // สีของแท่งเทียน (เขียวถ้า average > min, แดงถ้า average < min)
    isPositive: stats.average > (stats.min + stats.max) / 2
  })).sort((a, b) => parseInt(a.year) - parseInt(b.year));

  if (loading) {
    return (
      <div className="data-summary">
        <div className="card-header">
          <h3>ข้อมูลสรุปแต่ละปี</h3>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-summary">
        <div className="card-header">
          <h3>ข้อมูลสรุปแต่ละปี</h3>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchSummaryData} className="retry-button">
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="data-summary">
      <div className="card-header">
        <h3>ข้อมูลสรุปแต่ละปี</h3>
      </div>

      {/* สถิติรวม */}
      <div className="summary-stats">
        <div className="stat-item">
          <div className="stat-value">{chartData.length}</div>
          <div className="stat-label">ปีที่วิเคราะห์</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {Math.max(...chartData.map(d => d.count))}
          </div>
          <div className="stat-label">จำนวนประเทศ</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {chartData.reduce((sum, d) => sum + d.count, 0)}
          </div>
          <div className="stat-label">ข้อมูลทั้งหมด</div>
        </div>
      </div>

      {/* กราฟแท่งเทียน */}
      <div className="chart-container">
        <h4>กราฟแท่งเทียนข้อมูลแต่ละปี</h4>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              stroke="#666"
              fontSize={12}
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => value.toFixed(1)}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip 
              formatter={(value: any, name: string) => {
                const labels: { [key: string]: string } = {
                  'min': 'ค่าต่ำสุด',
                  'max': 'ค่าสูงสุด', 
                  'average': 'ค่าเฉลี่ย',
                  'open': 'เปิด',
                  'close': 'ปิด',
                  'high': 'สูงสุด',
                  'low': 'ต่ำสุด'
                };
                return [
                  typeof value === 'number' ? value.toFixed(2) : value,
                  labels[name] || name
                ];
              }}
              labelFormatter={(label) => `ปี ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}
            />
            
            {/* แท่งเทียนแบบดั้งเดิม */}
            <Bar 
              dataKey="high" 
              shape={<CandlestickBar />}
              name="candlestick"
            />
            
            {/* เส้นอ้างอิงค่าเฉลี่ย */}
            <ReferenceLine 
              y={chartData.reduce((sum, d) => sum + d.average, 0) / chartData.length} 
              stroke="#6b7280" 
              strokeDasharray="5 5"
              label={{ value: "ค่าเฉลี่ยรวม", position: "top" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* ตารางข้อมูลรายละเอียด */}
      <div className="summary-table-container">
        <br></br>
        <br></br>
        <br></br>
        <h4>ข้อมูลรายละเอียดแต่ละปี</h4>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ปี</th>
                <th>ค่าต่ำสุด</th>
                <th>ค่าสูงสุด</th>
                <th>ค่าเฉลี่ย</th>
                <th>จำนวนประเทศ</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item) => (
                <tr key={item.year}>
                  <td className="year-cell">{item.year}</td>
                  <td className="number-cell">{item.min.toFixed(2)}</td>
                  <td className="number-cell">{item.max.toFixed(2)}</td>
                  <td className="number-cell average-cell">{item.average.toFixed(2)}</td>
                  <td className="number-cell">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataSummary;
