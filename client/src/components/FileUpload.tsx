import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DataService } from '../services/DataService';
import './FileUpload.css';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  message: string | null;
  error: string | null;
  success: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    message: null,
    error: null,
    success: false
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    const isValidType = allowedTypes.includes(file.type) || 
                       file.name.endsWith('.xlsx') || 
                       file.name.endsWith('.xls') || 
                       file.name.endsWith('.csv');

    if (!isValidType) {
      setUploadState(prev => ({
        ...prev,
        error: 'รองรับเฉพาะไฟล์ Excel (.xlsx, .xls) และ CSV เท่านั้น',
        success: false
      }));
      return;
    }

    // ตรวจสอบขนาดไฟล์ (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadState(prev => ({
        ...prev,
        error: 'ขนาดไฟล์ต้องไม่เกิน 10MB',
        success: false
      }));
      return;
    }

    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0,
      message: 'กำลังอัปโหลดไฟล์...',
      error: null,
      success: false
    }));

    try {
      const result = await DataService.uploadExcel(file, (progress) => {
        setUploadState(prev => ({
          ...prev,
          progress,
          message: `กำลังอัปโหลด... ${progress}%`
        }));
      });

      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        message: result.message,
        success: true,
        error: null
      }));

      // เรียก callback เมื่ออัปโหลดสำเร็จ
      setTimeout(() => {
        onUploadSuccess();
        setUploadState(prev => ({
          ...prev,
          message: null,
          success: false,
          progress: 0
        }));
      }, 2000);

    } catch (error: any) {
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
        message: null,
        error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปโหลด',
        success: false
      }));
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false,
    disabled: uploadState.isUploading
  });

  const clearMessage = () => {
    setUploadState(prev => ({
      ...prev,
      message: null,
      error: null,
      success: false
    }));
  };

  return (
    <div className="file-upload-container">
      <h2>อัปโหลดไฟล์ Excel</h2>
      
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${uploadState.isUploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />
        
        {uploadState.isUploading ? (
          <div className="upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadState.progress}%` }}
              ></div>
            </div>
            <p>{uploadState.message}</p>
          </div>
        ) : (
          <div className="dropzone-content">
            <p className="dropzone-text">
              {isDragActive 
                ? 'วางไฟล์ที่นี่' 
                : 'ลากไฟล์ Excel มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์'
              }
            </p>
            <p className="dropzone-hint">
              รองรับไฟล์ .xlsx, .xls, .csv (ขนาดไม่เกิน 10MB)
            </p>
          </div>
        )}
      </div>

      {/* แสดงข้อความสถานะ */}
      {uploadState.message && (
        <div className={`status-message ${uploadState.success ? 'success' : 'info'}`}>
          <span>{uploadState.message}</span>
          <button onClick={clearMessage} className="close-button">×</button>
        </div>
      )}

      {uploadState.error && (
        <div className="status-message error">
          <span>{uploadState.error}</span>
          <button onClick={clearMessage} className="close-button">×</button>
        </div>
      )}

      {/* ข้อมูลเพิ่มเติม */}
      <div className="upload-info">
        <h4>ข้อมูลที่ต้องการในไฟล์ Excel:</h4>
        <ul>
          <li>คอลัมน์แรกต้องเป็นชื่อประเทศ (Country)</li>
          <li>คอลัมน์ถัดไปเป็นข้อมูลปี 2000-2012</li>
          <li>สามารถมีค่า N/A หรือเซลล์ว่างได้ (ระบบจะแทนที่ด้วยค่าเฉลี่ย)</li>
          <li>แถวที่ไม่มีข้อมูลเลยจะถูกลบออก</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
