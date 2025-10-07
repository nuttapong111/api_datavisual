import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataService } from '../services/DataService';
import './BottomCountries.css';

interface CountryData {
  country: string;
  value: number;
  year: string;
}

const BottomCountries: React.FC = () => {
  const [data, setData] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState('2012');

  const years = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012'];

  const fetchBottomCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await DataService.getBottomCountries(selectedYear, 20);
      setData(response.data || []);
    } catch (err: any) {
      console.error('BottomCountries Error:', err);
      setError(err.response?.data?.message || 'ไม่สามารถดึงข้อมูลได้');
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchBottomCountries();
  }, [fetchBottomCountries]);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  if (loading) {
    return (
      <div className="bottom-countries">
        <div className="card-header">
          <h3>20 ประเทศที่มีค่าต่ำสุด</h3>
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
      <div className="bottom-countries">
        <div className="card-header">
          <h3>20 ประเทศที่มีค่าต่ำสุด</h3>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchBottomCountries} className="retry-button">
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="looker-chart-content">
      {/* เลือกปี */}
      <div className="looker-year-selector">
        <label htmlFor="year-select" className="looker-label">เลือกปี:</label>
        <select 
          id="year-select"
          value={selectedYear} 
          onChange={handleYearChange}
          className="looker-select"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* กราฟแท่ง */}
      <div className="looker-chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={data.slice(0, 10)} 
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
            <XAxis 
              dataKey="country"
              stroke="#5f6368"
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              stroke="#5f6368"
              fontSize={12}
              tickFormatter={(value) => value.toFixed(1)}
              domain={[0, 2.5]}
            />
            <Tooltip 
              formatter={(value: any) => [value.toFixed(2), 'ค่า']}
              labelFormatter={(label) => `ประเทศ: ${label}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e8eaed',
                borderRadius: '8px',
                boxShadow: '0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)',
                fontSize: '12px',
                fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
              }}
            />
            <Bar 
              dataKey="value" 
              fill="#ea4335"
              radius={[4, 4, 0, 0]}
              stroke="#d33b2c"
              strokeWidth={1}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ตารางข้อมูล */}
      <div className="looker-table-container">
        <h4 className="looker-table-title">รายชื่อ 20 ประเทศ</h4>
        <div className="looker-table-wrapper">
          <table className="looker-data-table">
            <thead>
              <tr>
                <th>อันดับ</th>
                <th>ประเทศ</th>
                <th>ค่า</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.country}>
                  <td className="looker-rank-cell">
                    <span className={`looker-rank-badge ${index < 3 ? 'looker-bottom-three' : ''}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="looker-country-cell">{item.country}</td>
                  <td className="looker-number-cell">{item.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BottomCountries;
