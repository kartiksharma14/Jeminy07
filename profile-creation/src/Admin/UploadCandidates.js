// src/components/UploadCandidates.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadCandidates.css';
import RecruiterHomeHeader from '../RecruiterHomeHeader';
import RecruiterHomeFooter from '../RecruiterHomeFooter';
import AdminSidebar from './AdminSidebar';

const UploadCandidates = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:5000/api/admin/upload-candidates', {
        method: 'POST',
        headers: {
          // Do not set 'Content-Type' when using FormData
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Candidates uploaded successfully.');
        setError('');
      } else {
        setError(data.error || data.message || 'Upload failed.');
      }
    } catch (err) {
      setError('Error uploading file.');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="uc-upload-candidates">
      <RecruiterHomeHeader />
      <div className="uc-layout">
        <AdminSidebar />
        <div className="uc-content">
          <div className="uc-container">
            <button className="uc-back-button" onClick={handleBack}>← Back</button>
            <h2 className="uc-title">Upload Candidates</h2>
            <form onSubmit={handleSubmit} className="uc-form">
              <input 
                type="file" 
                accept=".csv, .xlsx, .xls, .txt" 
                onChange={handleFileChange} 
                required 
              />
              <button type="submit">Upload</button>
              {error && <div className="uc-error">{error}</div>}
              {message && <div className="uc-message">{message}</div>}
            </form>
          </div>
        </div>
      </div>
      <RecruiterHomeFooter />
    </div>
  );
};

export default UploadCandidates;
