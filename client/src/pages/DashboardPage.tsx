import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataSummary from '../components/DataSummary';
import TopCountries from '../components/TopCountries';
import BottomCountries from '../components/BottomCountries';
import TotalCount from '../components/TotalCount';
import { DataService } from '../services/DataService';
import './DashboardPage.css';

interface DashboardPageState {
  hasData: boolean;
  loading: boolean;
  error: string | null;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<DashboardPageState>({
    hasData: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    checkDataStatus();
  }, []);

  const checkDataStatus = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const status = await DataService.checkStatus();
      setState(prev => ({ 
        ...prev, 
        hasData: status.data.hasData, 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' 
      }));
    }
  };

  if (state.loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="dashboard-page">
        <div className="error-container">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2>เกิดข้อผิดพลาด</h2>
          <p>{state.error}</p>
          <button onClick={checkDataStatus} className="btn btn-primary">
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  if (!state.hasData) {
    return (
      <div className="dashboard-page">
        <div className="no-data-container">
          <div className="no-data-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>ไม่มีข้อมูลในระบบ</h2>
          <p>กรุณาอัปโหลดไฟล์ข้อมูลก่อนเพื่อดู Dashboard</p>
          <button 
            onClick={() => navigate('/import')} 
            className="btn btn-primary btn-lg"
          >
            ไปอัปโหลดข้อมูล
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="breadcrumb">
              <button 
                onClick={() => navigate('/')} 
                className="breadcrumb-link"
              >
                หน้าแรก
              </button>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Dashboard</span>
            </div>
            <h1>Dashboard ข้อมูลคุณภาพอากาศ</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-grid">
            {/* Stats Row */}
            <div className="stats-section">
              <div className="stats-card">
                <TotalCount />
              </div>
            </div>
            
            {/* Summary Chart */}
            <div className="summary-section">
              <div className="section-header">
                <h2>ข้อมูลสรุปแต่ละปี</h2>
              </div>
              <div className="chart-card">
                <DataSummary />
              </div>
            </div>
            
            {/* Countries Section */}
            <div className="countries-section">
              <div className="countries-grid">
                <div className="country-card">
                  <div className="card-header">
                    <h3>ประเทศที่มีค่าสูงสุด</h3>
                  </div>
                  <div className="card-content">
                    <TopCountries />
                  </div>
                </div>
                <div className="country-card">
                  <div className="card-header">
                    <h3>ประเทศที่มีค่าต่ำสุด</h3>
                  </div>
                  <div className="card-content">
                    <BottomCountries />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* API Section */}
      <section className="api-section">
        <div className="container">
          <div className="section-header">
            <h2>API Endpoints</h2>
          </div>
          <div className="api-grid">
            <div className="api-card">
              <div className="api-method">GET</div>
              <div className="api-details">
                <code>/api/data/summary</code>
                <span>ข้อมูลสรุปแต่ละปี</span>
              </div>
            </div>
            <div className="api-card">
              <div className="api-method">GET</div>
              <div className="api-details">
                <code>/api/data/top-countries</code>
                <span>ประเทศที่มีค่ามากสุด</span>
              </div>
            </div>
            <div className="api-card">
              <div className="api-method">GET</div>
              <div className="api-details">
                <code>/api/data/bottom-countries</code>
                <span>ประเทศที่มีค่าต่ำสุด</span>
              </div>
            </div>
            <div className="api-card">
              <div className="api-method">GET</div>
              <div className="api-details">
                <code>/api/data/total-count</code>
                <span>จำนวนข้อมูลทั้งหมด</span>
              </div>
            </div>
            <div className="api-card">
              <div className="api-method">GET</div>
              <div className="api-details">
                <code>/api/data/all</code>
                <span>ข้อมูลทั้งหมด</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="container">
          <div className="footer-content">
            <div className="navigation-links">
              <button 
                onClick={() => navigate('/import')} 
                className="btn btn-outline"
              >
                อัปโหลดข้อมูลใหม่
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="btn btn-outline"
              >
                หน้าแรก
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
