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
    <div className="total-count">
      <div className="card-header">
        <h3>จำนวนข้อมูลทั้งหมด</h3>
      </div>

      <div className="count-stats">
        <div className="count-item primary">
          <div className="count-content">
            <div className="count-value">{data.totalCountries.toLocaleString()}</div>
            <div className="count-label">ประเทศทั้งหมด</div>
          </div>
        </div>

        <div className="count-item secondary">
          <div className="count-content">
            <div className="count-value">{data.totalDataPoints.toLocaleString()}</div>
            <div className="count-label">ข้อมูลทั้งหมด</div>
          </div>
        </div>

        <div className="count-item tertiary">
          <div className="count-content">
            <div className="count-value">{data.averageDataPerCountry}</div>
            <div className="count-label">ข้อมูลเฉลี่ยต่อประเทศ</div>
          </div>
        </div>
      </div>



    </div>
  );
};

export default TotalCount;
