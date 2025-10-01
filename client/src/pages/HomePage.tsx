import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              ระบบวิเคราะห์ข้อมูลประเทศ
            </h1>
            <p className="hero-subtitle">
              อัปโหลดไฟล์ Excel และดูข้อมูลสรุปสำหรับ Looker Studio Dashboard
              ด้วยระบบที่ทันสมัย เรียบง่าย และใช้งานง่าย
            </p>
            <div className="hero-actions">
              <button 
                onClick={() => navigate('/import')} 
                className="btn btn-primary btn-lg"
              >
                เริ่มอัปโหลดข้อมูล
              </button>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="btn btn-outline btn-lg"
              >
                ดู Dashboard
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="hero-card-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="hero-card-content">
                <div className="hero-chart-placeholder">
                  <div className="chart-bar"></div>
                  <div className="chart-bar"></div>
                  <div className="chart-bar"></div>
                  <div className="chart-bar"></div>
                  <div className="chart-bar"></div>
                </div>
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">195</span>
                    <span className="stat-label">ประเทศ</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">13</span>
                    <span className="stat-label">ปี</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">2,535</span>
                    <span className="stat-label">ข้อมูล</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>ฟีเจอร์หลัก</h2>
            <p>ระบบที่ออกแบบมาเพื่อความสะดวกและประสิทธิภาพสูงสุด</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>อัปโหลดข้อมูล</h3>
              <p>รองรับไฟล์ Excel (.xlsx, .xls) และ CSV พร้อมการตรวจสอบข้อมูลอัตโนมัติ</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Dashboard แบบ Real-time</h3>
              <p>ดูข้อมูลสรุป กราฟ และสถิติต่างๆ แบบเรียลไทม์</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>API สำหรับ Looker Studio</h3>
              <p>มี API endpoints พร้อมใช้งานกับ Looker Studio</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>การทำความสะอาดข้อมูล</h3>
              <p>ระบบจะทำความสะอาดข้อมูลอัตโนมัติและเติมค่าที่หายไป</p>
            </div>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="api-section">
        <div className="container">
          <div className="section-header">
            <h2>API Endpoints</h2>
            <p>เชื่อมต่อกับ Looker Studio ได้ทันที</p>
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

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>พร้อมเริ่มต้นแล้วหรือยัง?</h2>
            <p>อัปโหลดข้อมูลของคุณและเริ่มวิเคราะห์ได้ทันที</p>
            <button 
              onClick={() => navigate('/import')} 
              className="btn btn-primary btn-lg"
            >
              เริ่มอัปโหลดข้อมูล
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
