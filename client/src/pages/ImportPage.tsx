import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { DataService } from '../services/DataService';
import './ImportPage.css';

interface ImportPageState {
  hasData: boolean;
  loading: boolean;
  error: string | null;
}

const ImportPage: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<ImportPageState>({
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

  const handleUploadSuccess = () => {
    checkDataStatus();
    // หลังจากอัปโหลดสำเร็จ ให้ไปที่หน้า dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (state.loading) {
    return (
      <div className="import-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="import-page">
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

  return (
    <div className="import-page">
      {/* Header */}
      <header className="import-header">
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
              <span className="breadcrumb-current">อัปโหลดข้อมูล</span>
            </div>
            <h1>อัปโหลดข้อมูล</h1>
            <p>อัปโหลดไฟล์ Excel เพื่อวิเคราะห์ข้อมูลประเทศสำหรับ Looker Studio</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="import-main">
        <div className="container">
          <div className="import-content">
            <div className="upload-section">
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </div>
            
            {state.hasData && (
              <div className="data-status">
                <div className="status-card success">
                  <div className="status-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="status-content">
                    <h3>มีข้อมูลในระบบแล้ว</h3>
                    <p>คุณสามารถไปดูข้อมูลสรุปได้ที่หน้า Dashboard</p>
                    <button 
                      onClick={() => navigate('/dashboard')} 
                      className="btn btn-primary"
                    >
                      ไปที่ Dashboard
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="instructions-section">
              <h3>คำแนะนำการใช้งาน</h3>
              <div className="instructions-grid">
                <div className="instruction-item">
                  <div className="instruction-number">1</div>
                  <div className="instruction-content">
                    <h4>เตรียมไฟล์ข้อมูล</h4>
                    <p>ไฟล์ต้องเป็น Excel (.xlsx, .xls) หรือ CSV ขนาดไม่เกิน 10MB</p>
                  </div>
                </div>
                <div className="instruction-item">
                  <div className="instruction-number">2</div>
                  <div className="instruction-content">
                    <h4>รูปแบบข้อมูล</h4>
                    <p>คอลัมน์แรกเป็นชื่อประเทศ คอลัมน์ถัดไปเป็นข้อมูลปี 2000-2012</p>
                  </div>
                </div>
                <div className="instruction-item">
                  <div className="instruction-number">3</div>
                  <div className="instruction-content">
                    <h4>อัปโหลดและวิเคราะห์</h4>
                    <p>ลากไฟล์มาวางหรือคลิกเพื่อเลือกไฟล์ ระบบจะทำความสะอาดข้อมูลอัตโนมัติ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="import-footer">
        <div className="container">
          <div className="footer-content">
            <div className="navigation-links">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="btn btn-outline"
              >
                ดู Dashboard
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

export default ImportPage;
