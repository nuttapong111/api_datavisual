import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataSummary from '../components/DataSummary';
import TopCountries from '../components/TopCountries';
import BottomCountries from '../components/BottomCountries';
import TotalCount from '../components/TotalCount';
import DataTable from '../components/DataTable';
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
    <div className="looker-dashboard">
      {/* Looker Studio Header */}
      <header className="looker-header">
        <div className="looker-header-content">
          <div className="looker-title-section">
            <div className="looker-breadcrumb">
              <button 
                onClick={() => navigate('/')} 
                className="looker-breadcrumb-link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                หน้าแรก
              </button>
              <span className="looker-breadcrumb-separator">›</span>
              <span className="looker-breadcrumb-current">Dashboard</span>
            </div>
            <h1 className="looker-title">ข้อมูลคุณภาพอากาศ</h1>
            <p className="looker-subtitle">การวิเคราะห์ข้อมูลคุณภาพอากาศของประเทศต่างๆ</p>
          </div>
          <div className="looker-actions">
            <button 
              onClick={() => navigate('/import')} 
              className="looker-btn looker-btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              อัปโหลดข้อมูล
            </button>
          </div>
        </div>
      </header>

      {/* Looker Studio Main Content */}
      <main className="looker-main">
        <div className="looker-container">
          {/* KPI Cards Row */}
          <div className="looker-kpi-row">
            <div className="looker-kpi-card">
              <TotalCount />
            </div>
          </div>

          {/* Charts Grid */}
          <div className="looker-charts-grid">
            {/* Main Chart - Full Width */}
            <div className="looker-chart-card looker-chart-large">
              <div className="looker-chart-header">
                <h3>ข้อมูลสรุปแต่ละปี</h3>
                <div className="looker-chart-actions">
                  <button className="looker-icon-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>
              <DataSummary />
            </div>

            {/* Top Countries Chart */}
            <div className="looker-chart-card">
              <div className="looker-chart-header">
                <h3>ประเทศที่มีค่าสูงสุด</h3>
                <div className="looker-chart-actions">
                  <button className="looker-icon-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="looker-chart-content">
                <TopCountries />
              </div>
            </div>

            {/* Bottom Countries Chart */}
            <div className="looker-chart-card">
              <div className="looker-chart-header">
                <h3>ประเทศที่มีค่าต่ำสุด</h3>
                <div className="looker-chart-actions">
                  <button className="looker-icon-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="looker-chart-content">
                <BottomCountries />
              </div>
            </div>
          </div>

          {/* Data Table Section */}
          <div className="looker-table-section">
            <div className="looker-table-card">
              <div className="looker-table-header">
                <h3>ข้อมูลรายละเอียด</h3>
                <div className="looker-table-actions">
                  <button className="looker-btn looker-btn-outline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    ส่งออก
                  </button>
                </div>
              </div>
              <DataTable />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
