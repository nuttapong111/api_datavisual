import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';
import './TotalCount.css';

interface TotalCountData {
  totalCountries: number;
  totalDataPoints: number;
  averageDataPerCountry: string;
}

const TotalCount: React.FC = () => {
  const [data, setData] = useState<TotalCountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTotalCount();
  }, []);

  const fetchTotalCount = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await DataService.getTotalCount();
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถดึงข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="total-count">
        <div className="card-header">
          <h3>จำนวนข้อมูลทั้งหมด</h3>
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
      <div className="total-count">
        <div className="card-header">
          <h3>จำนวนข้อมูลทั้งหมด</h3>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchTotalCount} className="retry-button">
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="total-count">
        <div className="card-header">
          <h3>จำนวนข้อมูลทั้งหมด</h3>
        </div>
        <div className="no-data">
          <p>ไม่มีข้อมูล</p>
        </div>
      </div>
    );
  }

  return (
    <div className="looker-kpi-stats">
      <div className="looker-kpi-item">
        <div className="looker-kpi-value">{data.totalCountries.toLocaleString()}</div>
        <div className="looker-kpi-label">ประเทศทั้งหมด</div>
        <div className="looker-kpi-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#1a73e8"/>
          </svg>
        </div>
      </div>

      <div className="looker-kpi-item">
        <div className="looker-kpi-value">{data.totalDataPoints.toLocaleString()}</div>
        <div className="looker-kpi-label">ข้อมูลทั้งหมด</div>
        <div className="looker-kpi-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 3v18h18" stroke="#34a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="#34a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="looker-kpi-item">
        <div className="looker-kpi-value">{data.averageDataPerCountry}</div>
        <div className="looker-kpi-label">ข้อมูลเฉลี่ยต่อประเทศ</div>
        <div className="looker-kpi-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#fbbc04" strokeWidth="2"/>
            <path d="M12 6v6l4 2" stroke="#fbbc04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TotalCount;
