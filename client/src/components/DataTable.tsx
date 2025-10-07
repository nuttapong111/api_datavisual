import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';
import './DataTable.css';

interface CountryData {
  id: number;
  country: string;
  year_2000: number;
  year_2001: number;
  year_2002: number;
  year_2003: number;
  year_2004: number;
  year_2005: number;
  year_2006: number;
  year_2007: number;
  year_2008: number;
  year_2009: number;
  year_2010: number;
  year_2011: number;
  year_2012: number;
}

const DataTable: React.FC = () => {
  const [data, setData] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await DataService.getAllData(currentPage, itemsPerPage);
      setData(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถดึงข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item =>
    item.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const years = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012'];

  if (loading) {
    return (
      <div className="looker-table-content">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="looker-table-content">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchData} className="retry-button">
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="looker-table-content">
      {/* Search and Controls */}
      <div className="looker-table-controls">
        <div className="looker-search-box">
          <input
            type="text"
            placeholder="ค้นหาประเทศ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="looker-search-input"
          />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="looker-search-icon">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <div className="looker-table-info">
          แสดง {filteredData.length} รายการ
        </div>
      </div>

      {/* Data Table */}
      <div className="looker-table-wrapper">
        <table className="looker-data-table">
          <thead>
            <tr>
              <th>ประเทศ</th>
              {years.map(year => (
                <th key={year}>{year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td className="looker-country-cell">{item.country}</td>
                {years.map(year => {
                  const value = item[`year_${year}` as keyof CountryData];
                  return (
                    <td key={year} className="looker-number-cell">
                      {typeof value === 'number' ? value.toFixed(2) : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="looker-pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="looker-pagination-btn"
        >
          ก่อนหน้า
        </button>
        <span className="looker-pagination-info">
          หน้า {currentPage}
        </span>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={filteredData.length < itemsPerPage}
          className="looker-pagination-btn"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default DataTable;
