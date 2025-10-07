import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class DataService {
  private static api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // ตรวจสอบสถานะข้อมูล
  static async checkStatus() {
    const response = await this.api.get('/upload/status');
    return response.data;
  }

  // อัปโหลดไฟล์ Excel
  static async uploadExcel(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.api.post('/upload/excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }

  // ดึงข้อมูลสรุปแต่ละปี
  static async getSummary() {
    const response = await this.api.get('/data/summary');
    return response.data;
  }

  // ดึงข้อมูลประเทศที่มีค่ามากสุด
  static async getTopCountries(year: string = '2012', limit: number = 20) {
    const response = await this.api.get('/data/top-countries', {
      params: { year, limit }
    });
    return response.data;
  }

  // ดึงข้อมูลประเทศที่มีค่าต่ำสุด
  static async getBottomCountries(year: string = '2012', limit: number = 20) {
    const response = await this.api.get('/data/bottom-countries', {
      params: { year, limit }
    });
    return response.data;
  }

  // ดึงจำนวนข้อมูลทั้งหมด
  static async getTotalCount() {
    const response = await this.api.get('/data/total-count');
    return response.data;
  }

  // ดึงข้อมูลทั้งหมด
  static async getAllData(page: number = 1, limit: number = 1000) {
    const response = await this.api.get('/data/all', {
      params: { page, limit }
    });
    return response.data;
  }

  // ดึงรายชื่อประเทศทั้งหมด
  static async getCountries() {
    const response = await this.api.get('/data/countries');
    return response.data;
  }

  // ล้างข้อมูลทั้งหมด
  static async clearData() {
    const response = await this.api.delete('/upload/clear');
    return response.data;
  }
}

export { DataService };
